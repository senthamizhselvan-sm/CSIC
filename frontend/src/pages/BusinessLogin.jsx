import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BusinessLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
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
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // Verify business role
      if (res.data.user.role !== 'business') {
        setError('This is the business login. Please use the user login.');
        setLoading(false);
        return;
      }

      // Store token
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect to business portal
      navigate('/business');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div style={{ maxWidth: 500, margin: '0 auto', paddingTop: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h2>🏢 Verifier Login</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Access your verification dashboard
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
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
              Business Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="admin@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginBottom: 30 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Need to register your organization?{' '}
            <span
              onClick={() => navigate('/business/signup')}
              style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Register as Verifier
            </span>
          </p>
          <p style={{ marginTop: 10, color: 'var(--text-secondary)' }}>
            Are you a user?{' '}
            <span
              onClick={() => navigate('/user/login')}
              style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              User Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
