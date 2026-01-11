// Vercel Serverless Function Handler
// Uses the pre-bundled code from .vercel-build/index.js
const handler = require('../.vercel-build/index.js');

module.exports = handler.default || handler;
