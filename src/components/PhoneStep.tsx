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
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-blue-300 text-xs font-medium tracking-wide uppercase">Secure Authentication</span>
        </div>
        <h1 className="text-3xl font-bold text-white leading-tight mb-3">
          Sign in with your phone
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Enter your phone number to receive a one-time verification code via SMS.
        </p>
      </div>

      {/* Phone Input */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
          Phone Number
        </label>
        <div className="flex gap-2">
          {/* Country code dropdown */}
          <div className="relative">
            <button
              onClick={() => setDdOpen(!ddOpen)}
              className="h-12 px-3 bg-slate-800/40 border border-slate-700/60 hover:border-slate-600/60 
                         rounded-lg text-white text-sm flex items-center gap-2 transition-all duration-200 min-w-24
                         focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <span className="text-lg">{selected.flag}</span>
              <span className="text-slate-200 font-medium">{selected.code}</span>
              <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${ddOpen ? 'rotate-180' : ''}`} 
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {ddOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setDdOpen(false)}
                />
                <div className="absolute top-full left-0 mt-2 z-50 bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 
                                rounded-lg overflow-hidden shadow-2xl w-52">
                  <div className="max-h-64 overflow-y-auto">
                    {COUNTRY_CODES.map(c => (
                      <button
                        key={c.code}
                        onClick={() => handleCodeSelect(c.code)}
                        className={`w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-slate-800/60 transition-colors ${
                          c.code === selectedCode ? 'text-blue-300 bg-slate-800/40' : 'text-slate-300'
                        }`}
                      >
                        <span className="text-lg">{c.flag}</span>
                        <span className="font-medium">{c.name}</span>
                        <span className="ml-auto text-slate-500 font-mono text-xs">{c.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Number input */}
          <input
            type="tel"
            value={localNumber}
            onChange={e => handleNumberChange(e.target.value)}
            placeholder="98765 43210"
            className="flex-1 h-12 px-4 bg-slate-800/40 border border-slate-700/60 
                       focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 
                       rounded-lg text-white text-sm placeholder-slate-500 outline-none transition-all duration-200"
          />
        </div>

        {phoneNumber && (
          <p className="mt-3 text-xs text-slate-500 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Complete number: <span className="text-slate-400 font-medium">{phoneNumber}</span>
          </p>
        )}
      </div>

      {error && (
        <div className="mb-5 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={onSend}
        disabled={loading || !localNumber}
        className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                   disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:border disabled:border-slate-700/50
                   text-white font-semibold text-sm rounded-lg transition-all duration-200 
                   flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 
                   hover:shadow-xl hover:shadow-blue-500/30 disabled:shadow-none"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending code...
          </>
        ) : (
          <>
            Send verification code
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </>
        )}
      </button>

      <div className="mt-6 flex items-center gap-2 justify-center text-xs text-slate-500">
        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>Protected by Firebase & reCAPTCHA</span>
      </div>
    </div>
  );
};

export default PhoneStep;