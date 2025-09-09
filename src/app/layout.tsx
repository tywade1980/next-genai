import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Next GenAI - Smart Business Management',
  description: 'Smart call screen and receptionist dialer with AI models and CBMS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}