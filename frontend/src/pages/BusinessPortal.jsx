import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/business/BusinessPortal.css';
import VerifierOverview from '../components/business/VerifierOverview';
import RequestBuilder from '../components/business/RequestBuilder';
import LiveMonitor from '../components/business/LiveMonitor';
import ResultsDashboard from '../components/business/ResultsDashboard';
import HistoryAnalytics from '../components/business/HistoryAnalytics';
import ComplianceCenter from '../components/business/ComplianceCenter';
import IntegrationHub from '../components/business/IntegrationHub';
import Settings from '../components/business/Settings';
import StatusChecker from '../components/business/StatusChecker';
import VerifyRequestCode from '../components/business/VerifyRequestCode';

export default function BusinessPortal() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [token, setToken] = useState('');
  const [organizationData, setOrganizationData] = useState({
    name: 'Grand Hotel Mumbai',
    verifierId: 'hotel-taj-123',
    status: 'authorized',
    industry: 'Hospitality',
    since: 'Jan 1, 2025'
  });
  const [metrics, setMetrics] = useState({
    todayRequests: 47,
    activeProofs: 2,
    successRate: 89,
    avgTime: 8
  });
  const [showRequestBuilder, setShowRequestBuilder] = useState(false);
  const [notifications, setNotifications] = useState(8);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if first-time user
    const isFirstTime = window.history.state?.usr?.firstTime;
    if (isFirstTime) {
      setShowWelcome(true);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, []);

  useEffect(() => {
    // Get token from localStorage (ProtectedRoute ensures correct role)
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

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

  const navItems = [
    { id: 'dashboard', icon: 'house-door-fill', label: 'Dashboard' },
    { id: 'verify', icon: 'pencil-square', label: 'Verify Request Code' },
    { id: 'active', icon: 'hourglass-split', label: 'Active Requests' },
    { id: 'check', icon: 'search', label: 'Check Status' },
    { id: 'results', icon: 'check-circle-fill', label: 'Verification Results' },
    { id: 'history', icon: 'bar-chart-fill', label: 'History & Analytics' },
    { id: 'compliance', icon: 'shield-fill-check', label: 'Compliance Center' },
    { id: 'integrations', icon: 'graph-up', label: 'API & Integrations' },
    { id: 'settings', icon: 'gear-fill', label: 'Settings' }
  ];

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard':
        return <VerifierOverview 
          organizationData={organizationData} 
          metrics={metrics}
          onCreateRequest={() => setShowRequestBuilder(true)}
          onViewAnalytics={() => setActiveView('history')}
          onViewCompliance={() => setActiveView('compliance')}
          onViewSettings={() => setActiveView('settings')}
        />;
      case 'verify':
        return <VerifyRequestCode token={token} />;
      case 'active':
        return <LiveMonitor token={token} />;
      case 'check':
        return <StatusChecker token={token} />;
      case 'results':
        return <ResultsDashboard token={token} />;
      case 'history':
        return <HistoryAnalytics token={token} />;
      case 'compliance':
        return <ComplianceCenter />;
      case 'integrations':
        return <IntegrationHub />;
      case 'settings':
        return <Settings organizationData={organizationData} />;
      default:
        return <VerifierOverview 
          organizationData={organizationData} 
          metrics={metrics}
          onCreateRequest={() => setShowRequestBuilder(true)}
          onViewAnalytics={() => setActiveView('history')}
          onViewCompliance={() => setActiveView('compliance')}
          onViewSettings={() => setActiveView('settings')}
        />;
    }
  };

  return (
    <div className="business-portal">
      {/* WELCOME MESSAGE FOR NEW VERIFIERS */}
      {showWelcome && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: 'white',
            padding: 40,
            borderRadius: 12,
            maxWidth: 500,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}><i className="bi bi-trophy-fill"></i></div>
            <h2 style={{ marginBottom: 15 }}>Welcome to VerifyOnce!</h2>
            <p style={{ marginBottom: 25, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Your organization has been successfully registered as a verifier.
              Create your first verification request to begin verifying users
              without collecting or storing identity documents.
            </p>
            <button
              className="btn-primary"
              onClick={() => {
                setShowWelcome(false);
                setShowRequestBuilder(true);
              }}
              style={{ marginRight: 10 }}
            >
              Create First Request
            </button>
            <button
              className="btn-secondary"
              onClick={() => setShowWelcome(false)}
            >
              Explore Dashboard
            </button>
          </div>
        </div>
      )}

      {/* TOP NAVBAR */}
      <div className="bp-navbar">
        <div className="bp-navbar-left">
          <span className="bp-logo">VerifyOnce Verifier</span>
          <div className="bp-search">
            <input type="text" placeholder="Search requests..." />
          </div>
        </div>
        <div className="bp-navbar-right">
          <div className="bp-notification-badge">
            <i className="bi bi-bell-fill"></i> <span className="badge">{notifications}</span>
          </div>
          <div className="bp-org-name"><i className="bi bi-building"></i> {organizationData.name}</div>
          <div className="bp-user"><i className="bi bi-person-fill"></i> Admin User</div>
          <button className="bp-icon-btn" title="Settings"><i className="bi bi-gear-fill"></i></button>
          <button className="bp-icon-btn" title="Help"><i className="bi bi-question-circle-fill"></i></button>
          <button className="bp-audit-btn"><i className="bi bi-search"></i> Audit</button>
          <button className="bp-icon-btn" onClick={handleLogout} title="Logout"><i className="bi bi-box-arrow-right"></i></button>
        </div>
      </div>

      <div className="bp-main">
        {/* LEFT SIDEBAR */}
        <div className="bp-sidebar">
          <div className="bp-nav">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`bp-nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => setActiveView(item.id)}
              >
                <span className="bp-nav-icon"><i className={`bi bi-${item.icon}`}></i></span>
                <span className="bp-nav-label">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="bp-sidebar-footer">
            <div className="bp-quick-actions">
              <div className="bp-quick-title">Quick Actions</div>
              <button className="bp-quick-btn" onClick={() => setShowRequestBuilder(true)}>
                <i className="bi bi-plus-circle-fill"></i> Create Request
              </button>
              <button className="bp-quick-btn" onClick={() => setActiveView('compliance')}>
                <i className="bi bi-upload"></i> Export Compliance
              </button>
              <button className="bp-quick-btn" onClick={() => setActiveView('active')}>
                <i className="bi bi-arrow-repeat"></i> Batch Verification
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="bp-content">
          {renderContent()}
        </div>

        {/* RIGHT SIDEBAR - COMPLIANCE STATUS */}
        <div className="bp-right-sidebar">
          <div className="bp-compliance-card">
            <div className="bp-compliance-score">
              <div className="bp-score-label">Compliance Score</div>
              <div className="bp-score-value">100/100 <i className="bi bi-check-circle-fill text-success"></i></div>
            </div>
            <div className="bp-compliance-text">
              <div className="bp-compliance-item">Zero PII Stored</div>
              <div className="bp-compliance-item">GDPR Compliant</div>
            </div>
          </div>
        </div>
      </div>

      {/* REQUEST BUILDER MODAL - Always render as modal when showRequestBuilder is true */}
      {showRequestBuilder && (
        <RequestBuilder 
          token={token}
          onClose={() => setShowRequestBuilder(false)}
          organizationName={organizationData.name}
        />
      )}
    </div>
  );
}
