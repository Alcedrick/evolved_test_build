import { type Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ConvexClerkProvider from '@/providers/ConvexClerkProvider'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'LiftApp',
  description: 'Discover your path to fitness',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Navbar />  
          
          <main className='pt-13 flex-grow'>
            {children}
          
          </main>
          <Footer />
        </body>
      </html>
    </ConvexClerkProvider>
  )
}