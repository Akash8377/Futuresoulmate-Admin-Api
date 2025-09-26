const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

// Get all conversations
router.get('/', conversationController.getAllConversation);

module.exports = router;