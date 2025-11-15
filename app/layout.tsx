import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900']
})

export const metadata: Metadata = {
  title: 'simpleXheader - X header generator',
  description: 'Create stunning X (Twitter) banners in seconds. Free online tool with beautiful gradients, perfect typography, and real-time preview. No design skills required.',
  keywords: ['X banner', 'Twitter header', 'banner generator', 'X header maker', 'Twitter banner creator', 'social media banner', 'free banner tool'],
  authors: [{ name: 'simpleXheader' }],
  creator: 'simpleXheader',
  publisher: 'simpleXheader',
  metadataBase: new URL('https://simplexheader.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'simpleXheader - X header generator',
    description: 'Create stunning X (Twitter) banners in seconds. Free online tool with beautiful gradients, perfect typography, and real-time preview.',
    url: 'https://simplexheader.com',
    siteName: 'simpleXheader',
    images: [
      {
        url: '/app.png',
        width: 1200,
        height: 630,
        alt: 'simpleXheader - X header generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'simpleXheader - X header generator',
    description: 'Create stunning X (Twitter) banners in seconds. Free online tool with beautiful gradients and real-time preview.',
    creator: '@imran0shaik',
    images: ['/app.png'],
  },
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
    icon: '/x_of_logo.png',
    shortcut: '/x_of_logo.png',
    apple: '/x_of_logo.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'simpleXheader',
    applicationCategory: 'DesignApplication',
    description: 'Create stunning X (Twitter) banners in seconds. Free online tool with beautiful gradients, perfect typography, and real-time preview.',
    url: 'https://simplexheader.com',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Beautiful gradient backgrounds',
      'Perfect typography',
      'Real-time preview',
      'No design skills required',
      'Free to use',
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {process.env.NODE_ENV === 'production' && (
          <Script
            src="https://scripts.simpleanalyticscdn.com/latest.js"
            strategy="afterInteractive"
          />
        )}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}