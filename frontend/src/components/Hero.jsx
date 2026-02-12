import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate();
  const [showGetStartedDropdown, setShowGetStartedDropdown] = useState(false);

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* LEFT CONTENT */}
        <div className="hero-content">
          <h1 className="hero-title">
            One stop platform for <br />
            <span className="hero-highlight">e-KYC verification</span>
          </h1>

          <p className="hero-subtitle">
            Secure, privacy-preserving identity verification using cryptographic
            proofs.
          </p>

          <div className="hero-actions">
            <div 
              className="hero-dropdown"
              onMouseEnter={() => setShowGetStartedDropdown(true)}
              onMouseLeave={() => setShowGetStartedDropdown(false)}
            >
              <button className="hero-btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
            </div>
            <button className="hero-btn-secondary">View Architecture →</button>
          </div>

          <ul className="hero-points">
            <li>✓ Zero data exposure to banks</li>
            <li>✓ Cryptographic identity proof</li>
            <li>✓ Fast & reusable verification</li>
            <li>✓ Fraud-resistant system</li>
          </ul>
        </div>

        {/* RIGHT EMPTY SPACE (intentional) */}
        <div className="hero-spacer"></div>
      </div>
    </section>
  );
}