export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui', color: '#fff', background: '#000', minHeight: '100vh' }}>
      <h1 style={{ color: '#CCFF00' }}>NIX API</h1>
      <p style={{ color: '#8E8E93' }}>Community chat backend for NIX: Quit Vaping &amp; Nicotine</p>
      <ul style={{ color: '#8E8E93', lineHeight: '2' }}>
        <li>POST /api/chat/messages — Send a message</li>
        <li>GET /api/chat/messages — Fetch messages</li>
        <li>POST /api/chat/react — React to a message</li>
        <li>POST /api/chat/moderate — Check message content (Gemini)</li>
      </ul>
    </main>
  );
}
