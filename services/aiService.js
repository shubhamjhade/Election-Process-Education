const { GoogleGenAI } = require('@google/genai');

// We use the new @google/genai SDK
let ai;
try {
  // Use API key from environment for simpler auth that works across environments
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } else {
    // Attempt ADC if no key provided
    ai = new GoogleGenAI({});
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI:", error);
}

const model = 'gemini-1.5-flash';

/**
 * Send a message to Gemini and get a response.
 * @param {string} prompt - The user's query.
 * @returns {Promise<string>} The AI's response.
 */
async function getElectionInfo(prompt) {
  if (!ai) {
    throw new Error('AI Service is not initialized properly. Check API keys.');
  }
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        maxOutputTokens: 1024,
        temperature: 0.2,
        topP: 0.8,
        systemInstruction: "You are an expert on the Indian Election Process. You provide clear, concise, and easy-to-understand explanations about how elections work in India, voter registration, polling steps, and timelines. Always be neutral, accurate, and helpful. Use simple language and format responses with bullet points if necessary. Do not discuss political opinions or endorse any party."
      }
    });
    
    return response.text;
  } catch (error) {
    console.error('Error generating content from Google Gen AI:', error);
    throw new Error('Failed to fetch response from AI service.');
  }
}

module.exports = {
  getElectionInfo
};
