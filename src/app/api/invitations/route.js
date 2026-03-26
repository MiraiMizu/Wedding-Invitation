import { NextResponse } from 'next/server';

// Helper to get the KV namespace from the Cloudflare environment
function getKV() {
  // In Cloudflare Workers, process.env gives us access to KV namespaces 
  // The INVITATIONS binding is available via globalThis
  // @ts-ignore
  return typeof globalThis !== 'undefined' && globalThis.process?.env?.INVITATIONS
    // @ts-ignore
    ? globalThis.process.env.INVITATIONS
    : null;
}

// Fallback in-memory store for local development
const memoryStore = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const value = JSON.stringify(body);

    // Try Cloudflare KV first
    const kv = getKV();
    if (kv) {
      await kv.put(slug, value);
    } else {
      // Fallback: In-memory store (local dev)
      memoryStore.set(slug, body);
    }

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
    const kv = getKV();
    let data;
    
    if (kv) {
      const raw = await kv.get(slug);
      data = raw ? JSON.parse(raw) : null;
    } else {
      data = memoryStore.get(slug) || null;
    }

    if (data) {
      return NextResponse.json({ data });
    } else {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}
