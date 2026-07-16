export interface ExplainResponse {
  language: string;
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
  optimizations: string[];
}

export interface DebugResponse {
  rootCause: string;
  solution: string;
  correctedCode: string;
  bestPractice: string;
}

export interface GenerateResponse {
  language: string;
  framework: string;
  prompt: string;
  code: string;
}

export interface SqlResponse {
  query: string;
  sql: string;
  explanation: string;
  optimizations: string[];
}

export interface ReadmeResponse {
  markdown: string;
}

export interface TipResponse {
  success: boolean;
  tip: string;
}
