import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://tandot.edycu.dev'),
  title: 'Tandot — Tandas sin confianza ciega',
  description:
    'AI-managed, fraud-proof rotating savings circles (tandas) on MXNB — the Mexican peso stablecoin on BOT Chain. Elimina el riesgo de las tandas tradicionales.',
  keywords: [
    'tanda',
    'ahorro',
    'MXNB',
    'stablecoin',
    'Bitso',
    'BOT Chain',
    'rotating savings',
    'Mexico',
    'fintech',
    'blockchain',
  ],
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Tandot — Tandas sin confianza ciega',
    description:
      'Tandas inteligentes protegidas por IA y contratos inteligentes en BOT Chain.',
    url: 'https://tandot.edycu.dev',
    siteName: 'Tandot',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tandot — Tandas sin confianza ciega',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tandot — Tandas sin confianza ciega',
    description:
      'AI-managed, fraud-proof rotating savings circles on MXNB stablecoin.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="grid-bg">
        {children}
      </body>
    </html>
  );
}
