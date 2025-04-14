import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import { CartProvider } from "./context/cart-context";

import ProtectedRoute from "./components/protected-route";
import AdminLayout from "./components/layouts/admin-layout";
import CustomerLayout from "./components/layouts/customer-layout";
import LandingPage from "./pages/landing-page";
import UnauthorizedPage from "./pages/un-authorized";

//admin-pages
import Dashboard from "./pages/admin-pages/dashboard";
import OrderDetailsPage from "./pages/admin-pages/order-details";

//customer-pages
import ProductsListPage from "./pages/customer-pages/products-list";
import ProductDetails from "./pages/customer-pages/product-details";
import CartPage from "./pages/customer-pages/cart";
import AccountDetailsPage from "./pages/customer-pages/account-details";




export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen">
          <Routes>

            {/* public routes */}
            <Route path="/" element={
              <LandingPage/>
            } />
            
            <Route path="/unauthorized" element={
              <UnauthorizedPage />
            } />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin/orders/:id" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <OrderDetailsPage />
                </AdminLayout>
              </ProtectedRoute>
            } />
            
            
            {/* Customer routes */}
            <Route path="/products" element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerLayout>
                  <ProductsListPage />
                </CustomerLayout>
              </ProtectedRoute>
            } />

            <Route path="/products/:id" element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerLayout>
                  <ProductDetails />
                </CustomerLayout>
              </ProtectedRoute>
            } />

            <Route path="/cart" element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerLayout>
                  <CartPage />
                </CustomerLayout>
              </ProtectedRoute>
            } />

            <Route path="/account" element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerLayout>
                  <AccountDetailsPage />
                </CustomerLayout>
              </ProtectedRoute>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}