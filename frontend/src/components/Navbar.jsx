import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate();
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showSignupDropdown, setShowSignupDropdown] = useState(false);

  return (
    <nav>
      <div className="navbar-logo">Verify Once.AI</div>

      <div className="navbar-links">
        <a href="#" className='navElements'>Home</a>
        <a href="#" className='navElements'>Instructions</a>
        
        <div 
          className="navbar-dropdown"
          onMouseEnter={() => setShowLoginDropdown(true)}
          onMouseLeave={() => setShowLoginDropdown(false)}
        >
          <a href="/login" className='navElements'>Login</a>
        </div>

        <div 
          className="navbar-dropdown"
          onMouseEnter={() => setShowSignupDropdown(true)}
          onMouseLeave={() => setShowSignupDropdown(false)}
        >
          <button className="navbar-cta" onClick={() => navigate('/signup')}>Create Account</button>
        </div>
      </div>
    </nav>
  );
}