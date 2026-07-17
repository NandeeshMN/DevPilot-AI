import React, { useState } from 'react';
import { Terminal, Lock, Mail, User, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import authService from '../../services/authService';

interface RegisterProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
  onBackToLanding: () => void;
}

export default function Register({ onRegisterSuccess, onNavigateToLogin, onBackToLanding }: RegisterProps) {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Field Errors
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmError, setConfirmError] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const validateName = (val: string) => {
    if (!val.trim()) {
      setNameError("Full name is required");
      return false;
    }
    if (val.trim().length < 2) {
      setNameError("Name must be at least 2 characters long");
      return false;
    }
    setNameError("");
    return true;
  };

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

  const validatePassword = (val: string) => {
    if (!val) {
      setPasswordError("Password is required");
      return false;
    }
    if (val.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const isNameValid = validateName(fullName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(confirmPassword, password);

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) return;

    setLoading(true);

    try {
      await authService.register(fullName, email.toLowerCase(), password);
      setLoading(false);
      onRegisterSuccess();
    } catch (err: any) {
      setLoading(false);
      const errorMsg = err.response?.data?.error || "Unable to connect to the registration server.";
      setFormError(errorMsg);
    }
  };

  return (
    <div className="glass-card" style={{
      padding: '40px 32px',
      maxWidth: '440px',
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
          onClick={onBackToLanding}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer',
            marginBottom: '16px'
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
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-text-main)' }}>Create Account</h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Get started with your custom developer environment
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {formError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#EF4444',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            {formError}
          </div>
        )}

        {/* Full Name */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: '600' }}>
            Full Name
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dark)', display: 'flex' }}>
              <User size={15} />
            </span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (nameError) validateName(e.target.value);
              }}
              onBlur={() => validateName(fullName)}
              style={{
                width: '100%',
                background: '#050811',
                border: `1px solid ${nameError ? '#EF4444' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '8px',
                padding: '8px 12px 8px 36px',
                fontSize: '13.5px',
                color: 'var(--color-text-main)',
                outline: 'none'
              }}
            />
          </div>
          {nameError && (
            <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{nameError}</span>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: '600' }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dark)', display: 'flex' }}>
              <Mail size={15} />
            </span>
            <input
              type="text"
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
                padding: '8px 12px 8px 36px',
                fontSize: '13.5px',
                color: 'var(--color-text-main)',
                outline: 'none'
              }}
            />
          </div>
          {emailError && (
            <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{emailError}</span>
          )}
        </div>

        {/* Password */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: '600' }}>
            Password (Min 6 Characters)
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dark)', display: 'flex' }}>
              <Lock size={15} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) validatePassword(e.target.value);
              }}
              onBlur={() => validatePassword(password)}
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

        {/* Confirm Password */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: '600' }}>
            Confirm Password
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dark)', display: 'flex' }}>
              <Lock size={15} />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmError) validateConfirmPassword(e.target.value, password);
              }}
              onBlur={() => validateConfirmPassword(confirmPassword, password)}
              style={{
                width: '100%',
                background: '#050811',
                border: `1px solid ${confirmError ? '#EF4444' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '8px',
                padding: '8px 38px 8px 36px',
                fontSize: '13.5px',
                color: 'var(--color-text-main)',
                outline: 'none'
              }}
            />
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
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
              <Loader2 size={16} className="animate-spin" /> Registering...
            </>
          ) : (
            <>
              Register Account <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Navigator Links */}
      <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
        Already have an account?{' '}
        <span 
          onClick={onNavigateToLogin}
          style={{ color: '#00F2FE', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}
        >
          Sign in
        </span>
      </div>

      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <span 
          onClick={onBackToLanding}
          style={{ fontSize: '12px', color: 'var(--color-text-dark)', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Back to Home
        </span>
      </div>
    </div>
  );
}
