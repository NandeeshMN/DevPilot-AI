const aiService = require('../services/aiService');
const geminiService = require('../services/geminiService');
const groqService = require('../services/groqService');
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
 * Streaming chat endpoint using Server-Sent Events.
 * Streams AI tokens to the client as they arrive, then persists to Firestore.
 */
const chat = async (req, res, next) => {
  try {
    const { message, conversationId, provider } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return sendError(res, "Message prompt cannot be empty.", 400);
    }

    const userId = req.user.id.toLowerCase();
    const chatsRef = db.collection('chats');

    let conversationDoc;
    let existingMessages = [];
    let isNew = true;
    let createdAt = new Date().toISOString();
    let title = "";

    // ── Load conversation history ───────────────────────────────────────────
    if (conversationId) {
      conversationDoc = chatsRef.doc(conversationId);
      const chatDocSnap = await conversationDoc.get();

      if (chatDocSnap.exists) {
        const chatData = chatDocSnap.data();
        title = chatData.title;
        createdAt = chatData.createdAt;
        isNew = false;

        const messagesSnapshot = await conversationDoc
          .collection('messages')
          .orderBy('timestamp', 'asc')
          .get();

        existingMessages = messagesSnapshot.docs.map(doc => {
          const data = doc.data();
          return { role: data.role, content: data.content };
        });
      }
    }

    // Cap history to last 10 messages to keep prompts small and fast
    const trimmedHistory = existingMessages.slice(-10);

    if (isNew) {
      conversationDoc = conversationId ? chatsRef.doc(conversationId) : chatsRef.doc();
      title = message.trim().substring(0, 50);
      await conversationDoc.set({
        userId,
        title,
        createdAt,
        updatedAt: new Date().toISOString()
      });
    }

    // ── Set SSE headers ────────────────────────────────────────────────────
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // disable Nginx buffering on Render
    res.flushHeaders();

    // ── Stream AI response ─────────────────────────────────────────────────
    let fullReply = '';
    const selectedProvider = provider || 'gemini';

    try {
      let stream;
      if (selectedProvider === 'groq') {
        stream = groqService.generateGroqResponseStream(message, trimmedHistory);
      } else {
        stream = geminiService.generateResponseStream(message, trimmedHistory);
      }

      for await (const chunk of stream) {
        fullReply += chunk;
        // SSE format: "data: <payload>\n\n"
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }
    } catch (streamError) {
      // Fallback to Groq if Gemini fails mid-stream
      if (selectedProvider !== 'groq') {
        console.warn('Gemini stream failed, falling back to Groq:', streamError.message);
        fullReply = '';
        try {
          for await (const chunk of groqService.generateGroqResponseStream(message, trimmedHistory)) {
            fullReply += chunk;
            res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
          }
        } catch (groqErr) {
          res.write(`data: ${JSON.stringify({ error: 'AI service temporarily unavailable.' })}\n\n`);
          res.end();
          return;
        }
      } else {
        res.write(`data: ${JSON.stringify({ error: 'AI service temporarily unavailable.' })}\n\n`);
        res.end();
        return;
      }
    }

    // Signal end of stream
    res.write(`data: ${JSON.stringify({ done: true, conversationId: conversationDoc.id })}\n\n`);
    res.end();

    // ── Persist to Firestore asynchronously (does NOT block response) ───────
    const now = admin.firestore.FieldValue.serverTimestamp();
    Promise.all([
      conversationDoc.collection('messages').add({ role: 'user', content: message, model: null, timestamp: now }),
      conversationDoc.collection('messages').add({ role: 'assistant', content: fullReply, model: selectedProvider, timestamp: now }),
      conversationDoc.update({ updatedAt: new Date().toISOString() })
    ]).catch(err => console.error('Firestore persist error:', err));

  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all conversations for the authenticated user.
 */
const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id.toLowerCase();
    const chatsSnapshot = await db.collection('chats')
      .where('userId', '==', userId)
      .get();

    const list = [];
    chatsSnapshot.forEach(doc => {
      list.push({ id: doc.id, ...doc.data() });
    });

    // Sort by updatedAt desc
    list.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());

    return res.json({ success: true, conversations: list });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all messages of a specific conversation.
 */
const getConversationMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id.toLowerCase();

    const chatDocRef = db.collection('chats').doc(conversationId);
    const chatDocSnap = await chatDocRef.get();

    if (!chatDocSnap.exists) {
      return sendError(res, "Conversation not found", 404);
    }

    const chatData = chatDocSnap.data();
    if (chatData.userId !== userId) {
      return sendError(res, "Unauthorized access to conversation", 403);
    }

    const messagesSnapshot = await chatDocRef
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .get();

    const messages = messagesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        role: data.role,
        content: data.content,
        timestamp: data.timestamp ? data.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    });

    return res.json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a conversation and all its messages.
 */
const deleteConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id.toLowerCase();

    const chatDocRef = db.collection('chats').doc(conversationId);
    const chatDocSnap = await chatDocRef.get();

    if (!chatDocSnap.exists) {
      return sendError(res, "Conversation not found", 404);
    }

    const chatData = chatDocSnap.data();
    if (chatData.userId !== userId) {
      return sendError(res, "Unauthorized access to conversation", 403);
    }

    // Delete subcollection messages in batch
    const messagesSnapshot = await chatDocRef.collection('messages').get();
    if (!messagesSnapshot.empty) {
      const batch = db.batch();
      messagesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

    // Delete the parent document
    await chatDocRef.delete();

    return res.json({ success: true, message: "Conversation deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggles the pinned status of a conversation.
 */
const togglePinConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id.toLowerCase();

    const chatDocRef = db.collection('chats').doc(conversationId);
    const chatDocSnap = await chatDocRef.get();

    if (!chatDocSnap.exists) {
      return sendError(res, "Conversation not found", 404);
    }

    const chatData = chatDocSnap.data();
    if (chatData.userId !== userId) {
      return sendError(res, "Unauthorized access to conversation", 403);
    }

    const newPinnedStatus = !chatData.isPinned;
    await chatDocRef.update({
      isPinned: newPinnedStatus,
      updatedAt: new Date().toISOString()
    });

    return res.json({ success: true, isPinned: newPinnedStatus });
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
  chat,
  getConversations,
  getConversationMessages,
  deleteConversation,
  togglePinConversation
};
