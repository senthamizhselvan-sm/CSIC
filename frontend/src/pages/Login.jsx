import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import '../index.css';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('user'); // user | business
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData
      );

      if (res.data.user.role !== mode) {
        setError(
          mode === 'user'
            ? 'Please use Verifier Login.'
            : 'Please use User Login.'
        );
        setLoading(false);
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate(mode === 'user' ? '/wallet' : '/business');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label>{mode === 'user' ? "Phone Number" : "Email"}</label>
          <input
            type = "text"  
            name="email"
            placeholder={
              mode === 'user'
                ? '+91 730357699'
                : 'admin@company.com'
            }
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="otp"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Signing In…' : 'Sign In'}
          </button>
        </form>

      </div>
    </div>
  );
}
