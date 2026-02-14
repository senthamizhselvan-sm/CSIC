import { useState } from 'react';
import '../../styles/business/Settings.css';

export default function Settings({ organizationData }) {
  const [activeTab, setActiveTab] = useState('team');

  const teamMembers = [
    { name: 'John Smith', role: 'Admin', department: 'Front Desk', lastActive: '2 mins ago', status: 'ACTIVE' },
    { name: 'Sarah Chen', role: 'Manager', department: 'Compliance', lastActive: '1 hour ago', status: 'ACTIVE' },
    { name: 'Raj Patel', role: 'Agent', department: 'Front Desk', lastActive: '3 hours ago', status: 'ACTIVE' },
    { name: 'Mike Brown', role: 'Auditor', department: 'Compliance', lastActive: 'Yesterday', status: 'LOCKED' }
  ];

  const policies = [
    { name: 'Standard Check-In', description: 'Age + Nationality for guests', status: 'ACTIVE', appliedTo: 'All Front Desk' },
    { name: 'Age Verification', description: '18+ only for bar access', status: 'ACTIVE', appliedTo: 'Bar Staff' },
    { name: 'KYC Compliance', description: 'Full KYC for account opening', status: 'DRAFT', appliedTo: 'Banking Dept' }
  ];

  const [securitySettings, setSecuritySettings] = useState({
    require2FA: true,
    logAllRequests: true,
    allowBulk: false,
    autoExpire: true,
    developerMode: false
  });

  return (
    <div className="settings">
      <h1 className="bp-page-title">Settings & Administration</h1>

      {/* TABS */}
      <div className="bp-tabs">
        <button 
          className={`bp-tab ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          Team Management
        </button>
        <button 
          className={`bp-tab ${activeTab === 'policies' ? 'active' : ''}`}
          onClick={() => setActiveTab('policies')}
        >
          Verification Policies
        </button>
        <button 
          className={`bp-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security & Audit
        </button>
        <button 
          className={`bp-tab ${activeTab === 'organization' ? 'active' : ''}`}
          onClick={() => setActiveTab('organization')}
        >
          Organization
        </button>
      </div>

      {/* TEAM MANAGEMENT TAB */}
      {activeTab === 'team' && (
        <div className="bp-card">
          <h3 className="bp-card-title">Team Management</h3>

          <div className="bp-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Last Active</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member, idx) => (
                  <tr key={idx}>
                    <td><strong>{member.name}</strong></td>
                    <td>{member.role}</td>
                    <td>{member.department}</td>
                    <td>{member.lastActive}</td>
                    <td>
                      <span className={`bp-status-badge bp-status-${member.status.toLowerCase()}`}>
                        {member.status === 'ACTIVE' ? <i className="bi bi-check-circle-fill"></i> : <i className="bi bi-lock-fill"></i>} {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bp-card-actions">
            <button className="bp-btn bp-btn-primary">Add Team Member</button>
            <button className="bp-btn bp-btn-secondary">Edit Permissions</button>
            <button className="bp-btn bp-btn-secondary">Audit Logs</button>
          </div>
        </div>
      )}

      {/* VERIFICATION POLICIES TAB */}
      {activeTab === 'policies' && (
        <div className="bp-card">
          <h3 className="bp-card-title">Verification Policies</h3>

          <div className="bp-table">
            <table>
              <thead>
                <tr>
                  <th>Policy Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Applied To</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy, idx) => (
                  <tr key={idx}>
                    <td><strong>{policy.name}</strong></td>
                    <td>{policy.description}</td>
                    <td>
                      <span className={`bp-status-badge bp-status-${policy.status.toLowerCase()}`}>
                        {policy.status === 'ACTIVE' ? <i className="bi bi-check-circle-fill"></i> : <i className="bi bi-exclamation-triangle-fill"></i>} {policy.status}
                      </span>
                    </td>
                    <td>{policy.appliedTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bp-card-actions">
            <button className="bp-btn bp-btn-primary">Create New Policy</button>
            <button className="bp-btn bp-btn-secondary">Edit Policy</button>
            <button className="bp-btn bp-btn-secondary">Apply to Team</button>
          </div>
        </div>
      )}

      {/* SECURITY & AUDIT TAB */}
      {activeTab === 'security' && (
        <div className="bp-card">
          <h3 className="bp-card-title">Security & Audit Settings</h3>

          <div className="bp-settings-form">
            <label className="bp-checkbox-setting">
              <input
                type="checkbox"
                checked={securitySettings.require2FA}
                onChange={(e) => setSecuritySettings({...securitySettings, require2FA: e.target.checked})}
              />
              <div>
                <strong>Require 2FA for all admin logins</strong>
                <p className="bp-setting-desc">Enhances security for administrative access</p>
              </div>
            </label>

            <label className="bp-checkbox-setting">
              <input
                type="checkbox"
                checked={securitySettings.logAllRequests}
                onChange={(e) => setSecuritySettings({...securitySettings, logAllRequests: e.target.checked})}
              />
              <div>
                <strong>Log all verification requests</strong>
                <p className="bp-setting-desc">Maintains audit trail of all activities</p>
              </div>
            </label>

            <label className="bp-checkbox-setting">
              <input
                type="checkbox"
                checked={securitySettings.allowBulk}
                onChange={(e) => setSecuritySettings({...securitySettings, allowBulk: e.target.checked})}
              />
              <div>
                <strong>Allow bulk verification requests</strong>
                <p className="bp-setting-desc">Enable batch processing for high-volume operations</p>
              </div>
            </label>

            <label className="bp-checkbox-setting">
              <input
                type="checkbox"
                checked={securitySettings.autoExpire}
                onChange={(e) => setSecuritySettings({...securitySettings, autoExpire: e.target.checked})}
              />
              <div>
                <strong>Auto-expire requests after 5 minutes</strong>
                <p className="bp-setting-desc">Automatically cleanup pending requests</p>
              </div>
            </label>

            <label className="bp-checkbox-setting">
              <input
                type="checkbox"
                checked={securitySettings.developerMode}
                onChange={(e) => setSecuritySettings({...securitySettings, developerMode: e.target.checked})}
              />
              <div>
                <strong>Developer mode (advanced features)</strong>
                <p className="bp-setting-desc">Enables API testing and advanced debugging</p>
              </div>
            </label>
          </div>

          <div className="bp-card-actions">
            <button className="bp-btn bp-btn-primary">Save Settings</button>
            <button className="bp-btn bp-btn-secondary">Reset to Defaults</button>
            <button className="bp-btn bp-btn-secondary">Download Security Report</button>
          </div>
        </div>
      )}

      {/* ORGANIZATION TAB */}
      {activeTab === 'organization' && (
        <div className="bp-card">
          <h3 className="bp-card-title">Organization Settings</h3>

          <div className="bp-form-group">
            <label>Organization Name</label>
            <input type="text" className="bp-input" defaultValue={organizationData.name} />
          </div>

          <div className="bp-form-group">
            <label>Verifier ID</label>
            <input type="text" className="bp-input" defaultValue={organizationData.verifierId} disabled />
            <p className="bp-field-hint">This is your unique identifier and cannot be changed</p>
          </div>

          <div className="bp-form-group">
            <label>Industry</label>
            <select className="bp-select" defaultValue={organizationData.industry}>
              <option>Hospitality</option>
              <option>Banking & Finance</option>
              <option>Healthcare</option>
              <option>E-commerce</option>
              <option>Government</option>
              <option>Other</option>
            </select>
          </div>

          <div className="bp-form-group">
            <label>Business Address</label>
            <textarea className="bp-textarea" rows="3" placeholder="Enter your business address"></textarea>
          </div>

          <div className="bp-form-group">
            <label>Contact Email</label>
            <input type="email" className="bp-input" placeholder="admin@grandhotel.com" />
          </div>

          <div className="bp-card-actions">
            <button className="bp-btn bp-btn-primary">Save Changes</button>
            <button className="bp-btn bp-btn-secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
