const express = require('express');
const router = express.Router();
const { getElectionInfo } = require('../services/aiService');

router.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({ error: 'Prompt is required and must be a valid string.' });
    }

    // Input length validation to prevent abuse and excessive token usage
    if (prompt.length > 500) {
      return res.status(400).json({ error: 'Prompt is too long. Maximum 500 characters allowed.' });
    }

    const aiResponse = await getElectionInfo(prompt);
    
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

module.exports = router;
