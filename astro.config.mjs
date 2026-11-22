// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// GitHub Pages project site: https://siliconbeast.github.io/Chiplore/
export default defineConfig({
  site: 'https://siliconbeast.github.io',
  base: '/Chiplore',
  trailingSlash: 'always',
  integrations: [mdx()],
});
