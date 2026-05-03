const { getElectionInfo } = require('../services/aiService');

jest.mock('@google-cloud/vertexai', () => {
  const mVertexAI = {
    preview: {
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: {
            candidates: [
              {
                content: {
                  parts: [{ text: 'Mocked Gemini Response' }]
                }
              }
            ]
          }
        })
      })
    }
  };
  return { VertexAI: jest.fn(() => mVertexAI) };
});

describe('AI Service', () => {
  it('should return text response from Vertex AI', async () => {
    const response = await getElectionInfo('test prompt');
    expect(response).toBe('Mocked Gemini Response');
  });
});
