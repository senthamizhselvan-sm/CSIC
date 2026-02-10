import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import BusinessVerifier from './pages/BusinessVerifier';
import BusinessPortal from './pages/BusinessPortal';
import LiveDemo from './pages/LiveDemo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/wallet" element={<UserDashboard />} />
        <Route path="/verifier" element={<BusinessVerifier />} />
        
        {/* Demo routes (split-screen) */}
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/business" element={<BusinessPortal />} />
        <Route path="/demo" element={<LiveDemo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
