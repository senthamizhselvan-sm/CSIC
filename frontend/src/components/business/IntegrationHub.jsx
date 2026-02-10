import { useState } from 'react';

export default function IntegrationHub() {
  const [selectedTab, setSelectedTab] = useState('api-keys');

  const apiKeys = [
    { name: 'Production API', environment: 'Production', created: 'Jan 15, 2025', lastUsed: '2 mins ago', status: 'ACTIVE' },
    { name: 'Sandbox API', environment: 'Development', created: 'Jan 10, 2025', lastUsed: '3 hours ago', status: 'ACTIVE' },
    { name: 'Audit API', environment: 'Audit-only', created: 'Feb 1, 2025', lastUsed: 'Never', status: 'ACTIVE' }
  ];

  const webhooks = [
    { name: 'Verification Success', event: 'verification.approved', endpoint: 'https://your-crm.com/webhook', status: 'ACTIVE' },
    { name: 'Verification Rejected', event: 'verification.rejected', endpoint: 'https://your-crm.com/webhook', status: 'ACTIVE' }
  ];

  const integrations = [
    {
      category: 'Property Management',
      icon: '🏨',
      options: ['Hotel PMS', 'Access Control', 'Guest Apps']
    },
    {
      category: 'Banking Systems',
      icon: '🏦',
      options: ['Core Banking', 'Loan Origination', 'KYC Compliance']
    },
    {
      category: 'E-commerce Platforms',
      icon: '🛒',
      options: ['Shopify', 'WooCommerce', 'Custom Checkout']
    }
  ];

  return (
    <div className="integration-hub">
      <h1 className="bp-page-title">API & Integration Hub</h1>

      {/* STATUS BAR */}
      <div className="bp-integration-status">
        🔧 INTEGRATION STATUS: ✅ Active • 3 API Keys • 2 Webhooks • Last Sync: 2 mins ago
      </div>

      {/* TABS */}
      <div className="bp-tabs">
        <button 
          className={`bp-tab ${selectedTab === 'api-keys' ? 'active' : ''}`}
          onClick={() => setSelectedTab('api-keys')}
        >
          API Keys
        </button>
        <button 
          className={`bp-tab ${selectedTab === 'webhooks' ? 'active' : ''}`}
          onClick={() => setSelectedTab('webhooks')}
        >
          Webhooks
        </button>
        <button 
          className={`bp-tab ${selectedTab === 'integrations' ? 'active' : ''}`}
          onClick={() => setSelectedTab('integrations')}
        >
          Integrations
        </button>
      </div>

      {/* API KEYS TAB */}
      {selectedTab === 'api-keys' && (
        <div className="bp-card">
          <h3 className="bp-card-title">API Keys & Access</h3>

          <div className="bp-table">
            <table>
              <thead>
                <tr>
                  <th>Key Name</th>
                  <th>Environment</th>
                  <th>Created</th>
                  <th>Last Used</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key, idx) => (
                  <tr key={idx}>
                    <td><strong>{key.name}</strong></td>
                    <td>{key.environment}</td>
                    <td>{key.created}</td>
                    <td>{key.lastUsed}</td>
                    <td>
                      <span className="bp-status-badge bp-status-active">✅ {key.status}</span>
                    </td>
                    <td>
                      <button className="bp-btn bp-btn-danger bp-btn-small">Revoke</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bp-card-actions">
            <button className="bp-btn bp-btn-primary">Create New API Key</button>
            <button className="bp-btn bp-btn-secondary">Download SDKs</button>
            <button className="bp-btn bp-btn-secondary">View API Documentation</button>
          </div>
        </div>
      )}

      {/* WEBHOOKS TAB */}
      {selectedTab === 'webhooks' && (
        <div className="bp-card">
          <h3 className="bp-card-title">Webhook Configuration</h3>

          <div className="bp-table">
            <table>
              <thead>
                <tr>
                  <th>Webhook Name</th>
                  <th>Event Trigger</th>
                  <th>Endpoint</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {webhooks.map((webhook, idx) => (
                  <tr key={idx}>
                    <td><strong>{webhook.name}</strong></td>
                    <td><code>{webhook.event}</code></td>
                    <td>{webhook.endpoint}</td>
                    <td>
                      <span className="bp-status-badge bp-status-active">✅ {webhook.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bp-webhook-events">
            <strong>Available Events:</strong> verification.created, verification.approved, verification.rejected, proof.expired
          </div>

          <div className="bp-card-actions">
            <button className="bp-btn bp-btn-primary">Add New Webhook</button>
            <button className="bp-btn bp-btn-secondary">Test Webhooks</button>
            <button className="bp-btn bp-btn-secondary">View Payload Samples</button>
          </div>
        </div>
      )}

      {/* INTEGRATIONS TAB */}
      {selectedTab === 'integrations' && (
        <div className="bp-card">
          <h3 className="bp-card-title">Integration Options</h3>

          <div className="bp-integrations-grid">
            {integrations.map((integration, idx) => (
              <div key={idx} className="bp-integration-card">
                <div className="bp-integration-icon">{integration.icon}</div>
                <h4 className="bp-integration-title">{integration.category}</h4>
                <ul className="bp-integration-list">
                  {integration.options.map((option, i) => (
                    <li key={i}>• {option}</li>
                  ))}
                </ul>
                <button className="bp-btn bp-btn-secondary bp-btn-small">View Integration</button>
              </div>
            ))}
          </div>

          <div className="bp-card-actions">
            <button className="bp-btn bp-btn-primary">Request Custom Integration</button>
            <button className="bp-btn bp-btn-secondary">Schedule Integration Call</button>
          </div>
        </div>
      )}

      {/* API DOCUMENTATION PREVIEW */}
      <div className="bp-card">
        <h3 className="bp-card-title">Quick API Reference</h3>

        <div className="bp-code-example">
          <h4>Create Verification Request</h4>
          <pre className="bp-code-block">{`POST /api/verification/request
Authorization: Bearer YOUR_API_KEY

{
  "businessName": "Grand Hotel Mumbai",
  "purpose": "Hotel Check-In",
  "requestedData": [
    { "field": "age", "type": "verification_only" },
    { "field": "nationality", "type": "selective_disclosure" }
  ],
  "expiryMinutes": 5,
  "privacyMode": "zero-knowledge"
}`}</pre>
        </div>

        <div className="bp-code-example">
          <h4>Check Request Status</h4>
          <pre className="bp-code-block">{`GET /api/verification/status/:requestId
Authorization: Bearer YOUR_API_KEY`}</pre>
        </div>

        <button className="bp-link-btn">View Full API Documentation →</button>
      </div>
    </div>
  );
}
