import { NextRequest, NextResponse } from 'next/server';
import { getMessages, addMessage } from '@/lib/store';
import { moderateMessage } from '@/lib/moderate';

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username') || undefined;
  const messages = getMessages(username);
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, text } = body;

    if (!username || !text) {
      return NextResponse.json({ error: 'username and text required' }, { status: 400 });
    }

    if (text.length > 500) {
      return NextResponse.json({ error: 'Message too long (max 500 chars)' }, { status: 400 });
    }

    // Run moderation
    const modResult = await moderateMessage(text);
    
    // Add message — shadow-banned if moderation flagged it
    const message = addMessage(username, text, !modResult.safe);
    
    return NextResponse.json({ 
      message,
      moderated: !modResult.safe,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
