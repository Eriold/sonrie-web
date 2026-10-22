export type StopMediaMode = 'video-freeze' | 'poster-image' | 'high-res-image';
export type StopPlacement = 'before' | 'after' | 'none';

export type TourSegment = Readonly<{
  id: string;
  clipAsset: string;
  durationSeconds: number;
  videoUnits: number;
  stopUnits: number;
  stopId: string | null;
  stopPlacement?: StopPlacement;
  stopMediaMode: StopMediaMode;
  stopPhotoAsset: string | null;
}>;

// Los nombres identifican archivos originales; la publicación se resolverá en F4-02.
// Las unidades son longitudes relativas de scroll, no píxeles ni duraciones de video.
export const tourSegments: readonly TourSegment[] = [
  { id: 'parte-1', clipAsset: 'Parte_1.mp4', durationSeconds: 3.375, videoUnits: 4, stopUnits: 1.5, stopId: 'parada-1', stopPlacement: 'before', stopMediaMode: 'high-res-image', stopPhotoAsset: 'Parte_1.webp' },
  { id: 'parte-2', clipAsset: 'Parte_2.mp4', durationSeconds: 18.125, videoUnits: 4, stopUnits: 1.5, stopId: 'parada-2', stopPlacement: 'before', stopMediaMode: 'high-res-image', stopPhotoAsset: 'Parte_2.webp' },
  { id: 'parte-3', clipAsset: 'Parte_3.mp4', durationSeconds: 6.666667, videoUnits: 4, stopUnits: 1.5, stopId: 'parada-3', stopPlacement: 'before', stopMediaMode: 'high-res-image', stopPhotoAsset: 'Parte_3.webp' },
  { id: 'parte-4', clipAsset: 'Parte_4.mp4', durationSeconds: 5.875, videoUnits: 4, stopUnits: 0, stopId: null, stopPlacement: 'none', stopMediaMode: 'video-freeze', stopPhotoAsset: null },
  { id: 'parte-5', clipAsset: 'Parte_5.mp4', durationSeconds: 7.541667, videoUnits: 4, stopUnits: 1.5, stopId: 'parada-5', stopPlacement: 'before', stopMediaMode: 'high-res-image', stopPhotoAsset: 'Parte_5.webp' },
];
