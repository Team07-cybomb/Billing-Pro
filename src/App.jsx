import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
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
import StaffLog from './pages/StaffLog';
import SupportData from './pages/Support-data';
import AppUI from '../website-ui/app1';
import Homepage from '../website-ui/Home';
import Privacy from '../website-ui/Legals/privacy';
import TermsOfService from '../website-ui/Legals/terms-service';
import CookiePolicy from '../website-ui/Legals/cookie';
import FeaturesPage from '../website-ui/features';
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
            {/* <Container fluid className="mt-3"> */}
              
              <Routes>
                <Route path="/login" element={<Login />} />

                {/* The AppUI Layout Route (Parent) */}
                <Route path="/*" element={<AppUI />}> 
                    
                    {/* These routes will render INSIDE AppUI's <Outlet /> */}
                    <Route index element={<Homepage />} /> {/* Matches exactly '/' */}
                    <Route path="home" element={<Homepage />} />
                    <Route path="privacy-policy" element={<Privacy />} />
                    <Route path="terms-of-services" element={<TermsOfService />} />
                    <Route path="cookies-policy" element={<CookiePolicy />} />
                    <Route path="features" element={<FeaturesPage/>}/>
                </Route>
                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
                <Route path="/invoices" element={<RoleBasedRoute allowedRoles={['staff','admin']}><Invoices /></RoleBasedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                <Route path="/reports" element={<RoleBasedRoute allowedRoles={['admin']}><Reports /></RoleBasedRoute>} />
                <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
                <Route path="/support-data" element={<ProtectedRoute><SupportData /></ProtectedRoute>} />
                <Route path="/stafflogs" element={<ProtectedRoute><StaffLog /></ProtectedRoute>} />
                <Route path="/settings" element={<RoleBasedRoute allowedRoles={['admin']}><Settings /></RoleBasedRoute>} />
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                <Route path="/Operations" element={<RoleBasedRoute allowedRoles={['staff','admin']}><Operations /></RoleBasedRoute>} />
                {/* Default redirect */}
                <Route path="/" element={<AppUI />} />
                
              </Routes>
            {/* </Container> */}
            
          </Navigation>
        </div>
        
      </Router>
      
    </AuthProvider>
    
  );
}


export default App;