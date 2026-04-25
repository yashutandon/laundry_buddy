import React, { useState } from 'react';

interface PhoneStepProps {
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  onSend: () => void;
  loading: boolean;
  error: string;
}

const COUNTRY_CODES = [
  { code: '+1',   flag: '🇺🇸', name: 'US'  },
  { code: '+44',  flag: '🇬🇧', name: 'UK'  },
  { code: '+91',  flag: '🇮🇳', name: 'IN'  },
  { code: '+61',  flag: '🇦🇺', name: 'AU'  },
  { code: '+49',  flag: '🇩🇪', name: 'DE'  },
  { code: '+33',  flag: '🇫🇷', name: 'FR'  },
  { code: '+81',  flag: '🇯🇵', name: 'JP'  },
  { code: '+86',  flag: '🇨🇳', name: 'CN'  },
  { code: '+55',  flag: '🇧🇷', name: 'BR'  },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
];

const PhoneStep: React.FC<PhoneStepProps> = ({
  phoneNumber, setPhoneNumber, onSend, loading, error,
}) => {
  const [selectedCode, setSelectedCode] = useState('+91');
  const [localNumber, setLocalNumber]   = useState('');
  const [ddOpen, setDdOpen]             = useState(false);

  const handleNumberChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 12);
    setLocalNumber(cleaned);
    setPhoneNumber(`${selectedCode}${cleaned}`);
  };

  const handleCodeSelect = (code: string) => {
    setSelectedCode(code);
    setPhoneNumber(`${code}${localNumber}`);
    setDdOpen(false);
  };

  const selected = COUNTRY_CODES.find(c => c.code === selectedCode)!;

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-slow" />
          <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">Secure Login</span>
        </div>
        <h1 className="text-2xl font-sans font-800 text-white leading-tight mb-3">
          Verify your identity <br />
          <span className="text-cyan-400"></span>
        </h1>
        <p className="text-slate-400 text-sm font-mono leading-relaxed">
          Enter your phone number. We'll send a one-time password via SMS.
        </p>
      </div>

      {/* Phone Input */}
      <div className="mb-5">
        <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
          Phone Number
        </label>
        <div className="flex gap-2">
          {/* Country code dropdown */}
          <div className="relative">
            <button
              onClick={() => setDdOpen(!ddOpen)}
              className="h-14 px-3 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/40 rounded-xl text-white font-mono text-sm flex items-center gap-1.5 transition-all duration-200 min-w-20"
            >
              <span className="text-lg">{selected.flag}</span>
              <span className="text-slate-300">{selected.code}</span>
              <svg className={`w-3 h-3 text-slate-500 transition-transform ${ddOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {ddOpen && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl w-48">
                {COUNTRY_CODES.map(c => (
                  <button
                    key={c.code}
                    onClick={() => handleCodeSelect(c.code)}
                    className={`w-full px-4 py-2.5 flex items-center gap-3 text-sm font-mono hover:bg-slate-800 transition-colors ${
                      c.code === selectedCode ? 'text-cyan-400 bg-slate-800/50' : 'text-slate-300'
                    }`}
                  >
                    <span className="text-base">{c.flag}</span>
                    <span>{c.name}</span>
                    <span className="ml-auto text-slate-500">{c.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Number input */}
          <input
            type="tel"
            value={localNumber}
            onChange={e => handleNumberChange(e.target.value)}
            placeholder="98765 43210"
            className="flex-1 h-14 px-5 bg-slate-800/60 border border-slate-700/60 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20 rounded-xl text-white font-mono text-base placeholder-slate-600 outline-none transition-all duration-200"
          />
        </div>

        {phoneNumber && (
          <p className="mt-2 text-xs font-mono text-slate-500">
            Full number: <span className="text-cyan-400/70">{phoneNumber}</span>
          </p>
        )}
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2">
          <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-400 text-xs font-mono">{error}</p>
        </div>
      )}

      <button
        onClick={onSend}
        disabled={loading || !localNumber}
        className="w-full h-14 bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-sans font-700 text-base rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 disabled:shadow-none"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending OTP...
          </>
        ) : (
          <>
            Send OTP
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </>
        )}
      </button>

      <p className="mt-6 text-center text-xs font-mono text-slate-600">
        Protected by Firebase Authentication & reCAPTCHA
      </p>
    </div>
  );
};

export default PhoneStep;