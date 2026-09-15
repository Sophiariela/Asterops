import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Plans from './pages/Plans';
import Checkout from './pages/Checkout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import ProductPage from './pages/products/ProductPage';
import SolutionPage from './pages/solutions/SolutionPage';
import EcosystemPage from './pages/Ecosystem';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="/solutions/:slug" element={<SolutionPage />} />
        <Route path="/ecosystem" element={<EcosystemPage />} />

        <Route element={<ProtectedRoute roles={['CUSTOMER']} />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<ProtectedRoute roles={['ADMIN']} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
