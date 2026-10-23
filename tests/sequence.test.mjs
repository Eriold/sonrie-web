import assert from 'node:assert/strict';
import { test } from 'node:test';
import { tourSegments } from '../src/data/tour.ts';
import { createTourTimeline, resolveTourPosition } from '../src/scripts/timeline.ts';

test('cinco videos; foto 5 tras el cuarto y foto 6 al terminar el quinto', () => {
  const timeline = createTourTimeline(tourSegments);
  assert.deepEqual(timeline.segments.map((segment) => segment.clipAsset), [
    'Parte_1.mp4', 'Parte_2.mp4', 'Parte_3.mp4', 'Parte_4.mp4', 'Parte_5.mp4',
  ]);
  assert.deepEqual(timeline.segments.map((segment) => segment.stopPhotoAsset), [
    'Parte_1.webp', 'Parte_2.webp', 'Parte_3.webp', 'Parte_5.webp', 'Parte_6.webp',
  ]);
  for (const [index, segment] of timeline.segments.entries()) {
    if (index >= 3) {
      assert.equal(segment.stopPlacement, 'after');
      assert.equal(segment.videoStart, timeline.segments[index - 1].end);
      assert.equal(segment.stopStart, segment.videoStart + segment.videoUnits);
      assert.equal(resolveTourPosition(timeline, segment.videoStart).phase, 'video');
      assert.equal(resolveTourPosition(timeline, segment.stopStart).activeStopId, `parada-${index + 2}`);
      continue;
    }
    assert.equal(segment.stopStart, index === 0 ? 0 : timeline.segments[index - 1].end);
    assert.equal(segment.videoStart, segment.stopStart + segment.stopUnits);
    assert.equal(resolveTourPosition(timeline, segment.stopStart).activeStopId, `parada-${index + 1}`);
    assert.equal(resolveTourPosition(timeline, segment.stopStart).videoTimeSeconds, 0);
    assert.equal(resolveTourPosition(timeline, segment.videoStart).phase, 'video');
  }
  assert.equal(resolveTourPosition(timeline, timeline.totalUnits).phase, 'stop');
  assert.equal(resolveTourPosition(timeline, timeline.totalUnits).activeStopId, 'parada-6');
  assert.equal(resolveTourPosition(timeline, timeline.totalUnits).stopProgress, 1);
  const first = resolveTourPosition(timeline, timeline.segments[0].stopStart);
  resolveTourPosition(timeline, timeline.totalUnits);
  assert.deepEqual(resolveTourPosition(timeline, 0), first);
});
