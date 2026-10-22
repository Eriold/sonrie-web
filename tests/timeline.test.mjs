import assert from 'node:assert/strict';
import { test } from 'node:test';
import { tourSegments } from '../src/data/tour.ts';
import { createTourTimeline, resolveTourPosition } from '../src/scripts/timeline.ts';

const sample = [
  { id: 'a', clipAsset: 'a.mp4', durationSeconds: 10, videoUnits: 4, stopUnits: 2, stopId: 'stop-a' },
  { id: 'b', clipAsset: 'b.mp4', durationSeconds: 6, videoUnits: 3, stopUnits: 1, stopId: 'stop-b' },
];

test('la configuración contiene cinco clips y cinco paradas sin asignar espacios', () => {
  assert.deepEqual(tourSegments.map((segment) => segment.clipAsset), [
    'Parte_1.mp4', 'Parte_2.mp4', 'Parte_3.mp4', 'Parte_4.mp4', 'Parte_5.mp4',
  ]);
  assert.equal(new Set(tourSegments.map((segment) => segment.stopId)).size, 5);
});

test('resuelve video, parada y fronteras con el segmento correcto', () => {
  const timeline = createTourTimeline(sample);
  assert.equal(timeline.totalUnits, 10);
  assert.deepEqual(resolveTourPosition(timeline, 0), {
    segmentIndex: 0, segmentId: 'a', phase: 'video', videoProgress: 0,
    stopProgress: 0, videoTimeSeconds: 0, activeVideoAsset: 'a.mp4', activeStopId: null,
  });
  assert.deepEqual(resolveTourPosition(timeline, 2), {
    segmentIndex: 0, segmentId: 'a', phase: 'video', videoProgress: 0.5,
    stopProgress: 0, videoTimeSeconds: 5, activeVideoAsset: 'a.mp4', activeStopId: null,
  });
  assert.deepEqual(resolveTourPosition(timeline, 4), {
    segmentIndex: 0, segmentId: 'a', phase: 'stop', videoProgress: 1,
    stopProgress: 0, videoTimeSeconds: 10, activeVideoAsset: 'a.mp4', activeStopId: 'stop-a',
  });
  assert.equal(resolveTourPosition(timeline, 5).stopProgress, 0.5);
  assert.deepEqual(resolveTourPosition(timeline, 6), {
    segmentIndex: 1, segmentId: 'b', phase: 'video', videoProgress: 0,
    stopProgress: 0, videoTimeSeconds: 0, activeVideoAsset: 'b.mp4', activeStopId: null,
  });
  assert.equal(resolveTourPosition(timeline, 7.5).videoTimeSeconds, 3);
  assert.deepEqual(resolveTourPosition(timeline, 10), {
    segmentIndex: 1, segmentId: 'b', phase: 'stop', videoProgress: 1,
    stopProgress: 1, videoTimeSeconds: 6, activeVideoAsset: 'b.mp4', activeStopId: 'stop-b',
  });
});

test('limita posiciones fuera de rango y mantiene el resultado al retroceder o saltar', () => {
  const timeline = createTourTimeline(sample);
  assert.deepEqual(resolveTourPosition(timeline, -5), resolveTourPosition(timeline, 0));
  assert.deepEqual(resolveTourPosition(timeline, Number.NaN), resolveTourPosition(timeline, 0));
  assert.deepEqual(resolveTourPosition(timeline, Number.POSITIVE_INFINITY), resolveTourPosition(timeline, 10));
  assert.deepEqual(resolveTourPosition(timeline, 20), resolveTourPosition(timeline, 10));
  const firstVisit = resolveTourPosition(timeline, 2);
  resolveTourPosition(timeline, 9);
  assert.deepEqual(resolveTourPosition(timeline, 2), firstVisit);
});

test('rechaza configuración vacía, duplicada o con longitudes inválidas', () => {
  assert.throws(() => createTourTimeline([]), /segmento/i);
  assert.throws(() => createTourTimeline([sample[0], sample[0]]), /duplicado/i);
  assert.throws(() => createTourTimeline([{ ...sample[0], videoUnits: 0 }]), /videoUnits/);
  assert.throws(() => createTourTimeline([{ ...sample[0], durationSeconds: Number.NaN }]), /durationSeconds/);
});
