'use client';

import Link from 'next/link';
import { Calendar, MapPin, IndianRupee, Ticket, ArrowRight } from 'lucide-react';
import { events } from '@/lib/data';

const categoryStyles: Record<string, string> = {
  Music: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  Tech: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  Sports: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  Business: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
};

export default function EventsPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Upcoming <span className="gradient-text">Events</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse high-demand events protected by TicketTrap. Every booking is secured with anti-bot, anti-duplicate, and real-time inventory protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => {
            const soldPct = Math.round((event.sold / event.capacity) * 100);
            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group glass gradient-border rounded-2xl overflow-hidden hover:scale-[1.01] transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient} z-10`} />
                  <img
                    src={event.image}
                    alt={event.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 z-20">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${categoryStyles[event.category]}`}>
                      {event.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 z-20">
                    <span className="glass-strong text-xs font-mono px-3 py-1 rounded-full">
                      {event.remaining} tickets left
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-violet-300 transition-colors">
                    {event.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-violet-400" />
                      {event.dateLabel}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-violet-400" />
                      {event.venue}, {event.city}
                    </div>
                  </div>

                  {/* Capacity bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>{event.sold} / {event.capacity} sold</span>
                      <span>{soldPct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-primary transition-all"
                        style={{ width: `${soldPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-lg font-bold">
                        <IndianRupee className="h-4 w-4" />
                        {event.price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-muted-foreground">per ticket</div>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white group-hover:scale-105 transition-transform">
                      Book Now
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
