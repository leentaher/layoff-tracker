import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "you're not alone — juicebokx layoff tracker",
  description: '332,000+ workers laid off in 2026. You are not alone. Track tech layoffs, share confessions, and find support.',
  openGraph: {
    title: "you're not alone",
    description: 'tech layoff tracker 2026 · juicebokx',
    url: 'https://layofftracker.juicebokx.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
