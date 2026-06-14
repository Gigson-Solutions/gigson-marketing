// Root layout — html/body live in app/[locale]/layout.tsx so lang can be set dynamically.
// Next.js requires a root layout; this is a minimal pass-through.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
