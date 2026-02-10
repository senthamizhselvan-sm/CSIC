export default function ComplianceCenter() {
  const regulations = [
    { name: 'GDPR (EU)', status: 'FULL', applicability: 'Article 5, 25', requirement: 'Data minimization by design' },
    { name: 'DPDP 2023 (India)', status: 'FULL', applicability: 'Section 4, 8', requirement: 'No PII storage, consent per use' },
    { name: 'CCPA (California)', status: 'FULL', applicability: '§1798.100', requirement: 'No collection beyond minimal' },
    { name: 'ISO 27001', status: 'PARTIAL', applicability: 'A.8.2', requirement: 'Cryptographic proof validation' },
    { name: 'RBI KYC (India)', status: 'PARTIAL', applicability: 'Minimal KYC', requirement: 'Basic verification for Level 1' }
  ];

  return (
    <div className="compliance-center">
      <h1 className="bp-page-title">Compliance & Privacy Center</h1>

      {/* OVERALL STATUS */}
      <div className="bp-compliance-banner">
        🛡️ OVERALL COMPLIANCE STATUS: 100/100 ✅ PERFECT • Last Audit: Feb 1, 2025
      </div>

      {/* REGULATORY COMPLIANCE MATRIX */}
      <div className="bp-card">
        <h3 className="bp-card-title">Regulatory Compliance Matrix</h3>

        <div className="bp-table">
          <table>
            <thead>
              <tr>
                <th>Regulation</th>
                <th>Status</th>
                <th>Applicability</th>
                <th>Verification Requirement</th>
              </tr>
            </thead>
            <tbody>
              {regulations.map((reg, idx) => (
                <tr key={idx}>
                  <td><strong>{reg.name}</strong></td>
                  <td>
                    <span className={`bp-status-badge bp-status-${reg.status.toLowerCase()}`}>
                      {reg.status === 'FULL' ? '✅' : '⚠️'} {reg.status}
                    </span>
                  </td>
                  <td>{reg.applicability}</td>
                  <td>{reg.requirement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="bp-btn bp-btn-secondary">Download Compliance Matrix (PDF)</button>
      </div>

      {/* LIABILITY REDUCTION METRICS */}
      <div className="bp-card">
        <h3 className="bp-card-title">Liability Reduction Metrics</h3>

        <div className="bp-comparison-grid">
          <div className="bp-comparison-card">
            <h4 className="bp-comparison-title">Traditional KYC</h4>
            <div className="bp-comparison-item">
              <span className="bp-label">Data Stored:</span>
              <span className="bp-value bp-value-danger">100%</span>
            </div>
            <div className="bp-comparison-item">
              <span className="bp-label">Breach Risk:</span>
              <span className="bp-value bp-value-danger">HIGH</span>
            </div>
            <div className="bp-comparison-item">
              <span className="bp-label">GDPR Liability:</span>
              <span className="bp-value bp-value-danger">HIGH</span>
            </div>
            <div className="bp-comparison-item">
              <span className="bp-label">Retention Policy:</span>
              <span className="bp-value">Required</span>
            </div>
            <div className="bp-comparison-item">
              <span className="bp-label">Audit Complexity:</span>
              <span className="bp-value bp-value-danger">HIGH</span>
            </div>
          </div>

          <div className="bp-comparison-card bp-comparison-highlight">
            <h4 className="bp-comparison-title">VerifyOnce</h4>
            <div className="bp-comparison-item">
              <span className="bp-label">Data Stored:</span>
              <span className="bp-value bp-value-success">0%</span>
            </div>
            <div className="bp-comparison-item">
              <span className="bp-label">Breach Risk:</span>
              <span className="bp-value bp-value-success">NONE</span>
            </div>
            <div className="bp-comparison-item">
              <span className="bp-label">GDPR Liability:</span>
              <span className="bp-value bp-value-success">NONE</span>
            </div>
            <div className="bp-comparison-item">
              <span className="bp-label">Retention Policy:</span>
              <span className="bp-value bp-value-success">Not needed</span>
            </div>
            <div className="bp-comparison-item">
              <span className="bp-label">Audit Complexity:</span>
              <span className="bp-value bp-value-success">LOW</span>
            </div>
          </div>
        </div>

        <div className="bp-cost-reduction">
          <strong>Estimated Annual Compliance Cost Reduction:</strong> <span className="bp-value-huge">87%</span>
        </div>
      </div>

      {/* AUDIT READINESS */}
      <div className="bp-card">
        <h3 className="bp-card-title">Audit Readiness</h3>

        <p>Generate instant reports for regulatory audits and compliance officers.</p>

        <div className="bp-audit-actions">
          <button className="bp-btn bp-btn-primary">Generate GDPR Compliance Report</button>
          <button className="bp-btn bp-btn-primary">Create DPIA Template</button>
          <button className="bp-btn bp-btn-primary">Export Audit Logs</button>
        </div>

        <div className="bp-templates-section">
          <h4>Pre-filled Templates for:</h4>
          <ul className="bp-template-list">
            <li>📄 Data Protection Impact Assessment (DPIA)</li>
            <li>📄 Data Processing Register</li>
            <li>📄 Privacy Notice Updates</li>
            <li>📄 Vendor Compliance Questionnaires</li>
          </ul>
        </div>

        <button className="bp-link-btn">Access Compliance Toolkit →</button>
      </div>

      {/* KEY BENEFITS */}
      <div className="bp-card bp-card-highlight">
        <h3 className="bp-card-title">🎯 Compliance Benefits Summary</h3>

        <div className="bp-benefits-grid">
          <div className="bp-benefit-item">
            <div className="bp-benefit-icon">✅</div>
            <div className="bp-benefit-text">
              <strong>Zero Data Liability</strong>
              <p>No PII stored = no breach risk = no GDPR Article 33 reporting requirement</p>
            </div>
          </div>
          <div className="bp-benefit-item">
            <div className="bp-benefit-icon">🛡️</div>
            <div className="bp-benefit-text">
              <strong>Privacy by Design</strong>
              <p>Built-in GDPR Article 25 compliance from day one</p>
            </div>
          </div>
          <div className="bp-benefit-item">
            <div className="bp-benefit-icon">📉</div>
            <div className="bp-benefit-text">
              <strong>Reduced Insurance Premiums</strong>
              <p>Lower cyber liability insurance due to zero data storage</p>
            </div>
          </div>
          <div className="bp-benefit-item">
            <div className="bp-benefit-icon">⚡</div>
            <div className="bp-benefit-text">
              <strong>Instant Compliance Reports</strong>
              <p>One-click generation of audit-ready documentation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
