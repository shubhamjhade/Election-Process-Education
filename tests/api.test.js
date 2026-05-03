const request = require('supertest');
const app = require('../server');

// Mock AI service
jest.mock('../services/aiService', () => ({
  getElectionInfo: jest.fn().mockResolvedValue('Mock AI response')
}));

describe('API Routes', () => {
  it('should return 400 if prompt is missing', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Prompt is required and must be a valid string.');
  });

  it('should return 400 if prompt is too long', async () => {
    const longPrompt = 'a'.repeat(501);
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: longPrompt });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Prompt is too long. Maximum 500 characters allowed.');
  });

  it('should return 200 and AI response for valid prompt', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'How to vote?' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.response).toBe('Mock AI response');
  });

  it('should have security headers', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-dns-prefetch-control']).toBeDefined();
    expect(res.headers['x-frame-options']).toBeDefined();
  });
});
