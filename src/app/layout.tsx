import type { Metadata } from 'next'
import { QueryProvider } from '@/providers/query-provider'
import { ShopProvider } from '@/providers/shop-provider'
import './globals.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Onsprint',
  description: 'Print shop management',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const t = localStorage.getItem('sp-theme');
              if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
            } catch(e) {}
          `
        }} />
      </head>
      <body>
        <QueryProvider>
          <ShopProvider>{children}</ShopProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
