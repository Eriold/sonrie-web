import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { resolveStopCharacter, stopCharacters } from '../data/characters';
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
  const characters = [...world.querySelectorAll<HTMLImageElement>('[data-character]')];
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
  let currentStopId: string | null = null;
  let currentStopProgress = 0;
  const loaded = new Set<number>();
  const failed = new Set<number>();
  const targetTimes = videos.map(() => 0);
  const selectedModes = timeline.segments.map((segment) => segment.stopMediaMode);
  const allImages = [...posters, ...photos];
  const preparedImages = new WeakSet<HTMLImageElement>();
  const preparingImages = new WeakSet<HTMLImageElement>();
  const preparedCharacters = new WeakSet<HTMLImageElement>();
  const preparingCharacters = new WeakSet<HTMLImageElement>();
  let visibleLayer: HTMLVideoElement | HTMLImageElement | undefined;
  let transitionTimer: ReturnType<typeof setTimeout> | undefined;

  const updateCharacter = (): void => {
    const selected = currentPhase === 'stop' && stage.dataset.visual === 'high-res-image'
      ? resolveStopCharacter(currentStopId, currentStopProgress) : null;
    characters.forEach((image) => {
      image.classList.toggle('is-visible', image.dataset.stopId === currentStopId
        && image.dataset.asset === selected?.imageAsset && preparedCharacters.has(image));
    });
  };

  const prepareCharacter = (stopId: string | null): void => {
    const image = characters.find((entry) => entry.dataset.stopId === stopId);
    if (!image || preparedCharacters.has(image) || preparingCharacters.has(image)) return;
    preparingCharacters.add(image);
    image.src = image.dataset.src ?? '';
    image.decode().then(() => {
      preparedCharacters.add(image);
      updateCharacter();
    }).catch(() => updateCharacter());
  };

  const activateLayer = (next: HTMLVideoElement | HTMLImageElement, visual: string): void => {
    if (visibleLayer === next) {
      stage.dataset.visual = visual;
      return;
    }
    if (transitionTimer) clearTimeout(transitionTimer);
    const previous = visibleLayer;
    [...videos, ...allImages].forEach((layer) => {
      if (layer !== previous && layer !== next) {
        layer.classList.remove('is-active', 'is-outgoing');
        layer.style.zIndex = '';
      }
    });
    if (previous) {
      previous.style.zIndex = '0';
      previous.classList.remove('is-active');
      previous.classList.add('is-outgoing');
    }
    next.style.zIndex = '1';
    next.classList.remove('is-outgoing');
    next.classList.add('is-active');
    visibleLayer = next;
    stage.dataset.visual = visual;
    if (previous) transitionTimer = setTimeout(() => {
      previous.classList.remove('is-outgoing');
      previous.style.zIndex = '';
      transitionTimer = undefined;
    }, 200);
  };

  const updateVisual = (): void => {
    const mode = currentPhase === 'stop' ? selectedModes[activeIndex] : 'video-freeze';
    const preferred = mode === 'poster-image' ? posters.find((poster) => poster.dataset.index === String(activeIndex))
      : mode === 'high-res-image' ? photos.find((photo) => photo.dataset.index === String(activeIndex))
        : undefined;
    if (preferred && preparedImages.has(preferred)) {
      activateLayer(preferred, mode);
      return;
    }
    if (mode === 'video-freeze' && shownIndex === activeIndex) {
      activateLayer(videos[activeIndex], 'video');
      return;
    }
    if (currentPhase === 'stop') {
      const poster = posters.find((image) => image.dataset.index === String(activeIndex));
      if (poster && preparedImages.has(poster)) {
        activateLayer(poster, 'poster-image');
        return;
      }
    }
    if (shownIndex === activeIndex) activateLayer(videos[activeIndex], 'video');
    else if (!visibleLayer) stage.dataset.visual = 'fallback';
  };

  const prepareImage = (image: HTMLImageElement | undefined): void => {
    if (!image || preparedImages.has(image) || preparingImages.has(image)) return;
    preparingImages.add(image);
    image.loading = 'eager';
    image.decode().then(() => {
      preparedImages.add(image);
      updateVisual();
      updateCharacter();
    }).catch(() => updateVisual());
  };

  const targetTime = (index: number): number => {
    const duration = Number.isFinite(videos[index].duration) ? videos[index].duration : timeline.segments[index].durationSeconds;
    return Math.min(targetTimes[index], Math.max(0, duration - 1 / 24));
  };

  const showIfReady = (index: number): void => {
    const video = videos[index];
    if (index !== activeIndex || video.readyState < 2 || video.seeking || Math.abs(video.currentTime - targetTime(index)) > 0.025) return;
    shownIndex = index;
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
    video.src = video.dataset.src ?? '';
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
        shownIndex = -1;
        updateVisual();
        status.textContent = 'Video no disponible. Puedes saltar el recorrido.';
      }
    });
  });

  const render = (progress: number): void => {
    const state = resolveTourPosition(timeline, progress * timeline.totalUnits);
    if (activeIndex !== state.segmentIndex) shownIndex = -1;
    activeIndex = state.segmentIndex;
    currentPhase = state.phase;
    currentStopId = state.activeStopId;
    currentStopProgress = state.stopProgress;
    const video = videos[activeIndex];
    targetTimes[activeIndex] = state.videoTimeSeconds;
    video.pause();
    load(activeIndex);
    if (activeIndex > 0 && state.videoProgress < 0.5) load(activeIndex - 1);
    if (activeIndex + 1 < videos.length && state.videoProgress > 0.5) load(activeIndex + 1);
    for (const index of [activeIndex - 1, activeIndex, activeIndex + 1]) {
      if (index < 0 || index >= videos.length) continue;
      prepareImage(photos.find((image) => image.dataset.index === String(index)));
      prepareImage(posters.find((image) => image.dataset.index === String(index)));
    }
    const characterAssignment = stopCharacters.find((entry) => entry.stopId === state.activeStopId);
    if (state.phase === 'stop' && characterAssignment && state.stopProgress >= characterAssignment.revealAfterProgress / 2) {
      prepareCharacter(state.activeStopId);
    }
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
    } else status.textContent = 'Video no disponible. Puedes saltar el recorrido.';
    updateVisual();
    updateCharacter();
    if (debug) debug.textContent = `Tramo ${activeIndex + 1}/${videos.length} · ${state.phase} ${(state.stopProgress * 100).toFixed(0)}% · scroll ${(progress * 100).toFixed(1)}% · video ${state.videoTimeSeconds.toFixed(2)} s · ${stage.dataset.visual}`;
  };

  modeSelect?.addEventListener('change', () => {
    selectedModes[activeIndex] = modeSelect.value as StopMediaMode;
    updateVisual();
    updateCharacter();
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
