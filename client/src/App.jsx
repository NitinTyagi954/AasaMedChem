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
  
  return (
    <div className="max-w-4xl mx-auto mt-16 px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
        <span className="block xl:inline">Welcome to </span>
        <span className="block text-blue-600 xl:inline">AasaMedChem</span>
      </h1>
      <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        The premier marketplace for verified chemicals and reagents. Connect with trusted sellers or browse our catalog today.
      </p>
      
      <div className="mt-10 sm:flex sm:justify-center">
        <div className="rounded-md shadow">
          <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
            Login
          </Link>
        </div>
        <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
          <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
            Create Account
          </Link>
        </div>
      </div>

      <div className="mt-16 bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto text-left shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🧪</span> Test Credentials
        </h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-semibold text-gray-800">Admin:</span>
            <span>admin@test.com / admin123</span>
          </li>
          <li className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-semibold text-gray-800">Seller:</span>
            <span>seller@test.com / admin</span>
          </li>
          <li className="flex justify-between">
            <span className="font-semibold text-gray-800">Buyer:</span>
            <span>buyer@test.com / admin</span>
          </li>
        </ul>
      </div>
    </div>
  );
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
