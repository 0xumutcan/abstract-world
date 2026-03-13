import type { Metadata } from 'next'
import './globals.css'
export const metadata = { title: 'Abstract World', description: 'A 3D globe showing Abstract users' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
