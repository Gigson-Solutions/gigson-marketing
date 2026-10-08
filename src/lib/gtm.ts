// Plain module on purpose — NOT inside ConsentScripts.tsx. That file is
// `'use client'`, and a value imported from it into a Server Component comes
// through as a client reference rather than a string, which silently rendered
// the <noscript> iframe src as a thrown-error message instead of the URL.
export const GTM_CONTAINER_ID = 'GTM-5GP9PB8B';
