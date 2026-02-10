import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate();
  const [showGetStartedDropdown, setShowGetStartedDropdown] = useState(false);

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
            <div 
              style={{...styles.dropdown, paddingBottom: '8px'}}
              onMouseEnter={() => setShowGetStartedDropdown(true)}
              onMouseLeave={() => setShowGetStartedDropdown(false)}
            >
              <button style={styles.primary} onClick = { ()=> navigate('/signup')} >Get Started</button>
            </div>
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
  dropdown: {
    position: 'relative',
    display: 'inline-block'
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    background: 'rgba(15,15,20,0.98)',
    backdropFilter: 'blur(12px)',
    borderRadius: 12,
    padding: '8px 0',
    minWidth: 200,
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    zIndex: 100
  },
  dropdownItem: {
    width: '100%',
    padding: '12px 20px',
    background: 'transparent',
    color: '#FFFFFF',
    textAlign: 'left',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s',
    fontSize: 14,
    fontWeight: 500,
    whiteSpace: 'nowrap'
  },
  primary: {
    backgroundColor: '#FFFFFF',
    color: '#000',
    padding: '14px 22px',
    borderRadius: 30,
    fontWeight: 600,
    cursor: 'pointer'
  },
  secondary: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    border: '1px solid #2A2A2F',
    padding: '14px 22px',
    borderRadius: 30,
    cursor: 'pointer'
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