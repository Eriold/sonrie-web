export type ParticleConfig = Readonly<{
  enabled: boolean;
  type: 'glow-circle';
  density: number;
  speed: number;
  size: number;
  lifetimeSeconds: number;
  colors: readonly string[];
}>;

export type ParticleScene = Readonly<{ stopId: string; config: ParticleConfig }>;

// Una sola escena reciclada en cada fotografía, con luz tenue para conservar el fondo.
export const glowCircleConfig: ParticleConfig = {
  enabled: true,
  type: 'glow-circle',
  density: 11,
  speed: 6,
  size: 12,
  lifetimeSeconds: 4.8,
  colors: ['#e4f7ec', '#d6f1ee', '#f5f4df', '#e7f3fa'],
};

export const particleScenes: readonly ParticleScene[] = [
  'parada-1', 'parada-2', 'parada-3', 'parada-5', 'parada-6',
].map((stopId) => ({ stopId, config: glowCircleConfig }));
