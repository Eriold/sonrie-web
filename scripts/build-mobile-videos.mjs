import { execFileSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpeg from '@ffmpeg-installer/ffmpeg';

const root = fileURLToPath(new URL('../', import.meta.url));
const outputDir = join(root, 'src/media/mobile');
await mkdir(outputDir, { recursive: true });

for (let number = 1; number <= 5; number += 1) {
  const input = join(root, `assets/Parte_${number}.mp4`);
  for (const variant of [
    { name: 'portrait', filter: 'crop=498:1080:(iw-498)/2:0,scale=480:1040:flags=lanczos,setsar=1' },
    { name: 'landscape', filter: 'scale=1280:720:flags=lanczos,setsar=1' },
  ]) {
    const output = join(outputDir, `Parte_${number}-mobile-${variant.name}.mp4`);
    execFileSync(ffmpeg.path, [
      '-hide_banner', '-loglevel', 'error', '-i', input,
      '-vf', variant.filter, '-an', '-c:v', 'libx264', '-preset', 'medium',
      '-crf', '23', '-g', '12', '-keyint_min', '12', '-sc_threshold', '0',
      '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-y', output,
    ], { stdio: 'inherit' });
    console.log(`Generado ${output}`);
  }
}
