const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

  /**
   * Diagnoses root causes of error stacks and returns safe guarded refactored codes.
   */
  async debugCode(code, error) {
    await delay(1600);
    const rootCause = error && error.includes('undefined')
      ? "A properties property-dereferencing issue. You are attempting to read keys of a variable that evaluates to 'undefined' or 'null' during runtime."
      : "A asynchronous race condition or variable scope leak where an invalid data container is queried before load verification resolves.";

    const solution = error && error.includes('undefined')
      ? "Implement modern JavaScript optional chaining (?.) or declare standard default properties during destructuring assignments."
      : "Safeguard structural updates with a local mounted flag or employ AbortControllers to cancel old async fetches before hooks unmount.";

    const correctedCode = code 
      ? (code.includes('.map') 
          ? code.replace(/\.map/g, '?.map') 
          : `// Safely guarded with sanity checkers\nif (!data) return null;\n` + code)
      : `// Corrected implementation safeguard
const handleRequest = async (req) => {
  try {
    const payload = req?.body ?? {};
    if (!payload.userId) {
      throw new Error("Invalid User Identifier");
    }
    // Proceed safely
    return { success: true };
  } catch (error) {
    console.error("Execution failed:", error.message);
    return { success: false, error: error.message };
  }
};`;

    return {
      rootCause,
      solution,
      correctedCode,
      bestPractice: `// Improved Code (Best Practice using modern ESM & Guard Clauses)
export const handleExecution = (data = {}) => {
  const { items = [], meta = { count: 0 } } = data;
  if (!items.length) {
    return { status: 'idle', count: 0 };
  }
  return {
    status: 'active',
    count: meta.count,
    payload: items.map(item => item.id)
  };
};`
    };
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
}

module.exports = new AIService();
