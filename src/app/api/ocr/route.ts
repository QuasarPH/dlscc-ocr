import { NextRequest, NextResponse } from 'next/server';
import { classifyDocument, extractDataFromDocument } from '@/services';
import { DocumentCategory } from '@/constants';

// Health check endpoint
export async function GET() {
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  
  return NextResponse.json({ 
    status: 'ok',
    hasApiKey,
    message: hasApiKey ? 'API configured' : 'Gemini API key is missing'
  });
}

// Main OCR processing endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, base64ImageData, mimeType, category } = body;

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

    switch (action) {
      case 'classify':
        const classificationResult = await classifyDocument(base64ImageData, mimeType);
        return NextResponse.json({ category: classificationResult });

      case 'extract':
        if (!category) {
          return NextResponse.json(
            { error: 'Missing required field: category for data extraction' },
            { status: 400 }
          );
        }
        const extractionResult = await extractDataFromDocument(base64ImageData, mimeType, category as DocumentCategory);
        return NextResponse.json({ extractedData: extractionResult });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "classify" or "extract"' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('OCR API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}