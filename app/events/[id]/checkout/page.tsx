'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  ArrowLeft, ShieldCheck, CheckCircle, Loader2, IndianRupee,
  Lock, Sparkles, Ticket as TicketIcon,
} from 'lucide-react';
import { events } from '@/lib/data';
import { useTickets } from '@/hooks/use-tickets';

const verificationSteps = [
  { label: 'Checking ticket limit', description: 'Enforcing 4 tickets max per user' },
  { label: 'Checking duplicate booking', description: 'Cross-referencing user fingerprint' },
  { label: 'Checking seat availability', description: 'Validating atomic seat locks' },
  { label: 'Checking suspicious activity', description: 'Behavioral pattern analysis' },
  { label: 'Inventory locked', description: 'Seats secured and committed' },
];

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = params?.id as string;
  const event = events.find((e) => e.id === eventId);
  const seatParam = searchParams?.get('seats') || '';
  const seats = seatParam ? seatParam.split(',') : [];

  const { addTicket } = useTickets();

  const [phase, setPhase] = useState<'verifying' | 'verified' | 'confirmed'>('verifying');
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmedTicket, setConfirmedTicket] = useState<{
    bookingId: string;
    ticketId: string;
  } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase !== 'verifying') return;

    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= verificationSteps.length - 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => setPhase('verified'), 600);
          return prev;
        }
        return prev + 1;
      });
    }, 900);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase]);

  const handleConfirm = () => {
    if (!event || seats.length === 0) return;

    // Simulate duplicate booking detection (random)
    if (Math.random() > 0.85) {
      toast.error('Duplicate booking detected', {
        description: 'This user fingerprint has already booked this event.',
      });
      return;
    }

    const ticket = addTicket({
      eventId: event.id,
      eventName: event.name,
      eventImage: event.image,
      date: event.date,
      dateLabel: event.dateLabel,
      venue: event.venue,
      city: event.city,
      seats,
      pricePerSeat: event.price,
      total: seats.length * event.price,
    });

    setConfirmedTicket({ bookingId: ticket.bookingId, ticketId: ticket.ticketId });
    setPhase('confirmed');
    toast.success('Booking confirmed!', {
      description: `Booking ID: ${ticket.bookingId}`,
    });

    setTimeout(() => {
      router.push(`/events/${eventId}/ticket?booking=${ticket.bookingId}`);
    }, 2500);
  };

  if (!event || seats.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">No seats selected. Please choose an event and select seats.</p>
        <button
          onClick={() => router.push('/events')}
          className="text-violet-400 hover:underline"
        >
          Browse Events
        </button>
      </div>
    );
  }

  const total = seats.length * event.price;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => router.push(`/events/${eventId}`)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Seat Selection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Verification panel */}
          <div className="lg:col-span-3">
            <div className="glass gradient-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary neon-glow">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Secure Checkout</h1>
                  <p className="text-sm text-muted-foreground">Multi-layer security verification</p>
                </div>
              </div>

              {phase !== 'confirmed' ? (
                <div className="space-y-4">
                  {verificationSteps.map((step, i) => {
                    const status =
                      i < currentStep ? 'done' :
                      i === currentStep && phase === 'verifying' ? 'active' :
                      phase === 'verified' ? 'done' : 'pending';

                    return (
                      <div
                        key={step.label}
                        className={`flex items-start gap-3 rounded-xl border p-4 transition-all duration-500 ${
                          status === 'done'
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : status === 'active'
                            ? 'border-violet-500/40 bg-violet-500/5 animate-shimmer'
                            : 'border-border/40 bg-secondary/20 opacity-40'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {status === 'done' ? (
                            <CheckCircle className="h-5 w-5 text-emerald-400 animate-count-up" />
                          ) : status === 'active' ? (
                            <Loader2 className="h-5 w-5 text-violet-400 animate-spin" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                          )}
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${status === 'done' ? 'text-emerald-300' : status === 'active' ? 'text-violet-300' : 'text-muted-foreground'}`}>
                            {step.label}
                          </div>
                          {status !== 'pending' && (
                            <div className="text-xs text-muted-foreground mt-0.5">{step.description}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {phase === 'verified' && (
                    <div className="mt-6 animate-fade-in-up">
                      <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 mb-6">
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-300">
                          All security checks passed. Your booking is ready to confirm.
                        </span>
                      </div>

                      <button
                        onClick={handleConfirm}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary py-4 text-base font-semibold text-white neon-glow hover:scale-[1.02] transition-transform"
                      >
                        <Lock className="h-5 w-5" />
                        Confirm Secure Booking
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Confirmed animation */
                <div className="flex flex-col items-center justify-center py-12 animate-fade-in-up">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/20 border-2 border-emerald-500/50">
                      <CheckCircle className="h-12 w-12 text-emerald-400" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mt-6 mb-2">Booking Confirmed!</h2>
                  <p className="text-muted-foreground text-sm mb-1">Booking ID: <span className="font-mono text-foreground">{confirmedTicket?.bookingId}</span></p>
                  <p className="text-muted-foreground text-sm mb-4">Generating your secure QR ticket...</p>
                  <div className="flex items-center gap-2 text-violet-400 text-sm">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Redirecting to your ticket...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-2">
            <div className="glass gradient-border rounded-2xl p-6 sticky top-20">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/40">
                <img src={event.image} alt={event.name} className="h-14 w-14 rounded-lg object-cover" />
                <div>
                  <div className="font-semibold text-sm">{event.name}</div>
                  <div className="text-xs text-muted-foreground">{event.dateLabel}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Seats</div>
                  <div className="flex flex-wrap gap-2">
                    {seats.map((seat) => (
                      <span key={seat} className="rounded-lg bg-blue-500/20 border border-blue-500/40 px-2.5 py-1 text-xs font-mono font-semibold text-blue-300">
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tickets</span>
                  <span>{seats.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price each</span>
                  <span className="flex items-center"><IndianRupee className="h-3 w-3" />{event.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Processing fee</span>
                  <span className="text-emerald-400">FREE</span>
                </div>
                <div className="border-t border-border/40 pt-3 flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold gradient-text">
                    <IndianRupee className="inline h-5 w-5" />{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/40">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <TicketIcon className="h-3.5 w-3.5 text-violet-400" />
                  Protected by TicketTrap Security
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  {['256-bit encryption', 'Bot detection', 'Anti-duplicate', 'Atomic locks'].map((item) => (
                    <div key={item} className="flex items-center gap-1.5">
                      <CheckCircle className="h-3 w-3 text-emerald-400 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
