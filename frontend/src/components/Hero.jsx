export default function Hero() {
  return (
    <section style={styles.hero}>
      <div style={styles.container}>
        {/* LEFT CONTENT */}
        <div style={styles.content}>
          <h1 style={styles.title}>
            One stop platform for <br />
            <span style={styles.highlight}>e-KYC verification</span>
          </h1>

          <p style={styles.subtitle}>
            Secure, privacy-preserving identity verification using cryptographic
            proofs.
          </p>

          <div style={styles.actions}>
            <button style={styles.primary}>Get Started</button>
            <button style={styles.secondary}>View Architecture →</button>
          </div>

          <ul style={styles.points}>
            <li>✓ Zero data exposure to banks</li>
            <li>✓ Cryptographic identity proof</li>
            <li>✓ Fast & reusable verification</li>
            <li>✓ Fraud-resistant system</li>
          </ul>
        </div>

        {/* RIGHT EMPTY SPACE (intentional) */}
        <div style={styles.spacer}></div>
      </div>
    </section>
  );
}

const styles = {
  hero: {
    marginLeft : '180px',
    minHeight: '100vh',
    paddingTop: 160,
    display: 'flex',
    justifyContent: 'center'
  },
  container: {
    width: '100%',
    maxWidth: 1200,
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: 40,
    padding: '0 24px'
  },
  content: {
    maxWidth: 520
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    lineHeight: 1.2
  },
  highlight: {
    color: '#FF7A00'
  },
  subtitle: {
    marginTop: 20,
    fontSize: 18,
    color: '#A1A1AA'
  },
  actions: {
    marginTop: 32,
    display: 'flex',
    gap: 16
  },
  primary: {
    backgroundColor: '#FFFFFF',
    color: '#000',
    padding: '14px 22px',
    borderRadius: 30,
    fontWeight: 600
  },
  secondary: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    border: '1px solid #2A2A2F',
    padding: '14px 22px',
    borderRadius: 30
  },
  points: {
    marginTop: 40,
    listStyle: 'none',
    color: '#A1A1AA',
    lineHeight: 2
  },
  spacer: {
    position: 'relative'
  }
};