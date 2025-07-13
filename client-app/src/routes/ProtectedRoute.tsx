import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, isOperator } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isOperator) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
