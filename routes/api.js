'use strict';
const express = require('express');
const router = express.Router();
const { getElectionInfo } = require('../services/aiService');
const { structuredLog } = require('../utils/logger');

/**
 * POST /api/chat
 * Accepts a prompt and returns an AI-generated election information response.
 */
router.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({ error: 'Prompt is required and must be a non-empty string.' });
    }
    if (prompt.length > 500) {
      return res.status(400).json({ error: 'Prompt too long. Maximum 500 characters.' });
    }
    const sanitized = prompt.trim();
    const aiResponse = await getElectionInfo(sanitized);
    structuredLog('info', 'Chat response served', { chars: aiResponse.length });
    res.json({ response: aiResponse });
  } catch (error) {
    structuredLog('error', 'Chat endpoint error', { error: error.message });
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

/**
 * GET /api/health
 * Returns service health status.
 */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;
