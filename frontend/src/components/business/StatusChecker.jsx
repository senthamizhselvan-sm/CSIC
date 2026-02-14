import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StatusChecker({ token }) {
  const [requestCode, setRequestCode] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState(null);
  const [error, setError] = useState('');

  const checkStatus = async () => {
    if (!requestCode.trim()) {
      setError('Please enter a verification request code');
      return;
    }

    setLoading(true);
    setError('');
    setVerification(null);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/verification/status/${requestCode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVerification(res.data);
      setStatus('success');

      // Auto-clear after 10s if successful
      setTimeout(() => setStatus(''), 10000);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to check verification status';
      setError(errMsg);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && requestCode.trim()) {
      checkStatus();
    }
  };

  const getStatusColor = (s) => {
    switch(s) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'denied': return '#ef4444';
      case 'revoked': return '#ef4444';
      case 'expired': return '#6b7280';
      default: return '#3b82f6';
    }
  };

  const getStatusIcon = (s) => {
    switch(s) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'denied': return '❌';
      case 'revoked': return '🚫';
      case 'expired': return '⏱️';
      default: return 'ℹ️';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const getTimeRemaining = (expiresAt) => {
    if (!expiresAt) return '';
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = Math.max(0, Math.floor((expires - now) / 1000));
    
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
          Verification Status Checker
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Enter a request code to check the current status and view shared data
        </p>

        {/* Input Section */}
        <div style={{ 
          background: '#f3f4f6', 
          padding: '20px', 
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#374151' }}>
            Verification Request Code
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="e.g., VF-QWCZM2"
              value={requestCode}
              onChange={(e) => {
                setRequestCode(e.target.value.toUpperCase());
                setError('');
              }}
              onKeyPress={handleKeyPress}
              style={{
                flex: 1,
                padding: '12px 14px',
                border: error ? '2px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'monospace',
                fontWeight: '500'
              }}
            />
            <button
              onClick={checkStatus}
              disabled={!requestCode || loading}
              style={{
                padding: '12px 24px',
                background: !requestCode || loading ? '#d1d5db' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: !requestCode || loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}
            >
              {loading ? '⏳ Checking...' : '🔍 Check Status'}
            </button>
          </div>
          {error && (
            <div style={{ marginTop: '12px', color: '#dc2626', fontSize: '14px', fontWeight: '500' }}>
              ❌ {error}
            </div>
          )}
        </div>
      </div>

      {/* Result Display */}
      {verification && (
        <div style={{ 
          background: 'white', 
          border: `3px solid ${getStatusColor(verification.status)}`,
          borderRadius: '12px',
          padding: '24px',
          animation: 'fadeIn 0.3s ease-in'
        }}>
          {/* Status Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: `2px solid ${getStatusColor(verification.status)}`
          }}>
            <span style={{ fontSize: '32px' }}>
              {getStatusIcon(verification.status)}
            </span>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>
                {verification.status.toUpperCase()}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                Request ID: <code style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                  {verification.requestId}
                </code>
              </div>
            </div>
          </div>

          {/* Approved Status - Show Shared Data */}
          {verification.status === 'approved' && (
            <>
              {/* Proof Details */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>
                  ✅ VERIFICATION SUCCESSFUL
                </h3>
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Proof ID
                    </div>
                    <code style={{ 
                      fontSize: '13px', 
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                      color: '#166534'
                    }}>
                      {verification.proofId}
                    </code>
                  </div>
                  <div>
                    <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Blockchain TX
                    </div>
                    <code style={{ 
                      fontSize: '13px', 
                      fontFamily: 'monospace',
                      color: '#166534'
                    }}>
                      {verification.blockchainTxId}
                    </code>
                  </div>
                </div>
              </div>

              {/* Shared Data */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>
                  📦 Shared Data (What You Received)
                </h3>
                <div style={{
                  background: '#f0f9ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  {verification.sharedData && Object.keys(verification.sharedData).length > 0 ? (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {Object.entries(verification.sharedData).map(([key, value]) => (
                        <div key={key} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px',
                          background: 'white',
                          borderRadius: '6px'
                        }}>
                          <span style={{ fontWeight: '600', color: '#0369a1' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span style={{ fontFamily: 'monospace', color: '#1f2937', fontWeight: 'bold' }}>
                            {typeof value === 'boolean' ? (value ? '✓ YES' : '✗ NO') : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280' }}>No data shared</div>
                  )}
                </div>
              </div>

              {/* Nonce & Timestamps */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>
                  🔐 Cryptographic Proof
                </h3>
                <div style={{
                  background: '#f5f3ff',
                  border: '1px solid #ddd6fe',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'grid',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Nonce (Replay Protection)
                    </div>
                    <code style={{ 
                      fontSize: '13px', 
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                      color: '#581c87'
                    }}>
                      {verification.nonce}
                    </code>
                  </div>
                  <div>
                    <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Signature
                    </div>
                    <code style={{ 
                      fontSize: '13px', 
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                      color: '#581c87'
                    }}>
                      {verification.cryptographicProof.substring(0, 50)}...
                    </code>
                  </div>
                </div>
              </div>

              {/* Expiry Warning */}
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fcd34d',
                borderRadius: '8px',
                padding: '12px 16px',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}>
                <span style={{ fontSize: '20px' }}>⏱️</span>
                <div>
                  <div style={{ fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>
                    Proof Expires in: {getTimeRemaining(verification.proofExpiresAt)}
                  </div>
                  <div style={{ fontSize: '13px', color: '#b45309' }}>
                    At: {formatDate(verification.proofExpiresAt)}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Pending Status */}
          {verification.status === 'pending' && (
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fcd34d',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>
                ⏳ Waiting for customer approval...
              </div>
              <div style={{ fontSize: '14px', color: '#b45309' }}>
                Expires at: {formatDate(verification.expiresAt)}
                <br />
                Time remaining: {getTimeRemaining(verification.expiresAt)}
              </div>
            </div>
          )}

          {/* Denied Status */}
          {verification.status === 'denied' && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#7f1d1d', marginBottom: '8px' }}>
                ❌ Customer rejected this verification request
              </div>
              <div style={{ fontSize: '14px', color: '#b91c1c' }}>
                Create a new verification request to try again
              </div>
            </div>
          )}

          {/* Revoked Status */}
          {verification.status === 'revoked' && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#7f1d1d', marginBottom: '8px' }}>
                🚫 Customer revoked this verification proof
              </div>
              <div style={{ fontSize: '14px', color: '#b91c1c' }}>
                This proof is no longer valid. The customer has revoked access.
              </div>
            </div>
          )}

          {/* Expired Status */}
          {verification.status === 'expired' && (
            <div style={{
              background: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                ⏱️ This verification has expired
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Create a new verification request to try again
              </div>
            </div>
          )}

          {/* Timeline */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#374151' }}>
              📍 Timeline
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ color: '#6b7280', fontSize: '12px', minWidth: '100px' }}>Created:</div>
                <div style={{ color: '#1f2937', fontWeight: '500' }}>{formatDate(verification.createdAt)}</div>
              </div>
              {verification.approvedAt && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ color: '#6b7280', fontSize: '12px', minWidth: '100px' }}>Approved:</div>
                  <div style={{ color: '#1f2937', fontWeight: '500' }}>{formatDate(verification.approvedAt)}</div>
                </div>
              )}
              {verification.proofExpiresAt && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ color: '#6b7280', fontSize: '12px', minWidth: '100px' }}>Expires:</div>
                  <div style={{ color: '#1f2937', fontWeight: '500' }}>{formatDate(verification.proofExpiresAt)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
