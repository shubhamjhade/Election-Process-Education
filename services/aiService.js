'use strict';
const { GoogleGenAI } = require('@google/genai');
const { structuredLog } = require('../utils/logger');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL_NAME = 'gemini-1.5-flash';
const SYSTEM_INSTRUCTION = `You are an expert on the Indian Election Process. You provide clear, concise, and easy-to-understand explanations about how elections work in India, including voter registration, polling steps, EVM/VVPAT usage, election timelines, the role of the Election Commission of India (ECI), and the Model Code of Conduct. Always be neutral, accurate, and helpful. Use simple language and bullet points when appropriate. Never discuss political opinions or endorse any party or candidate.`;

let ai;
try {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  structuredLog('info', 'GoogleGenAI initialized successfully');
} catch (error) {
  structuredLog('error', 'Failed to initialize GoogleGenAI', { error: error.message });
}

/**
 * Sends a user prompt to Gemini and returns the AI response.
 * @param {string} prompt - The user's election-related query.
 * @returns {Promise<string>} The generated text response.
 * @throws {Error} If the AI service is unavailable or returns an error.
 */
async function getElectionInfo(prompt) {
  if (!ai) {
    throw new Error('AI Service is not initialized. Check GEMINI_API_KEY.');
  }
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        maxOutputTokens: 1024,
        temperature: 0.2,
        topP: 0.8,
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    structuredLog('info', 'AI response generated', { promptLength: prompt.length });
    return response.text;
  } catch (error) {
    structuredLog('error', 'Vertex AI generation failed', { error: error.message });
    throw new Error('Failed to fetch response from AI service.');
  }
}

module.exports = { getElectionInfo };
