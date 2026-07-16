const aiService = require('../services/aiService');

/**
 * Handles incoming chat messages and generates assistant replies.
 */
const chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    const response = await aiService.getChatResponse(message);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = { chat };
