import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [notifications] = useState([
    { id: 1, title: 'Grand Hotel verification request', time: '2 min ago' },
    { id: 2, title: 'Address proof expiring soon', time: '1 hour ago' },
    { id: 3, title: 'New login from Delhi detected', time: '3 hours ago' }
  ]);
  
  // Mobile-specific text content
  const mobileContent = {
    hero: {
      greeting: "Welcome back!",
      subtitle: "Secure your digital identity"
    },
    stats: {
      credentials: "Active Credentials",
      verifications: "Total Verifications",
      security: "Security Score",
      activity: "Recent Activity"
    },
    credentials: {
      title: "Credential Vault",
      subtitle: "Manage your digital certificates",
      addNew: "Add New Credential",
      primary: {
        title: "Professional ID",
        issuer: "VerifyOnce Authority",
        description: "Your official digital identity credential",
        actions: ["Share", "View Details"]
      }
    },
    activity: {
      title: "Activity Feed",
      subtitle: "Your verification history",
      actions: [
        { type: "verification", text: "ID verified by TechCorp", time: "2 hours ago" },
        { type: "credential", text: "New professional credential added", time: "1 day ago" },
        { type: "security", text: "Security settings updated", time: "3 days ago" },
        { type: "access", text: "Wallet accessed from new device", time: "1 week ago" }
      ]
    },
    security: {
      title: "Security Center",
      subtitle: "Monitor and protect your identity",
      score: "95%",
      status: "Excellent",
      features: [
        { name: "Biometric Lock", status: "enabled" },
        { name: "Multi-Factor Auth", status: "enabled" },
        { name: "Device Tracking", status: "enabled" },
        { name: "Backup Recovery", status: "configured" }
      ],
      sessions: [
        { device: "iPhone 14", location: "New York, NY", current: true, time: "Active now" },
        { device: "MacBook Pro", location: "New York, NY", current: false, time: "2 hours ago" }
      ]
    },
    navigation: {
      dashboard: "Overview",
      credentials: "Credentials",
      activity: "Activity",
      security: "Security"
    }
  };

  // Sample data for demo purposes
  const [activeProofs] = useState([
    {
      id: 'proof-abc123-xyz789',
      verifier: 'Grand Hotel Mumbai',
      attributes: ['Age (18+)', 'Nationality (Indian)'],
      generated: '2:32 PM',
      expires: '2:37 PM',
      timeRemaining: 102, // seconds
      progress: 66
    }
  ]);

  const [activityLog] = useState([
    { date: 'Today', time: '14:32', verifier: 'Grand Hotel Mumbai', request: 'Guest Check-in', attributes: 'Age, Nationality', status: 'approved' },
    { date: 'Today', time: '10:15', verifier: 'HDFC Bank', request: 'Account Opening', attributes: 'Identity, Address', status: 'rejected' },
    { date: 'Yesterday', time: '14:20', verifier: 'Zoomcar', request: 'Car Rental', attributes: 'Age, License', status: 'approved' },
    { date: 'Yesterday', time: '11:30', verifier: 'Apollo Hospitals', request: 'Medical Registration', attributes: 'Identity, Insurance', status: 'approved' },
    { date: 'Feb 9', time: '18:45', verifier: 'Amazon.in', request: 'Age-restricted Purchase', attributes: 'Age', status: 'approved' }
  ]);

  const [stats] = useState({
    totalVerifications: 127,
    activeProofs: 1,
    privacyScore: 98,
    expiryAlerts: 1,
    approvalRate: 84,
    avgResponseTime: '1.2 min',
    dataExposure: '312 min'
  });

  useEffect(() => {
    // Get token from localStorage (ProtectedRoute ensures correct role)
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setToken(storedToken);
      setUser(storedUser);
      fetchCredentials(storedToken);
    }
  }, []);

  const fetchCredentials = async (authToken) => {
    try {
      const res = await axios.get('http://localhost:5000/api/wallet/credentials', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setCredentials(res.data.credentials || []);
    } catch (err) {
      console.log('No credentials yet');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const addDemoCredential = async () => {
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/api/wallet/add-credential',
        {
          type: 'government_id',
          issuer: 'DigiLocker (Demo)',
          data: {
            fullName: user?.name || 'Jameen',
            dateOfBirth: '1998-04-12',
            nationality: 'Indian',
            idNumber: 'XXXX-XXXX-1234'
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCredentials(token);
    } catch (err) {
      console.error('Failed to add credential', err);
    } finally {
      setLoading(false);
    }
  };

  const approve = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/verification/approve/${code}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus('approved');
      setCode('');
      setShowModal(false);
    } catch {
      setStatus('error');
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setStatus('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <>
        <div className="mobile-dashboard">
          <div className="mobile-container">
            <div className="mobile-header">
              <div className="mobile-title">Loading...</div>
            </div>
          </div>
        </div>
        <div className="page desktop-only"><p>Loading...</p></div>
      </>
    );
  }

  // Ensure user role is correct
  if (user.role !== 'user') {
    return (
      <>
        <div className="mobile-dashboard">
          <div className="mobile-container">
            <div className="mobile-header">
              <div className="mobile-title">Access Denied</div>
            </div>
            <div className="credential-card-main">
              <h3>Access Denied</h3>
              <p>This wallet is only for users (role: user). You are logged in as: {user.role}</p>
            </div>
          </div>
        </div>
        <div className="page desktop-only">
          <div className="card">
            <h2>Access Denied</h2>
            <p>This wallet is only for users (role: user). You are logged in as: {user.role}</p>
          </div>
        </div>
      </>
    );
  }

  const TopNavbar = () => (
    <div className="top-navbar">
      <div className="navbar-left">
        <a href="#" className="navbar-logo">VerifyOnce</a>
        <div className="navbar-search">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search credentials, requests, or activities..." />
        </div>
      </div>
      <div className="navbar-right">
        <div className="notification-badge">
          🔔
          <span className="notification-count">{notifications.length}</span>
        </div>
        <div className="user-menu">
          <div className="user-avatar">{user.name?.charAt(0) || 'J'}</div>
          <span>{user.name || 'Jameen'}</span>
        </div>
        <button className="p-8">⚙️</button>
        <button className="p-8">🆘</button>
      </div>
    </div>
  );

  const LeftSidebar = () => (
    <div className={`left-sidebar ${sidebarOpen ? 'open' : ''}`}>
      <ul className="sidebar-nav">
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`} 
             onClick={() => setActiveSection('dashboard')}>
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'credentials' ? 'active' : ''}`}
             onClick={() => setActiveSection('credentials')}>
            <span className="nav-icon">📁</span>
            <span>Credentials</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'requests' ? 'active' : ''}`}
             onClick={() => setActiveSection('requests')}>
            <span className="nav-icon">📬</span>
            <span>Verification Requests</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'proofs' ? 'active' : ''}`}
             onClick={() => setActiveSection('proofs')}>
            <span className="nav-icon">🔐</span>
            <span>Active Proofs</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'activity' ? 'active' : ''}`}
             onClick={() => setActiveSection('activity')}>
            <span className="nav-icon">📊</span>
            <span>Activity Log</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'security' ? 'active' : ''}`}
             onClick={() => setActiveSection('security')}>
            <span className="nav-icon">🛡️</span>
            <span>Security</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'add' ? 'active' : ''}`}
             onClick={() => setActiveSection('add')}>
            <span className="nav-icon">➕</span>
            <span>Add Credential</span>
          </a>
        </li>
      </ul>
      
      <div className="sidebar-section">
        <div className="section-title">Quick Actions</div>
        <div className="quick-actions">
          <button className="btn-danger quick-action-btn">🚨 Emergency Revoke</button>
          <button className="btn-secondary quick-action-btn">🔒 Lock Wallet</button>
          <button className="btn-secondary quick-action-btn">📤 Export Logs</button>
        </div>
      </div>
    </div>
  );

  const WalletOverview = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h3>Wallet Overview</h3>
      </div>
      
      <div className="wallet-overview">
        <div className="wallet-identity">
          <div className="identity-header">
            <div className="user-avatar" style={{width: '48px', height: '48px', fontSize: '1.2rem'}}>
              {user.name?.charAt(0) || 'J'}
            </div>
            <div>
              <h4>{user.name || 'Jameen'}</h4>
              <div className="did-info">DID: verifyonce:user-abc123</div>
              <div className="status-indicator">
                <span className="status-dot"></span>
                <span>Active</span>
              </div>
            </div>
          </div>
          <p><strong>Device:</strong> Desktop • Chrome</p>
          <p><strong>Last login:</strong> 2 mins ago</p>
        </div>
        
        <div className="quick-stats">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{stats.totalVerifications}</span>
              <span className="stat-label">Total Verifs</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.activeProofs}</span>
              <span className="stat-label">Active Proofs</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.privacyScore}/100</span>
              <span className="stat-label">Privacy Score</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.expiryAlerts}</span>
              <span className="stat-label">Expiry Alerts</span>
            </div>
          </div>
          <button className="btn-primary" style={{width: '100%', marginTop: '12px'}}>
            View Detailed Analytics →
          </button>
        </div>
      </div>
      
      {credentials.length > 0 && (
        <div className="primary-credential">
          <h4>🆔 Government ID (DigiLocker)</h4>
          <div className="credential-meta">
            <strong>Valid until:</strong> 12/12/2026 • <strong>Status:</strong> ✓ ACTIVE
          </div>
          <p>Contains: Name, DOB, Nationality, Address, Photo (all encrypted)</p>
          <p>Last used: 2 hours ago by Grand Hotel Mumbai</p>
          <div className="credential-actions">
            <button>View Details</button>
            <button>Generate Proof</button>
            <button>Renew</button>
          </div>
        </div>
      )}
    </div>
  );

  const CredentialVault = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h3>Credential Vault</h3>
        <div className="section-actions">
          <input type="text" placeholder="🔍 Search Credentials..." style={{width: '200px', margin: '0'}} />
          <select style={{margin: '0', padding: '8px'}}>
            <option>All Credentials</option>
            <option>Active</option>
            <option>Expiring Soon</option>
          </select>
        </div>
      </div>
      
      <div className="credential-vault">
        {credentials.map((cred, idx) => (
          <div key={idx} className="credential-card">
            <div className="credential-header">
              <div className="credential-icon">🆔</div>
              <div>
                <h4>Government ID</h4>
                <p className="text-muted">{cred.issuer}</p>
              </div>
            </div>
            <div className="credential-status">
              <span className="badge badge-success">ACTIVE</span>
            </div>
            <p><strong>Valid until:</strong> 12/12/2026</p>
            <p><strong>Last used:</strong> 2 hours ago</p>
            <div className="credential-actions">
              <button className="btn-primary">View</button>
              <button className="btn-danger">Revoke</button>
            </div>
          </div>
        ))}
        
        <div className="add-credential-card">
          <h4>📍 Address Proof</h4>
          <p className="text-muted">NPCI eKYC</p>
          <p><strong>Status:</strong> <span className="badge badge-warning">EXPIRING SOON</span></p>
          <p><strong>Valid until:</strong> 03/15/2025</p>
          <div className="credential-actions">
            <button className="btn-primary">View</button>
            <button className="btn-primary">Renew</button>
          </div>
        </div>
        
        <div className="add-credential-card" onClick={addDemoCredential}>
          <h4 style={{marginBottom: '12px'}}>🎓 Education Credential</h4>
          <p className="text-muted">Add degree or certificate</p>
          <button className="btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Credential'}
          </button>
        </div>
        
        <div className="add-credential-card">
          <h4 style={{marginBottom: '12px'}}>💼 Employment</h4>
          <p className="text-muted">Add employment verification</p>
          <button className="btn-primary">Add Credential</button>
        </div>
        
        <div className="add-credential-card">
          <h4 style={{marginBottom: '12px'}}>🏥 Health Insurance</h4>
          <p className="text-muted">Add insurance verification</p>
          <button className="btn-primary">Add Credential</button>
        </div>
        
        <div className="add-credential-card">
          <h4 style={{marginBottom: '12px'}}>🚗 Driving License</h4>
          <p className="text-muted">Add license verification</p>
          <button className="btn-primary">Add Credential</button>
        </div>
      </div>
    </div>
  );

  const LiveRequests = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h3>Live Verification Requests</h3>
      </div>
      
      <div className="live-requests">
        <div className="notification-bar">
          🔴 REAL-TIME: Grand Hotel Mumbai is requesting verification (Expires in 3:12)
        </div>
        
        <div className="active-request">
          <div className="request-header">
            <div className="request-info">
              🏨 Grand Hotel Mumbai • Request Code: VF-AB123
            </div>
            <div className="request-timer">⏱️ 3:12</div>
          </div>
          
          <div className="request-details">
            <p><strong>REQUESTING:</strong> Age Verification (YES/NO), Nationality</p>
            <p><strong>NOT SHARING:</strong> Birthdate, ID Numbers, Photo, Address</p>
          </div>
          
          <div className="request-actions">
            <button className="btn-secondary">View Full Details</button>
            <button className="btn-danger">❌ Reject</button>
            <button className="btn-success" onClick={approve}>✅ Approve</button>
          </div>
          
          {status === 'approved' && (
            <div className="status status-approved">
              ✔ Verification approved. Privacy-preserving proof generated and shared.
            </div>
          )}
          
          {status === 'error' && (
            <div className="status status-pending">
              ❌ Invalid or expired verification request.
            </div>
          )}
        </div>
        
        <div className="requests-history">
          <h4>Pending Requests History (Last 7 days)</h4>
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Verifier</th>
                <th>Request</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Today</td>
                <td>10:15</td>
                <td>HDFC Bank</td>
                <td>Identity + Address</td>
                <td><span className="badge badge-danger">❌ Rejected</span></td>
              </tr>
              <tr>
                <td>Yesterday</td>
                <td>14:20</td>
                <td>Zoomcar</td>
                <td>Age + License</td>
                <td><span className="badge badge-success">✅ Approved</span></td>
              </tr>
              <tr>
                <td>Feb 9</td>
                <td>11:30</td>
                <td>Apollo Hospitals</td>
                <td>Identity + Insurance</td>
                <td><span className="badge badge-success">✅ Approved</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ActiveProofs = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h3>Active Proofs Monitor</h3>
      </div>
      
      <div className="proofs-monitor">
        {activeProofs.length > 0 && (
          <>
            <p className="mb-16">⚠️ You have {activeProofs.length} active proof • Total exposure time: 3 minutes</p>
            
            {activeProofs.map(proof => (
              <div key={proof.id} className="active-proof">
                <div className="proof-header">
                  <div>
                    <strong>🏨 {proof.verifier}</strong>
                    <p className="text-muted">Proof ID: {proof.id}</p>
                  </div>
                  <div className="request-timer">⏱️ {formatTime(proof.timeRemaining)}</div>
                </div>
                
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: `${proof.progress}%`}}></div>
                </div>
                
                <div className="proof-meta">
                  <p><strong>Shared:</strong> {proof.attributes.join(', ')}</p>
                  <p><strong>Generated:</strong> {proof.generated} • <strong>Will expire:</strong> {proof.expires}</p>
                </div>
                
                <div className="proof-actions">
                  <button className="btn-secondary">View Details</button>
                  <button className="btn-danger">🚫 Revoke Now</button>
                  <button className="btn-primary">Extend Validity</button>
                </div>
              </div>
            ))}
          </>
        )}
        
        <div className="requests-history">
          <h4>Recently Expired Proofs</h4>
          <table className="history-table">
            <thead>
              <tr>
                <th>Proof ID</th>
                <th>Verifier</th>
                <th>Attributes</th>
                <th>Generated</th>
                <th>Expired</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>proof-xyz-789</td>
                <td>Amazon.in</td>
                <td>Age (18+)</td>
                <td>6:45 PM</td>
                <td>6:50 PM</td>
                <td><span className="badge badge-warning">⏱️ Expired</span></td>
              </tr>
              <tr>
                <td>proof-abc-456</td>
                <td>Zoomcar</td>
                <td>Age, License</td>
                <td>2:20 PM</td>
                <td>2:25 PM</td>
                <td><span className="badge badge-danger">🚫 Revoked</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ActivityLog = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h3>Verification Activity Log</h3>
      </div>
      
      <div className="activity-analytics">
        <h4>📊 Analytics Dashboard</h4>
        <div className="analytics-dashboard">
          <div className="stat-item">
            <span className="stat-value">{stats.totalVerifications}</span>
            <span className="stat-label">Total Verifications</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.approvalRate}%</span>
            <span className="stat-label">Approved Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">16%</span>
            <span className="stat-label">Rejected Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.avgResponseTime}</span>
            <span className="stat-label">Avg. Response Time</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.dataExposure}</span>
            <span className="stat-label">Data Exposure (Minutes)</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.privacyScore}/100</span>
            <span className="stat-label">Privacy Score</span>
          </div>
        </div>
        
        <h4>Detailed Activity Table</h4>
        <table className="activity-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Verifier</th>
              <th>Request Type</th>
              <th>Attributes</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activityLog.map((activity, idx) => (
              <tr key={idx}>
                <td>{activity.date}</td>
                <td>{activity.time}</td>
                <td>{activity.verifier}</td>
                <td>{activity.request}</td>
                <td>{activity.attributes}</td>
                <td>
                  <span className={`badge ${activity.status === 'approved' ? 'badge-success' : 'badge-danger'}`}>
                    {activity.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="d-flex justify-between align-center" style={{marginTop: '16px'}}>
          <div>Rows per page: 25 ▼ | 1-5 of {stats.totalVerifications}</div>
          <div className="d-flex gap-8">
            <button className="btn-secondary">◀ Previous</button>
            <button className="btn-secondary">Next ▶</button>
          </div>
        </div>
        
        <div className="d-flex gap-12" style={{marginTop: '16px'}}>
          <button className="btn-secondary">Export as CSV</button>
          <button className="btn-secondary">Export as PDF</button>
          <button className="btn-primary">Generate Activity Report</button>
        </div>
      </div>
    </div>
  );

  const SecurityDashboard = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h3>Security & Privacy Center</h3>
      </div>
      
      <div className="security-dashboard">
        <div className="security-status">
          <h4>🟢 ALL SYSTEMS SECURE</h4>
          <div style={{marginTop: '16px', textAlign: 'left'}}>
            <p>✓ Wallet bound to this device (Browser fingerprint stored)</p>
            <p>✓ Biometric authentication required for sensitive actions</p>
            <p>✓ Private key encrypted with AES-256</p>
            <p>✓ Last security audit: 2 days ago</p>
            <p>✓ No suspicious activity detected</p>
          </div>
        </div>
        
        <div className="security-grid">
          <div className="security-section">
            <h4>Active Sessions</h4>
            <table className="sessions-table">
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Location</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>🖥️ Chrome</td>
                  <td>Mumbai, IN</td>
                  <td>2 minutes ago</td>
                  <td><span className="badge badge-success">Current</span></td>
                </tr>
                <tr>
                  <td>📱 iPhone</td>
                  <td>Delhi, IN</td>
                  <td>3 hours ago</td>
                  <td><button className="btn-danger" style={{fontSize: '0.8rem', padding: '4px 8px'}}>Revoke</button></td>
                </tr>
              </tbody>
            </table>
            <button className="btn-danger" style={{marginTop: '12px', width: '100%'}}>
              Revoke All Other Sessions
            </button>
          </div>
          
          <div className="security-section">
            <h4>Security Settings</h4>
            <div style={{marginTop: '16px'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                <input type="checkbox" />
                Require 2FA for all logins
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                <input type="checkbox" defaultChecked />
                Notify on new device login
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                <input type="checkbox" defaultChecked />
                Auto-reject suspicious requests
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'}}>
                <input type="checkbox" />
                Developer mode
              </label>
              <button className="btn-primary" style={{width: '100%'}}>Save Settings</button>
            </div>
          </div>
        </div>
        
        <div className="emergency-controls">
          <h4 style={{color: '#dc2626', marginBottom: '16px'}}>🚨 Emergency Controls</h4>
          <div className="d-flex gap-12">
            <button className="emergency-btn">Revoke All Active Proofs</button>
            <button className="emergency-btn">Lock Wallet Temporarily</button>
            <button className="emergency-btn">Factory Reset Wallet</button>
          </div>
          <p style={{fontSize: '0.8rem', color: '#991b1b', marginTop: '8px'}}>
            ⚠️ These actions are irreversible and immediate
          </p>
        </div>
      </div>
    </div>
  );

  const AddCredential = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h3>Add New Credential</h3>
      </div>
      
      <div className="card">
        <h4>🔐 Quick Credential Setup</h4>
        <p>Enter the verification code shown by a business or authority to add a new credential to your wallet.</p>

        <input
          placeholder="Enter Credential Code (e.g. CR-AB123)"
          value={code}
          onChange={e => setCode(e.target.value)}
          style={{marginBottom: '16px'}}
        />

        <button className="btn-success" style={{marginRight: '12px'}} onClick={addDemoCredential} disabled={loading}>
          {loading ? 'Adding...' : '✅ Add Credential Securely'}
        </button>
        
        <button className="btn-secondary">📖 Help & Instructions</button>
        
        {status === 'approved' && (
          <div className="status status-approved">
            ✔ Credential added successfully to your wallet.
          </div>
        )}

        {status === 'error' && (
          <div className="status status-pending">
            ❌ Invalid or expired credential code.
          </div>
        )}
      </div>
      
      <div className="card">
        <h4>💡 How It Works</h4>
        <p>✔ Credentials are issued by trusted authorities only</p>
        <p>✔ VerifyOnce never creates credentials itself</p>
        <p>✔ Your data remains encrypted in your wallet</p>
        <p>✔ Only you control what information to share</p>
        <p>✔ All sharing is time-limited and revocable</p>
      </div>
    </div>
  );

  const RightSidebar = () => (
    <div className="right-sidebar">
      <div className="help-card">
        <h4>💡 Privacy Tip</h4>
        <p>Your credentials are encrypted and never leave your wallet. Only cryptographic proofs are shared.</p>
      </div>
      
      <div className="help-card">
        <h4>🔒 Security Status</h4>
        <p>All systems secure. Last security check: 2 minutes ago</p>
      </div>
      
      <div className="help-card">
        <h4>📊 Today's Activity</h4>
        <p>1 verification request approved. Your privacy score remains high at 98/100.</p>
      </div>
      
      <div className="help-card">
        <h4>⚠️ Upcoming Expiry</h4>
        <p>Your address proof expires in 30 days. Consider renewing soon.</p>
      </div>
      
      <div className="help-card">
        <h4>🆘 Need Help?</h4>
        <p>
          <a href="#" style={{color: '#0369a1'}}>View Documentation</a><br />
          <a href="#" style={{color: '#0369a1'}}>Contact Support</a><br />
          <a href="#" style={{color: '#0369a1'}}>Privacy Guide</a>
        </p>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <WalletOverview />;
      case 'credentials':
        return <CredentialVault />;
      case 'requests':
        return <LiveRequests />;
      case 'proofs':
        return <ActiveProofs />;
      case 'activity':
        return <ActivityLog />;
      case 'security':
        return <SecurityDashboard />;
      case 'add':
        return <AddCredential />;
      default:
        return <WalletOverview />;
    }
  };

  // Mobile Components with Full Functionality
  const MobileDashboardTab = () => (
    <div className="mobile-content">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-text">Welcome, {user.name || 'Jameen'}</div>
      </div>

      {/* Main Credential Card */}
      {credentials.length > 0 ? (
        <div className="credential-card-main">
          <div className="credential-header-main">
            <div className="user-avatar-main">
              {user.name?.charAt(0) || 'J'}
            </div>
            <div className="credential-info">
              <div className="credential-title">Verified Digital Credential</div>
              <div className="credential-subtitle">Identity Verified & Age 18+</div>
            </div>
            <div className="verification-badge">
              ✓ Verified
            </div>
          </div>
          <div className="credential-details">
            Expires: 12/12/2026
          </div>
          <button className="renew-btn">Renew</button>
        </div>
      ) : (
        <div className="credential-card-main">
          <div className="credential-header-main">
            <div className="user-avatar-main">
              {user.name?.charAt(0) || 'J'}
            </div>
            <div className="credential-info">
              <div className="credential-title">No Credentials Found</div>
              <div className="credential-subtitle">Add your first credential</div>
            </div>
          </div>
          <div className="credential-details">
            Credentials are issued by trusted authorities such as government, banks, or universities.
          </div>
          <button className="renew-btn" onClick={addDemoCredential} disabled={loading}>
            {loading ? 'Adding...' : 'Add Demo Credential'}
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="mobile-stats-section">
        <h3 className="section-title">📊 Quick Stats</h3>
        <div className="mobile-stats-grid">
          <div className="mobile-stat-card">
            <div className="stat-value">{stats.totalVerifications}</div>
            <div className="stat-label">Total Verifs</div>
          </div>
          <div className="mobile-stat-card">
            <div className="stat-value">{stats.activeProofs}</div>
            <div className="stat-label">Active Proofs</div>
          </div>
          <div className="mobile-stat-card">
            <div className="stat-value">{stats.privacyScore}/100</div>
            <div className="stat-label">Privacy Score</div>
          </div>
          <div className="mobile-stat-card">
            <div className="stat-value">{stats.expiryAlerts}</div>
            <div className="stat-label">Expiry Alerts</div>
          </div>
        </div>
      </div>

      {/* Live Requests */}
      {activeProofs.length > 0 && (
        <div className="mobile-section">
          <h3 className="section-title">🔴 Live Verification Request</h3>
          <div className="mobile-request-card">
            <div className="request-info">
              <div className="verifier-name">🏨 Grand Hotel Mumbai</div>
              <div className="request-code">Request Code: VF-AB123</div>
              <div className="request-timer">⏱️ 3:12 remaining</div>
            </div>
            <div className="request-details">
              <p><strong>REQUESTING:</strong> Age Verification (YES/NO), Nationality</p>
              <p><strong>NOT SHARING:</strong> Birthdate, ID Numbers, Photo</p>
            </div>
            <div className="request-actions-mobile">
              <button className="mobile-btn danger" style={{marginRight: '10px'}}>❌ Reject</button>
              <button className="mobile-btn success" onClick={approve}>✅ Approve</button>
            </div>
            {status === 'approved' && (
              <div className="mobile-status success">
                ✔ Verification approved. Privacy-preserving proof generated.
              </div>
            )}
            {status === 'error' && (
              <div className="mobile-status error">
                ❌ Invalid or expired verification request.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Grid */}
      <div className="mobile-section">
        <h3 className="section-title">🚀 Quick Actions</h3>
        <div className="action-grid">
          <div className="action-card" onClick={() => openModal('shareProof')}>
            <div className="action-icon check">
              ✓
            </div>
            <div className="action-title">Share KYC Proof</div>
            <div className="action-subtitle">Send Cryptographic Proof</div>
          </div>

          <div className="action-card" onClick={() => openModal('checkStatus')}>
            <div className="action-icon search">
              🔍
            </div>
            <div className="action-title">Check Verification Status</div>
            <div className="action-subtitle">View History</div>
          </div>

          <div className="action-card" onClick={() => setActiveTab('credentials')}>
            <div className="action-icon profile">
              📁
            </div>
            <div className="action-title">Manage Credentials</div>
            <div className="action-subtitle">View & Add Credentials</div>
          </div>

          <div className="action-card" onClick={() => setActiveTab('activity')}>
            <div className="action-icon calendar">
              📊
            </div>
            <div className="action-title">Activity & Proofs</div>
            <div className="action-subtitle">Monitor Active Proofs</div>
          </div>
        </div>
      </div>

      {/* Alert Card */}
      <div className="alert-card">
        <div className="alert-icon">
          📅
        </div>
        <div className="alert-content">
          <div className="alert-title">Your Credential Expires Soon!</div>
          <div className="alert-text">Renew your digital credential before 12/31/2025</div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <input 
          type="text" 
          className="search-box" 
          placeholder="Search credentials, requests, or activities..." 
        />
      </div>
    </div>
  );

  const MobileCredentialsTab = () => (
    <div className="mobile-content">
      <div className="mobile-section">
        <h3 className="section-title">📁 Credential Vault</h3>
        
        {/* Existing Credentials */}
        {credentials.map((cred, idx) => (
          <div key={idx} className="mobile-credential-card">
            <div className="credential-header-mobile">
              <div className="credential-icon-mobile">🆔</div>
              <div className="credential-info-mobile">
                <div className="credential-name">Government ID</div>
                <div className="credential-issuer">{cred.issuer}</div>
                <div className="credential-status">✅ ACTIVE</div>
              </div>
            </div>
            <div className="credential-meta">
              <p><strong>Valid until:</strong> 12/12/2026</p>
              <p><strong>Last used:</strong> 2 hours ago</p>
            </div>
            <div className="credential-actions-mobile">
              <button className="mobile-btn-small primary">View</button>
              <button className="mobile-btn-small secondary">Manage</button>
              <button className="mobile-btn-small danger">Revoke</button>
            </div>
          </div>
        ))}
        
        {/* Available Credentials to Add */}
        <div className="mobile-credential-card add-card">
          <div className="credential-header-mobile">
            <div className="credential-icon-mobile">📍</div>
            <div className="credential-info-mobile">
              <div className="credential-name">Address Proof</div>
              <div className="credential-issuer">NPCI eKYC</div>
              <div className="credential-status-warning">⚠️ EXPIRING SOON</div>
            </div>
          </div>
          <div className="credential-meta">
            <p><strong>Valid until:</strong> 03/15/2025</p>
          </div>
          <div className="credential-actions-mobile">
            <button className="mobile-btn-small primary">Renew</button>
          </div>
        </div>
        
        <div className="mobile-credential-card add-card" onClick={addDemoCredential}>
          <div className="credential-header-mobile">
            <div className="credential-icon-mobile">🎓</div>
            <div className="credential-info-mobile">
              <div className="credential-name">Education Credential</div>
              <div className="credential-issuer">Add degree or certificate</div>
            </div>
          </div>
          <div className="credential-actions-mobile">
            <button className="mobile-btn-small success" disabled={loading}>
              {loading ? 'Adding...' : 'Add Credential'}
            </button>
          </div>
        </div>
        
        <div className="mobile-credential-card add-card">
          <div className="credential-header-mobile">
            <div className="credential-icon-mobile">💼</div>
            <div className="credential-info-mobile">
              <div className="credential-name">Employment Verification</div>
              <div className="credential-issuer">Add employment proof</div>
            </div>
          </div>
          <div className="credential-actions-mobile">
            <button className="mobile-btn-small success">Add Credential</button>
          </div>
        </div>
        
        <div className="mobile-credential-card add-card">
          <div className="credential-header-mobile">
            <div className="credential-icon-mobile">🚗</div>
            <div className="credential-info-mobile">
              <div className="credential-name">Driving License</div>
              <div className="credential-issuer">Add license verification</div>
            </div>
          </div>
          <div className="credential-actions-mobile">
            <button className="mobile-btn-small success">Add Credential</button>
          </div>
        </div>
      </div>
      
      {/* Add New Credential Section */}
      <div className="mobile-section">
        <h3 className="section-title">➕ Add New Credential</h3>
        <div className="mobile-form-card">
          <p>Enter the verification code shown by a business or authority to add a new credential.</p>
          <input
            className="mobile-input"
            placeholder="Enter Credential Code (e.g. CR-AB123)"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <button className="mobile-btn success" onClick={addDemoCredential} disabled={loading}>
            {loading ? 'Adding...' : '✅ Add Credential Securely'}
          </button>
          
          {status === 'approved' && (
            <div className="mobile-status success">
              ✔ Credential added successfully to your wallet.
            </div>
          )}
          {status === 'error' && (
            <div className="mobile-status error">
              ❌ Invalid or expired credential code.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const MobileActivityTab = () => (
    <div className="mobile-content">
      {/* Active Proofs Monitor */}
      {activeProofs.length > 0 && (
        <div className="mobile-section">
          <h3 className="section-title">🔐 Active Proofs Monitor</h3>
          <p className="section-subtitle">⚠️ You have {activeProofs.length} active proof • Total exposure time: 3 minutes</p>
          
          {activeProofs.map(proof => (
            <div key={proof.id} className="mobile-proof-card">
              <div className="proof-header-mobile">
                <div className="proof-info">
                  <div className="proof-verifier">🏨 {proof.verifier}</div>
                  <div className="proof-id">Proof ID: {proof.id}</div>
                </div>
                <div className="proof-timer">⏱️ {Math.floor(proof.timeRemaining / 60)}:{(proof.timeRemaining % 60).toString().padStart(2, '0')}</div>
              </div>
              
              <div className="mobile-progress-bar">
                <div className="progress-fill" style={{width: `${proof.progress}%`}}></div>
              </div>
              
              <div className="proof-details-mobile">
                <p><strong>Shared:</strong> {proof.attributes.join(', ')}</p>
                <p><strong>Generated:</strong> {proof.generated} • <strong>Expires:</strong> {proof.expires}</p>
              </div>
              
              <div className="proof-actions-mobile">
                <button className="mobile-btn-small secondary">View Details</button>
                <button className="mobile-btn-small danger">🚫 Revoke Now</button>
                <button className="mobile-btn-small primary">Extend</button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Activity Analytics */}
      <div className="mobile-section">
        <h3 className="section-title">📊 Activity Analytics</h3>
        <div className="mobile-analytics-grid">
          <div className="mobile-stat-card">
            <div className="stat-value">{stats.totalVerifications}</div>
            <div className="stat-label">Total Verifications</div>
          </div>
          <div className="mobile-stat-card">
            <div className="stat-value">{stats.approvalRate}%</div>
            <div className="stat-label">Approved Rate</div>
          </div>
          <div className="mobile-stat-card">
            <div className="stat-value">{stats.avgResponseTime}</div>
            <div className="stat-label">Avg Response</div>
          </div>
          <div className="mobile-stat-card">
            <div className="stat-value">{stats.privacyScore}/100</div>
            <div className="stat-label">Privacy Score</div>
          </div>
        </div>
      </div>
      
      {/* Activity Log */}
      <div className="mobile-section">
        <h3 className="section-title">📈 Recent Activity</h3>
        {activityLog.map((activity, idx) => (
          <div key={idx} className="mobile-activity-card">
            <div className="activity-header">
              <div className="activity-time">{activity.date} {activity.time}</div>
              <div className={`activity-status ${activity.status}`}>
                {activity.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
              </div>
            </div>
            <div className="activity-details">
              <div className="activity-verifier">{activity.verifier}</div>
              <div className="activity-request">{activity.request}</div>
              <div className="activity-attributes">Attributes: {activity.attributes}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Export Options */}
      <div className="mobile-section">
        <h3 className="section-title">📤 Export Data</h3>
        <div className="export-actions">
          <button className="mobile-btn secondary">Export as CSV</button>
          <button className="mobile-btn primary">Generate Activity Report</button>
        </div>
      </div>
    </div>
  );

  const MobileSecurityTab = () => (
    <div className="mobile-content">
      {/* Security Status */}
      <div className="mobile-section">
        <h3 className="section-title">🔒 Security Status</h3>
        <div className="security-status-mobile">
          <div className="security-indicator good">
            🟢 ALL SYSTEMS SECURE
          </div>
          <div className="security-checks">
            <p>✓ Wallet bound to this device (Browser fingerprint stored)</p>
            <p>✓ Biometric authentication required for sensitive actions</p>
            <p>✓ Private key encrypted with AES-256</p>
            <p>✓ Last security audit: 2 days ago</p>
            <p>✓ No suspicious activity detected</p>
          </div>
        </div>
      </div>
      
      {/* Account Information */}
      <div className="mobile-section">
        <h3 className="section-title">👤 Account Information</h3>
        <div className="mobile-form-card">
          <div className="account-info">
            <p><strong>Name:</strong> {user.name || 'Jameen'}</p>
            <p><strong>Email:</strong> {user.email || 'jameen@example.com'}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>DID:</strong> verifyonce:user-abc123</p>
            <p><strong>Device:</strong> Desktop • Chrome</p>
            <p><strong>Last login:</strong> 2 mins ago</p>
          </div>
        </div>
      </div>
      
      {/* Active Sessions */}
      <div className="mobile-section">
        <h3 className="section-title">💻 Active Sessions</h3>
        <div className="mobile-session-card">
          <div className="session-item">
            <div className="session-info">
              <div className="session-device">🖥️ Chrome</div>
              <div className="session-location">Mumbai, IN</div>
              <div className="session-time">2 minutes ago</div>
            </div>
            <div className="session-status current">Current</div>
          </div>
          
          <div className="session-item">
            <div className="session-info">
              <div className="session-device">📱 iPhone</div>
              <div className="session-location">Delhi, IN</div>
              <div className="session-time">3 hours ago</div>
            </div>
            <button className="mobile-btn-small danger">Revoke</button>
          </div>
        </div>
        
        <button className="mobile-btn danger">Revoke All Other Sessions</button>
      </div>
      
      {/* Security Settings */}
      <div className="mobile-section">
        <h3 className="section-title">⚙️ Security Settings</h3>
        <div className="mobile-form-card">
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              <span>Require 2FA for all logins</span>
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              <span>Notify on new device login</span>
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              <span>Auto-reject suspicious requests</span>
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              <span>Developer mode</span>
            </label>
          </div>
          <button className="mobile-btn primary">Save Settings</button>
        </div>
      </div>
      
      {/* Emergency Controls */}
      <div className="mobile-section">
        <h3 className="section-title">🚨 Emergency Controls</h3>
        <div className="emergency-actions">
          <button className="mobile-btn danger">Revoke All Active Proofs</button>
          <button className="mobile-btn danger">Lock Wallet Temporarily</button>
          <button className="mobile-btn danger">Factory Reset Wallet</button>
        </div>
        <p className="warning-text">
          ⚠️ These actions are irreversible and immediate
        </p>
      </div>
    </div>
  );

  const MobileModal = () => {
    if (!showModal) return null;

    const renderModalContent = () => {
      switch (modalType) {
        case 'shareProof':
          return (
            <>
              <div className="modal-header">
                <div className="modal-title">Approve Verification Request</div>
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div>
                <p style={{marginBottom: '15px', fontSize: '0.9rem', color: '#555'}}>
                  Enter the verification code shown by a business. Review the requested information,
                  then approve to generate a proof.
                </p>
                <input
                  type="text"
                  className="mobile-input"
                  placeholder="Enter Verification Code (e.g. VF-AB123)"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                />
                <button className="mobile-btn success" onClick={approve}>
                  Approve Securely
                </button>
                <button className="mobile-btn secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                {status === 'approved' && (
                  <div className="mobile-status success">
                    ✓ Verification approved. Privacy-preserving proof generated and shared.
                  </div>
                )}
                {status === 'error' && (
                  <div className="mobile-status error">
                    ✗ Invalid or expired verification request.
                  </div>
                )}
              </div>
            </>
          );
        case 'checkStatus':
          return (
            <>
              <div className="modal-header">
                <div className="modal-title">Verification Status</div>
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div>
                <div style={{padding: '15px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '15px'}}>
                  <strong>Current Status: Active</strong>
                  <p style={{fontSize: '0.85rem', color: '#555', marginTop: '5px'}}>
                    Your credential is verified and ready to use for secure proofs.
                  </p>
                </div>
              </div>
            </>
          );
        case 'viewInfo':
          return (
            <>
              <div className="modal-header">
                <div className="modal-title">My Information</div>
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div>
                <div style={{padding: '15px', background: '#e3f2fd', borderRadius: '8px', marginBottom: '15px'}}>
                  <strong>Privacy Protected</strong>
                  <p style={{fontSize: '0.85rem', color: '#0d47a1', marginTop: '5px'}}>
                    Your personal information is encrypted and never shared directly.
                  </p>
                </div>
              </div>
            </>
          );
        case 'liveness':
          return (
            <>
              <div className="modal-header">
                <div className="modal-title">Liveness Check</div>
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div>
                <div style={{textAlign: 'center', padding: '20px'}}>
                  <div style={{fontSize: '3rem', marginBottom: '15px'}}>
                    📷
                  </div>
                  <p style={{marginBottom: '15px', color: '#555'}}>
                    Liveness check helps verify that you're physically present when making sensitive changes.
                  </p>
                  <button className="mobile-btn primary">
                    Start Liveness Check
                  </button>
                </div>
              </div>
            </>
          );
        case 'revoke':
          return (
            <>
              <div className="modal-header">
                <div className="modal-title">Revoke Credential</div>
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div>
                <div style={{padding: '15px', background: '#ffebee', borderRadius: '8px', marginBottom: '15px'}}>
                  <strong>Warning</strong>
                  <p style={{fontSize: '0.85rem', color: '#c62828', marginTop: '5px'}}>
                    Revoking your credential will permanently disable it. This action cannot be undone.
                  </p>
                </div>
                <button className="mobile-btn danger">
                  Confirm Revocation
                </button>
                <button className="mobile-btn secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div className="mobile-modal">
        <div className="modal-content">
          {renderModalContent()}
        </div>
      </div>
    );
  };

  const renderMobileTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MobileDashboardTab />;
      case 'credentials':
        return <MobileCredentialsTab />;
      case 'activity':
        return <MobileActivityTab />;
      case 'security':
        return <MobileSecurityTab />;
      default:
        return <MobileDashboardTab />;
    }
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="mobile-dashboard">
        <div className="mobile-container">
          <div className="mobile-header">
            <div className="mobile-title">
              VerifyOnce
            </div>
            <div className="notification-icon">
              🔔
              <div className="notification-dot"></div>
            </div>
          </div>

          {renderMobileTabContent()}

          <div className="bottom-nav">
            <div 
              className={`nav-item-bottom ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="nav-icon-bottom">
                🏠
              </div>
              <div className="nav-label">{mobileContent.navigation.dashboard}</div>
            </div>
            <div 
              className={`nav-item-bottom ${activeTab === 'credentials' ? 'active' : ''}`}
              onClick={() => setActiveTab('credentials')}
            >
              <div className="nav-icon-bottom">
                📁
              </div>
              <div className="nav-label">{mobileContent.navigation.credentials}</div>
            </div>
            <div 
              className={`nav-item-bottom ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <div className="nav-icon-bottom">
                📊
              </div>
              <div className="nav-label">{mobileContent.navigation.activity}</div>
            </div>
            <div 
              className={`nav-item-bottom ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <div className="nav-icon-bottom">
                🔒
              </div>
              <div className="nav-label">{mobileContent.navigation.security}</div>
            </div>
          </div>

          <MobileModal />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="dashboard-layout desktop-only">
        <TopNavbar />
        <LeftSidebar />
        <div className="main-dashboard">
          {renderMainContent()}
        </div>
        <RightSidebar />
      </div>
    </>
  );
}
