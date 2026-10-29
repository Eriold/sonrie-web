import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initWorld } from './world';

gsap.registerPlugin(ScrollTrigger);

export function initMotion(): void {
  const world = document.querySelector<HTMLElement>('[data-world]');
  if (!world) return;

  const tutorial = world.querySelector<HTMLElement>('[data-scroll-tutorial]');
  const tutorialSkip = world.querySelector<HTMLAnchorElement>('[data-tutorial-skip]');
  const tutorialKey = 'sonrie:scroll-tutorial:v1';
  let tutorialCount = 0;
  try {
    tutorialCount = Number(window.localStorage.getItem(tutorialKey) ?? 0);
    if (!Number.isFinite(tutorialCount) || tutorialCount < 0) tutorialCount = 0;
  } catch {
    // Storage may be unavailable; tutorial still works for this visit.
  }
  if (tutorial && tutorialCount < 3 && window.scrollY < 2) {
    tutorial.hidden = false;
    try { window.localStorage.setItem(tutorialKey, String(tutorialCount + 1)); } catch { /* Continue without persistence. */ }
    const dismiss = (): void => { tutorial.hidden = true; };
    window.addEventListener('scroll', dismiss, { once: true, passive: true });
    tutorialSkip?.addEventListener('click', dismiss, { once: true });
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ?? false;
  if (reduced) {
    initWorld(world, true);
    return;
  }

  const lenis = new Lenis({ autoRaf: false, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  initWorld(world, false, (position) => {
    lenis.scrollTo(position, { immediate: true });
    ScrollTrigger.update();
  }, saveData);
}
