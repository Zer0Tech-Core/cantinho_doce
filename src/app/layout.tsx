// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CartProvider } from '@/hooks/useCart'
import { ToastProvider } from '@/context/ToastContext'

export const metadata: Metadata = {
  title: {
    default: 'Cantinho Doce - Peça Biscoitos Artesanais pelo WhatsApp',
    template: '%s | Cantinho Doce'
  },
  description: 'Os melhores biscoitos artesanais de Campo Grande - RJ. Peça agora pelo WhatsApp e receba em casa!',
  keywords: 'biscoitos artesanais, biscoitos caseiros, doces, compotas, Campo Grande, RJ, delivery de biscoitos',
  authors: [{ name: 'Cantinho Doce' }],
  creator: 'Cantinho Doce',
  publisher: 'Cantinho Doce',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Cantinho Doce - Biscoitos Artesanais',
    description: 'Os melhores biscoitos artesanais de Campo Grande - RJ. Peça agora pelo WhatsApp!',
    url: 'https://cantinhodoce.com.br',
    siteName: 'Cantinho Doce',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cantinho Doce - Biscoitos Artesanais',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cantinho Doce - Biscoitos Artesanais',
    description: 'Os melhores biscoitos artesanais de Campo Grande - RJ',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icon/favicon.ico', sizes: 'any' },
      { url: '/icon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/icon/apple-touch-icon.png',
  },
  manifest: '/icon/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Cantinho Doce',
  },
  formatDetection: {
    telephone: true,
  },
  alternates: {
    canonical: 'https://cantinhodoce.com.br',
  },
  metadataBase: new URL('https://cantinhodoce.com.br'),
}

export const viewport: Viewport = {
  themeColor: '#2E7D32',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // 🔥 ADICIONADO: data-scroll-behavior="smooth"
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        <ToastProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}