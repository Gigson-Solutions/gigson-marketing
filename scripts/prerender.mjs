/* eslint-disable no-undef -- Node */
import { spawn } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

import { getAllMarketingPathnames } from '../src/router/publicRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const baseUrl = 'http://127.0.0.1:4173';
const publicSiteUrl = (process.env.SITE_URL || 'https://gigsonsolutions.com').replace(
  /\/$/,
  '',
);

function pathHasChildRoutes(pathname, allPaths) {
  const prefix = pathname === '/' ? null : `${pathname}/`;
  if (!prefix) return false;
  return allPaths.some((p) => p !== pathname && p.startsWith(prefix));
}

function s3KeyForPathname(pathname, allPaths) {
  if (pathname === '/') return 'index.html';
  if (pathname.endsWith('.html')) return pathname.slice(1);
  if (pathHasChildRoutes(pathname, allPaths)) {
    return `${pathname.slice(1)}/index.html`;
  }
  return pathname.slice(1);
}

function writePrerenderedFile(pathname, html, allPaths) {
  const normalizedHtml = html.split(baseUrl).join(publicSiteUrl);
  if (pathname === '/') {
    writeFileSync(path.join(distDir, 'index.html'), normalizedHtml, 'utf8');
    return;
  }
  if (pathname.endsWith('.html')) {
    writeFileSync(path.join(distDir, pathname.slice(1)), normalizedHtml, 'utf8');
    return;
  }
  if (pathHasChildRoutes(pathname, allPaths)) {
    const dir = path.join(distDir, pathname.slice(1));
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, 'index.html'), normalizedHtml, 'utf8');
    return;
  }
  const segments = pathname.slice(1).split('/');
  const fileName = segments.pop();
  const sub = segments.join('/');
  const dir = sub ? path.join(distDir, sub) : distDir;
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, fileName), normalizedHtml, 'utf8');
}

async function waitForServer(maxMs = 90000) {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(baseUrl);
      if (res.ok) return;
    } catch {
      /* server not up yet */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`prerender: preview server not responding at ${baseUrl}`);
}

async function waitForAppContent(page) {
  await page.waitForFunction(
    () => {
      const root = document.querySelector('#root');
      if (!root) return false;
      const text = (root.innerText || '').trim();
      if (text.length >= 35) return true;
      if (root.querySelector('iframe')) return true;
      return root.children.length > 0;
    },
    { timeout: 45000 },
  );
}

function runPreview() {
  const child = spawn(
    'npx',
    ['vite', 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'],
    {
      cwd: rootDir,
      // Do not pipe stdout/stderr: unconsumed pipes fill and block the child (hangs in CI).
      stdio: ['ignore', 'ignore', 'ignore'],
      env: { ...process.env, BROWSER: 'none' },
    },
  );
  return child;
}

async function main() {
  if (!existsSync(distDir)) {
    console.error('prerender: dist/ missing. Run vite build first.');
    process.exit(1);
  }

  const paths = getAllMarketingPathnames();
  const preview = runPreview();

  try {
    await waitForServer();
    const browser = await chromium.launch({
      headless: true,
    });
    const context = await browser.newContext({
      javaScriptEnabled: true,
      viewport: { width: 1280, height: 720 },
    });
    const page = await context.newPage();

    for (const pathname of paths) {
      const url = pathname === '/' ? `${baseUrl}/` : `${baseUrl}${pathname}`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await waitForAppContent(page);
      const html = await page.content();
      writePrerenderedFile(pathname, html, paths);
      console.log('prerender:', pathname);
    }

    await browser.close();

    const extensionless = paths
      .map((p) => s3KeyForPathname(p, paths))
      .filter((k) => !k.endsWith('.html'));
    writeFileSync(
      path.join(distDir, 'extensionless-html-keys.txt'),
      `${extensionless.join('\n')}\n`,
      'utf8',
    );
    const patchSh = `#!/bin/sh
set -eu
: "\${BUCKET_NAME:?}"
cd "$(dirname "$0")"
while IFS= read -r key; do
  [ -n "$key" ] || continue
  [ -f "$key" ] || continue
  aws s3 cp "$key" "s3://$BUCKET_NAME/$key" --content-type "text/html; charset=utf-8" --cache-control "public, max-age=3600"
done < extensionless-html-keys.txt
`;
    const patchPath = path.join(distDir, 'patch-content-types.sh');
    writeFileSync(patchPath, patchSh, 'utf8');
    chmodSync(patchPath, 0o755);
    console.log(
      'prerender: extensionless HTML keys:',
      extensionless.length,
      '(patch-content-types.sh for deploy)',
    );
  } finally {
    preview.kill('SIGTERM');
    await new Promise((r) => setTimeout(r, 500));
    try {
      preview.kill('SIGKILL');
    } catch {
      /* ignore */
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
