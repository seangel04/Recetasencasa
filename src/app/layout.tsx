import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Recetas del día',
  description: 'Recetas de cocina',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={geist.variable} style={{ colorScheme: 'light' }}>
      <body style={{ minHeight: '100vh', fontFamily: 'var(--font-geist), sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
