import { Inter, Roboto, Open_Sans, Montserrat, Poppins, Playfair_Display, Lora, Merriweather, Space_Grotesk, JetBrains_Mono } from 'next/font/google'

export const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const roboto = Roboto({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
})

export const openSans = Open_Sans({ 
  subsets: ['latin'],
  display: 'swap',
})

export const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
})

export const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  display: 'swap',
})

export const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
})

export const lora = Lora({ 
  subsets: ['latin'],
  display: 'swap',
})

export const merriweather = Merriweather({ 
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  display: 'swap',
})

export const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  display: 'swap',
})

export const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  display: 'swap',
})

export const fontMap = {
  'Inter': inter.className,
  'Roboto': roboto.className,
  'Open Sans': openSans.className,
  'Montserrat': montserrat.className,
  'Poppins': poppins.className,
  'Playfair Display': playfairDisplay.className,
  'Lora': lora.className,
  'Merriweather': merriweather.className,
  'Space Grotesk': spaceGrotesk.className,
  'JetBrains Mono': jetbrainsMono.className,
}