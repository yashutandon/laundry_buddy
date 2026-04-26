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
    <div className="animate-fade-in">
      <button
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm font-medium mb-8 transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to phone number
      </button>

      <div className="mb-8">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 
                        border border-slate-700/50 flex items-center justify-center mb-6 shadow-lg">
          <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white leading-tight mb-3">
          Enter verification code
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          We've sent a 6-digit code to <span className="text-slate-200 font-medium">{maskedPhone}</span>
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="flex gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
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
            className={`w-full aspect-square max-w-14 text-center text-2xl font-semibold rounded-lg border transition-all duration-200 outline-none
              ${digit
                ? 'border-blue-500/60 bg-blue-500/10 text-blue-300 shadow-lg shadow-blue-500/20'
                : 'border-slate-700/60 bg-slate-800/40 text-white focus:border-blue-500/40 focus:bg-slate-800/60 focus:shadow-lg focus:shadow-blue-500/10'
              }`}
          />
        ))}
      </div>

      {successMsg && (
        <div className="mb-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-emerald-300 text-sm font-medium">{successMsg}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={onVerify}
        disabled={loading || otp.some(d => !d)}
        className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                   disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:border disabled:border-slate-700/50
                   text-white font-semibold text-sm rounded-lg transition-all duration-200 
                   flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 
                   hover:shadow-xl hover:shadow-blue-500/30 disabled:shadow-none mb-4"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Verifying code...
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

      <p className="text-center text-sm text-slate-500">
        Didn't receive the code?{' '}
        <button
          onClick={onResend}
          disabled={loading}
          className="text-blue-400 hover:text-blue-300 disabled:text-slate-600 disabled:cursor-not-allowed 
                     transition-colors font-medium"
        >
          Resend code
        </button>
      </p>
    </div>
  );
};

export default OtpStep;