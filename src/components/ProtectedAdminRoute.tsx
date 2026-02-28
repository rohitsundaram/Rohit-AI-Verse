import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const ProtectedAdminRoute = () => {
  const location = useLocation();
  const { isLoading, isAuthenticated } = useAdminAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading admin session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
