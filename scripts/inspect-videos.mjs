import { execFileSync } from 'node:child_process';
import { open, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffprobe from '@ffprobe-installer/ffprobe';

const assetsDir = new URL('../assets/', import.meta.url);
const files = (await readdir(assetsDir)).filter((name) => /^Parte_[1-5]\.mp4$/.test(name)).sort();

if (files.length !== 5) {
  throw new Error(`Se esperaban 5 videos Parte_N.mp4; encontrados: ${files.length}`);
}

function probe(file, ...args) {
  return JSON.parse(execFileSync(ffprobe.path, ['-v', 'error', ...args, '-of', 'json', file], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  }));
}

async function atomOrder(file) {
  const handle = await open(file, 'r');
  try {
    const { size } = await handle.stat();
    const atoms = [];
    let offset = 0;
    while (offset + 8 <= size) {
      const header = Buffer.alloc(16);
      await handle.read(header, 0, 8, offset);
      let atomSize = header.readUInt32BE(0);
      const type = header.toString('ascii', 4, 8);
      if (atomSize === 1) {
        await handle.read(header, 8, 8, offset + 8);
        atomSize = Number(header.readBigUInt64BE(8));
      } else if (atomSize === 0) {
        atomSize = size - offset;
      }
      if (atomSize < 8 || offset + atomSize > size) throw new Error(`Átomo MP4 inválido: ${file}, ${type}`);
      atoms.push({ type, offset });
      offset += atomSize;
    }
    return atoms;
  } finally {
    await handle.close();
  }
}

const results = [];
for (const name of files) {
  const file = join(fileURLToPath(assetsDir), name);
  const { streams, format } = probe(file, '-show_streams', '-show_format');
  const video = streams.find((stream) => stream.codec_type === 'video');
  if (!video) throw new Error(`Sin pista de video: ${name}`);
  const { frames = [] } = probe(file, '-select_streams', 'v:0', '-show_frames', '-show_entries', 'frame=key_frame,pict_type,best_effort_timestamp_time');
  const keyframeIndices = frames.flatMap((frame, index) => frame.key_frame === 1 ? [index] : []);
  const keyframeGaps = keyframeIndices.slice(1).map((index, i) => index - keyframeIndices[i]);
  const audio = streams.filter((stream) => stream.codec_type === 'audio');
  const atoms = await atomOrder(file);
  const moov = atoms.find((atom) => atom.type === 'moov');
  const mdat = atoms.find((atom) => atom.type === 'mdat');
  results.push({
    name,
    durationSeconds: Number(format.duration),
    codec: video.codec_name,
    profile: video.profile,
    width: video.width,
    height: video.height,
    frameRate: video.avg_frame_rate,
    pixelFormat: video.pix_fmt,
    frameCount: frames.length,
    keyframes: keyframeIndices.length,
    keyframeIndices,
    keyframeGapFrames: keyframeGaps.length ? { min: Math.min(...keyframeGaps), max: Math.max(...keyframeGaps) } : null,
    color: { range: video.color_range ?? null, space: video.color_space ?? null, transfer: video.color_transfer ?? null, primaries: video.color_primaries ?? null },
    audio: audio.map((stream) => ({ codec: stream.codec_name, channels: stream.channels, sampleRate: stream.sample_rate, bitRate: stream.bit_rate ?? null })),
    atomOrder: atoms.map((atom) => atom.type),
    faststart: Boolean(moov && mdat && moov.offset < mdat.offset),
  });
}

console.log(JSON.stringify(results, null, 2));
