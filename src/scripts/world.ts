import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { resolveStopCharacter, stopCharacters } from '../data/characters';
import { mobileTourSegments, tourSegments, type StopMediaMode } from '../data/tour';
import { createTourTimeline, resolveTourPosition } from './timeline';
import { initParticles } from './particles';

export function initWorld(world: HTMLElement, staticMode: boolean, scrollTo?: (position: number) => void): void {
  const mobileView = window.matchMedia('(max-width: 640px), (pointer: coarse)');
  const portraitView = window.matchMedia('(orientation: portrait)');
  let timeline = createTourTimeline(mobileView.matches ? mobileTourSegments : tourSegments);
  const stage = world.querySelector<HTMLElement>('[data-stage]');
  const status = world.querySelector<HTMLElement>('[data-status]');
  const counter = world.querySelector<HTMLElement>('[data-counter]');
  const debug = world.querySelector<HTMLOutputElement>('[data-debug]');
  const modePicker = world.querySelector<HTMLElement>('[data-mode-picker]');
  const modeSelect = world.querySelector<HTMLSelectElement>('[data-mode-select]');
  const timelineRail = world.querySelector<HTMLElement>('[data-timeline-rail]');
  const timelineSlider = world.querySelector<HTMLElement>('[data-timeline-slider]');
  const stopButtons = [...world.querySelectorAll<HTMLButtonElement>('[data-goto-stop]')];
  const stops = [...world.querySelectorAll<HTMLElement>('[data-stop]')];
  const videos = [...world.querySelectorAll<HTMLVideoElement>('[data-clip]')];
  const posters = [...world.querySelectorAll<HTMLImageElement>('[data-poster]')];
  const photos = [...world.querySelectorAll<HTMLImageElement>('[data-photo]')];
  const characters = [...world.querySelectorAll<HTMLImageElement>('[data-character]')];
  const dialogueElements = [...world.querySelectorAll<HTMLElement>('[data-dialogue]')];
  const particleCanvas = world.querySelector<HTMLCanvasElement>('[data-particles]');
  if (!stage || !status || !counter || videos.length !== timeline.segments.length || stops.length !== timeline.segments.filter((segment) => segment.stopUnits > 0).length) return;

  if (staticMode) {
    world.dataset.motion = 'off';
    status.textContent = 'El recorrido visual está desactivado. Puedes continuar al contenido.';
    if (debug) debug.textContent = 'Movimiento desactivado';
    return;
  }

  const particles = particleCanvas ? initParticles(particleCanvas) : null;

  let activeIndex = 0;
  let shownIndex = -1;
  let currentPhase: 'video' | 'stop' = 'video';
  let currentStopId: string | null = null;
  let currentStopProgress = 0;
  let lastProgress = 0;
  const loaded = new Set<number>();
  const failed = new Set<number>();
  const targetTimes = videos.map(() => 0);
  const selectedModes = timeline.segments.map((segment) => segment.stopMediaMode);
  const allImages = [...posters, ...photos];
  const preparedImages = new WeakSet<HTMLImageElement>();
  const preparingImages = new WeakSet<HTMLImageElement>();
  const preparedCharacters = new WeakSet<HTMLImageElement>();
  const preparingCharacters = new WeakSet<HTMLImageElement>();
  const failedCharacters = new WeakSet<HTMLImageElement>();
  let visibleLayer: HTMLVideoElement | HTMLImageElement | undefined;
  let transitionTimer: ReturnType<typeof setTimeout> | undefined;
  const dialoguePages = new Map<string, number>();

  const showDialoguePage = (dialogue: HTMLElement): void => {
    const stopId = dialogue.dataset.stopId ?? '';
    const pages = [...dialogue.querySelectorAll<HTMLElement>('[data-dialogue-page]')];
    const pageIndex = Math.min(Math.max(dialoguePages.get(stopId) ?? 0, 0), pages.length - 1);
    pages.forEach((page, index) => { page.hidden = index !== pageIndex; });
    const previous = dialogue.querySelector<HTMLButtonElement>('[data-dialogue-prev]');
    const next = dialogue.querySelector<HTMLButtonElement>('[data-dialogue-next]');
    if (previous) previous.disabled = pageIndex === 0;
    if (next) next.disabled = pageIndex === pages.length - 1;
    const indicator = dialogue.querySelector<HTMLElement>('[data-page-indicator]');
    if (indicator) indicator.textContent = `${pageIndex + 1} / ${pages.length}`;
  };

  dialogueElements.forEach((dialogue) => {
    const stopId = dialogue.dataset.stopId ?? '';
    dialogue.querySelector<HTMLButtonElement>('[data-dialogue-prev]')?.addEventListener('click', () => {
      dialoguePages.set(stopId, (dialoguePages.get(stopId) ?? 0) - 1);
      showDialoguePage(dialogue);
    });
    dialogue.querySelector<HTMLButtonElement>('[data-dialogue-next]')?.addEventListener('click', () => {
      dialoguePages.set(stopId, (dialoguePages.get(stopId) ?? 0) + 1);
      showDialoguePage(dialogue);
    });
    showDialoguePage(dialogue);
  });

  const updateDialogue = (): void => {
    const character = characters.find((image) => image.dataset.stopId === currentStopId);
    const visualReady = stage.dataset.visual === 'high-res-image' || stage.dataset.visual === 'poster-image';
    const visible = currentPhase === 'stop' && resolveStopCharacter(currentStopId, currentStopProgress) !== null
      && visualReady && (!character || preparedCharacters.has(character) || failedCharacters.has(character));
    dialogueElements.forEach((dialogue) => {
      dialogue.hidden = !visible || dialogue.dataset.stopId !== currentStopId;
    });
    stage.dataset.dialogueVisible = String(visible);
  };

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
      updateDialogue();
    }).catch(() => {
      failedCharacters.add(image);
      updateCharacter();
      updateDialogue();
    });
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
      updateDialogue();
    }).catch(() => {
      updateVisual();
      updateDialogue();
    });
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
    updateDialogue();
  };

  const seek = (index: number): void => {
    const video = videos[index];
    if (!loaded.has(index) || video.seeking || index !== activeIndex) return;
    const target = targetTime(index);
    if (Math.abs(video.currentTime - target) > 0.025) video.currentTime = target;
    else showIfReady(index);
  };

  const load = (index: number): void => {
    const video = videos[index];
    const source = mobileView.matches
      ? (portraitView.matches ? video.dataset.mobilePortraitSrc : video.dataset.mobileLandscapeSrc) ?? ''
      : video.dataset.src ?? '';
    if (failed.has(index) || (loaded.has(index) && video.getAttribute('src') === source)) return;
    loaded.add(index);
    video.muted = true;
    video.pause();
    video.preload = 'auto';
    video.src = source;
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
    lastProgress = progress;
    const state = resolveTourPosition(timeline, progress * timeline.totalUnits);
    timelineRail?.style.setProperty('--tour-progress', `${(progress * 100).toFixed(2)}%`);
    timelineSlider?.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    timelineSlider?.setAttribute('aria-valuetext', `Tramo ${state.segmentIndex + 1} de ${timeline.segments.length}, ${Math.round(progress * 100)} % del recorrido`);
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
    particles?.setStop(state.phase === 'stop' && characterAssignment
      && state.stopProgress >= characterAssignment.revealAfterProgress ? state.activeStopId : null);
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
    updateDialogue();
    if (debug) debug.textContent = `Tramo ${activeIndex + 1}/${videos.length} · ${state.phase} ${(state.stopProgress * 100).toFixed(0)}% · scroll ${(progress * 100).toFixed(1)}% · video ${state.videoTimeSeconds.toFixed(2)} s · ${stage.dataset.visual}`;
  };

  modeSelect?.addEventListener('change', () => {
    selectedModes[activeIndex] = modeSelect.value as StopMediaMode;
    updateVisual();
    updateCharacter();
    updateDialogue();
  });

  const trigger = ScrollTrigger.create({
    trigger: world,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => render(self.progress),
    onRefresh: (self) => render(self.progress),
  });
  const refreshMedia = (): void => {
    const progress = lastProgress;
    timeline = createTourTimeline(mobileView.matches ? mobileTourSegments : tourSegments);
    shownIndex = -1;
    failed.clear();
    const poster = posters.find((image) => image.dataset.index === String(activeIndex));
    if (currentPhase === 'video' && poster && preparedImages.has(poster)) activateLayer(poster, 'poster-image');
    ScrollTrigger.refresh();
    const position = trigger.start + progress * (trigger.end - trigger.start);
    if (scrollTo) scrollTo(position);
    else window.scrollTo({ top: position, behavior: 'instant' });
    render(progress);
  };
  mobileView.addEventListener('change', refreshMedia);
  portraitView.addEventListener('change', refreshMedia);
  const navigateToProgress = (progress: number): void => {
    const bounded = Math.max(0, Math.min(1, progress));
    const position = trigger.start + bounded * (trigger.end - trigger.start);
    if (scrollTo) scrollTo(position);
    else window.scrollTo({ top: position, behavior: 'instant' });
    render(bounded);
  };
  const progressFromPointer = (clientY: number): number => {
    const bounds = timelineSlider?.getBoundingClientRect();
    return bounds && bounds.height > 0 ? (clientY - bounds.top) / bounds.height : lastProgress;
  };
  timelineSlider?.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    timelineSlider.setPointerCapture(event.pointerId);
    navigateToProgress(progressFromPointer(event.clientY));
  });
  timelineSlider?.addEventListener('pointermove', (event) => {
    if (timelineSlider.hasPointerCapture(event.pointerId)) navigateToProgress(progressFromPointer(event.clientY));
  });
  timelineSlider?.addEventListener('pointerup', (event) => {
    if (timelineSlider.hasPointerCapture(event.pointerId)) timelineSlider.releasePointerCapture(event.pointerId);
  });
  timelineSlider?.addEventListener('keydown', (event) => {
    const delta: Record<string, number> = { ArrowDown: 0.01, ArrowRight: 0.01, ArrowUp: -0.01, ArrowLeft: -0.01, PageDown: 0.1, PageUp: -0.1 };
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : event.key in delta ? lastProgress + delta[event.key] : null;
    if (next === null) return;
    event.preventDefault();
    navigateToProgress(next);
  });
  stopButtons.forEach((button) => {
    let startY = 0;
    let dragging = false;
    let suppressClick = false;
    button.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      startY = event.clientY;
      dragging = false;
      suppressClick = false;
      button.setPointerCapture(event.pointerId);
    });
    button.addEventListener('pointermove', (event) => {
      if (!button.hasPointerCapture(event.pointerId)) return;
      if (Math.abs(event.clientY - startY) > 8) dragging = true;
      if (dragging) {
        event.preventDefault();
        navigateToProgress(progressFromPointer(event.clientY));
      }
    });
    button.addEventListener('pointerup', (event) => {
      if (button.hasPointerCapture(event.pointerId)) button.releasePointerCapture(event.pointerId);
      suppressClick = dragging;
    });
    button.addEventListener('pointercancel', () => { dragging = false; });
    button.addEventListener('click', (event) => {
      if (suppressClick) {
        event.preventDefault();
        suppressClick = false;
        return;
      }
      const index = Number(button.dataset.gotoStop);
      const segment = timeline.segments[index];
      const unit = segment.stopStart + Math.min(0.02, segment.stopUnits / 10);
      navigateToProgress(unit / timeline.totalUnits);
    });
  });
  render(trigger.progress);
}
