import LoadingSpinner from '../partials/components/LoadingSpinner'
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
    const { loading, token } = useAuth()
  
    if (loading) 
      return <LoadingSpinner/>
    
    return token ? children : <Navigate to="/auth/signin" replace/>
  };

  export const AdminRoute = ({ children }) => {
    const { loading, token, isAdmin } = useAuth()
    
    if (loading) 
      return <LoadingSpinner/>

    return token && isAdmin ? children : <Navigate to="/api/projects" replace/>
  };