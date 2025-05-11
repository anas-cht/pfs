// src/routes/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './authcontext';
import { useUserinfo } from '../context/userinfocontext';



const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const { hasPreferences } = useUserinfo();


  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
    
    if (!hasPreferences ) {
      return <Navigate to="/preferences" replace />;
    }


  return children;
};

export default PrivateRoute;
