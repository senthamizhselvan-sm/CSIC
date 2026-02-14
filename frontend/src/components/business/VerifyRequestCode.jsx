import { useState } from 'react';
import axios from 'axios';
import '../../styles/business/VerifyRequestCode.css';

export default function VerifyRequestCode({ token }) {
  const [requestCode, setRequestCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [verifiedRequest, setVerifiedRequest] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const handleVerifyCode = async () => {
    if (!requestCode.trim()) {
      setMessageType('error');
      setMessage('Please enter a verification request code');
      return;
    }

    setLoading(true);
    setMessage('');
    setVerifiedRequest(null);
    setUserProfile(null);

    try {
      // Check if this request code exists and get its status
      const res = await axios.get(
        `http://localhost:5000/api/verification/status/${requestCode.toUpperCase()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVerifiedRequest(res.data);
      setMessageType('success');
      
      // If approved, also fetch user details
      if (res.data.status === 'approved') {
        try {
          const userRes = await axios.get(
            `http://localhost:5000/api/verification/user-details/${requestCode.toUpperCase()}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUserProfile(userRes.data.userProfile);
          setMessage(`<i className="bi bi-check-circle-fill"></i> Request APPROVED! User details retrieved from customer.`);
        } catch (userErr) {
          console.error('Error fetching user details:', userErr);
          setMessage(`<i className="bi bi-check-circle-fill"></i> Request APPROVED! (Could not retrieve full user details)`);
        }
      } else if (res.data.status === 'pending') {
        setMessage(`<i className="bi bi-hourglass-split"></i> Request is PENDING - Waiting for customer approval...`);
      } else if (res.data.status === 'denied') {
        setMessage(`<i className="bi bi-x-circle-fill"></i> Customer REJECTED this request`);
      } else if (res.data.status === 'revoked') {
        setMessage(`<i className="bi bi-slash-circle"></i> Customer REVOKED this request`);
      } else if (res.data.status === 'expired') {
        setMessage(`<i className="bi bi-stopwatch-fill"></i> Request has EXPIRED`);
      } else {
        setMessage(`Status: ${res.data.status.toUpperCase()}`);
      }
    } catch (error) {
      setMessageType('error');
      const errorMsg = error.response?.data?.message || 'Failed to verify request code';
      setMessage(`<i className="bi bi-x-circle-fill"></i> ${errorMsg}`);
      console.error('Error verifying code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && requestCode.trim()) {
      handleVerifyCode();
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'denied': return '#ef4444';
      case 'revoked': return '#ef4444';
      case 'expired': return '#6b7280';
      default: return '#3b82f6';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return 'hourglass-split';
      case 'approved': return 'check-circle-fill';
      case 'denied': return 'x-circle-fill';
      case 'revoked': return 'slash-circle';
      case 'expired': return 'stopwatch-fill';
      default: return 'info-circle-fill';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
        <i className="bi bi-pencil-square"></i> Verify Request Code
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Enter a verification request code to check its status and view shared data
      </p>

      {/* Input Section */}
      <div style={{
        background: '#f3f4f6',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        marginBottom: '24px'
      }}>
        <label style={{
          display: 'block',
          marginBottom: '12px',
          fontWeight: '600',
          color: '#374151'
        }}>
          Request Code (e.g., VF-QWCZM2)
        </label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Enter verification request code..."
            value={requestCode}
            onChange={(e) => {
              setRequestCode(e.target.value.toUpperCase());
              setMessage('');
            }}
            onKeyPress={handleKeyPress}
            maxLength="11"
            style={{
              flex: 1,
              padding: '12px 14px',
              border: messageType === 'error' ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'monospace',
              fontWeight: '500',
              backgroundColor: 'white'
            }}
          />
          <button
            onClick={handleVerifyCode}
            disabled={!requestCode || loading}
            style={{
              padding: '12px 28px',
              background: !requestCode || loading ? '#d1d5db' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: !requestCode || loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {loading ? (
              <>
                <i className="bi bi-hourglass-split"></i> Checking...
              </>
            ) : (
              <>
                <i className="bi bi-search"></i> Check Status
              </>
            )}
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div style={{
            marginTop: '14px',
            padding: '12px 14px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: messageType === 'error' ? '#fee2e2' : '#f0fdf4',
            color: messageType === 'error' ? '#dc2626' : '#166534',
            border: `1px solid ${messageType === 'error' ? '#fca5a5' : '#86efac'}`
          }}>
            {message}
          </div>
        )}
      </div>

      {/* Results Display */}
      {verifiedRequest && (
        <div style={{
          background: 'white',
          border: `3px solid ${getStatusColor(verifiedRequest.status)}`,
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          {/* Status Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: `2px solid ${getStatusColor(verifiedRequest.status)}`
          }}>
            <span style={{ fontSize: '36px' }}>
              <i className={`bi bi-${getStatusIcon(verifiedRequest.status)}`}></i>
            </span>
            <div>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                textTransform: 'uppercase'
              }}>
                {verifiedRequest.status}
              </div>
              <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>
                Request ID: <code style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                  {verifiedRequest.requestId}
                </code>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#374151' }}>
              <i className="bi bi-geo-alt-fill"></i> Timeline
            </h3>
            <div style={{
              background: '#f9fafb',
              padding: '16px',
              borderRadius: '8px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <div>
                <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Created
                </div>
                <div style={{ color: '#1f2937', fontSize: '13px' }}>
                  {formatDate(verifiedRequest.createdAt)}
                </div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Expires
                </div>
                <div style={{ color: '#1f2937', fontSize: '13px' }}>
                  {formatDate(verifiedRequest.expiresAt)}
                </div>
              </div>
              {verifiedRequest.approvedAt && (
                <div>
                  <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Approved At
                  </div>
                  <div style={{ color: '#1f2937', fontSize: '13px' }}>
                    {formatDate(verifiedRequest.approvedAt)}
                  </div>
                </div>
              )}
              {verifiedRequest.proofExpiresAt && (
                <div>
                  <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Proof Expires
                  </div>
                  <div style={{ color: '#1f2937', fontSize: '13px' }}>
                    {formatDate(verifiedRequest.proofExpiresAt)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Approved Status - Show Shared Data */}
          {verifiedRequest.status === 'approved' && verifiedRequest.sharedData && (
            <>
              {/* User Profile Section */}
              {userProfile && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    color: '#1f2937'
                  }}>
                    <i className="bi bi-person-fill"></i> Customer Profile
                  </h3>
                  <div style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'grid',
                    gap: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px',
                      background: 'white',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db'
                    }}>
                      <span style={{ fontWeight: '600', color: '#0369a1' }}>Name:</span>
                      <span style={{ fontFamily: 'monospace', color: '#1f2937', fontWeight: 'bold', fontSize: '14px' }}>
                        {userProfile.name}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px',
                      background: 'white',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db'
                    }}>
                      <span style={{ fontWeight: '600', color: '#0369a1' }}>Email:</span>
                      <span style={{ fontFamily: 'monospace', color: '#1f2937', fontWeight: '500', fontSize: '13px' }}>
                        {userProfile.email}
                      </span>
                    </div>
                    {userProfile.phone && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                        background: 'white',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db'
                      }}>
                        <span style={{ fontWeight: '600', color: '#0369a1' }}>Phone:</span>
                        <span style={{ fontFamily: 'monospace', color: '#1f2937', fontWeight: 'bold', fontSize: '14px' }}>
                          {userProfile.phone}
                        </span>
                      </div>
                    )}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px',
                      background: 'white',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db'
                    }}>
                      <span style={{ fontWeight: '600', color: '#0369a1' }}>Member Since:</span>
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>
                        {new Date(userProfile.joinedDate).toLocaleDateString()}
                      </span>
                    </div>
                    {userProfile.hasCredential && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                        background: 'white',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db'
                      }}>
                        <span style={{ fontWeight: '600', color: '#0369a1' }}>Credential:</span>
                        <span style={{ color: '#059669', fontWeight: '500', fontSize: '13px' }}>
                          <i className="bi bi-check-circle-fill"></i> {userProfile.credentialType || 'Active'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  color: '#1f2937'
                }}>
                  <i className="bi bi-check-circle-fill text-success"></i> Data Received from Customer
                </h3>
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'grid',
                  gap: '12px'
                }}>
                  {Object.entries(verifiedRequest.sharedData).length > 0 ? (
                    Object.entries(verifiedRequest.sharedData).map(([key, value]) => (
                      <div key={key} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                        background: 'white',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db'
                      }}>
                        <span style={{ fontWeight: '600', color: '#0369a1' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span style={{
                          fontFamily: 'monospace',
                          color: '#1f2937',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}>
                          {typeof value === 'boolean' ? (value ? <><i className="bi bi-check-circle-fill"></i> YES</> : <><i className="bi bi-x-circle-fill"></i> NO</>) : value}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: '#6b7280' }}>No data shared</div>
                  )}
                </div>
              </div>

              {/* Proof Data */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  color: '#1f2937'
                }}>
                  <i className="bi bi-lock-fill"></i> Cryptographic Proof
                </h3>
                <div style={{
                  background: '#f5f3ff',
                  border: '1px solid #ddd6fe',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'grid',
                  gap: '12px'
                }}>
                  {verifiedRequest.proofId && (
                    <div>
                      <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Proof ID
                      </div>
                      <code style={{
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all',
                        color: '#581c87',
                        display: 'block'
                      }}>
                        {verifiedRequest.proofId}
                      </code>
                    </div>
                  )}
                  {verifiedRequest.blockchainTxId && (
                    <div>
                      <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Blockchain TX
                      </div>
                      <code style={{
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        color: '#581c87'
                      }}>
                        {verifiedRequest.blockchainTxId}
                      </code>
                    </div>
                  )}
                  {verifiedRequest.nonce && (
                    <div>
                      <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Nonce (Replay Protection)
                      </div>
                      <code style={{
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all',
                        color: '#581c87',
                        display: 'block'
                      }}>
                        {verifiedRequest.nonce}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Pending Status */}
          {verifiedRequest.status === 'pending' && (
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fcd34d',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#92400e',
                marginBottom: '8px'
              }}>
                <i className="bi bi-hourglass-split"></i> Waiting for Customer Approval
              </div>
              <div style={{ fontSize: '13px', color: '#b45309' }}>
                Share the request code with your customer to proceed with verification
              </div>
            </div>
          )}

          {/* Denied/Revoked Status */}
          {(verifiedRequest.status === 'denied' || verifiedRequest.status === 'revoked') && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#7f1d1d',
                marginBottom: '8px'
              }}>
                {verifiedRequest.status === 'denied' ? <><i className="bi bi-x-circle-fill"></i> Request Rejected</> : <><i className="bi bi-slash-circle"></i> Request Revoked</>}
              </div>
              <div style={{ fontSize: '13px', color: '#b91c1c' }}>
                {verifiedRequest.status === 'denied'
                  ? 'Customer rejected this verification request'
                  : 'Customer revoked this verification proof'}
              </div>
            </div>
          )}

          {/* Expired Status */}
          {verifiedRequest.status === 'expired' && (
            <div style={{
              background: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <i className="bi bi-stopwatch-fill"></i> Request Expired
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                This verification request has expired. Create a new request to try again.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
