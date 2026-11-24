// Small motion helpers. Everything respects prefers-reduced-motion.
const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scroll progress: drives --p (0..1) on the header bar and the pixel % readout. */
export function scrollProgress() {
  const bar = document.querySelector('.scan');
  if (!bar) return;
  const pct = bar.querySelector('[data-pct]');
  const root = document.documentElement;
  let queued = false;
  const update = () => {
    queued = false;
    const max = root.scrollHeight - innerHeight;
    // Short pages have nothing to track: keep the bar as a quiet hairline.
    bar.classList.toggle('idle', max < innerHeight * 0.5);
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    bar.style.setProperty('--p', p.toFixed(4));
    pct.textContent = String(Math.round(p * 100)).padStart(3, '0');
    bar.classList.toggle('done', p > 0.995);
    bar.classList.toggle('near-end', p > 0.9);
    root.toggleAttribute('data-scrolled', scrollY > 8);
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  new ResizeObserver(queue).observe(document.body);
  update();
}

/** Pixel decode: [data-scramble] text resolves left to right through noise glyphs on hover / focus. */
const NOISE = '01#%*+=<>/\\[]{}?ABCDEFGHJKLMNPQRSTUVWXYZ';
export function decode(el, ms = 420) {
  if (still() || el.dataset.busy) return;
  const final = el.dataset.text ?? (el.dataset.text = el.textContent);
  el.dataset.busy = '1';
  const t0 = performance.now();
  const frame = (now) => {
    const k = Math.min(1, (now - t0) / ms);
    const fixed = Math.floor(k * final.length);
    let out = '';
    for (let i = 0; i < final.length; i++) {
      const ch = final[i];
      out += i < fixed || ch === ' ' || ch === '·' ? ch : NOISE[(Math.random() * NOISE.length) | 0];
    }
    el.textContent = out;
    if (k < 1) requestAnimationFrame(frame);
    else { el.textContent = final; delete el.dataset.busy; }
  };
  requestAnimationFrame(frame);
}

export function scramble(scope = document) {
  for (const el of scope.querySelectorAll('[data-scramble]')) {
    // Hover the element itself or the link/button that contains it.
    const host = el.closest('a, button, [data-scramble-host]') ?? el;
    if (host.dataset.scrambleBound) continue;
    host.dataset.scrambleBound = '1';
    const run = () => host.querySelectorAll('[data-scramble]').forEach((t) => decode(t));
    host.addEventListener('pointerenter', run);
    host.addEventListener('focus', run);
  }
  // Decode once on load for anything marked as an intro line.
  for (const el of scope.querySelectorAll('[data-scramble="intro"]')) decode(el, 700);
}
