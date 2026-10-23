import { particleScenes, type ParticleConfig } from '../data/particles';

type Particle = {
  x: number;
  y: number;
  drift: number;
  phase: number;
  color: string;
};

export function initParticles(canvas: HTMLCanvasElement): { setStop: (stopId: string | null) => void } {
  const context = canvas.getContext('2d');
  if (!context) return { setStop: () => {} };

  let width = 0;
  let height = 0;
  let activeStop = '';
  let activeConfig: ParticleConfig | null = null;
  let particles: Particle[] = [];
  let frameId = 0;
  let previousTime = 0;
  canvas.dataset.activeStop = '';

  const resize = (): void => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
  };

  const draw = (time: number): void => {
    if (!activeConfig) return;
    const elapsed = Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;
    context.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      particle.y -= activeConfig!.speed * elapsed;
      if (particle.y < -activeConfig!.size * 2) particle.y = height + activeConfig!.size * 2;
      const x = particle.x + Math.sin(time / 1600 + particle.phase) * particle.drift;
      const alpha = 0.18 + (Math.sin(time / 900 + particle.phase) + 1) * 0.08;
      context.fillStyle = particle.color;
      context.strokeStyle = particle.color;
      context.globalAlpha = alpha;
      if (activeConfig!.type === 'soft-glow') {
        const radius = activeConfig!.size;
        const gradient = context.createRadialGradient(x, particle.y, 0, x, particle.y, radius);
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, `${particle.color}00`);
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(x, particle.y, radius, 0, Math.PI * 2);
        context.fill();
      } else if (activeConfig!.type === 'sparkle') {
        const radius = activeConfig!.size;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x - radius, particle.y);
        context.lineTo(x + radius, particle.y);
        context.moveTo(x, particle.y - radius);
        context.lineTo(x, particle.y + radius);
        context.stroke();
      } else {
        context.beginPath();
        context.arc(x, particle.y, activeConfig!.size, 0, Math.PI * 2);
        context.fill();
      }
    });
    context.globalAlpha = 1;
    frameId = requestAnimationFrame(draw);
  };

  const setStop = (stopId: string | null): void => {
    const scene = particleScenes.find((entry) => entry.stopId === stopId);
    const nextStop = scene?.config.enabled ? scene.stopId : '';
    if (nextStop === activeStop) return;
    cancelAnimationFrame(frameId);
    context.clearRect(0, 0, width, height);
    activeStop = nextStop;
    activeConfig = nextStop ? scene!.config : null;
    canvas.dataset.activeStop = nextStop;
    canvas.dataset.particleType = activeConfig?.type ?? '';
    canvas.dataset.particleCount = String(activeConfig?.density ?? 0);
    if (!activeConfig) return;
    resize();
    particles = Array.from({ length: activeConfig.density }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      drift: 3 + index % 5,
      phase: Math.random() * Math.PI * 2,
      color: activeConfig!.colors[index % activeConfig!.colors.length],
    }));
    previousTime = performance.now();
    frameId = requestAnimationFrame(draw);
  };

  window.addEventListener('resize', () => { if (activeConfig) resize(); });
  return { setStop };
}
