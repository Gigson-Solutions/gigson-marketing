// RootLayout (in admin/layout.tsx) renders <html><body> for admin routes.
// API routes don't need a layout. This file just satisfies Next.js's layout requirement.
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
