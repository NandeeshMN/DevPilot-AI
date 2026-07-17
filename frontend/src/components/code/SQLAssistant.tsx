import React, { useState } from 'react';
import { Database, Sparkles, Terminal, BookOpen, Copy, Check } from 'lucide-react';
import aiService from '../../services/aiService';

interface SQLData {
  sql: string;
  explanation: string;
  optimizations: string[];
}

export default function SQLAssistant() {
  const [nlpQuery, setNlpQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  
  const [sqlData, setSqlData] = useState<SQLData>({
    sql: "",
    explanation: "Type your query requirements in natural language and click 'Translate to SQL' to generate optimized database queries.",
    optimizations: []
  });

  const handleTranslate = async () => {
    if (!nlpQuery.trim() || loading) return;
    setLoading(true);

    try {
      const data = await aiService.sqlAssistant(nlpQuery);
      setSqlData({
        sql: data.sql || "",
        explanation: data.explanation || "",
        optimizations: data.optimizations || []
      });
    } catch (err) {
      // Local fallback
      setSqlData({
        sql: `SELECT u.id, u.username, COUNT(p.id) AS post_count \nFROM users u\nINNER JOIN posts p ON u.id = p.user_id\nWHERE u.status = 'active'\nGROUP BY u.id, u.username\nORDER BY post_count DESC\nLIMIT 10;`,
        explanation: "This query filters the 'users' table for active status, joins the 'posts' table, aggregates post counts grouped by user details, and outputs the top 10 users.",
        optimizations: [
          "Create a composite index on users(status, id) to boost search execution speed.",
          "Establish index constraints on posts(user_id) to optimize key lookups."
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!sqlData.sql) return;
    navigator.clipboard.writeText(sqlData.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
      
      {/* Left Column: Natural Language Input */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', height: 'fit-content' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={16} color="#00F2FE" />
          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-main)' }}>NLP Input Console</span>
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
            Describe your Database Query
          </label>
          <textarea
            value={nlpQuery}
            onChange={(e) => setNlpQuery(e.target.value)}
            style={{
              width: '100%',
              height: '140px',
              background: '#050811',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: 'var(--color-text-main)',
              fontSize: '13.5px',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              resize: 'none'
            }}
          />
        </div>

        <button 
          onClick={handleTranslate}
          className="btn btn-primary"
          style={{ width: '100%', gap: '8px', padding: '12px', background: 'var(--button-gradient)' }}
          disabled={loading}
        >
          <Sparkles size={16} /> {loading ? "Generating indexes..." : "Translate to SQL"}
        </button>

      </div>

      {/* Right Column: SQL Output board */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Output Console header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={16} color="#00F2FE" />
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)' }}>SQL Execution Plan</span>
          </div>

          {sqlData.sql && (
            <button 
              onClick={handleCopy}
              className="btn btn-secondary" 
              style={{ padding: '6px 12px', fontSize: '11px', gap: '4px' }}
            >
              {copied ? <Check size={12} color="#10B981" /> : <span style={{ display: 'inline-flex', alignItems: 'center' }}><Copy size={12} /></span>}
              {copied ? 'Copied' : 'Copy SQL'}
            </button>
          )}
        </div>

        {/* Monaco Editor style SQL block */}
        <div className="monaco-editor-mock">
          <div className="monaco-header">
            <div className="monaco-dots">
              <span className="monaco-dot red"></span>
              <span className="monaco-dot yellow"></span>
              <span className="monaco-dot green"></span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>query.sql</span>
          </div>
          <div className="monaco-body" style={{ padding: '16px', display: 'block', overflow: 'auto', minHeight: '160px' }}>
            {sqlData.sql ? (
              <pre style={{
                margin: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px',
                color: '#60A5FA',
                lineHeight: '1.6'
              }}>
                {sqlData.sql}
              </pre>
            ) : (
              <div style={{ color: 'var(--color-text-dark)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                {loading ? "Typing stream in progress..." : "-- Translated queries appear here..."}
              </div>
            )}
          </div>
        </div>

        {/* Explanation Card */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--color-text-main)' }}>
            <BookOpen size={14} color="#8B5CF6" />
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Execution Logic</span>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            {sqlData.explanation}
          </p>
        </div>

        {/* Optimization Cards */}
        {sqlData.optimizations && sqlData.optimizations.length > 0 && (
          <div className="glass-card" style={{ padding: '20px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#10B981' }}>
              <Sparkles size={14} />
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>SQL Optimizer Tips</span>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyleType: 'none', padding: 0, margin: 0 }}>
              {sqlData.optimizations.map((tip, index) => (
                <li key={index} style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#10B981' }}>✓</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}
