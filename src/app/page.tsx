export const metadata = {
  title: 'NIX — Quit Vaping & Nicotine',
  description: 'The only quit-vaping app that helps you survive the next 10 minutes, not just the next 10 days.',
};

export default function Home() {
  return (
    <main style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#fff',
      background: '#000',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center' as const,
    }}>
      {/* Hero */}
      <div style={{
        fontSize: '72px',
        fontWeight: 900,
        letterSpacing: '-3px',
        color: '#CCFF00',
        lineHeight: 1,
        marginBottom: '8px',
      }}>
        NIX
      </div>
      <p style={{
        color: '#8E8E93',
        fontSize: '18px',
        marginBottom: '32px',
        maxWidth: '400px',
      }}>
        Quit Vaping. Ride the Crave.
      </p>

      {/* Feature pills */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap' as const,
        justifyContent: 'center',
        marginBottom: '40px',
      }}>
        {['🔥 Crave Button', '📊 Streak Tracking', '💬 Community', '🆓 100% Free'].map((f) => (
          <span key={f} style={{
            background: 'rgba(204,255,0,0.1)',
            border: '1px solid rgba(204,255,0,0.3)',
            borderRadius: '100px',
            padding: '8px 20px',
            fontSize: '14px',
            color: '#CCFF00',
          }}>
            {f}
          </span>
        ))}
      </div>

      {/* Pitch */}
      <p style={{
        color: '#ccc',
        fontSize: '16px',
        lineHeight: '1.6',
        maxWidth: '500px',
        marginBottom: '40px',
      }}>
        When a craving hits, you have 10 minutes to beat it. NIX gives you a hold-to-survive 
        Crave Button, streak tracking that actually motivates, and an anonymous community of 
        people going through the same thing. No ads. No data collection.
      </p>

      {/* Download buttons */}
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap' as const,
        justifyContent: 'center',
        marginBottom: '48px',
      }}>
        <a
          href="#"
          style={{
            background: '#fff',
            color: '#000',
            padding: '14px 28px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🍎 Download for iOS
        </a>
        <a
          href="#"
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            padding: '14px 28px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '16px',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🤖 Download for Android
        </a>
      </div>

      {/* Footer */}
      <div style={{ color: '#555', fontSize: '13px' }}>
        <p>No account required · Works offline · Your data stays on your device</p>
        <p style={{ marginTop: '16px' }}>
          <a href="/privacy" style={{ color: '#666', textDecoration: 'underline', marginRight: '16px' }}>Privacy Policy</a>
          <a href="/terms" style={{ color: '#666', textDecoration: 'underline' }}>Terms of Service</a>
        </p>
      </div>
    </main>
  );
}
