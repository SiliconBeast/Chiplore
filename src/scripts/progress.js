// Local-only progress. Nothing leaves the browser.
import { glyph } from '../lib/eye.js';

const KEY = 'chiplore:progress:v1';
const DRIFT_DAYS = 21;

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}
function write(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* private mode: progress just won't stick */ }
}

export function getSkill(id) {
  const s = read()[id];
  if (!s) return { level: 0, drifting: false };
  const age = (Date.now() - (s.at || 0)) / 864e5;
  return { level: s.level, drifting: s.level >= 3 && age > DRIFT_DAYS };
}

/** Raise a skill to at least `level` and mark it fresh. Returns true if it went up. */
export function raise(id, level) {
  const data = read();
  const prev = data[id]?.level ?? 0;
  data[id] = { level: Math.max(prev, level), at: Date.now() };
  write(data);
  paint();
  return level > prev;
}

/** Redraw every mastery glyph on the page from stored progress. */
export function paint(root = document) {
  root.querySelectorAll('svg.eye[data-skill]').forEach((svg) => {
    const { level, drifting } = getSkill(svg.dataset.skill);
    const g = glyph(level, drifting);
    const path = svg.querySelector('path');
    if (!path) return;
    path.setAttribute('d', g.d);
    path.setAttribute('stroke', g.color);
    path.setAttribute('stroke-opacity', String(g.opacity));
    const name = svg.getAttribute('aria-label')?.split(':')[0] ?? 'Skill';
    svg.setAttribute('aria-label', `${name}: ${g.label}`);
  });
  root.querySelectorAll('[data-stage]').forEach((el) => {
    const ids = el.dataset.stage.split(',');
    el.classList.toggle('is-done', ids.every((id) => getSkill(id).level >= 3));
  });
  root.querySelectorAll('[data-skill-count]').forEach((el) => {
    const ids = el.dataset.skillCount.split(',');
    const n = ids.filter((id) => getSkill(id).level >= 3).length;
    el.textContent = `${n}/${ids.length}`;
  });
}
