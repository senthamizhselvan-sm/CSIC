import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <div className="hero" style={{ paddingTop: 100, paddingBottom: 60 }}>
        <h1>
          Verify <span>Once</span>. Prove Anywhere. Share Nothing.
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: 30 }}>
          VerifyOnce replaces document uploads with cryptographic proof. Your identity 
          is verified once by trusted authorities and proven anywhere using time-limited, 
          privacy-preserving proofs.
        </p>

        <div style={{ marginBottom: 20 }}>
          <button className="btn-primary" onClick={() => navigate('/demo')} 
            style={{ marginRight: 10, marginBottom: 10 }}>
            Try Live Demo
          </button>
          <button className="btn-primary" onClick={() => navigate('/signup')} 
            style={{ marginRight: 10, marginBottom: 10, background: 'var(--success)' }}>
            Create Your Wallet
          </button>
          <button className="btn-secondary" onClick={() => navigate('/verifier')}
            style={{ marginBottom: 10 }}>
            For Businesses
          </button>
        </div>
      </div>

      {/* ===== PROBLEM SECTION ===== */}
      <div className="page">
        <h2 style={{ marginBottom: 30, textAlign: 'center' }}>The Document Trap</h2>
        
        <div className="grid-2">
          <div className="card">
            <h3>Repeated Uploads</h3>
            <p>Same documents uploaded to hotels, banks, platforms, government portals. 
            Every business wants your passport, driving license, proof of address.</p>
          </div>

          <div className="card">
            <h3>Permanent Storage</h3>
            <p>Each upload is stored forever on private servers. No expiry. No revocation. 
            One breach = permanent identity damage.</p>
          </div>

          <div className="card">
            <h3>No Control</h3>
            <p>You have no visibility into who has your documents or what they're doing with them. 
            No audit trail. No way to revoke access.</p>
          </div>

          <div className="card">
            <h3>Trust Misplaced</h3>
            <p>Trust is placed in data storage, not verification. Systems fail because they store 
            identity documents, not because verification itself failed.</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 40, padding: 20, 
          background: '#fee2e2', borderRadius: 'var(--radius)' }}>
          <p style={{ fontSize: '1.05rem', color: '#991b1b', fontWeight: 600 }}>
            This is not a UI problem. This is a trust architecture failure.
          </p>
        </div>
      </div>

      {/* ===== SOLUTION SECTION ===== */}
      <div className="page">
        <h2 style={{ marginBottom: 30, textAlign: 'center' }}>Proof-Based Identity</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          <div className="card">
            <h3 style={{ color: 'var(--primary)' }}>1. Verify Once</h3>
            <p>Identity verified by trusted issuer (Government, Bank, University). 
            Cryptographically signed credential issued.</p>
          </div>

          <div className="card">
            <h3 style={{ color: 'var(--primary)' }}>2. Store Credential</h3>
            <p>Credential stored only in user's encrypted wallet. 
            VerifyOnce stores nothing. Zero document retention.</p>
          </div>

          <div className="card">
            <h3 style={{ color: 'var(--primary)' }}>3. Generate Proofs</h3>
            <p>Time-limited, privacy-preserving proofs generated on demand. 
            Only required information shared. Proof expires automatically.</p>
          </div>

          <div className="card">
            <h3 style={{ color: 'var(--primary)' }}>4. Stay in Control</h3>
            <p>Every request needs explicit consent. Full audit history. 
            Instant revocation of access. You control your identity.</p>
          </div>
        </div>
      </div>

      {/* ===== CORE PRINCIPLES ===== */}
      <div className="page">
        <h2 style={{ marginBottom: 30, textAlign: 'center' }}>Core Principles</h2>

        <div className="grid-2">
          <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <h3>Separation of Issuance & Verification</h3>
            <p>The entity that verified your identity (government) is different from 
            entities that use your proof (businesses). This separation prevents mission creep 
            and keeps data silos intact.</p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <h3>Cryptographic Trust</h3>
            <p>Trust is established through digital signatures and cryptographic primitives, 
            not through storing and searching databases. Verification is instant, provable, 
            and survives server compromises.</p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <h3>User Sovereignty & Consent</h3>
            <p>Users explicitly approve every verification request. Wallets hold credentials. 
            Proofs are generated locally. Revocation is immediate. Identity remains with the user.</p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <h3>Proof Expiry & Bounds</h3>
            <p>Proofs are time-limited and scoped to specific attributes. 
            A proof of age expires in 24 hours. A hotel never receives full passport data. 
            Trust has boundaries.</p>
          </div>
        </div>
      </div>

      {/* ===== ACTORS IN THE SYSTEM ===== */}
      <div className="page">
        <h2 style={{ marginBottom: 30, textAlign: 'center' }}>Four Pillars of Trust</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          <div className="card center">
            <h3>👤 User</h3>
            <p>Controls identity. Generates proofs on demand. Approves every request. 
            Maintains audit trail. Can revoke access.</p>
          </div>

          <div className="card center">
            <h3>✓ Issuer</h3>
            <p>Verifies identity once. Issues cryptographically signed credentials. 
            Operates independently. No ongoing custody of documents.</p>
          </div>

          <div className="card center">
            <h3>🔐 Wallet</h3>
            <p>Stores encrypted credentials locally. Generates time-limited proofs. 
            Handles all cryptography. User owns and controls the wallet.</p>
          </div>

          <div className="card center">
            <h3>🔍 Verifier</h3>
            <p>Receives proofs and validates signatures. Never stores documents. 
            No identity data retention. Zero liability for breaches.</p>
          </div>
        </div>
      </div>

      {/* ===== USE CASES ===== */}
      <div className="page">
        <h2 style={{ marginBottom: 30, textAlign: 'center' }}>Real-World Use Cases</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          <div className="card">
            <h3>Hotel Check-In</h3>
            <p>Guest arrives with phone. Generates proof of identity. Hotel verifies in 
            seconds. No passport photocopy needed. Proof expires after checkout.</p>
          </div>

          <div className="card">
            <h3>Bank Account Opening</h3>
            <p>Applicant shares age + identity proof. Bank validates cryptographically. 
            No document storage. Compliant with KYC. Account opened instantly.</p>
          </div>

          <div className="card">
            <h3>Age Verification</h3>
            <p>User proves age {'>='} 18 without revealing birthdate. Proof is valid for 24 hours. 
            Vendor stores nothing. Privacy preserved entirely.</p>
          </div>

          <div className="card">
            <h3>University Admissions</h3>
            <p>Student credential verified by issuing university. Applicant generates proof. 
            Admissions officer validates. No transcript storage needed.</p>
          </div>

          <div className="card">
            <h3>Gig Worker Onboarding</h3>
            <p>Background check issued as credential. Worker generates proof each shift. 
            Platform verifies compliance. Instant revocation if status changes.</p>
          </div>

          <div className="card">
            <h3>Insurance Eligibility</h3>
            <p>Medical provider issues health credential. Patient generates claim proof. 
            Insurer validates and processes. No medical history stored.</p>
          </div>
        </div>
      </div>

      {/* ===== TRUST & SECURITY ===== */}
      <div className="page">
        <h2 style={{ marginBottom: 30, textAlign: 'center' }}>Trust & Security Guarantees</h2>

        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
            <div>
              <p><strong>✓ Zero Document Storage</strong><br />
              VerifyOnce stores no documents, photos, or identity attributes. 
              No data = no breach surface.</p>

              <p style={{ marginTop: 20 }}><strong>✓ Time-Limited Proofs</strong><br />
              Every proof expires. An age proof is valid for 24 hours. 
              A hotel visit credential expires at checkout.</p>

              <p style={{ marginTop: 20 }}><strong>✓ Instant Revocation</strong><br />
              User can revoke credentials immediately. Bad actor removed from system in seconds. 
              No waiting for administrative processes.</p>
            </div>

            <div>
              <p><strong>✓ Encrypted Wallet</strong><br />
              Credentials encrypted with user's key. Only user's device can generate proofs. 
              No cloud dependency.</p>

              <p style={{ marginTop: 20 }}><strong>✓ Cryptographic Proof</strong><br />
              Every proof is digitally signed by issuer. Verification is mathematical, 
              not database lookup. Works offline.</p>

              <p style={{ marginTop: 20 }}><strong>✓ Audit Trail</strong><br />
              User sees every request and proof shared. Full history visible. 
              Transparency by design.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FINAL CTA ===== */}
      <div className="hero" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', 
        color: 'white', paddingTop: 60, paddingBottom: 60 }}>
        <h1 style={{ color: 'white' }}>
          In a world where identity leaks are permanent,<br />
          VerifyOnce makes trust temporary, provable, and controllable.
        </h1>

        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginBottom: 30 }}>
          Identity is your most valuable asset. Protect it with proof-based architecture, 
          not document storage.
        </p>

        <div>
          <button className="btn-primary" onClick={() => navigate('/demo')} 
            style={{ background: 'white', color: 'var(--primary)', marginRight: 10, marginBottom: 10 }}>
            Launch Live Demo
          </button>
          <button style={{ 
            background: 'rgba(255,255,255,0.2)', 
            color: 'white', 
            border: '1px solid white',
            cursor: 'pointer',
            padding: '12px 22px',
            borderRadius: 'var(--radius)',
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: 10
          }}>
            View Architecture
          </button>
        </div>
      </div>

      {/* SPACING */}
      <div style={{ height: 40 }}></div>
    </>
  );
}
