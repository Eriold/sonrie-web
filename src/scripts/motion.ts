import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initWorld } from './world';

gsap.registerPlugin(ScrollTrigger);

export function initMotion(): void {
  const world = document.querySelector<HTMLElement>('[data-world]');
  if (!world) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ?? false;
  if (reduced || saveData) {
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
  });
}
