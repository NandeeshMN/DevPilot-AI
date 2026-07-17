const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const geminiService = require('./geminiService');
const groqService = require('./groqService');

const tips = [
  "Use AbortController to cleanly cancel outstanding API requests in React useEffect hooks.",
  "Optimize SQL indexes by analyzing EXPLAIN query execution plans.",
  "Implement JWT refresh tokens in separate HTTP-only cookies to mitigate CSRF and XSS threats.",
  "Use CSS variables combined with clamp() for smooth fluid typography across viewport sizes.",
  "Leverage TanStack Query (React Query) for automatic cache invalidation and background refetching."
];

class AIService {
  /**
   * Mock AI chat reply matching request patterns.
   */
  async getChatResponse(message) {
    await delay(1200);
    let responseText = "";
    let codeBlock = "";

    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('auth') || lowerMsg.includes('login') || lowerMsg.includes('oauth')) {
      responseText = "To set up secure authentication in React, I highly recommend using standard OAuth2 protocols or libraries like **@auth/core** or **Clerk**. Below is a clean React hook implementation for handling user auth state with Firebase / custom backend.";
      codeBlock = `// useAuth.js - Custom React Auth State Hook
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replicating authentication subscriber
    const unsubscribe = mockAuthService.onAuthStateChanged(currentUser => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};`;
    } else if (lowerMsg.includes('scroll') || lowerMsg.includes('infinite') || lowerMsg.includes('intersection')) {
      responseText = "Certainly! Replicating custom scroll triggers is best achieved with the **Intersection Observer API**. It provides high performance by avoiding scroll-event event-listeners.";
      codeBlock = `// useInfiniteScroll.ts
import { useEffect, useRef, useState } from 'react';

export const useInfiniteScroll = (callback: () => void) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        callback();
      }
    });

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [callback]);

  return { elementRef };
};`;
    } else if (lowerMsg.includes('perf') || lowerMsg.includes('optimize') || lowerMsg.includes('memo')) {
      responseText = "Optimizing React performance involves reducing unnecessary renders and code weight. Use `React.memo` to wrap pure presentation components, and optimize lists using virtualization libraries like **react-window**.";
      codeBlock = `// OptimizedVirtualizedList.jsx
import React from 'react';
import { FixedSizeList as List } from 'react-window';

const Row = ({ index, style }) => (
  <div style={style} className="p-4 border-b border-gray-800">
    Row ID: {index}
  </div>
);

export const VirtualizedContainer = ({ itemsCount }) => (
  <List
    height={400}
    itemCount={itemsCount}
    itemSize={50}
    width={'100%'}
  >
    {Row}
  </List>
);`;
    } else {
      responseText = `Here is a custom architectural approach for your query: "${message}". We use pure functional design principles, separation of concerns, and clean typescript typing declarations to guarantee maintainability.`;
      codeBlock = `// DeveloperEngine.ts
export interface Configuration {
  debugMode: boolean;
  neuralWeights: number[];
}

export class Engine {
  private config: Configuration;

  constructor(config: Configuration) {
    this.config = config;
  }

  public async runSync(): Promise<boolean> {
    try {
      console.log("Core initialization started...");
      return true;
    } catch (e) {
      return false;
    }
  }
}`;
    }

    return {
      sender: "assistant",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: responseText,
      code: codeBlock,
      suggestedFollowUp: [
        "Can you add Error Boundaries to this?",
        "How do we write Jest test cases for this?",
        "What is the performance complexity?"
      ]
    };
  }

  /**
   * Evaluates time/space complexities and returns structured code explanations.
   */
  async explainCode(code, language) {
    await delay(1500);
    const lines = code.split('\n').length;
    const timeComplexity = code.includes('for') || code.includes('while') 
      ? (code.includes('nested') || code.match(/(for|while).*[\s\S]*(for|while)/) ? "O(N²)" : "O(N)")
      : "O(1)";
    const spaceComplexity = code.includes('new Array') || code.includes('push') ? "O(N)" : "O(1)";

    return {
      language: language || "javascript",
      explanation: `This ${language || "JavaScript"} code snippet consists of ${lines} lines of code. It acts as an operational pipeline. 
      1. First, it establishes the boundary arguments, handling potential edge cases (like null/undefined checks).
      2. Then, it walks through data transformation utilizing structural flow patterns.
      3. Finally, it yields the processed output array or interface status.`,
      timeComplexity,
      spaceComplexity,
      optimizations: [
        "Minimize memory allocations by reusing temporary variable references.",
        "Check boundaries before executing loop iterations to eliminate redundant computations.",
        "Convert linear recursive checks into iteration structures to prevent potential Call Stack overflows."
      ]
    };
  }

  async debugCode(code, error) {
    const prompt = `You are a Senior AI Software Architect and Principal Full-Stack Engineer.
Analyze the following code context.
Code to debug:
\`\`\`
${code}
\`\`\`
Predicted error (if any): ${error || "None specified"}

You must return a structured JSON object containing your analysis and recommended fixes.
Return ONLY valid JSON matching this schema structure exactly:
{
  "bugType": "Runtime Error | Syntax Error | Type Error | Logic Error | Reference Error | Memory Leak | Performance Issue | Security Vulnerability | API Misuse | Null Pointer | Async Issue | Race Condition | Infinite Loop | Unhandled Exception | Dependency Issue",
  "severity": "Critical | High | Medium | Low | Informational",
  "confidence": 98,
  "confidenceReason": "Confidence explanation in English...",
  "runtimeError": "The predicted runtime error message (e.g. TypeError: Cannot read properties of undefined (reading 'map'))",
  "rootCause": "Clear explanation of why it throws the error (e.g. users is undefined. Calling map() on undefined throws a TypeError.)",
  "correctedCode": "The corrected production-grade code",
  "diff": [
    { "type": "unchanged | removed | added", "text": "line content" }
  ],
  "explanation": "Clear explanation of changes made in plain English theory (no code snippets, no backticks, no markdown inside description, just english theory)",
  "alternatives": [
    {
      "title": "Title of alternative solution",
      "code": "alternative code block",
      "pros": "pros description",
      "cons": "cons description",
      "useCase": "usecase description",
      "recommended": false
    }
  ],
  "bestPractices": [
    "Enable strictNullChecks",
    "Validate API responses"
  ],
  "security": [
    {
      "risk": "Secrets Exposure | XSS | SQL Injection | Command Injection | Weak Validation | Unsafe Regex | Unsafe eval() | Hardcoded API Keys | None",
      "description": "Risk description or 'None'"
    }
  ],
  "performance": {
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "complexityChanged": false
  },
  "qualityScore": {
    "original": 3,
    "corrected": 9,
    "explanation": "Why the score improved..."
  }
}

Important Instructions:
- Do not mention guard clauses, default parameters, refactoring, or optimizations in the explanation unless they actually exist in the correctedCode.
- The "diff" lines must list unchanged, removed, and added lines in chronological order to represent the transition from the original code to the correctedCode.
- Do not include markdown formatting or wrapping around the output. Output ONLY the JSON string.`;

    let responseText = "";
    try {
      responseText = await geminiService.generateResponse(prompt, []);
    } catch (err) {
      console.warn("Gemini call for debugCode failed, attempting fallback to Groq Llama...", err.message);
      try {
        responseText = await groqService.generateGroqResponse(prompt, []);
      } catch (groqError) {
        console.error("Groq fallback also failed for debugCode:", groqError.message);
        throw new Error("AI service temporarily unavailable");
      }
    }

    try {
      let cleaned = responseText.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.substring(7);
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.substring(3);
      }
      if (cleaned.endsWith("```")) {
        cleaned = cleaned.substring(0, cleaned.length - 3);
      }
      cleaned = cleaned.trim();
      
      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (parseError) {
      console.error("Failed to parse AI JSON response for debugCode:", parseError, responseText);
      // Return a clean fallback matching the schema
      return {
        bugType: "Runtime Error",
        severity: "High",
        confidence: 90,
        confidenceReason: "Fell back to rule-based analysis because the AI output parsing failed.",
        runtimeError: "TypeError: Cannot read properties of undefined (reading 'map')",
        rootCause: "A variable evaluates to undefined/null but its properties are read.",
        correctedCode: code.includes('.map') ? code.replace(/\.map/g, '?.map') : code,
        diff: [
          { type: "removed", text: code },
          { type: "added", text: code.includes('.map') ? code.replace(/\.map/g, '?.map') : code }
        ],
        explanation: "Replaced direct property accesses with safe optional chaining operator to prevent runtime crashes.",
        alternatives: [
          {
            title: "Default Initializer",
            code: "const items = data || [];",
            pros: "Very clean and highly portable.",
            cons: "May require extra checks elsewhere.",
            useCase: "Empty array safety.",
            recommended: true
          }
        ],
        bestPractices: ["Enable strictNullChecks in tsconfig", "Ensure default value fallbacks"],
        security: [{ risk: "None", description: "No clear vulnerability detected." }],
        performance: { timeComplexity: "O(1)", spaceComplexity: "O(1)", complexityChanged: false },
        qualityScore: { original: 4, corrected: 8, explanation: "Code is crash-safe." }
      };
    }
  }

  /**
   * Synthesizes custom components or functions based on language, framework and prompt instructions.
   */
  async generateCode(prompt, language, framework) {
    await delay(1400);
    let code = "";
    const lang = (language || 'javascript').toLowerCase();
    const fw = (framework || 'react').toLowerCase();

    if (lang === 'sql') {
      code = `-- Generated SQL Query for: ${prompt}
SELECT 
    u.id AS user_id,
    u.username,
    COUNT(o.id) AS total_orders,
    SUM(o.amount) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY u.id, u.username
HAVING total_spent > 500
ORDER BY total_spent DESC;`;
    } else if (fw === 'react' || fw === 'nextjs') {
      code = `// React Component: ${prompt}
import React, { useState, useEffect } from 'react';

export const DevPilotComponent = ({ title = "Dashboard widget", onSync }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data');
        const json = await response.json();
        setData(json.items || []);
      } catch (err) {
        console.error("Failed loading data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="card-container p-6 bg-slate-900 border border-slate-800 rounded-xl">
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      {loading ? (
        <div className="animate-pulse h-4 bg-slate-800 rounded w-1/2"></div>
      ) : (
        <ul className="space-y-2">
          {data.map(item => (
            <li key={item.id} className="text-gray-300 text-sm flex justify-between">
              <span>{item.name}</span>
              <span className="text-blue-400 font-mono">{item.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};`;
    } else {
      code = `// Generated helper for: ${prompt}
// Written in ${language}
function processWorkspaceData(items) {
  if (!Array.isArray(items)) {
    throw new TypeError("Expected an array of items");
  }
  
  return items
    .filter(item => item.isActive)
    .map(item => ({
      ...item,
      processedAt: new Date().toISOString(),
      score: item.weight * 1.5
    }));
}`;
    }

    return {
      language: lang,
      framework: fw,
      prompt,
      code
    };
  }

  /**
   * Translates NLP instructions into optimized SQL queries.
   */
  async getSqlAssistantResponse(query) {
    await delay(1200);
    const cleanQuery = query.toLowerCase();
    let sql = "";
    let explanation = "";

    if (cleanQuery.includes('join') || cleanQuery.includes('relationship') || cleanQuery.includes('user')) {
      sql = `SELECT 
  u.id, 
  u.email, 
  p.profile_picture, 
  COUNT(posts.id) AS post_count
FROM users u
INNER JOIN profiles p ON u.id = p.user_id
LEFT JOIN posts ON u.id = posts.author_id
WHERE u.status = 'active'
GROUP BY u.id, u.email, p.profile_picture
ORDER BY post_count DESC
LIMIT 10;`;
      explanation = "Joins the 'users' and 'profiles' tables via user_id. Aggregates post count from the 'posts' table grouped by active status, ranking users by their post counts.";
    } else {
      sql = `SELECT 
  id, 
  event_name, 
  created_at
FROM system_logs
WHERE severity = 'error' 
  AND created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;`;
      explanation = "Fetches the list of severe errors from the system_logs table recorded over the past 7 days, sorted chronologically from newest to oldest.";
    }

    return {
      query,
      sql,
      explanation,
      optimizations: [
        "Ensure an index exists on the foreign keys to prevent table scans.",
        "Add composite index on (severity, created_at) to accelerate lookup speeds."
      ]
    };
  }

  /**
   * Builds custom formatted Markdown README files.
   */
  async generateReadme(name, description, installation, features) {
    await delay(1300);
    const formattedMarkdown = `# ${name || "DevPilot Application"}

${description || "An AI-powered software workspace application."}

## 🚀 Features
${features ? features.split(',').map(f => `- ${f.trim()}`).join('\n') : '- AI Assistant integrations\n- Visual code explanations\n- Quick troubleshooting logs'}

## 🛠️ Installation

\`\`\`bash
${installation || 'npm install\nnpm run dev'}
\`\`\`

## 🛡️ License
Distributed under the MIT License. See \`LICENSE\` for details.
`;

    return {
      markdown: formattedMarkdown
    };
  }

  /**
   * Returns a random tip from our diagnostic array list.
   */
  getRandomTip() {
    return tips[Math.floor(Math.random() * tips.length)];
  }

  /**
   * Orchestrates multi-model completions supporting automatic provider fallback.
   */
  async generateAIResponse({ provider, prompt, history = [] }) {
    const selectedProvider = provider || 'gemini';

    if (selectedProvider === 'groq') {
      try {
        return await groqService.generateGroqResponse(prompt, history);
      } catch (err) {
        console.error("Groq Llama completion failed:", err.message);
        throw new Error("AI service temporarily unavailable");
      }
    }

    // Default: Gemini first
    try {
      return await geminiService.generateResponse(prompt, history);
    } catch (error) {
      const isTemporaryFailure = error.message && (
        error.message.includes('503') ||
        error.message.includes('UNAVAILABLE') ||
        error.message.includes('overloaded') ||
        error.message.includes('timeout') ||
        error.message.includes('limit') ||
        error.message.includes('rate')
      );

      if (isTemporaryFailure) {
        console.warn(`Gemini failed with error: "${error.message}". Automatically falling back to Groq Llama...`);
        try {
          return await groqService.generateGroqResponse(prompt, history);
        } catch (groqError) {
          console.error("Groq Llama fallback failed as well:", groqError.message);
          throw new Error("AI service temporarily unavailable");
        }
      }
      // Re-throw other unexpected errors
      throw error;
    }
  }
}

module.exports = new AIService();
