'use strict';

jest.mock('@google/genai', () => {
  const mockGenerateContent = jest.fn().mockResolvedValue({
    text: 'Mocked Gemini response about Indian elections',
  });
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: { generateContent: mockGenerateContent },
    })),
  };
});

const { getElectionInfo } = require('../services/aiService');

describe('AI Service', () => {
  it('returns text response from Gemini', async () => {
    const response = await getElectionInfo('How to register?');
    expect(response).toBe('Mocked Gemini response about Indian elections');
  });

  it('accepts string prompts', async () => {
    const response = await getElectionInfo('What is EVM?');
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  });
});
