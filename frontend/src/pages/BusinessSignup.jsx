import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BusinessSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: '',
    businessEmail: '',
    industryType: '',
    adminName: '',
    password: '',
    gstId: ''
  });
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (token && storedUser) {
      if (storedUser.role === 'user') {
        navigate('/wallet', { replace: true });
      } else if (storedUser.role === 'business') {
        navigate('/business', { replace: true });
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!acknowledged) {
      setError('Please acknowledge the trust disclosure to continue.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.organizationName,
        email: formData.businessEmail,
        password: formData.password,
        role: 'business',
        businessInfo: {
          industryType: formData.industryType,
          adminName: formData.adminName,
          gstId: formData.gstId
        }
      });

      // Store token
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect to business portal
      navigate('/business', { state: { firstTime: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register organization. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div style={{ maxWidth: 600, margin: '0 auto', paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h2>🏢 Register Your Organization as a Verifier</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Verify users without collecting or storing identity documents.
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: 14,
            borderRadius: 'var(--radius)',
            marginBottom: 20
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Organization Info */}
          <div style={{
            background: 'var(--bg-secondary)',
            padding: 20,
            borderRadius: 'var(--radius)',
            marginBottom: 25
          }}>
            <h3 style={{ marginBottom: 20, fontSize: '1.1rem' }}>Organization Information</h3>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Organization Name *
              </label>
              <input
                type="text"
                name="organizationName"
                placeholder="Grand Hotel Mumbai"
                value={formData.organizationName}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Business Email *
              </label>
              <input
                type="email"
                name="businessEmail"
                placeholder="admin@grandhotel.com"
                value={formData.businessEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Industry Type *
              </label>
              <select
                name="industryType"
                value={formData.industryType}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select Industry</option>
                <option value="hotel">Hotel / Hospitality</option>
                <option value="bank">Bank / Financial Services</option>
                <option value="platform">Digital Platform / Marketplace</option>
                <option value="employer">Employer / HR Services</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="government">Government / Public Sector</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                GST / Registration ID (Optional)
              </label>
              <input
                type="text"
                name="gstId"
                placeholder="22AAAAA0000A1Z5"
                value={formData.gstId}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Admin Account */}
          <div style={{
            background: 'var(--bg-secondary)',
            padding: 20,
            borderRadius: 'var(--radius)',
            marginBottom: 25
          }}>
            <h3 style={{ marginBottom: 20, fontSize: '1.1rem' }}>Admin Account</h3>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Admin Name *
              </label>
              <input
                type="text"
                name="adminName"
                placeholder="Rajesh Kumar"
                value={formData.adminName}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Password *
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Trust Disclosure */}
          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            padding: 20,
            borderRadius: 'var(--radius)',
            marginBottom: 25
          }}>
            <h3 style={{ marginBottom: 15, fontSize: '1.1rem', color: '#92400e' }}>
              ⚠️ Trust Disclosure
            </h3>
            
            <div style={{
              background: 'white',
              padding: 15,
              borderRadius: 6,
              marginBottom: 15
            }}>
              <p style={{ marginBottom: 12, fontWeight: 500, color: '#1f2937' }}>
                I understand that:
              </p>
              <ul style={{ marginLeft: 20, lineHeight: 1.8, color: '#374151' }}>
                <li>VerifyOnce does <strong>not provide</strong> user documents</li>
                <li>Proofs are <strong>time-limited</strong> and expire</li>
                <li>Users can <strong>reject</strong> verification requests</li>
                <li>No identity data is <strong>stored or retained</strong></li>
                <li>VerifyOnce only provides <strong>cryptographic proofs</strong> of attributes</li>
              </ul>
            </div>

            <label style={{
              display: 'flex',
              alignItems: 'start',
              cursor: 'pointer',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 10,
                  marginTop: 2,
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontWeight: 500, color: '#92400e' }}>
                I acknowledge and agree to the above terms
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !acknowledged}
            style={{
              width: '100%',
              opacity: !acknowledged ? 0.5 : 1,
              cursor: !acknowledged ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Registering Organization...' : 'Register as Verifier'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Already registered?{' '}
            <span
              onClick={() => navigate('/business/login')}
              style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Verifier Login
            </span>
          </p>
          <p style={{ marginTop: 10, color: 'var(--text-secondary)' }}>
            Are you a user?{' '}
            <span
              onClick={() => navigate('/user/signup')}
              style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Create User Wallet
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
