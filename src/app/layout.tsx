import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppProviders } from '@/providers/AppProviders';

import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Moratta",
  description: "Moratta Frontend",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <AppProviders>
           <QueryProvider>
            {children}
          </QueryProvider>
        </AppProviders>
       <Toaster position="top-center"/>
      </body>
    </html>
  )
}
