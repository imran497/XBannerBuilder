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
  title: 'xheader.app - X Banner Generator',
  description: 'Design your perfect X (Twitter) banner with xheader.app',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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