import { useState } from 'react';

export default function VerifierOverview({ organizationData, metrics, onCreateRequest, token }) {
  const [acceptedRequests] = useState([
    {
      requestId: 'VF-AB123',
      status: 'approved',
      approvedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      sharedData: { ageVerified: true, ageRange: '21+', nationality: 'Indian' }
    },
    {
      requestId: 'VF-AB120',
      status: 'approved',
      approvedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      sharedData: { ageVerified: true, ageRange: '18+', nationality: 'Indian' }
    }
  ]);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="verifier-overview">
      <h1 className="bp-page-title">Verification Command Center</h1>
      
      <div className="bp-overview-grid">
        {/* ORGANIZATION PROFILE */}
        <div className="bp-card">
          <h3 className="bp-card-title">Organization Profile</h3>
          <div className="bp-org-profile">
            <div className="bp-org-header">
              <span className="bp-org-icon">🏢</span>
              <div>
                <div className="bp-org-name-large">{organizationData.name}</div>
                <div className="bp-org-meta">Verifier ID: {organizationData.verifierId}</div>
              </div>
            </div>
            <div className="bp-org-details">
              <div className="bp-org-detail-item">
                <span className="bp-label">Status:</span>
                <span className="bp-status-badge bp-status-active">✅ {organizationData.status}</span>
              </div>
              <div className="bp-org-detail-item">
                <span className="bp-label">Industry:</span>
                <span>{organizationData.industry}</span>
              </div>
              <div className="bp-org-detail-item">
                <span className="bp-label">Since:</span>
                <span>{organizationData.since}</span>
              </div>
            </div>
          </div>
        </div>

        {/* REAL-TIME METRICS */}
        <div className="bp-card">
          <h3 className="bp-card-title">Real-Time Metrics</h3>
          <div className="bp-metrics-grid">
            <div className="bp-metric">
              <div className="bp-metric-label">Today Reqs</div>
              <div className="bp-metric-value">{metrics.todayRequests}</div>
            </div>
            <div className="bp-metric">
              <div className="bp-metric-label">Active Proofs</div>
              <div className="bp-metric-value">{metrics.activeProofs}</div>
            </div>
            <div className="bp-metric">
              <div className="bp-metric-label">Success Rate</div>
              <div className="bp-metric-value">{metrics.successRate}%</div>
            </div>
            <div className="bp-metric">
              <div className="bp-metric-label">Avg. Time</div>
              <div className="bp-metric-value">{metrics.avgTime} sec</div>
            </div>
          </div>
          <button className="bp-link-btn">View Detailed Analytics →</button>
        </div>
      </div>

      {/* ✨ NEWLY ACCEPTED REQUESTS SECTION */}
      <div className="bp-card bp-card-highlight">
        <h3 className="bp-card-title">✅ Newly Accepted Requests</h3>
        <p className="bp-card-description">
          Real-time view of customers who have approved your verification requests
        </p>
        
        {acceptedRequests.length > 0 ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {acceptedRequests.map((req) => (
              <div
                key={req.requestId}
                style={{
                  background: '#f0fdf4',
                  border: '2px solid #10b981',
                  borderRadius: '8px',
                  padding: '14px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>✅</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
                      {req.requestId}
                    </span>
                    <span style={{
                      background: '#dcfce7',
                      color: '#166534',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      APPROVED
                    </span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>
                    {formatTime(req.approvedAt)} • Shared data received
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    {req.sharedData && Object.entries(req.sharedData).map(([key, value]) => (
                      <span
                        key={key}
                        style={{
                          background: 'white',
                          border: '1px solid #d1d5db',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: '#374151'
                        }}
                      >
                        <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {typeof value === 'boolean' ? (value ? '✓' : '✗') : value}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}>
                    View Full Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '24px',
            color: '#6b7280',
            background: '#f9fafb',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>
              ⏳ No approved requests yet
            </div>
            <div style={{ fontSize: '13px' }}>
              Create a verification request and share the code with customers
            </div>
          </div>
        )}
      </div>

      {/* COMPLIANCE OVERVIEW */}
      <div className="bp-card bp-card-large">
        <h3 className="bp-card-title">Data Liability Status</h3>
        <div className="bp-compliance-grid">
          <div className="bp-compliance-section">
            <h4>Storage Status</h4>
            <div className="bp-stat-item">
              <span className="bp-label">Documents Stored:</span>
              <span className="bp-value-big">0</span>
            </div>
            <div className="bp-stat-item">
              <span className="bp-label">PII Records:</span>
              <span className="bp-value-big">0</span>
            </div>
            <div className="bp-stat-item">
              <span className="bp-label">Retention Policy:</span>
              <span className="bp-value-muted">N/A (no data)</span>
            </div>
          </div>

          <div className="bp-compliance-section">
            <h4>Compliance Status</h4>
            <div className="bp-stat-item">
              <span className="bp-label">GDPR Compliance:</span>
              <span className="bp-value-success">✅ Full</span>
            </div>
            <div className="bp-stat-item">
              <span className="bp-label">Data Minimization:</span>
              <span className="bp-value-success">99.8%</span>
            </div>
            <div className="bp-stat-item">
              <span className="bp-label">Breach Liability:</span>
              <span className="bp-value-success">$0 (nothing to leak)</span>
            </div>
          </div>
        </div>

        <div className="bp-key-principle">
          <strong>Key Principle:</strong> "Trust without data. Verification without liability."
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bp-quick-action-bar">
        <button className="bp-btn bp-btn-primary" onClick={onCreateRequest}>
          ➕ Create Verification Request
        </button>
        <button className="bp-btn bp-btn-secondary">📊 View Analytics</button>
        <button className="bp-btn bp-btn-secondary">🛡️ Compliance Report</button>
        <button className="bp-btn bp-btn-secondary">⚙️ Settings</button>
      </div>

      {/* REQUEST BUILDER QUICK CREATE */}
      <div className="bp-card">
        <h3 className="bp-card-title">Quick Request Builder</h3>
        <p className="bp-card-description">
          Create a verification request in seconds. Select your purpose and we'll configure the optimal privacy settings.
        </p>
        
        <div className="bp-purpose-grid">
          <button className="bp-purpose-card" onClick={onCreateRequest}>
            <div className="bp-purpose-icon">🏨</div>
            <div className="bp-purpose-label">Hotel Check-In</div>
          </button>
          <button className="bp-purpose-card" onClick={onCreateRequest}>
            <div className="bp-purpose-icon">🏦</div>
            <div className="bp-purpose-label">Account Opening</div>
          </button>
          <button className="bp-purpose-card" onClick={onCreateRequest}>
            <div className="bp-purpose-icon">🍺</div>
            <div className="bp-purpose-label">Age Verification</div>
          </button>
          <button className="bp-purpose-card" onClick={onCreateRequest}>
            <div className="bp-purpose-icon">💼</div>
            <div className="bp-purpose-label">Employment</div>
          </button>
        </div>
      </div>

      {/* LIVE MONITOR PREVIEW */}
      <div className="bp-card">
        <h3 className="bp-card-title">Recent Activity Summary</h3>
        <div className="bp-activity-list">
          <div className="bp-activity-item">
            <span className="bp-activity-icon">✅</span>
            <span className="bp-activity-text">VF-AB123 approved • Age verification • 2 mins ago</span>
          </div>
          <div className="bp-activity-item">
            <span className="bp-activity-icon">⏳</span>
            <span className="bp-activity-text">VF-AB124 pending • Waiting for user • 4 mins ago</span>
          </div>
          <div className="bp-activity-item">
            <span className="bp-activity-icon">✅</span>
            <span className="bp-activity-text">VF-AB120 approved • Hotel check-in • 15 mins ago</span>
          </div>
        </div>
        <button className="bp-link-btn">View All Activity →</button>
      </div>
    </div>
  );
}
