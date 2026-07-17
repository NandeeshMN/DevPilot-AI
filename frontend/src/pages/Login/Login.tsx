import React, { useState } from 'react';
import { Terminal, Lock, Mail, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import authService from '../../services/authService';
import { User } from '../context/AuthContext';

interface LoginProps {
  onLoginSuccess: (user: User, token: string) => void;
  onNavigateToRegister: () => void;
  onNavigateToForgot: () => void;
  onBackToLanding: () => void;
}

export default function Login({ onLoginSuccess, onNavigateToRegister, onNavigateToForgot, onBackToLanding }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Validation States
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) return;

    setLoading(true);

    try {
      const data = await authService.login(email.toLowerCase(), password);
      setLoading(false);
      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setLoading(false);
      const errorMsg = err.response?.data?.error || "Unable to connect to the authentication server.";
      setFormError(errorMsg);
    }
  };

  /* 
    FUTURE ENHANCEMENT: GitHub OAuth Flow handler
    can be defined here:
    
    const handleGithubOAuth = () => {
      // triggers OAuth redirect / auth logic
    };
  */

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
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-text-main)' }}>Welcome Back</h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
          Enter your credentials to enter the workspace
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

        {/* Email Input */}
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

        {/* Password Input */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: '600' }}>
              Password
            </label>
            <span 
              onClick={onNavigateToForgot}
              style={{ fontSize: '11.5px', color: '#00F2FE', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Forgot password?
            </span>
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dark)', display: 'flex' }}>
              <Lock size={16} />
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
                padding: '10px 38px 10px 38px',
                fontSize: '13.5px',
                color: 'var(--color-text-main)',
                outline: 'none',
                transition: '0.2s'
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
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {passwordError && (
            <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{passwordError}</span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: '100%', padding: '12px', marginTop: '8px', background: 'var(--brand-gradient)', display: 'flex', gap: '8px', justifyContent: 'center' }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Signing In...
            </>
          ) : (
            <>
              Sign In <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* 
      <div style={{ position: 'relative', margin: '24px 0', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(255, 255, 255, 0.08)' }}></div>
        <span style={{ position: 'relative', background: '#0B1120', padding: '0 12px', fontSize: '11.5px', color: 'var(--color-text-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          or
        </span>
      </div>

      <button 
        onClick={handleGithubOAuth}
        className="btn btn-secondary" 
        style={{ width: '100%', fontSize: '13px', gap: '8px' }}
      >
        <Github size={16} /> Continue with GitHub
      </button>
      */}

      {/* Navigator Links */}
      <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
        Don't have an account?{' '}
        <span 
          onClick={onNavigateToRegister}
          style={{ color: '#00F2FE', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}
        >
          Create account
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
