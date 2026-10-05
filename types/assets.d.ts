// Declaraciones de los imports de assets estáticos (`*.svg`, `*.png`, …).
//
// Normalmente las aporta `next-env.d.ts`, que Next regenera en cada `next dev` /
// `next build` y que está en `.gitignore`. En un clon o worktree limpio ese fichero
// no existe todavía, así que `npx tsc --noEmit` falla con TS2307 en cada import de
// asset (35 errores) hasta que alguien arranca Next. Referenciar aquí las mismas
// declaraciones de Next hace que el type-check sea autosuficiente y siga la versión
// de Next instalada, sin duplicar la lista de extensiones.
/// <reference types="next/image-types/global" />
