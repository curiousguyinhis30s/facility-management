import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://facilitypro.app'),
  title: {
    default: 'FacilityPro - Property Management Platform',
    template: '%s | FacilityPro',
  },
  description: 'Professional facility management platform for properties, tenants, leases, and operations. Streamline your property management with powerful tools for Saudi Arabia and the GCC region.',
  keywords: [
    'property management',
    'facility management',
    'tenant management',
    'lease management',
    'real estate software',
    'Saudi Arabia property',
    'GCC real estate',
    'maintenance management',
    'rent collection',
    'property analytics',
  ],
  authors: [{ name: 'FacilityPro Team' }],
  creator: 'FacilityPro',
  publisher: 'FacilityPro',
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
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_SA',
    url: 'https://facilitypro.app',
    siteName: 'FacilityPro',
    title: 'FacilityPro - Property Management Platform',
    description: 'Professional facility management platform for properties, tenants, leases, and operations in Saudi Arabia and the GCC region.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FacilityPro - Property Management Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FacilityPro - Property Management Platform',
    description: 'Professional facility management platform for properties, tenants, leases, and operations.',
    images: ['/og-image.png'],
    creator: '@facilitypro',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FacilityPro',
  },
  formatDetection: {
    telephone: false,
  },
  category: 'business',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
