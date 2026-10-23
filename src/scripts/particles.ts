import { particleScenes, type ParticleConfig } from '../data/particles';

type Particle = {
  x: number;
  y: number;
  drift: number;
  phase: number;
  age: number;
  lifetime: number;
  color: string;
};

type NetworkInformation = EventTarget & { saveData?: boolean };

export function initParticles(canvas: HTMLCanvasElement): { setStop: (stopId: string | null) => void } {
  const context = canvas.getContext('2d');
  if (!context) return { setStop: () => {} };

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const lowPower = (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4)
    || (memory !== undefined && memory <= 4);
  const frameInterval = lowPower ? 1000 / 20 : 1000 / 30;
  let width = 0;
  let height = 0;
  let inViewport = true;
  let activeStop = '';
  let activeConfig: ParticleConfig | null = null;
  let particles: Particle[] = [];
  let frameId = 0;
  let previousTime = 0;
  canvas.dataset.activeStop = '';
  canvas.dataset.running = 'false';
  canvas.dataset.quality = lowPower ? 'reduced' : 'normal';

  const resize = (): void => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const scale = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
  };

  const newParticle = (index: number, config: ParticleConfig, stagger: boolean): Particle => ({
    x: Math.random() * width,
    y: Math.random() * height,
    drift: 2 + index % 4,
    phase: Math.random() * Math.PI * 2,
    age: stagger ? Math.random() * config.lifetimeSeconds : 0,
    lifetime: config.lifetimeSeconds * (0.8 + Math.random() * 0.4),
    color: config.colors[index % config.colors.length],
  });

  const draw = (time: number): void => {
    if (!activeConfig) return;
    frameId = requestAnimationFrame(draw);
    if (previousTime && time - previousTime < frameInterval) return;
    const elapsed = previousTime ? Math.min((time - previousTime) / 1000, 0.08) : 0;
    previousTime = time;
    context.clearRect(0, 0, width, height);
    particles.forEach((particle, index) => {
      particle.age += elapsed;
      if (particle.age >= particle.lifetime) particles[index] = newParticle(index, activeConfig!, false);
      const current = particles[index];
      current.y -= activeConfig!.speed * elapsed;
      const progress = current.age / current.lifetime;
      const glow = Math.sin(Math.PI * progress);
      const x = current.x + Math.sin(time / 2000 + current.phase) * current.drift;
      const radius = activeConfig!.size * (0.8 + progress * 0.3);
      const gradient = context.createRadialGradient(x, current.y, 0, x, current.y, radius);
      gradient.addColorStop(0, current.color);
      gradient.addColorStop(1, `${current.color}00`);
      context.globalAlpha = glow * 0.28;
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, current.y, radius, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = glow * 0.42;
      context.fillStyle = current.color;
      context.beginPath();
      context.arc(x, current.y, radius * 0.19, 0, Math.PI * 2);
      context.fill();
    });
    context.globalAlpha = 1;
  };

  const stop = (): void => {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    previousTime = 0;
    context.clearRect(0, 0, width, height);
    canvas.dataset.running = 'false';
  };

  const updateRunning = (): void => {
    const allowed = !!activeConfig && inViewport && !document.hidden
      && !motionPreference.matches && !connection?.saveData;
    if (!allowed) {
      stop();
      return;
    }
    if (frameId) return;
    resize();
    frameId = requestAnimationFrame(draw);
    canvas.dataset.running = 'true';
  };

  const setStop = (stopId: string | null): void => {
    const scene = particleScenes.find((entry) => entry.stopId === stopId);
    const nextStop = scene?.config.enabled ? scene.stopId : '';
    if (nextStop === activeStop) return;
    stop();
    activeStop = nextStop;
    activeConfig = nextStop ? scene!.config : null;
    canvas.dataset.activeStop = nextStop;
    canvas.dataset.particleType = activeConfig?.type ?? '';
    canvas.dataset.particleCount = String(activeConfig ? Math.min(activeConfig.density, lowPower ? 6 : 16) : 0);
    if (activeConfig) {
      resize();
      particles = Array.from({ length: Number(canvas.dataset.particleCount) }, (_, index) => newParticle(index, activeConfig!, true));
    } else particles = [];
    updateRunning();
  };

  window.addEventListener('resize', () => { if (activeConfig && frameId) resize(); });
  document.addEventListener('visibilitychange', updateRunning);
  motionPreference.addEventListener('change', updateRunning);
  connection?.addEventListener?.('change', updateRunning);
  const observer = new IntersectionObserver((entries) => {
    inViewport = entries.some((entry) => entry.isIntersecting);
    updateRunning();
  });
  observer.observe(canvas);
  return { setStop };
}
