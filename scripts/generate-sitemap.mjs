/* eslint-disable no-undef -- Node: process, console */
import { existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getAllMarketingPathnames } from '../src/router/publicRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

const siteUrl = (process.env.SITE_URL || 'https://gigsonsolutions.com').replace(
  /\/$/,
  '',
);

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function priorityAndChangefreq(pathname) {
  if (pathname === '/' || pathname === '/es') {
    return { priority: '1.0', changefreq: 'weekly' };
  }
  if (
    pathname.includes('policy') ||
    pathname.includes('notice') ||
    pathname.includes('cookies') ||
    pathname.includes('politica') ||
    pathname.includes('aviso')
  ) {
    return { priority: '0.3', changefreq: 'yearly' };
  }
  if (pathname.includes('contact') || pathname.includes('contacto')) {
    return { priority: '0.9', changefreq: 'monthly' };
  }
  return { priority: '0.8', changefreq: 'weekly' };
}

function main() {
  if (!existsSync(distDir)) {
    console.error('generate-sitemap: dist/ not found. Run vite build first.');
    process.exit(1);
  }

  const pathnames = getAllMarketingPathnames();
  const today = new Date().toISOString().split('T')[0];
  const urlEntries = pathnames
    .map((p) => {
      const loc = `${siteUrl}${p === '/' ? '/' : p}`;
      const { priority, changefreq } = priorityAndChangefreq(p);
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

  writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
  console.log(`generate-sitemap: wrote ${pathnames.length} URLs to dist/sitemap.xml (${siteUrl})`);
}

main();
