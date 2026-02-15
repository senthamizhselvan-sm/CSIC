import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VerifierDashboard.css';
import API_URL from '../config/api';

export default function VerifierDashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [verifier, setVerifier] = useState(null);
  const [activeTab, setActiveTab] = useState('create');
  const [requestedData, setRequestedData] = useState(['age']);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser.role !== 'verifier') {
        navigate('/login');
        return;
      }
      setToken(storedToken);
      setVerifier(storedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleDataType = (dataType) => {
    setRequestedData((prev) => {
      if (prev.includes(dataType)) {
        return prev.filter(d => d !== dataType);
      } else {
        return [...prev, dataType];
      }
    });
  };

  const createRequest = async () => {
    if (requestedData.length === 0) {
      setMessage('Please select at least one data type');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(
        '${API_URL}/api/verifications/create',
        { requestedData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const requestData = res.data.data;
        // Calculate minutes until expiry
        const expiresAt = new Date(requestData.expiresAt);
        const now = new Date();
        const minutesLeft = Math.ceil((expiresAt - now) / 60000);
        
        setCurrentRequest({
          ...requestData,
          expiresInMinutes: minutesLeft > 0 ? minutesLeft : 0
        });
        setMessage('✓ Request created successfully');
        setMessageType('success');
        setActiveTab('check');
      }
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Failed to create request'}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const [proofData, setProofData] = useState(null);

  const checkStatus = async () => {
    if (!currentRequest) {
      setMessage('Enter a request code first');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setProofData(null);

    try {
      const res = await axios.get(
        `${API_URL}/api/verifications/status/${currentRequest.requestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        if (res.data.status === 'pending') {
          setMessage('⏳ Waiting for user approval');
          setMessageType('info');
        } else if (res.data.status === 'approved') {
          setMessage('✓ Request approved! User shared their data.');
          setMessageType('success');
          if (res.data.proof) {
            setProofData(res.data.proof);
          }
        } else {
          setMessage(`Request ${res.data.status}`);
          setMessageType('info');
        }
      }
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Failed to check status'}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  if (!verifier) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="verifier-dashboard">
      {/* Header */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>
          VerifyOnce - Business Dashboard
        </h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>{verifier.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{verifier.businessName}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <button
            onClick={() => setActiveTab('create')}
            style={{
              padding: '12px 16px',
              background: activeTab === 'create' ? '#3b82f6' : 'transparent',
              color: activeTab === 'create' ? 'white' : '#666',
              border: 'none',
              borderRadius: '4px 4px 0 0',
              cursor: 'pointer',
              fontWeight: activeTab === 'create' ? '600' : '400'
            }}
          >
            Create Request
          </button>
          <button
            onClick={() => setActiveTab('check')}
            style={{
              padding: '12px 16px',
              background: activeTab === 'check' ? '#3b82f6' : 'transparent',
              color: activeTab === 'check' ? 'white' : '#666',
              border: 'none',
              borderRadius: '4px 4px 0 0',
              cursor: 'pointer',
              fontWeight: activeTab === 'check' ? '600' : '400'
            }}
          >
            Check Status
          </button>
        </div>

        {/* Create Request Tab */}
        {activeTab === 'create' && (
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '24px'
          }}>
            <h2 style={{ marginTop: 0, color: '#1f2937' }}>Create Verification Request</h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              Select what you need to verify from the user
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>
                What would you like to verify?
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {['age', 'nationality', 'identity', 'address'].map((type) => (
                  <label key={type} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: requestedData.includes(type) ? '#dbeafe' : 'white'
                  }}>
                    <input
                      type="checkbox"
                      checked={requestedData.includes(type)}
                      onChange={() => toggleDataType(type)}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>
                      {type === 'age' ? 'Age (18+)'
                        : type === 'nationality' ? 'Nationality'
                        : type === 'identity' ? 'Identity Verification'
                        : 'Address'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {message && (
              <div style={{
                padding: '12px 14px',
                borderRadius: '6px',
                marginBottom: '16px',
                backgroundColor: messageType === 'error' ? '#fee2e2' : messageType === 'success' ? '#f0fdf4' : '#eff6ff',
                color: messageType === 'error' ? '#dc2626' : messageType === 'success' ? '#166534' : '#0284c7',
                border: `1px solid ${messageType === 'error' ? '#fca5a5' : messageType === 'success' ? '#86efac' : '#bfdbfe'}`
              }}>
                {message}
              </div>
            )}

            <button
              onClick={createRequest}
              disabled={loading || requestedData.length === 0}
              style={{
                padding: '12px 24px',
                background: loading || requestedData.length === 0 ? '#d1d5db' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              {loading ? '⏳ Creating...' : '📋 Create Request'}
            </button>
          </div>
        )}

        {/* Check Status Tab */}
        {activeTab === 'check' && (
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '24px'
          }}>
            <h2 style={{ marginTop: 0, color: '#1f2937' }}>Check Request Status</h2>

            {currentRequest ? (
              <>
                <div style={{
                  background: '#f0f7ff',
                  border: '2px solid #3b82f6',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: '600' }}>
                      REQUEST CODE
                    </div>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#1f2937',
                      fontFamily: 'monospace',
                      marginTop: '4px'
                    }}>
                      {currentRequest.requestId}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentRequest.requestId);
                        setMessage('✓ Code copied to clipboard');
                        setMessageType('success');
                      }}
                      style={{
                        marginTop: '8px',
                        padding: '6px 12px',
                        background: '#e5e7eb',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      Copy Code
                    </button>
                  </div>

                  <div style={{ marginBottom: '12px', paddingTop: '12px', borderTop: '1px solid #bfdbfe' }}>
                    <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: '600' }}>
                      Expires in: {currentRequest.expiresInMinutes}:00
                    </div>
                  </div>

                  <div style={{ paddingTop: '12px', borderTop: '1px solid #bfdbfe' }}>
                    <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: '600', marginBottom: '4px' }}>
                      REQUESTING:
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {(Array.isArray(currentRequest) ? currentRequest : [])}
                    </div>
                  </div>
                </div>

                {message && (
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: '6px',
                    marginBottom: '16px',
                    backgroundColor: messageType === 'error' ? '#fee2e2' : messageType === 'success' ? '#f0fdf4' : '#fef9e7',
                    color: messageType === 'error' ? '#dc2626' : messageType === 'success' ? '#166534' : '#78350f',
                    border: `1px solid ${messageType === 'error' ? '#fca5a5' : messageType === 'success' ? '#86efac' : '#fde68a'}`
                  }}>
                    {message}
                  </div>
                )}

                {proofData && (
                  <div style={{
                    background: '#f0fdf4',
                    border: '2px solid #10b981',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#166534', marginBottom: '12px' }}>
                      ✓ Verified Data (Expires at {new Date(proofData.expiresAt).toLocaleTimeString()})
                    </div>
                    <div style={{
                      background: 'white',
                      padding: '12px',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      color: '#374151',
                      overflowX: 'auto'
                    }}>
                      {JSON.stringify(proofData.sharedData, null, 2)}
                    </div>
                  </div>
                )}

                <button
                  onClick={checkStatus}
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    background: loading ? '#d1d5db' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    marginRight: '8px'
                  }}
                >
                  {loading ? '⏳ Checking...' : '✓ Check Status'}
                </button>

                <button
                  onClick={() => {
                    setCurrentRequest(null);
                    setActiveTab('create');
                  }}
                  style={{
                    padding: '12px 24px',
                    background: '#e5e7eb',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  New Request
                </button>
              </>
            ) : (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                background: '#f9fafb',
                borderRadius: '8px',
                color: '#666'
              }}>
                <p style={{ marginBottom: '16px' }}>Create a new request to check its status</p>
                <button
                  onClick={() => setActiveTab('create')}
                  style={{
                    padding: '10px 20px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Go to Create Request
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

