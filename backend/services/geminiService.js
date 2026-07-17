const { GoogleGenAI } = require('@google/genai');

/**
 * Enterprise service directing conversation prompts to Google's Gemini models.
 */
class GeminiService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY in environment variables.");
    }
    
    // Initialize the official GoogleGenAI client
    this.ai = new GoogleGenAI({ apiKey });
    this.defaultModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
  }

  /**
   * Generates a conversational assistant response from Gemini.
   * @param {string} message - Current user prompt
   * @param {Array<Object>} history - Legitimate conversation logs array
   * @returns {Promise<string>}
   */
  async generateResponse(message, history = []) {
    const systemInstruction = `You are DevPilot AI, an expert AI software engineering assistant.

Your responsibilities include:
- Writing clean production-ready code.
- Debugging code.
- Explaining programming concepts.
- Reviewing source code.
- Designing software architecture.
- Assisting with React, TypeScript, JavaScript, Node.js, Express.js, Python, Java, SQL, MongoDB, Firebase, Cloud technologies and AI development.
- Providing optimized and secure solutions.
- Formatting responses using Markdown with proper code blocks whenever appropriate.

Always provide accurate, concise, professional, and developer-friendly responses.`;

    // Map existing logs history to Gemini structure
    const contents = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Append the current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const maxRetries = 3;
    let retryDelay = 1500; // start with 1.5 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.ai.models.generateContent({
          model: this.defaultModel,
          contents,
          config: {
            systemInstruction
          }
        });
        return response.text;
      } catch (error) {
        const isUnavailable = error.message && (
          error.message.includes('503') || 
          error.message.includes('UNAVAILABLE') || 
          error.message.includes('high demand')
        );

        if (isUnavailable && attempt < maxRetries) {
          console.warn(`Gemini API returned 503 (high demand). Retrying attempt ${attempt + 1}/${maxRetries} in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          retryDelay *= 2; // exponential backoff
          continue;
        }
        throw error;
      }
    }
  }
  /**
   * Streams a conversational assistant response from Gemini as an async generator.
   * @param {string} message
   * @param {Array<Object>} history
   * @yields {string} text chunk
   */
  async *generateResponseStream(message, history = []) {
    const systemInstruction = `You are DevPilot AI, an expert AI software engineering assistant.

Your responsibilities include:
- Writing clean production-ready code.
- Debugging code.
- Explaining programming concepts.
- Reviewing source code.
- Designing software architecture.
- Assisting with React, TypeScript, JavaScript, Node.js, Express.js, Python, Java, SQL, MongoDB, Firebase, Cloud technologies and AI development.
- Providing optimized and secure solutions.
- Formatting responses using Markdown with proper code blocks whenever appropriate.

Always provide accurate, concise, professional, and developer-friendly responses.`;

    const contents = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const streamResult = await this.ai.models.generateContentStream({
      model: this.defaultModel,
      contents,
      config: { systemInstruction }
    });

    for await (const chunk of streamResult) {
      const text = chunk.text;
      if (text) yield text;
    }
  }
}

module.exports = new GeminiService();
