import '../index.css'

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>Verify Once.AI</div>

      <div style={styles.links}>
        <a href="#" className='navElements'>Home</a>
        <a href="#" className='navElements'>Instructions</a>
        <a href="#" className='navElements'>Login</a>
        <button style={styles.cta} >Create Account</button>
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
  cta: {
    backgroundColor: '#FF7A00',
    color: '#000',
    padding: '10px 16px',
    borderRadius: 30,
    fontWeight: 600
  }
};