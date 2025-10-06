import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Components
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import History from './pages/History';
import Support from './pages/Support';
import Settings from './pages/Settings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RoleBasedRoute from "./components/RoleBasedRoutes";
import { AuthProvider, useAuth } from './context/AuthContext';
import Operations from './pages/Operations';
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation>
            <Container fluid className="mt-3">
              <Routes>
                <Route path="/login" element={<Login />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
                <Route path="/invoices" element={<RoleBasedRoute allowedRoles={['staff','admin']}><Invoices /></RoleBasedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                <Route path="/reports" element={<RoleBasedRoute allowedRoles={['admin']}><Reports /></RoleBasedRoute>} />
                <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
                <Route path="/settings" element={<RoleBasedRoute allowedRoles={['admin']}><Settings /></RoleBasedRoute>} />
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                <Route path="/Operations" element={<RoleBasedRoute allowedRoles={['staff','admin']}><Operations /></RoleBasedRoute>} />
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Container>
          </Navigation>
        </div>
      </Router>
    </AuthProvider>
  );
}


export default App;