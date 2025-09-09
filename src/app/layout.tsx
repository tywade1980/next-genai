import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Construction AI - Business Management Solution",
  description: "Smart call screening, AI models, and comprehensive construction business management",
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
