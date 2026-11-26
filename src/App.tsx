import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Plans from './pages/Plans';
import PortfolioPage from './pages/Portfolio';
import ProductPage from './pages/products/ProductPage';
import SolutionPage from './pages/solutions/SolutionPage';
import EcosystemPage from './pages/Ecosystem';

/*
 * Code splitting por rota.
 *
 * O bundle unico tinha 809 kB: quem abria so a home baixava tambem o
 * dashboard, o commerce, o webos e o admin. As rotas de marketing ficam
 * no bundle inicial (sao as que o visitante ve primeiro e as que o
 * prerender renderiza); o resto carrega sob demanda.
 */
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CheckoutSuccess = lazy(() => import('./pages/checkout/Success'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Admin = lazy(() => import('./pages/Admin'));
const CommerceLayout = lazy(() => import('./pages/commerce/CommerceLayout'));
const PulsePage = lazy(() => import('./pages/commerce/PulsePage'));
const OpportunitiesPage = lazy(() => import('./pages/commerce/OpportunitiesPage'));
const AuditPage = lazy(() => import('./pages/commerce/AuditPage'));
const ProductsPage = lazy(() => import('./pages/commerce/ProductsPage'));
const CategoriesPage = lazy(() => import('./pages/commerce/CategoriesPage'));
const InventoryPage = lazy(() => import('./pages/commerce/InventoryPage'));
const OrdersPage = lazy(() => import('./pages/commerce/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/commerce/OrderDetailPage'));
const CustomersPage = lazy(() => import('./pages/commerce/CustomersPage'));
const CustomerDetailPage = lazy(() => import('./pages/commerce/CustomerDetailPage'));
const WebOSLayout = lazy(() => import('./pages/webos/WebOSLayout'));
const WebOSWizard = lazy(() => import('./pages/webos/WebOSWizard'));
const DraftPreviewPage = lazy(() => import('./pages/webos/DraftPreviewPage'));
const TemplatePreviewPage = lazy(() => import('./pages/webos/TemplatePreviewPage'));
const SitesPage = lazy(() => import('./pages/webos/SitesPage'));
const SiteDetailPage = lazy(() => import('./pages/webos/SiteDetailPage'));
const TemplateLibraryPage = lazy(() => import('./pages/webos/TemplateLibraryPage'));
const PublicSitePage = lazy(() => import('./pages/webos/PublicSitePage'));

export default function App() {
  return (
    <AuthProvider>
      {/* reducedMotion="user" faz todo framer-motion do app respeitar
          prefers-reduced-motion sem precisar tratar componente a componente. */}
      <MotionConfig reducedMotion="user">
      <Suspense fallback={<div className="min-h-screen bg-white" aria-busy="true" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="/solutions/:slug" element={<SolutionPage />} />
        <Route path="/ecosystem" element={<EcosystemPage />} />
        <Route path="/site/:slug" element={<PublicSitePage />} />
        <Route path="/site/:slug/:pageSlug" element={<PublicSitePage />} />

        <Route element={<ProtectedRoute roles={['CUSTOMER']} />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/commerce" element={<CommerceLayout />}>
            <Route index element={<Navigate to="/commerce/pulse" replace />} />
            <Route path="pulse" element={<PulsePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/:id" element={<CustomerDetailPage />} />
            <Route path="opportunities" element={<OpportunitiesPage />} />
            <Route path="audit" element={<AuditPage />} />
          </Route>

          <Route path="/webos/new" element={<WebOSWizard />} />
          <Route path="/webos/:id/preview" element={<DraftPreviewPage />} />
          <Route path="/webos/templates/:id/preview" element={<TemplatePreviewPage />} />
          <Route path="/webos" element={<WebOSLayout />}>
            <Route index element={<SitesPage />} />
            <Route path="templates" element={<TemplateLibraryPage />} />
            <Route path=":id" element={<SiteDetailPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['ADMIN']} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        {/* Curinga: qualquer caminho desconhecido cai na 404 de verdade. */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      </MotionConfig>
    </AuthProvider>
  );
}
