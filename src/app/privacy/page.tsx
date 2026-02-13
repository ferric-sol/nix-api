export const metadata = { title: 'Privacy Policy — NIX' };

export default function Privacy() {
  return (
    <main style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#ccc', background: '#000', minHeight: '100vh', padding: '2rem', maxWidth: '700px', margin: '0 auto',
    }}>
      <a href="/" style={{ color: '#CCFF00', textDecoration: 'none', fontSize: '14px' }}>← Back to NIX</a>
      <h1 style={{ color: '#fff', marginTop: '24px' }}>Privacy Policy</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>Last updated: February 12, 2026</p>

      <h2 style={{ color: '#fff' }}>What We Collect</h2>
      <p>NIX is designed with privacy first. Here&apos;s what we handle:</p>
      <ul>
        <li><strong>Streak data:</strong> Stored locally on your device only. We never see it.</li>
        <li><strong>Community messages:</strong> Your chosen username and message text are stored on our servers to power the community chat. No email, no phone number, no real name required.</li>
        <li><strong>No analytics:</strong> We don&apos;t track screens, taps, or usage patterns.</li>
        <li><strong>No ads:</strong> We don&apos;t serve ads or share data with advertisers.</li>
      </ul>

      <h2 style={{ color: '#fff' }}>Community Chat</h2>
      <p>Messages posted in the community are visible to all users. We use automated moderation (Google Gemini) to filter harmful content. Messages flagged as harmful are shadow-banned (hidden from others but visible to the sender). We retain messages for 7 days, then they are automatically deleted.</p>

      <h2 style={{ color: '#fff' }}>Data Storage</h2>
      <p>Community messages are stored on servers in the United States (Vercel + Neon). Streak and personal progress data never leaves your device.</p>

      <h2 style={{ color: '#fff' }}>Your Rights</h2>
      <p>You can stop using NIX at any time. Community messages expire after 7 days. To request deletion of your messages sooner, contact us at nix@ferric.net.</p>

      <h2 style={{ color: '#fff' }}>Contact</h2>
      <p>Questions? Email <a href="mailto:nix@ferric.net" style={{ color: '#CCFF00' }}>nix@ferric.net</a></p>
    </main>
  );
}
