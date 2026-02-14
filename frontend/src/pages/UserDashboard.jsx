import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';
import './UserDashboard.mobile.css';

// Extract AddCredential as separate component to prevent remounting
const AddCredentialComponent = ({ credentialForm, message, messageType, loading, handleCredentialInputChange, submitCredential, setActiveSection }) => (
  <div className="dashboard-section">
    <div className="section-header">
      <h3>Add Your Identity Credential</h3>
    </div>
    
    <div style={{ background: '#f0f7ff', padding: '12px', borderRadius: '6px', marginBottom: '16px', borderLeft: '4px solid #3b82f6' }}>
      <strong>🔐 Secure Process:</strong> Verify your identity once. Your data is encrypted and stays in your wallet. You control what information to share with each business.
    </div>

    <div className="card">
      <h4><i className="bi bi-file-earmark-pdf-fill"></i> Identity Verification</h4>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Enter your details to create your identity credential. This is required before you can verify with hotels, banks, and other services.</p>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Credential Type *</label>
        <select
          value={credentialForm.type}
          onChange={(e) => handleCredentialInputChange('type', e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '2px solid #3b82f6',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            color: '#1f2937',
            cursor: 'pointer',
            fontWeight: '500',
            boxSizing: 'border-box'
          }}
        >
          <option value="government_id">Government ID</option>
          <option value="passport">Passport</option>
          <option value="aadhaar">Aadhaar</option>
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Full Name *</label>
        <input
          type="text"
          placeholder="Your full name"
          value={credentialForm.fullName}
          onChange={(e) => handleCredentialInputChange('fullName', e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Date of Birth *</label>
        <input
          type="date"
          value={credentialForm.dateOfBirth}
          onChange={(e) => handleCredentialInputChange('dateOfBirth', e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        <small style={{ color: '#666' }}>Used to calculate age for verifications</small>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Nationality *</label>
        <select
          value={credentialForm.nationality}
          onChange={(e) => handleCredentialInputChange('nationality', e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '2px solid #3b82f6',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            color: '#1f2937',
            cursor: 'pointer',
            fontWeight: '500',
            boxSizing: 'border-box'
          }}
        >
          <option value="Indian">Indian</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Last 4 digits of Aadhaar *</label>
        <input
          type="text"
          placeholder="e.g., 1234"
          maxLength="4"
          value={credentialForm.aadhaarLast4}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, '');
            handleCredentialInputChange('aadhaarLast4', val);
          }}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        <small style={{ color: '#666' }}>Never shared - only kept for verification records</small>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Address *</label>
        <textarea
          placeholder="Your residential address"
          value={credentialForm.address}
          onChange={(e) => handleCredentialInputChange('address', e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            minHeight: '80px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {message && (
        <div style={{
          padding: '12px 14px',
          borderRadius: '6px',
          marginBottom: '16px',
          backgroundColor: messageType === 'error' ? '#fee2e2' : '#f0fdf4',
          color: messageType === 'error' ? '#dc2626' : '#166534',
          border: `1px solid ${messageType === 'error' ? '#fca5a5' : '#86efac'}`,
          fontSize: '14px'
        }}>
          {message}
        </div>
      )}

      <button
        onClick={submitCredential}
        disabled={loading}
        className="btn-success"
        style={{
          marginRight: '12px',
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '⏳ Verifying...' : <><i className="bi bi-check-circle-fill"></i> Create Credential</>}
      </button>

      <button
        onClick={() => setActiveSection('credentials')}
        className="btn-secondary"
        disabled={loading}
      >
        <i className="bi bi-arrow-left"></i> Back
      </button>
    </div>
    
    <div className="card">
      <h4><i className="bi bi-shield-fill-check"></i> How Your Credential Works</h4>
      <ul style={{ paddingLeft: '20px', color: '#666', fontSize: '14px' }}>
        <li style={{ marginBottom: '8px' }}><i className="bi bi-check-circle-fill"></i> <strong>One-time setup:</strong> Verify your identity once in VerifyOnce</li>
        <li style={{ marginBottom: '8px' }}><i className="bi bi-check-circle-fill"></i> <strong>Privacy first:</strong> Your full details stay encrypted in your wallet</li>
        <li style={{ marginBottom: '8px' }}><i className="bi bi-check-circle-fill"></i> <strong>Minimal sharing:</strong> Hotels only see "Yes, 18+" not your birthdate</li>
        <li style={{ marginBottom: '8px' }}><i className="bi bi-check-circle-fill"></i> <strong>Time-limited proofs:</strong> Shared data expires in 3 minutes automatically</li>
        <li><i className="bi bi-check-circle-fill"></i> <strong>Full control:</strong> Approve each request, revoke anytime</li>
      </ul>
    </div>

    <div className="card" style={{ background: '#f9fafb' }}>
      <h4><i className="bi bi-lock-fill"></i> Your Data is Safe</h4>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
        ✓ Data encrypted at rest and in transit (AES-256)<br />
        ✓ No private keys ever sent to servers<br />
        ✓ Zero-knowledge proofs used for verification<br />
        ✓ Automatic deletion after expiry<br />
        ✓ GDPR compliant - you own your data
      </p>
    </div>
  </div>
);

export default function UserDashboard() {
  const navigate = useNavigate();
  const verificationInputRef = useRef(null);
  const isTypingRef = useRef(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [requestDetails, setRequestDetails] = useState(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [activeProofsData, setActiveProofsData] = useState([]);
  const [countdownTimers, setCountdownTimers] = useState({});
  const [credentialForm, setCredentialForm] = useState({
    type: 'government_id',
    fullName: '',
    dateOfBirth: '',
    nationality: 'Indian',
    aadhaarLast4: '',
    address: ''
  });
  const [selectedCredentialId, setSelectedCredentialId] = useState(null);
  const [viewingCredential, setViewingCredential] = useState(null);
  const [showCredentialModal, setShowCredentialModal] = useState(false);
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
      fetchVerificationHistory(storedToken);
      fetchActiveProofs(storedToken);
    }
  }, []);

  // Refresh credentials when actively viewing credentials section
  useEffect(() => {
    if (token && (activeSection === 'credentials' || activeSection === 'dashboard')) {
      fetchCredentials(token);
    }
  }, [activeSection, token]);

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Skip updates if user is actively typing to prevent focus loss
      if (isTypingRef.current) {
        return;
      }
      
      setCountdownTimers((prev) => {
        const updated = { ...prev };
        let hasActive = false;

        // Update request timer
        if (requestDetails && requestDetails.expiresAt) {
          const remaining = Math.max(0, new Date(requestDetails.expiresAt) - new Date());
          if (remaining > 0) {
            updated.request = remaining;
            hasActive = true;
          } else {
            updated.request = 0;
          }
        }

        // Update proof timers
        activeProofsData.forEach((proof) => {
          const remaining = Math.max(0, new Date(proof.expiresAt) - new Date());
          if (remaining > 0) {
            updated[proof.proofId] = remaining;
            hasActive = true;
          } else {
            updated[proof.proofId] = 0;
          }
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [requestDetails, activeProofsData]);

  const fetchCredentials = async (authToken) => {
    try {
      const res = await axios.get('http://localhost:5000/api/credentials', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.data.success && res.data.credentials) {
        console.log('✅ Credentials fetched:', res.data.credentials);
        setCredentials(res.data.credentials);
      } else {
        console.log('⚠️ No credentials in response');
        setCredentials([]);
      }
    } catch (err) {
      console.error('❌ Error fetching credentials:', err.message);
      if (err.response?.status === 401) {
        console.error('Authentication failed - token may be expired');
        handleLogout();
      } else {
        setCredentials([]);
      }
    }
  };

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.clear(); // Clear any other cached data
    
    // Clear axios default headers if any
    delete axios.defaults.headers.common['Authorization'];
    
    // Force page reload to clear all state
    window.location.href = '/login';
  };

  const fetchVerificationHistory = async (authToken) => {
    try {
      const res = await axios.get('http://localhost:5000/api/verification/history', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      // Filter only pending requests
      const pending = res.data.filter(v => v.status === 'pending');
      setPendingRequests(pending);
    } catch (err) {
      console.error('Error fetching verification history:', err);
    }
  };

  const fetchActiveProofs = async (authToken) => {
    try {
      const res = await axios.get('http://localhost:5000/api/verification/my-proofs', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.data.success) {
        setActiveProofsData(res.data.proofs || []);
      }
    } catch (err) {
      console.error('Error fetching proofs:', err);
    }
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

  const getRequestDetails = async (requestId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/verification/request/${requestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      console.error('Error fetching request details:', err);
      return null;
    }
  };

  const approve = async () => {
    if (!requestDetails) {
      setStatus('error');
      setMessage('Please select a request first');
      return;
    }

    if (!selectedCredentialId) {
      setStatus('error');
      setMessageType('error');
      setMessage('❌ Please select a credential to use for verification');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const approvalRes = await axios.post(
        `http://localhost:5000/api/verification/approve/${requestDetails.requestId}`,
        { credentialId: selectedCredentialId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (approvalRes.data.success) {
        setStatus('approved');
        setMessageType('success');
        setMessage('✅ Verification approved! Proof shared with verifier.');
        setCode('');
        setRequestDetails(null);
        setShowRequestDetails(false);
        fetchActiveProofs(token);
        setTimeout(() => {
          setStatus('');
          setMessage('');
        }, 3000);
      }
    } catch (err) {
      setStatus('error');
      setMessageType('error');
      const errorMsg = err.response?.data?.message || 'Failed to approve request';
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const rejectRequest = async () => {
    if (!requestDetails) {
      setStatus('error');
      setMessage('Please select a request first');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const rejectRes = await axios.post(
        `http://localhost:5000/api/verification/reject/${requestDetails.requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (rejectRes.data.success) {
        setStatus('rejected');
        setMessageType('error');
        setMessage('❌ Verification request rejected.');
        setCode('');
        setRequestDetails(null);
        setShowRequestDetails(false);
        setTimeout(() => {
          setStatus('');
          setMessage('');
        }, 3000);
      }
    } catch (err) {
      setStatus('error');
      setMessageType('error');
      const errorMsg = err.response?.data?.message || 'Failed to reject request';
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const revokeProof = async (proofId) => {
    setLoading(true);
    try {
      const revokeRes = await axios.post(
        `http://localhost:5000/api/verification/proofs/revoke/${proofId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (revokeRes.data.success) {
        setMessage('✅ Proof revoked successfully');
        setMessageType('success');
        setStatus('revoked');
        fetchActiveProofs(token);
        setTimeout(() => {
          setStatus('');
          setMessage('');
        }, 3000);
      }
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Failed to revoke proof'}`);
      setMessageType('error');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleShowRequestDetails = async () => {
    if (!code.trim()) {
      setStatus('error');
      setMessage('Please enter a verification code');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await axios.get(
        `http://localhost:5000/api/verification/request/${code}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        setRequestDetails(res.data.request);
        setShowRequestDetails(true);
        setStatus('');
        setMessage('');
      }
    } catch (err) {
      setStatus('error');
      setMessageType('error');
      const errorMsg = err.response?.data?.message || 'Verification request not found or expired';
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const deny = async () => {
    if (!requestDetails) {
      setStatus('error');
      setMessage('Please select a request first');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const rejectRes = await axios.post(
        `http://localhost:5000/api/verification/reject/${requestDetails.requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (rejectRes.data.success) {
        setStatus('rejected');
        setMessageType('error');
        setMessage('❌ Verification request rejected.');
        setCode('');
        setRequestDetails(null);
        setShowRequestDetails(false);
        setTimeout(() => {
          setStatus('');
          setMessage('');
        }, 3000);
      }
    } catch (err) {
      setStatus('error');
      setMessageType('error');
      const errorMsg = err.response?.data?.message || 'Failed to reject request';
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
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
          <i className="bi bi-search search-icon"></i>
          <input type="text" placeholder="Search credentials, requests, or activities..." />
        </div>
      </div>
      <div className="navbar-right">
        <div className="notification-badge">
          <i className="bi bi-bell-fill"></i>
          <span className="notification-count">{notifications.length}</span>
        </div>
        <div className="user-menu">
          <div className="user-avatar">{user.name?.charAt(0) || 'J'}</div>
          <span>{user.name || 'Jameen'}</span>
        </div>
        <button className="p-8" title="Settings"><i className="bi bi-gear-fill"></i></button>
        <button className="p-8" title="Help"><i className="bi bi-question-circle-fill"></i></button>
        <button className="p-8" onClick={handleLogout} title="Logout"><i className="bi bi-box-arrow-right"></i></button>
      </div>
    </div>
  );

  const LeftSidebar = () => (
    <div className={`left-sidebar ${sidebarOpen ? 'open' : ''}`}>
      <ul className="sidebar-nav">
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`} 
             onClick={() => setActiveSection('dashboard')}>
            <i className="bi bi-house-door-fill nav-icon"></i>
            <span>Dashboard</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'credentials' ? 'active' : ''}`}
             onClick={() => setActiveSection('credentials')}>
            <i className="bi bi-folder-fill nav-icon"></i>
            <span>Credentials</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'requests' ? 'active' : ''}`}
             onClick={() => setActiveSection('requests')}>
            <i className="bi bi-inbox-fill nav-icon"></i>
            <span>Verification Requests</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'proofs' ? 'active' : ''}`}
             onClick={() => setActiveSection('proofs')}>
            <i className="bi bi-shield-lock-fill nav-icon"></i>
            <span>Active Proofs</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'activity' ? 'active' : ''}`}
             onClick={() => setActiveSection('activity')}>
            <i className="bi bi-graph-up nav-icon"></i>
            <span>Activity Log</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'security' ? 'active' : ''}`}
             onClick={() => setActiveSection('security')}>
            <i className="bi bi-shield-fill-check nav-icon"></i>
            <span>Security</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'add' ? 'active' : ''}`}
             onClick={() => setActiveSection('add')}>
            <i className="bi bi-plus-circle-fill nav-icon"></i>
            <span>Add Credential</span>
          </a>
        </li>
      </ul>
      
      <div className="sidebar-section">
        <div className="section-title">Quick Actions</div>
        <div className="quick-actions">
          <button className="btn-danger quick-action-btn"><i className="bi bi-exclamation-triangle-fill"></i> Emergency Revoke</button>
          <button className="btn-secondary quick-action-btn"><i className="bi bi-lock-fill"></i> Lock Wallet</button>
          <button className="btn-secondary quick-action-btn"><i className="bi bi-download"></i> Export Logs</button>
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
            View Detailed Analytics <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
      
      {credentials.length > 0 && (
        <div className="primary-credential">
          <h4><i className="bi bi-person-badge-fill"></i> Government ID (DigiLocker)</h4>
          <div className="credential-meta">
            <strong>Valid until:</strong> 12/12/2026 • <strong>Status:</strong> <i className="bi bi-check-circle-fill text-success"></i> ACTIVE
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
        <h3>🔐 Credential Vault</h3>
        <button
          onClick={() => setActiveSection('add')}
          style={{
            padding: '10px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          + Add New Credential
        </button>
      </div>

      {messageType === 'success' && message && (
        <div style={{
          padding: '14px 16px',
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '8px',
          marginBottom: '16px',
          color: '#166534',
          fontWeight: '500',
          fontSize: '14px'
        }}>
          {message}
        </div>
      )}
      
      {credentials && credentials.length > 0 ? (
        <div className="credential-vault" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {credentials.map((cred) => (
            <div key={cred._id} style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px', color: '#1f2937', fontSize: '15px', fontWeight: '600', textTransform: 'capitalize' }}>
                    {cred.type.replace(/_/g, ' ')}
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>{cred.issuer}</p>
                </div>
                <span style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: '600',
                  borderRadius: '4px',
                  background: cred.isActive ? '#d1fae5' : '#fee2e2',
                  color: cred.isActive ? '#065f46' : '#991b1b'
                }}>
                  {cred.isActive ? '✓ ACTIVE' : '✗ INACTIVE'}
                </span>
              </div>

              <div style={{ padding: '12px 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', marginBottom: '12px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Full Name: </span>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>{cred.fullName}</span>
                </div>
                {cred.nationality && (
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Nationality: </span>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>{cred.nationality}</span>
                  </div>
                )}
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Verified: </span>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#10b981' }}>Yes</span>
                </div>
              </div>

              <div style={{ marginBottom: '12px', fontSize: '12px', color: '#6b7280' }}>
                <strong>Valid until:</strong> {new Date(cred.validUntil).toLocaleDateString()}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => viewCredential(cred._id)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '12px',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#2563eb'}
                  onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                >
                  👁️ View
                </button>
                <button 
                  onClick={() => revokeCredential(cred._id)}
                  disabled={!cred.isActive}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: cred.isActive ? '#fee2e2' : '#f3f4f6',
                    color: cred.isActive ? '#991b1b' : '#9ca3af',
                    border: `1px solid ${cred.isActive ? '#fecaca' : '#e5e7eb'}`,
                    borderRadius: '6px',
                    cursor: cred.isActive ? 'pointer' : 'not-allowed',
                    fontWeight: '500',
                    fontSize: '12px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (cred.isActive) {
                      e.target.style.background = '#fca5a5';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (cred.isActive) {
                      e.target.style.background = '#fee2e2';
                    }
                  }}
                >
                  🗑️ Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: '#fef9e7',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
          padding: '32px 24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔑</div>
          <h4 style={{ margin: '0 0 8px', color: '#1f2937' }}>No Credentials Yet</h4>
          <p style={{ margin: '0 0 16px', color: '#6b7280', fontSize: '14px' }}>
            Create your first identity credential to start using VerifyOnce
          </p>
          <button
            onClick={() => setActiveSection('add')}
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            + Create Credential
          </button>
        </div>
      )}

      {/* Credential Detail Modal */}
      {showCredentialModal && viewingCredential && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, color: '#1f2937' }}>Credential Details</h3>
              <button
                onClick={() => {
                  setShowCredentialModal(false);
                  setViewingCredential(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>CREDENTIAL TYPE</label>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937', textTransform: 'capitalize' }}>
                  {viewingCredential.type.replace(/_/g, ' ')}
                </p>
              </div>

              <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>ISSUER</label>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{viewingCredential.issuer}</p>
              </div>

              <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>FULL NAME</label>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{viewingCredential.fullName}</p>
              </div>

              {viewingCredential.dateOfBirth && (
                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>DATE OF BIRTH</label>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                    {new Date(viewingCredential.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
              )}

              {viewingCredential.nationality && (
                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>NATIONALITY</label>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{viewingCredential.nationality}</p>
                </div>
              )}

              {viewingCredential.address && (
                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>ADDRESS</label>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#1f2937', lineHeight: '1.6' }}>{viewingCredential.address}</p>
                </div>
              )}

              <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>STATUS</label>
                <p style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  fontWeight: '600',
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: viewingCredential.isActive ? '#d1fae5' : '#fee2e2',
                  color: viewingCredential.isActive ? '#065f46' : '#991b1b',
                  borderRadius: '4px'
                }}>
                  {viewingCredential.isActive ? '✓ ACTIVE' : '✗ REVOKED'}
                </p>
              </div>

              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                <strong>Valid until:</strong> {new Date(viewingCredential.validUntil).toLocaleDateString()}<br />
                <strong>Verified on:</strong> {new Date(viewingCredential.verifiedAt).toLocaleDateString()}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowCredentialModal(false);
                  setViewingCredential(null);
                }}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: '#e5e7eb',
                  color: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Close
              </button>
              {viewingCredential.isActive && (
                <button
                  onClick={() => {
                    revokeCredential(viewingCredential._id);
                    setShowCredentialModal(false);
                    setViewingCredential(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  🗑️ Revoke Credential
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const LiveRequests = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h3>📝 Verify Requests</h3>
      </div>
      
      <div style={{
        background: '#f0f7ff',
        padding: '24px',
        borderRadius: '12px',
        border: '2px solid #3b82f6',
        marginBottom: '24px'
      }}>
        <p style={{ marginBottom: '16px', color: '#1f2937', fontSize: '14px' }}>
          Enter the <strong>verification code</strong> provided by a business to approve their verification request.
        </p>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', position: 'relative', zIndex: 100 }}>
          <input
            ref={verificationInputRef}
            type="text"
            className="verification-code-input"
            placeholder="Enter Verification Code (e.g., VF-QWCZM2)"
            value={code}
            onFocus={() => {
              isTypingRef.current = true;
            }}
            onBlur={() => {
              // Delay clearing the typing flag to allow for button clicks
              setTimeout(() => {
                isTypingRef.current = false;
              }, 100);
            }}
            onChange={(e) => {
              const newCode = e.target.value.toUpperCase();
              setCode(newCode);
              // Only clear messages if there were previous messages
              if (status || message) {
                setStatus('');
                setMessage('');
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const pastedText = e.clipboardData.getData('text').toUpperCase();
              setCode(pastedText);
              if (status || message) {
                setStatus('');
                setMessage('');
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && code.trim()) {
                handleShowRequestDetails();
              }
            }}
            style={{
              flex: 1,
              padding: '12px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'monospace',
              fontWeight: '500',
              pointerEvents: 'auto',
              userSelect: 'text',
              cursor: 'text',
              WebkitUserSelect: 'text',
              MozUserSelect: 'text',
              msUserSelect: 'text',
              background: '#FFFFFF',
              color: '#1f2937',
              position: 'relative',
              zIndex: 101
            }}
            maxLength="11"
            autoComplete="off"
            spellCheck="false"
            readOnly={false}
            disabled={false}
          />
          <button
            className="view-details-btn"
            onClick={handleShowRequestDetails}
            disabled={!code || loading}
            style={{
              padding: '12px 28px',
              background: code && !loading ? '#3b82f6' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: code && !loading ? 'pointer' : 'not-allowed',
              fontWeight: '600',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            {loading ? '⏳ Loading...' : '📋 View Details'}
          </button>
        </div>

        {message && (
          <div style={{
            padding: '12px 14px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '16px',
            backgroundColor: messageType === 'error' ? '#fee2e2' : '#f0fdf4',
            color: messageType === 'error' ? '#dc2626' : '#166534',
            border: `1px solid ${messageType === 'error' ? '#fca5a5' : '#86efac'}`
          }}>
            {message}
          </div>
        )}

        {/* Show Request Details Card */}
        {showRequestDetails && requestDetails && (
          <div style={{
            background: 'white',
            border: '2px solid #0284c7',
            borderRadius: '12px',
            padding: '24px',
            marginTop: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#1f2937', fontSize: '20px' }}>📋 Verification Request Details</h3>
              <button
                onClick={() => {
                  setShowRequestDetails(false);
                  setRequestDetails(null);
                }}
                style={{
                  background: '#e5e7eb',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                ✕ Close
              </button>
            </div>

            {/* Who is asking */}
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <h4 style={{ color: '#0284c7', marginBottom: '12px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>
                👤 Verification Request from
              </h4>
              <div style={{
                background: '#f0f7ff',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #bfdbfe'
              }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                  {requestDetails.businessName}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                  Request ID: <code style={{ fontFamily: 'monospace', fontWeight: '600' }}>{requestDetails.requestId}</code>
                </div>
              </div>
            </div>

            {/* What data they're requesting */}
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <h4 style={{ color: '#0284c7', marginBottom: '12px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>
                📊 Will Be Shared
              </h4>
              <div style={{
                background: '#f0fdf4',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #86efac'
              }}>
                {requestDetails.requestedData && requestDetails.requestedData.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none' }}>
                    {requestDetails.requestedData.map((item, idx) => (
                      <li key={idx} style={{ padding: '8px 0', color: '#166534', fontWeight: '500' }}>
                        ✓ {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ color: '#6b7280' }}>No specific data</div>
                )}
              </div>
            </div>

            {/* What won't be shared */}
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <h4 style={{ color: '#dc2626', marginBottom: '12px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>
                🔒 Will NOT Be Shared
              </h4>
              <div style={{
                background: '#fee2e2',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #fecaca'
              }}>
                <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none' }}>
                  <li style={{ padding: '6px 0', color: '#991b1b', fontWeight: '500' }}>✗ Your exact date of birth</li>
                  <li style={{ padding: '6px 0', color: '#991b1b', fontWeight: '500' }}>✗ Your ID number</li>
                  <li style={{ padding: '6px 0', color: '#991b1b', fontWeight: '500' }}>✗ Your document copies</li>
                  {requestDetails.requestedData && !requestDetails.requestedData.includes('address') && (
                    <li style={{ padding: '6px 0', color: '#991b1b', fontWeight: '500' }}>✗ Your address (not requested)</li>
                  )}
                  {requestDetails.requestedData && !requestDetails.requestedData.includes('nationality') && (
                    <li style={{ padding: '6px 0', color: '#991b1b', fontWeight: '500' }}>✗ Your nationality (not requested)</li>
                  )}
                  {requestDetails.requestedData && !requestDetails.requestedData.includes('fullName') && (
                    <li style={{ padding: '6px 0', color: '#991b1b', fontWeight: '500' }}>✗ Your full name (not requested)</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Time Information */}
            <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <h4 style={{ color: '#0284c7', marginBottom: '12px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>
                ⏱️ Expires In
              </h4>
              <div style={{
                background: '#fef2f2',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #fecaca'
              }}>
                <div style={{ fontSize: '16px', color: '#991b1b', fontWeight: '600' }}>
                  {new Date(requestDetails.expiresAt).toLocaleTimeString()} today
                </div>
                <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>
                  Act now! This request will expire soon.
                </div>
              </div>
            </div>
            {/* Credential Selection */}
            <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <h4 style={{ color: '#0284c7', marginBottom: '12px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>
                🔐 Select Credential to Use
              </h4>
              {credentials && credentials.length > 0 ? (
                <div style={{
                  background: '#f0f7ff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #bfdbfe'
                }}>
                  <div style={{ marginBottom: '12px', fontSize: '13px', color: '#0284c7', fontWeight: '600' }}>
                    Your Available Credentials:
                  </div>
                  <select
                    value={selectedCredentialId || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedCredentialId(val);
                      if (val) {
                        setMessage('✓ Credential selected');
                        setMessageType('success');
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '2px solid #3b82f6',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      marginBottom: '12px',
                      fontWeight: '500',
                      appearance: 'none',
                      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%273b82f6%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 10px center',
                      backgroundSize: '20px',
                      paddingRight: '40px'
                    }}
                  >
                    <option value="">-- Select a credential --</option>
                    {credentials.map((cred) => (
                      <option key={cred._id} value={cred._id}>
                        {cred.type.replace(/_/g, ' ')}: {cred.issuer} - {cred.fullName} ({cred.isActive ? 'Active' : 'Inactive'})
                      </option>
                    ))}
                  </select>
                  {selectedCredentialId && (
                    <div style={{
                      padding: '12px 14px',
                      background: '#f0fdf4',
                      border: '1px solid #86efac',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#166534',
                      fontWeight: '500'
                    }}>
                      ✓ Credential selected and ready for verification!
                    </div>
                  )}
                  {!selectedCredentialId && requestDetails && (
                    <div style={{
                      padding: '12px 14px',
                      background: '#fef3c7',
                      border: '1px solid #fcd34d',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#92400e'
                    }}>
                      ℹ️ Please select a credential from the dropdown to proceed with verification
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  background: '#fee2e2',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  fontSize: '14px'
                }}>
                  ⚠️ You don't have any credentials yet. <br />
                  <button
                    onClick={() => setActiveSection('add')}
                    style={{
                      marginTop: '8px',
                      padding: '8px 16px',
                      background: '#991b1b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '13px'
                    }}
                  >
                    Go to "Add Credential"
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={approve}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  background: loading ? '#d1d5db' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '15px'
                }}
              >
                {loading ? '⏳ Approving...' : '✅ Approve Request'}
              </button>
              <button
                onClick={deny}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  background: loading ? '#d1d5db' : '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '15px'
                }}
              >
                {loading ? '⏳ Rejecting...' : '❌ Reject Request'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Verification History - Move down */}
      {!showRequestDetails && (
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ marginBottom: '12px', color: '#1f2937' }}>📋 Pending Requests</h4>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #e5e7eb'
          }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>Verifier</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>Purpose</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>Code</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>Expires</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((request, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>{request.businessName}</td>
                  <td style={{ padding: '12px' }}>{request.purpose}</td>
                  <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: '600' }}>{request.requestId}</td>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#6b7280' }}>
                    {new Date(request.expiresAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const ActiveProofs = () => {
    const getDataTypeLabel = (dataType) => {
      const labels = {
        ageVerified: 'Age Verified',
        age: 'Current Age',
        nationality: 'Nationality',
        fullName: 'Full Name',
        address: 'Address',
        identityVerified: 'Identity'
      };
      return labels[dataType] || dataType;
    };

    const formatSharedData = (sharedData) => {
      if (!sharedData) return [];
      const items = [];
      for (const [key, value] of Object.entries(sharedData)) {
        if (value !== null && value !== undefined && value !== false) {
          if (key === 'ageVerified') {
            items.push(`Age Verified: ${value ? '✓ Yes (18+)' : '✗ No'}`);
          } else if (key === 'age') {
            items.push(`Age: ${value} years`);
          } else if (key === 'nationality') {
            items.push(`Nationality: ${value}`);
          } else if (key === 'fullName') {
            items.push(`Full Name: ${value}`);
          } else if (key === 'address') {
            items.push(`Address: ${value}`);
          } else if (key === 'identityVerified') {
            items.push(`Identity: ✓ Verified`);
          }
        }
      }
      return items;
    };

    return (
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Your Active Proofs</h3>
        </div>
        
        {activeProofsData.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            background: '#f3f4f6',
            borderRadius: '8px',
            color: '#666'
          }}>
            <p>No active proofs. You haven't approved any requests yet.</p>
          </div>
        ) : (
          <div className="proofs-list">
            {activeProofsData.map((proof) => {
              const remaining = countdownTimers[proof.proofId] || 0;
              const minutes = Math.floor(remaining / 60000);
              const seconds = Math.floor((remaining % 60000) / 1000);
              const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

              return (
                <div key={proof.proofId} style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#111' }}>
                        {proof.businessName}
                      </h4>
                      <p style={{ margin: '0', fontSize: '0.85rem', color: '#666' }}>
                        Proof ID: {proof.proofId}
                      </p>
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: remaining > 60000 ? '#10b981' : remaining > 30000 ? '#f59e0b' : '#ef4444',
                      textAlign: 'right'
                    }}>
                      {timeString}
                    </div>
                  </div>

                  <div style={{
                    background: '#f9fafb',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ fontSize: '0.9rem', color: '#374151', fontWeight: '500', marginBottom: '8px' }}>
                      DATA SHARED:
                    </div>
                    {formatSharedData(proof.sharedData).map((item, idx) => (
                      <div key={idx} style={{ fontSize: '0.85rem', color: '#555', marginBottom: '4px' }}>
                        • {item}
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '12px' }}>
                    Created: {new Date(proof.createdAt).toLocaleTimeString()}
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure? ${proof.businessName} will lose access immediately.`)) {
                        revokeProof(proof.proofId);
                      }
                    }}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: loading ? '#d1d5db' : '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    {loading ? '⏳' : '🔒 Revoke Proof'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const ActivityLog = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h3>Verification Activity Log</h3>
      </div>
      
      <div className="activity-analytics">
        <h4><i className="bi bi-graph-up"></i> Analytics Dashboard</h4>
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
                    {activity.status === 'approved' ? <><i className="bi bi-check-circle-fill"></i> Approved</> : <><i className="bi bi-x-circle-fill"></i> Rejected</>}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="d-flex justify-between align-center" style={{marginTop: '16px'}}>
          <div>Rows per page: 25 ▼ | 1-5 of {stats.totalVerifications}</div>
          <div className="d-flex gap-8">
            <button className="btn-secondary"><i className="bi bi-chevron-left"></i> Previous</button>
            <button className="btn-secondary">Next <i className="bi bi-chevron-right"></i></button>
          </div>
        </div>
        
        <div className="d-flex gap-12" style={{marginTop: '16px'}}>
          <button className="btn-secondary"><i className="bi bi-file-earmark-spreadsheet"></i> Export as CSV</button>
          <button className="btn-secondary"><i className="bi bi-file-earmark-pdf"></i> Export as PDF</button>
          <button className="btn-primary"><i className="bi bi-file-earmark-text"></i> Generate Activity Report</button>
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
          <h4><i className="bi bi-shield-fill-check"></i> ALL SYSTEMS SECURE</h4>
          <div style={{marginTop: '16px', textAlign: 'left'}}>
            <p><i className="bi bi-check-circle-fill"></i> Wallet bound to this device (Browser fingerprint stored)</p>
            <p><i className="bi bi-check-circle-fill"></i> Biometric authentication required for sensitive actions</p>
            <p><i className="bi bi-check-circle-fill"></i> Private key encrypted with AES-256</p>
            <p><i className="bi bi-check-circle-fill"></i> Last security audit: 2 days ago</p>
            <p><i className="bi bi-check-circle-fill"></i> No suspicious activity detected</p>
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
                  <td><i className="bi bi-display"></i> Chrome</td>
                  <td>Mumbai, IN</td>
                  <td>2 minutes ago</td>
                  <td><span className="badge badge-success">Current</span></td>
                </tr>
                <tr>
                  <td><i className="bi bi-phone"></i> iPhone</td>
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
          <h4 style={{color: '#dc2626', marginBottom: '16px'}}><i className="bi bi-exclamation-triangle-fill"></i> Emergency Controls</h4>
          <div className="d-flex gap-12">
            <button className="emergency-btn">Revoke All Active Proofs</button>
            <button className="emergency-btn">Lock Wallet Temporarily</button>
            <button className="emergency-btn">Factory Reset Wallet</button>
          </div>
          <p style={{fontSize: '0.8rem', color: '#991b1b', marginTop: '8px'}}>
            <i className="bi bi-exclamation-triangle-fill"></i> These actions are irreversible and immediate
          </p>
        </div>
      </div>
    </div>
  );

  const handleCredentialInputChange = (field, value) => {
    setCredentialForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitCredential = async () => {
    // Validation
    if (!credentialForm.fullName || !credentialForm.dateOfBirth || !credentialForm.aadhaarLast4 || !credentialForm.address) {
      setMessage('❌ Please fill in all required fields');
      setMessageType('error');
      return;
    }

    // Validate DOB is in the past
    const dob = new Date(credentialForm.dateOfBirth);
    if (dob > new Date()) {
      setMessage('❌ Date of birth cannot be in the future');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/credentials/create',
        {
          type: credentialForm.type,
          fullName: credentialForm.fullName,
          dateOfBirth: credentialForm.dateOfBirth,
          nationality: credentialForm.nationality,
          aadhaarLast4: credentialForm.aadhaarLast4,
          address: credentialForm.address
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessage('✅ Credential verified and added to your wallet!');
        setMessageType('success');
        // Reset form and refresh credentials list
        setCredentialForm({
          type: 'government_id',
          fullName: '',
          dateOfBirth: '',
          nationality: 'Indian',
          aadhaarLast4: '',
          address: ''
        });
        setSelectedCredentialId(null);
        // Refresh credentials immediately (use token directly from closure)
        const authToken = localStorage.getItem('token');
        if (authToken) {
          const credRes = await axios.get('http://localhost:5000/api/credentials', {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          if (credRes.data.success && credRes.data.credentials) {
            setCredentials(credRes.data.credentials);
          }
        }
        setTimeout(() => {
          setActiveSection('credentials');
        }, 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setMessage(`❌ ${errorMsg}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const viewCredential = async (credentialId) => {
    try {
      const authToken = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/credentials/${credentialId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (res.data.success) {
        setViewingCredential(res.data.credential);
        setShowCredentialModal(true);
      }
    } catch (err) {
      setMessage(`❌ Failed to load credential: ${err.message}`);
      setMessageType('error');
    }
  };

  const revokeCredential = async (credentialId) => {
    if (!window.confirm('Are you sure you want to revoke this credential? You will not be able to use it for verifications.')) {
      return;
    }

    setLoading(true);
    try {
      const authToken = localStorage.getItem('token');
      const res = await axios.delete(
        `http://localhost:5000/api/credentials/${credentialId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (res.data.success) {
        setMessage('✅ Credential revoked successfully');
        setMessageType('success');
        // Refresh credentials
        const credRes = await axios.get('http://localhost:5000/api/credentials', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (credRes.data.success && credRes.data.credentials) {
          setCredentials(credRes.data.credentials);
        }
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (err) {
      setMessage(`❌ Failed to revoke credential: ${err.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

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
        return <AddCredentialComponent credentialForm={credentialForm} message={message} messageType={messageType} loading={loading} handleCredentialInputChange={handleCredentialInputChange} submitCredential={submitCredential} setActiveSection={setActiveSection} />;
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

      {/* Quick Approval Section */}
      <div style={{ background: '#f0f7ff', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '2px solid #3b82f6' }}>
        <div style={{ fontSize: '12px', color: '#0284c7', marginBottom: '8px', fontWeight: 'bold' }}>🔵 VERIFY REQUEST</div>
        <p style={{ fontSize: '12px', color: '#0369a1', marginBottom: '12px' }}>Enter verification code from a business</p>
        <div style={{ display: 'flex', gap: '8px', position: 'relative', zIndex: 100 }}>
          <input
            type="text"
            className="verification-code-input"
            placeholder="Enter code (e.g. VF-QWCZM2)"
            value={code}
            onChange={e => {
              setCode(e.target.value.toUpperCase());
              setStatus('');
              setMessage('');
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && code.trim()) {
                handleShowRequestDetails();
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.currentTarget.focus();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            style={{ 
              flex: 1, 
              padding: '10px 12px', 
              border: '1px solid #ddd', 
              borderRadius: '6px', 
              fontSize: '14px', 
              fontFamily: 'monospace', 
              fontWeight: '500',
              pointerEvents: 'auto',
              userSelect: 'text',
              cursor: 'text',
              WebkitUserSelect: 'text',
              MozUserSelect: 'text',
              msUserSelect: 'text',
              background: '#FFFFFF',
              color: '#1f2937',
              position: 'relative',
              zIndex: 101
            }}
            maxLength="11"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            onClick={handleShowRequestDetails}
            disabled={!code || loading}
            style={{ padding: '10px 12px', background: code && !loading ? '#3b82f6' : '#ccc', color: 'white', border: 'none', borderRadius: '6px', cursor: code && !loading ? 'pointer' : 'not-allowed', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}
          >
            {loading ? '⏳' : '📋'}
          </button>
        </div>
        {message && (
          <div style={{ fontSize: '12px', marginTop: '10px', padding: '8px 10px', borderRadius: '4px', backgroundColor: messageType === 'error' ? '#fee2e2' : '#f0fdf4', color: messageType === 'error' ? '#dc2626' : '#10b981', fontWeight: '500' }}>
            {message}
          </div>
        )}
      </div>

      {/* Show Request Details for Mobile */}
      {showRequestDetails && requestDetails && (
        <div style={{
          background: 'white',
          border: '2px solid #0284c7',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: '#1f2937', fontSize: '16px' }}>📋 Details</h3>
            <button
              onClick={() => {
                setShowRequestDetails(false);
                setRequestDetails(null);
              }}
              style={{
                background: '#e5e7eb',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600', marginBottom: '4px' }}>FROM</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#1f2937' }}>
              {requestDetails.businessName}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600', marginBottom: '4px' }}>PURPOSE</div>
            <div style={{ fontSize: '13px', color: '#374151' }}>
              {requestDetails.purpose || 'Verification'}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600', marginBottom: '4px' }}>REQUESTING</div>
            <div style={{ fontSize: '12px', color: '#374151' }}>
              {requestDetails.requestedData && requestDetails.requestedData.length > 0 ? (
                requestDetails.requestedData.map((item, idx) => (
                  <div key={idx}>✓ {item.field && typeof item.field === 'string' ? item.field.charAt(0).toUpperCase() + item.field.slice(1) : 'Unknown field'}</div>
                ))
              ) : (
                'No specific data'
              )}
            </div>
          </div>

          <div style={{ marginBottom: '16px', padding: '10px', background: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca' }}>
            <div style={{ fontSize: '11px', color: '#991b1b', fontWeight: '600' }}>EXPIRES</div>
            <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: '500' }}>
              {new Date(requestDetails.expiresAt).toLocaleTimeString()}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={approve}
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px',
                background: loading ? '#d1d5db' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '13px'
              }}
            >
              {loading ? '⏳' : '✅ Approve'}
            </button>
            <button
              onClick={deny}
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px',
                background: loading ? '#d1d5db' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '13px'
              }}
            >
              {loading ? '⏳' : '❌ Reject'}
            </button>
          </div>
        </div>
      )}

      {/* Main Credential Card - Hide when showing details */}
      {!showRequestDetails && (
        <>
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
        </>
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
                  className="mobile-input verification-code-input"
                  placeholder="Enter Verification Code (e.g. VF-AB123)"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  style={{
                    pointerEvents: 'auto',
                    userSelect: 'text',
                    cursor: 'text',
                    WebkitUserSelect: 'text',
                    MozUserSelect: 'text',
                    msUserSelect: 'text',
                    background: '#FFFFFF',
                    color: '#1f2937'
                  }}
                  maxLength="11"
                  autoComplete="off"
                  spellCheck="false"
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
            <div className="mobile-header-actions">
              <div className="notification-icon">
                🔔
                <div className="notification-dot"></div>
              </div>
              <button className="mobile-logout-btn" onClick={handleLogout} title="Logout">
                🚪
              </button>
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
      <div className="desktop-only">
        {/* TOP NAVBAR */}
        <div className="top-navbar">
          <div className="navbar-left">
            <a href="#" className="navbar-logo">VerifyOnce</a>
            <div className="navbar-search">
              <i className="bi bi-search search-icon"></i>
              <input type="text" placeholder="Search credentials, requests, or activities..." />
            </div>
          </div>
          <div className="navbar-right">
            <div className="notification-badge">
              <i className="bi bi-bell-fill"></i>
              <span className="notification-count">{notifications.length}</span>
            </div>
            <div className="user-menu">
              <div className="user-avatar">{user.name?.charAt(0) || 'J'}</div>
              <span>{user.name || 'Jameen'}</span>
            </div>
            <button className="p-8" title="Settings"><i className="bi bi-gear-fill"></i></button>
            <button className="p-8" title="Help"><i className="bi bi-question-circle-fill"></i></button>
            <button className="p-8" onClick={handleLogout} title="Logout"><i className="bi bi-box-arrow-right"></i></button>
          </div>
        </div>

        {/* APP LAYOUT - 3 COLUMN GRID */}
        <div className="app-layout">
          {/* LEFT SIDEBAR - 25% */}
          <aside className="sidebar">
            <ul className="sidebar-nav">
              <li className="nav-item">
                <a href="#" className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`} 
                   onClick={() => setActiveSection('dashboard')}>
                  <i className="bi bi-house-door-fill nav-icon"></i>
                  <span>Dashboard</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className={`nav-link ${activeSection === 'credentials' ? 'active' : ''}`}
                   onClick={() => setActiveSection('credentials')}>
                  <i className="bi bi-folder-fill nav-icon"></i>
                  <span>Credentials</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className={`nav-link ${activeSection === 'requests' ? 'active' : ''}`}
                   onClick={() => setActiveSection('requests')}>
                  <i className="bi bi-inbox-fill nav-icon"></i>
                  <span>Verification Requests</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className={`nav-link ${activeSection === 'proofs' ? 'active' : ''}`}
                   onClick={() => setActiveSection('proofs')}>
                  <i className="bi bi-shield-lock-fill nav-icon"></i>
                  <span>Active Proofs</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className={`nav-link ${activeSection === 'activity' ? 'active' : ''}`}
                   onClick={() => setActiveSection('activity')}>
                  <i className="bi bi-graph-up nav-icon"></i>
                  <span>Activity Log</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className={`nav-link ${activeSection === 'security' ? 'active' : ''}`}
                   onClick={() => setActiveSection('security')}>
                  <i className="bi bi-shield-fill-check nav-icon"></i>
                  <span>Security</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className={`nav-link ${activeSection === 'add' ? 'active' : ''}`}
                   onClick={() => setActiveSection('add')}>
                  <i className="bi bi-plus-circle-fill nav-icon"></i>
                  <span>Add Credential</span>
                </a>
              </li>
            </ul>
            
            <div className="sidebar-section">
              <div className="section-title">Quick Actions</div>
              <div className="quick-actions">
                <button className="btn-danger quick-action-btn"><i className="bi bi-exclamation-triangle-fill"></i> Emergency Revoke</button>
                <button className="btn-secondary quick-action-btn"><i className="bi bi-lock-fill"></i> Lock Wallet</button>
                <button className="btn-secondary quick-action-btn"><i className="bi bi-download"></i> Export Logs</button>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT - 60% */}
          <main className="main-content">
            {renderMainContent()}
          </main>

          {/* RIGHT PANEL - 15% */}
          <section className="right-panel">
            <div className="help-card">
              <h4><i className="bi bi-lightbulb-fill"></i> Privacy Tip</h4>
              <p>Your credentials are encrypted and never leave your wallet. Only cryptographic proofs are shared.</p>
            </div>
            
            <div className="help-card">
              <h4><i className="bi bi-shield-fill-check"></i> Security Status</h4>
              <p>All systems secure. Last security check: 2 minutes ago</p>
            </div>
            
            <div className="help-card">
              <h4><i className="bi bi-graph-up"></i> Today's Activity</h4>
              <p>1 verification request approved. Your privacy score remains high at 98/100.</p>
            </div>
            
            <div className="help-card">
              <h4><i className="bi bi-exclamation-triangle-fill"></i> Upcoming Expiry</h4>
              <p>Your address proof expires in 30 days. Consider renewing soon.</p>
            </div>
            
            <div className="help-card">
              <h4><i className="bi bi-question-circle-fill"></i> Need Help?</h4>
              <p>
                <a href="#" style={{color: '#0369a1'}}>View Documentation</a><br />
                <a href="#" style={{color: '#0369a1'}}>Contact Support</a><br />
                <a href="#" style={{color: '#0369a1'}}>Privacy Guide</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
