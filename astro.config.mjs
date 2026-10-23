import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.PUBLIC_SITE_URL;
const base = process.env.PUBLIC_BASE_PATH;
const sitemapEnabled = site && process.env.PUBLIC_SITEMAP !== 'false';

export default defineConfig({
  output: 'static',
  ...(site ? { site } : {}),
  ...(base ? { base } : {}),
  integrations: sitemapEnabled ? [sitemap()] : [],
  vite: {
    plugins: [tailwindcss()],
  },
});
