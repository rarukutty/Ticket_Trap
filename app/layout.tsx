import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: 'TicketTrap — Secure Ticket Booking. Fair for Everyone.',
  description: 'Prevent duplicate bookings, ticket-limit abuse, bots and overselling during high-demand events.',
  openGraph: {
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="font-sans bg-background text-foreground antialiased min-h-screen">
        <Navbar />
        <main className="pt-16">{children}</main>
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(230 35% 7%)',
              border: '1px solid hsl(240 30% 18%)',
              color: 'hsl(210 40% 98%)',
            },
          }}
        />
      </body>
    </html>
  );
}
