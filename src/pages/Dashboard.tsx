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
    default: 'bg-slate-100/10 text-slate-300 border-slate-700/40',
    success: 'bg-emerald-500/10 text-emerald-300 border-emerald-600/30',
    warn:    'bg-amber-500/10 text-amber-300 border-amber-600/30',
    danger:  'bg-red-500/10 text-red-300 border-red-600/30',
  } as const;
  return (
    <span
      className={cls(
        'inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded-md border whitespace-nowrap tracking-wide',
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
      className="min-h-11 min-w-11 sm:min-h-0 sm:min-w-0 flex items-center justify-center gap-2
                 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors duration-200"
    >
      {state === 'copied' ? (
        <>
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-emerald-400 hidden sm:inline">Copied</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      'relative rounded-lg border p-5 transition-all duration-200',
      'hover:shadow-lg hover:shadow-slate-900/50',
      accent 
        ? 'bg-gradient-to-br from-slate-800/40 to-slate-900/60 border-slate-700/60' 
        : 'bg-slate-900/40 border-slate-800/60 backdrop-blur-sm',
    )}>
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-3">
        {label}
      </p>
      <p className={cls('font-semibold text-xl leading-tight', accent ? 'text-white' : 'text-slate-100')}>
        {value}
      </p>
      {sub && <p className="mt-2 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

/* ─── Background ─────────────────────────────────────────────── */
function GridBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.02]">
        <defs>
          <pattern id="grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    </div>
  );
}

/* ─── Token card ─────────────────────────────────────────────── */
function TokenField({ token }: { token: string | null }) {
  const [visible, setVisible] = useState(false);

  const preview = token
    ? visible
      ? token
      : `${token.slice(0, 16)}${'•'.repeat(16)}${token.slice(-6)}`
    : '—';

  return (
    <div className="rounded-lg border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm overflow-hidden 
                    hover:border-slate-700/60 hover:shadow-lg hover:shadow-slate-900/50 transition-all duration-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60 gap-2 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">
              ID Token (JWT)
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Authentication credential</p>
          </div>
          <Pill variant="success">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Valid
          </Pill>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setVisible(v => !v)}
            className="min-h-11 min-w-11 sm:min-h-0 sm:min-w-0 px-3 py-1.5 rounded-md
                       text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50
                       transition-colors border border-slate-800/60"
          >
            {visible ? 'Hide' : 'Reveal'}
          </button>
          {token && <CopyButton text={token} label="token" />}
        </div>
      </div>

      <div className="px-5 py-5 bg-slate-950/60 overflow-x-auto">
        <p className="font-mono text-xs text-slate-300 break-all leading-relaxed">
          {preview}
        </p>
      </div>

      <div className="px-5 py-3 border-t border-slate-800/60 bg-slate-900/30">
        <p className="text-xs text-slate-500 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
          </svg>
          Stored in localStorage['secure_auth_token']
        </p>
      </div>
    </div>
  );
}

/* ─── Activity timeline ──────────────────────────────────────── */
const EVENTS = [
  { time: 'Just now',  label: 'Authenticated via Firebase Phone', color: 'bg-emerald-400' },
  { time: '2 min ago', label: 'OTP verified successfully',        color: 'bg-blue-400' },
  { time: '4 min ago', label: 'Session token issued',             color: 'bg-violet-400' },
  { time: '9 min ago', label: 'Phone number confirmed',           color: 'bg-slate-500' },
];

function Timeline() {
  return (
    <div className="rounded-lg border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm overflow-hidden 
                    hover:border-slate-700/60 hover:shadow-lg hover:shadow-slate-900/50 transition-all duration-200">
      <div className="px-5 py-4 border-b border-slate-800/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">Recent Activity</p>
          <p className="text-xs text-slate-500 mt-0.5">Session events log</p>
        </div>
      </div>
      <ul className="divide-y divide-slate-800/40">
        {EVENTS.map((e, i) => (
          <li key={i} className="flex items-start gap-4 px-5 py-4">
            <div className="mt-1 shrink-0 flex flex-col items-center">
              <span className={cls('w-2 h-2 rounded-full', e.color)} />
              {i < EVENTS.length - 1 && (
                <span className="w-0.5 bg-slate-800/60 mt-2 min-h-4 flex-1" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-200 leading-snug">{e.label}</p>
              <p className="text-xs text-slate-500 mt-1">{e.time}</p>
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
    <div className="rounded-lg border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm overflow-hidden 
                    hover:border-slate-700/60 hover:shadow-lg hover:shadow-slate-900/50 transition-all duration-200">
      <div className="px-5 py-4 border-b border-slate-800/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">Quick Actions</p>
          <p className="text-xs text-slate-500 mt-0.5">Manage your session</p>
        </div>
      </div>
      <div className="p-4 space-y-2">
        {ACTIONS.map(({ icon, label, sub, danger }) => (
          <button
            key={label}
            className={cls(
              'w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-left',
              'border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-14',
              danger
                ? 'border-red-900/40 bg-red-950/20 hover:bg-red-950/30 hover:border-red-800/50 text-red-300'
                : 'border-slate-800/60 bg-slate-800/20 hover:bg-slate-800/40 hover:border-slate-700/60 text-slate-200',
            )}
          >
            <span className="text-xl shrink-0">{icon}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium leading-tight">{label}</p>
              <p className="text-xs text-slate-500 mt-1">{sub}</p>
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
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <GridBg />

      {/* ── Sticky Header ── */}
      <header className="relative z-10 sticky top-0 border-b border-slate-800/60 backdrop-blur-xl bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 
                            border border-slate-700/50 flex items-center justify-center">
              <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <span className="text-base font-semibold tracking-tight text-white">SecureAuth</span>
              <span className="hidden sm:inline text-slate-600 text-sm ml-2">/ Dashboard</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Status pill */}
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium
                             rounded-md border bg-emerald-500/10 text-emerald-300 border-emerald-600/30 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="hidden sm:inline">Authenticated</span>
              <span className="sm:hidden">Active</span>
            </span>

            {/* Sign out */}
            <button
              onClick={signOut}
              aria-label="Sign out"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 min-h-9
                         text-xs font-medium text-slate-300 border border-slate-800/60 rounded-lg
                         hover:bg-slate-800/40 hover:text-white hover:border-slate-700/60
                         transition-all duration-200"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8">

        {/* Hero */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
              Welcome back
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {displayName}
            </h1>
            <p className="mt-2 text-sm text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Session active · Firebase Phone Auth
            </p>
          </div>
          <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl
                          bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-slate-700/50
                          flex items-center justify-center text-lg sm:text-xl font-semibold text-white shadow-lg">
            {initials}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard label="Provider"    value="Firebase"           sub="Phone Auth"  />
          <StatCard label="Status"      value="Active"             sub="Token valid" accent />
          <StatCard label="Auth events" value={<CountUp to={4} />} sub="This session" />
          <StatCard label="Phone"       value={user?.phoneNumber ?? '—'} />
        </div>

        {/* UID */}
        <div className="rounded-lg border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm overflow-hidden 
                        hover:border-slate-700/60 hover:shadow-lg hover:shadow-slate-900/50 transition-all duration-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">User UID</p>
                <p className="text-xs text-slate-500 mt-0.5">Unique identifier</p>
              </div>
            </div>
            <CopyButton text={uid} label="UID" />
          </div>
          <div className="px-5 py-5 overflow-x-auto bg-slate-950/60">
            <p className="font-mono text-sm text-slate-300 break-all">{uid}</p>
          </div>
        </div>

        {/* Token */}
        <TokenField token={token} />

        {/* Bottom grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <Timeline />
          <QuickActions />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 border-t border-slate-800/50">
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
          <p className="text-xs text-slate-600">SecureAuth · Powered by Firebase Authentication SDK</p>
          <p className="text-xs text-slate-600">
            {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;