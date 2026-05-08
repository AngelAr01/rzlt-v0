import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RZLT — Performance Intelligence',
  description: 'Track your mental state. Improve your decisions.',
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
