// Mastery glyph: a tiny eye diagram. Colour = highest level earned,
// sharpness = how fresh the skill is. Shared by the server (Astro) and the browser.

export const LEVELS = [
  { id: 0, key: 'none', name: 'Not started', rule: 'Nothing yet.', dx: 0, dy: -1, color: '#3A4A5E', opacity: 1 },
  { id: 1, key: 'simulated', name: 'Simulated', rule: 'You tried the practice.', dx: 64, dy: 76, color: '#8A94A6', opacity: 1 },
  { id: 2, key: 'synthesized', name: 'Synthesized', rule: 'You passed the practice.', dx: 34, dy: 40, color: '#2C9A66', opacity: 1 },
  { id: 3, key: 'verified', name: 'Verified', rule: 'You passed the unit quiz.', dx: 8, dy: 9, color: '#3FBF86', opacity: 1 },
  { id: 4, key: 'taped', name: 'Taped out', rule: 'You passed the unit test and a later review.', dx: 2, dy: 2, color: '#E7A93A', opacity: 1 },
];

/** Drifting: earned level stays, but the eye blurs until reviewed. */
export const DRIFT = { dx: 26, dy: 30, opacity: 0.7 };

const NOISE = (() => {
  let seed = 7;
  const out = [];
  for (let i = 0; i < 400; i++) {
    seed = (seed * 16807) % 2147483647;
    out.push((seed / 2147483647) * 2 - 1);
  }
  return out;
})();

/** SVG path data for a 40×24 eye diagram with the given jitter (dx) and noise (dy). */
export function eyePath(dx, dy) {
  if (dy < 0) return 'M1 12H39';
  const a = (dy / 90) * 5;
  const j = (dx / 64) * 3.2;
  let d = '';
  let n = 0;
  for (let r = 0; r < 2; r++) {
    for (let x = 0; x < 8; x++) {
      const A = (x >> 2) & 1, B = (x >> 1) & 1, C = x & 1;
      const ox = NOISE[100 + n] * j;
      const oy = NOISE[160 + n] * a;
      n++;
      const y = (v) => ((v ? 5 : 19) + oy).toFixed(1);
      const c1 = 6 + ox, c2 = 34 + ox;
      d += `M0 ${y(A)}H${(c1 - 4).toFixed(1)}C${c1.toFixed(1)} ${y(A)} ${c1.toFixed(1)} ${y(B)} ${(c1 + 4).toFixed(1)} ${y(B)}`;
      d += `H${(c2 - 4).toFixed(1)}C${c2.toFixed(1)} ${y(B)} ${c2.toFixed(1)} ${y(C)} ${(c2 + 4).toFixed(1)} ${y(C)}H40`;
    }
  }
  return d;
}

/** Everything needed to draw one skill's glyph. */
export function glyph(level = 0, drifting = false) {
  const L = LEVELS[Math.max(0, Math.min(4, level))];
  const src = drifting && level > 0 ? DRIFT : L;
  return {
    d: eyePath(src.dx, src.dy),
    color: L.color,
    opacity: drifting && level > 0 ? DRIFT.opacity : L.opacity,
    label: drifting && level > 0 ? `${L.name}, drifting` : L.name,
  };
}
