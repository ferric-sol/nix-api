import { NextRequest, NextResponse } from 'next/server';
import { reactToMessage } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, reactionType } = body;

    if (!messageId || !['heart', 'stayStrong'].includes(reactionType)) {
      return NextResponse.json(
        { error: 'messageId and reactionType (heart|stayStrong) required' }, 
        { status: 400 }
      );
    }

    const message = reactToMessage(messageId, reactionType);
    
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
