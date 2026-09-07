import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { UserRole } from '../auth/auth.types';
import { fetchCurrentUserSession } from '../auth/webauthn.service';
import { PageLoader } from '../components/feedback/PageLoader';
import { logout, setAuthenticatedUser } from '../store/slices/authSlice';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [checkingSession, setCheckingSession] = useState<boolean>(!isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      fetchCurrentUserSession()
        .then((data) => {
          if (data && data.isAuthenticated && data.user) {
            dispatch(
              setAuthenticatedUser({
                id: data.user.id,
                username: data.user.username,
                email: data.user.email,
                displayName: data.user.displayName,
                roles: (data.user.roles as UserRole[]) || ['employee'],
              })
            );
          } else {
            dispatch(logout());
          }
        })
        .catch(() => {
          dispatch(logout());
        })
        .finally(() => {
          setCheckingSession(false);
        });
    }
  }, [isAuthenticated, dispatch]);

  if (checkingSession) {
    return <PageLoader message="Validating WebAuthn Passkey session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
