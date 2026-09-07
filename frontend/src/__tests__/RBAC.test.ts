import { describe, expect, it } from 'vitest';
import { UserProfile } from '../auth/auth.types';
import { hasAllPermissions, hasAnyPermission, hasAnyRole, hasPermission, hasRole } from '../auth/rbac';

describe('RBAC Matrix & Helper Functions', () => {
  const adminUser: UserProfile = {
    id: 'usr-1',
    email: 'admin@enterprise.com',
    displayName: 'Admin User',
    roles: ['admin'],
    permissions: [],
  };

  const employeeUser: UserProfile = {
    id: 'usr-2',
    email: 'emp@enterprise.com',
    displayName: 'John Employee',
    roles: ['employee'],
    permissions: [],
  };

  it('correctly verifies role membership with hasRole and hasAnyRole', () => {
    expect(hasRole(adminUser, 'admin')).toBe(true);
    expect(hasRole(adminUser, 'employee')).toBe(false);

    expect(hasAnyRole(adminUser, ['admin', 'manager'])).toBe(true);
    expect(hasAnyRole(employeeUser, ['admin', 'manager'])).toBe(false);
  });

  it('correctly checks role-inherited permissions with hasPermission', () => {
    expect(hasPermission(adminUser, 'employee:delete')).toBe(true);
    expect(hasPermission(employeeUser, 'employee:delete')).toBe(false);
    expect(hasPermission(employeeUser, 'attendance:clock')).toBe(true);
  });

  it('correctly verifies combinations with hasAnyPermission and hasAllPermissions', () => {
    expect(hasAnyPermission(employeeUser, ['employee:delete', 'attendance:clock'])).toBe(true);
    expect(hasAllPermissions(employeeUser, ['employee:delete', 'attendance:clock'])).toBe(false);
  });
});
