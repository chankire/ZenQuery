import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json(
        { error: 'Missing fileName parameter' },
        { status: 400 }
      );
    }

    // Retrieve the file buffer from cache
    const fileBuffer = global.fileCache?.[fileName];

    if (!fileBuffer) {
      return NextResponse.json(
        { error: 'File not found. Please re-upload the file.' },
        { status: 404 }
      );
    }

    // Return the PDF file
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Error retrieving file:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve file' },
      { status: 500 }
    );
  }
}
