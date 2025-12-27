import { Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { SellerUpload } from './pages/SellerUpload';
import { SellerOrders } from './pages/SellerOrders';
import { SellerEarnings } from './pages/SellerEarnings';

function App() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            🏪 Seller Portal
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/products">My Products</Link>
            </li>
            <li>
              <Link to="/orders">My Orders</Link>
            </li>
            <li>
              <Link to="/analytics">Analytics</Link>
            </li>
          </ul>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<SellerUpload />} />
        <Route path="/products" element={<SellerUpload />} />
        <Route path="/products/new" element={<SellerUpload />} />
        <Route path="/orders" element={<SellerOrders />} />
        <Route path="/analytics" element={<SellerEarnings />} />
      </Routes>
    </div>
  );
}

export default App;
