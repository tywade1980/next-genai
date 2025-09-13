import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Construction AI - Business Management Solution",
  description: "Smart call screening, AI models, AI image generation, and comprehensive construction business management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
