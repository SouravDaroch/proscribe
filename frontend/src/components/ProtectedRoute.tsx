import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'writer')[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth(); // Removed 'token' here

  if (isLoading) return <div className="p-10">Loading...</div>;

  // 1. Check if 'user' exists instead of 'token'
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role-Based Access Control (RBAC)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Authorized!
  return <Outlet />;
};

export default ProtectedRoute;