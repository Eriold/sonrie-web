export type ParticleConfig = Readonly<{
  enabled: boolean;
  type: 'dust' | 'sparkle' | 'soft-glow';
  density: number;
  speed: number;
  size: number;
  colors: readonly string[];
}>;

export type ParticleScene = Readonly<{ stopId: string; config: ParticleConfig }>;

// Efectos de muestra: pequeños y opcionales para conservar la fotografía como protagonista.
export const particleScenes: readonly ParticleScene[] = [
  { stopId: 'parada-1', config: { enabled: true, type: 'dust', density: 12, speed: 9, size: 2.5, colors: ['#d9f4e9', '#ffffff'] } },
  { stopId: 'parada-2', config: { enabled: false, type: 'dust', density: 0, speed: 0, size: 2, colors: ['#ffffff'] } },
  { stopId: 'parada-3', config: { enabled: true, type: 'soft-glow', density: 7, speed: 5, size: 18, colors: ['#e7f8f0', '#b9ece8'] } },
  { stopId: 'parada-5', config: { enabled: true, type: 'sparkle', density: 8, speed: 8, size: 3, colors: ['#f8f6de', '#d9f4e9'] } },
  { stopId: 'parada-6', config: { enabled: true, type: 'dust', density: 10, speed: 7, size: 2.5, colors: ['#d5edf5', '#ffffff'] } },
];
