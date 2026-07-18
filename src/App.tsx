/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MarketPage from './pages/MarketPage';
import ImpactPage from './pages/ImpactPage';
import DonationPage from './pages/DonationPage';
import AccountPage from './pages/AccountPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import CheckoutPage from './pages/CheckoutPage';
import OperatorDashboard from './pages/OperatorDashboard';
import OperatorLoginPage from './pages/OperatorLoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { CartProvider } from './lib/CartContext';
import { DataProvider } from './lib/DataContext';

function ProtectedAccount() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <AccountPage /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
            {/* Public Routes with Layout */}
            <Route element={<Layout><MarketPage /></Layout>} path="/" />
            <Route element={<Layout><ImpactPage /></Layout>} path="/impact" />
            <Route element={<Layout><DonationPage /></Layout>} path="/donation" />
            <Route element={<Layout><ProtectedAccount /></Layout>} path="/account" />
            <Route element={<Layout><CheckoutPage /></Layout>} path="/checkout" />
            <Route element={<CustomerLoginPage />} path="/login" />
          
          {/* Operator Routes */}
          <Route element={<OperatorLoginPage />} path="/operator/login" />
          <Route element={<OperatorDashboard />} path="/operator/dashboard" />
          <Route element={<ResetPasswordPage />} path="/reset-password" />
          <Route element={<UpdatePasswordPage />} path="/update-password" />
          
          {/* Fallback */}
          <Route element={<Layout><MarketPage /></Layout>} path="*" />
        </Routes>
        </BrowserRouter>
        </CartProvider>
      </DataProvider>
    </AuthProvider>
  );
}
