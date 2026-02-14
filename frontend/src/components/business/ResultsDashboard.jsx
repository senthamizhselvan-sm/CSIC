import { useState } from 'react';
import '../../styles/business/ResultsDashboard.css';

export default function ResultsDashboard({ token }) {
  const [selectedProof, setSelectedProof] = useState(null);

  const activeProofs = [
    {
      id: 'proof-abc123-xyz789',
      requestId: 'VF-AB123',
      guest: 'Anonymous #101',
      valid: true,
      expiresIn: '3:12',
      progress: 64,
      attributes: {
        age: 'YES (18+)',
        nationality: 'Indian'
      },
      issuer: 'DigiLocker',
      blockchain: '#TX892047',
      timestamp: '2:32 PM'
    },
    {
      id: 'proof-def456-uvw012',
      requestId: 'VF-AB120',
      guest: 'Anonymous #99',
      valid: true,
      expiresIn: '1:45',
      progress: 35,
      attributes: {
        age: 'YES (21+)'
      },
      issuer: 'DigiLocker',
      blockchain: '#TX892048',
      timestamp: '2:15 PM'
    }
  ];

  const recentVerifications = [
    { time: '2:32 PM', requestId: 'VF-AB123', purpose: 'Hotel Check-In', attributes: 'Age 18+, Nationality (Indian)', status: 'APPROVED' },
    { time: '2:15 PM', requestId: 'VF-AB120', purpose: 'Age Gate', attributes: 'Age 21+ (Verified)', status: 'APPROVED' },
    { time: '1:45 PM', requestId: 'VF-AB119', purpose: 'Account Opening', attributes: 'Age 18+, Name (Verified)', status: 'REJECTED' },
    { time: '1:30 PM', requestId: 'VF-AB118', purpose: 'Hotel Check-In', attributes: 'Age 18+, Nationality (US)', status: 'APPROVED' }
  ];

  return (
    <div className="results-dashboard">
      <h1 className="bp-page-title">Verification Results</h1>

      {/* SUMMARY */}
      <div className="bp-results-summary">
        <i className="bi bi-bar-chart-fill"></i> RESULTS SUMMARY: Today (47 requests) • 42 Approved (89%) • 5 Failed (11%)
      </div>

      {/* ACTIVE PROOFS */}
      <div className="bp-card">
        <h3 className="bp-card-title">Active Proofs (Currently Valid)</h3>

        {activeProofs.map(proof => (
          <div key={proof.id} className="bp-proof-card">
            <div className="bp-proof-header">
              <div className="bp-proof-id">Proof ID: {proof.id}</div>
              <div className="bp-proof-meta">Request: {proof.requestId} • Guest: {proof.guest}</div>
            </div>

            <div className="bp-proof-validity">
              <div className="bp-validity-badge"><i className="bi bi-circle-fill text-success"></i> VALID</div>
              <div className="bp-validity-text">Expires in: <i className="bi bi-stopwatch-fill"></i> {proof.expiresIn}</div>
              <div className="bp-progress-bar">
                <div className="bp-progress-fill" style={{width: `${proof.progress}%`}}></div>
              </div>
              <div className="bp-progress-text">{proof.progress}% remaining</div>
            </div>

            <div className="bp-proof-attributes">
              <h4>Verified Attributes:</h4>
              {Object.entries(proof.attributes).map(([key, value]) => (
                <div key={key} className="bp-attr-row">
                  <span className="bp-attr-key">{key}:</span>
                  <span className="bp-attr-value">{value}</span>
                </div>
              ))}
            </div>

            <div className="bp-proof-meta-info">
              <span>Issued by: {proof.issuer}</span>
              <span>Blockchain: {proof.blockchain}</span>
            </div>

            <div className="bp-proof-actions">
              <button className="bp-btn bp-btn-secondary bp-btn-small" onClick={() => setSelectedProof(proof)}>
                View Full Proof
              </button>
              <button className="bp-btn bp-btn-secondary bp-btn-small">Verify Status</button>
              <button className="bp-btn bp-btn-secondary bp-btn-small">Get Receipt</button>
            </div>
          </div>
        ))}
      </div>

      {/* RECENTLY VERIFIED */}
      <div className="bp-card">
        <h3 className="bp-card-title">Recently Verified (Last Hour)</h3>

        <div className="bp-table">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Request</th>
                <th>Purpose</th>
                <th>Verified Attributes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentVerifications.map((ver, idx) => (
                <tr key={idx}>
                  <td>{ver.time}</td>
                  <td>{ver.requestId}</td>
                  <td>{ver.purpose}</td>
                  <td>{ver.attributes}</td>
                  <td>
                    <span className={`bp-status-badge bp-status-${ver.status.toLowerCase()}`}>
                      {ver.status === 'APPROVED' ? <i className="bi bi-check-circle-fill"></i> : <i className="bi bi-x-circle-fill"></i>} {ver.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bp-card-actions">
          <button className="bp-btn bp-btn-secondary">View All Results →</button>
          <button className="bp-btn bp-btn-secondary">Export Results (CSV)</button>
          <button className="bp-btn bp-btn-secondary">Print Verification Report</button>
        </div>
      </div>

      {/* PROOF DETAIL MODAL */}
      {selectedProof && (
        <div className="bp-modal-overlay" onClick={() => setSelectedProof(null)}>
          <div className="bp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bp-modal-header">
              <h2>Verification Proof: {selectedProof.id}</h2>
              <button className="bp-modal-close" onClick={() => setSelectedProof(null)}><i className="bi bi-x-lg"></i></button>
            </div>

            <div className="bp-modal-body">
              <div className="bp-proof-detail-header">
                <i className="bi bi-check-circle-fill text-success"></i> VERIFIED • {selectedProof.purpose} • Request: {selectedProof.requestId} • Verified: {selectedProof.timestamp}
              </div>

              <div className="bp-proof-detail-grid">
                <div className="bp-proof-detail-section">
                  <h4>Verified Attributes</h4>
                  {Object.entries(selectedProof.attributes).map(([key, value]) => (
                    <div key={key} className="bp-verified-attr">
                      <i className="bi bi-check-circle-fill text-success"></i> {key}: {value}
                    </div>
                  ))}
                </div>

                <div className="bp-proof-detail-section">
                  <h4>Cryptographic Proof</h4>
                  <div className="bp-crypto-info">
                    <div>Proof ID: {selectedProof.id}</div>
                    <div>Issuer: {selectedProof.issuer} (Govt. of India)</div>
                    <div>Signature: Ed25519 (zH3C2AV...)</div>
                    <div>Blockchain: {selectedProof.blockchain}</div>
                  </div>
                  <div className="bp-crypto-actions">
                    <button className="bp-btn bp-btn-secondary bp-btn-small">Verify Signature</button>
                    <button className="bp-btn bp-btn-secondary bp-btn-small">View on Blockchain</button>
                  </div>
                </div>
              </div>

              <div className="bp-disclaimer-box">
                <h4><i className="bi bi-exclamation-triangle-fill"></i> DATA MINIMIZATION DISCLAIMER</h4>
                <p><strong>IMPORTANT:</strong> This verification did NOT involve sharing:</p>
                <ul>
                  <li>ID numbers (Aadhaar, Passport, SSN)</li>
                  <li>Exact date of birth</li>
                  <li>Photos or document scans</li>
                  <li>Full residential address</li>
                </ul>
                <p><strong>Compliance Benefit:</strong> Zero data retention • No GDPR liability • No breach risk</p>
              </div>

              <div className="bp-validity-info">
                <h4>Validity & Usage</h4>
                <div>Generated: {selectedProof.timestamp} • Expires in: {selectedProof.expiresIn}</div>
                <div>Status: <i className="bi bi-circle-fill text-success"></i> ACTIVE • Single-use only • Non-transferable • User-revocable</div>
              </div>

              <div className="bp-modal-actions">
                <button className="bp-btn bp-btn-secondary">Check Validity Now</button>
                <button className="bp-btn bp-btn-secondary">Download Receipt (PDF)</button>
                <button className="bp-btn bp-btn-secondary">Share with Audit</button>
                <button className="bp-btn bp-btn-primary" onClick={() => setSelectedProof(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
