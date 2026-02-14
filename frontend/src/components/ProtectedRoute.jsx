import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * 
 * Protects routes by checking authentication and role-based access:
 * - Redirects unauthenticated users to appropriate login page
 * - Redirects users with wrong role to their appropriate dashboard
 * - User role → /wallet
 * - Business/Verifier role → /verifier
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

  // Not logged in - redirect to appropriate login
  if (!token || !storedUser) {
    if (requiredRole === 'business') {
      return <Navigate to="/business/login" replace />;
    }
    return <Navigate to="/user/login" replace />;
  }

  // Check role if specified
  if (requiredRole) {
    // If role doesn't match, redirect to appropriate dashboard
    if (storedUser.role !== requiredRole) {
      if (storedUser.role === 'user') {
        return <Navigate to="/wallet" replace />;
      } else if (storedUser.role === 'verifier' || storedUser.role === 'business') {
        return <Navigate to="/verifier" replace />;
      }
    }
  }

  // All checks passed - render the protected component
  return children;
}
