/**
 * Rasterises the generative blog covers to PNG.
 *
 * The compositions live in `src/design-system/shapes/covers.ts` and are drawn
 * by `Collage` as inline SVG. The blog renders that SVG directly, so these PNGs
 * exist for the places an SVG cannot go: Payload's `media` library (which wants
 * a real upload and derives its own sizes) and social/OG previews.
 *
 * Run with `npm run covers:generate`. Output is committed — nothing generates
 * at build time, so CI never needs a rasteriser.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import sharp from 'sharp';

import { Collage } from '../src/design-system/shapes/Collage.tsx';
import { COVER_RASTER, COVERS, EDITORIAL } from '../src/design-system/shapes/covers.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS_CSS = path.join(ROOT, 'src/design-system/tokens.css');
const OUT_DIR = path.join(ROOT, 'public/img/blog-covers');
const { width: W, height: H } = COVER_RASTER;

/**
 * `multiply` blending is the whole mechanism: overlapping masses resolve into a
 * third colour. librsvg has supported CSS compositing since 2.45 and the
 * bundled build is far past that — but a future `sharp` bump could swap the SVG
 * backend, and the failure is silent (flat top-layer colours, still a valid
 * PNG). Cheap to assert, so assert it before writing anything.
 */
async function assertBlendSupport(): Promise<void> {
  const probe = `<svg xmlns="http://www.w3.org/2000/svg" width="3" height="1" viewBox="0 0 3 1">
    <rect width="3" height="1" fill="#FFFFFF"/>
    <g style="mix-blend-mode:multiply"><rect width="2" height="1" fill="#7874F4"/></g>
    <g style="mix-blend-mode:multiply"><rect x="1" width="2" height="1" fill="#F2C879"/></g>
  </svg>`;
  const { data } = await sharp(Buffer.from(probe)).raw().toBuffer({ resolveWithObject: true });
  // Middle pixel is the overlap: multiply(#7874F4, #F2C879) over white.
  const [r, g, b] = [data[4], data[5], data[6]];
  if (Math.abs(r - 114) > 2 || Math.abs(g - 91) > 2 || Math.abs(b - 116) > 2) {
    throw new Error(
      `mix-blend-mode is not honoured by this rasteriser (got ${r},${g},${b}, expected ~114,91,116). ` +
        `Covers would export with flat colours instead of the blended third colour. ` +
        `sharp=${sharp.versions.sharp} vips=${sharp.versions.vips} rsvg=${sharp.versions.rsvg}`,
    );
  }
}

/**
 * `Collage` emits colours as `var(--gs-*)`, which resolve from the stylesheet in
 * the browser but mean nothing in a standalone file. Parse the real token file
 * rather than duplicating hex values that would silently drift.
 */
async function loadTokens(): Promise<Record<string, string>> {
  const css = await readFile(TOKENS_CSS, 'utf8');
  const raw: Record<string, string> = {};
  for (const match of css.matchAll(/(--gs-[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    const [, name, value] = match;
    // First definition wins: the media-query blocks at the end of tokens.css
    // redefine the type scale. No colour is overridden there today, but taking
    // the last match would quietly pick up a breakpoint override if one ever is.
    if (!(name in raw)) raw[name] = value.trim();
  }

  // Semantic tokens point at other tokens (--gs-bg -> var(--gs-cream)).
  const resolve = (value: string, seen: Set<string>): string =>
    value.replace(/var\((--gs-[a-z0-9-]+)\)/g, (_, name: string) => {
      if (seen.has(name)) throw new Error(`Cyclic CSS variable: ${name}`);
      if (!(name in raw)) throw new Error(`Unknown CSS variable ${name} in tokens.css`);
      return resolve(raw[name], new Set(seen).add(name));
    });

  return Object.fromEntries(Object.entries(raw).map(([name, value]) => [name, resolve(value, new Set([name]))]));
}

function substituteTokens(svg: string, tokens: Record<string, string>): string {
  const substituted = svg.replace(/var\((--gs-[a-z0-9-]+)\)/g, (_, name: string) => {
    const value = tokens[name];
    if (!value) throw new Error(`No value for ${name} — is it defined in ${TOKENS_CSS}?`);
    return value;
  });
  // Belt and braces: catches `var(--foo, fallback)` or any non --gs- variable a
  // future composition might introduce. Never write a half-resolved file.
  const leftover = substituted.match(/var\([^)]*\)/g);
  if (leftover) throw new Error(`Unresolved CSS variables in SVG: ${[...new Set(leftover)].join(', ')}`);
  return substituted;
}

await assertBlendSupport();
const tokens = await loadTokens();
await mkdir(OUT_DIR, { recursive: true });

for (const cover of COVERS) {
  const rendered = renderToStaticMarkup(
    React.createElement(Collage, { layers: cover.build(EDITORIAL), background: EDITORIAL.bg, aspect: W / H }),
  );

  // React omits `xmlns`, and `Collage` sets `width="100%"` for fluid layout —
  // which makes librsvg rasterise at the viewBox size and then upscale. Both
  // have to be fixed on the way out, or the PNG is a blurry 1120px bitmap.
  const svg = substituteTokens(rendered, tokens).replace(
    '<svg width="100%"',
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"`,
  );
  if (!svg.startsWith('<svg xmlns=')) {
    throw new Error("Collage's root <svg> tag changed — update the rewrite in this script");
  }

  const png = await sharp(Buffer.from(svg))
    .flatten({ background: tokens['--gs-cream'] })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const file = path.join(OUT_DIR, `${cover.id}.png`);
  await writeFile(file, png);
  console.log(`${cover.id}.png  ${W}x${H}  ${(png.length / 1024).toFixed(0)} KB  — ${cover.title}`);
}

process.exit(0);
