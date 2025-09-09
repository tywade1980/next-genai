import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next GenAI - Smart Call Screen & CBMS",
  description: "Smart call screen and receptionist dialer with AI models and construction business management solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
