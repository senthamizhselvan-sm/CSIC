import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import BusinessLogin from './pages/BusinessLogin';
import BusinessSignup from './pages/BusinessSignup';
import UserDashboard from './pages/UserDashboard';
import BusinessVerifier from './pages/BusinessVerifier';
import BusinessPortal from './pages/BusinessPortal';
import LiveDemo from './pages/LiveDemo';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/demo" element={<LiveDemo />} />
        
        {/* User Auth routes */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/signup" element={<UserSignup />} />
        
        {/* Business Auth routes */}
        <Route path="/business/login" element={<BusinessLogin />} />
        <Route path="/business/signup" element={<BusinessSignup />} />
        
        {/* Legacy redirects for backward compatibility */}
        <Route path="/login" element={<Navigate to="/user/login" replace />} />
        <Route path="/signup" element={<Navigate to="/user/signup" replace />} />
        
        {/* Protected User routes */}
        <Route path="/wallet" element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/user" element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } />
        
        {/* Protected Business routes */}
        <Route path="/verifier" element={
          <ProtectedRoute requiredRole="business">
            <BusinessVerifier />
          </ProtectedRoute>
        } />
        <Route path="/business" element={
          <ProtectedRoute requiredRole="business">
            <BusinessPortal />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
