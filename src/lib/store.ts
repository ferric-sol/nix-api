import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || '';

function getSQL() {
  return neon(DATABASE_URL);
}

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

function rowToMessage(row: Record<string, unknown>): ChatMessage {
  return {
    id: row.id as string,
    username: row.username as string,
    text: row.text as string,
    timestamp: (row.created_at as Date).toISOString(),
    shadowBanned: row.shadow_banned as boolean,
    reactions: {
      heart: row.hearts as number,
      stayStrong: row.stay_strong as number,
    },
  };
}

export async function getMessages(requestingUser?: string): Promise<ChatMessage[]> {
  const sql = getSQL();
  let rows;
  if (requestingUser) {
    rows = await sql`
      SELECT * FROM messages 
      WHERE shadow_banned = false OR username = ${requestingUser}
      ORDER BY created_at ASC
      LIMIT 200
    `;
  } else {
    rows = await sql`
      SELECT * FROM messages 
      WHERE shadow_banned = false
      ORDER BY created_at ASC
      LIMIT 200
    `;
  }
  return rows.map(rowToMessage);
}

export async function addMessage(username: string, text: string, shadowBanned: boolean = false): Promise<ChatMessage> {
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO messages (username, text, shadow_banned)
    VALUES (${username}, ${text}, ${shadowBanned})
    RETURNING *
  `;
  return rowToMessage(rows[0]);
}

export async function reactToMessage(messageId: string, reactionType: 'heart' | 'stayStrong'): Promise<ChatMessage | null> {
  const sql = getSQL();
  const column = reactionType === 'heart' ? 'hearts' : 'stay_strong';
  // Use raw SQL for dynamic column update
  const rows = await sql`
    UPDATE messages 
    SET ${reactionType === 'heart' ? sql`hearts = hearts + 1` : sql`stay_strong = stay_strong + 1`}
    WHERE id = ${messageId}::uuid
    RETURNING *
  `;
  if (rows.length === 0) return null;
  return rowToMessage(rows[0]);
}
