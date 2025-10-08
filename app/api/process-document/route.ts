import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import mammoth from 'mammoth';
import { createClient } from '@/lib/supabase/server';
import { put } from '@vercel/blob';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const { pdf } = await import('pdf-parse');
  const data = await pdf(buffer);
  return typeof data === 'string' ? data : data.text || '';
}

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text based on file type
    let extractedText = '';
    const fileType = file.type;

    if (fileType === 'application/pdf') {
      extractedText = await extractTextFromPDF(buffer);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword'
    ) {
      extractedText = await extractTextFromDocx(buffer);
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    // Upload file to Vercel Blob Storage
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    let blobUrl = '';

    try {
      const blob = await put(fileName, buffer, {
        access: 'public',
        contentType: fileType,
      });
      blobUrl = blob.url;
    } catch (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({
        error: 'Failed to upload file to storage',
        details: uploadError instanceof Error ? uploadError.message : undefined
      }, { status: 500 });
    }

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

${extractedText.slice(0, 500000)}`,
        },
      ],
    });

    const summary =
      message.content[0].type === 'text' ? message.content[0].text : 'Unable to generate summary';

    // Save document metadata to database
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_size: file.size,
        file_type: fileType,
        storage_path: blobUrl, // Store the Vercel Blob URL
        extracted_text: extractedText,
        summary,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Failed to save document' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      summary,
      documentId: document.id,
      fileName: file.name,
    });
  } catch (error) {
    console.error('Error processing document:', error);
    return NextResponse.json({ error: 'Failed to process document' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '200mb',
    },
  },
};
