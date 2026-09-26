'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Calendar, MapPin, Ticket as TicketIcon, CheckCircle, ArrowRight, Download } from 'lucide-react';
import { QRCode } from '@/components/qr-code';
import { useTickets } from '@/hooks/use-tickets';

export default function TicketPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = params?.id as string;
  const bookingId = searchParams?.get('booking') || '';
  const { tickets } = useTickets();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const ticket = tickets.find((t) => t.bookingId === bookingId);

  if (!mounted) {
    return <div className="min-h-[60vh]" />;
  }

  if (!ticket) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Ticket not found.</p>
        <Link href="/events" className="text-violet-400 hover:underline">Browse Events</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Success banner */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 text-sm text-emerald-300 mb-4">
            <CheckCircle className="h-4 w-4" />
            Booking Confirmed Successfully
          </div>
          <h1 className="text-3xl font-bold mb-2">Your Secure Ticket</h1>
          <p className="text-muted-foreground">Present this QR code at the venue entrance for verification.</p>
        </div>

        {/* Ticket card */}
        <div className="relative animate-fade-in-up">
          <div className="glass gradient-border rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-violet-600/20 via-blue-600/15 to-cyan-500/20 px-8 py-6 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary neon-glow">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">
                      <span className="gradient-text">Ticket</span>Trap
                    </div>
                    <div className="text-xs text-muted-foreground">Secure Digital Ticket</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 px-3 py-1">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-300">VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                {/* Event info */}
                <div className="sm:col-span-2 space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Event</div>
                    <div className="text-2xl font-bold">{ticket.eventName}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Date & Time
                      </div>
                      <div className="text-sm font-medium">{ticket.dateLabel}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Venue
                      </div>
                      <div className="text-sm font-medium">{ticket.venue}</div>
                      <div className="text-xs text-muted-foreground">{ticket.city}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <TicketIcon className="h-3 w-3" /> Seats
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ticket.seats.map((seat) => (
                        <span
                          key={seat}
                          className="rounded-lg bg-blue-500/20 border border-blue-500/40 px-3 py-1 text-sm font-mono font-semibold text-blue-300"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/40">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Booking ID</div>
                      <div className="text-sm font-mono font-semibold text-violet-300">{ticket.bookingId}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Ticket ID</div>
                      <div className="text-sm font-mono font-semibold text-cyan-300">{ticket.ticketId}</div>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center">
                  <div className="rounded-xl p-3 bg-white">
                    <QRCode value={ticket.ticketId} size={160} />
                  </div>
                  <div className="mt-3 text-xs font-mono text-muted-foreground text-center break-all">
                    {ticket.ticketId}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                Cryptographically verified · Single-use
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                Total: ₹{ticket.total.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Perforated edge effect */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-background border border-border/40" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-background border border-border/40" />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            href="/my-tickets"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl glass px-6 py-3.5 text-sm font-semibold text-foreground hover:border-violet-500/50 transition-all"
          >
            View All My Tickets
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-6 py-3.5 text-sm font-semibold text-white neon-glow hover:scale-[1.02] transition-transform"
          >
            <Download className="h-4 w-4" />
            Download Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
