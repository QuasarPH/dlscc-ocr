import { NextRequest, NextResponse } from 'next/server';
import { classifyDocument } from '@/services';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { base64ImageData, mimeType } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    if (!base64ImageData || !mimeType) {
      return NextResponse.json(
        { error: 'Missing required fields: base64ImageData and mimeType' },
        { status: 400 }
      );
    }

    const category = await classifyDocument(base64ImageData, mimeType);
    
    return NextResponse.json({ category });
  } catch (error) {
    console.error('Classification API error:', error);
    return NextResponse.json(
      { error: 'Failed to classify document' },
      { status: 500 }
    );
  }
}