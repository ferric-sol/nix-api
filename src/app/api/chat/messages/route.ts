import { NextRequest, NextResponse } from 'next/server';
import { getMessages, addMessage } from '@/lib/store';
import { moderateMessage } from '@/lib/moderate';
import { rateLimit, RATE_LIMITS } from '@/lib/ratelimit';

function getIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

export async function GET(request: NextRequest) {
  const ip = getIP(request);

  // Rate limit
  const globalCheck = rateLimit('global', RATE_LIMITS.global);
  const ipCheck = rateLimit(`get:${ip}`, RATE_LIMITS.getMessages);
  if (!globalCheck.allowed || !ipCheck.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const username = request.nextUrl.searchParams.get('username') || undefined;
  const messages = await getMessages(username);
  
  // Cache for 3 seconds — reduces DB hits from polling
  return NextResponse.json({ messages }, {
    headers: {
      'Cache-Control': 'public, s-maxage=3, stale-while-revalidate=5',
    }
  });
}

export async function POST(request: NextRequest) {
  const ip = getIP(request);

  // Rate limit
  const globalCheck = rateLimit('global', RATE_LIMITS.global);
  const ipCheck = rateLimit(`post:${ip}`, RATE_LIMITS.postMessage);
  if (!globalCheck.allowed || !ipCheck.allowed) {
    return NextResponse.json({ error: 'Slow down! Try again in a moment.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { username, text } = body;

    if (!username || !text) {
      return NextResponse.json({ error: 'username and text required' }, { status: 400 });
    }

    // Input validation
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }
    if (trimmed.length > 500) {
      return NextResponse.json({ error: 'Message too long (max 500 chars)' }, { status: 400 });
    }
    if (username.length > 50) {
      return NextResponse.json({ error: 'Username too long' }, { status: 400 });
    }

    // Skip moderation for streak shares and crave messages (system-generated)
    let shadowBanned = false;
    const isSystemMessage = trimmed.startsWith('{') || trimmed.includes('is fighting a craving') || trimmed.includes('survived the craving');
    
    if (!isSystemMessage) {
      const modResult = await moderateMessage(trimmed);
      shadowBanned = !modResult.safe;
    }

    const message = await addMessage(username, trimmed, shadowBanned);
    
    return NextResponse.json({ 
      message,
      moderated: shadowBanned,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
