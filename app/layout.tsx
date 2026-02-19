import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '365 Days of Loving You',
  description: 'Celebrating one year together',
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
