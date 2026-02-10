import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'user'
      });

      // Store token
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect to wallet
      navigate('/wallet');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create wallet. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div style={{ maxWidth: 500, margin: '0 auto', paddingTop: 40 }}>
        <h2>Create Your VerifyOnce Wallet</h2>
        <p style={{ marginBottom: 30 }}>
          VerifyOnce does not verify your identity. Your wallet stores credentials 
          issued by trusted authorities.
        </p>

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
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginBottom: 20 }}>
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

          <div style={{ marginBottom: 30 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Creating Wallet...' : 'Create Wallet'}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: 'center', color: 'var(--muted)' }}>
          Already have a wallet?{' '}
          <a href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
