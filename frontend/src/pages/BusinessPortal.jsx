import axios from 'axios';
import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function BusinessPortal() {
  const [token, setToken] = useState('');
  const [request, setRequest] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/demo-business')
      .then(res => setToken(res.data.token));
  }, []);

  const createRequest = async () => {
    const res = await axios.post(
      'http://localhost:5000/api/verification/request',
      {
        businessName: 'Grand Hotel Mumbai',
        requestedData: [{ field: 'age', type: 'verification_only' }]
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setRequest(res.data);
    setResult(null);
  };

  const checkStatus = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/verification/status/${request.requestId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setResult(res.data);
  };

  return (
    <div className="page">
      <h2>🏢 Business Verification Portal</h2>
      <p>Request instant, privacy-preserving identity verification.</p>

      {/* CREATE REQUEST */}
      {!request && (
        <div className="card">
          <h3>Create Verification Request</h3>
          <p>
            You will only receive a YES/NO confirmation.
            No documents are stored.
          </p>

          <button className="btn-primary" onClick={createRequest}>
            ➕ Generate Verification Request
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

          <p>⏳ Waiting for customer approval…</p>

          <button className="btn-secondary" onClick={checkStatus}>
            🔄 Check Status
          </button>
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="card">
          <h3>✅ Verification Result</h3>

          <div className="status status-approved">
            Identity Verified Successfully
          </div>

          <pre style={{ marginTop: 16 }}>
{JSON.stringify(result.sharedData, null, 2)}
          </pre>

          <p style={{ marginTop: 12, color: '#6b7280' }}>
            Cryptographic Proof: <br />
            <code>{result.cryptographicProof}</code>
          </p>

          <button className="btn-primary" onClick={() => {
            setRequest(null);
            setResult(null);
          }}>
            🔁 New Verification
          </button>
        </div>
      )}
    </div>
  );
}
