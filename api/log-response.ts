import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const appsScriptUrl = process.env.APPS_SCRIPT_URL;

  if (!appsScriptUrl) {
    console.error('Missing APPS_SCRIPT_URL env var');
    return res.status(500).json({ error: 'Logging not configured' });
  }

  try {
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      redirect: 'follow',
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Apps Script error:', errText);
      return res.status(500).json({ error: 'Failed to log response' });
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Log error:', error.message);
    return res.status(500).json({ error: 'Internal error', message: error.message });
  }
}
