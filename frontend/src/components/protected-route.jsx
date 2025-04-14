import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userRole, loading } = useAuth();

  // If still loading auth state, show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-light-gray">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mustard-yellow"></div>
      </div>
    );
  }

  // not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  // role is required but user doesn't have an allowed role
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }


  return children;
}
