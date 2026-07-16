import React, { useState } from 'react';
import { Bug, Sparkles, HelpCircle, CheckSquare, Code, Copy, Check } from 'lucide-react';

interface FixResult {
  rootCause: string;
  solution: string;
  correctedCode: string;
  bestPractice: string;
}

export default function Debugger() {
  const [code, setCode] = useState<string>(`const users = undefined;
const activeUsers = users.map(user => user.isActive);`);
  const [errorMsg, setErrorMsg] = useState<string>("TypeError: Cannot read properties of undefined (reading 'map')");
  const [stackTrace, setStackTrace] = useState<string>("at handleRequest (api.ts:42)...");
  
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedCorrected, setCopiedCorrected] = useState<boolean>(false);
  const [copiedBest, setCopiedBest] = useState<boolean>(false);

  const [fixResult, setFixResult] = useState<FixResult>({
    rootCause: "Submit your code context and error diagnostics to trace root cause issues.",
    solution: "The debugger will provide a step-by-step strategy to neutralize compile errors.",
    correctedCode: "",
    bestPractice: ""
  });

  const handleDebug = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, error: errorMsg, stackTrace })
      });
      const data = await res.json();
      setFixResult({
        rootCause: data.rootCause || "",
        solution: data.solution || "",
        correctedCode: data.correctedCode || "",
        bestPractice: data.bestPractice || ""
      });
    } catch (err) {
      // Local offline fallback
      setFixResult({
        rootCause: errorMsg.includes('undefined') 
          ? "You are attempting to call '.map()' on a variable ('users') which evaluates to 'undefined' during runtime."
          : "An execution race condition where data is accessed before a load state verification completes.",
        solution: "Guards should be implemented using JavaScript's optional chaining operator (?.) or default initializers during declarations.",
        correctedCode: `// Corrected Code\nconst users = undefined;\nconst activeUsers = users?.map(user => user.isActive) ?? [];`,
        bestPractice: `// Improved Code (Best Practice)\nexport const getActiveUsers = (data = {}) => {\n  const { users = [] } = data;\n  return users.filter(user => user?.isActive);\n};`
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'corrected' | 'best') => {
    navigator.clipboard.writeText(text);
    if (type === 'corrected') {
      setCopiedCorrected(true);
      setTimeout(() => setCopiedCorrected(false), 2000);
    } else {
      setCopiedBest(true);
      setTimeout(() => setCopiedBest(false), 2000);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
      
      {/* Left Column: Diagnostics Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div>
          <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
            Paste Error Message
          </label>
          <input
            type="text"
            value={errorMsg}
            onChange={(e) => setErrorMsg(e.target.value)}
            style={{
              width: '100%',
              background: '#050811',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: 'var(--color-text-main)',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
            Paste Stack Trace
          </label>
          <textarea
            value={stackTrace}
            onChange={(e) => setStackTrace(e.target.value)}
            style={{
              width: '100%',
              height: '80px',
              background: '#050811',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: 'var(--color-text-muted)',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              resize: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
            Paste Code Context
          </label>
          <div className="monaco-editor-mock">
            <div className="monaco-header">
              <div className="monaco-dots">
                <span className="monaco-dot red"></span>
                <span className="monaco-dot yellow"></span>
                <span className="monaco-dot green"></span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>source.ts</span>
            </div>
            <div className="monaco-body">
              <div className="monaco-lines">
                {Array.from({ length: code.split('\n').length }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="monaco-textarea"
                spellCheck="false"
                style={{ minHeight: '160px' }}
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleDebug}
          className="btn btn-primary"
          style={{ width: '100%', gap: '8px', padding: '12px', background: 'var(--button-gradient)' }}
          disabled={loading}
        >
          <Bug size={16} /> {loading ? "Investigating logs..." : "Find Root Cause"}
        </button>
      </div>

      {/* Right Column: Diagnostic Output Panels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          
          {/* Root Cause Card */}
          <div className="glass-card" style={{ padding: '20px', borderLeft: '3px solid #EF4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#EF4444' }}>
              <HelpCircle size={14} />
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Root Cause</span>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              {fixResult.rootCause}
            </p>
          </div>

          {/* Fix Action Card */}
          <div className="glass-card" style={{ padding: '20px', borderLeft: '3px solid #10B981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#10B981' }}>
              <CheckSquare size={14} />
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Solution</span>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              {fixResult.solution}
            </p>
          </div>

        </div>

        {/* Corrected Code Output Card */}
        {fixResult.correctedCode && (
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-main)' }}>
                <Code size={14} color="#00F2FE" />
                <span style={{ fontSize: '13px', fontWeight: '700' }}>Corrected Code</span>
              </div>
              <button 
                onClick={() => copyToClipboard(fixResult.correctedCode, 'corrected')}
                className="btn btn-secondary"
                style={{ padding: '4px 8px', fontSize: '11px', gap: '4px' }}
              >
                {copiedCorrected ? <Check size={12} color="#10B981" /> : <span style={{ display: 'inline-flex', alignItems: 'center' }}><Copy size={12} /></span>}
                {copiedCorrected ? 'Copied' : 'Copy'}
              </button>
            </div>
            
            <pre style={{
              background: '#050811',
              padding: '12px',
              borderRadius: '8px',
              color: '#34D399',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              overflowX: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {fixResult.correctedCode}
            </pre>
          </div>
        )}

        {/* Best Practice Card */}
        {fixResult.bestPractice && (
          <div className="glass-card" style={{ padding: '20px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#8B5CF6', letterSpacing: '0.5px' }}>
                IMPROVED CODE (BEST PRACTICE)
              </span>
              <button 
                onClick={() => copyToClipboard(fixResult.bestPractice, 'best')}
                className="btn btn-secondary"
                style={{ padding: '4px 8px', fontSize: '11px', gap: '4px' }}
              >
                {copiedBest ? <Check size={12} color="#10B981" /> : <span style={{ display: 'inline-flex', alignItems: 'center' }}><Copy size={12} /></span>}
                {copiedBest ? 'Copied' : 'Copy'}
              </button>
            </div>
            
            <pre style={{
              background: '#050811',
              padding: '12px',
              borderRadius: '8px',
              color: '#60A5FA',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              overflowX: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {fixResult.bestPractice}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}
