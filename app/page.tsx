'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ShieldCheck, Bot, Ticket, Zap, ArrowRight, User, Shield,
  CheckCircle, Lock, CreditCard, QrCode, Activity, ChevronRight,
} from 'lucide-react';
import { features, architectureSteps } from '@/lib/data';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck, Bot, Ticket, Zap, User, Shield, CheckCircle, Lock, CreditCard, QrCode,
};

const colorMap: Record<string, string> = {
  'neon-purple': 'text-violet-400 bg-violet-500/10 border-violet-500/30',
  'neon-cyan': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  'neon-green': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'neon-yellow': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
};

export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-grid pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-radial from-violet-600/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300 mb-8 transition-all duration-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
            </span>
            Anti-Bot Ticketing Infrastructure
          </div>

          <h1
            className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 transition-all duration-700 delay-100 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <span className="gradient-text">TicketTrap</span>
          </h1>

          <p
            className={`text-2xl sm:text-3xl font-semibold text-foreground mb-4 transition-all duration-700 delay-200 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            Secure Ticket Booking. Fair for Everyone.
          </p>

          <p
            className={`mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed transition-all duration-700 delay-300 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            Prevent duplicate bookings, ticket-limit abuse, bots and overselling during high-demand events.
          </p>

          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-400 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <Link
              href="/events"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-8 py-3.5 text-base font-semibold text-white neon-glow hover:scale-105 transition-transform"
            >
              Explore Events
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl glass px-8 py-3.5 text-base font-semibold text-foreground hover:border-violet-500/50 transition-all"
            >
              <Activity className="h-4 w-4 text-violet-400" />
              Launch Security Demo
            </Link>
          </div>

          {/* Stats strip */}
          <div
            className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto transition-all duration-700 delay-500 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {[
              { label: 'Requests Blocked', value: '3,241' },
              { label: 'Bots Caught', value: '1,847' },
              { label: 'Fair Bookings', value: '1,842' },
              { label: 'Oversell Events', value: '0' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Multi-Layer <span className="gradient-text">Defense System</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Four interconnected security layers working in real time to ensure every ticket goes to a real fan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = iconMap[feature.icon];
              return (
                <div
                  key={feature.title}
                  className="group glass gradient-border rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${colorMap[feature.color]} mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture Visual */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Booking <span className="gradient-text">Security Pipeline</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every booking passes through six validation stages before a ticket is issued.
            </p>
          </div>

          <div className="relative">
            <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-2">
              {architectureSteps.map((step, i) => {
                const Icon = iconMap[step.icon];
                return (
                  <div key={step.label} className="flex items-center gap-2 lg:flex-1">
                    <div className="group glass gradient-border rounded-2xl p-5 flex-1 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">STEP {i + 1}</span>
                      </div>
                      <h3 className="text-sm font-semibold mb-1">{step.label}</h3>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                    {i < architectureSteps.length - 1 && (
                      <ChevronRight className="hidden lg:block h-5 w-5 text-violet-500/50 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="mx-auto max-w-4xl text-center">
          <div className="glass gradient-border rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-violet-600/10 to-transparent" />
            <h2 className="relative text-3xl sm:text-4xl font-bold mb-4">
              Ready to See It In Action?
            </h2>
            <p className="relative text-muted-foreground mb-8 max-w-xl mx-auto">
              Try the full booking flow with live seat selection, security checks, and QR ticket generation — or jump straight to the security dashboard.
            </p>
            <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-8 py-3.5 text-base font-semibold text-white neon-glow hover:scale-105 transition-transform"
              >
                Book a Ticket
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl glass px-8 py-3.5 text-base font-semibold text-foreground hover:border-violet-500/50 transition-all"
              >
                View Security Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-primary">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">
              <span className="gradient-text">Ticket</span>Trap
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Hackathon Demo · Built with React, Tailwind CSS, and love for fair ticketing.
          </p>
        </div>
      </footer>
    </div>
  );
}
