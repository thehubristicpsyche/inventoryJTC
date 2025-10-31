import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import ProfilePage from './pages/ProfilePage';
import ImportPage from './pages/ImportPage/ImportPage';
import QuotationsPage from './pages/QuotationsPage/QuotationsPage';
import CreateQuotationPage from './pages/CreateQuotationPage/CreateQuotationPage';
import ViewQuotationPage from './pages/ViewQuotationPage/ViewQuotationPage';

/**
 * Main App Component
 * Wraps the application with providers and routing
 */
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/add" element={<AddProductPage />} />
              <Route path="products/:id/edit" element={<EditProductPage />} />
              <Route path="quotations" element={<QuotationsPage />} />
              <Route path="quotations/create" element={<CreateQuotationPage />} />
              <Route path="quotations/:id" element={<ViewQuotationPage />} />
              <Route path="import" element={<ImportPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
