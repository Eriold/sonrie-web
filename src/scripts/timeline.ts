import type { TourSegment } from '../data/tour';

export type TourPhase = 'video' | 'stop';

export type TimelineSegment = TourSegment & Readonly<{
  videoStart: number;
  stopStart: number;
  end: number;
}>;

export type TourTimeline = Readonly<{
  segments: readonly TimelineSegment[];
  totalUnits: number;
}>;

export type TourPosition = Readonly<{
  segmentIndex: number;
  segmentId: string;
  phase: TourPhase;
  videoProgress: number;
  stopProgress: number;
  videoTimeSeconds: number;
  activeVideoAsset: string;
  activeStopId: string | null;
}>;

export function createTourTimeline(segments: readonly TourSegment[]): TourTimeline {
  if (segments.length === 0) throw new Error('Se requiere al menos un segmento.');

  const ids = new Set<string>();
  const stopIds = new Set<string>();
  const timelineSegments: TimelineSegment[] = [];
  let cursor = 0;

  for (const segment of segments) {
    if (!segment.id || !segment.clipAsset) {
      throw new Error('Cada segmento requiere id y clipAsset.');
    }
    const withoutStop = segment.stopPlacement === 'none';
    if (ids.has(segment.id) || (segment.stopId !== null && stopIds.has(segment.stopId))) {
      throw new Error(`ID duplicado en el segmento ${segment.id}.`);
    }
    if (!['video-freeze', 'poster-image', 'high-res-image'].includes(segment.stopMediaMode)) {
      throw new Error(`stopMediaMode inválido en ${segment.id}.`);
    }
    if (segment.stopPlacement && !['before', 'after', 'none'].includes(segment.stopPlacement)) {
      throw new Error(`stopPlacement inválido en ${segment.id}.`);
    }
    if (!withoutStop && segment.stopMediaMode === 'high-res-image' && !segment.stopPhotoAsset) {
      throw new Error(`stopPhotoAsset requerido en ${segment.id}.`);
    }
    if (withoutStop ? segment.stopUnits !== 0 || segment.stopId !== null || segment.stopPhotoAsset !== null : !segment.stopId || !Number.isFinite(segment.stopUnits) || segment.stopUnits <= 0) {
      throw new Error(`Configuración de parada inválida en ${segment.id}.`);
    }
    for (const field of ['durationSeconds', 'videoUnits'] as const) {
      if (!Number.isFinite(segment[field]) || segment[field] <= 0) {
        throw new Error(`${field} debe ser un número finito y positivo en ${segment.id}.`);
      }
    }
    ids.add(segment.id);
    if (segment.stopId !== null) stopIds.add(segment.stopId);
    const before = segment.stopPlacement === 'before';
    const stopStart = before ? cursor : cursor + segment.videoUnits;
    const videoStart = before ? cursor + segment.stopUnits : cursor;
    const end = cursor + segment.videoUnits + segment.stopUnits;
    timelineSegments.push({ ...segment, videoStart, stopStart, end });
    cursor = end;
  }

  return { segments: timelineSegments, totalUnits: cursor };
}

export function resolveTourPosition(timeline: TourTimeline, position: number): TourPosition {
  const bounded = Number.isNaN(position) ? 0 : Math.max(0, Math.min(position, timeline.totalUnits));
  const lastIndex = timeline.segments.length - 1;
  const segmentIndex = timeline.segments.findIndex((segment, index) => bounded < segment.end || index === lastIndex);
  const segment = timeline.segments[segmentIndex];
  const before = segment.stopPlacement === 'before';
  const phase: TourPhase = segment.stopPlacement === 'none' ? 'video' : before
    ? bounded < segment.videoStart ? 'stop' : 'video'
    : bounded < segment.stopStart ? 'video' : 'stop';
  const videoProgress = phase === 'video' ? (bounded - segment.videoStart) / segment.videoUnits : before ? 0 : 1;
  const stopProgress = phase === 'stop' ? (bounded - segment.stopStart) / segment.stopUnits : 0;

  return {
    segmentIndex,
    segmentId: segment.id,
    phase,
    videoProgress,
    stopProgress,
    videoTimeSeconds: videoProgress * segment.durationSeconds,
    activeVideoAsset: segment.clipAsset,
    activeStopId: phase === 'stop' ? segment.stopId : null,
  };
}
