import React, { useState, useEffect } from 'react';
import { Terminal, Code, Cpu, MessageSquare, ShieldCheck, ArrowRight, Globe } from 'lucide-react';
import Github from '../../components/common/GithubIcon';

interface LandingPageProps {
  onLoginTrigger: () => void;
}

const ReactLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" width={size} height={size} fill="none" stroke="#00d8ff" strokeWidth="1">
    <circle cx="0" cy="0" r="2.05" fill="#00d8ff"/>
    <g stroke="#00d8ff">
      <ellipse rx="11" ry="4.2"/>
      <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
      <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
    </g>
  </svg>
);

const TypeScriptLogo = ({ size = 22 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#3178c6">
    <rect width="24" height="24" rx="3"/>
    <text x="11" y="18" fill="#fff" fontSize="11" fontWeight="bold" fontFamily="system-ui" letterSpacing="-1">TS</text>
  </svg>
);

const NodeLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#339933">
    <path d="M12 2L3.5 7v10L12 22l8.5-5V7L12 2zm6.7 14.1L12 20.3 5.3 16.1V7.9L12 3.7l6.7 4.2v8.2z"/>
  </svg>
);

const PythonLogo = ({ size = 22 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 2c-5.5 0-5.5 1-5.5 3h1v1.5c-2.5 0-4.5 1-4.5 3.5s2 3.5 4.5 3.5h1v-1c0-2 2-3.5 4.5-3.5h3c1 0 2-.8 2-2V5c0-2-2-3-6.5-3zm-1.5 2a.8.8 0 110 1.6.8.8 0 010-1.6zm3 18c5.5 0 5.5-1 5.5-3h-1v-1.5c2.5 0 4.5-1 4.5-3.5s-2-3.5-4.5-3.5h-1v1c0 2-2 3.5-4.5 3.5h-3c-1 0-2 .8-2 2v2.5c0 2 2 3 6.5 3zm1.5-2a.8.8 0 110-1.6.8.8 0 010 1.6z" fill="#FFD43B"/>
    <path d="M12 2c-5.5 0-5.5 1-5.5 3h1v1.5c-2.5 0-4.5 1-4.5 3.5s2 3.5 4.5 3.5h1v-1c0-2 2-3.5 4.5-3.5h3c1 0 2-.8 2-2V5c0-2-2-3-6.5-3z" fill="#3776AB" clipPath="polygon(0 0, 100% 0, 100% 50%, 0 50%)"/>
  </svg>
);

const DockerLogo = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#2496ED">
    <path d="M13.9 8.2h2.2V6h-2.2v2.2zm-2.7 0h2.2V6h-2.2v2.2zm-2.8 0h2.2V6H8.4v2.2zm-2.8 0h2.2V6H5.6v2.2zm2.8-2.7h2.2V3.3H8.4v2.2zm2.8 0h2.2V3.3h-2.2v2.2zm2.7 0h2.2V3.3h-2.2v2.2zm2.8 2.7H22v-2.2h-2.3v2.2zm2.2 2.7H2.2c0 4.5 3.6 8.2 8.2 8.2h3.2c4.5 0 8.2-3.7 8.2-8.2V11z"/>
  </svg>
);

const PostgresLogo = ({ size = 22 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#336791">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 14.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zM12 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>
);

const GitLogo = ({ size = 22 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#F05032">
    <path d="M20.6 11.4L12.6 3.4c-.4-.4-1-.4-1.4 0L9 5.6l2.9 2.9c.3-.1.6-.2.9-.2 1.1 0 2 .9 2 2 0 .3-.1.6-.2.9l2.9 2.9c.3-.1.6-.2.9-.2 1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2c0-.3.1-.6.2-.9L12.9 12c-.1.1-.3.2-.5.2-.2 0-.4-.1-.5-.2L9 9.1c-.3.1-.6.2-.9.2-1.1 0-2-.9-2-2 0-.3.1-.6.2-.9L3.4 9.6c-.4.4-.4 1 0 1.4l8 8c.4.4 1 .4 1.4 0l7.8-7.8c.4-.4.4-1 0-1.4z"/>
  </svg>
);

const ViteLogo = ({ size = 22 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path d="M19.9 3L12 17.5 4.1 3h15.8z" fill="#BD34FE"/>
    <path d="M12.5 7.5L18 2h-6.5l-4 8 2.5 1 2.5-3.5z" fill="#FFD600"/>
  </svg>
);

const LinkedinIcon = ({ size = 14, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export default function LandingPage({ onLoginTrigger }: LandingPageProps) {
  const quotes = [
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" }
  ];

  const [quoteIdx, setQuoteIdx] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setQuoteIdx((prev) => (prev + 1) % quotes.length);
        setFadeState('in');
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-container" style={{ position: 'relative', overflowX: 'hidden', background: '#0B1120' }}>
      {/* Background Blurs */}
      <div className="glow-bg glow-blue"></div>
      <div className="glow-bg glow-purple"></div>
      <div className="glow-bg glow-pink"></div>

      {/* Header */}
      <header className="glass landing-header" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 5%',
        zIndex: 100,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

        <nav className="landing-nav" style={{ display: 'flex', gap: '24px' }}>
          <a href="#features" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '14px', transition: '0.2s' }}>Features</a>
          <a href="#how-it-works" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '14px', transition: '0.2s' }}>How It Works</a>
        </nav>

        <div className="landing-auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onLoginTrigger} className="btn btn-secondary" style={{ fontSize: '14px' }}>
            Sign In
          </button>
          <button onClick={onLoginTrigger} className="btn btn-primary" style={{ fontSize: '14px' }}>
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-glow-container landing-hero" style={{ padding: '160px 5% 100px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', textAlign: 'left', minHeight: '85vh' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            padding: '6px 12px',
            borderRadius: '20px',
            marginBottom: '28px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#A78BFA' }}>
              ⚡ YOUR BETA IS NOW LIVE
            </span>
          </div>

          <h1 style={{ fontSize: '68px', fontWeight: '850', lineHeight: '1.05', marginBottom: '20px', letterSpacing: '-1.5px' }}>
            Meet <span style={{ background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DevPilot AI</span>
          </h1>
          <h2 style={{ fontSize: '28px', fontWeight: '500', color: 'var(--color-text-muted)', marginBottom: '28px' }}>
            Your AI-Powered Software Engineering Workspace
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--color-text-muted)', lineHeight: '1.65', marginBottom: '38px', maxWidth: '640px' }}>
            DevPilot AI is an intelligent software engineering assistant designed to help developers generate code, debug applications, explain complex concepts, create documentation, optimize SQL queries, and accelerate development using AI.
          </p>

          <div className="landing-hero-buttons" style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
            <button onClick={onLoginTrigger} className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '16px', gap: '8px' }}>
              Get Started <ArrowRight size={16} />
            </button>
            <a href="#features" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '16px' }}>
              Explore Features
            </a>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', width: '100%' }}>
          {/* Glowing backframe */}
          <div style={{
            position: 'absolute',
            width: '90%',
            height: '90%',
            background: 'var(--color-primary-accent)',
            filter: 'blur(100px)',
            opacity: 0.28,
            zIndex: 0
          }}></div>
          <div className="glass-card" style={{
            padding: '10px',
            borderRadius: '24px',
            position: 'relative',
            zIndex: 1,
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            width: '100%'
          }}>
            <img 
              src="/assets/hero_illustration.png" 
              alt="DevPilot Workspace" 
              style={{
                width: '100%',
                maxHeight: '520px',
                borderRadius: '16px',
                objectFit: 'cover',
                display: 'block'
              }} 
            />
          </div>
        </div>
      </section>

      {/* Feature Section (Why DevPilot?) */}
      <section id="features" style={{ padding: '80px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>Why DevPilot?</h2>
          <div style={{ width: '60px', height: '4px', background: 'var(--brand-gradient)', margin: '0 auto', borderRadius: '2px' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ color: '#06B6D4', marginBottom: '20px' }}>
              <MessageSquare size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>AI Programming Assistant</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
              Interactive query workspace that understands context, identifies patterns, and suggests optimal, typed solutions.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ color: '#3B82F6', marginBottom: '20px' }}>
              <Code size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Code Generation</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
              Transform high-level requests into production-ready code snippets across multiple frameworks and backend systems.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ color: '#EF4444', marginBottom: '20px' }}>
              <Cpu size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Debug Assistant</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
              Instant root-cause analysis for compiler errors and automated refactoring recommendations with high-fidelity outputs.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ color: '#10B981', marginBottom: '20px' }}>
              <Terminal size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>SQL Assistant</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
              Translate natural language instructions into optimized SQL queries, complete with database schema explainers.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ color: '#F59E0B', marginBottom: '20px' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Documentation Generator</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
              Instantly create robust, standardized README templates and markdown project documentation summaries.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ color: '#EC4899', marginBottom: '20px' }}>
              <Cpu size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Learning Assistant</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
              Deep dive into complex algorithms, data structures, and structural patterns with targeted coding mentors.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" style={{ padding: '80px 5%', background: '#080D1A', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>How It Works</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Four simple steps to revolutionize your development time</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', position: 'relative' }}>
            {[
              { num: '1', title: 'Secure Authentication', desc: 'Create an account or sign in with your email and password to sync your profile.' },
              { num: '2', title: 'Ask DevPilot', desc: 'Input your programming prompt, bug trace, code segment, or SQL schema.' },
              { num: '3', title: 'Receive AI Solutions', desc: 'Get production-ready code outputs with time and space complexity audits.' },
              { num: '4', title: 'Build Faster', desc: 'Verify, download, and copy results directly into your workspace editor.' }
            ].map((step, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '32px', textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--color-primary-accent)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '18px',
                  margin: '0 auto 20px',
                  boxShadow: '0 0 15px rgba(79, 140, 255, 0.4)'
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>{step.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Developer Quotes Section with Floating Tech Stack Logos */}
      <style>{`
        @keyframes float-tech-1 {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes float-tech-2 {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-4deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes float-tech-3 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-10px, -15px) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes float-tech-4 {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(15px, 10px) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .tech-item-floating {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.12;
          transition: all 0.3s ease;
          user-select: none;
          pointer-events: auto;
          color: var(--color-text-main);
        }
        .tech-item-floating:hover {
          opacity: 0.45;
          transform: scale(1.1);
        }
      `}</style>

      <section className="landing-quote-section" style={{ 
        position: 'relative', 
        padding: '120px 5%', 
        background: 'radial-gradient(circle at center, #0B1120 0%, #050811 100%)', 
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center', 
        overflow: 'hidden',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Floating tech stack logos with names */}
        <div className="tech-item-floating" style={{ top: '15%', left: '8%', animation: 'float-tech-1 6s ease-in-out infinite' }}>
          <ReactLogo size={24} />
          <span style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>React</span>
        </div>
        <div className="tech-item-floating" style={{ top: '65%', left: '15%', animation: 'float-tech-2 8s ease-in-out infinite' }}>
          <TypeScriptLogo size={22} />
          <span style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>TypeScript</span>
        </div>
        <div className="tech-item-floating" style={{ top: '20%', right: '15%', animation: 'float-tech-3 7s ease-in-out infinite' }}>
          <NodeLogo size={24} />
          <span style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>NodeJS</span>
        </div>
        <div className="tech-item-floating" style={{ top: '70%', right: '10%', animation: 'float-tech-4 9s ease-in-out infinite' }}>
          <PythonLogo size={22} />
          <span style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>Python</span>
        </div>
        <div className="tech-item-floating" style={{ top: '40%', left: '3%', animation: 'float-tech-3 8s ease-in-out infinite' }}>
          <DockerLogo size={24} />
          <span style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>Docker</span>
        </div>
        <div className="tech-item-floating" style={{ top: '45%', right: '3%', animation: 'float-tech-1 7s ease-in-out infinite' }}>
          <PostgresLogo size={22} />
          <span style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>Postgres</span>
        </div>
        <div className="tech-item-floating" style={{ bottom: '10%', left: '35%', animation: 'float-tech-4 6s ease-in-out infinite' }}>
          <GitLogo size={22} />
          <span style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>Git</span>
        </div>
        <div className="tech-item-floating" style={{ top: '8%', left: '50%', transform: 'translateX(-50%)', animation: 'float-tech-2 10s ease-in-out infinite' }}>
          <ViteLogo size={22} />
          <span style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>Vite</span>
        </div>

        {/* Central Quote Container */}
        <div style={{ 
          maxWidth: '800px', 
          position: 'relative', 
          zIndex: 2, 
          padding: '20px'
        }}>
          {/* Quote mark ornament */}
          <span style={{ 
            display: 'block', 
            fontSize: '90px', 
            fontFamily: 'Georgia, serif', 
            lineHeight: 1, 
            background: 'var(--brand-gradient)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            opacity: 0.25,
            marginBottom: '-20px'
          }}>
            “
          </span>
          <div style={{
            opacity: fadeState === 'in' ? 1 : 0,
            transform: `translateY(${fadeState === 'in' ? '0px' : '10px'})`,
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <blockquote style={{ 
              fontSize: '26px', 
              fontWeight: '600', 
              lineHeight: '1.45', 
              color: 'var(--color-text-main)', 
              margin: '0 0 20px',
              fontStyle: 'italic',
              letterSpacing: '-0.5px'
            }}>
              {quotes[quoteIdx].text}
            </blockquote>
            <cite style={{ 
              fontSize: '14px', 
              fontWeight: '700', 
              color: 'var(--color-primary-accent)', 
              textTransform: 'uppercase', 
              letterSpacing: '2px', 
              fontStyle: 'normal'
            }}>
              — {quotes[quoteIdx].author}
            </cite>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '40px 5% 20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', background: '#080D1A', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '200px' }}>
          <Terminal size={18} color="#4F8CFF" />
          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-main)' }}>DevPilot AI</span>
        </div>
        <p style={{ color: 'var(--color-text-dark)', fontSize: '12px', textAlign: 'center', flex: '1', minWidth: '200px' }}>
          &copy; {new Date().getFullYear()} DevPilot AI. All rights reserved.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: '1', minWidth: '280px', fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <span>Designed and Developed by</span>
            <strong style={{ color: 'var(--color-text-main)', fontSize: '13px', letterSpacing: '0.5px' }}>Nandeesh M N</strong>
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginTop: '2px' }}>
            <a 
              href="https://github.com/NandeeshMN/" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} 
              title="GitHub"
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#fff'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-muted)'}
            >
              <Github size={15} />
            </a>
            <a 
              href="https://www.linkedin.com/in/nandeeshmn/" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} 
              title="LinkedIn"
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#0A66C2'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-muted)'}
            >
              <LinkedinIcon size={15} />
            </a>
            <a 
              href="https://nandeeshmn.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} 
              title="Portfolio"
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#00F2FE'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-muted)'}
            >
              <Globe size={15} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
