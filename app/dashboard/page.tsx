'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Activity, Shield, Bot, Copy, Ticket, Zap, TrendingUp,
  AlertTriangle, CheckCircle, XCircle, Clock, Cpu, Gauge,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar,
} from 'recharts';
import { initialThreats, threatConfig, ThreatEvent } from '@/lib/data';

const stats = [
  { label: 'Total Requests', value: 12481, icon: Activity, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/30' },
  { label: 'Successful Bookings', value: 1842, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  { label: 'Bots Blocked', value: 3241, icon: Bot, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
  { label: 'Duplicate Attempts', value: 782, icon: Copy, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  { label: 'Tickets Remaining', value: 158, icon: Ticket, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
];

const trafficData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  legit: Math.floor(40 + Math.random() * 80 + (i > 8 && i < 22 ? 60 : 0)),
  bots: Math.floor(20 + Math.random() * 120 + (i > 10 && i < 20 ? 50 : 0)),
}));

const attackData = [
  { name: 'Bots', value: 3241, fill: 'hsl(0 80% 58%)' },
  { name: 'Duplicates', value: 782, fill: 'hsl(25 95% 58%)' },
  { name: 'Rate Limited', value: 1456, fill: 'hsl(43 95% 60%)' },
  { name: 'Legitimate', value: 1842, fill: 'hsl(145 70% 50%)' },
];

const radialData = [
  { name: 'Blocked', value: 71, fill: 'hsl(271 85% 65%)' },
];

const threatMessages: Record<string, string[]> = {
  'bot': [
    'Automated request pattern detected — blocked',
    'Headless browser fingerprint detected — blocked',
    'ML model flagged suspicious behavior — blocked',
    'CAPTCHA bypass attempt detected — blocked',
    'Request frequency exceeds human rate — blocked',
  ],
  'duplicate': [
    'Same user detected across 3 accounts — blocked',
    'Device fingerprint match found — blocked',
    'Duplicate session from same IP — blocked',
    'Payment method reuse detected — blocked',
  ],
  'rate-limit': [
    '147 requests/sec from single IP — throttled',
    'API burst detected — rate limited',
    'Connection flood from 92.x.x.x — throttled',
    'Queue depth exceeded — requests queued',
  ],
  'ticket-limit': [
    'User attempted to book 12 tickets — limit 4 enforced',
    'Cart overflow detected — capped at 4',
    'Bulk selection flagged — limit enforced',
  ],
  'legitimate': [
    'Booking confirmed — Coldplay Live — Seat A3',
    'Booking confirmed — IPL Final — Seat C12',
    'Booking confirmed — TechFest 2026 — Seat B7',
    'Booking confirmed — Startup Summit — Seat D5',
  ],
};

const randomIp = () => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
const randomTime = () => {
  const h = Math.floor(Math.random() * 24).toString().padStart(2, '0');
  const m = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  const s = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

function generateThreat(): ThreatEvent {
  const types: ThreatEvent['type'][] = ['bot', 'bot', 'duplicate', 'rate-limit', 'ticket-limit', 'legitimate', 'legitimate'];
  const type = types[Math.floor(Math.random() * types.length)];
  const messages = threatMessages[type];
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    message: messages[Math.floor(Math.random() * messages.length)],
    timestamp: randomTime(),
    ip: randomIp(),
  };
}

export default function DashboardPage() {
  const [threats, setThreats] = useState<ThreatEvent[]>(initialThreats);
  const [simulating, setSimulating] = useState(false);
  const [simData, setSimData] = useState({
    requests: 0,
    legit: 0,
    bots: 0,
    duplicates: 0,
    sold: 0,
    remaining: 158,
  });
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const threatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const counterRef = useRef(0);

  // Live threat feed
  useEffect(() => {
    threatIntervalRef.current = setInterval(() => {
      setThreats((prev) => {
        const newThreat = generateThreat();
        return [newThreat, ...prev].slice(0, 15);
      });
    }, 3500);
    return () => {
      if (threatIntervalRef.current) clearInterval(threatIntervalRef.current);
    };
  }, []);

  const startSimulation = useCallback(() => {
    if (simulating) return;
    setSimulating(true);
    setSimData({ requests: 0, legit: 0, bots: 0, duplicates: 0, sold: 0, remaining: 158 });
    counterRef.current = 0;

    toast.info('Flash sale simulation started', {
      description: 'Simulating 1000 concurrent users attempting to book...',
    });

    simIntervalRef.current = setInterval(() => {
      counterRef.current += 1;
      setSimData((prev) => {
        const tickRequests = Math.floor(20 + Math.random() * 60);
        const tickBots = Math.floor(tickRequests * (0.35 + Math.random() * 0.15));
        const tickDuplicates = Math.floor(tickRequests * (0.08 + Math.random() * 0.07));
        const tickLegit = tickRequests - tickBots - tickDuplicates;
        const tickSold = Math.min(prev.remaining, Math.floor(tickLegit * 0.3));

        const newRequests = prev.requests + tickRequests;
        const newBots = prev.bots + tickBots;
        const newDuplicates = prev.duplicates + tickDuplicates;
        const newLegit = prev.legit + tickLegit;
        const newSold = prev.sold + tickSold;
        const newRemaining = Math.max(0, prev.remaining - tickSold);

        // Add threats during simulation
        if (counterRef.current % 2 === 0) {
          setThreats((prevThreats) => {
            const newThreat = generateThreat();
            return [newThreat, ...prevThreats].slice(0, 15);
          });
        }

        return {
          requests: newRequests,
          legit: newLegit,
          bots: newBots,
          duplicates: newDuplicates,
          sold: newSold,
          remaining: newRemaining,
        };
      });

      if (counterRef.current >= 20) {
        if (simIntervalRef.current) clearInterval(simIntervalRef.current);
        setSimulating(false);
        const result = simData;
        toast.success('Flash sale simulation complete', {
          description: `${result.sold} tickets sold fairly. ${result.bots} bots blocked. Zero overselling.`,
        });
      }
    }, 500);
  }, [simulating, simData]);

  useEffect(() => {
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/30 px-3 py-1 text-xs font-semibold text-red-400 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
              </span>
              LIVE MONITORING
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">
              Security <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Real-time threat detection and booking integrity monitoring</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className={`glass rounded-2xl border p-5 ${stat.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground/50" />
              </div>
              <div className="text-2xl font-bold font-mono">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Traffic chart */}
          <div className="lg:col-span-2 glass gradient-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Traffic Analysis (24h)</h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Legitimate</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> Bots</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorLegit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(145 70% 50%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(145 70% 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBots" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0 80% 58%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(0 80% 58%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="hsl(215 20% 50%)" fontSize={10} tickLine={false} axisLine={false} interval={3} />
                <YAxis stroke="hsl(215 20% 50%)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(230 35% 7%)',
                    border: '1px solid hsl(240 30% 18%)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="legit" stroke="hsl(145 70% 50%)" strokeWidth={2} fill="url(#colorLegit)" />
                <Area type="monotone" dataKey="bots" stroke="hsl(0 80% 58%)" strokeWidth={2} fill="url(#colorBots)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Attack distribution */}
          <div className="glass gradient-border rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Threat Distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={attackData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {attackData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} stroke="hsl(230 35% 7%)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(230 35% 7%)',
                    border: '1px solid hsl(240 30% 18%)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {attackData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: item.fill }} />
                    {item.name}
                  </span>
                  <span className="font-mono text-muted-foreground">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flash sale simulator */}
        <div className="glass gradient-border rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Flash Sale Simulator
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Simulate 1,000 users attempting to book simultaneously. Watch TicketTrap prevent abuse in real time.
              </p>
            </div>
            <button
              onClick={startSimulation}
              disabled={simulating}
              className={`inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-all ${
                simulating
                  ? 'bg-secondary text-muted-foreground cursor-wait'
                  : 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white hover:scale-105 shadow-lg shadow-orange-500/30'
              }`}
            >
              <Zap className="h-5 w-5" />
              {simulating ? 'SIMULATING...' : 'SIMULATE FLASH SALE'}
            </button>
          </div>

          {/* Live counters */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Requests', value: simData.requests, icon: Activity, color: 'text-violet-400' },
              { label: 'Legitimate', value: simData.legit, icon: CheckCircle, color: 'text-emerald-400' },
              { label: 'Bots Blocked', value: simData.bots, icon: Bot, color: 'text-red-400' },
              { label: 'Duplicates Blocked', value: simData.duplicates, icon: Copy, color: 'text-orange-400' },
              { label: 'Tickets Sold', value: simData.sold, icon: Ticket, color: 'text-cyan-400' },
              { label: 'Remaining', value: simData.remaining, icon: Shield, color: 'text-yellow-400' },
            ].map((counter) => (
              <div key={counter.label} className={`rounded-xl border border-border/40 bg-secondary/20 p-4 ${simulating ? 'animate-shimmer' : ''}`}>
                <counter.icon className={`h-4 w-4 ${counter.color} mb-2`} />
                <div className={`text-xl font-bold font-mono ${simulating ? 'animate-count-up' : ''}`}>
                  {counter.value.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{counter.label}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          {simulating && (
            <div className="mt-4">
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 transition-all duration-500"
                  style={{ width: `${(counterRef.current / 20) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Result banner */}
          {!simulating && simData.requests > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 animate-fade-in-up">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span className="text-sm text-emerald-300">
                <span className="font-semibold">{simData.sold} tickets sold fairly.</span> {simData.bots} bots blocked, {simData.duplicates} duplicate attempts prevented. <span className="font-bold">Zero overselling.</span>
              </span>
            </div>
          )}
        </div>

        {/* Live threat monitor */}
        <div className="glass gradient-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Live Threat Monitor
            </h3>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Real-time stream
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {threats.map((threat) => {
              const config = threatConfig[threat.type];
              return (
                <div
                  key={threat.id}
                  className={`flex items-center gap-3 rounded-xl border border-border/40 bg-secondary/20 p-3 animate-slide-in-right`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${config.dot} shrink-0 animate-blink`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${config.color === 'neon-red' ? 'text-red-400' : config.color === 'neon-orange' ? 'text-orange-400' : config.color === 'neon-yellow' ? 'text-yellow-400' : 'text-emerald-400'}`}>
                        {config.label}
                      </span>
                    </div>
                    <div className="text-sm text-foreground truncate">{threat.message}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono text-muted-foreground">{threat.ip}</div>
                    <div className="text-xs text-muted-foreground/70">{threat.timestamp}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
