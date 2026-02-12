import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  shadowBanned: boolean;
  reactions: {
    heart: number;
    stayStrong: number;
  };
}

// In-memory store for MVP — swap for Vercel Postgres / Supabase later
const messages: ChatMessage[] = [
  {
    id: uuidv4(),
    username: 'BraveSoul_42',
    text: "Day 3 and feeling the itch, but I'm holding on!",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    shadowBanned: false,
    reactions: { heart: 5, stayStrong: 3 },
  },
  {
    id: uuidv4(),
    username: 'Fighter_12',
    text: "You got this! The first week is the hardest.",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    shadowBanned: false,
    reactions: { heart: 2, stayStrong: 8 },
  },
];

export function getMessages(requestingUser?: string): ChatMessage[] {
  return messages.filter(m => !m.shadowBanned || m.username === requestingUser);
}

export function addMessage(username: string, text: string, shadowBanned: boolean = false): ChatMessage {
  const msg: ChatMessage = {
    id: uuidv4(),
    username,
    text,
    timestamp: new Date().toISOString(),
    shadowBanned,
    reactions: { heart: 0, stayStrong: 0 },
  };
  messages.push(msg);
  return msg;
}

export function reactToMessage(messageId: string, reactionType: 'heart' | 'stayStrong'): ChatMessage | null {
  const msg = messages.find(m => m.id === messageId);
  if (!msg) return null;
  msg.reactions[reactionType]++;
  return msg;
}
