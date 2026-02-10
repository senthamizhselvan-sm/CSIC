import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import UserDashboard from './pages/UserDashboard';
import BusinessVerifier from './pages/BusinessVerifier';
import BusinessPortal from './pages/BusinessPortal';
import LiveDemo from './pages/LiveDemo';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/demo" element={<LiveDemo />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        
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
