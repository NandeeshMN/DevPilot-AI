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
    const chatsRef = db.collection('chats');

    let conversationDoc;
    let existingMessages = [];
    let isNew = true;
    let createdAt = new Date().toISOString();
    let title = "";

    if (conversationId) {
      conversationDoc = chatsRef.doc(conversationId);
      const chatDocSnap = await conversationDoc.get();

      if (chatDocSnap.exists) {
        const chatData = chatDocSnap.data();
        title = chatData.title;
        createdAt = chatData.createdAt;
        isNew = false;

        // Fetch messages from subcollection ordered by timestamp asc
        const messagesSnapshot = await conversationDoc
          .collection('messages')
          .orderBy('timestamp', 'asc')
          .get();

        existingMessages = messagesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            role: data.role,
            content: data.content
          };
        });
      } else {
        // Fallback: Check the old users/{userId}/conversations/{conversationId} path
        const oldDocRef = db.collection('users').doc(userId).collection('conversations').doc(conversationId);
        const oldDocSnap = await oldDocRef.get();

        if (oldDocSnap.exists) {
          const oldData = oldDocSnap.data();
          title = oldData.title || "AI Chat Thread";
          createdAt = oldData.createdAt || new Date().toISOString();
          isNew = false;

          existingMessages = (oldData.messages || []).map(msg => ({
            role: msg.role === 'model' || msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
          }));

          // Self-heal: Migrate this specific conversation on the fly to prevent future fallbacks
          await conversationDoc.set({
            userId,
            title,
            createdAt,
            updatedAt: new Date().toISOString()
          });

          for (const [index, msg] of (oldData.messages || []).entries()) {
            let msgTimestamp;
            if (msg.timestamp) {
              msgTimestamp = msg.timestamp;
            } else {
              const baseDate = new Date(createdAt);
              baseDate.setSeconds(baseDate.getSeconds() + index);
              msgTimestamp = admin.firestore.Timestamp.fromDate(baseDate);
            }

            await conversationDoc.collection('messages').add({
              role: msg.role === 'model' || msg.role === 'assistant' ? 'assistant' : 'user',
              content: msg.content || "",
              model: msg.model || (msg.role === 'model' || msg.role === 'assistant' ? 'gemini' : null),
              timestamp: msgTimestamp
            });
          }
        }
      }
    }

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

    // Call unified AI Service wrapper supporting model fallback
    const { provider } = req.body;
    const reply = await aiService.generateAIResponse({
      provider,
      prompt: message,
      history: existingMessages
    });

    // Save user message in messages subcollection
    await conversationDoc.collection('messages').add({
      role: 'user',
      content: message,
      model: null,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // Save assistant message in messages subcollection
    await conversationDoc.collection('messages').add({
      role: 'assistant',
      content: reply,
      model: provider || 'gemini',
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update parent doc updatedAt metadata
    await conversationDoc.update({
      updatedAt: new Date().toISOString()
    });

    // Yield structured JSON response
    return res.status(200).json({
      success: true,
      conversationId: conversationDoc.id,
      reply,
      createdAt,
      model: provider === 'groq' ? (process.env.GROQ_MODEL || 'llama-3.3-70b-versatile') : (process.env.GEMINI_MODEL || 'gemini-3.5-flash')
    });

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
  deleteConversation
};
