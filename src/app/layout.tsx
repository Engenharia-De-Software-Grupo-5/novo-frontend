import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/features/components/ui/sonner';
import { SessionProvider } from 'next-auth/react';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Moratta',
  description: 'Moratta Frontend',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-sans" suppressHydrationWarning>
        <SessionProvider>
          {children}
          <Toaster position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}
