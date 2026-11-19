import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Student ID Studio — Precision CR80 Institutional Card Generator',
  description:
    'Institutional student identification card design studio with real-time CR80 print preview, template customization, and high-resolution 300 DPI PDF/PNG export.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-studio-canvas text-studio-ink-primary antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
