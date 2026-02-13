export const metadata = { title: 'Terms of Service — NIX' };

export default function Terms() {
  return (
    <main style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#ccc', background: '#000', minHeight: '100vh', padding: '2rem', maxWidth: '700px', margin: '0 auto',
    }}>
      <a href="/" style={{ color: '#CCFF00', textDecoration: 'none', fontSize: '14px' }}>← Back to NIX</a>
      <h1 style={{ color: '#fff', marginTop: '24px' }}>Terms of Service</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>Last updated: February 12, 2026</p>

      <h2 style={{ color: '#fff' }}>Using NIX</h2>
      <p>NIX is a quit-vaping support tool, not medical advice. Consult a healthcare provider for medical guidance on nicotine cessation.</p>

      <h2 style={{ color: '#fff' }}>Community Guidelines</h2>
      <ul>
        <li>Be supportive and encouraging</li>
        <li>No harassment, hate speech, or bullying</li>
        <li>No promotion of vaping, smoking, or substance use</li>
        <li>No spam, advertising, or self-promotion</li>
        <li>No sharing of personal contact information</li>
      </ul>
      <p>Violations may result in shadow banning or removal without notice.</p>

      <h2 style={{ color: '#fff' }}>No Warranty</h2>
      <p>NIX is provided &quot;as is&quot; without warranty. We don&apos;t guarantee the app will help you quit vaping. Results depend on your commitment and may vary.</p>

      <h2 style={{ color: '#fff' }}>Limitation of Liability</h2>
      <p>We are not liable for any damages arising from use of NIX, including but not limited to health outcomes, data loss, or service interruptions.</p>

      <h2 style={{ color: '#fff' }}>Changes</h2>
      <p>We may update these terms at any time. Continued use of NIX constitutes acceptance of updated terms.</p>

      <h2 style={{ color: '#fff' }}>Contact</h2>
      <p>Questions? Email <a href="mailto:ferric@gmail.com" style={{ color: '#CCFF00' }}>ferric@gmail.com</a></p>
    </main>
  );
}
