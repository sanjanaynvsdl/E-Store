import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";

import LandingPage from "./pages/landing-page";
import RiderDashboard from "./pages/rider-dashboard";
import ProtectedRoute from "./components/protected-route";
import Layout from "./components/layout";
import OrderDetails from "./pages/order-details";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <Routes>
            {/* public routes */}
            <Route path="/" element={<LandingPage />} />

            <Route
              path="/rider"
              element={
                <ProtectedRoute>
                  <Layout>
                    <RiderDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

`           <Route
              path="/rider/orders/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <OrderDetails />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
