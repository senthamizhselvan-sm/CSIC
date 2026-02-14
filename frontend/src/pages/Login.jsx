import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('user'); // user | business
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

    if (token && storedUser) {
      if (storedUser.role === 'user') navigate('/wallet', { replace: true });
      if (storedUser.role === 'business') navigate('/business', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'user' ? '/demo-user' : '/demo-business';
      const res = await axios.get(
        `http://localhost:5000/api/auth${endpoint}`
      );

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Set axios default headers for this session
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

      navigate(mode === 'user' ? '/wallet' : '/business');
    } catch (err) {
      console.error('Demo login error:', err);
      setError('Demo login failed. Please try manual login.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData
      );

      // Check if user role matches selected mode
      if (res.data.user.role !== mode) {
        setError(
          mode === 'user'
            ? 'This account is registered as a verifier. Please use Verifier Login or contact support.'
            : 'This account is registered as a user. Please use User Login or contact support.'
        );
        setLoading(false);
        return;
      }

      // Store authentication data
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Set axios default headers for this session
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

      // Navigate to appropriate dashboard
      navigate(mode === 'user' ? '/wallet' : '/business');
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle specific error messages
      if (err.response?.status === 400) {
        setError(err.response.data.message || 'Invalid credentials.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (!err.response) {
        setError('Unable to connect to server. Please check your connection.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Toggle */}
        <div className="login-toggle">
          <button
            className={mode === 'user' ? 'active' : ''}
            onClick={() => setMode('user')}
          >
            User Login
          </button>
          <button
            className={mode === 'business' ? 'active' : ''}
            onClick={() => setMode('business')}
          >
            Verifier Login
          </button>
        </div>

        {/* Heading */}
        <h2>
          {mode === 'user' ? 'Sign In to Your Wallet' : 'Verifier Login'}
        </h2>
        <p className="subtitle">
          {mode === 'user'
            ? 'Access your identity wallet and proof management.'
            : 'Access your verification dashboard.'}
        </p>

        {error && <div className="error-box">{error}</div>}

        {/* Demo credentials info */}
        <div style={{
          background: 'rgba(255, 122, 0, 0.1)',
          border: '1px solid #FF7A00',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: '16px',
          fontSize: '13px',
          color: '#d1d5db'
        }}>
          <strong>Demo Credentials:</strong><br />
          User: demo@user.com / demo123<br />
          Business: demo@business.com / demo123
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label>{mode === 'user' ? "Email Address" : "Email"}</label>
          <input
            type="email"  
            name="email"
            placeholder={
              mode === 'user'
                ? 'user@example.com'
                : 'admin@company.com'
            }
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '0',
                fontSize: '14px'
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Signing In…' : 'Sign In'}
          </button>

          <button 
            type="button" 
            onClick={handleDemoLogin}
            disabled={loading}
            style={{
              marginTop: '12px',
              background: 'transparent',
              border: '1px solid #FF7A00',
              color: '#FF7A00',
            }}
          >
            {loading ? 'Loading Demo…' : `Try Demo ${mode === 'user' ? 'User' : 'Business'}`}
          </button>
        </form>

        {/* Sign up link */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '14px',
          color: '#9ca3af'
        }}>
          Don't have an account? {' '}
          <span 
            onClick={() => navigate('/signup')}
            style={{
              color: '#FF7A00',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Sign up here
          </span>
        </div>

      </div>
    </div>
  );
}
