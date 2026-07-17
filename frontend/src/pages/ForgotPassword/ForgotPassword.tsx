import React, { useState } from 'react';
import { Terminal, Lock, Mail, Key, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordProps {
  onResetSuccess: () => void;
  onBackToLogin: () => void;
}

type ResetStep = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPassword({ onResetSuccess, onBackToLogin }: ForgotPasswordProps) {
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Field Errors
  const [emailError, setEmailError] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmError, setConfirmError] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const validateEmail = (val: string) => {
    if (!val) {
      setEmailError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!validateEmail(email)) return;

    setLoading(true);
    
    fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.toLowerCase() })
    })
    .then(async (res) => {
      setLoading(false);
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "An error occurred while sending OTP.");
      } else {
        setStep('otp');
      }
    })
    .catch(() => {
      setLoading(false);
      setFormError("Unable to connect to the reset service.");
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!otp) {
      setOtpError("OTP is required");
      return;
    }
    if (otp.length !== 6) {
      setOtpError("OTP must be exactly 6 characters");
      return;
    }
    setOtpError("");
    setLoading(true);

    fetch('http://localhost:5000/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.toLowerCase(), otp })
    })
    .then(async (res) => {
      setLoading(false);
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error || "Invalid OTP code.");
      } else {
        setStep('password');
      }
    })
    .catch(() => {
      setLoading(false);
      setFormError("Unable to connect to the verification service.");
    });
  };

  const validatePassword = (val: string) => {
    if (!val) {
      setPasswordError("Password is required");
      return false;
    }
    if (val.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (val: string, pass: string) => {
    if (!val) {
      setConfirmError("Please confirm your password");
      return false;
    }
    if (val !== pass) {
      setConfirmError("Passwords do not match");
      return false;
    }
    setConfirmError("");
    return true;
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const isPasswordValid = validatePassword(newPassword);
    const isConfirmValid = validateConfirmPassword(confirmPassword, newPassword);

    if (!isPasswordValid || !isConfirmValid) return;

    setLoading(true);
    
    fetch('http://localhost:5000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.toLowerCase(), otp, newPassword })
    })
    .then(async (res) => {
      setLoading(false);
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to update password.");
      } else {
        setStep('success');
      }
    })
    .catch(() => {
      setLoading(false);
      setFormError("Unable to connect to the reset service.");
    });
  };

  return (
    <div className="glass-card" style={{
      padding: '40px 32px',
      maxWidth: '420px',
      width: '100%',
      position: 'relative',
      zIndex: 1,
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Neon top line */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: 'var(--brand-gradient)' }}></div>

      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div 
          onClick={onBackToLogin}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer',
            marginBottom: '12px'
          }}
        >
          <div style={{
            background: 'var(--brand-gradient)',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Terminal size={18} color="#fff" />
          </div>
          <span style={{ fontSize: '20px', fontWeight: '800', background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            DevPilot AI
          </span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-text-main)' }}>Reset Password</h2>
        
        {step === 'email' && (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Step 1 of 3: Enter email to receive OTP code
          </p>
        )}
        {step === 'otp' && (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Step 2 of 3: Enter the 6-digit OTP code sent to {email}
          </p>
        )}
        {step === 'password' && (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Step 3 of 3: Choose a secure new password
          </p>
        )}
        {step === 'success' && (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Account secured successfully
          </p>
        )}
      </div>

      {formError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: '#EF4444',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '12px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {formError}
        </div>
      )}

      {/* STEP 1: ENTER EMAIL */}
      {step === 'email' && (
        <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: '600' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dark)', display: 'flex' }}>
                <Mail size={16} />
              </span>
              <input
                type="text"
                placeholder="developer@devpilot.ai"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => validateEmail(email)}
                style={{
                  width: '100%',
                  background: '#050811',
                  border: `1px solid ${emailError ? '#EF4444' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '8px',
                  padding: '10px 12px 10px 38px',
                  fontSize: '13.5px',
                  color: 'var(--color-text-main)',
                  outline: 'none',
                  transition: '0.2s'
                }}
              />
            </div>
            {emailError && (
              <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{emailError}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: 'var(--brand-gradient)', display: 'flex', gap: '8px', justifyContent: 'center' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Sending OTP...
              </>
            ) : (
              <>
                Send OTP Code <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP 2: VERIFY OTP */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: '600' }}>
              One-Time Password (OTP)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dark)', display: 'flex' }}>
                <Key size={16} />
              </span>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setOtp(val);
                  if (otpError) setOtpError("");
                }}
                style={{
                  width: '100%',
                  background: '#050811',
                  border: `1px solid ${otpError ? '#EF4444' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '8px',
                  padding: '10px 12px 10px 38px',
                  fontSize: '15px',
                  letterSpacing: '4px',
                  color: 'var(--color-text-main)',
                  outline: 'none',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>
            {otpError && (
              <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{otpError}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: 'var(--brand-gradient)', display: 'flex', gap: '8px', justifyContent: 'center' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Verifying...
              </>
            ) : (
              <>
                Confirm OTP <ArrowRight size={16} />
              </>
            )}
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <span 
              onClick={() => setStep('email')}
              style={{ fontSize: '12px', color: 'var(--color-text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Change Email Address
            </span>
          </div>
        </form>
      )}

      {/* STEP 3: RESET PASSWORD */}
      {step === 'password' && (
        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* New Password */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: '600' }}>
              New Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dark)', display: 'flex' }}>
                <Lock size={15} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (passwordError) validatePassword(e.target.value);
                }}
                onBlur={() => validatePassword(newPassword)}
                style={{
                  width: '100%',
                  background: '#050811',
                  border: `1px solid ${passwordError ? '#EF4444' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '8px',
                  padding: '8px 38px 8px 36px',
                  fontSize: '13.5px',
                  color: 'var(--color-text-main)',
                  outline: 'none'
                }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-dark)',
                  cursor: 'pointer',
                  display: 'flex'
                }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {passwordError && (
              <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{passwordError}</span>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: '600' }}>
              Confirm New Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dark)', display: 'flex' }}>
                <Lock size={15} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmError) validateConfirmPassword(e.target.value, newPassword);
                }}
                onBlur={() => validateConfirmPassword(confirmPassword, newPassword)}
                style={{
                  width: '100%',
                  background: '#050811',
                  border: `1px solid ${confirmError ? '#EF4444' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '8px',
                  padding: '8px 12px 8px 36px',
                  fontSize: '13.5px',
                  color: 'var(--color-text-main)',
                  outline: 'none'
                }}
              />
            </div>
            {confirmError && (
              <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{confirmError}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '10px', background: 'var(--brand-gradient)', display: 'flex', gap: '8px', justifyContent: 'center' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving Password...
              </>
            ) : (
              <>
                Reset Password <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP 4: SUCCESS */}
      {step === 'success' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#10B981',
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
          }}>
            <CheckCircle2 size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-text-main)', marginBottom: '8px' }}>
              Password Updated
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Your new credential access keys have been generated and secured. You may now sign in using your new password.
            </p>
          </div>
          
          <button
            onClick={onResetSuccess}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', background: 'var(--brand-gradient)' }}
          >
            Back to Login
          </button>
        </div>
      )}

      {/* Back to Login Link for initial steps */}
      {step !== 'success' && (
        <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
          Remembered your password?{' '}
          <span 
            onClick={onBackToLogin}
            style={{ color: '#00F2FE', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}
          >
            Sign in
          </span>
        </div>
      )}
    </div>
  );
}
