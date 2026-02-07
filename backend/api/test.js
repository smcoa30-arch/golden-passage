export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'API Test',
    env: {
      hasGoogleKey: !!process.env.GOOGLE_AI_KEY,
      hasKimiKey: !!process.env.KIMI_API_KEY,
      hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
    },
    timestamp: new Date().toISOString()
  });
}

// pages/api/test.js
export default function handler(req, res) {
  res.json({
    GOOGLE_AI_KEY: process.env.GOOGLE_AI_KEY,
    KIMI_API_KEY: process.env.KIMI_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  });
}
