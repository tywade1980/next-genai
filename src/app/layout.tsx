import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Next-GenAI | Construction Business Management',
  description: 'Smart call screen and receptionist dialer with AI-powered construction business management solution',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}