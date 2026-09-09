import React from 'react';
import { useAppSelector } from '../app/hooks';
import { Permission, UserRole } from '../auth/auth.types';
import { hasAnyPermission, hasAnyRole } from '../auth/rbac';
import { Forbidden403 } from '../components/feedback/Forbidden403';

interface RequireRoleProps {
  roles?: UserRole[];
  permissions?: Permission[];
  children: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ roles, permissions, children }) => {
  const user = useAppSelector((state) => state.auth.user);

  // If roles are specified and user is logged in, check role
  if (user && roles && roles.length > 0) {
    const roleAllowed = hasAnyRole(user, roles);
    if (!roleAllowed) {
      return <Forbidden403 requiredRole={roles.join(' or ')} />;
    }
  }

  // If permissions are specified and user is logged in, check permission
  if (user && permissions && permissions.length > 0) {
    const permissionAllowed = hasAnyPermission(user, permissions);
    if (!permissionAllowed) {
      return <Forbidden403 requiredPermission={permissions.join(', ')} />;
    }
  }

  return <>{children}</>;
};
