import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import mammoth from 'mammoth';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function extractTextFromPDF(buffer: Buffer): Promise<{ text: string; pageMap: Map<number, string> }> {
  // Use dynamic import for pdf-parse due to module compatibility
  const { pdf } = await import('pdf-parse');
  const data = await pdf(buffer);

  // Create a page map for better citation tracking
  const pageMap = new Map<number, string>();

  // pdf-parse returns the text directly
  const text = typeof data === 'string' ? data : data.text || '';

  // Note: pdf-parse doesn't provide page-level extraction by default
  // For production, consider using pdf.js directly for better page tracking
  pageMap.set(1, text);

  return { text, pageMap };
}

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text based on file type
    let extractedText = '';
    const fileType = file.type;

    if (fileType === 'application/pdf') {
      const result = await extractTextFromPDF(buffer);
      extractedText = result.text;
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword'
    ) {
      extractedText = await extractTextFromDocx(buffer);
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    // Store the extracted text and file buffer
    global.documentCache = global.documentCache || {};
    global.documentCache[file.name] = extractedText;
    global.fileCache = global.fileCache || {};
    global.fileCache[file.name] = buffer;

    // Generate executive summary using Claude
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `You are analyzing a document. Please provide a comprehensive executive summary of the following document. Focus on:
1. Main purpose and topic
2. Key findings or information
3. Important sections or chapters
4. Critical details or specifications

Be concise but thorough. Format with clear paragraphs.

Document content:

${extractedText.slice(0, 100000)}`,
        },
      ],
    });

    const summary = message.content[0].type === 'text'
      ? message.content[0].text
      : 'Unable to generate summary';

    return NextResponse.json({
      success: true,
      summary,
      fileName: file.name,
    });
  } catch (error) {
    console.error('Error processing document:', error);
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    );
  }
}

// Type declaration for global cache
declare global {
  var documentCache: { [key: string]: string };
  var fileCache: { [key: string]: Buffer };
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '200mb',
    },
  },
};
