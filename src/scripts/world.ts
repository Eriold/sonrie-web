import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { tourSegments, type StopMediaMode } from '../data/tour';
import { createTourTimeline, resolveTourPosition } from './timeline';

const timeline = createTourTimeline(tourSegments);

export function initWorld(world: HTMLElement, staticMode: boolean, scrollTo?: (position: number) => void): void {
  const stage = world.querySelector<HTMLElement>('[data-stage]');
  const status = world.querySelector<HTMLElement>('[data-status]');
  const counter = world.querySelector<HTMLElement>('[data-counter]');
  const debug = world.querySelector<HTMLOutputElement>('[data-debug]');
  const modePicker = world.querySelector<HTMLElement>('[data-mode-picker]');
  const modeSelect = world.querySelector<HTMLSelectElement>('[data-mode-select]');
  const stopButtons = [...world.querySelectorAll<HTMLButtonElement>('[data-goto-stop]')];
  const stops = [...world.querySelectorAll<HTMLElement>('[data-stop]')];
  const videos = [...world.querySelectorAll<HTMLVideoElement>('[data-clip]')];
  const posters = [...world.querySelectorAll<HTMLImageElement>('[data-poster]')];
  const photos = [...world.querySelectorAll<HTMLImageElement>('[data-photo]')];
  if (!stage || !status || !counter || videos.length !== timeline.segments.length || stops.length !== timeline.segments.filter((segment) => segment.stopUnits > 0).length) return;

  if (staticMode) {
    world.dataset.motion = 'off';
    status.textContent = 'El recorrido visual está desactivado. Puedes continuar al contenido.';
    if (debug) debug.textContent = 'Movimiento desactivado';
    return;
  }

  let activeIndex = 0;
  let shownIndex = -1;
  let currentPhase: 'video' | 'stop' = 'video';
  const loaded = new Set<number>();
  const failed = new Set<number>();
  const targetTimes = videos.map(() => 0);
  const selectedModes = timeline.segments.map((segment) => segment.stopMediaMode);
  const allImages = [...posters, ...photos];

  const updateVisual = (): void => {
    const mode = currentPhase === 'stop' ? selectedModes[activeIndex] : 'video-freeze';
    const candidate = mode === 'poster-image' ? posters.find((poster) => poster.dataset.index === String(activeIndex))
      : mode === 'high-res-image' ? photos.find((photo) => photo.dataset.index === String(activeIndex))
        : undefined;
    const imageReady = candidate?.complete && candidate.naturalWidth > 0;
    allImages.forEach((image) => image.classList.toggle('is-active', image === candidate && Boolean(imageReady)));
    stage.dataset.visual = imageReady ? mode : shownIndex === activeIndex ? 'video' : 'fallback';
  };

  allImages.forEach((image) => {
    image.addEventListener('load', updateVisual);
    image.addEventListener('error', updateVisual);
  });

  const targetTime = (index: number): number => {
    const duration = Number.isFinite(videos[index].duration) ? videos[index].duration : timeline.segments[index].durationSeconds;
    return Math.min(targetTimes[index], Math.max(0, duration - 1 / 24));
  };

  const showIfReady = (index: number): void => {
    const video = videos[index];
    if (index !== activeIndex || video.readyState < 2 || video.seeking || Math.abs(video.currentTime - targetTime(index)) > 0.025) return;
    shownIndex = index;
    videos.forEach((clip, clipIndex) => clip.classList.toggle('is-active', clipIndex === index));
    updateVisual();
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
        updateVisual();
        status.textContent = 'Video no disponible. Puedes saltar el recorrido.';
      }
    });
  });

  const render = (progress: number): void => {
    const state = resolveTourPosition(timeline, progress * timeline.totalUnits);
    if (activeIndex !== state.segmentIndex) {
      videos.forEach((clip) => clip.classList.remove('is-active'));
      shownIndex = -1;
    }
    activeIndex = state.segmentIndex;
    currentPhase = state.phase;
    const video = videos[activeIndex];
    targetTimes[activeIndex] = state.videoTimeSeconds;
    video.pause();
    load(activeIndex);
    seek(activeIndex);
    counter.textContent = String(activeIndex + 1).padStart(2, '0');
    stopButtons.forEach((button) => {
      if (Number(button.dataset.gotoStop) === activeIndex) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    stops.forEach((stop) => {
      stop.hidden = state.phase !== 'stop' || Number(stop.dataset.index) !== activeIndex;
    });
    if (modePicker && modeSelect) {
      modePicker.hidden = state.phase !== 'stop';
      modeSelect.value = selectedModes[activeIndex];
      const photoOption = modeSelect.querySelector<HTMLOptionElement>('option[value="high-res-image"]');
      const posterOption = modeSelect.querySelector<HTMLOptionElement>('option[value="poster-image"]');
      if (posterOption) posterOption.disabled = timeline.segments[activeIndex].stopPhotoAsset === null;
      if (photoOption) photoOption.disabled = timeline.segments[activeIndex].stopPhotoAsset === null;
    }
    stage.dataset.phase = state.phase;
    stage.dataset.segmentIndex = String(activeIndex);
    stage.dataset.videoProgress = state.videoProgress.toFixed(4);
    stage.dataset.videoTime = state.videoTimeSeconds.toFixed(3);
    stage.dataset.stopProgress = state.stopProgress.toFixed(4);
    if (state.activeStopId) stage.dataset.stopId = state.activeStopId;
    else delete stage.dataset.stopId;
    if (!failed.has(activeIndex)) {
      status.textContent = state.phase === 'stop'
        ? `Parada ${stopButtons.findIndex((button) => Number(button.dataset.gotoStop) === activeIndex) + 1} de ${stopButtons.length}. Contenido en preparación.`
        : `Tramo ${activeIndex + 1} de ${videos.length}. Desplázate para avanzar o retroceder.`;
    }
    updateVisual();
    if (debug) debug.textContent = `Tramo ${activeIndex + 1}/${videos.length} · ${state.phase} ${(state.stopProgress * 100).toFixed(0)}% · scroll ${(progress * 100).toFixed(1)}% · video ${state.videoTimeSeconds.toFixed(2)} s · ${stage.dataset.visual}`;
  };

  modeSelect?.addEventListener('change', () => {
    selectedModes[activeIndex] = modeSelect.value as StopMediaMode;
    updateVisual();
  });

  const trigger = ScrollTrigger.create({
    trigger: world,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => render(self.progress),
    onRefresh: (self) => render(self.progress),
  });
  stopButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.gotoStop);
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
