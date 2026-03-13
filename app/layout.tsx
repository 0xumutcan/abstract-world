import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Abstract World',
  description: 'A 3D globe showing Abstract users around the world',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
