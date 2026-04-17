import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'writer')[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) return <div className="p-10">Loading...</div>;

  // 1. If not logged in, go to login
  if (!token) return <Navigate to="/login" replace />;

  // 2. If logged in but role isn't allowed, go to dashboard
  if (allowedRoles && !allowedRoles.includes(user?.role as any)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Otherwise, show the page
  return <Outlet />;
};

export default ProtectedRoute;