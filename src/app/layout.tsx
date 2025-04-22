import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nillion Mini App Gallery',
  description: 'Interactive showcase of Nillion apps',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <main className='min-h-screen p-4 md:p-8'>{children}</main>
        <Script
          defer
          src='https://cloud.umami.is/script.js'
          data-website-id='dbd3c967-13d1-46c5-a3a6-bf5158d76348'
          strategy='afterInteractive'
        />
      </body>
    </html>
  );
}
