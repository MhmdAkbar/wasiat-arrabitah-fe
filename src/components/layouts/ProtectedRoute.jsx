// src/components/layouts/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute() {
  const { user, isAuthLoading } = useAuth();

  // Prevent flashing UI while verifying session
  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <span className="text-gray-500 font-medium">Verifying session...</span>
        {/* Replace with your actual loading spinner component */}
      </div>
    );
  }

  // Redirect to login if unauthenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
}