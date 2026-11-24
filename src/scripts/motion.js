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

/** Adds .in to sections and [data-draw] vectors as they scroll into view. */
export function scrollIn() {
  const els = document.querySelectorAll('.settle, .band > .wrap, [data-draw]');
  if (!('IntersectionObserver' in window) || still()) { els.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
  els.forEach((e) => io.observe(e));
}

/* ---------- Page transition: pixel dissolve ---------- */
const KEY = 'chiplore:pt';
const CELL = 22;
function grid(canvas) {
  const r = canvas.getBoundingClientRect();
  const dpr = Math.min(2, devicePixelRatio || 1);
  canvas.width = Math.ceil(r.width * dpr); canvas.height = Math.ceil(r.height * dpr);
  const ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cols = Math.ceil(r.width / CELL), rows = Math.ceil(r.height / CELL);
  // Order: a diagonal raster sweep with jitter, so it reads as a scan, not noise.
  const cells = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) cells.push({ x, y, k: (x / cols) * 0.55 + (y / rows) * 0.45 + Math.random() * 0.18 });
  cells.sort((a, b) => a.k - b.k);
  return { ctx, cells, w: r.width, h: r.height };
}
function run(canvas, cover, ms, done) {
  const { ctx, cells, w, h } = grid(canvas);
  const t0 = performance.now();
  if (!cover) { ctx.fillStyle = '#0D131C'; ctx.fillRect(0, 0, w, h); }
  let drawn = 0;
  const step = (now) => {
    const k = Math.min(1, (now - t0) / ms);
    const target = Math.floor(k * cells.length);
    // Leading edge glows green, then settles to the page colour.
    const edge = Math.max(0, drawn - Math.floor(cells.length * 0.06));
    for (let i = edge; i < target; i++) {
      const c = cells[i];
      const lead = i >= drawn;
      if (cover) {
        ctx.fillStyle = '#0D131C'; ctx.fillRect(c.x * CELL, c.y * CELL, CELL, CELL);
        if (lead) { ctx.fillStyle = Math.random() < .25 ? '#3FBF86' : '#1B5E41'; ctx.fillRect(c.x * CELL + 7, c.y * CELL + 7, CELL - 14, CELL - 14); }
      }
      else if (lead) { ctx.fillStyle = Math.random() < .25 ? '#3FBF86' : '#1B5E41'; ctx.fillRect(c.x * CELL + 7, c.y * CELL + 7, CELL - 14, CELL - 14); }
      else ctx.clearRect(c.x * CELL, c.y * CELL, CELL, CELL);
    }
    drawn = target;
    if (k < 1) requestAnimationFrame(step);
    else { if (cover) { ctx.fillStyle = '#0D131C'; ctx.fillRect(0, 0, w, h); } else ctx.clearRect(0, 0, w, h); done?.(); }
  };
  requestAnimationFrame(step);
}
export function pageTransitions() {
  const pt = document.querySelector('.pt');
  if (!pt) return;
  const canvas = pt.querySelector('canvas');
  const header = document.querySelector('.site-header');
  const setTop = () => pt.style.setProperty('--pt-top', `${header ? header.getBoundingClientRect().bottom : 0}px`);
  setTop();
  const root = document.documentElement;
  // Arriving: start covered, dissolve away.
  if (root.classList.contains('pt-in')) {
    sessionStorage.removeItem(KEY);
    if (still()) root.classList.remove('pt-in');
    else run(canvas, false, 420, null), requestAnimationFrame(() => root.classList.remove('pt-in'));
  }
  addEventListener('pageshow', (e) => { if (e.persisted) { root.classList.remove('pt-in'); canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); } });
  if (still()) return;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target && a.target !== '_self') return;
    if (a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) return;
    e.preventDefault();
    setTop();
    run(canvas, true, 280, () => { sessionStorage.setItem(KEY, '1'); location.href = url.href; });
  });
}
