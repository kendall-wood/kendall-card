import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kendall Wood - Portfolio',
  description: 'BFA Communication Design Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/your-kit-id.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}

