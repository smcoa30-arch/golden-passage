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
