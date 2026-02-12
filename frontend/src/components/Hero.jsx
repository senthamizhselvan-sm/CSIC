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

        {/* RIGHT SECTION - BACKGROUND FLOATING CARDS */}
        <div className="hero-visual">
          <div className="floating-cards-container">
            
            {/* Main Card - e-KYC Verification Types */}
            <div className="main-card">
              <div className="card-header">
                <span className="card-icon">🔐</span>
                <h3 className="card-title">SUPPORTED ID TYPES</h3>
              </div>
              <div className="card-list">
                <div className="list-item">
                  <span className="checkmark">✓</span>
                  <span>Aadhar Card Verification</span>
                </div>
                <div className="list-item">
                  <span className="checkmark">✓</span>
                  <span>PAN Card Verification</span>
                </div>
                <div className="list-item">
                  <span className="checkmark">✓</span>
                  <span>Voter ID Verification</span>
                </div>
                <div className="list-item">
                  <span className="checkmark">✓</span>
                  <span>Educational ID Verification</span>
                </div>
              </div>
            </div>

            {/* Floating ID Card 1 - Aadhar */}
            <div className="floating-id-card card-1">
              <img src={Aadhar} alt="aadhar" className="id-image" />
              <div className="id-label">Aadhar Card</div>
            </div>

            {/* Floating ID Card 2 - PAN */}
            <div className="floating-id-card card-2">
              <img src={Pan} alt="pan" className="id-image" />
              <div className="id-label">PAN Card</div>
            </div>

            {/* Floating ID Card 3 - Voter ID */}
            <div className="floating-id-card card-3">
              <img src={VoterID} alt="voter" className="id-image" />
              <div className="id-label">Voter ID</div>
            </div>

            {/* Floating ID Card 4 - School ID */}
            <div className="floating-id-card card-4">
              <img src={SchoolID} alt="school" className="id-image" />
              <div className="id-label">School ID</div>
            </div>

            {/* DUPLICATE CARDS FOR SEAMLESS LOOP */}
            
            {/* Main Card - Duplicate */}
            <div className="main-card">
              <div className="card-header">
                <span className="card-icon">🔐</span>
                <h3 className="card-title">SUPPORTED ID TYPES</h3>
              </div>
              <div className="card-list">
                <div className="list-item">
                  <span className="checkmark">✓</span>
                  <span>Aadhar Card Verification</span>
                </div>
                <div className="list-item">
                  <span className="checkmark">✓</span>
                  <span>PAN Card Verification</span>
                </div>
                <div className="list-item">
                  <span className="checkmark">✓</span>
                  <span>Voter ID Verification</span>
                </div>
                <div className="list-item">
                  <span className="checkmark">✓</span>
                  <span>Educational ID Verification</span>
                </div>
              </div>
            </div>

            {/* Floating ID Card 1 - Duplicate */}
            <div className="floating-id-card card-1">
              <img src={Aadhar} alt="aadhar" className="id-image" />
              <div className="id-label">Aadhar Card</div>
            </div>

            {/* Floating ID Card 2 - Duplicate */}
            <div className="floating-id-card card-2">
              <img src={Pan} alt="pan" className="id-image" />
              <div className="id-label">PAN Card</div>
            </div>

            {/* Floating ID Card 3 - Duplicate */}
            <div className="floating-id-card card-3">
              <img src={VoterID} alt="voter" className="id-image" />
              <div className="id-label">Voter ID</div>
            </div>

            {/* Floating ID Card 4 - Duplicate */}
            <div className="floating-id-card card-4">
              <img src={SchoolID} alt="school" className="id-image" />
              <div className="id-label">School ID</div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
