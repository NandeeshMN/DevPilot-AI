import React, { useState } from 'react';
import { FileText, Sparkles, Eye, FileCode, Copy, Check } from 'lucide-react';
import aiService from '../../services/aiService';

export default function ReadmeGenerator() {
  const [projectName, setProjectName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [features, setFeatures] = useState<string>("");
  const [installation, setInstallation] = useState<string>("");
  
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'raw'>("preview");
  const [markdown, setMarkdown] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await aiService.readmeGenerator(projectName, description, installation, features);
      setMarkdown(data.markdown || "");
    } catch (err) {
      // Local fallback markdown assembly
      const fallbackMd = `# ${projectName}\n\n${description}\n\n## 🚀 Features\n${features.split(',').map(f => `- ${f.trim()}`).join('\n')}\n\n## 🛠️ Installation\n\n\`\`\`bash\n${installation}\n\`\`\`\n\n## 🛡️ License\nDistributed under the MIT License.\n`;
      setMarkdown(fallbackMd);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!markdown) return;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Basic markdown to HTML renderer for the preview tab
  const renderPreviewHTML = () => {
    if (!markdown) return <div style={{ color: 'var(--color-text-dark)' }}>// Click 'Generate README' to compile preview...</div>;

    const featureList = features.split(',').map(f => f.trim()).filter(f => f);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '8px' }}>
        <h1 style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px', fontSize: '24px' }}>
          {projectName}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
          {description}
        </p>

        <div>
          <h2 style={{ fontSize: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '6px', marginBottom: '10px' }}>
            🚀 Features
          </h2>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', margin: 0 }}>
            {featureList.map((f, idx) => (
              <li key={idx} style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>{f}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '6px', marginBottom: '10px' }}>
            🛠️ Installation
          </h2>
          <pre style={{
            background: '#050811',
            padding: '12px',
            borderRadius: '6px',
            color: '#A78BFA',
            fontFamily: 'var(--font-mono)',
            fontSize: '12.5px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            margin: 0
          }}>
            {installation}
          </pre>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--color-text-dark)' }}>
          Distributed under the MIT License.
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in responsive-grid-main">
      
      {/* Left Column: Form Settings */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} color="#00F2FE" />
          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-main)' }}>Documentation Specs</span>
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
            Project Title
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={{
              width: '100%',
              background: '#050811',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'var(--color-text-main)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              height: '60px',
              background: '#050811',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'var(--color-text-main)',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              resize: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
            Key Features (Comma Separated)
          </label>
          <input
            type="text"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            style={{
              width: '100%',
              background: '#050811',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'var(--color-text-main)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
            Installation Steps
          </label>
          <textarea
            value={installation}
            onChange={(e) => setInstallation(e.target.value)}
            style={{
              width: '100%',
              height: '60px',
              background: '#050811',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'var(--color-text-main)',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              resize: 'none'
            }}
          />
        </div>

        <button 
          onClick={handleGenerate}
          className="btn btn-primary"
          style={{ width: '100%', gap: '8px', padding: '10px', background: 'var(--button-gradient)' }}
          disabled={loading}
        >
          <Sparkles size={14} /> {loading ? "Assembling markdown..." : "Generate README"}
        </button>

      </div>

      {/* Right Column: Viewer Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Toggle Viewer Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#0D1322', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={() => setActiveTab("preview")}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'preview' ? 'rgba(79, 140, 255, 0.1)' : 'transparent',
                color: activeTab === 'preview' ? '#00F2FE' : 'var(--color-text-muted)',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              <Eye size={12} /> Standard Preview
            </button>
            <button
              onClick={() => setActiveTab("raw")}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'raw' ? 'rgba(79, 140, 255, 0.1)' : 'transparent',
                color: activeTab === 'raw' ? '#00F2FE' : 'var(--color-text-muted)',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              <FileCode size={12} /> Raw Markdown
            </button>
          </div>

          {markdown && (
            <button 
              onClick={handleCopy}
              className="btn btn-secondary" 
              style={{ padding: '6px 12px', fontSize: '11px', gap: '4px' }}
            >
              {copied ? <Check size={12} color="#10B981" /> : <span style={{ display: 'inline-flex', alignItems: 'center' }}><Copy size={12} /></span>}
              {copied ? 'Copied!' : 'Copy Doc'}
            </button>
          )}
        </div>

        {/* Console Box */}
        <div className="glass-card" style={{ minHeight: '380px', padding: '24px', overflowY: 'auto' }}>
          {activeTab === 'preview' ? (
            renderPreviewHTML()
          ) : (
            <pre style={{
              margin: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: '12.5px',
              color: '#34D399',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {markdown || "// Markdown code will output here..."}
            </pre>
          )}
        </div>

      </div>
    </div>
  );
}
