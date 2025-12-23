import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'URC Falke - Mitgliederverwaltung',
  description: 'Progressive Web App für die Mitgliederverwaltung des URC Falke',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'URC Falke',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
