import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Construction AI Image Generator",
  description: "AI-powered image generation and modification for construction-themed content with endless variety of ideas and styles.",
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
