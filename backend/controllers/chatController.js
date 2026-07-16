const aiService = require('../services/aiService');

/**
 * Handles incoming chat messages and generates assistant replies using the unified AI service.
 */
const chat = async (req, res, next) => {
  try {
    const { message, provider } = req.body;
    const reply = await aiService.generateAIResponse({
      provider,
      prompt: message
    });
    return res.json({ success: true, reply });
  } catch (error) {
    next(error);
  }
};

module.exports = { chat };
