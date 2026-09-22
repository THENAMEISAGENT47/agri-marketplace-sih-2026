export interface TopDockConfig {
  proximity?: number;
  spring?: number;
  damping?: number;
  widthGrowth?: number;
  heightGrowth?: number;
  drop?: number;
  axis?: 'x' | 'y';
  distribute?: boolean;
  lockTrack?: boolean;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export function createTopDockController(
  container: HTMLElement,
  getConfig: () => TopDockConfig
): () => void {
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointerQuery = window.matchMedia('(hover:hover) and (pointer:fine)');

  const items = Array.from(container.querySelectorAll<HTMLElement>('[data-dock-item]')).map((el) => ({
    element: el,
    baseWidth: 0,
    baseHeight: 0,
    value: 0,
    velocity: 0,
    target: 0,
  }));

  let isEnabled = false;
  let isPointerActive = false;
  let isAnimating = false;
  let rafId = 0;

  const checkEnabled = () =>
    !reducedMotionQuery.matches &&
    container.clientWidth > 0 &&
    window.innerWidth > 600 &&
    pointerQuery.matches;

  const applyLayout = () => {
    const cfg = getConfig();
    if (cfg.distribute && cfg.axis !== 'y') {
      const widths = items.map((s) => s.baseWidth + (cfg.widthGrowth ?? 17) * clamp(s.value, 0, 1.08));
      const totalWidth = widths.reduce((s, o) => s + o, 0);
      const baseTotal = items.reduce((s, o) => s + o.baseWidth, 0);
      const clientW = container.clientWidth >= baseTotal ? container.clientWidth : 0;
      items.forEach((s, o) => {
        s.element.style.width = clientW ? `${((clientW * widths[o]) / totalWidth).toFixed(2)}px` : '';
        s.element.style.height = '';
        s.element.style.transform = '';
      });
      return;
    }
    for (const item of items) {
      const a = clamp(item.value, 0, 1.08);
      if (cfg.axis === 'y') {
        item.element.style.width = '';
        item.element.style.height = `${(item.baseHeight + (cfg.heightGrowth ?? 16) * a).toFixed(2)}px`;
        item.element.style.transform = `translateX(${(a * (cfg.drop ?? 3.5)).toFixed(2)}px)`;
        continue;
      }
      const isLogo = item.element.classList.contains('animated-top-dock__logo');
      const widthGrowth = isLogo
        ? (cfg.widthGrowth ?? 17) * (14 / 17)
        : Math.min(cfg.widthGrowth ?? 17, item.baseWidth * 0.24);
      const heightGrowth = isLogo
        ? (cfg.heightGrowth ?? 16) * (14 / 16)
        : (cfg.heightGrowth ?? 16);
      item.element.style.width = `${(item.baseWidth + widthGrowth * a).toFixed(2)}px`;
      item.element.style.height = `${(item.baseHeight + heightGrowth * a).toFixed(2)}px`;
      item.element.style.transform = `translateY(${(a * (cfg.drop ?? 3.5)).toFixed(2)}px)`;
    }
  };

  const measureAndReset = () => {
    isEnabled = checkEnabled();
    const cfg = getConfig();
    if (cfg.lockTrack) {
      container.style.width = '';
    }
    for (const item of items) {
      item.element.style.width = '';
      item.element.style.height = '';
      item.element.style.transform = '';
      item.element.dataset.dockNear = 'false';
    }
    for (const item of items) {
      const rect = item.element.getBoundingClientRect();
      item.baseWidth = rect.width;
      item.baseHeight = rect.height;
      item.value = 0;
      item.velocity = 0;
      item.target = 0;
    }
    isPointerActive = false;
    isAnimating = false;
    if (cfg.distribute) {
      applyLayout();
    }
    if (cfg.lockTrack) {
      container.style.width = `${container.getBoundingClientRect().width.toFixed(2)}px`;
    }
    container.dataset.dockState = isEnabled ? 'idle' : 'static';
    container.dataset.dockMax = '0.00';
  };

  const handlePointer = (clientX: number, clientY: number) => {
    if (!isEnabled) return;
    const cfg = getConfig();
    const isY = cfg.axis === 'y';
    const pointerPos = isY ? clientY : clientX;
    const rects = items.map((o) => o.element.getBoundingClientRect());
    for (let o = 0; o < items.length; o += 1) {
      const rect = rects[o];
      const center = isY ? rect.top + rect.height * 0.5 : rect.left + rect.width * 0.5;
      const proximity = Math.max(1, cfg.proximity ?? 122);
      const dist = clamp(1 - Math.abs(pointerPos - center) / proximity, 0, 1);
      const target = dist * dist * (3 - 2 * dist);
      items[o].target = target;
      items[o].element.dataset.dockNear = target > 0.08 ? 'true' : 'false';
    }
    isPointerActive = true;
    isAnimating = true;
    container.dataset.dockState = 'active';
  };

  const handleFocusItem = (targetEl: HTMLElement) => {
    if (!isEnabled) return;
    const idx = items.findIndex((a) => a.element === targetEl);
    if (idx < 0) return;
    items.forEach((a, i) => {
      a.target = i === idx ? 1 : Math.abs(i - idx) === 1 ? 0.24 : 0;
      a.element.dataset.dockNear = a.target > 0.08 ? 'true' : 'false';
    });
    isPointerActive = false;
    isAnimating = true;
    container.dataset.dockState = 'focus';
  };

  const handleResetTargets = () => {
    isPointerActive = false;
    isAnimating = true;
    items.forEach((e) => {
      e.target = 0;
      e.element.dataset.dockNear = 'false';
    });
  };

  const animate = () => {
    if (isEnabled && isAnimating) {
      const cfg = getConfig();
      let hasVelocity = false;
      let maxVal = 0;
      for (const item of items) {
        item.velocity += (item.target - item.value) * (cfg.spring ?? 0.19);
        item.velocity *= (cfg.damping ?? 0.7);
        item.value += item.velocity;
        if (Math.abs(item.target - item.value) < 1e-3 && Math.abs(item.velocity) < 1e-3) {
          item.value = item.target;
          item.velocity = 0;
        } else {
          hasVelocity = true;
        }
        maxVal = Math.max(maxVal, clamp(item.value, 0, 1.08));
      }
      applyLayout();
      container.dataset.dockMax = maxVal.toFixed(2);
      if (!hasVelocity) {
        isAnimating = false;
        if (items.every((i) => i.target === 0)) {
          container.dataset.dockState = 'idle';
        }
      }
    }
    rafId = requestAnimationFrame(animate);
  };

  const onPointerMove = (e: PointerEvent) => handlePointer(e.clientX, e.clientY);

  const onWindowPointerMove = (e: PointerEvent) => {
    if (!isPointerActive) return;
    const rect = container.getBoundingClientRect();
    const itemRects = items.map((s) => s.element.getBoundingClientRect());
    const bottomMax = Math.max(rect.bottom, ...itemRects.map((s) => s.bottom));
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > bottomMax) {
      handleResetTargets();
    }
  };

  const onFocusIn = (e: FocusEvent) => {
    const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-dock-item]');
    if (target) handleFocusItem(target);
  };

  const onFocusOut = () => {
    requestAnimationFrame(() => {
      if (!container.contains(document.activeElement)) {
        handleResetTargets();
      }
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-dock-item]');
    if (target && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      target.click();
    }
  };

  const onClick = () => handleResetTargets();

  let isDisposed = false;
  const onFontsReady = () => {
    if (!isDisposed) measureAndReset();
  };
  document.fonts?.ready.then(onFontsReady);

  const resizeObserver = new ResizeObserver(measureAndReset);
  resizeObserver.observe(container.closest('[data-dock-frame]') ?? container.parentElement ?? container);

  container.addEventListener('pointermove', onPointerMove);
  container.addEventListener('pointerleave', handleResetTargets);
  container.addEventListener('focusin', onFocusIn);
  container.addEventListener('focusout', onFocusOut);
  container.addEventListener('keydown', onKeyDown);
  container.addEventListener('click', onClick);
  window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
  reducedMotionQuery.addEventListener('change', measureAndReset);
  pointerQuery.addEventListener('change', measureAndReset);

  measureAndReset();
  rafId = requestAnimationFrame(animate);

  return () => {
    isDisposed = true;
    container.style.width = '';
    cancelAnimationFrame(rafId);
    resizeObserver.disconnect();
    container.removeEventListener('pointermove', onPointerMove);
    container.removeEventListener('pointerleave', handleResetTargets);
    container.removeEventListener('focusin', onFocusIn);
    container.removeEventListener('focusout', onFocusOut);
    container.removeEventListener('keydown', onKeyDown);
    container.removeEventListener('click', onClick);
    window.removeEventListener('pointermove', onWindowPointerMove);
    reducedMotionQuery.removeEventListener('change', measureAndReset);
    pointerQuery.removeEventListener('change', measureAndReset);
  };
}
