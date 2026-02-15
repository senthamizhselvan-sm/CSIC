import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import API_URL from '../config/api';
import '../styles/business/BusinessVerifier.css';

export default function BusinessVerifier() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [request, setRequest] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Get token from localStorage (ProtectedRoute ensures correct role)
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setToken(storedToken);
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const createRequest = async () => {
    try {
      const res = await axios.post(
        '${API_URL}/api/verification/request',
        {
          businessName: user?.name || 'Grand Hotel Mumbai',
          requestedData: [{ field: 'age', type: 'verification_only' }]
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequest(res.data);
      setResult(null);
    } catch (err) {
      console.error('Failed to create request', err);
    }
  };

  const checkStatus = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/verification/status/${request.requestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) {
      console.error('Failed to check status', err);
    }
  };

  if (!user) {
    return <div className="page"><p>Loading...</p></div>;
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0 }}><i className="bi bi-building"></i> Business Verification Portal</h2>
          <p style={{ margin: '8px 0 0 0' }}>Welcome, {user.name}. Request instant, privacy-preserving identity verification.</p>
        </div>
        <button 
          className="btn-secondary"
          onClick={handleLogout}
          style={{ whiteSpace: 'nowrap' }}
        >
          <i className="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>

      {/* CREATE REQUEST */}
      {!request && (
        <div className="card">
          <h3>Create Verification Request</h3>
          <p>
            You will only receive a YES/NO confirmation that a user's identity is verified. 
            No documents are stored. No user data is retained.
          </p>

          <button className="btn-primary" onClick={createRequest}>
            <i className="bi bi-plus-circle-fill"></i> Generate Verification Request
          </button>
        </div>
      )}

      {/* QR DISPLAY */}
      {request && !result && (
        <div className="card center">
          <h3>Customer Verification</h3>
          <p>Customer scans QR or enters the code below.</p>

          <div style={{ margin: '20px 0' }}>
            <QRCodeCanvas value={request.requestId} size={220} />
          </div>

          <h2>{request.requestId}</h2>

          <p><i className="bi bi-hourglass-split"></i> Waiting for customer approval…</p>

          <button className="btn-secondary" onClick={checkStatus}>
            <i className="bi bi-arrow-repeat"></i> Check Status
          </button>
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="card">
          <h3><i className="bi bi-check-circle-fill text-success"></i> Verification Result</h3>

          <div className="status status-approved">
            Identity Verified Successfully
          </div>

          <p style={{ marginTop: 16 }}>
            <strong>Verification Proof:</strong><br />
            {JSON.stringify(result.sharedData, null, 2)}
          </p>

          <p style={{ marginTop: 12, color: '#6b7280' }}>
            <strong>Cryptographic Proof:</strong><br />
            <code style={{ fontSize: '0.85rem' }}>{result.cryptographicProof}</code>
          </p>

          <p style={{ marginTop: 16, fontSize: '0.9rem', color: 'var(--muted)' }}>
            This proof is time-limited and will expire in 24 hours. 
            User's identity attributes (ID number, birthdate) are not included in this proof.
          </p>

          <button className="btn-primary" onClick={() => {
            setRequest(null);
            setResult(null);
          }}>
            <i className="bi bi-arrow-repeat"></i> New Verification Request
          </button>
        </div>
      )}
    </div>
  );
}

