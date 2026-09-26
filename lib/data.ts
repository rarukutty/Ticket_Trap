export type EventCategory = 'Music' | 'Tech' | 'Sports' | 'Business';

export interface EventData {
  id: string;
  name: string;
  category: EventCategory;
  image: string;
  date: string;
  dateLabel: string;
  venue: string;
  city: string;
  price: number;
  capacity: number;
  sold: number;
  remaining: number;
  description: string;
  gradient: string;
}

export const events: EventData[] = [
  {
    id: 'coldplay-2026',
    name: 'Coldplay Live',
    category: 'Music',
    image: 'https://images.pexels.com/photos/13230484/pexels-photo-13230484.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    date: '2026-10-15',
    dateLabel: 'Oct 15, 2026 · 7:00 PM',
    venue: 'Wankhede Arena',
    city: 'Mumbai, India',
    price: 3500,
    capacity: 5000,
    sold: 4842,
    remaining: 158,
    description: 'Experience the Music of the Spheres tour in an electrifying live performance under the stars. A night of immersive visuals, laser shows, and the band\'s biggest hits.',
    gradient: 'from-violet-600/30 via-fuchsia-600/20 to-cyan-500/30',
  },
  {
    id: 'techfest-2026',
    name: 'TechFest 2026',
    category: 'Tech',
    image: 'https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    date: '2026-11-08',
    dateLabel: 'Nov 8-10, 2026 · All Day',
    venue: 'Bombay Exhibition Centre',
    city: 'Mumbai, India',
    price: 1200,
    capacity: 3000,
    sold: 2100,
    remaining: 900,
    description: 'India\'s largest technology festival featuring keynotes from industry leaders, hands-on AI workshops, hackathons, and a startup showcase across three days of innovation.',
    gradient: 'from-cyan-500/30 via-blue-600/20 to-violet-600/30',
  },
  {
    id: 'ipl-final-2026',
    name: 'IPL Final 2026',
    category: 'Sports',
    image: 'https://images.pexels.com/photos/36293965/pexels-photo-36293965.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    date: '2026-05-28',
    dateLabel: 'May 28, 2026 · 7:30 PM',
    venue: 'Narendra Modi Stadium',
    city: 'Ahmedabad, India',
    price: 8000,
    capacity: 8000,
    sold: 7650,
    remaining: 350,
    description: 'The grand finale of the Indian Premier League. Witness the crowning of champions in the world\'s largest cricket stadium with 132,000 seats and floodlit drama.',
    gradient: 'from-orange-500/30 via-amber-500/20 to-red-600/30',
  },
  {
    id: 'startup-summit',
    name: 'Startup Summit',
    category: 'Business',
    image: 'https://images.pexels.com/photos/20733081/pexels-photo-20733081.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    date: '2026-09-12',
    dateLabel: 'Sep 12, 2026 · 9:00 AM',
    venue: 'Jio World Convention Centre',
    city: 'Mumbai, India',
    price: 2500,
    capacity: 2000,
    sold: 1200,
    remaining: 800,
    description: 'Connect with 500+ founders, 50+ investors, and industry veterans. Pitch sessions, fireside chats, and networking with the brightest minds in the Indian startup ecosystem.',
    gradient: 'from-emerald-500/30 via-teal-500/20 to-cyan-600/30',
  },
];

export const features = [
  {
    icon: 'ShieldCheck',
    title: 'Duplicate Booking Protection',
    description: 'Advanced fingerprinting detects and blocks the same user from booking multiple accounts simultaneously.',
    color: 'neon-purple',
  },
  {
    icon: 'Bot',
    title: 'Bot Detection',
    description: 'Behavioral analysis and challenge-response filters identify and reject automated booking attempts in real time.',
    color: 'neon-cyan',
  },
  {
    icon: 'Ticket',
    title: 'Ticket Limits',
    description: 'Enforce per-user ticket caps with atomic seat locks, ensuring fair distribution during high-demand sales.',
    color: 'neon-green',
  },
  {
    icon: 'Zap',
    title: 'Real-Time Inventory',
    description: 'Live seat availability updates across all users with sub-second latency, preventing overselling entirely.',
    color: 'neon-yellow',
  },
];

export const architectureSteps = [
  { icon: 'User', label: 'User', description: 'Customer requests booking' },
  { icon: 'Shield', label: 'Security Layer', description: 'Bot & duplicate detection' },
  { icon: 'CheckCircle', label: 'Booking Validation', description: 'Rules and limits enforced' },
  { icon: 'Lock', label: 'Seat Lock', description: 'Atomic 2-min hold' },
  { icon: 'CreditCard', label: 'Payment', description: 'Secure processing' },
  { icon: 'QrCode', label: 'Secure QR Ticket', description: 'Verified digital ticket' },
];

export function generateBookingId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'TT-';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export function generateTicketId(): string {
  const hex = '0123456789ABCDEF';
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += hex[Math.floor(Math.random() * 16)];
  }
  return id;
}

export interface ThreatEvent {
  id: string;
  type: 'bot' | 'duplicate' | 'rate-limit' | 'ticket-limit' | 'legitimate';
  message: string;
  timestamp: string;
  ip: string;
}

export const initialThreats: ThreatEvent[] = [
  { id: '1', type: 'bot', message: 'Automated request pattern detected — blocked', timestamp: '12:41:08', ip: '203.45.12.8' },
  { id: '2', type: 'legitimate', message: 'Booking confirmed — Coldplay Live — Seat A3', timestamp: '12:41:05', ip: '118.92.34.1' },
  { id: '3', type: 'duplicate', message: 'Same user detected across 3 accounts — blocked', timestamp: '12:40:59', ip: '45.67.89.2' },
  { id: '4', type: 'rate-limit', message: '147 requests/sec from single IP — throttled', timestamp: '12:40:52', ip: '91.23.45.6' },
  { id: '5', type: 'ticket-limit', message: 'User attempted to book 12 tickets — limit 4 enforced', timestamp: '12:40:44', ip: '172.16.8.4' },
  { id: '6', type: 'bot', message: 'Headless browser fingerprint detected — blocked', timestamp: '12:40:38', ip: '88.77.66.5' },
  { id: '7', type: 'legitimate', message: 'Booking confirmed — IPL Final — Seat C12', timestamp: '12:40:31', ip: '203.11.22.3' },
];

export const threatConfig = {
  'bot': { label: 'BOT DETECTED', color: 'neon-red', dot: 'bg-red-500', glow: 'shadow-red-500/50' },
  'duplicate': { label: 'DUPLICATE BOOKING BLOCKED', color: 'neon-orange', dot: 'bg-orange-500', glow: 'shadow-orange-500/50' },
  'rate-limit': { label: 'RATE LIMIT TRIGGERED', color: 'neon-yellow', dot: 'bg-yellow-500', glow: 'shadow-yellow-500/50' },
  'ticket-limit': { label: 'TICKET LIMIT EXCEEDED', color: 'neon-red', dot: 'bg-red-500', glow: 'shadow-red-500/50' },
  'legitimate': { label: 'LEGITIMATE BOOKING', color: 'neon-green', dot: 'bg-green-500', glow: 'shadow-green-500/50' },
};
