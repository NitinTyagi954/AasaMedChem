import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import SellerDashboard from './pages/seller/Dashboard';
import BuyerDashboard from './pages/buyer/Dashboard';
import ProtectedRoute from './components/shared/ProtectedRoute';
import AdminRoute from './components/shared/AdminRoute';
import SellerRoute from './components/shared/SellerRoute';
import BuyerRoute from './components/shared/BuyerRoute';
import useAuthStore from './store/authStore';

function AppContent() {
  const { user, fetchUser, isLoading, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return <div>Loading app...</div>;
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <nav style={styles.nav}>
        <div style={styles.brand}>AasaMedChem</div>
        <div style={styles.navLinks}>
          <Link to="/" style={styles.link}>Home</Link>
          {user ? (
            <>
              <span style={styles.link}>Hello, {user.name} ({user.role})</span>
              <button onClick={handleLogout} style={styles.btnLink}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.btnLink}>Register</Link>
            </>
          )}
        </div>
      </nav>
      
      <div style={{ padding: '2rem', background: '#fafafa', minHeight: 'calc(100vh - 70px)' }}>
        <Routes>
          <Route path="/" element={<h1 style={{ textAlign: 'center', marginTop: '3rem' }}>Welcome to AasaMedChem</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Area */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          
          <Route path="/seller/dashboard" element={
            <SellerRoute>
              <SellerDashboard />
            </SellerRoute>
          } />

          <Route path="/buyer/dashboard" element={
            <BuyerRoute>
              <BuyerDashboard />
            </BuyerRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
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
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
  }
};

export default App;
