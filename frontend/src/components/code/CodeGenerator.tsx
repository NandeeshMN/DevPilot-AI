import React, { useState } from 'react';
import { Code, Terminal, Sparkles, Copy, Download, Check } from 'lucide-react';
import aiService from '../../services/aiService';

export default function CodeGenerator() {
  const [prompt, setPrompt] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [framework, setFramework] = useState<string>("react");
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);

    try {
      const data = await aiService.generateCode(prompt, language, framework);
      setGeneratedCode(data.code || "");
    } catch (err) {
      // Local fallback template generators
      let fallbackCode = "";
      if (language === 'sql') {
        fallbackCode = `-- Fallback SQL query for: ${prompt}\nSELECT * FROM users WHERE status = 'active';`;
      } else {
        fallbackCode = `// Generated component for: ${prompt}
// Written in ${language} using ${framework} framework
import React, { useEffect } from 'react';

export const GeneratedWidget = ({ isOpen, onClose, children }: any) => {
  useEffect(() => {
    const handleEscape = (e: any) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#111827', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
        {children}
        <button onClick={onClose} style={{ marginTop: '16px', padding: '6px 12px', background: '#3B82F6', border: 'none', color: '#fff', borderRadius: '6px' }}>
          Close
        </button>
      </div>
    </div>
  );
};`;
      }
      setGeneratedCode(fallbackCode);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Choose appropriate file suffix
    let suffix = 'js';
    if (language === 'typescript') suffix = 'ts';
    if (language === 'python') suffix = 'py';
    if (language === 'sql') suffix = 'sql';
    
    link.href = url;
    link.download = `devpilot_generated.${suffix}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in responsive-grid-main">
      
      {/* Left Column: Form Controls */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
        
        <div>
          <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
            Prompt / Instructions
          </label>
          <textarea
            placeholder="Add your ideas to generate code..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{
              width: '100%',
              height: '120px',
              background: '#050811',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: 'var(--color-text-main)',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              resize: 'none'
            }}
          />
        </div>



        <button 
          onClick={handleGenerate}
          className="btn btn-primary"
          style={{ width: '100%', gap: '8px', padding: '12px', background: 'var(--button-gradient)' }}
          disabled={loading}
        >
          <Sparkles size={16} /> {loading ? "Synthesizing boilerplate..." : "Generate Code"}
        </button>

      </div>

      {/* Right Column: Codeboard Viewer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={16} color="#00F2FE" />
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)' }}>Generated Blueprint</span>
          </div>

          {generatedCode && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleCopy}
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '11px', gap: '4px' }}
              >
                {copied ? <Check size={12} color="#10B981" /> : <span style={{ display: 'inline-flex', alignItems: 'center' }}><Copy size={12} /></span>}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button 
                onClick={handleDownload}
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '11px', gap: '4px' }}
              >
                <Download size={12} /> Download
              </button>
            </div>
          )}
        </div>

        {/* Monaco Editor Output Mock */}
        <div className="monaco-editor-mock" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
          <div className="monaco-header">
            <div className="monaco-dots">
              <span className="monaco-dot red"></span>
              <span className="monaco-dot yellow"></span>
              <span className="monaco-dot green"></span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>output_code</span>
          </div>
          <div className="monaco-body" style={{ flexGrow: 1, padding: '16px', display: 'block', overflow: 'auto' }}>
            {generatedCode ? (
              <pre style={{
                margin: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px',
                color: '#E5E7EB',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {generatedCode}
              </pre>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-dark)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                {loading ? "Typing stream in progress..." : "// Code output will appear here..."}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
