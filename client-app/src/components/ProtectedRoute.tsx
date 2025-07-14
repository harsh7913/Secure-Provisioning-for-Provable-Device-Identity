import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isOperator } = useAuth();

  if (!isAuthenticated || !isOperator) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;