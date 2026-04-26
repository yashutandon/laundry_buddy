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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]">
          <defs>
            <pattern id="auth-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
        
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md z-10">
        {/* Logo/Header */}
        

        {/* Card body */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-xl p-8 shadow-2xl">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {(['phone', 'otp'] as const).map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 transition-opacity duration-300 ${
                  step === s || (step === 'success' && s === 'otp') ? 'opacity-100' : 'opacity-40'
                }`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium border transition-all duration-300 ${
                    (step === 'otp' && s === 'phone') || step === 'success'
                      ? 'bg-emerald-500/20 border-emerald-600/40 text-emerald-300'
                      : step === s
                        ? 'bg-blue-500/20 border-blue-600/40 text-blue-300'
                        : 'border-slate-700/50 text-slate-600'
                  }`}>
                    {(step === 'otp' && s === 'phone') || step === 'success'
                      ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      : i + 1
                    }
                  </div>
                  <span className={`text-sm font-medium capitalize transition-colors duration-300 ${
                    step === s ? 'text-slate-200' : 'text-slate-600'
                  }`}>
                    {s === 'phone' ? 'Phone Number' : 'Verification'}
                  </span>
                </div>
                {i < 1 && (
                  <div className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${
                    step === 'otp' || step === 'success' 
                      ? 'bg-gradient-to-r from-blue-500/40 to-emerald-500/40' 
                      : 'bg-slate-800/60'
                  }`} />
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

        {/* Footer */}
        <div className="mt-6 space-y-3">
          <p className="text-center text-xs text-slate-600">
            Secured with Firebase Authentication
          </p>
          <p className="text-center text-xs text-slate-700">
            © 2026 SecureAuth. All rights reserved.
          </p>
        </div>
      </div>

      {/* Invisible reCAPTCHA container (required by Firebase) */}
      <div id="recaptcha-container" />
    </div>
  );
};

export default AuthPage;