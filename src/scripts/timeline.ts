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
    if (!segment.id || !segment.stopId || !segment.clipAsset) {
      throw new Error('Cada segmento requiere id, stopId y clipAsset.');
    }
    if (ids.has(segment.id) || stopIds.has(segment.stopId)) {
      throw new Error(`ID duplicado en el segmento ${segment.id}.`);
    }
    for (const field of ['durationSeconds', 'videoUnits', 'stopUnits'] as const) {
      if (!Number.isFinite(segment[field]) || segment[field] <= 0) {
        throw new Error(`${field} debe ser un número finito y positivo en ${segment.id}.`);
      }
    }
    ids.add(segment.id);
    stopIds.add(segment.stopId);
    const videoStart = cursor;
    const stopStart = videoStart + segment.videoUnits;
    const end = stopStart + segment.stopUnits;
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
  const phase: TourPhase = bounded < segment.stopStart ? 'video' : 'stop';
  const videoProgress = phase === 'video' ? (bounded - segment.videoStart) / segment.videoUnits : 1;
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
