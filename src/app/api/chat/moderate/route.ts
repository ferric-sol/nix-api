import { NextRequest, NextResponse } from 'next/server';
import { moderateMessage } from '@/lib/moderate';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: 'text required' }, { status: 400 });
    }

    const result = await moderateMessage(text);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
