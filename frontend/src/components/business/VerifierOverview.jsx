export default function VerifierOverview({ organizationData, metrics, onCreateRequest }) {
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
        <h3 className="bp-card-title">Recent Activity</h3>
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
