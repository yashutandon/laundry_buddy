import { useState, useRef, useCallback } from 'react';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,  PhoneAuthProvider,
  signInWithCredential,
  type ConfirmationResult,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export type AuthStep = 'phone' | 'otp' | 'success';

export const usePhoneAuth = () => {
  const { setTokenAndUser } = useAuth();

  const [step, setStep]                     = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber]       = useState('');
  const [otp, setOtp]                       = useState(['', '', '', '', '', '']);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState('');
  const [successMsg, setSuccessMsg]         = useState('');
  const [verificationId, setVerificationId] = useState('');

  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef          = useRef<RecaptchaVerifier | null>(null);

  // ── Setup invisible reCAPTCHA ──────────────────────────────────────────────
  const setupRecaptcha = useCallback(() => {
    if (recaptchaRef.current) {
      recaptchaRef.current.clear();
      recaptchaRef.current = null;
    }
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {},
    });
    recaptchaRef.current = verifier;
    return verifier;
  }, []);

  // ── Send OTP ───────────────────────────────────────────────────────────────
  const sendOtp = useCallback(async () => {
    setError('');
    if (!phoneNumber.trim()) {
      setError('Please enter a valid phone number.');
      return;
    }
    setLoading(true);
    try {
      const verifier    = setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      confirmationResultRef.current = confirmation;
      setVerificationId(confirmation.verificationId);
      setStep('otp');
      setSuccessMsg('OTP sent successfully!');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Check your phone number.');
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, setupRecaptcha]);

  // ── Verify OTP ─────────────────────────────────────────────────────────────
  const verifyOtp = useCallback(async () => {
    setError('');
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      let userCredential;
      if (confirmationResultRef.current) {
        userCredential = await confirmationResultRef.current.confirm(otpString);
      } else {
        const credential = PhoneAuthProvider.credential(verificationId, otpString);
        userCredential   = await signInWithCredential(auth, credential);
      }
      await setTokenAndUser(userCredential.user);
      setStep('success');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [otp, verificationId, setTokenAndUser]);

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const resendOtp = useCallback(async () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setSuccessMsg('');
    await sendOtp();
  }, [sendOtp]);

  return {
    step, phoneNumber, setPhoneNumber,
    otp, setOtp,
    loading, error, successMsg,
    sendOtp, verifyOtp, resendOtp,
  };
};