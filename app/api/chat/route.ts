import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

    const { question, documentId } = await request.json();

    if (!question || !documentId) {
      return NextResponse.json({ error: 'Missing question or documentId' }, { status: 400 });
    }

    // Retrieve the document (with RLS ensuring user can only access their own documents)
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('extracted_text, file_name')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Query Claude with the document context
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `You are a precise document analysis assistant. Your task is to answer questions about the following document with EXACT citations and references.

CRITICAL RULES:
1. ONLY answer based on information explicitly stated in the document
2. For EVERY claim you make, provide the exact section, page, or paragraph where it appears
3. If information is not in the document, clearly state "This information is not found in the document"
4. Quote relevant passages when possible
5. Provide specific location references (e.g., "Section 3.2", "Page 15", "Chapter 4")
6. If you're uncertain, say so - never hallucinate or guess

Document content:
${document.extracted_text.slice(0, 500000)}

---

User question: ${question}

Please provide:
1. A direct answer to the question
2. Exact citations showing where in the document this information appears
3. Relevant quotes if applicable`,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : 'Unable to generate response';

    // Extract structured citations with page numbers and snippets
    const citations: Array<{ text: string; page?: number; snippet?: string }> = [];

    // Extract page references
    const pageRegex = /Page\s+(\d+)/gi;
    let match;
    while ((match = pageRegex.exec(responseText)) !== null) {
      const pageNum = parseInt(match[1]);
      const contextStart = Math.max(0, match.index - 100);
      const contextEnd = Math.min(responseText.length, match.index + 150);
      const snippet = responseText.slice(contextStart, contextEnd).trim();

      citations.push({
        text: `Page ${pageNum}`,
        page: pageNum,
        snippet: snippet.length > 100 ? snippet.slice(0, 100) + '...' : snippet,
      });
    }

    // Extract section/chapter references (without page numbers)
    const sectionRegex = /(Section|Chapter)\s+([\d\w\.\-]+)/gi;
    while ((match = sectionRegex.exec(responseText)) !== null) {
      const citationText = match[0];
      if (!citations.find((c) => c.text === citationText)) {
        citations.push({
          text: citationText,
        });
      }
    }

    // Save the conversation
    const { data: conversation } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        document_id: documentId,
      })
      .select()
      .single();

    if (conversation) {
      // Save messages
      await supabase.from('messages').insert([
        {
          conversation_id: conversation.id,
          role: 'user',
          content: question,
        },
        {
          conversation_id: conversation.id,
          role: 'assistant',
          content: responseText,
          citations: citations.length > 0 ? citations : null,
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      answer: responseText,
      citations: citations.length > 0 ? citations.slice(0, 5) : undefined,
    });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 });
  }
}
