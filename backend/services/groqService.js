const Groq = require('groq-sdk');

/**
 * Enterprise service directing conversation prompts to Groq Llama models.
 */
class GroqService {
  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GROQ_API_KEY in environment variables.");
    }
    
    // Initialize the official Groq client
    this.groq = new Groq({ apiKey });
    this.defaultModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  }

  /**
   * Generates a conversational assistant response from Groq Llama.
   * @param {string} prompt - Current user prompt
   * @param {Array<Object>} conversationHistory - Legitimate conversation logs array
   * @returns {Promise<string>}
   */
  async generateGroqResponse(prompt, conversationHistory = []) {
    // Map existing history to Groq structure
    const messages = conversationHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    // Append the current user prompt
    messages.push({
      role: 'user',
      content: prompt
    });

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages,
        model: this.defaultModel,
      });

      return chatCompletion.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Groq API completion error:", error);
      throw error;
    }
  }
  /**
   * Streams a conversational assistant response from Groq as an async generator.
   * @param {string} prompt
   * @param {Array<Object>} conversationHistory
   * @yields {string} text chunk
   */
  async *generateGroqResponseStream(prompt, conversationHistory = []) {
    const messages = conversationHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));
    messages.push({ role: 'user', content: prompt });

    const stream = await this.groq.chat.completions.create({
      messages,
      model: this.defaultModel,
      stream: true
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content;
      if (text) yield text;
    }
  }
}

module.exports = new GroqService();
