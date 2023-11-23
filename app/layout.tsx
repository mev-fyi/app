import { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import React from 'react';
import '@/app/globals.css';
import { fontMono, fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import { IconDownArrow, IconUpArrow } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: {
    default: 'mev.fyi MEV Research Chatbot',
    template: `%s - mev.fyi MEV Research Chatbot`
  },
  description: 'An AI-powered chatbot template built with Next.js and Vercel.',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const toggleHeaderVisibility = () => {
    const header = document.getElementById('mobileHeader');
    const toggleButton = document.getElementById('toggleButton');
    if (header && toggleButton) {
      header.classList.toggle('hidden');
      toggleButton.classList.toggle('header-hidden');
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('font-sans antialiased', fontSans.variable, fontMono.variable)}>
        <Toaster />
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <button id="toggleButton" onClick={toggleHeaderVisibility} className="sm:hidden">
              <IconDownArrow className="header-visible" />
              <IconUpArrow className="header-hidden" />
            </button>
            <Header />
            <main className="flex flex-col flex-1 bg-muted/50">{children}</main>
          </div>
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}