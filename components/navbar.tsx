'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/my-tickets', label: 'My Tickets' },
  { href: '/dashboard', label: 'Security Dashboard' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 glass-strong">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary neon-glow transition-transform group-hover:scale-110">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="gradient-text">Ticket</span>
            <span className="text-foreground">Trap</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                pathname === link.href
                  ? 'text-foreground bg-secondary/60'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Login
          </button>
          <Link
            href="/events"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-primary text-white hover:opacity-90 transition-opacity neon-glow"
          >
            Demo Mode
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 glass-strong px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block px-4 py-2.5 text-sm font-medium rounded-lg transition-all',
                pathname === link.href
                  ? 'text-foreground bg-secondary/60'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <button className="flex-1 px-4 py-2.5 text-sm font-medium text-muted-foreground border border-border rounded-lg">
              Login
            </button>
            <Link
              href="/events"
              onClick={() => setMobileOpen(false)}
              className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg bg-gradient-primary text-white text-center"
            >
              Demo Mode
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
