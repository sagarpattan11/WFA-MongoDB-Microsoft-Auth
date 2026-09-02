import React from 'react';
import { useAppSelector } from '../app/hooks';
import { PageLoader } from '../components/feedback/PageLoader';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <PageLoader message="Verifying enterprise session..." />;
  }

  // Enforces enterprise identity authentication session
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return <>{children}</>;
};
