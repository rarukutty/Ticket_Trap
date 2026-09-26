'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft, Calendar, MapPin, IndianRupee, Lock, Clock,
  CheckCircle, AlertTriangle, ShieldCheck, Info,
} from 'lucide-react';
import { events } from '@/lib/data';

type SeatStatus = 'available' | 'selected' | 'sold' | 'locked';
interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
}

const ROWS = ['A', 'B', 'C', 'D', 'E'];
const SEATS_PER_ROW = 8;
const MAX_TICKETS = 4;
const LOCK_DURATION = 120; // 2 minutes

function generateSeats(): Seat[] {
  const seats: Seat[] = [];
  // Deterministic "sold" pattern for demo
  const soldSeats = new Set(['A1', 'A2', 'B3', 'B4', 'C5', 'C6', 'D1', 'D2', 'D8', 'E3', 'E4', 'E5']);
  const lockedSeats = new Set(['B8', 'C2']);

  for (const row of ROWS) {
    for (let n = 1; n <= SEATS_PER_ROW; n++) {
      const id = `${row}${n}`;
      let status: SeatStatus = 'available';
      if (soldSeats.has(id)) status = 'sold';
      else if (lockedSeats.has(id)) status = 'locked';
      seats.push({ id, row, number: n, status });
    }
  }
  return seats;
}

const seatColors: Record<SeatStatus, string> = {
  available: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 hover:scale-110 cursor-pointer',
  selected: 'bg-blue-500 border-blue-400 text-white scale-110 shadow-blue-500/50 shadow-lg cursor-pointer',
  sold: 'bg-zinc-700/40 border-zinc-600/30 text-zinc-500 cursor-not-allowed opacity-60',
  locked: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300 cursor-not-allowed',
};

const seatLegend: { status: SeatStatus; label: string; color: string }[] = [
  { status: 'available', label: 'Available', color: 'bg-emerald-500' },
  { status: 'selected', label: 'Selected', color: 'bg-blue-500' },
  { status: 'sold', label: 'Sold', color: 'bg-zinc-600' },
  { status: 'locked', label: 'Locked', color: 'bg-yellow-500' },
];

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;
  const event = useMemo(() => events.find((e) => e.id === eventId), [eventId]);

  const [seats, setSeats] = useState<Seat[]>(generateSeats);
  const [lockTime, setLockTime] = useState<number>(0);
  const [simulatedBotAttempt, setSimulatedBotAttempt] = useState(false);

  const selectedSeats = seats.filter((s) => s.status === 'selected');

  // Lock timer countdown
  useEffect(() => {
    if (lockTime <= 0) return;
    const interval = setInterval(() => {
      setLockTime((prev) => {
        if (prev <= 1) {
          // Lock expired — release selected seats
          setSeats((prevSeats) =>
            prevSeats.map((s) =>
              s.status === 'selected' ? { ...s, status: 'available' } : s
            )
          );
          toast.warning('Seat lock expired', { description: 'Your selected seats have been released.' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockTime]);

  // Simulate random seat updates (other users booking)
  useEffect(() => {
    const interval = setInterval(() => {
      setSeats((prev) => {
        const available = prev.filter((s) => s.status === 'available');
        if (available.length > 5 && Math.random() > 0.7) {
          const random = available[Math.floor(Math.random() * available.length)];
          return prev.map((s) =>
            s.id === random.id ? { ...s, status: 'sold' } : s
          );
        }
        return prev;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Simulate a bot detection event
  useEffect(() => {
    const t = setTimeout(() => {
      setSimulatedBotAttempt(true);
      toast.error('Bot attempt blocked', {
        description: 'Automated request from 45.67.89.2 was detected and blocked.',
      });
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  const handleSeatClick = useCallback((seat: Seat) => {
    if (seat.status === 'sold' || seat.status === 'locked') return;

    setSeats((prev) => {
      if (seat.status === 'selected') {
        // Deselect
        const newSeats = prev.map((s) =>
          s.id === seat.id ? { ...s, status: 'available' as SeatStatus } : s
        );
        const stillSelected = newSeats.filter((s) => s.status === 'selected');
        if (stillSelected.length === 0) {
          setLockTime(0);
        }
        return newSeats;
      }

      // Select — check max
      const currentlySelected = prev.filter((s) => s.status === 'selected');
      if (currentlySelected.length >= MAX_TICKETS) {
        toast.error(`Maximum ${MAX_TICKETS} tickets`, {
          description: 'Ticket limit enforced — you cannot select more than 4 seats.',
        });
        return prev;
      }

      // Start lock timer on first selection
      if (currentlySelected.length === 0) {
        setLockTime(LOCK_DURATION);
      }

      toast.success(`Seat ${seat.id} selected`, {
        description: 'Seat locked for 2 minutes. Complete checkout to confirm.',
      });

      return prev.map((s) =>
        s.id === seat.id ? { ...s, status: 'selected' as SeatStatus } : s
      );
    });
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const total = selectedSeats.length * (event?.price || 0);

  const handleCheckout = () => {
    if (selectedSeats.length === 0) return;
    const seatIds = selectedSeats.map((s) => s.id);
    const params = new URLSearchParams({ seats: seatIds.join(',') });
    router.push(`/events/${eventId}/checkout?${params.toString()}`);
  };

  if (!event) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Event not found.</p>
        <Link href="/events" className="text-violet-400 hover:underline">← Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Event info + seat map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event header */}
            <div className="glass gradient-border rounded-2xl overflow-hidden">
              <div className="relative h-48">
                <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient} z-10`} />
                <img src={event.image} alt={event.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-3">{event.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-violet-400" /> {event.dateLabel}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-violet-400" /> {event.venue}, {event.city}</span>
                  <span className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4 text-violet-400" /> {event.price.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            </div>

            {/* Seat map */}
            <div className="glass gradient-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Select Your Seats</h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="h-3.5 w-3.5" />
                  Max {MAX_TICKETS} tickets per booking
                </div>
              </div>

              {/* Stage */}
              <div className="mb-8 mx-auto max-w-md">
                <div className="rounded-t-[3rem] rounded-b-lg bg-gradient-to-b from-violet-600/30 to-transparent border border-violet-500/20 py-3 text-center text-xs font-mono text-violet-300 tracking-widest">
                  ── STAGE ──
                </div>
              </div>

              {/* Seats grid */}
              <div className="space-y-3 max-w-md mx-auto">
                {ROWS.map((row) => (
                  <div key={row} className="flex items-center justify-center gap-2">
                    <span className="w-6 text-xs font-mono text-muted-foreground text-right">{row}</span>
                    <div className="flex gap-1.5">
                      {seats
                        .filter((s) => s.row === row)
                        .map((seat) => (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.status === 'sold' || seat.status === 'locked'}
                            className={`h-9 w-9 rounded-lg border text-xs font-medium transition-all ${seatColors[seat.status]}`}
                            title={`Seat ${seat.id} — ${seat.status}`}
                          >
                            {seat.number}
                          </button>
                        ))}
                    </div>
                    <span className="w-6 text-xs font-mono text-muted-foreground">{row}</span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pt-6 border-t border-border/40">
                {seatLegend.map((item) => (
                  <div key={item.status} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className={`h-4 w-4 rounded border ${item.color}/40`} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking summary */}
          <div className="space-y-4">
            {/* Lock countdown */}
            {lockTime > 0 && (
              <div className="glass rounded-2xl p-5 border border-yellow-500/30 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-300">Seat temporarily locked</span>
                </div>
                <div className="text-3xl font-bold font-mono text-yellow-400">
                  {formatTime(lockTime)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Complete checkout before time runs out. Seats will be released automatically.
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="glass gradient-border rounded-2xl p-6 sticky top-20">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>

              {selectedSeats.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/50">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select seats from the map to begin your booking.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Selected Seats</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map((seat) => (
                        <span
                          key={seat.id}
                          className="rounded-lg bg-blue-500/20 border border-blue-500/40 px-3 py-1 text-sm font-mono font-semibold text-blue-300"
                        >
                          {seat.id}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tickets</span>
                    <span>{selectedSeats.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Price per ticket</span>
                    <span className="flex items-center"><IndianRupee className="h-3 w-3" />{event.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-border/40 pt-4 flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold gradient-text">
                      <IndianRupee className="inline h-5 w-5" />{total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3.5 text-sm font-semibold text-white neon-glow hover:scale-[1.02] transition-transform"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Proceed to Secure Checkout
                  </button>
                </div>
              )}

              {/* Security badges */}
              <div className="mt-6 pt-6 border-t border-border/40 space-y-2">
                {[
                  'Bot detection active',
                  'Duplicate booking prevention',
                  'Real-time inventory sync',
                ].map((badge) => (
                  <div key={badge} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated bot alert */}
            {simulatedBotAttempt && (
              <div className="glass rounded-2xl p-4 border border-red-500/30 animate-fade-in-up">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-red-300">Bot Attempt Blocked</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      An automated booking from 45.67.89.2 was detected and rejected in real time.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
