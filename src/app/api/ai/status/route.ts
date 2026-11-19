import { NextResponse } from 'next/server';

export async function GET() {
  const geminiKey = process.env.GEMINI_API_KEY;

  const geminiConfigured = Boolean(
    geminiKey && geminiKey.trim() !== '' && geminiKey !== 'your_gemini_api_key_here'
  );

  return NextResponse.json({
    geminiConfigured,
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
    engine: 'Google Gemini 3.1 Flash Lite + Local SVG/CSS Dynamic Engine',
  });
}
