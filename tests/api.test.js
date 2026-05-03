'use strict';
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.GEMINI_API_KEY = 'test-key';

jest.mock('../services/aiService', () => ({
  getElectionInfo: jest.fn().mockResolvedValue('Mock AI response about elections'),
}));

const app = require('../server');

describe('API Routes', () => {
  describe('POST /api/chat', () => {
    it('returns 400 when prompt is missing', async () => {
      const res = await request(app).post('/api/chat').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/Prompt is required/);
    });

    it('returns 400 when prompt is empty string', async () => {
      const res = await request(app).post('/api/chat').send({ prompt: '   ' });
      expect(res.statusCode).toBe(400);
    });

    it('returns 400 when prompt exceeds 500 characters', async () => {
      const res = await request(app).post('/api/chat').send({ prompt: 'x'.repeat(501) });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/too long/i);
    });

    it('returns 400 when prompt is not a string', async () => {
      const res = await request(app).post('/api/chat').send({ prompt: 123 });
      expect(res.statusCode).toBe(400);
    });

    it('returns 200 with AI response for valid prompt', async () => {
      const res = await request(app).post('/api/chat').send({ prompt: 'How to vote?' });
      expect(res.statusCode).toBe(200);
      expect(res.body.response).toBe('Mock AI response about elections');
    });

    it('strips HTML tags from prompt input', async () => {
      const res = await request(app).post('/api/chat').send({ prompt: '<script>alert(1)</script>How?' });
      expect(res.statusCode).toBe(200);
    });
  });

  describe('Security Headers', () => {
    it('sets X-DNS-Prefetch-Control header', async () => {
      const res = await request(app).get('/');
      expect(res.headers['x-dns-prefetch-control']).toBeDefined();
    });

    it('sets X-Frame-Options header', async () => {
      const res = await request(app).get('/');
      expect(res.headers['x-frame-options']).toBeDefined();
    });

    it('sets X-Content-Type-Options header', async () => {
      const res = await request(app).get('/');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('sets Content-Security-Policy header', async () => {
      const res = await request(app).get('/');
      expect(res.headers['content-security-policy']).toBeDefined();
    });
  });

  describe('Health Check', () => {
    it('GET /health returns 200 with status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
    });

    it('GET /api/health returns 200', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });
});
