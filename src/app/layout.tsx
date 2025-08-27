import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reclaim - Your Journey to Freedom',
  description: 'A comprehensive, neuroscience-backed solution for overcoming porn addiction with community support and gamification.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
