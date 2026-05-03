'use strict';

/**
 * @fileoverview Main Express server for the Election Process Education app.
 * Configures security middleware, rate limiting, static file serving,
 * structured logging, and API routes.
 * @module server
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const { structuredLog } = require('./utils/logger');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 8080;

// Trust proxy for Cloud Run (fixes X-Forwarded-For rate-limit issue)
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({ origin: true, methods: ['GET', 'POST'], maxAge: 86400 }));
app.use(express.json({ limit: '10kb' }));

// Sanitize input — strip HTML tags from body strings
app.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/<[^>]*>/g, '');
      }
    }
  }
  next();
});

// Rate limiting — 60 requests per minute per IP on API routes
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment and try again.' },
});
app.use('/api', apiLimiter);

// Health check endpoint (useful for Cloud Run)
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve static files with caching
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true,
}));

// API Routes
app.use('/api', apiRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  structuredLog('error', 'Unhandled server error', { error: err.message });
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server (skip during tests)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    structuredLog('info', `Server running on port ${PORT}`);
  });
}

module.exports = app;
