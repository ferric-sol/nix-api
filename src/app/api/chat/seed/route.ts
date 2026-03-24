import { NextRequest, NextResponse } from 'next/server';
import { addMessage, getMessages } from '@/lib/store';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SEED_SECRET = process.env.SEED_SECRET || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const PERSONAS = [
  { username: 'CalmWarrior22', style: 'casual, uses slang like "fr", "ngl", "tbh"' },
  { username: 'BraveSoul88', style: 'earnest, hopeful, supportive' },
  { username: 'StrongMind14', style: 'sarcastic but genuinely trying' },
  { username: 'FearlessHeart7', style: 'raw, honest, vulnerable' },
  { username: 'MightySpirit41', style: 'motivational, optimistic' },
  { username: 'ResilientFighter63', style: 'anxious but determined' },
  { username: 'SteadyBreath19', style: 'calm, wise, been quitting for a while' },
  { username: 'ClearLungs55', style: 'celebratory, excited about progress' },
];

// Fallback messages for when AI fails or no context
const FALLBACK_MESSAGES = [
  "woke up and the first thing i wanted was my vape. day 3 tho 💪",
  "morning cravings hit different. made coffee instead. small wins",
  "had a brutal day at work. wanted to hit the vape so bad but used the crave button instead",
  "day 5 and i can actually taste food again?? is that a thing?",
  "1 week!! longest i've gone in 2 years. feels unreal",
  "can't sleep. this is when i'd normally chain vape. just scrolling here instead",
  "to everyone on day 1 — it gets easier around day 4. promise",
  "stay strong tonight everyone. tomorrow you wake up one day stronger 💚",
];

export async function POST(request: NextRequest) {
  // Auth check
  const auth = request.headers.get('authorization');
  if (!SEED_SECRET || auth !== `Bearer ${SEED_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { username, text, useAI = true } = body;

    // If custom message provided, use it directly
    if (username && text) {
      const result = await addMessage(username, text, false);
      return NextResponse.json({ message: result });
    }

    // Try AI-generated message
    if (useAI && GEMINI_API_KEY) {
      try {
        const aiMessage = await generateContextualMessage();
        if (aiMessage) {
          const result = await addMessage(aiMessage.username, aiMessage.text, false);
          return NextResponse.json({ message: result, generated: true });
        }
      } catch (error) {
        console.error('AI generation failed:', error);
        // Fall through to fallback
      }
    }

    // Fallback: random message
    const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
    const message = FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
    const result = await addMessage(persona.username, message, false);
    return NextResponse.json({ message: result, generated: false });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

async function generateContextualMessage(): Promise<{ username: string; text: string } | null> {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  // Get recent messages for context
  const recentMessages = await getMessages();
  const contextMessages = recentMessages.slice(-10); // Last 10 messages

  const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];

  // Build context string
  const contextStr = contextMessages.length > 0
    ? contextMessages.map(m => `${m.username}: "${m.text}"`).join('\n')
    : '(no recent messages - this is a fresh chat)';

  const prompt = `You are ${persona.username}, a member of a quit-vaping support community. Your style: ${persona.style}

Recent chat messages:
${contextStr}

Write ONE short message (1-2 sentences max) that naturally continues the conversation. Rules:
- Be supportive and authentic
- Match the community vibe (people struggling to quit vaping)
- Use casual language, not formal
- Can share your own struggle, encourage others, or relate to what someone said
- If someone shared a win, celebrate them
- If someone is struggling, empathize
- Keep it real - not toxic positivity
- No hashtags, no emojis at the start

Respond with ONLY the message text, nothing else.`;

  const result = await model.generateContent(prompt);
  let response = result.response.text().trim();
  
  // Clean up response
  response = response.replace(/^["']|["']$/g, ''); // Remove quotes
  response = response.replace(/\n/g, ' '); // Single line
  
  if (response.length > 200) {
    response = response.slice(0, 197) + '...';
  }

  return { username: persona.username, text: response };
}
