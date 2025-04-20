
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoadingState from '@/components/LoadingState';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingState repo="" progress={{
      structure: false,
      criticalPaths: false,
      dependencies: false,
      tutorials: false
    }} />;
  }
  
  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
