import React, { useState } from 'react';
import { User, Bell, Shield, Key, Eye, EyeOff, Save, Check } from 'lucide-react';
import Github from '../../components/common/GithubIcon';

interface ProfileSettingsState {
  username: string;
  email: string;
  emailNotify: boolean;
  weeklyAlerts: boolean;
  telemetry: boolean;
}

export default function Profile() {
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [apiKey] = useState<string>("sk_devpilot_4f8cff8b5cf6ec489910b981");

  const [settings, setSettings] = useState<ProfileSettingsState>({
    username: "Alex Rivera",
    email: "alex.rivera@github.com",
    emailNotify: true,
    weeklyAlerts: true,
    telemetry: false
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      
      {/* Left Column: Account Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Profile Card */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--color-text-main)' }}>
            <User size={16} color="#00F2FE" />
            <h3 style={{ fontSize: '14px', fontWeight: '700' }}>Developer Profile</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
              <input
                type="text"
                value={settings.username}
                onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                style={{
                  width: '100%',
                  background: '#050811',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: 'var(--color-text-main)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Email Address</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                style={{
                  width: '100%',
                  background: '#050811',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: 'var(--color-text-main)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* GitHub Linkage */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--color-text-main)' }}>
            <Github size={16} color="#8B5CF6" />
            <h3 style={{ fontSize: '14px', fontWeight: '700' }}>GitHub Integration</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="https://avatars.githubusercontent.com/u/1024025?v=4" alt="GitHub User" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
              <div>
                <div style={{ fontSize: '12.5px', color: 'var(--color-text-main)', fontWeight: '600' }}>alex-rivera-dev</div>
                <span style={{ fontSize: '10px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '2px' }}>✓ Synced Securely</span>
              </div>
            </div>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>
              Disconnect
            </button>
          </div>
        </div>

        {/* Notification Swaps */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--color-text-main)' }}>
            <Bell size={16} color="#4F8CFF" />
            <h3 style={{ fontSize: '14px', fontWeight: '700' }}>Workspace Alert Triggers</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12.5px', color: 'var(--color-text-main)' }}>Email Summaries</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-dark)' }}>Receive monthly diagnostics statistics.</div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotify}
                onChange={(e) => setSettings({ ...settings, emailNotify: e.target.checked })}
                style={{ cursor: 'pointer' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px' }}>
              <div>
                <div style={{ fontSize: '12.5px', color: 'var(--color-text-main)' }}>System Usage Alerts</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-dark)' }}>Notify when Monthly quota hits 80%.</div>
              </div>
              <input
                type="checkbox"
                checked={settings.weeklyAlerts}
                onChange={(e) => setSettings({ ...settings, weeklyAlerts: e.target.checked })}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Security API Keys & Billing Mockups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* API Credentials */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--color-text-main)' }}>
            <Shield size={16} color="#EF4444" />
            <h3 style={{ fontSize: '14px', fontWeight: '700' }}>API Credentials</h3>
          </div>

          <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
            Use this developer credential key to query DevPilot AI models directly from your IDE extensions or build scripts. Keep this secret.
          </p>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{
              flexGrow: 1,
              background: '#050811',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '12.5px',
              fontFamily: 'var(--font-mono)',
              color: showApiKey ? 'var(--color-text-main)' : 'var(--color-text-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>{showApiKey ? apiKey : "sk_devpilot_••••••••••••••••••••"}</span>
              <button 
                onClick={() => setShowApiKey(!showApiKey)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <button className="btn btn-secondary" style={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
              <Key size={14} />
            </button>
          </div>
        </div>

        {/* Subscription Plan Tier */}
        <div className="glass-card" style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(26, 35, 51, 0.4) 0%, rgba(139, 92, 246, 0.05) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.15)'
        }}>
          <span style={{
            fontSize: '10px',
            fontWeight: '800',
            color: '#8B5CF6',
            background: 'rgba(139, 92, 246, 0.1)',
            padding: '4px 8px',
            borderRadius: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Current Plan
          </span>

          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-text-main)', marginTop: '12px' }}>
            Pro Developer Account
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px', marginBottom: '20px' }}>
            $29/mo • Renews on August 1st, 2026.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px', marginBottom: '20px' }}>
            {["Unlimited code explanations", "10,000 code generation streams / mo", "Access to Claude 3.5 Sonnet & GPT-4 models"].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                <span style={{ color: '#8B5CF6' }}>✓</span> {item}
              </div>
            ))}
          </div>

          <button className="btn btn-primary" style={{ width: '100%', fontSize: '12px', background: 'var(--brand-gradient)' }}>
            Upgrade to Corporate Plan ($99/mo)
          </button>
        </div>

        <button 
          onClick={handleSave}
          className="btn btn-gradient"
          style={{ width: '100%', gap: '8px', padding: '12px', background: 'var(--button-gradient)' }}
        >
          {saved ? <Check size={16} /> : <span style={{ display: 'inline-flex', alignItems: 'center' }}><Save size={16} /></span>}
          {saved ? "Saved Configuration!" : "Save Changes"}
        </button>

      </div>
    </div>
  );
}
