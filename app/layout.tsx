import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/Providers';

import NextTopLoader from 'nextjs-toploader';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AWH TECH — Building solutions delivering excellence',
    template: '%s | AWH TECH',
  },
  description:
    "Building solutions delivering excellence with AWH TECH. Pakistan's premier remote internship platform. Apply for verified internships, complete real projects, and earn internationally recognized certificates.",
  keywords: [
    'AWH TECH',
    'AWH TECHNOLOGIES',
    'online internship Pakistan',
    'remote internship with certificate Pakistan',
    'free internship certificate online',
    'IT internship Pakistan',
    'internship Lahore Karachi Islamabad',
  ],
  authors: [{ name: 'AWH TECH' }],
  creator: 'AWH TECH',
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'AWH TECH',
    title: 'AWH TECH — Building solutions delivering excellence',
    description:
      "Pakistan's premier remote internship platform. Get certified. Get hired.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AWH TECH',
    description: "Building solutions delivering excellence with AWH TECH.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${instrumentSerif.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-screen bg-white font-sans antialiased">
        <NextTopLoader
          color="#1C3B78"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #1C3B78,0 0 5px #1C3B78"
          zIndex={1600}
        />
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1F2937',
                color: '#F9FAFB',
                borderRadius: '10px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#22C55E', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
