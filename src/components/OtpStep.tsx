import React, { useRef, useEffect } from 'react';

interface OtpStepProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
  onVerify: () => void;
  onResend: () => void;
  loading: boolean;
  error: string;
  successMsg: string;
  phoneNumber: string;
}

const OtpStep: React.FC<OtpStepProps> = ({
  otp, setOtp, onVerify, onResend, loading, error, successMsg, phoneNumber,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const newOtp  = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter' && otp.every(d => d)) {
      onVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => { if (i < 6) newOtp[i] = char; });
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const maskedPhone = phoneNumber.replace(/(\+\d{2})(\d+)(\d{4})/, '$1 ****$3');

  return (
    <div className="animate-slide-up">
      <button
        onClick={() => window.location.reload()}
        className="flex items-center gap-1.5 text-slate-500 hover:text-cyan-400 text-xs font-mono mb-8 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="mb-8">
        <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-6">
          <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
          </svg>
        </div>
        <h1 className="text-4xl font-sans font-800 text-white leading-tight mb-3">
          Enter the<br />
          <span className="text-cyan-400">6-digit code</span>
        </h1>
        <p className="text-slate-400 text-sm font-mono leading-relaxed">
          Code sent to <span className="text-slate-300">{maskedPhone}</span>
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="flex gap-3 mb-6" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            className={`w-full aspect-square max-w-14 text-center text-2xl font-mono font-bold rounded-xl border transition-all duration-200 outline-none bg-slate-800/60
              ${digit
                ? 'border-cyan-400/60 text-cyan-400 shadow-[0_0_12px_#22d3ee22]'
                : 'border-slate-700/60 text-white focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20'
              }`}
          />
        ))}
      </div>

      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-emerald-400 text-xs font-mono">{successMsg}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2">
          <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-400 text-xs font-mono">{error}</p>
        </div>
      )}

      <button
        onClick={onVerify}
        disabled={loading || otp.some(d => !d)}
        className="w-full h-14 bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-sans font-700 text-base rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 disabled:shadow-none mb-4"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Verifying...
          </>
        ) : (
          <>
            Verify & Continue
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </>
        )}
      </button>

      <p className="text-center text-xs font-mono text-slate-600">
        Didn't receive the code?{' '}
        <button
          onClick={onResend}
          disabled={loading}
          className="text-cyan-400/70 hover:text-cyan-400 disabled:text-slate-600 transition-colors underline underline-offset-2"
        >
          Resend OTP
        </button>
      </p>
    </div>
  );
};

export default OtpStep;