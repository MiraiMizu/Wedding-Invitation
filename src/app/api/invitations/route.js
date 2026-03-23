import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

export async function POST(request) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Read existing data
    let existingData = {};
    try {
      const fileData = await fs.readFile(dataFilePath, 'utf-8');
      existingData = JSON.parse(fileData);
    } catch (e) {
      // File might not exist or be empty
      existingData = {};
    }

    // Check if slug already exists to prevent overwrite?
    // In a real app we would warn, but here we just append a random number if needed or overwrite.
    // For simplicity, let's just save/overwrite.
    existingData[slug] = body;

    await fs.writeFile(dataFilePath, JSON.stringify(existingData, null, 2));

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error saving invitation:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const fileData = await fs.readFile(dataFilePath, 'utf-8');
    const existingData = JSON.parse(fileData);

    const data = existingData[slug];

    if (data) {
      return NextResponse.json({ data });
    } else {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}
