import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';
import API_URL from '../config/api';

// Extract AddCredential as separate component to prevent remounting
const AddCredentialComponent = ({ 
  credentialForm, 
  message, 
  messageType, 
  loading, 
  handleCredentialInputChange, 
  submitCredential, 
  setActiveSection,
  isDigiLockerConnected,
  connectDigiLocker,
  setShowDisconnectModal,
  digiLockerCredentials
}) => (
  <div className="dashboard-section">
    <div className="section-header">
      <h3>Add Your Identity Credential</h3>
    </div>
    
    {/* DigiLocker Connection Section */}
    <div className="card" style={{ 
      marginBottom: '24px', 
      background: 'linear-gradient(145deg, #111117, #0E0E14)', 
      border: '1px solid rgba(255, 122, 0, 0.2)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div style={{ 
          width: '56px', 
          height: '56px', 
          background: 'linear-gradient(135deg, #FF7A00 0%, #FFB347 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(255, 122, 0, 0.3)'
        }}>
          <i className="bi bi-bank2" style={{ fontSize: '24px', color: 'white' }}></i>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 6px 0', color: '#FF7A00', fontSize: '20px', fontWeight: '700' }}>Connect DigiLocker</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af' }}>Government of India - Digital Locker</p>
        </div>
      </div>
      
      <div style={{ 
        background: 'rgba(255, 122, 0, 0.05)', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid rgba(255, 122, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <i className="bi bi-info-circle-fill" style={{ color: '#FF7A00', fontSize: '14px' }}></i>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#FF7A00' }}>Status:</span>
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isDigiLockerConnected ? (
            <>
              <i className="bi bi-check-circle-fill" style={{ color: '#10b981', fontSize: '16px' }}></i>
              <span>Connected • {digiLockerCredentials.length || 3} Credentials</span>
            </>
          ) : (
            <>
              <i className="bi bi-x-circle-fill" style={{ color: '#6b7280', fontSize: '16px' }}></i>
              <span>Not Connected</span>
            </>
          )}
        </div>
      </div>

      {!isDigiLockerConnected ? (
        <>
          <p style={{ fontSize: '14px', marginBottom: '20px', color: '#9ca3af', lineHeight: '1.6' }}>
            Instantly import your government-issued credentials from DigiLocker. Your documents stay secure and are never shared directly.
          </p>
          <button
            onClick={connectDigiLocker}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: 'linear-gradient(135deg, #FF7A00 0%, #FFB347 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '15px',
              boxShadow: '0 4px 12px rgba(255, 122, 0, 0.4)',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(255, 122, 0, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(255, 122, 0, 0.4)';
            }}
          >
            <i className="bi bi-shield-lock-fill"></i>
            Connect Securely
          </button>
        </>
      ) : (
        <>
          <p style={{ fontSize: '14px', marginBottom: '20px', color: '#9ca3af', lineHeight: '1.6' }}>
            Your DigiLocker credentials are active and ready for verification. You can disconnect anytime.
          </p>
          <button
            onClick={() => setShowDisconnectModal(true)}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: 'linear-gradient(145deg, #1a1a1f, #0f0f13)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '15px',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'linear-gradient(145deg, #1a1a1f, #0f0f13)';
              e.target.style.color = '#ef4444';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <i className="bi bi-plug-fill"></i>
            Disconnect DigiLocker
          </button>
        </>
      )}
    </div>

    <div style={{ 
      textAlign: 'center', 
      margin: '24px 0', 
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255, 122, 0, 0.2)' }}></div>
      <span style={{ color: '#FF7A00', fontSize: '14px', fontWeight: '600' }}>OR</span>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255, 122, 0, 0.2)' }}></div>
    </div>
    
    <div style={{ 
      background: 'rgba(59, 130, 246, 0.05)', 
      padding: '16px', 
      borderRadius: '8px', 
      marginBottom: '20px', 
      borderLeft: '4px solid #3b82f6',
      border: '1px solid rgba(59, 130, 246, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <i className="bi bi-shield-lock-fill" style={{ color: '#3b82f6', fontSize: '16px' }}></i>
        <strong style={{ color: '#3b82f6', fontSize: '14px' }}>Manual Entry:</strong>
      </div>
      <span style={{ color: '#9ca3af', fontSize: '14px' }}>
        Enter your details manually to create your identity credential. Your data is encrypted and stays in your wallet.
      </span>
    </div>

    <div className="card" style={{
      background: 'linear-gradient(145deg, #111117, #0E0E14)',
      border: '1px solid rgba(255, 122, 0, 0.2)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
    }}>
      <h4 style={{ color: '#FF7A00', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <i className="bi bi-file-earmark-person-fill"></i> 
        Identity Verification
      </h4>
      <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '24px' }}>
        Enter your details to create your identity credential. This is required before you can verify with hotels, banks, and other services.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: '600', 
          fontSize: '14px',
          color: '#FF7A00'
        }}>
          Credential Type *
        </label>
        <select
          value={credentialForm.type}
          onChange={(e) => handleCredentialInputChange('type', e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: '#000000',
            border: '1px solid rgba(255, 122, 0, 0.3)',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#ffffff',
            WebkitTextFillColor: '#ffffff',
            cursor: 'pointer',
            fontWeight: '500',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(255, 122, 0, 0.6)';
            e.target.style.boxShadow = '0 0 0 3px rgba(255, 122, 0, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 122, 0, 0.3)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="government_id" style={{ background: '#1a1a1f', color: '#e5e7eb' }}>Government ID</option>
          <option value="passport" style={{ background: '#1a1a1f', color: '#e5e7eb' }}>Passport</option>
          <option value="aadhaar" style={{ background: '#1a1a1f', color: '#e5e7eb' }}>Aadhaar</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: '600', 
          fontSize: '14px',
          color: '#FF7A00'
        }}>
          Full Name *
        </label>
        <input
          type="text"
          placeholder="Your full name"
          value={credentialForm.fullName}
          onChange={(e) => handleCredentialInputChange('fullName', e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: '#000000',
            border: '1px solid rgba(255, 122, 0, 0.3)',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#ffffff',
            WebkitTextFillColor: '#ffffff',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(255, 122, 0, 0.6)';
            e.target.style.boxShadow = '0 0 0 3px rgba(255, 122, 0, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 122, 0, 0.3)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: '600', 
          fontSize: '14px',
          color: '#FF7A00'
        }}>
          Date of Birth *
        </label>
        <input
          type="date"
          value={credentialForm.dateOfBirth}
          onChange={(e) => handleCredentialInputChange('dateOfBirth', e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: '#000000',
            border: '1px solid rgba(255, 122, 0, 0.3)',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#ffffff',
            WebkitTextFillColor: '#ffffff',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'all 0.3s ease',
            colorScheme: 'dark'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(255, 122, 0, 0.6)';
            e.target.style.boxShadow = '0 0 0 3px rgba(255, 122, 0, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 122, 0, 0.3)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <small style={{ color: '#9ca3af', fontSize: '12px' }}>Used to calculate age for verifications</small>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: '600', 
          fontSize: '14px',
          color: '#FF7A00'
        }}>
          Nationality *
        </label>
        <select
          value={credentialForm.nationality}
          onChange={(e) => handleCredentialInputChange('nationality', e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: '#000000',
            border: '1px solid rgba(255, 122, 0, 0.3)',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#ffffff',
            WebkitTextFillColor: '#ffffff',
            cursor: 'pointer',
            fontWeight: '500',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(255, 122, 0, 0.6)';
            e.target.style.boxShadow = '0 0 0 3px rgba(255, 122, 0, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 122, 0, 0.3)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="Indian" style={{ background: '#1a1a1f', color: '#e5e7eb' }}>Indian</option>
          <option value="Other" style={{ background: '#1a1a1f', color: '#e5e7eb' }}>Other</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: '600', 
          fontSize: '14px',
          color: '#FF7A00'
        }}>
          Last 4 digits of Aadhaar *
        </label>
        <input
          type="text"
          placeholder="e.g., 1234"
          maxLength="4"
          value={credentialForm.aadhaarLast4}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, '');
            handleCredentialInputChange('aadhaarLast4', val);
          }}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: '#000000',
            border: '1px solid rgba(255, 122, 0, 0.3)',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#ffffff',
            WebkitTextFillColor: '#ffffff',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(255, 122, 0, 0.6)';
            e.target.style.boxShadow = '0 0 0 3px rgba(255, 122, 0, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 122, 0, 0.3)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <small style={{ color: '#9ca3af', fontSize: '12px' }}>Never shared - only kept for verification records</small>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: '600', 
          fontSize: '14px',
          color: '#FF7A00'
        }}>
          Address *
        </label>
        <textarea
          placeholder="Your residential address"
          value={credentialForm.address}
          onChange={(e) => handleCredentialInputChange('address', e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: '#000000',
            border: '1px solid rgba(255, 122, 0, 0.3)',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#ffffff',
            WebkitTextFillColor: '#ffffff',
            minHeight: '80px',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'all 0.3s ease',
            resize: 'vertical'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(255, 122, 0, 0.6)';
            e.target.style.boxShadow = '0 0 0 3px rgba(255, 122, 0, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 122, 0, 0.3)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {message && (
        <div style={{
          padding: '14px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundColor: messageType === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          color: messageType === 'error' ? '#ef4444' : '#10b981',
          border: `1px solid ${messageType === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={submitCredential}
          disabled={loading}
          style={{
            flex: 1,
            padding: '14px 20px',
            background: loading ? 'rgba(107, 114, 128, 0.3)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '700',
            fontSize: '15px',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.4)',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: loading ? 0.7 : 1
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.6)';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
            }
          }}
        >
          {loading ? (
            <>
              <i className="bi bi-arrow-clockwise" style={{ animation: 'spin 1s linear infinite' }}></i>
              Verifying...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle-fill"></i>
              Create Credential
            </>
          )}
        </button>

        <button
          onClick={() => setActiveSection('credentials')}
          disabled={loading}
          style={{
            flex: 1,
            padding: '14px 20px',
            background: 'linear-gradient(145deg, #1a1a1f, #0f0f13)',
            color: '#9ca3af',
            border: '1px solid rgba(156, 163, 175, 0.3)',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '15px',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.borderColor = 'rgba(156, 163, 175, 0.5)';
              e.target.style.color = '#e5e7eb';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.borderColor = 'rgba(156, 163, 175, 0.3)';
              e.target.style.color = '#9ca3af';
            }
          }}
        >
          <i className="bi bi-arrow-left"></i>
          Back
        </button>
      </div>
    </div>
    
    <div className="card" style={{
      background: 'linear-gradient(145deg, #111117, #0E0E14)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      marginTop: '24px'
    }}>
      <h4 style={{ color: '#10b981', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <i className="bi bi-shield-fill-check"></i> 
        How Your Credential Works
      </h4>
      <ul style={{ paddingLeft: '0', color: '#9ca3af', fontSize: '14px', listStyle: 'none' }}>
        <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <i className="bi bi-check-circle-fill" style={{ color: '#10b981', fontSize: '16px', marginTop: '2px' }}></i>
          <div>
            <strong style={{ color: '#e5e7eb' }}>One-time setup:</strong> Verify your identity once in VerifyOnce
          </div>
        </li>
        <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <i className="bi bi-check-circle-fill" style={{ color: '#10b981', fontSize: '16px', marginTop: '2px' }}></i>
          <div>
            <strong style={{ color: '#e5e7eb' }}>Privacy first:</strong> Your full details stay encrypted in your wallet
          </div>
        </li>
        <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <i className="bi bi-check-circle-fill" style={{ color: '#10b981', fontSize: '16px', marginTop: '2px' }}></i>
          <div>
            <strong style={{ color: '#e5e7eb' }}>Minimal sharing:</strong> Hotels only see "Yes, 18+" not your birthdate
          </div>
        </li>
        <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <i className="bi bi-check-circle-fill" style={{ color: '#10b981', fontSize: '16px', marginTop: '2px' }}></i>
          <div>
            <strong style={{ color: '#e5e7eb' }}>Time-limited proofs:</strong> Shared data expires in 3 minutes automatically
          </div>
        </li>
        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <i className="bi bi-check-circle-fill" style={{ color: '#10b981', fontSize: '16px', marginTop: '2px' }}></i>
          <div>
            <strong style={{ color: '#e5e7eb' }}>Full control:</strong> Approve each request, revoke anytime
          </div>
        </li>
      </ul>
    </div>

    <div className="card" style={{ 
      background: 'linear-gradient(145deg, #111117, #0E0E14)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      marginTop: '20px'
    }}>
      <h4 style={{ color: '#3b82f6', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <i className="bi bi-shield-lock-fill"></i> 
        Your Data is Safe
      </h4>
      <div style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '1.8' }}>
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="bi bi-check-circle-fill" style={{ color: '#3b82f6', fontSize: '14px' }}></i>
          <span>Data encrypted at rest and in transit (AES-256)</span>
        </div>
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="bi bi-check-circle-fill" style={{ color: '#3b82f6', fontSize: '14px' }}></i>
          <span>No private keys ever sent to servers</span>
        </div>
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="bi bi-check-circle-fill" style={{ color: '#3b82f6', fontSize: '14px' }}></i>
          <span>Zero-knowledge proofs used for verification</span>
        </div>
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="bi bi-check-circle-fill" style={{ color: '#3b82f6', fontSize: '14px' }}></i>
          <span>Automatic deletion after expiry</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="bi bi-check-circle-fill" style={{ color: '#3b82f6', fontSize: '14px' }}></i>
          <span>GDPR compliant - you own your data</span>
        </div>
      </div>
    </div>
  </div>
);

export default function UserDashboard() {
  const navigate = useNavigate();
  const verificationInputRef = useRef(null);
  const isTypingRef = useRef(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [requestDetails, setRequestDetails] = useState(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [activeProofsData, setActiveProofsData] = useState([]);
  const [countdownTimers, setCountdownTimers] = useState({});
  const [credentialForm, setCredentialForm] = useState({
    type: 'government_id',
    fullName: '',
    dateOfBirth: '',
    nationality: 'Indian',
    aadhaarLast4: '',
    address: ''
  });
  const [selectedCredentialId, setSelectedCredentialId] = useState(null);
  const [viewingCredential, setViewingCredential] = useState(null);
  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'Grand Hotel verification request', time: '2 min ago' },
    { id: 2, title: 'Address proof expiring soon', time: '1 hour ago' },
    { id: 3, title: 'New login from Delhi detected', time: '3 hours ago' }
  ]);
  
  // DigiLocker Integration State
  const [isDigiLockerConnected, setIsDigiLockerConnected] = useState(false);
  const [digiLockerCredentials, setDigiLockerCredentials] = useState([]);
  const [connectionStep, setConnectionStep] = useState(null); // null, 'loading', 'auth', 'processing', 'success'
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  // Blockchain Anchoring State
  const [showBlockchainModal, setShowBlockchainModal] = useState(false);
  const [blockchainStage, setBlockchainStage] = useState(1); // 1-5
  const [blockchainProgress, setBlockchainProgress] = useState(0);
  const [blockchainData, setBlockchainData] = useState(null);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [verificationHistory, setVerificationHistory] = useState([]);
  
  // Sample data for demo purposes
  const [activeProofs] = useState([
    {
      id: 'proof-abc123-xyz789',
      verifier: 'Grand Hotel Mumbai',
      attributes: ['Age (18+)', 'Nationality (Indian)'],
      generated: '2:32 PM',
      expires: '2:37 PM',
      timeRemaining: 102, // seconds
      progress: 66
    }
  ]);

  const [activityLog] = useState([
    { date: 'Today', time: '14:32', verifier: 'Grand Hotel Mumbai', request: 'Guest Check-in', attributes: 'Age, Nationality', status: 'approved' },
    { date: 'Today', time: '10:15', verifier: 'HDFC Bank', request: 'Account Opening', attributes: 'Identity, Address', status: 'rejected' },
    { date: 'Yesterday', time: '14:20', verifier: 'Zoomcar', request: 'Car Rental', attributes: 'Age, License', status: 'approved' },
    { date: 'Yesterday', time: '11:30', verifier: 'Apollo Hospitals', request: 'Medical Registration', attributes: 'Identity, Insurance', status: 'approved' },
    { date: 'Feb 9', time: '18:45', verifier: 'Swiggy', request: 'Food Delivery', attributes: 'Age, Location', status: 'approved' },
    { date: 'Feb 8', time: '16:20', verifier: 'Amazon.in', request: 'Age-restricted Purchase', attributes: 'Age', status: 'approved' }
  ]);

  const [stats] = useState({
    totalVerifications: 127,
    activeProofs: 1,
    privacyScore: 98,
    expiryAlerts: 1,
    approvalRate: 84,
    avgResponseTime: '1.2 min',
    dataExposure: '312 min'
  });

  useEffect(() => {
    // Get token from localStorage (ProtectedRoute ensures correct role)
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setToken(storedToken);
      setUser(storedUser);
      fetchCredentials(storedToken);
      fetchVerificationHistory(storedToken);
      fetchActiveProofs(storedToken);
    }
  }, []);

  // Refresh credentials when actively viewing credentials section
  useEffect(() => {
    if (token && (activeSection === 'credentials' || activeSection === 'dashboard')) {
      fetchCredentials(token);
    }
  }, [activeSection, token]);

  // Check DigiLocker connection status on mount
  useEffect(() => {
    const checkDigiLockerConnection = async () => {
      const connected = localStorage.getItem('digilocker_connected') === 'true';
      if (connected && token) {
        // Verify that DigiLocker credentials actually exist and are active
        try {
          const res = await axios.get('${API_URL}/api/credentials', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const activeDigiLockerCreds = res.data.credentials?.filter(c => 
            c.issuer && c.issuer.toLowerCase().includes('digilocker') && c.isActive
          ) || [];
          
          if (activeDigiLockerCreds.length === 0) {
            // No active DigiLocker credentials found, update connection status
            setIsDigiLockerConnected(false);
            localStorage.removeItem('digilocker_connected');
          } else {
            setIsDigiLockerConnected(true);
          }
        } catch (err) {
          console.error('Error checking DigiLocker credentials:', err);
          setIsDigiLockerConnected(connected);
        }
      } else {
        setIsDigiLockerConnected(connected);
      }
    };
    
    if (token) {
      checkDigiLockerConnection();
    } else {
      const connected = localStorage.getItem('digilocker_connected') === 'true';
      setIsDigiLockerConnected(connected);
    }
  }, [token]);

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Skip updates if user is actively typing to prevent focus loss
      if (isTypingRef.current) {
        return;
      }
      
      setCountdownTimers((prev) => {
        const updated = { ...prev };
        let hasActive = false;
        let hasChanges = false;

        // Update request timer
        if (requestDetails && requestDetails.expiresAt) {
          const remaining = Math.max(0, new Date(requestDetails.expiresAt) - new Date());
          if (remaining > 0) {
            if (updated.request !== remaining) {
              updated.request = remaining;
              hasChanges = true;
            }
            hasActive = true;
          } else {
            if (updated.request !== 0) {
              updated.request = 0;
              hasChanges = true;
            }
          }
        }

        // Update proof timers
        activeProofsData.forEach((proof) => {
          const remaining = Math.max(0, new Date(proof.expiresAt) - new Date());
          if (remaining > 0) {
            if (updated[proof.proofId] !== remaining) {
              updated[proof.proofId] = remaining;
              hasChanges = true;
            }
            hasActive = true;
          } else {
            if (updated[proof.proofId] !== 0) {
              updated[proof.proofId] = 0;
              hasChanges = true;
            }
          }
        });

        // Only return updated object if there are actual changes
        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [requestDetails, activeProofsData]);

  const fetchCredentials = async (authToken) => {
    try {
      const res = await axios.get('${API_URL}/api/credentials', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.data.success && res.data.credentials) {
        console.log('✅ Credentials fetched:', res.data.credentials);
        // Filter out inactive/revoked credentials
        const activeCredentials = res.data.credentials.filter(cred => cred.isActive === true);
        setCredentials(activeCredentials);
      } else {
        console.log('⚠️ No credentials in response');
        setCredentials([]);
      }
    } catch (err) {
      console.error('❌ Error fetching credentials:', err.message);
      if (err.response?.status === 401) {
        console.error('Authentication failed - token may be expired');
        handleLogout();
      } else {
        setCredentials([]);
      }
    }
  };

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.clear(); // Clear any other cached data
    
    // Clear axios default headers if any
    delete axios.defaults.headers.common['Authorization'];
    
    // Force page reload to clear all state
    window.location.href = '/login';
  };

  const fetchVerificationHistory = async (authToken) => {
    try {
      const res = await axios.get('${API_URL}/api/verification/history', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      // Filter only pending requests
      const pending = res.data.filter(v => v.status === 'pending');
      setPendingRequests(pending);
    } catch (err) {
      console.error('Error fetching verification history:', err);
    }
  };

  const fetchActiveProofs = async (authToken) => {
    try {
      const res = await axios.get('${API_URL}/api/verification/my-proofs', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.data.success) {
        setActiveProofsData(res.data.proofs || []);
      }
    } catch (err) {
      console.error('Error fetching proofs:', err);
    }
  };

  const addDemoCredential = async () => {
    setLoading(true);
    try {
      await axios.post(
        '${API_URL}/api/wallet/add-credential',
        {
          type: 'government_id',
          issuer: 'DigiLocker (Demo)',
          data: {
            fullName: user?.name || 'Jameen',
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

  const getRequestDetails = async (requestId) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/verification/request/${requestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      console.error('Error fetching request details:', err);
      return null;
    }
  };

  const approve = async () => {
    if (!requestDetails) {
      setStatus('error');
      setMessage('Please select a request first');
      return;
    }

    if (!selectedCredentialId) {
      setStatus('error');
      setMessageType('error');
      setMessage('❌ Please select a credential to use for verification');
      return;
    }

    setLoading(true);
    setMessage('');

    // Start blockchain anchoring process
    await startBlockchainAnchoring(requestDetails.requestId);
    
    setLoading(false);
  };

  const rejectRequest = async () => {
    if (!requestDetails) {
      setStatus('error');
      setMessage('Please select a request first');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const rejectRes = await axios.post(
        `${API_URL}/api/verification/reject/${requestDetails.requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (rejectRes.data.success) {
        setStatus('rejected');
        setMessageType('error');
        setMessage('❌ Verification request rejected.');
        setCode('');
        setRequestDetails(null);
        setShowRequestDetails(false);
        setTimeout(() => {
          setStatus('');
          setMessage('');
        }, 3000);
      }
    } catch (err) {
      setStatus('error');
      setMessageType('error');
      const errorMsg = err.response?.data?.message || 'Failed to reject request';
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const revokeProof = async (proofId) => {
    setLoading(true);
    try {
      const revokeRes = await axios.post(
        `${API_URL}/api/verification/proofs/revoke/${proofId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (revokeRes.data.success) {
        setMessage('✅ Proof revoked successfully');
        setMessageType('success');
        setStatus('revoked');
        fetchActiveProofs(token);
        setTimeout(() => {
          setStatus('');
          setMessage('');
        }, 3000);
      }
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Failed to revoke proof'}`);
      setMessageType('error');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleShowRequestDetails = async () => {
    if (!code.trim()) {
      setStatus('error');
      setMessage('Please enter a verification code');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await axios.get(
        `${API_URL}/api/verification/request/${code}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        setRequestDetails(res.data.request);
        setShowRequestDetails(true);
        setStatus('');
        setMessage('');
      }
    } catch (err) {
      setStatus('error');
      setMessageType('error');
      const errorMsg = err.response?.data?.message || 'Verification request not found or expired';
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const deny = async () => {
    if (!requestDetails) {
      setStatus('error');
      setMessage('Please select a request first');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const rejectRes = await axios.post(
        `${API_URL}/api/verification/reject/${requestDetails.requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (rejectRes.data.success) {
        setStatus('rejected');
        setMessageType('error');
        setMessage('❌ Verification request rejected.');
        setCode('');
        setRequestDetails(null);
        setShowRequestDetails(false);
        setTimeout(() => {
          setStatus('');
          setMessage('');
        }, 3000);
      }
    } catch (err) {
      setStatus('error');
      setMessageType('error');
      const errorMsg = err.response?.data?.message || 'Failed to reject request';
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setStatus('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="top-navbar">
          <div className="navbar-left">
            <a href="#" className="navbar-logo">VerifyOnce</a>
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 'calc(100vh - 70px)',
          color: '#e5e7eb',
          fontSize: '18px'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  // Ensure user role is correct
  if (user.role !== 'user') {
    return (
      <div className="dashboard-container">
        <div className="top-navbar">
          <div className="navbar-left">
            <a href="#" className="navbar-logo">VerifyOnce</a>
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 'calc(100vh - 70px)',
          color: '#ef4444',
          fontSize: '18px',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h2>Access Denied</h2>
          <p>This wallet is only for users (role: user). You are logged in as: {user.role}</p>
        </div>
      </div>
    );
  }

  const TopNavbar = () => (
    <div className="top-navbar">
      <div className="navbar-left">
        <a href="#" className="navbar-logo">VerifyOnce</a>
        <div className="navbar-search">
          <i className="bi bi-search search-icon"></i>
          <input type="text" placeholder="Search credentials, requests, or activities..." />
        </div>
      </div>
      <div className="navbar-right">
        <div className="notification-badge">
          <i className="bi bi-bell-fill"></i>
          <span className="notification-count">{notifications.length}</span>
        </div>
        <div className="user-menu">
          <div className="user-avatar">{user.name?.charAt(0) || 'J'}</div>
          <span>{user.name || 'Jameen'}</span>
        </div>
        <button className="p-8" title="Settings"><i className="bi bi-gear-fill"></i></button>
        <button className="p-8" title="Help"><i className="bi bi-question-circle-fill"></i></button>
        <button className="p-8" onClick={handleLogout} title="Logout"><i className="bi bi-box-arrow-right"></i></button>
      </div>
    </div>
  );

  const LeftSidebar = () => (
    <div className={`left-sidebar ${sidebarOpen ? 'open' : ''}`}>
      <ul className="sidebar-nav">
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`} 
             onClick={() => setActiveSection('dashboard')}>
            <i className="bi bi-house-door-fill nav-icon"></i>
            <span>Dashboard</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'credentials' ? 'active' : ''}`}
             onClick={() => setActiveSection('credentials')}>
            <i className="bi bi-folder-fill nav-icon"></i>
            <span>Credentials</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'requests' ? 'active' : ''}`}
             onClick={() => setActiveSection('requests')}>
            <i className="bi bi-inbox-fill nav-icon"></i>
            <span>Verification Requests</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'proofs' ? 'active' : ''}`}
             onClick={() => setActiveSection('proofs')}>
            <i className="bi bi-shield-lock-fill nav-icon"></i>
            <span>Active Proofs</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'activity' ? 'active' : ''}`}
             onClick={() => setActiveSection('activity')}>
            <i className="bi bi-graph-up nav-icon"></i>
            <span>Activity Log</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'security' ? 'active' : ''}`}
             onClick={() => setActiveSection('security')}>
            <i className="bi bi-shield-fill-check nav-icon"></i>
            <span>Security</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className={`nav-link ${activeSection === 'add' ? 'active' : ''}`}
             onClick={() => setActiveSection('add')}>
            <i className="bi bi-plus-circle-fill nav-icon"></i>
            <span>Add Credential</span>
          </a>
        </li>
      </ul>
      
      <div className="sidebar-section">
        <div className="section-title">Quick Actions</div>
        <div className="quick-actions">
          <button className="btn-danger quick-action-btn"><i className="bi bi-exclamation-triangle-fill"></i> Emergency Revoke</button>
          <button className="btn-secondary quick-action-btn"><i className="bi bi-lock-fill"></i> Lock Wallet</button>
          <button className="btn-secondary quick-action-btn"><i className="bi bi-download"></i> Export Logs</button>
        </div>
      </div>
    </div>
  );

  const WalletOverview = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h3>Wallet Overview</h3>
      </div>
      
      <div className="wallet-overview">
        <div className="wallet-identity">
          <div className="identity-header">
            <div className="user-avatar" style={{width: '48px', height: '48px', fontSize: '1.2rem'}}>
              {user.name?.charAt(0) || 'J'}
            </div>
            <div>
              <h4>{user.name || 'Jameen'}</h4>
              <div className="did-info">DID: verifyonce:user-abc123</div>
              <div className="status-indicator">
                <span className="status-dot"></span>
                <span>Active</span>
              </div>
            </div>
          </div>
          <p><strong>Device:</strong> Desktop • Chrome</p>
          <p><strong>Last login:</strong> 2 mins ago</p>
        </div>
        
        <div className="quick-stats">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{stats.totalVerifications}</span>
              <span className="stat-label">Total Verifs</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.activeProofs}</span>
              <span className="stat-label">Active Proofs</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.privacyScore}/100</span>
              <span className="stat-label">Privacy Score</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.expiryAlerts}</span>
              <span className="stat-label">Expiry Alerts</span>
            </div>
          </div>
          <button className="btn-primary" style={{width: '100%', marginTop: '12px'}}>
            View Detailed Analytics <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
      
      {credentials.length > 0 && (
        <div className="primary-credential">
          <h4><i className="bi bi-person-badge-fill"></i> Government ID (DigiLocker)</h4>
          <div className="credential-meta">
            <strong>Valid until:</strong> 12/12/2026 • <strong>Status:</strong> <i className="bi bi-check-circle-fill text-success"></i> ACTIVE
          </div>
          <p>Contains: Name, DOB, Nationality, Address, Photo (all encrypted)</p>
          <p>Last used: 2 hours ago by Grand Hotel Mumbai</p>
          <div className="credential-actions">
            <button>View Details</button>
            <button>Generate Proof</button>
            <button>Renew</button>
          </div>
        </div>
      )}
    </div>
  );

  const CredentialVault = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h3>🔐 Credential Vault</h3>
        <button
          onClick={() => setActiveSection('add')}
          style={{
            padding: '10px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          + Add New Credential
        </button>
      </div>

      {messageType === 'success' && message && (
        <div style={{
          padding: '14px 16px',
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '8px',
          marginBottom: '16px',
          color: '#166534',
          fontWeight: '500',
          fontSize: '14px'
        }}>
          {message}
        </div>
      )}
      
      {credentials && credentials.length > 0 ? (
        <div className="credential-vault" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {credentials.map((cred) => (
            <div key={cred._id} style={{
              background: 'linear-gradient(145deg, #1a1a1f, #0f0f13)',
              border: '1px solid rgba(255, 122, 0, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 122, 0, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 122, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 122, 0, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <h4 style={{ margin: 0, color: '#FF7A00', fontSize: '16px', fontWeight: '700', textTransform: 'capitalize' }}>
                      {cred.type.replace(/_/g, ' ')}
                    </h4>
                    {/* DigiLocker Badge */}
                    {cred.issuer && cred.issuer.toLowerCase().includes('digilocker') && (
                      <span style={{
                        padding: '2px 6px',
                        fontSize: '10px',
                        fontWeight: '700',
                        borderRadius: '4px',
                        background: 'linear-gradient(135deg, #FF7A00 0%, #FFB347 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        🏛️ DigiLocker
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>{cred.issuer}</p>
                </div>
                <span style={{
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  borderRadius: '6px',
                  background: cred.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: cred.isActive ? '#10b981' : '#ef4444',
                  border: `1px solid ${cred.isActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                }}>
                  {cred.isActive ? '✓ ACTIVE' : '✗ INACTIVE'}
                </span>
              </div>

              <div style={{ padding: '16px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '16px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Full Name: </span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#e5e7eb' }}>{cred.fullName}</span>
                </div>
                {cred.nationality && (
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Nationality: </span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#e5e7eb' }}>{cred.nationality}</span>
                  </div>
                )}
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Verified: </span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>Yes</span>
                </div>
              </div>

              <div style={{ marginBottom: '16px', fontSize: '12px', color: '#9ca3af' }}>
                <strong style={{ color: '#FF7A00' }}>Valid until:</strong> {new Date(cred.validUntil).toLocaleDateString()}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => viewCredential(cred._id)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    background: 'linear-gradient(135deg, #FF7A00 0%, #FF9500 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '13px',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(255, 122, 0, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(255, 122, 0, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(255, 122, 0, 0.3)';
                  }}
                >
                  <i className="bi bi-eye-fill"></i> View
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this credential? This action cannot be undone.')) {
                      revokeCredential(cred._id);
                    }
                  }}
                  disabled={!cred.isActive}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    background: cred.isActive ? 'linear-gradient(135deg, #1a1a1f 0%, #0f0f13 100%)' : 'rgba(55, 65, 81, 0.3)',
                    color: cred.isActive ? '#ef4444' : '#6b7280',
                    border: cred.isActive ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(107, 114, 128, 0.2)',
                    borderRadius: '8px',
                    cursor: cred.isActive ? 'pointer' : 'not-allowed',
                    fontWeight: '700',
                    fontSize: '13px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  onMouseOver={(e) => {
                    if (cred.isActive) {
                      e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (cred.isActive) {
                      e.target.style.background = 'linear-gradient(135deg, #1a1a1f 0%, #0f0f13 100%)';
                      e.target.style.color = '#ef4444';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  <i className="bi bi-trash3-fill"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(145deg, #1a1a1f, #0f0f13)',
          border: '2px solid rgba(255, 122, 0, 0.3)',
          borderRadius: '12px',
          padding: '48px 32px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔑</div>
          <h4 style={{ margin: '0 0 12px', color: '#FF7A00', fontSize: '22px', fontWeight: '700' }}>No Credentials Yet</h4>
          <p style={{ margin: '0 0 24px', color: '#9ca3af', fontSize: '15px', lineHeight: '1.6' }}>
            Create your first identity credential to start using VerifyOnce.<br />
            Connect DigiLocker or add credentials manually.
          </p>
          <button
            onClick={() => setActiveSection('add')}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #FF7A00 0%, #FF9500 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '15px',
              boxShadow: '0 4px 12px rgba(255, 122, 0, 0.4)',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(255, 122, 0, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(255, 122, 0, 0.4)';
            }}
          >
            <i className="bi bi-plus-circle-fill"></i> Create Credential
          </button>
        </div>
      )}

      {/* Connected Issuers Section */}
      {isDigiLockerConnected && (
        <div style={{ marginTop: '32px' }}>
          <h4 style={{ margin: '0 0 16px', color: '#FF7A00', fontSize: '18px', fontWeight: '700' }}>
            <i className="bi bi-link-45deg"></i> Connected Issuers
          </h4>
          <div style={{
            background: 'linear-gradient(145deg, #1a1a1f, #0f0f13)',
            border: '1px solid rgba(255, 122, 0, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                background: 'linear-gradient(135deg, #FF7A00 0%, #FFB347 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(255, 122, 0, 0.3)'
              }}>
                <i className="bi bi-bank2" style={{ fontSize: '20px', color: 'white' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <h5 style={{ margin: '0 0 4px', color: '#e5e7eb', fontSize: '16px', fontWeight: '700' }}>DigiLocker</h5>
                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#9ca3af' }}>
                  Connected: {new Date().toLocaleDateString()}
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: '#10b981', fontWeight: '600' }}>
                  <i className="bi bi-check-circle-fill"></i> {credentials.filter(c => c.issuer && c.issuer.toLowerCase().includes('digilocker')).length} Credentials Active
                </p>
              </div>
              <button
                onClick={() => setShowDisconnectModal(true)}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(145deg, #1a1a1f, #0f0f13)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'linear-gradient(145deg, #1a1a1f, #0f0f13)';
                  e.target.style.color = '#ef4444';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credential Detail Modal */}
      {showCredentialModal && viewingCredential && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, color: '#1f2937' }}>Credential Details</h3>
              <button
                onClick={() => {
                  setShowCredentialModal(false);
                  setViewingCredential(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>CREDENTIAL TYPE</label>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937', textTransform: 'capitalize' }}>
                  {viewingCredential.type.replace(/_/g, ' ')}
                </p>
              </div>

              <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>ISSUER</label>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{viewingCredential.issuer}</p>
              </div>

              <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>FULL NAME</label>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{viewingCredential.fullName}</p>
              </div>

              {viewingCredential.dateOfBirth && (
                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>DATE OF BIRTH</label>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                    {new Date(viewingCredential.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
              )}

              {viewingCredential.nationality && (
                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>NATIONALITY</label>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{viewingCredential.nationality}</p>
                </div>
              )}

              {viewingCredential.address && (
                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>ADDRESS</label>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#1f2937', lineHeight: '1.6' }}>{viewingCredential.address}</p>
                </div>
              )}

              <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>STATUS</label>
                <p style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  fontWeight: '600',
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: viewingCredential.isActive ? '#d1fae5' : '#fee2e2',
                  color: viewingCredential.isActive ? '#065f46' : '#991b1b',
                  borderRadius: '4px'
                }}>
                  {viewingCredential.isActive ? '✓ ACTIVE' : '✗ REVOKED'}
                </p>
              </div>

              {/* DigiLocker-specific information */}
              {viewingCredential.issuer && viewingCredential.issuer.toLowerCase().includes('digilocker') && (
                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}>AVAILABLE FOR VERIFICATION</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {viewingCredential.type === 'government_id' && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#10b981' }}>
                          <i className="bi bi-check-circle-fill"></i>
                          <span>Age verification</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#10b981' }}>
                          <i className="bi bi-check-circle-fill"></i>
                          <span>Address verification</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#10b981' }}>
                          <i className="bi bi-check-circle-fill"></i>
                          <span>Identity proof</span>
                        </div>
                      </>
                    )}
                    {viewingCredential.type === 'address_proof' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#10b981' }}>
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Address verification</span>
                      </div>
                    )}
                    {viewingCredential.type === 'birth_certificate' && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#10b981' }}>
                          <i className="bi bi-check-circle-fill"></i>
                          <span>Age verification</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#10b981' }}>
                          <i className="bi bi-check-circle-fill"></i>
                          <span>Identity proof</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Privacy notice for DigiLocker credentials */}
              {viewingCredential.issuer && viewingCredential.issuer.toLowerCase().includes('digilocker') && (
                <div style={{ 
                  marginBottom: '16px', 
                  padding: '12px', 
                  background: 'rgba(255, 122, 0, 0.05)', 
                  border: '1px solid rgba(255, 122, 0, 0.2)', 
                  borderRadius: '8px' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <i className="bi bi-shield-lock-fill" style={{ color: '#FF7A00', fontSize: '16px' }}></i>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#FF7A00' }}>Privacy Protected</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>
                    Raw document never shared. Only zero-knowledge proofs generated for verification requests.
                  </p>
                </div>
              )}

              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                <strong>Valid until:</strong> {new Date(viewingCredential.validUntil).toLocaleDateString()}<br />
                <strong>Verified on:</strong> {new Date(viewingCredential.verifiedAt).toLocaleDateString()}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowCredentialModal(false);
                  setViewingCredential(null);
                }}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: '#e5e7eb',
                  color: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Close
              </button>
              {viewingCredential.isActive && (
                <button
                  onClick={() => {
                    revokeCredential(viewingCredential._id);
                    setShowCredentialModal(false);
                    setViewingCredential(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  🗑️ Revoke Credential
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const LiveRequests = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h3 style={{ color: '#FF7A00', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="bi bi-clipboard-check-fill"></i>
          Verify Requests
        </h3>
      </div>
      
      <div style={{
        background: 'linear-gradient(145deg, #111117, #0E0E14)',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 122, 0, 0.2)',
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}>
        <p style={{ marginBottom: '20px', color: '#9ca3af', fontSize: '14px', lineHeight: '1.6' }}>
          Enter the <strong style={{ color: '#FF7A00' }}>verification code</strong> provided by a business to approve their verification request.
        </p>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'stretch' }}>
          <input
            ref={verificationInputRef}
            type="text"
            className="verification-code-input"
            placeholder="Enter Verification Code (e.g., VF-QWCZM2)"
            value={code}
            onFocus={(e) => {
              isTypingRef.current = true;
              e.target.style.borderColor = 'rgba(255, 122, 0, 0.6)';
              e.target.style.boxShadow = '0 0 0 3px rgba(255, 122, 0, 0.1)';
            }}
            onBlur={(e) => {
              setTimeout(() => {
                isTypingRef.current = false;
              }, 500);
              e.target.style.borderColor = 'rgba(255, 122, 0, 0.3)';
              e.target.style.boxShadow = 'none';
            }}
            onChange={(e) => {
              const newCode = e.target.value.toUpperCase();
              setCode(newCode);
              if (status || message) {
                setStatus('');
                setMessage('');
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const pastedText = e.clipboardData.getData('text').toUpperCase();
              setCode(pastedText);
              if (status || message) {
                setStatus('');
                setMessage('');
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && code.trim()) {
                handleShowRequestDetails();
              }
            }}
            style={{
              flex: 1,
              padding: '14px 16px',
              background: '#000000',
              backgroundColor: '#000000',
              border: '1px solid rgba(255, 122, 0, 0.3)',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'monospace',
              fontWeight: '500',
              color: '#ffffff',
              WebkitTextFillColor: '#ffffff',
              outline: 'none',
              transition: 'all 0.3s ease',
              height: '48px',
              boxSizing: 'border-box'
            }}
            maxLength="11"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            className="view-details-btn"
            onClick={handleShowRequestDetails}
            disabled={!code || loading}
            style={{
              padding: '14px 24px',
              background: code && !loading ? 'linear-gradient(135deg, #FF7A00 0%, #FFB347 100%)' : 'rgba(107, 114, 128, 0.3)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: code && !loading ? 'pointer' : 'not-allowed',
              fontWeight: '700',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              height: '48px',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: code && !loading ? '0 4px 12px rgba(255, 122, 0, 0.4)' : 'none'
            }}
            onMouseOver={(e) => {
              if (code && !loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(255, 122, 0, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              if (code && !loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(255, 122, 0, 0.4)';
              }
            }}
          >
            {loading ? (
              <>
                <i className="bi bi-arrow-clockwise" style={{ animation: 'spin 1s linear infinite' }}></i>
                Loading...
              </>
            ) : (
              <>
                <i className="bi bi-search"></i>
                View Details
              </>
            )}
          </button>
        </div>

        {message && (
          <div style={{
            padding: '14px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '16px',
            backgroundColor: messageType === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: messageType === 'error' ? '#ef4444' : '#10b981',
            border: `1px solid ${messageType === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
          }}>
            {message}
          </div>
        )}

        {/* Show Request Details Card */}
        {showRequestDetails && requestDetails && (
          <div style={{
            background: 'linear-gradient(145deg, #111117, #0E0E14)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '24px',
            marginTop: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, color: '#FF7A00', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-clipboard-data-fill"></i>
                Verification Request Details
              </h3>
              <button
                onClick={() => {
                  setShowRequestDetails(false);
                  setRequestDetails(null);
                }}
                style={{
                  background: 'linear-gradient(145deg, #1a1a1f, #0f0f13)',
                  border: '1px solid rgba(156, 163, 175, 0.3)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: '#9ca3af',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#e5e7eb';
                  e.target.style.borderColor = 'rgba(156, 163, 175, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#9ca3af';
                  e.target.style.borderColor = 'rgba(156, 163, 175, 0.3)';
                }}
              >
                <i className="bi bi-x-lg"></i> Close
              </button>
            </div>

            {/* Who is asking */}
            <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h4 style={{ color: '#3b82f6', marginBottom: '12px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-building-fill"></i>
                Verification Request from
              </h4>
              <div style={{
                background: 'rgba(59, 130, 246, 0.05)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#e5e7eb' }}>
                  {requestDetails.businessName}
                </div>
                <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>
                  Request ID: <code style={{ fontFamily: 'monospace', fontWeight: '600', color: '#FF7A00' }}>{requestDetails.requestId}</code>
                </div>
              </div>
            </div>

            {/* What data they're requesting */}
            <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h4 style={{ color: '#10b981', marginBottom: '12px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-check-circle-fill"></i>
                Will Be Shared
              </h4>
              <div style={{
                background: 'rgba(16, 185, 129, 0.05)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                {requestDetails.requestedData && requestDetails.requestedData.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none' }}>
                    {requestDetails.requestedData.map((item, idx) => (
                      <li key={idx} style={{ padding: '8px 0', color: '#10b981', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bi bi-check-circle-fill"></i>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ color: '#9ca3af' }}>No specific data</div>
                )}
              </div>
            </div>

            {/* What won't be shared */}
            <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h4 style={{ color: '#ef4444', marginBottom: '12px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-shield-lock-fill"></i>
                Will NOT Be Shared
              </h4>
              <div style={{
                background: 'rgba(239, 68, 68, 0.05)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none' }}>
                  <li style={{ padding: '6px 0', color: '#ef4444', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="bi bi-x-circle-fill"></i>
                    Your exact date of birth
                  </li>
                  <li style={{ padding: '6px 0', color: '#ef4444', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="bi bi-x-circle-fill"></i>
                    Your ID number
                  </li>
                  <li style={{ padding: '6px 0', color: '#ef4444', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="bi bi-x-circle-fill"></i>
                    Your document copies
                  </li>
                  {requestDetails.requestedData && !requestDetails.requestedData.includes('address') && (
                    <li style={{ padding: '6px 0', color: '#ef4444', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="bi bi-x-circle-fill"></i>
                      Your address (not requested)
                    </li>
                  )}
                  {requestDetails.requestedData && !requestDetails.requestedData.includes('nationality') && (
                    <li style={{ padding: '6px 0', color: '#ef4444', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="bi bi-x-circle-fill"></i>
                      Your nationality (not requested)
                    </li>
                  )}
                  {requestDetails.requestedData && !requestDetails.requestedData.includes('fullName') && (
                    <li style={{ padding: '6px 0', color: '#ef4444', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="bi bi-x-circle-fill"></i>
                      Your full name (not requested)
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Time Information */}
            <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h4 style={{ color: '#f59e0b', marginBottom: '12px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-clock-fill"></i>
                Expires In
              </h4>
              <div style={{
                background: 'rgba(245, 158, 11, 0.05)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <div style={{ fontSize: '16px', color: '#f59e0b', fontWeight: '600' }}>
                  {new Date(requestDetails.expiresAt).toLocaleTimeString()} today
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                  Act now! This request will expire soon.
                </div>
              </div>
            </div>

            {/* Credential Selection */}
            <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h4 style={{ color: '#3b82f6', marginBottom: '12px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-person-badge-fill"></i>
                Select Credential to Use
              </h4>
              {credentials && credentials.length > 0 ? (
                <div style={{
                  background: 'rgba(59, 130, 246, 0.05)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <div style={{ marginBottom: '12px', fontSize: '13px', color: '#3b82f6', fontWeight: '600' }}>
                    Your Available Credentials:
                  </div>
                  <select
                    value={selectedCredentialId || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedCredentialId(val);
                      if (val) {
                        setMessage('✓ Credential selected');
                        setMessageType('success');
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'linear-gradient(145deg, #1a1a1f, #0f0f13)',
                      border: '1px solid rgba(255, 122, 0, 0.3)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: '#e5e7eb',
                      cursor: 'pointer',
                      marginBottom: '12px',
                      fontWeight: '500',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(255, 122, 0, 0.6)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(255, 122, 0, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 122, 0, 0.3)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="" style={{ background: '#1a1a1f', color: '#e5e7eb' }}>-- Select a credential --</option>
                    {credentials.map((cred) => (
                      <option key={cred._id} value={cred._id} style={{ background: '#1a1a1f', color: '#e5e7eb' }}>
                        {cred.type.replace(/_/g, ' ')}: {cred.issuer} - {cred.fullName} ({cred.isActive ? 'Active' : 'Inactive'})
                      </option>
                    ))}
                  </select>
                  {selectedCredentialId && (
                    <div style={{
                      padding: '12px 16px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: '#10b981',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <i className="bi bi-check-circle-fill"></i>
                      Credential selected and ready for verification!
                    </div>
                  )}
                  {!selectedCredentialId && requestDetails && (
                    <div style={{
                      padding: '12px 16px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <i className="bi bi-info-circle-fill"></i>
                      Please select a credential from the dropdown to proceed with verification
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  fontSize: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    You don't have any credentials yet.
                  </div>
                  <button
                    onClick={() => setActiveSection('add')}
                    style={{
                      padding: '10px 16px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className="bi bi-plus-circle-fill"></i>
                    Go to "Add Credential"
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={approve}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  background: loading ? 'rgba(107, 114, 128, 0.3)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.4)'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.6)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <i className="bi bi-arrow-clockwise" style={{ animation: 'spin 1s linear infinite' }}></i>
                    Approving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle-fill"></i>
                    Approve Request
                  </>
                )}
              </button>
              <button
                onClick={deny}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  background: loading ? 'rgba(107, 114, 128, 0.3)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(239, 68, 68, 0.4)'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.6)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <i className="bi bi-arrow-clockwise" style={{ animation: 'spin 1s linear infinite' }}></i>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-x-circle-fill"></i>
                    Reject Request
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Verification History - Move down */}
      {!showRequestDetails && (
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ marginBottom: '16px', color: '#FF7A00', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bi bi-clock-history"></i>
            Pending Requests
          </h4>
          <div style={{
            background: 'linear-gradient(145deg, #111117, #0E0E14)',
            border: '1px solid rgba(255, 122, 0, 0.2)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ background: 'rgba(255, 122, 0, 0.1)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#FF7A00', fontSize: '14px' }}>Verifier</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#FF7A00', fontSize: '14px' }}>Purpose</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#FF7A00', fontSize: '14px' }}>Code</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#FF7A00', fontSize: '14px' }}>Expires</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <td style={{ padding: '16px', color: '#e5e7eb', fontSize: '14px' }}>{request.businessName}</td>
                      <td style={{ padding: '16px', color: '#9ca3af', fontSize: '14px' }}>{request.purpose}</td>
                      <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: '600', color: '#FF7A00', fontSize: '14px' }}>{request.requestId}</td>
                      <td style={{ padding: '16px', fontSize: '12px', color: '#f59e0b' }}>
                        {new Date(request.expiresAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ 
                      padding: '32px', 
                      textAlign: 'center', 
                      color: '#9ca3af', 
                      fontSize: '14px',
                      fontStyle: 'italic'
                    }}>
                      No pending requests at the moment
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const ActiveProofs = () => {
    const getDataTypeLabel = (dataType) => {
      const labels = {
        ageVerified: 'Age Verified',
        age: 'Current Age',
        nationality: 'Nationality',
        fullName: 'Full Name',
        address: 'Address',
        identityVerified: 'Identity'
      };
      return labels[dataType] || dataType;
    };

    const formatSharedData = (sharedData) => {
      if (!sharedData) return [];
      const items = [];
      for (const [key, value] of Object.entries(sharedData)) {
        if (value !== null && value !== undefined && value !== false) {
          if (key === 'ageVerified') {
            items.push(`Age Verified: ${value ? '✓ Yes (18+)' : '✗ No'}`);
          } else if (key === 'age') {
            items.push(`Age: ${value} years`);
          } else if (key === 'nationality') {
            items.push(`Nationality: ${value}`);
          } else if (key === 'fullName') {
            items.push(`Full Name: ${value}`);
          } else if (key === 'address') {
            items.push(`Address: ${value}`);
          } else if (key === 'identityVerified') {
            items.push(`Identity: ✓ Verified`);
          }
        }
      }
      return items;
    };

    return (
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Your Active Proofs</h3>
        </div>
        
        {activeProofsData.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            background: '#f3f4f6',
            borderRadius: '8px',
            color: '#666'
          }}>
            <p>No active proofs. You haven't approved any requests yet.</p>
          </div>
        ) : (
          <div className="proofs-list">
            {activeProofsData.map((proof) => {
              const remaining = countdownTimers[proof.proofId] || 0;
              const minutes = Math.floor(remaining / 60000);
              const seconds = Math.floor((remaining % 60000) / 1000);
              const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

              return (
                <div key={proof.proofId} style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#111' }}>
                        {proof.businessName}
                      </h4>
                      <p style={{ margin: '0', fontSize: '0.85rem', color: '#666' }}>
                        Proof ID: {proof.proofId}
                      </p>
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: remaining > 60000 ? '#10b981' : remaining > 30000 ? '#f59e0b' : '#ef4444',
                      textAlign: 'right'
                    }}>
                      {timeString}
                    </div>
                  </div>

                  <div style={{
                    background: '#f9fafb',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ fontSize: '0.9rem', color: '#374151', fontWeight: '500', marginBottom: '8px' }}>
                      DATA SHARED:
                    </div>
                    {formatSharedData(proof.sharedData).map((item, idx) => (
                      <div key={idx} style={{ fontSize: '0.85rem', color: '#555', marginBottom: '4px' }}>
                        • {item}
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '12px' }}>
                    Created: {new Date(proof.createdAt).toLocaleTimeString()}
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure? ${proof.businessName} will lose access immediately.`)) {
                        revokeProof(proof.proofId);
                      }
                    }}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: loading ? '#d1d5db' : '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    {loading ? '⏳' : '🔒 Revoke Proof'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const ActivityLog = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h3>Verification Activity Log</h3>
      </div>
      
      <div className="activity-analytics">
        <h4><i className="bi bi-graph-up"></i> Analytics Dashboard</h4>
        <div className="analytics-dashboard">
          <div className="stat-item">
            <span className="stat-value">{stats.totalVerifications}</span>
            <span className="stat-label">Total Verifications</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.approvalRate}%</span>
            <span className="stat-label">Approved Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">16%</span>
            <span className="stat-label">Rejected Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.avgResponseTime}</span>
            <span className="stat-label">Avg. Response Time</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.dataExposure}</span>
            <span className="stat-label">Data Exposure (Minutes)</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.privacyScore}/100</span>
            <span className="stat-label">Privacy Score</span>
          </div>
        </div>
        
        <h4>Detailed Activity Table</h4>
        <table className="activity-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Verifier</th>
              <th>Request Type</th>
              <th>Attributes</th>
              <th>Status</th>
              <th>Blockchain</th>
            </tr>
          </thead>
          <tbody>
            {verificationHistory && verificationHistory.length > 0 ? (
              verificationHistory.slice(0, 10).map((verification, idx) => (
                <tr key={verification._id || idx}>
                  <td>{new Date(verification.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(verification.createdAt).toLocaleTimeString()}</td>
                  <td>{verification.businessName}</td>
                  <td>{verification.purpose || 'General Verification'}</td>
                  <td>{verification.requestedData ? verification.requestedData.join(', ') : 'N/A'}</td>
                  <td>
                    <span className={`badge ${verification.status === 'approved' ? 'badge-success' : 'badge-danger'}`}>
                      {verification.status === 'approved' ? (
                        <><i className="bi bi-check-circle-fill"></i> Approved</>
                      ) : (
                        <><i className="bi bi-x-circle-fill"></i> {verification.status}</>
                      )}
                    </span>
                  </td>
                  <td>
                    {verification.status === 'approved' && verification.blockchain ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          color: '#10b981', 
                          fontSize: '12px', 
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          ⛓️ Block #{verification.blockchain.blockNumber}
                        </span>
                        <button
                          onClick={() => window.open(`/explorer/${verification.blockchain.txHash}`, '_blank')}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#3b82f6',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '2px 4px',
                            borderRadius: '3px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = 'none';
                          }}
                          title="View on Block Explorer"
                        >
                          🔍
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>—</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              activityLog.map((activity, idx) => (
                <tr key={idx}>
                  <td>{activity.date}</td>
                  <td>{activity.time}</td>
                  <td>{activity.verifier}</td>
                  <td>{activity.request}</td>
                  <td>{activity.attributes}</td>
                  <td>
                    <span className={`badge ${activity.status === 'approved' ? 'badge-success' : 'badge-danger'}`}>
                      {activity.status === 'approved' ? <><i className="bi bi-check-circle-fill"></i> Approved</> : <><i className="bi bi-x-circle-fill"></i> Rejected</>}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>Legacy</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        <div className="d-flex justify-between align-center" style={{marginTop: '16px'}}>
          <div>Rows per page: 25 ▼ | 1-{Math.min(10, (verificationHistory?.length || 0) + activityLog.length)} of {stats.totalVerifications}</div>
          <div className="d-flex gap-8">
            <button className="btn-secondary"><i className="bi bi-chevron-left"></i> Previous</button>
            <button className="btn-secondary">Next <i className="bi bi-chevron-right"></i></button>
          </div>
        </div>
        
        <div className="d-flex gap-12" style={{marginTop: '16px'}}>
          <button className="btn-secondary"><i className="bi bi-file-earmark-spreadsheet"></i> Export as CSV</button>
          <button className="btn-secondary"><i className="bi bi-file-earmark-pdf"></i> Export as PDF</button>
          <button className="btn-primary"><i className="bi bi-file-earmark-text"></i> Generate Activity Report</button>
        </div>
      </div>
    </div>
  );

  const SecurityDashboard = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h3>Security & Privacy Center</h3>
      </div>
      
      <div className="security-dashboard">
        <div className="security-status">
          <h4><i className="bi bi-shield-fill-check"></i> ALL SYSTEMS SECURE</h4>
          <div style={{marginTop: '16px', textAlign: 'left'}}>
            <p><i className="bi bi-check-circle-fill"></i> Wallet bound to this device (Browser fingerprint stored)</p>
            <p><i className="bi bi-check-circle-fill"></i> Biometric authentication required for sensitive actions</p>
            <p><i className="bi bi-check-circle-fill"></i> Private key encrypted with AES-256</p>
            <p><i className="bi bi-check-circle-fill"></i> Last security audit: 2 days ago</p>
            <p><i className="bi bi-check-circle-fill"></i> No suspicious activity detected</p>
          </div>
        </div>
        
        <div className="security-grid">
          <div className="security-section">
            <h4>Active Sessions</h4>
            <table className="sessions-table">
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Location</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><i className="bi bi-display"></i> Chrome</td>
                  <td>Mumbai, IN</td>
                  <td>2 minutes ago</td>
                  <td><span className="badge badge-success">Current</span></td>
                </tr>
                <tr>
                  <td><i className="bi bi-phone"></i> iPhone</td>
                  <td>Delhi, IN</td>
                  <td>3 hours ago</td>
                  <td><button className="btn-danger" style={{fontSize: '0.8rem', padding: '4px 8px'}}>Revoke</button></td>
                </tr>
              </tbody>
            </table>
            <button className="btn-danger" style={{marginTop: '12px', width: '100%'}}>
              Revoke All Other Sessions
            </button>
          </div>
          
          <div className="security-section">
            <h4>Security Settings</h4>
            <div style={{marginTop: '16px'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                <input type="checkbox" />
                Require 2FA for all logins
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                <input type="checkbox" defaultChecked />
                Notify on new device login
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                <input type="checkbox" defaultChecked />
                Auto-reject suspicious requests
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'}}>
                <input type="checkbox" />
                Developer mode
              </label>
              <button className="btn-primary" style={{width: '100%'}}>Save Settings</button>
            </div>
          </div>
        </div>
        
        <div className="emergency-controls">
          <h4 style={{color: '#dc2626', marginBottom: '16px'}}><i className="bi bi-exclamation-triangle-fill"></i> Emergency Controls</h4>
          <div className="d-flex gap-12">
            <button className="emergency-btn">Revoke All Active Proofs</button>
            <button className="emergency-btn">Lock Wallet Temporarily</button>
            <button className="emergency-btn">Factory Reset Wallet</button>
          </div>
          <p style={{fontSize: '0.8rem', color: '#991b1b', marginTop: '8px'}}>
            <i className="bi bi-exclamation-triangle-fill"></i> These actions are irreversible and immediate
          </p>
        </div>
      </div>
    </div>
  );

  const handleCredentialInputChange = (field, value) => {
    setCredentialForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitCredential = async () => {
    // Validation
    if (!credentialForm.fullName || !credentialForm.dateOfBirth || !credentialForm.aadhaarLast4 || !credentialForm.address) {
      setMessage('❌ Please fill in all required fields');
      setMessageType('error');
      return;
    }

    // Validate DOB is in the past
    const dob = new Date(credentialForm.dateOfBirth);
    if (dob > new Date()) {
      setMessage('❌ Date of birth cannot be in the future');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(
        '${API_URL}/api/credentials/create',
        {
          type: credentialForm.type,
          fullName: credentialForm.fullName,
          dateOfBirth: credentialForm.dateOfBirth,
          nationality: credentialForm.nationality,
          aadhaarLast4: credentialForm.aadhaarLast4,
          address: credentialForm.address
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessage('✅ Credential verified and added to your wallet!');
        setMessageType('success');
        // Reset form and refresh credentials list
        setCredentialForm({
          type: 'government_id',
          fullName: '',
          dateOfBirth: '',
          nationality: 'Indian',
          aadhaarLast4: '',
          address: ''
        });
        setSelectedCredentialId(null);
        // Refresh credentials immediately (use token directly from closure)
        const authToken = localStorage.getItem('token');
        if (authToken) {
          const credRes = await axios.get('${API_URL}/api/credentials', {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          if (credRes.data.success && credRes.data.credentials) {
            setCredentials(credRes.data.credentials);
          }
        }
        setTimeout(() => {
          setActiveSection('credentials');
        }, 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setMessage(`❌ ${errorMsg}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const viewCredential = async (credentialId) => {
    try {
      const authToken = localStorage.getItem('token');
      const res = await axios.get(
        `${API_URL}/api/credentials/${credentialId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (res.data.success) {
        setViewingCredential(res.data.credential);
        setShowCredentialModal(true);
      }
    } catch (err) {
      setMessage(`❌ Failed to load credential: ${err.message}`);
      setMessageType('error');
    }
  };

  const revokeCredential = async (credentialId) => {
    if (!window.confirm('Are you sure you want to revoke this credential? You will not be able to use it for verifications.')) {
      return;
    }

    setLoading(true);
    try {
      const authToken = localStorage.getItem('token');
      const res = await axios.delete(
        `${API_URL}/api/credentials/${credentialId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (res.data.success) {
        setMessage('✅ Credential revoked successfully');
        setMessageType('success');
        // Refresh credentials
        const credRes = await axios.get('${API_URL}/api/credentials', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (credRes.data.success && credRes.data.credentials) {
          setCredentials(credRes.data.credentials);
        }
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (err) {
      setMessage(`❌ Failed to revoke credential: ${err.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // DigiLocker Integration Functions
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const generateFakeDigiLockerCredentials = () => {
    const timestamp = Date.now();
    const userName = user?.name || 'John Doe';
    
    return [
      {
        id: `digilocker_aadhaar_${timestamp}`,
        type: 'government_id',
        issuer: 'DigiLocker - UIDAI',
        issuer_logo: '🏛️',
        credential_name: 'Aadhaar Card',
        issued_date: new Date().toISOString(),
        valid_until: new Date(Date.now() + 365*24*60*60*1000).toISOString(),
        status: 'ACTIVE',
        fullName: userName,
        dateOfBirth: '1990-05-15',
        nationality: 'Indian',
        address: '123 MG Road, Bangalore, Karnataka - 560001',
        aadhaarLast4: Math.floor(1000 + Math.random() * 9000).toString(),
        fields_available: ['name', 'age', 'gender', 'address', 'id_number'],
        verification_methods: ['age_proof', 'address_proof', 'identity_proof'],
        isActive: true,
        source: 'digilocker'
      },
      {
        id: `digilocker_address_${timestamp + 1}`,
        type: 'address_proof',
        issuer: 'DigiLocker - Govt of India',
        issuer_logo: '🏛️',
        credential_name: 'Address Proof',
        issued_date: new Date().toISOString(),
        valid_until: new Date(Date.now() + 180*24*60*60*1000).toISOString(),
        status: 'ACTIVE',
        fullName: userName,
        address: '123 MG Road, Bangalore, Karnataka - 560001',
        fields_available: ['address', 'pincode', 'city', 'state'],
        verification_methods: ['address_proof'],
        isActive: true,
        source: 'digilocker'
      },
      {
        id: `digilocker_dob_${timestamp + 2}`,
        type: 'birth_certificate',
        issuer: 'DigiLocker - Municipal Corporation',
        issuer_logo: '🏛️',
        credential_name: 'Date of Birth Certificate',
        issued_date: new Date().toISOString(),
        valid_until: null,
        status: 'ACTIVE',
        fullName: userName,
        dateOfBirth: '1990-05-15',
        nationality: 'Indian',
        fields_available: ['name', 'dob', 'age'],
        verification_methods: ['age_proof', 'identity_proof'],
        isActive: true,
        source: 'digilocker'
      }
    ];
  };

  const connectDigiLocker = async () => {
    setConnectionStep('loading');
    await sleep(1500);
    setConnectionStep('auth');
  };

  const authorizeDigiLocker = async () => {
    setConnectionStep('processing');
    await sleep(2000);
    
    try {
      const authToken = localStorage.getItem('token');
      
      // Check if DigiLocker credentials already exist
      const existingCredRes = await axios.get('${API_URL}/api/credentials', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      const existingDigiLockerCreds = existingCredRes.data.credentials?.filter(c => 
        c.issuer && c.issuer.toLowerCase().includes('digilocker') && c.isActive
      ) || [];
      
      // If DigiLocker credentials already exist, don't create duplicates
      if (existingDigiLockerCreds.length > 0) {
        console.log('DigiLocker credentials already exist, skipping creation');
        setIsDigiLockerConnected(true);
        localStorage.setItem('digilocker_connected', 'true');
        setConnectionStep('success');
        
        // Refresh credentials list
        await fetchCredentials(authToken);
        
        await sleep(2000);
        setConnectionStep(null);
        return;
      }
      
      const credentials = generateFakeDigiLockerCredentials();
      
      // Store credentials in backend - only store the ones that match backend schema
      // Backend requires fullName and dateOfBirth for all credentials
      const credentialsToStore = [
        {
          type: 'government_id',
          fullName: credentials[0].fullName,
          dateOfBirth: credentials[0].dateOfBirth,
          nationality: credentials[0].nationality,
          aadhaarLast4: credentials[0].aadhaarLast4,
          address: credentials[0].address,
          issuer: credentials[0].issuer
        },
        {
          type: 'address_proof',
          fullName: credentials[1].fullName,
          dateOfBirth: '1990-05-15', // Required by backend
          nationality: 'Indian',
          aadhaarLast4: '0000',
          address: credentials[1].address,
          issuer: credentials[1].issuer
        },
        {
          type: 'birth_certificate',
          fullName: credentials[2].fullName,
          dateOfBirth: credentials[2].dateOfBirth,
          nationality: credentials[2].nationality,
          aadhaarLast4: '0000',
          address: '123 MG Road, Bangalore, Karnataka - 560001',
          issuer: credentials[2].issuer
        }
      ];
      
      for (const cred of credentialsToStore) {
        await axios.post(
          '${API_URL}/api/credentials/create',
          cred,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
      }
      
      setDigiLockerCredentials(credentials);
      setIsDigiLockerConnected(true);
      localStorage.setItem('digilocker_connected', 'true');
      
      setConnectionStep('success');
      
      // Refresh credentials list
      await fetchCredentials(authToken);
      
      await sleep(2000);
      setConnectionStep(null);
    } catch (err) {
      console.error('Failed to connect DigiLocker:', err);
      setMessage('❌ Failed to connect DigiLocker');
      setMessageType('error');
      setConnectionStep(null);
    }
  };

  const disconnectDigiLocker = async () => {
    setShowDisconnectModal(false);
    setLoading(true);
    
    try {
      const authToken = localStorage.getItem('token');
      
      // Remove DigiLocker credentials from backend
      const credRes = await axios.get('${API_URL}/api/credentials', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      if (credRes.data.success && credRes.data.credentials) {
        const digilockerCreds = credRes.data.credentials.filter(c => 
          c.issuer && c.issuer.toLowerCase().includes('digilocker') && c.isActive
        );
        
        for (const cred of digilockerCreds) {
          await axios.delete(
            `${API_URL}/api/credentials/${cred._id}`,
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
        }
      }
      
      setDigiLockerCredentials([]);
      setIsDigiLockerConnected(false);
      localStorage.removeItem('digilocker_connected');
      
      setMessage('✅ DigiLocker disconnected successfully');
      setMessageType('success');
      
      // Refresh credentials
      await fetchCredentials(authToken);
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error('Failed to disconnect DigiLocker:', err);
      setMessage('❌ Failed to disconnect DigiLocker');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Blockchain Anchoring Functions
  const startBlockchainAnchoring = async (requestId) => {
    setCurrentRequestId(requestId);
    setShowBlockchainModal(true);
    setBlockchainStage(1);
    setBlockchainProgress(0);
    setBlockchainData(null);

    try {
      // Stage 1: Generate Proof (0-1 second)
      setBlockchainStage(1);
      setBlockchainProgress(60);
      await sleep(1000);

      // Stage 2: Create Hash (1-2 seconds)
      setBlockchainStage(2);
      setBlockchainProgress(80);
      await sleep(1000);

      // Stage 3: Submit to Blockchain (2-3 seconds)
      setBlockchainStage(3);
      setBlockchainProgress(90);

      console.log('Making blockchain anchoring request...', { requestId, selectedCredentialId });

      // Call backend API to approve and anchor
      const response = await axios.post(
        `${API_URL}/api/verification/approve/${requestId}`,
        { credentialId: selectedCredentialId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Blockchain anchoring response:', response.data);

      if (response.data.success) {
        await sleep(1000);

        // Stage 4: Block Confirmation (3-4 seconds)
        setBlockchainStage(4);
        setBlockchainProgress(100);
        
        // Check if blockchain data exists
        if (response.data.blockchain) {
          setBlockchainData(response.data.blockchain);
          console.log('Blockchain data set:', response.data.blockchain);
        } else {
          console.error('No blockchain data in response');
          // Create mock blockchain data for demo
          const mockBlockchainData = {
            txHash: '0x' + Math.random().toString(16).substr(2, 64),
            blockNumber: 128000 + Math.floor(Math.random() * 1000),
            network: 'Ethereum (Simulated)',
            confirmed: true,
            confirmationTime: '3.2s',
            gasUsed: 23451,
            anchoredAt: new Date().toISOString(),
            status: 'SUCCESS'
          };
          setBlockchainData(mockBlockchainData);
        }
        
        await sleep(500);

        // Stage 5: Success Screen
        setBlockchainStage(5);

        // Update UI state
        setStatus('approved');
        setMessageType('success');
        setCode('');
        setRequestDetails(null);
        setShowRequestDetails(false);

        // Refresh data
        await fetchActiveProofs(token);
        await fetchVerificationHistory(token);
      } else {
        throw new Error(response.data.message || 'Failed to approve verification');
      }
    } catch (error) {
      console.error('Blockchain anchoring failed:', error);
      
      // Show error in modal instead of closing it
      setBlockchainStage('error');
      setBlockchainData({
        error: error.response?.data?.message || error.message || 'Failed to anchor proof to blockchain'
      });
      
      setStatus('error');
      const errorMsg = error.response?.data?.message || error.message || 'Failed to approve request';
      setMessage(`❌ ${errorMsg}`);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessage('✅ Copied to clipboard');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    }).catch(() => {
      setMessage('❌ Failed to copy');
      setMessageType('error');
    });
  };

  const formatTxHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  const formatTimeFromISO = (isoString) => {
    return new Date(isoString).toLocaleTimeString();
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <WalletOverview />;
      case 'credentials':
        return <CredentialVault />;
      case 'requests':
        return <LiveRequests />;
      case 'proofs':
        return <ActiveProofs />;
      case 'activity':
        return <ActivityLog />;
      case 'security':
        return <SecurityDashboard />;
      case 'add':
        return <AddCredentialComponent 
          credentialForm={credentialForm} 
          message={message} 
          messageType={messageType} 
          loading={loading} 
          handleCredentialInputChange={handleCredentialInputChange} 
          submitCredential={submitCredential} 
          setActiveSection={setActiveSection}
          isDigiLockerConnected={isDigiLockerConnected}
          connectDigiLocker={connectDigiLocker}
          setShowDisconnectModal={setShowDisconnectModal}
          digiLockerCredentials={digiLockerCredentials}
        />;
      default:
        return <WalletOverview />;
    }
  };

  return (
    <>
      {/* Main Layout */}
      <div className="dashboard-container">
        {/* TOP NAVBAR */}
        <div className="top-navbar">
          <div className="navbar-left">
            <a href="#" className="navbar-logo">VerifyOnce</a>
            <div className="navbar-search">
              <i className="bi bi-search search-icon"></i>
              <input type="text" placeholder="Search credentials, requests, or activities..." />
            </div>
          </div>
          <div className="navbar-right">
            <div className="notification-badge">
              <i className="bi bi-bell-fill"></i>
              <span className="notification-count">{notifications.length}</span>
            </div>
            <div className="user-menu">
              <div className="user-avatar">{user.name?.charAt(0) || 'J'}</div>
              <span>{user.name || 'Jameen'}</span>
            </div>
            <button className="p-8" title="Settings"><i className="bi bi-gear-fill"></i></button>
            <button className="p-8" title="Help"><i className="bi bi-question-circle-fill"></i></button>
            <button className="p-8" onClick={handleLogout} title="Logout"><i className="bi bi-box-arrow-right"></i></button>
          </div>
        </div>

        {/* APP LAYOUT - RESPONSIVE GRID */}
        <div className="app-layout">
          {/* LEFT SIDEBAR */}
          <aside className="sidebar">
            <ul className="sidebar-nav">
              <li className="nav-item">
                <a href="#" className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`} 
                   onClick={() => setActiveSection('dashboard')}>
                  <i className="bi bi-house-door-fill nav-icon"></i>
                  <span>Dashboard</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className={`nav-link ${activeSection === 'credentials' ? 'active' : ''}`}
                   onClick={() => setActiveSection('credentials')}>
                  <i className="bi bi-folder-fill nav-icon"></i>
                  <span>Credentials</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className={`nav-link ${activeSection === 'requests' ? 'active' : ''}`}
                   onClick={() => setActiveSection('requests')}>
                  <i className="bi bi-inbox-fill nav-icon"></i>
                  <span>Verification Requests</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className={`nav-link ${activeSection === 'proofs' ? 'active' : ''}`}
                   onClick={() => setActiveSection('proofs')}>
                  <i className="bi bi-shield-lock-fill nav-icon"></i>
                  <span>Active Proofs</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className={`nav-link ${activeSection === 'activity' ? 'active' : ''}`}
                   onClick={() => setActiveSection('activity')}>
                  <i className="bi bi-graph-up nav-icon"></i>
                  <span>Activity Log</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className={`nav-link ${activeSection === 'security' ? 'active' : ''}`}
                   onClick={() => setActiveSection('security')}>
                  <i className="bi bi-shield-fill-check nav-icon"></i>
                  <span>Security</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className={`nav-link ${activeSection === 'add' ? 'active' : ''}`}
                   onClick={() => setActiveSection('add')}>
                  <i className="bi bi-plus-circle-fill nav-icon"></i>
                  <span>Add Credential</span>
                </a>
              </li>
            </ul>
            
            <div className="sidebar-section">
              <div className="section-title">Quick Actions</div>
              <div className="quick-actions">
                <button className="btn-danger quick-action-btn"><i className="bi bi-exclamation-triangle-fill"></i> Emergency Revoke</button>
                <button className="btn-secondary quick-action-btn"><i className="bi bi-lock-fill"></i> Lock Wallet</button>
                <button className="btn-secondary quick-action-btn"><i className="bi bi-download"></i> Export Logs</button>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="main-content">
            {renderMainContent()}
          </main>

          {/* RIGHT PANEL */}
          <section className="right-panel">
            <div className="help-card">
              <h4><i className="bi bi-lightbulb-fill"></i> Privacy Tip</h4>
              <p>Your credentials are encrypted and never leave your wallet. Only cryptographic proofs are shared.</p>
            </div>
            
            <div className="help-card">
              <h4><i className="bi bi-shield-fill-check"></i> Security Status</h4>
              <p>All systems secure. Last security check: 2 minutes ago</p>
            </div>
            
            <div className="help-card">
              <h4><i className="bi bi-graph-up"></i> Today's Activity</h4>
              <p>1 verification request approved. Your privacy score remains high at 98/100.</p>
            </div>
            
            <div className="help-card">
              <h4><i className="bi bi-exclamation-triangle-fill"></i> Upcoming Expiry</h4>
              <p>Your address proof expires in 30 days. Consider renewing soon.</p>
            </div>
            
            <div className="help-card">
              <h4><i className="bi bi-question-circle-fill"></i> Need Help?</h4>
              <p>
                <a href="#" style={{color: '#0369a1'}}>View Documentation</a><br />
                <a href="#" style={{color: '#0369a1'}}>Contact Support</a><br />
                <a href="#" style={{color: '#0369a1'}}>Privacy Guide</a>
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* DigiLocker Connection Modals */}
      {connectionStep === 'loading' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #111117, #0E0E14)',
            border: '1px solid rgba(255, 122, 0, 0.2)',
            borderRadius: '16px',
            padding: '48px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ 
              fontSize: '64px', 
              marginBottom: '24px', 
              animation: 'spin 2s linear infinite',
              color: '#FF7A00'
            }}>
              <i className="bi bi-arrow-clockwise"></i>
            </div>
            <h3 style={{ margin: '0 0 12px', color: '#FF7A00', fontSize: '24px' }}>Connecting to DigiLocker...</h3>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '15px' }}>
              Please wait while we establish<br />secure connection
            </p>
          </div>
        </div>
      )}

      {connectionStep === 'auth' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #111117, #0E0E14)',
            border: '1px solid rgba(255, 122, 0, 0.2)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #FF7A00 0%, #FFB347 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 20px rgba(255, 122, 0, 0.3)'
              }}>
                <i className="bi bi-bank2" style={{ fontSize: '32px', color: 'white' }}></i>
              </div>
              <h3 style={{ margin: '0 0 8px', color: '#FF7A00', fontSize: '24px' }}>DigiLocker Authorization</h3>
              <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>Government of India - Digital Locker</p>
            </div>

            <div style={{ 
              background: 'rgba(255, 122, 0, 0.05)', 
              padding: '20px', 
              borderRadius: '12px', 
              marginBottom: '24px',
              border: '1px solid rgba(255, 122, 0, 0.1)'
            }}>
              <p style={{ margin: '0 0 16px', fontWeight: '600', color: '#FF7A00' }}>
                VerifyOnce is requesting access to:
              </p>
              <div style={{ fontSize: '14px', color: '#e5e7eb', lineHeight: '1.8' }}>
                <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="bi bi-check-circle-fill" style={{ color: '#10b981' }}></i>
                  Basic profile information
                </div>
                <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="bi bi-check-circle-fill" style={{ color: '#10b981' }}></i>
                  Government-issued ID
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="bi bi-check-circle-fill" style={{ color: '#10b981' }}></i>
                  Address proof documents
                </div>
              </div>
            </div>

            <div style={{ 
              background: 'rgba(59, 130, 246, 0.05)', 
              padding: '16px', 
              borderRadius: '8px', 
              marginBottom: '24px',
              border: '1px solid rgba(59, 130, 246, 0.1)'
            }}>
              <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#3b82f6' }}>
                This will allow VerifyOnce to:
              </p>
              <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.6' }}>
                <div>• Verify your identity</div>
                <div>• Generate privacy-preserving proofs</div>
                <div>• Never share raw documents</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setConnectionStep(null)}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  background: 'linear-gradient(145deg, #1a1a1f, #0f0f13)',
                  color: '#9ca3af',
                  border: '1px solid rgba(156, 163, 175, 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={authorizeDigiLocker}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, #FF7A00 0%, #FFB347 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '15px',
                  boxShadow: '0 4px 12px rgba(255, 122, 0, 0.4)'
                }}
              >
                Authorize Access
              </button>
            </div>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '20px', 
              fontSize: '12px', 
              color: '#9ca3af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <i className="bi bi-shield-lock-fill"></i>
              <span>Secured by DigiLocker</span>
            </div>
          </div>
        </div>
      )}

      {connectionStep === 'processing' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #111117, #0E0E14)',
            border: '1px solid rgba(255, 122, 0, 0.2)',
            borderRadius: '16px',
            padding: '48px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ 
              fontSize: '64px', 
              marginBottom: '24px', 
              animation: 'spin 2s linear infinite',
              color: '#FF7A00'
            }}>
              <i className="bi bi-arrow-clockwise"></i>
            </div>
            <h3 style={{ margin: '0 0 12px', color: '#FF7A00', fontSize: '24px' }}>Processing Authorization...</h3>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '15px' }}>
              Fetching your credentials securely
            </p>
          </div>
        </div>
      )}

      {connectionStep === 'success' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #111117, #0E0E14)',
            border: '1px solid rgba(255, 122, 0, 0.2)',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
              }}>
                <i className="bi bi-check-lg" style={{ fontSize: '32px', color: 'white' }}></i>
              </div>
              <h3 style={{ margin: '0 0 8px', color: '#FF7A00', fontSize: '26px' }}>Successfully Connected!</h3>
            </div>

            <div style={{ 
              background: 'rgba(16, 185, 129, 0.05)', 
              padding: '20px', 
              borderRadius: '12px', 
              marginBottom: '24px',
              border: '1px solid rgba(16, 185, 129, 0.1)'
            }}>
              <p style={{ margin: '0 0 16px', fontWeight: '600', color: '#10b981', fontSize: '15px' }}>
                Credentials Added:
              </p>
              <div style={{ fontSize: '14px', color: '#e5e7eb', lineHeight: '2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="bi bi-person-badge-fill" style={{ color: '#FF7A00' }}></i>
                  Aadhaar Card
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="bi bi-house-fill" style={{ color: '#FF7A00' }}></i>
                  Address Proof
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="bi bi-calendar-fill" style={{ color: '#FF7A00' }}></i>
                  Date of Birth Certificate
                </div>
              </div>
            </div>

            <p style={{ 
              textAlign: 'center', 
              color: '#9ca3af', 
              fontSize: '14px', 
              marginBottom: '16px',
              lineHeight: '1.6'
            }}>
              Your credentials are now available<br />
              for privacy-preserving verification
            </p>

            {/* Demo Disclaimer */}
            <div style={{ 
              background: 'rgba(59, 130, 246, 0.05)', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '24px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <i className="bi bi-info-circle-fill" style={{ color: '#3b82f6', fontSize: '14px' }}></i>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6' }}>Demo Mode</span>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: '#6b7280', lineHeight: '1.4' }}>
                These are simulated credentials for demonstration purposes. No real government data is accessed.
              </p>
            </div>

            <button
              onClick={() => {
                setConnectionStep(null);
                setActiveSection('credentials');
              }}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '15px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Disconnect Confirmation Modal */}
      {showDisconnectModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #111117, #0E0E14)',
            border: '1px solid rgba(255, 122, 0, 0.2)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '480px',
            width: '90%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)'
              }}>
                <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '32px', color: 'white' }}></i>
              </div>
              <h3 style={{ margin: '0 0 8px', color: '#FF7A00', fontSize: '24px' }}>Disconnect DigiLocker?</h3>
            </div>

            <div style={{ 
              background: 'rgba(239, 68, 68, 0.05)', 
              padding: '20px', 
              borderRadius: '12px', 
              marginBottom: '20px',
              border: '1px solid rgba(239, 68, 68, 0.1)'
            }}>
              <p style={{ margin: '0 0 12px', fontWeight: '600', color: '#ef4444', fontSize: '14px' }}>
                This will remove:
              </p>
              <div style={{ fontSize: '13px', color: '#e5e7eb', lineHeight: '1.8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="bi bi-person-badge-fill" style={{ color: '#ef4444' }}></i>
                  Aadhaar Card credential
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="bi bi-house-fill" style={{ color: '#ef4444' }}></i>
                  Address Proof credential
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="bi bi-calendar-fill" style={{ color: '#ef4444' }}></i>
                  Birth Certificate credential
                </div>
              </div>
            </div>

            <div style={{ 
              background: 'rgba(245, 158, 11, 0.05)', 
              padding: '16px', 
              borderRadius: '8px', 
              marginBottom: '24px',
              border: '1px solid rgba(245, 158, 11, 0.1)'
            }}>
              <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: '600', color: '#f59e0b' }}>
                You will lose ability to:
              </p>
              <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.6' }}>
                <div>• Generate identity proofs</div>
                <div>• Verify age/address</div>
                <div>• Respond to verification requests</div>
              </div>
            </div>

            <p style={{ 
              textAlign: 'center', 
              color: '#9ca3af', 
              fontSize: '13px', 
              marginBottom: '24px'
            }}>
              You can reconnect anytime.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowDisconnectModal(false)}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  background: 'linear-gradient(145deg, #1a1a1f, #0f0f13)',
                  color: '#9ca3af',
                  border: '1px solid rgba(156, 163, 175, 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={disconnectDigiLocker}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  background: loading ? 'rgba(107, 114, 128, 0.3)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  fontSize: '15px',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(239, 68, 68, 0.4)'
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <i className="bi bi-arrow-clockwise" style={{ animation: 'spin 1s linear infinite' }}></i>
                    Disconnecting...
                  </span>
                ) : (
                  'Disconnect'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blockchain Anchoring Modal */}
      {showBlockchainModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #111117, #0E0E14)',
            border: '1px solid rgba(255, 122, 0, 0.2)',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '520px',
            width: '90%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
            textAlign: 'center',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => {
                setShowBlockchainModal(false);
                setBlockchainStage(1);
                setBlockchainData(null);
              }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 122, 0, 0.2)',
                border: '2px solid rgba(255, 122, 0, 0.5)',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FF7A00',
                fontSize: '24px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                padding: 0,
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 122, 0, 0.4)';
                e.target.style.borderColor = '#FF7A00';
                e.target.style.transform = 'scale(1.1)';
                e.target.style.color = '#FFB347';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 122, 0, 0.2)';
                e.target.style.borderColor = 'rgba(255, 122, 0, 0.5)';
                e.target.style.transform = 'scale(1)';
                e.target.style.color = '#FF7A00';
              }}
              title="Close"
            >
              ✕
            </button>
            {/* Stage 1: Generating Proof */}
            {blockchainStage === 1 && (
              <div>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
                <h3 style={{ margin: '0 0 16px', color: '#FF7A00', fontSize: '24px' }}>Generating Proof</h3>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: 'rgba(255, 122, 0, 0.2)', 
                  borderRadius: '4px', 
                  marginBottom: '16px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${blockchainProgress}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #FF7A00, #FFB347)', 
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <p style={{ color: '#e5e7eb', marginBottom: '8px' }}>Creating cryptographic proof...</p>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>Using zero-knowledge protocol</p>
              </div>
            )}

            {/* Stage 2: Creating Hash */}
            {blockchainStage === 2 && (
              <div>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧮</div>
                <h3 style={{ margin: '0 0 16px', color: '#FF7A00', fontSize: '24px' }}>Creating Hash Fingerprint</h3>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: 'rgba(255, 122, 0, 0.2)', 
                  borderRadius: '4px', 
                  marginBottom: '16px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${blockchainProgress}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #FF7A00, #FFB347)', 
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>SHA-256 Hash:</label>
                  <div style={{ 
                    fontFamily: 'Monaco, Consolas, monospace', 
                    fontSize: '14px', 
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    89ab34f09a8c2e7d4f5b6c1a...
                  </div>
                </div>
              </div>
            )}

            {/* Stage 3: Blockchain Submission */}
            {blockchainStage === 3 && (
              <div>
                <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'pulse 2s infinite' }}>⛓️</div>
                <h3 style={{ margin: '0 0 16px', color: '#FF7A00', fontSize: '24px' }}>Submitting to Blockchain</h3>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: 'rgba(255, 122, 0, 0.2)', 
                  borderRadius: '4px', 
                  marginBottom: '16px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${blockchainProgress}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #FF7A00, #FFB347)', 
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <p style={{ color: '#e5e7eb', marginBottom: '8px' }}>Transaction submitted to</p>
                <p style={{ color: '#3b82f6', fontSize: '16px', fontWeight: '600' }}>Ethereum Network...</p>
              </div>
            )}

            {/* Stage 4: Block Confirmation */}
            {blockchainStage === 4 && blockchainData && (
              <div>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧱</div>
                <h3 style={{ margin: '0 0 16px', color: '#FF7A00', fontSize: '24px' }}>Block Confirmed</h3>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: 'rgba(255, 122, 0, 0.2)', 
                  borderRadius: '4px', 
                  marginBottom: '16px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${blockchainProgress}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #10b981, #059669)', 
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <div style={{ color: '#10b981', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  ✅ Block #{blockchainData.blockNumber} Confirmed
                </div>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                  Confirmation Time: {blockchainData.confirmationTime}
                </p>
              </div>
            )}

            {/* Stage 5: Success Screen */}
            {blockchainStage === 5 && blockchainData && (
              <div style={{ textAlign: 'left' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
                  <h2 style={{ margin: '0 0 8px', color: '#10b981', fontSize: '28px' }}>Proof Anchored to Blockchain</h2>
                  <p style={{ color: '#9ca3af', fontSize: '16px' }}>Your verification has been cryptographically secured</p>
                </div>

                <div style={{ height: '1px', background: 'rgba(255, 122, 0, 0.2)', margin: '24px 0' }}></div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#9ca3af', fontSize: '14px' }}>🌐 Network:</span>
                      <span style={{ color: '#e5e7eb', fontWeight: '600' }}>{blockchainData.network}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#9ca3af', fontSize: '14px' }}>Transaction Hash:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          fontFamily: 'Monaco, Consolas, monospace', 
                          fontSize: '12px', 
                          color: '#3b82f6' 
                        }}>
                          {formatTxHash(blockchainData.txHash)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(blockchainData.txHash)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#FF7A00',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          📋
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#9ca3af', fontSize: '14px' }}>🧱 Block Number:</span>
                      <span style={{ color: '#e5e7eb', fontWeight: '600' }}>{blockchainData.blockNumber}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#9ca3af', fontSize: '14px' }}>⛽ Gas Used:</span>
                      <span style={{ color: '#e5e7eb', fontWeight: '600' }}>{blockchainData.gasUsed?.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#9ca3af', fontSize: '14px' }}>⏰ Anchored At:</span>
                      <span style={{ color: '#e5e7eb', fontWeight: '600' }}>{formatTimeFromISO(blockchainData.anchoredAt)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#9ca3af', fontSize: '14px' }}>Status:</span>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>✅ Confirmed</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                  <button
                    onClick={() => copyToClipboard(blockchainData.txHash)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: 'linear-gradient(145deg, #1a1a1f, #0f0f13)',
                      color: '#FF7A00',
                      border: '1px solid rgba(255, 122, 0, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    📋 Copy Hash
                  </button>
                  <button
                    onClick={() => window.open(`/explorer/${blockchainData.txHash}`, '_blank')}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: 'linear-gradient(145deg, #1a1a1f, #0f0f13)',
                      color: '#3b82f6',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    🔍 View Explorer
                  </button>
                </div>

                <div style={{ height: '1px', background: 'rgba(255, 122, 0, 0.2)', margin: '24px 0' }}></div>

                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px', color: '#FF7A00', fontSize: '16px' }}>🔒 Security Features:</h4>
                  <ul style={{ margin: 0, padding: '0 0 0 20px', color: '#10b981', fontSize: '14px', lineHeight: '1.8' }}>
                    <li>✓ Tamper-proof record</li>
                    <li>✓ Immutable on blockchain</li>
                    <li>✓ Cryptographically signed</li>
                    <li>✓ Publicly verifiable</li>
                  </ul>
                </div>

                <div style={{ 
                  background: 'rgba(255, 122, 0, 0.05)', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 122, 0, 0.2)'
                }}>
                  <h4 style={{ margin: '0 0 8px', color: '#FF7A00', fontSize: '14px' }}>⚠️ Privacy Protected:</h4>
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: '13px', lineHeight: '1.5' }}>
                    Only the proof hash is stored on-chain. No personal data is written to the blockchain.
                  </p>
                </div>

                <div style={{ 
                  background: 'rgba(59, 130, 246, 0.05)', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  marginBottom: '24px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: 0, color: '#3b82f6', fontSize: '12px', fontWeight: '600' }}>
                    ⚠️ SIMULATED FOR DEMONSTRATION
                  </p>
                  <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '11px' }}>
                    This is a simulated blockchain for MVP purposes. Production version will use actual blockchain networks.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setShowBlockchainModal(false);
                      setBlockchainStage(1);
                      setBlockchainData(null);
                    }}
                    style={{
                      flex: 1,
                      padding: '14px 20px',
                      background: 'linear-gradient(145deg, #1a1a1f, #0f0f13)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 122, 0, 0.4)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '15px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(145deg, #2a2a2f, #1a1a1f)';
                      e.target.style.borderColor = 'rgba(255, 122, 0, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(145deg, #1a1a1f, #0f0f13)';
                      e.target.style.borderColor = 'rgba(255, 122, 0, 0.4)';
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => {
                      setShowBlockchainModal(false);
                      setActiveSection('activity');
                    }}
                    style={{
                      flex: 2,
                      padding: '14px 20px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '15px',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Error Stage */}
            {blockchainStage === 'error' && blockchainData && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>❌</div>
                <h2 style={{ margin: '0 0 8px', color: '#ef4444', fontSize: '28px' }}>Anchoring Failed</h2>
                <p style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '24px' }}>
                  Failed to anchor proof to blockchain
                </p>
                
                <div style={{ 
                  background: 'rgba(239, 68, 68, 0.05)', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  marginBottom: '24px',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <p style={{ margin: 0, color: '#ef4444', fontSize: '14px' }}>
                    {blockchainData.error}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setShowBlockchainModal(false)}
                    style={{
                      flex: 1,
                      padding: '14px 20px',
                      background: 'linear-gradient(145deg, #1a1a1f, #0f0f13)',
                      color: '#9ca3af',
                      border: '1px solid rgba(156, 163, 175, 0.2)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '15px'
                    }}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowBlockchainModal(false);
                      // Reset and try again
                      setTimeout(() => {
                        startBlockchainAnchoring(currentRequestId);
                      }, 500);
                    }}
                    style={{
                      flex: 1,
                      padding: '14px 20px',
                      background: 'linear-gradient(135deg, #FF7A00 0%, #FFB347 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '15px',
                      boxShadow: '0 4px 12px rgba(255, 122, 0, 0.4)'
                    }}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

