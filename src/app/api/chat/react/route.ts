import { NextRequest, NextResponse } from 'next/server';
import { reactToMessage } from '@/lib/store';
import { rateLimit, RATE_LIMITS } from '@/lib/ratelimit';

function getIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

export async function POST(request: NextRequest) {
  const ip = getIP(request);

  // Rate limit
  const globalCheck = rateLimit('global', RATE_LIMITS.global);
  const ipCheck = rateLimit(`react:${ip}`, RATE_LIMITS.react);
  if (!globalCheck.allowed || !ipCheck.allowed) {
    return NextResponse.json({ error: 'Too many reactions' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { messageId, reactionType } = body;

    if (!messageId || !['heart', 'stayStrong'].includes(reactionType)) {
      return NextResponse.json(
        { error: 'messageId and reactionType (heart|stayStrong) required' }, 
        { status: 400 }
      );
    }

    // Basic UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(messageId)) {
      return NextResponse.json({ error: 'Invalid message ID' }, { status: 400 });
    }

    const message = await reactToMessage(messageId, reactionType);
    
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
