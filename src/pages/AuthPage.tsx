import React from 'react';
import PhoneStep from '../components/PhoneStep';
import OtpStep   from '../components/OtpStep';
import { usePhoneAuth } from '../hooks/usePhoneAuth';

const AuthPage: React.FC = () => {
  const {
    step, phoneNumber, setPhoneNumber,
    otp, setOtp,
    loading, error, successMsg,
    sendOtp, verifyOtp, resendOtp,
  } = usePhoneAuth();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/4 w-125 h-125 bg-cyan-400/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-100 h-100 bg-cyan-400/3 rounded-full blur-[100px]" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Logo */}


        {/* Card body */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {(['phone', 'otp'] as const).map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-1.5 ${step === s || (step === 'success' && s === 'otp') ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono border transition-all ${
                    (step === 'otp' && s === 'phone') || step === 'success'
                      ? 'bg-cyan-400 border-cyan-400 text-slate-900 font-bold'
                      : step === s
                        ? 'border-cyan-400 text-cyan-400'
                        : 'border-slate-600 text-slate-600'
                  }`}>
                    {(step === 'otp' && s === 'phone') || step === 'success'
                      ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      : i + 1
                    }
                  </div>
                  <span className={`text-xs font-mono capitalize ${step === s ? 'text-white' : 'text-slate-600'}`}>
                    {s === 'phone' ? 'Number' : 'Verify'}
                  </span>
                </div>
                {i < 1 && (
                  <div className={`flex-1 h-px transition-all ${step === 'otp' || step === 'success' ? 'bg-cyan-400/40' : 'bg-slate-700'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {step === 'phone' && (
            <PhoneStep
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onSend={sendOtp}
              loading={loading}
              error={error}
            />
          )}

          {(step === 'otp' || step === 'success') && (
            <OtpStep
              otp={otp}
              setOtp={setOtp}
              onVerify={verifyOtp}
              onResend={resendOtp}
              loading={loading}
              error={error}
              successMsg={successMsg}
              phoneNumber={phoneNumber}
            />
          )}
        </div>

        <p className="text-center mt-6 text-slate-700 font-mono text-xs">
          © 2026 SecureAuth — Powered by Firebase
        </p>
      </div>

      {/* Invisible reCAPTCHA container (required by Firebase) */}
      <div id="recaptcha-container" />
    </div>
  );
};

export default AuthPage;