import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/* ─── Utility ───────────────────────────────────────────────── */
const cls = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

/* ─── Pill badge ────────────────────────────────────────────── */
function Pill({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warn' | 'danger';
}) {
  const map = {
    default: 'bg-slate-800 text-slate-400 border-slate-700',
    success: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
    warn:    'bg-amber-950/60  text-amber-400  border-amber-800/50',
    danger:  'bg-red-950/60    text-red-400    border-red-800/50',
  } as const;
  return (
    <span
      className={cls(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono rounded-full border whitespace-nowrap',
        map[variant],
      )}
    >
      {children}
    </span>
  );
}

/* ─── Copy button ───────────────────────────────────────────── */
function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<'idle' | 'copied'>('idle');

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setState('copied');
    setTimeout(() => setState('idle'), 2000);
  };

  return (
    <button
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="min-h-11 min-w-11 sm:min-h-0 sm:min-w-0 flex items-center justify-center gap-1
                 text-xs font-mono text-slate-600 hover:text-cyan-400 transition-all duration-200"
    >
      {state === 'copied' ? (
        <>
          <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-emerald-400 hidden sm:inline">Copied</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="hidden sm:inline">Copy</span>
        </>
      )}
    </button>
  );
}

/* ─── Animated counter ──────────────────────────────────────── */
function CountUp({ to, duration = 900 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to, duration]);
  return <>{val}</>;
}

/* ─── Stat card ─────────────────────────────────────────────── */
function StatCard({
  label, value, sub, accent = false,
}: {
  label: string; value: React.ReactNode; sub?: string; accent?: boolean;
}) {
  return (
    <div className={cls(
      'relative rounded-2xl border p-4 sm:p-5 transition-all duration-300',
      'hover:border-slate-600 hover:-translate-y-0.5 active:scale-[0.98]',
      accent ? 'bg-cyan-950/20 border-cyan-800/40' : 'bg-slate-900/60 border-slate-800',
    )}>
      <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 mb-2 sm:mb-3">
        {label}
      </p>
      <p className={cls('font-mono font-semibold text-lg sm:text-xl truncate', accent ? 'text-cyan-300' : 'text-white')}>
        {value}
      </p>
      {sub && <p className="mt-1 text-[10px] font-mono text-slate-600 truncate">{sub}</p>}
    </div>
  );
}

/* ─── Background ─────────────────────────────────────────────── */
function GridBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.025]">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#67e8f9" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="absolute -top-40 -left-40 w-100 sm:w-150 h-100 sm:h-150 bg-cyan-500/5 rounded-full blur-[100px] sm:blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-100 sm:w-150 h-100 sm:h-150 bg-violet-600/5 rounded-full blur-[80px] sm:blur-[100px]" />
    </div>
  );
}

/* ─── Token card ─────────────────────────────────────────────── */
function TokenField({ token }: { token: string | null }) {
  const [visible, setVisible] = useState(false);

  const preview = token
    ? visible
      ? token
      : `${token.slice(0, 16)}${'·'.repeat(16)}${token.slice(-6)}`
    : '—';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-800 gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-500 truncate">
            ID Token (JWT)
          </span>
          <Pill variant="success">
            <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block animate-pulse" />
            Valid
          </Pill>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <button
            onClick={() => setVisible(v => !v)}
            className="min-h-11 min-w-11 sm:min-h-0 sm:min-w-0 flex items-center justify-center
                       text-xs font-mono text-slate-500 hover:text-white transition-colors px-1"
          >
            {visible ? 'Hide' : 'Reveal'}
          </button>
          {token && <CopyButton text={token} label="token" />}
        </div>
      </div>

      <div className="px-4 sm:px-5 py-4 bg-slate-950/40 overflow-x-auto">
        <p className="font-mono text-[11px] sm:text-xs text-cyan-400/70 break-all leading-relaxed tracking-wide">
          {preview}
        </p>
      </div>

      <div className="px-4 sm:px-5 py-2.5 border-t border-slate-800 bg-slate-900/30">
        <p className="text-[10px] sm:text-[11px] font-mono text-slate-600 truncate">
          Stored in{' '}
          <code className="text-slate-500 bg-slate-800/60 px-1 py-0.5 rounded text-[10px]">
            localStorage['secure_auth_token']
          </code>
        </p>
      </div>
    </div>
  );
}

/* ─── Activity timeline ──────────────────────────────────────── */
const EVENTS = [
  { time: 'Just now',  label: 'Authenticated via Firebase Phone', color: 'bg-emerald-400' },
  { time: '2 min ago', label: 'OTP verified successfully',        color: 'bg-cyan-400' },
  { time: '4 min ago', label: 'Session token issued',             color: 'bg-violet-400' },
  { time: '9 min ago', label: 'Phone number confirmed',           color: 'bg-slate-500' },
];

function Timeline() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition-colors">
      <div className="px-4 sm:px-5 py-3 border-b border-slate-800 flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">Recent Activity</span>
      </div>
      <ul className="divide-y divide-slate-800/60">
        {EVENTS.map((e, i) => (
          <li key={i} className="flex items-start gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5">
            <div className="mt-1.5 shrink-0 flex flex-col items-center">
              <span className={cls('w-2 h-2 rounded-full', e.color, i === 0 ? 'animate-pulse' : '')} />
              {i < EVENTS.length - 1 && (
                <span className="w-px bg-slate-800 mt-1.5 min-h-3.5 flex-1" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-slate-300 font-mono leading-snug">{e.label}</p>
              <p className="text-[10px] sm:text-xs text-slate-600 font-mono mt-0.5">{e.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Quick actions ──────────────────────────────────────────── */
const ACTIONS = [
  { icon: '🔄', label: 'Refresh Token',     sub: 'Force re-issue JWT',    danger: false },
  { icon: '📋', label: 'Copy Session Info', sub: 'UID + token bundle',    danger: false },
  { icon: '🚪', label: 'Revoke Session',    sub: 'Invalidate all tokens', danger: true  },
];

function QuickActions() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition-colors">
      <div className="px-4 sm:px-5 py-3 border-b border-slate-800 flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">Quick Actions</span>
      </div>
      <div className="p-2 sm:p-3 space-y-2">
        {ACTIONS.map(({ icon, label, sub, danger }) => (
          <button
            key={label}
            className={cls(
              'w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl text-left font-mono',
              'border transition-all duration-200 active:scale-[0.98] min-h-13',
              danger
                ? 'border-red-900/40 bg-red-950/10 hover:bg-red-950/30 hover:border-red-800/50 text-red-400'
                : 'border-slate-800 bg-slate-800/30 hover:bg-slate-800 hover:border-slate-700 text-slate-300',
            )}
          >
            <span className="text-base shrink-0">{icon}</span>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm leading-tight truncate">{label}</p>
              <p className="text-[10px] text-slate-600 mt-0.5 truncate">{sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN DASHBOARD ─────────────────────────────────────────── */
const Dashboard: React.FC = () => {
  const { user, token, signOut } = useAuth();

  const uid         = user?.uid ?? '—';
  const displayName = user?.displayName ?? user?.phoneNumber ?? 'User';
  const initials    = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#080c14] text-white font-['JetBrains_Mono','Fira_Code',monospace] antialiased">
      <GridBg />

      {/* ── Sticky Header ── */}
      <header className="relative z-10  top-0 border-b border-slate-800/80 backdrop-blur-sm bg-slate-950/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-7 h-7 shrink-0 rounded-lg bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">SecureAuth</span>
            <span className="hidden sm:block text-slate-700 text-xs">/ dashboard</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Status pill — short label on mobile */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono
                             rounded-full border bg-emerald-950/60 text-emerald-400 border-emerald-800/50 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Authenticated</span>
              <span className="sm:hidden">Live</span>
            </span>

            {/* Sign out — icon only on mobile */}
            <button
              onClick={signOut}
              aria-label="Sign out"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-9
                         text-xs font-mono text-slate-400 border border-slate-800 rounded-lg
                         hover:bg-slate-800 hover:text-white hover:border-slate-700
                         transition-all duration-200 active:scale-95"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5 sm:space-y-8">

        {/* Hero */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-slate-600 mb-1.5 sm:mb-2">
              Welcome back
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight truncate">
              {displayName}
            </h1>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-mono text-slate-500">
              Session active · Firebase Phone Auth
            </p>
          </div>
          <div className="shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl
                          bg-linear-to-br from-cyan-500/20 to-violet-500/20 border border-slate-700
                          flex items-center justify-center text-base sm:text-lg font-semibold text-white">
            {initials}
          </div>
        </div>

        {/* Stats — 2 cols mobile, 4 cols sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <StatCard label="Provider"    value="Firebase"           sub="Phone Auth"  />
          <StatCard label="Status"      value="Active"             sub="Token valid" accent />
          <StatCard label="Auth events" value={<CountUp to={4} />} sub="This session" />
          <StatCard label="Phone"       value={user?.phoneNumber ?? '—'} />
        </div>

        {/* UID */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">User UID</span>
            </div>
            <CopyButton text={uid} label="UID" />
          </div>
          <div className="px-4 sm:px-5 py-4 overflow-x-auto">
            <p className="font-mono text-xs sm:text-sm text-white break-all">{uid}</p>
          </div>
        </div>

        {/* Token */}
        <TokenField token={token} />

        {/* Bottom grid — stacks on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <Timeline />
          <QuickActions />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 border-t border-slate-800/50">
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1">
          <p className="text-[10px] sm:text-[11px] font-mono text-slate-700">SecureAuth · Firebase Auth SDK</p>
          <p className="text-[10px] sm:text-[11px] font-mono text-slate-700">
            {new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;