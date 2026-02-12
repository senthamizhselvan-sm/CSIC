import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Aadhar from '../assets/Aadhar.jpg'
import Pan from '../assets/Pan.jpg'
import VoterID from '../assets/VoterId.jpg'
import SchoolID from '../assets/school.jpg'

import '../App.css'
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
              <button style={styles.primary} onClick={() => navigate('/signup')}>Get Started</button>
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

        {/* RIGHT SECTION - STRIVER STYLE */}
        <div style={styles.rightSection}>
          
          {/* Main Card - e-KYC Verification Types */}
          <div style={{...styles.mainCard, animationDelay: '0s'}}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>🔐</span>
              <h3 style={styles.cardTitle}>SUPPORTED ID TYPES</h3>
            </div>
            <div style={styles.cardList}>
              <div style={styles.listItem}>
                <span style={styles.checkmark}>✓</span>
                <span>Aadhar Card Verification</span>
              </div>
              <div style={styles.listItem}>
                <span style={styles.checkmark}>✓</span>
                <span>PAN Card Verification</span>
              </div>
              <div style={styles.listItem}>
                <span style={styles.checkmark}>✓</span>
                <span>Voter ID Verification</span>
              </div>
              <div style={styles.listItem}>
                <span style={styles.checkmark}>✓</span>
                <span>Educational ID Verification</span>
              </div>
            </div>
          </div>

          {/* Floating ID Card 1 - Aadhar */}
          <div style={{...styles.floatingIdCard, top: '80px', right: '40px', animationDelay: '0.3s'}}>
            <img src={Aadhar} alt="aadhar" style={styles.idImage} />
            <div style={styles.idLabel}>Aadhar Card</div>
          </div>

          {/* Floating ID Card 2 - PAN */}
          <div style={{...styles.floatingIdCard, bottom: '200px', left: '20px', animationDelay: '0.6s'}}>
            <img src={Pan} alt="pan" style={styles.idImage} />
            <div style={styles.idLabel}>PAN Card</div>
          </div>

          {/* Floating ID Card 3 - Voter ID */}
          <div style={{...styles.floatingIdCard, bottom: '80px', right: '60px', animationDelay: '0.9s'}}>
            <img src={VoterID} alt="voter" style={styles.idImage} />
            <div style={styles.idLabel}>Voter ID</div>
          </div>

          {/* Floating ID Card 4 - School ID */}
          <div style={{...styles.floatingIdCard, top: '350px', left: '0px', animationDelay: '1.2s'}}>
            <img src={SchoolID} alt="school" style={styles.idImage} />
            <div style={styles.idLabel}>School ID</div>
          </div>

        </div>
      </div>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes floatGentle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes fadeInFloat {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

const styles = {
  hero: {
    marginLeft: '180px',
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
    lineHeight: 1.2,
    color: '#FFFFFF'
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
  primary: {
    backgroundColor: '#FFFFFF',
    color: '#000',
    padding: '14px 22px',
    borderRadius: 30,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none'
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
    lineHeight: 2,
    paddingLeft: 0
  },

  // RIGHT SECTION
  rightSection: {
    position: 'relative',
    minHeight: '600px',
    paddingTop: '40px'
  },

  // Main Card (like A2Z DSA SHEET)
  mainCard: {
    position: 'absolute',
    top: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '320px',
    background: 'rgba(25, 25, 35, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    animation: 'fadeInFloat 0.8s ease-out, floatGentle 6s ease-in-out infinite',
    zIndex: 2
  },

  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },

  cardIcon: {
    fontSize: '28px'
  },

  cardTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#FFFFFF',
    letterSpacing: '0.5px',
    margin: 0
  },

  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },

  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#A1A1AA',
    fontSize: '14px'
  },

  checkmark: {
    color: '#FF7A00',
    fontSize: '16px',
    fontWeight: 'bold'
  },

  // Floating ID Cards (like user profile cards)
  floatingIdCard: {
    position: 'absolute',
    width: '140px',
    background: 'rgba(25, 25, 35, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
    animation: 'fadeInFloat 0.8s ease-out, floatGentle 7s ease-in-out infinite',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    zIndex: 1
  },

  idImage: {
    width: '100%',
    height: '100px',
    objectFit: 'contain',
    borderRadius: '12px',
    marginBottom: '8px'
  },

  idLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#FFFFFF',
    textAlign: 'center'
  }
};