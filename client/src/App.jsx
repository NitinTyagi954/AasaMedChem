import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';

function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <nav style={styles.nav}>
          <div style={styles.brand}>AasaMedChem</div>
          <div style={styles.navLinks}>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.btnLink}>Register</Link>
          </div>
        </nav>
        
        <div style={{ padding: '2rem', background: '#fafafa', minHeight: 'calc(100vh - 70px)' }}>
          <Routes>
            <Route path="/" element={<h1 style={{ textAlign: 'center', marginTop: '3rem' }}>Welcome to AasaMedChem</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#fff',
    borderBottom: '1px solid #eaeaea',
  },
  brand: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#111',
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  link: {
    color: '#555',
    textDecoration: 'none',
    fontWeight: '500',
  },
  btnLink: {
    background: '#0070f3',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '500',
  }
};

export default App;
