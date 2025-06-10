import { NextRequest, NextResponse } from 'next/server';
import { extractDataFromDocument } from '@/services';
import { DocumentCategory } from '@/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { base64ImageData, mimeType, category } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    if (!base64ImageData || !mimeType || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: base64ImageData, mimeType, and category' },
        { status: 400 }
      );
    }

    const extractedData = await extractDataFromDocument(
      base64ImageData, 
      mimeType, 
      category as DocumentCategory
    );
    
    return NextResponse.json({ extractedData });
  } catch (error) {
    console.error('Data extraction API error:', error);
    return NextResponse.json(
      { error: 'Failed to extract data from document' },
      { status: 500 }
    );
  }
}