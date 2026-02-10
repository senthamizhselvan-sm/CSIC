import axios from 'axios';
import { useEffect, useState } from 'react';

export default function UserDashboard() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get from localStorage or demo endpoint
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);
      fetchCredentials(storedToken);
    } else {
      // Demo user
      axios.get('http://localhost:5000/api/auth/demo-user')
        .then(res => {
          setToken(res.data.token);
          setUser(res.data.user);
          fetchCredentials(res.data.token);
        });
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

  const addDemoCredential = async () => {
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/api/wallet/add-credential',
        {
          type: 'government_id',
          issuer: 'DigiLocker (Demo)',
          data: {
            fullName: user?.name || 'Rahul Sharma',
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
    } catch {
      setStatus('error');
    }
  };

  if (!user) {
    return <div className="page"><p>Loading...</p></div>;
  }

  // Ensure user role is correct
  if (user.role !== 'user') {
    return (
      <div className="page">
        <div className="card">
          <h2>Access Denied</h2>
          <p>This wallet is only for users (role: user). You are logged in as: {user.role}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>👤 My Identity Wallet</h2>
      <p>Welcome, {user.name}. Your verified digital identity. You control what you share.</p>

      {/* EMPTY STATE */}
      {credentials.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <h3>No Credentials Found</h3>
          <p style={{ marginBottom: 20 }}>
            Credentials are issued by trusted authorities such as government, banks, 
            or universities. VerifyOnce never creates credentials itself.
          </p>
          <button
            className="btn-primary"
            onClick={addDemoCredential}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Demo Credential'}
          </button>
        </div>
      )}

      {/* CREDENTIALS LIST */}
      {credentials.map((cred, idx) => (
        <div key={idx} className="card">
          <h3>🆔 Verified Credential</h3>
          <p><strong>Type:</strong> {cred.type || 'Government ID'}</p>
          <p><strong>Issuer:</strong> {cred.issuer}</p>
          <p><strong>Status:</strong> <span className="badge badge-success">ACTIVE</span></p>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: 10 }}>
            Credential stored securely in your wallet. This credential is never shared 
            directly. Only time-limited proofs are generated on your approval.
          </p>
        </div>
      ))}

      {/* VERIFICATION ACTION */}
      {credentials.length > 0 && (
        <div className="card">
          <h3>🔐 Approve Verification Request</h3>
          <p>
            Enter the verification code shown by a business. Review the requested information,
            then approve to generate a proof. Your birthdate and ID number are never shared.
          </p>

          <input
            placeholder="Enter Verification Code (e.g. VF-AB123)"
            value={code}
            onChange={e => setCode(e.target.value)}
          />

          <br /><br />

          <button className="btn-success" onClick={approve}>
            ✅ Approve Securely
          </button>

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
      )}

      {/* PRIVACY INFO */}
      <div className="card">
        <h3>🛡️ Your Privacy</h3>
        <p>✔ Passport number is never shared</p>
        <p>✔ Birthdate is never shared</p>
        <p>✔ Proof expires automatically</p>
        <p>✔ You can revoke access anytime</p>
        <p>✔ Full audit history visible to you</p>
      </div>
    </div>
  );
}
