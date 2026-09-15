export type UserRole =
  | 'admin'
  | 'hr_manager'
  | 'hr'
  | 'executive'
  | 'dept_manager'
  | 'manager'
  | 'team_lead'
  | 'team-lead'
  | 'employee';

export type Permission =
  | 'employee:view'
  | 'employee:create'
  | 'employee:update'
  | 'employee:delete'
  | 'attendance:view'
  | 'attendance:manage'
  | 'attendance:clock'
  | 'leave:view'
  | 'leave:request'
  | 'leave:review'
  | 'schedule:view'
  | 'schedule:manage'
  | 'schedule:swap'
  | 'compliance:view'
  | 'compliance:review'
  | 'payroll:view'
  | 'payroll:manage'
  | 'analytics:view'
  | 'skills:view'
  | 'skills:manage'
  | 'report:export'
  | 'audit:view'
  | 'settings:manage';

export interface UserProfile {
  id: string;
  username?: string;
  email: string;
  displayName: string;
  roles: UserRole[];
  permissions?: Permission[];
  department?: string;
  jobTitle?: string;
  avatarUrl?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  error: string | null;
}
