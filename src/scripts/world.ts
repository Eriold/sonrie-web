import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { tourSegments } from '../data/tour';
import { createTourTimeline, resolveTourPosition } from './timeline';

const timeline = createTourTimeline(tourSegments);

export function initWorld(world: HTMLElement, staticMode: boolean, scrollTo?: (position: number) => void): void {
  const stage = world.querySelector<HTMLElement>('[data-stage]');
  const status = world.querySelector<HTMLElement>('[data-status]');
  const counter = world.querySelector<HTMLElement>('[data-counter]');
  const debug = world.querySelector<HTMLOutputElement>('[data-debug]');
  const stopButtons = [...world.querySelectorAll<HTMLButtonElement>('[data-goto-stop]')];
  const videos = [...world.querySelectorAll<HTMLVideoElement>('[data-clip]')];
  if (!stage || !status || !counter || videos.length !== timeline.segments.length) return;

  if (staticMode) {
    world.dataset.motion = 'off';
    status.textContent = 'El recorrido visual está desactivado. Puedes continuar al contenido.';
    if (debug) debug.textContent = 'Movimiento desactivado';
    return;
  }

  let activeIndex = 0;
  let shownIndex = -1;
  const loaded = new Set<number>();
  const failed = new Set<number>();
  const targetTimes = videos.map(() => 0);

  const targetTime = (index: number): number => {
    const duration = Number.isFinite(videos[index].duration) ? videos[index].duration : timeline.segments[index].durationSeconds;
    return Math.min(targetTimes[index], Math.max(0, duration - 1 / 24));
  };

  const showIfReady = (index: number): void => {
    const video = videos[index];
    if (index !== activeIndex || video.readyState < 2 || video.seeking || Math.abs(video.currentTime - targetTime(index)) > 0.025) return;
    shownIndex = index;
    videos.forEach((clip, clipIndex) => clip.classList.toggle('is-active', clipIndex === index));
    stage.dataset.visual = 'video';
  };

  const seek = (index: number): void => {
    const video = videos[index];
    if (!loaded.has(index) || video.seeking || index !== activeIndex) return;
    const target = targetTime(index);
    if (Math.abs(video.currentTime - target) > 0.025) video.currentTime = target;
    else showIfReady(index);
  };

  const load = (index: number): void => {
    if (loaded.has(index) || failed.has(index)) return;
    loaded.add(index);
    const video = videos[index];
    video.muted = true;
    video.pause();
    video.preload = 'auto';
    video.load();
  };

  videos.forEach((video, index) => {
    video.addEventListener('loadedmetadata', () => seek(index));
    video.addEventListener('loadeddata', () => seek(index));
    video.addEventListener('seeked', () => {
      if (index !== activeIndex) return;
      if (Math.abs(video.currentTime - targetTime(index)) > 0.025) seek(index);
      else showIfReady(index);
    });
    video.addEventListener('error', () => {
      failed.add(index);
      if (index === activeIndex) {
        videos.forEach((clip) => clip.classList.remove('is-active'));
        shownIndex = -1;
        stage.dataset.visual = 'fallback';
        status.textContent = 'Video no disponible. Puedes saltar el recorrido.';
      }
    });
  });

  const render = (progress: number): void => {
    const state = resolveTourPosition(timeline, progress * timeline.totalUnits);
    if (activeIndex !== state.segmentIndex) {
      videos.forEach((clip) => clip.classList.remove('is-active'));
      shownIndex = -1;
      stage.dataset.visual = 'fallback';
    }
    activeIndex = state.segmentIndex;
    const video = videos[activeIndex];
    targetTimes[activeIndex] = state.videoTimeSeconds;
    video.pause();
    load(activeIndex);
    seek(activeIndex);
    if (state.phase === 'stop' && activeIndex + 1 < videos.length) load(activeIndex + 1);
    counter.textContent = String(activeIndex + 1).padStart(2, '0');
    stopButtons.forEach((button, index) => {
      if (index === activeIndex) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    stage.dataset.phase = state.phase;
    stage.dataset.segmentIndex = String(activeIndex);
    stage.dataset.videoProgress = state.videoProgress.toFixed(4);
    stage.dataset.videoTime = state.videoTimeSeconds.toFixed(3);
    if (!failed.has(activeIndex)) {
      status.textContent = state.phase === 'stop'
        ? `Parada ${activeIndex + 1} de ${videos.length}. Contenido en preparación.`
        : `Tramo ${activeIndex + 1} de ${videos.length}. Desplázate para avanzar o retroceder.`;
    }
    stage.dataset.visual = shownIndex === activeIndex ? 'video' : 'fallback';
    if (debug) debug.textContent = `Tramo ${activeIndex + 1}/${videos.length} · ${state.phase} · scroll ${(progress * 100).toFixed(1)}% · video ${state.videoTimeSeconds.toFixed(2)} s · ${stage.dataset.visual}`;
  };

  const trigger = ScrollTrigger.create({
    trigger: world,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => render(self.progress),
    onRefresh: (self) => render(self.progress),
  });
  stopButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const segment = timeline.segments[index];
      const unit = segment.stopStart + Math.min(0.02, segment.stopUnits / 10);
      const position = trigger.start + (unit / timeline.totalUnits) * (trigger.end - trigger.start);
      if (scrollTo) scrollTo(position);
      else window.scrollTo({ top: position, behavior: 'instant' });
      render(unit / timeline.totalUnits);
    });
  });
  render(trigger.progress);
}
