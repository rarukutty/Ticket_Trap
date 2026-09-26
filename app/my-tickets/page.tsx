'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Shield, Calendar, MapPin, Ticket as TicketIcon, CheckCircle, ArrowRight, Trash2 } from 'lucide-react';
import { QRCode } from '@/components/qr-code';
import { useTickets } from '@/hooks/use-tickets';

export default function MyTicketsPage() {
  const { tickets, clearTickets } = useTickets();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              My <span className="gradient-text">Tickets</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              {tickets.length > 0
                ? `${tickets.length} ticket${tickets.length > 1 ? 's' : ''} booked through TicketTrap.`
                : 'No tickets booked yet.'}
            </p>
          </div>
          {tickets.length > 0 && (
            <button
              onClick={clearTickets}
              className="inline-flex items-center gap-2 rounded-lg glass px-4 py-2 text-sm text-muted-foreground hover:text-red-400 hover:border-red-500/30 transition-all"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          )}
        </div>

        {tickets.length === 0 ? (
          <div className="glass gradient-border rounded-3xl p-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50">
              <TicketIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No tickets yet</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              Browse events and complete a secure booking to generate your verified QR ticket.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-white neon-glow hover:scale-105 transition-transform"
            >
              Explore Events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <div key={ticket.bookingId} className="relative glass gradient-border rounded-2xl overflow-hidden animate-fade-in-up">
                <div className="flex flex-col sm:flex-row">
                  {/* Event image */}
                  <div className="relative sm:w-48 h-32 sm:h-auto shrink-0">
                    <img src={ticket.eventImage} alt={ticket.eventName} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent sm:bg-gradient-to-r" />
                  </div>

                  {/* Ticket info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-lg font-bold">{ticket.eventName}</h3>
                        <div className="text-xs text-muted-foreground mt-0.5">{ticket.dateLabel}</div>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 px-2.5 py-1 shrink-0">
                        <CheckCircle className="h-3 w-3 text-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-300">VERIFIED</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Venue
                        </div>
                        <div className="font-medium text-xs">{ticket.venue}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-0.5">Seats</div>
                        <div className="flex flex-wrap gap-1">
                          {ticket.seats.map((seat) => (
                            <span key={seat} className="rounded bg-blue-500/20 border border-blue-500/30 px-1.5 py-0.5 text-xs font-mono text-blue-300">
                              {seat}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-0.5">Booking ID</div>
                        <div className="font-mono text-xs font-semibold text-violet-300">{ticket.bookingId}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-0.5">Total</div>
                        <div className="font-bold text-sm">₹{ticket.total.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </div>

                  {/* QR code */}
                  <div className="flex flex-col items-center justify-center p-6 border-t sm:border-t-0 sm:border-l border-border/40">
                    <div className="rounded-lg p-2 bg-white">
                      <QRCode value={ticket.ticketId} size={90} />
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-muted-foreground text-center max-w-[100px] break-all">
                      {ticket.ticketId}
                    </div>
                  </div>
                </div>

                {/* Verified footer */}
                <div className="px-6 py-3 border-t border-border/40 flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 text-emerald-400" />
                  Cryptographically verified · Single-use · Protected by TicketTrap
                </div>
              </div>
            ))}

            <div className="text-center pt-4">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3 text-sm font-semibold text-foreground hover:border-violet-500/50 transition-all"
              >
                Book More Tickets
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
