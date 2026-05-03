const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Vertex AI with the provided Cloud project ID and location
// us-central1 is generally a safe default region with broad model support.
const vertex_ai = new VertexAI({ project: 'invertible-star-495216-e3', location: 'us-central1' });
const model = 'gemini-1.5-flash-001'; // Try specific version for us-central1

const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 1024,
    temperature: 0.2,
    topP: 0.8,
  },
  systemInstruction: {
    parts: [
      {
        text: "You are an expert on the Indian Election Process. You provide clear, concise, and easy-to-understand explanations about how elections work in India, voter registration, polling steps, and timelines. Always be neutral, accurate, and helpful. Use simple language and format responses with bullet points if necessary. Do not discuss political opinions or endorse any party."
      }
    ]
  }
});

/**
 * Send a message to Gemini and get a response.
 * @param {string} prompt - The user's query.
 * @returns {Promise<string>} The AI's response.
 */
async function getElectionInfo(prompt) {
  try {
    const req = {
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ],
    };
    const response = await generativeModel.generateContent(req);
    const textResponse = response.response.candidates[0].content.parts[0].text;
    return textResponse;
  } catch (error) {
    console.error('Error generating content from Vertex AI:', error);
    throw new Error('Failed to fetch response from AI service.');
  }
}

module.exports = {
  getElectionInfo
};
