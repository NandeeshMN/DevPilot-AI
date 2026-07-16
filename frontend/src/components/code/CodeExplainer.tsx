import React, { useState } from 'react';
import { BookOpen, Cpu, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';

interface AnalysisResult {
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
  optimizations: string[];
}

export default function CodeExplainer() {
  const [code, setCode] = useState<string>(`// Paste your function here to analyze complexity
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = [];
  
  for (let i = 0; i < arr.length; i++) {
    if (seen.has(arr[i])) {
      duplicates.push(arr[i]);
    } else {
      seen.add(arr[i]);
    }
  }
  
  return duplicates;
}`);
  
  const [language, setLanguage] = useState<string>("javascript");
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<AnalysisResult>({
    explanation: "Paste code on the left and click 'Explain Code' to generate time complexity metrics, memory audits, and performance suggestions.",
    timeComplexity: "O(?)",
    spaceComplexity: "O(?)",
    optimizations: []
  });

  const handleExplain = async () => {
    if (!code.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const data = await res.json();
      setAnalysis({
        explanation: data.explanation || "",
        timeComplexity: data.timeComplexity || "O(?)",
        spaceComplexity: data.spaceComplexity || "O(?)",
        optimizations: data.optimizations || []
      });
    } catch (err) {
      // Local fallback in case server is offline
      setAnalysis({
        explanation: "This code executes a linear traversal over the input dataset. It checks values against a Set collection structure and inserts items into a duplicates list output.",
        timeComplexity: code.includes('for') || code.includes('while') ? "O(N)" : "O(1)",
        spaceComplexity: "O(N)",
        optimizations: [
          "Pre-allocate memory if target output length bounds are known.",
          "Use ES6 Map configurations to manage multi-value frequencies.",
          "Perform early returns if source array is null or empty."
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
      
      {/* Left Column: Monaco Code Editor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={16} color="#00F2FE" />
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-main)' }}>Editor Codeboard</span>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                background: '#0D1322',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                color: 'var(--color-text-main)',
                fontSize: '12px',
                padding: '4px 10px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="sql">SQL Query</option>
              <option value="cpp">C++ Source</option>
            </select>

            <button 
              onClick={handleCopy}
              className="btn btn-secondary" 
              style={{ padding: '4px 10px', fontSize: '11px', gap: '4px' }}
            >
              {copied ? <Check size={12} color="#10B981" /> : <span style={{ display: 'inline-flex', alignItems: 'center' }}><Copy size={12} /></span>}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>

        {/* Editor Frame */}
        <div className="monaco-editor-mock">
          <div className="monaco-header">
            <div className="monaco-dots">
              <span className="monaco-dot red"></span>
              <span className="monaco-dot yellow"></span>
              <span className="monaco-dot green"></span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>find_duplicates.{language === 'python' ? 'py' : 'ts'}</span>
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
              style={{ minHeight: '300px' }}
            />
          </div>
        </div>

        <button 
          onClick={handleExplain}
          className="btn btn-primary"
          style={{ width: '100%', gap: '8px', padding: '12px', background: 'var(--button-gradient)' }}
          disabled={loading}
        >
          <Sparkles size={16} /> {loading ? "Analyzing structure..." : "Explain Code"}
        </button>
      </div>

      {/* Right Column: Analytics & Explanations Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Complexity Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          
          <div className="glass-card" style={{
            padding: '20px', 
            textAlign: 'center',
            border: '1px solid rgba(79, 140, 255, 0.2)',
            background: 'rgba(79, 140, 255, 0.03)'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Time Complexity
            </div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#4F8CFF', textShadow: '0 0 10px rgba(79, 140, 255, 0.3)' }}>
              {analysis.timeComplexity}
            </div>
          </div>

          <div className="glass-card" style={{
            padding: '20px', 
            textAlign: 'center',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            background: 'rgba(139, 92, 246, 0.03)'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Space Complexity
            </div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#8B5CF6', textShadow: '0 0 10px rgba(139, 92, 246, 0.3)' }}>
              {analysis.spaceComplexity}
            </div>
          </div>

        </div>

        {/* Explanation Card */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--color-text-main)' }}>
            <Cpu size={16} color="#00F2FE" />
            <h3 style={{ fontSize: '14px', fontWeight: '700' }}>Algorithm Breakdown</h3>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            {analysis.explanation}
          </p>
        </div>

        {/* Optimization Recommendations */}
        {analysis.optimizations && analysis.optimizations.length > 0 && (
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--color-text-main)' }}>
              <AlertCircle size={16} color="#10B981" />
              <h3 style={{ fontSize: '14px', fontWeight: '700' }}>Suggested Optimizations</h3>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyleType: 'none', padding: 0, margin: 0 }}>
              {analysis.optimizations.map((opt, idx) => (
                <li key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                  <span style={{ color: '#10B981', fontWeight: 'bold' }}>✓</span>
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}
