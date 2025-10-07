import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json({ error: 'Missing documentId parameter' }, { status: 400 });
    }

    // Get document metadata (RLS ensures user can only access their own documents)
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('storage_path, file_type, file_name')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Download file from Supabase Storage
    const { data: fileData, error: storageError } = await supabase.storage
      .from('documents')
      .download(document.storage_path);

    if (storageError || !fileData) {
      console.error('Storage error:', storageError);
      return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 });
    }

    // Convert Blob to ArrayBuffer then to Uint8Array
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Return the PDF file
    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': document.file_type || 'application/pdf',
        'Content-Disposition': `inline; filename="${document.file_name}"`,
      },
    });
  } catch (error) {
    console.error('Error retrieving file:', error);
    return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 });
  }
}
