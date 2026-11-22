// Prefix internal links with the site's base path (/Chiplore/ on GitHub Pages).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function u(path = '/') {
  if (/^https?:/.test(path)) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${p}`;
}

export const REPO = 'https://github.com/SiliconBeast/Chiplore';
