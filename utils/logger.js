'use strict';
/**
 * @fileoverview Structured logging utility for Cloud Run.
 * @module utils/logger
 */
function structuredLog(severity, message, meta = {}) {
  const entry = { severity: severity.toUpperCase(), message, timestamp: new Date().toISOString(), ...meta };
  console.log(JSON.stringify(entry));
}
module.exports = { structuredLog };
