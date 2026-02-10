import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../index.css'

export default function Navbar() {
  const navigate = useNavigate();
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showSignupDropdown, setShowSignupDropdown] = useState(false);

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>Verify Once.AI</div>

      <div style={styles.links}>
        <a href="#" className='navElements'>Home</a>
        <a href="#" className='navElements'>Instructions</a>
        
        {/* Login Dropdown */}
        <div 
          style={{...styles.dropdown, paddingBottom: '8px'}}
          onMouseEnter={() => setShowLoginDropdown(true)}
          onMouseLeave={() => setShowLoginDropdown(false)}
        >
          <a href="#" className='navElements'>Login</a>
          {showLoginDropdown && (
            <div style={styles.dropdownMenu}>
              <button 
                className="dropdown-item"
                style={styles.dropdownItem}
                onClick={() => navigate('/user/login')}
              >
                User Login
              </button>
              <button 
                className="dropdown-item"
                style={styles.dropdownItem}
                onClick={() => navigate('/business/login')}
              >
                Verifier Login
              </button>
            </div>
          )}
        </div>

        {/* Signup Dropdown */}
        <div 
          style={{...styles.dropdown, paddingBottom: '8px'}}
          onMouseEnter={() => setShowSignupDropdown(true)}
          onMouseLeave={() => setShowSignupDropdown(false)}
        >
          <button style={styles.cta}>Create Account</button>
          {showSignupDropdown && (
            <div style={styles.dropdownMenu}>
              <button 
                className="dropdown-item"
                style={styles.dropdownItem}
                onClick={() => navigate('/user/signup')}
              >
                User Signup
              </button>
              <button 
                className="dropdown-item"
                style={styles.dropdownItem}
                onClick={() => navigate('/business/signup')}
              >
                Verifier Signup
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    top: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '70%',
    maxWidth: 1200,
    padding: '14px 24px',
    borderRadius: 40,
    background: 'rgba(15,15,20,0.7)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
    border: '3px solid white'
  },
  logo: {
    fontWeight: 700,
    fontSize: 18
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 30
  },
  dropdown: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(15,15,20,0.98)',
    backdropFilter: 'blur(12px)',
    borderRadius: 12,
    padding: '8px 0',
    minWidth: 160,
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    zIndex: 1001
  },
  dropdownItem: {
    width: '100%',
    padding: '12px 20px',
    background: 'transparent',
    color: '#FFFFFF',
    textAlign: 'left',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s',
    fontSize: 14,
    fontWeight: 500,
    whiteSpace: 'nowrap'
  },
  cta: {
    backgroundColor: '#FF7A00',
    color: '#000',
    padding: '10px 16px',
    borderRadius: 30,
    fontWeight: 600,
    cursor: 'pointer'
  }
};