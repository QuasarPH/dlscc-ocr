import { NextResponse } from 'next/server';

export async function GET() {
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  
  return NextResponse.json({ 
    status: 'ok',
    hasApiKey,
    message: hasApiKey ? 'API configured' : 'Gemini API key is missing'
  });
}