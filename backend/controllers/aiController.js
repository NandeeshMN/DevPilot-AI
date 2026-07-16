const aiService = require('../services/aiService');
const geminiService = require('../services/geminiService');
const { admin, db } = require('../config/firebase');
const { sendError } = require('../utils/responseHandler');

/**
 * Explains code logic and computes time/space complexities.
 */
const explainCode = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const result = await aiService.explainCode(code, language);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Trouleshoots error logs and supplies corrected implementations.
 */
const debugCode = async (req, res, next) => {
  try {
    const { code, error } = req.body;
    const result = await aiService.debugCode(code, error);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Synthesizes functions or components.
 */
const generateCode = async (req, res, next) => {
  try {
    const { prompt, language, framework } = req.body;
    const result = await aiService.generateCode(prompt, language, framework);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Generates and optimizes SQL queries.
 */
const sqlAssistant = async (req, res, next) => {
  try {
    const { query } = req.body;
    const result = await aiService.getSqlAssistantResponse(query);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates Markdown README files.
 */
const readmeGenerator = async (req, res, next) => {
  try {
    const { name, description, installation, features } = req.body;
    const result = await aiService.generateReadme(name, description, installation, features);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Diagnostics API providing random optimization tip.
 */
const getTip = async (req, res, next) => {
  try {
    const tip = aiService.getRandomTip();
    return res.json({ success: true, tip });
  } catch (error) {
    next(error);
  }
};

/**
 * Enterprise endpoint running conversational engineering prompts through Gemini models.
 * Reuses active authMiddleware, validates inputs, and records history inside Firestore.
 */
const chat = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;

    // Reject empty messages or prompts
    if (!message || typeof message !== 'string' || !message.trim()) {
      return sendError(res, "Message prompt cannot be empty.", 400);
    }

    // Extract authenticated user ID from Bearer JWT
    const userId = req.user.id.toLowerCase();
    const conversationsRef = db.collection('users').doc(userId).collection('conversations');

    let conversationDoc;
    let existingMessages = [];
    let isNew = true;
    let createdAt = new Date().toISOString();

    if (conversationId) {
      conversationDoc = conversationsRef.doc(conversationId);
      const docSnap = await conversationDoc.get();
      if (docSnap.exists) {
        const data = docSnap.data();
        existingMessages = data.messages || [];
        createdAt = data.createdAt;
        isNew = false;
      }
    }

    if (isNew && !conversationDoc) {
      conversationDoc = conversationsRef.doc();
    }

    // Call Gemini API with user message and history
    const reply = await geminiService.generateResponse(message, existingMessages);

    // Save history inside Firestore using transaction timestamps
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    const assistantMessage = {
      role: 'assistant',
      content: reply,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    if (isNew) {
      // Auto generate conversation title from user first prompt (max 50 chars)
      const title = message.trim().substring(0, 50);

      await conversationDoc.set({
        title,
        createdAt,
        updatedAt: new Date().toISOString(),
        messages: [userMessage, assistantMessage]
      });
    } else {
      await conversationDoc.update({
        messages: admin.firestore.FieldValue.arrayUnion(userMessage, assistantMessage),
        updatedAt: new Date().toISOString()
      });
    }

    // Yield structured JSON response
    return res.status(200).json({
      success: true,
      conversationId: conversationDoc.id,
      reply,
      createdAt,
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  explainCode,
  debugCode,
  generateCode,
  sqlAssistant,
  readmeGenerator,
  getTip,
  chat
};
