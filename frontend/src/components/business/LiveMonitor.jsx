import { useState, useEffect } from 'react';
import axios from 'axios';

export default function LiveMonitor({ token }) {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load verification requests
    loadRequests();
    // Poll every 3 seconds for updates
    const interval = setInterval(loadRequests, 3000);
    return () => clearInterval(interval);
  }, [token]);

  const loadRequests = async () => {
    if (!token) return;
    try {
      // This would fetch all requests - for demo, we'll use mock data
      setRequests([
        {
          id: 'VF-AB124',
          guest: '#101',
          attributes: 'Age+Nationality',
          status: 'PENDING',
          timeRemaining: '4:52',
          createdAt: new Date(Date.now() - 8000)
        },
        {
          id: 'VF-AB125',
          guest: '#102',
          attributes: 'Age+Name',
          status: 'PENDING',
          timeRemaining: '4:15',
          createdAt: new Date(Date.now() - 45000)
        },
        {
          id: 'VF-AB123',
          guest: '#100',
          attributes: 'Age+Nationality',
          status: 'VIEWED',
          timeRemaining: '2:18',
          createdAt: new Date(Date.now() - 162000)
        },
        {
          id: 'VF-AB120',
          guest: '#99',
          attributes: 'Age+Nationality',
          status: 'APPROVED',
          timeRemaining: null,
          createdAt: new Date(Date.now() - 320000)
        },
        {
          id: 'VF-AB121',
          guest: '#100',
          attributes: 'Age+Name',
          status: 'APPROVED',
          timeRemaining: null,
          createdAt: new Date(Date.now() - 280000)
        },
        {
          id: 'VF-AB119',
          guest: '#98',
          attributes: 'Age+Nationality',
          status: 'REJECTED',
          timeRemaining: null,
          createdAt: new Date(Date.now() - 360000)
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load requests:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return '#f59e0b';
      case 'VIEWED': return '#3b82f6';
      case 'APPROVED': return '#10b981';
      case 'REJECTED': return '#ef4444';
      case 'EXPIRED': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return '⏳';
      case 'VIEWED': return '👁️';
      case 'APPROVED': return '✅';
      case 'REJECTED': return '❌';
      case 'EXPIRED': return '⌛';
      default: return '❓';
    }
  };

  const filterByStatus = (status) => {
    return requests.filter(r => r.status === status);
  };

  if (loading) {
    return <div className="bp-loading">Loading verification requests...</div>;
  }

  return (
    <div className="live-monitor">
      <h1 className="bp-page-title">Live Verification Monitor</h1>

      {/* ALERT BAR */}
      <div className="bp-alert-bar">
        🔴 REAL-TIME: New request {requests[0]?.id} created by Front Desk • Waiting for user approval
      </div>

      {/* KANBAN BOARD */}
      <div className="bp-kanban-board">
        {/* PENDING COLUMN */}
        <div className="bp-kanban-column">
          <div className="bp-kanban-header" style={{backgroundColor: '#f59e0b'}}>
            <span>PENDING</span>
            <span className="bp-kanban-count">({filterByStatus('PENDING').length})</span>
          </div>
          <div className="bp-kanban-content">
            {filterByStatus('PENDING').map(req => (
              <div 
                key={req.id} 
                className="bp-kanban-card"
                onClick={() => setSelectedRequest(req)}
              >
                <div className="bp-kanban-card-id">{req.id}</div>
                <div className="bp-kanban-card-guest">Guest {req.guest}</div>
                <div className="bp-kanban-card-attrs">{req.attributes}</div>
                <div className="bp-kanban-card-time">⏱️ {req.timeRemaining}</div>
              </div>
            ))}
          </div>
        </div>

        {/* VIEWED COLUMN */}
        <div className="bp-kanban-column">
          <div className="bp-kanban-header" style={{backgroundColor: '#3b82f6'}}>
            <span>VIEWED</span>
            <span className="bp-kanban-count">({filterByStatus('VIEWED').length})</span>
          </div>
          <div className="bp-kanban-content">
            {filterByStatus('VIEWED').map(req => (
              <div 
                key={req.id} 
                className="bp-kanban-card"
                onClick={() => setSelectedRequest(req)}
              >
                <div className="bp-kanban-card-id">{req.id}</div>
                <div className="bp-kanban-card-guest">Guest {req.guest}</div>
                <div className="bp-kanban-card-attrs">{req.attributes}</div>
                <div className="bp-kanban-card-time">⏱️ {req.timeRemaining}</div>
              </div>
            ))}
          </div>
        </div>

        {/* APPROVED COLUMN */}
        <div className="bp-kanban-column">
          <div className="bp-kanban-header" style={{backgroundColor: '#10b981'}}>
            <span>APPROVED</span>
            <span className="bp-kanban-count">({filterByStatus('APPROVED').length})</span>
          </div>
          <div className="bp-kanban-content">
            {filterByStatus('APPROVED').map(req => (
              <div 
                key={req.id} 
                className="bp-kanban-card"
                onClick={() => setSelectedRequest(req)}
              >
                <div className="bp-kanban-card-id">{req.id}</div>
                <div className="bp-kanban-card-guest">Guest {req.guest}</div>
                <div className="bp-kanban-card-attrs">{req.attributes}</div>
                <div className="bp-kanban-card-status">✅</div>
              </div>
            ))}
          </div>
        </div>

        {/* REJECTED COLUMN */}
        <div className="bp-kanban-column">
          <div className="bp-kanban-header" style={{backgroundColor: '#ef4444'}}>
            <span>REJECTED</span>
            <span className="bp-kanban-count">({filterByStatus('REJECTED').length})</span>
          </div>
          <div className="bp-kanban-content">
            {filterByStatus('REJECTED').map(req => (
              <div 
                key={req.id} 
                className="bp-kanban-card"
                onClick={() => setSelectedRequest(req)}
              >
                <div className="bp-kanban-card-id">{req.id}</div>
                <div className="bp-kanban-card-guest">Guest {req.guest}</div>
                <div className="bp-kanban-card-attrs">{req.attributes}</div>
                <div className="bp-kanban-card-status">❌</div>
              </div>
            ))}
          </div>
        </div>

        {/* EXPIRED COLUMN */}
        <div className="bp-kanban-column">
          <div className="bp-kanban-header" style={{backgroundColor: '#6b7280'}}>
            <span>EXPIRED</span>
            <span className="bp-kanban-count">({filterByStatus('EXPIRED').length})</span>
          </div>
          <div className="bp-kanban-content">
            {filterByStatus('EXPIRED').length === 0 && (
              <div className="bp-kanban-empty">No expired requests</div>
            )}
          </div>
        </div>
      </div>

      {/* REQUEST DETAIL SLIDE-OUT PANEL */}
      {selectedRequest && (
        <div className="bp-slideout-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="bp-slideout-panel" onClick={(e) => e.stopPropagation()}>
            <div className="bp-slideout-header">
              <h3>Request: {selectedRequest.id}</h3>
              <button className="bp-slideout-close" onClick={() => setSelectedRequest(null)}>✕</button>
            </div>

            <div className="bp-slideout-body">
              <div className="bp-detail-section">
                <div className="bp-detail-badge" style={{backgroundColor: getStatusColor(selectedRequest.status)}}>
                  {getStatusIcon(selectedRequest.status)} {selectedRequest.status}
                </div>
              </div>

              <div className="bp-detail-section">
                <div className="bp-detail-label">Purpose</div>
                <div className="bp-detail-value">Hotel Check-In (Front Desk)</div>
              </div>

              <div className="bp-detail-section">
                <div className="bp-detail-label">Created By</div>
                <div className="bp-detail-value">Desk Agent John • Lobby Terminal #3</div>
              </div>

              <div className="bp-detail-section">
                <div className="bp-detail-label">Attributes Requested</div>
                <div className="bp-detail-value">{selectedRequest.attributes}</div>
              </div>

              <div className="bp-detail-section">
                <div className="bp-detail-label">Privacy Mode</div>
                <div className="bp-detail-value">Zero-Knowledge</div>
              </div>

              {selectedRequest.status === 'VIEWED' && (
                <div className="bp-detail-section">
                  <div className="bp-status-message">
                    👁️ User is reviewing request in VerifyOnce wallet
                  </div>
                  <div className="bp-expected-time">
                    Expected: Approval within 2 minutes (based on historical data)
                  </div>
                </div>
              )}

              <div className="bp-detail-section">
                <h4>Sharing Options</h4>
                <div className="bp-share-grid">
                  <button className="bp-btn bp-btn-secondary bp-btn-small">📱 Show QR</button>
                  <button className="bp-btn bp-btn-secondary bp-btn-small">📋 Copy Code</button>
                  <button className="bp-btn bp-btn-secondary bp-btn-small">📧 Send Link</button>
                </div>
              </div>

              <div className="bp-detail-actions">
                <button className="bp-btn bp-btn-secondary">🔔 Resend Notification</button>
                <button className="bp-btn bp-btn-secondary">⏰ Extend Expiry</button>
                <button className="bp-btn bp-btn-danger">✕ Cancel Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
