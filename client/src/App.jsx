import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Approvals from './pages/admin/Approvals';
import Users from './pages/admin/Users';
import AllOrders from './pages/admin/AllOrders';
import SellerDashboard from './pages/seller/Dashboard';
import CreateProduct from './pages/seller/CreateProduct';
import MyListings from './pages/seller/MyListings';
import IncomingOrders from './pages/seller/IncomingOrders';
import BuyerDashboard from './pages/buyer/Dashboard';
import Catalogue from './pages/buyer/Catalogue';
import Cart from './pages/buyer/Cart';
import MyOrders from './pages/buyer/MyOrders';
import Profile from './pages/buyer/Profile';
import ProtectedRoute from './components/shared/ProtectedRoute';
import AdminRoute from './components/shared/AdminRoute';
import SellerRoute from './components/shared/SellerRoute';
import BuyerRoute from './components/shared/BuyerRoute';
import useAuthStore from './store/authStore';

function Home() {
  const { user } = useAuthStore();
  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === "seller") return <Navigate to="/seller/dashboard" replace />;
  if (user?.role === "buyer") return <Navigate to="/buyer/dashboard" replace />;
  return <h1 style={{ textAlign: 'center', marginTop: '3rem' }}>Welcome to AasaMedChem</h1>;
}

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
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Area */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          
          <Route path="/admin/approvals" element={
            <AdminRoute>
              <Approvals />
            </AdminRoute>
          } />

          <Route path="/admin/users" element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          } />

          <Route path="/admin/orders" element={
            <AdminRoute>
              <AllOrders />
            </AdminRoute>
          } />
          
          <Route path="/seller/dashboard" element={
            <SellerRoute>
              <SellerDashboard />
            </SellerRoute>
          } />
          
          <Route path="/seller/create-product" element={
            <SellerRoute>
              <CreateProduct />
            </SellerRoute>
          } />

          <Route path="/seller/listings" element={
            <SellerRoute>
              <MyListings />
            </SellerRoute>
          } />

          <Route path="/seller/orders" element={
            <SellerRoute>
              <IncomingOrders />
            </SellerRoute>
          } />

          <Route path="/buyer/dashboard" element={
            <BuyerRoute>
              <BuyerDashboard />
            </BuyerRoute>
          } />
          
          <Route path="/buyer/products" element={
            <BuyerRoute>
              <Catalogue />
            </BuyerRoute>
          } />
          
          <Route path="/buyer/cart" element={
            <BuyerRoute>
              <Cart />
            </BuyerRoute>
          } />

          <Route path="/buyer/orders" element={
            <BuyerRoute>
              <MyOrders />
            </BuyerRoute>
          } />

          <Route path="/buyer/profile" element={
            <BuyerRoute>
              <Profile />
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
