const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

// AI assistant endpoints
router.post('/explain', aiController.explainCode);
router.post('/debug', aiController.debugCode);
router.post('/generate', aiController.generateCode);
router.post('/sql', aiController.sqlAssistant);
router.post('/readme', aiController.readmeGenerator);
router.get('/tip', aiController.getTip);

// Conversational Chat Endpoint (Secured by JWT)
router.post('/ai/chat', authMiddleware, aiController.chat);

module.exports = router;
