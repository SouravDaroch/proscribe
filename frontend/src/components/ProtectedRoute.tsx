import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();
// getting token 

  if (isLoading) return <div>Loading...</div>; // Prevent flickering while checking localStorage
  
// checking auth 
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;