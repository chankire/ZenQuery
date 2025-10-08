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

    // Fetch file from Vercel Blob (storage_path now contains the blob URL)
    const blobUrl = document.storage_path;

    try {
      const response = await fetch(blobUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch file from blob storage');
      }

      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Return the file
      return new NextResponse(uint8Array, {
        headers: {
          'Content-Type': document.file_type || 'application/pdf',
          'Content-Disposition': `inline; filename="${document.file_name}"`,
        },
      });
    } catch (fetchError) {
      console.error('Blob fetch error:', fetchError);
      return NextResponse.json({ error: 'Failed to retrieve file from storage' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error retrieving file:', error);
    return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 });
  }
}
