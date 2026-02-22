import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Grainient from '@/components/Grainient'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Synthesize | L\'Oreal Luxe',
  description: 'AI-powered luxury fragrance layering recommendation engine.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-black text-white antialiased min-h-screen relative`}>
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Grainient
            color1="#10B981" // Vibrant Emerald Green 
            color2="#000000" // Pure Black
            color3="#047857" // Rich Dark Green
            timeSpeed={0.15}
            warpStrength={0.5}
            warpFrequency={3}
            warpAmplitude={30}
            noiseScale={1.5}
            grainAmount={0.08}
            zoom={1.5}
            className="w-full h-full"
          />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
