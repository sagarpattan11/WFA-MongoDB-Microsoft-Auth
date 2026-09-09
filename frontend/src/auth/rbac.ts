import { Permission, UserProfile, UserRole } from './auth.types';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'employee:view',
    'employee:create',
    'employee:update',
    'employee:delete',
    'attendance:view',
    'attendance:manage',
    'attendance:clock',
    'leave:view',
    'leave:request',
    'leave:review',
    'schedule:view',
    'schedule:manage',
    'schedule:swap',
    'compliance:view',
    'compliance:review',
    'payroll:view',
    'payroll:manage',
    'analytics:view',
    'skills:view',
    'skills:manage',
    'report:export',
    'audit:view',
    'settings:manage',
  ],
  hr_manager: [
    'employee:view',
    'employee:create',
    'employee:update',
    'employee:delete',
    'attendance:view',
    'attendance:manage',
    'attendance:clock',
    'leave:view',
    'leave:request',
    'leave:review',
    'schedule:view',
    'schedule:manage',
    'compliance:view',
    'compliance:review',
    'payroll:view',
    'payroll:manage',
    'analytics:view',
    'skills:view',
    'skills:manage',
    'report:export',
  ],
  hr: [
    'employee:view',
    'employee:create',
    'employee:update',
    'attendance:view',
    'attendance:manage',
    'attendance:clock',
    'leave:view',
    'leave:request',
    'leave:review',
    'schedule:view',
    'schedule:manage',
    'compliance:view',
    'compliance:review',
    'payroll:view',
    'payroll:manage',
    'analytics:view',
    'skills:view',
    'skills:manage',
    'report:export',
  ],
  executive: [
    'employee:view',
    'attendance:view',
    'leave:view',
    'schedule:view',
    'compliance:view',
    'payroll:view',
    'analytics:view',
    'skills:view',
    'report:export',
    'audit:view',
  ],
  dept_manager: [
    'employee:view',
    'employee:update',
    'attendance:view',
    'attendance:manage',
    'attendance:clock',
    'leave:view',
    'leave:request',
    'leave:review',
    'schedule:view',
    'schedule:manage',
    'schedule:swap',
    'compliance:view',
    'analytics:view',
    'skills:view',
    'skills:manage',
    'report:export',
  ],
  manager: [
    'employee:view',
    'attendance:view',
    'attendance:manage',
    'attendance:clock',
    'leave:view',
    'leave:request',
    'leave:review',
    'schedule:view',
    'schedule:manage',
    'schedule:swap',
    'compliance:view',
    'analytics:view',
    'skills:view',
    'report:export',
  ],
  team_lead: [
    'employee:view',
    'attendance:view',
    'attendance:manage',
    'attendance:clock',
    'leave:view',
    'leave:request',
    'schedule:view',
    'schedule:manage',
    'schedule:swap',
    'analytics:view',
    'skills:view',
  ],
  'team-lead': [
    'employee:view',
    'attendance:view',
    'attendance:manage',
    'attendance:clock',
    'leave:view',
    'leave:request',
    'schedule:view',
    'schedule:manage',
    'schedule:swap',
    'analytics:view',
    'skills:view',
  ],
  employee: [
    'attendance:clock',
    'attendance:view',
    'leave:request',
    'leave:view',
    'schedule:view',
    'schedule:swap',
    'payroll:view',
    'skills:view',
  ],
};

export const hasRole = (user: UserProfile | null, role: UserRole): boolean => {
  if (!user) return false;
  return user.roles.includes(role);
};

export const hasAnyRole = (user: UserProfile | null, roles: UserRole[]): boolean => {
  if (!user) return false;
  return roles.some((r) => user.roles.includes(r));
};

export const hasPermission = (user: UserProfile | null, permission: Permission): boolean => {
  if (!user) return false;
  if (user.permissions && user.permissions.includes(permission)) return true;
  return user.roles.some((role) => ROLE_PERMISSIONS[role]?.includes(permission));
};

export const hasAnyPermission = (user: UserProfile | null, permissions: Permission[]): boolean => {
  if (!user) return false;
  return permissions.some((p) => hasPermission(user, p));
};

export const hasAllPermissions = (user: UserProfile | null, permissions: Permission[]): boolean => {
  if (!user) return false;
  return permissions.every((p) => hasPermission(user, p));
};
