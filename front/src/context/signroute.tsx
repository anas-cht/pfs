// src/routes/ProtectedDashboardRoute.tsx
import { Navigate } from 'react-router-dom';

import { useAuth } from './authcontext';

const ProtectedDashboardRoute = ({ children }: { children: JSX.Element }) => {

  const {isAuthenticated} = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedDashboardRoute;
