import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  Calendar,
  CheckSquare,
  Clock,
  DollarSign,
  FileText,
  LayoutDashboard,
  LucideIcon,
  Settings,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import { Permission, UserRole } from '../auth/auth.types';

export interface RouteMetadata {
  path: string;
  title: string;
  breadcrumbLabel: string;
  icon?: LucideIcon;
  allowedRoles?: UserRole[];
  requiredPermissions?: Permission[];
  navGroup?: 'Core' | 'Workforce' | 'Operations' | 'Governance';
  showInSidebar?: boolean;
  isDashboard?: boolean;
}

export const APP_ROUTES: RouteMetadata[] = [
  // Authentication & Core
  {
    path: '/dashboard',
    title: 'Dashboard Overview',
    breadcrumbLabel: 'Dashboard',
    icon: LayoutDashboard,
    navGroup: 'Core',
    showInSidebar: true,
    isDashboard: true,
  },
  // Role-Specific Dashboards
  {
    path: '/admin/dashboard',
    title: 'Admin Governance Console',
    breadcrumbLabel: 'Admin Dashboard',
    allowedRoles: ['admin'],
    showInSidebar: false,
    isDashboard: true,
  },
  {
    path: '/hr/dashboard',
    title: 'HR Executive Dashboard',
    breadcrumbLabel: 'HR Dashboard',
    allowedRoles: ['admin', 'hr'],
    showInSidebar: false,
    isDashboard: true,
  },
  {
    path: '/manager/dashboard',
    title: 'Department Manager Portal',
    breadcrumbLabel: 'Manager Dashboard',
    allowedRoles: ['admin', 'hr', 'manager'],
    showInSidebar: false,
    isDashboard: true,
  },
  {
    path: '/team-lead/dashboard',
    title: 'Team Lead Operations Desk',
    breadcrumbLabel: 'Team Lead Dashboard',
    allowedRoles: ['admin', 'hr', 'manager', 'team-lead'],
    showInSidebar: false,
    isDashboard: true,
  },
  {
    path: '/employee/dashboard',
    title: 'Employee Self-Service Workspace',
    breadcrumbLabel: 'Employee Dashboard',
    showInSidebar: false,
    isDashboard: true,
  },

  // Workforce Management
  {
    path: '/employees',
    title: 'Employee Directory',
    breadcrumbLabel: 'Employees',
    icon: Users,
    navGroup: 'Workforce',
    showInSidebar: true,
    requiredPermissions: ['employee:view'],
  },
  {
    path: '/employees/:id',
    title: 'Employee Profile Detail',
    breadcrumbLabel: 'Employee Profile',
    showInSidebar: false,
    requiredPermissions: ['employee:view'],
  },
  {
    path: '/attendance',
    title: 'Live Attendance Records',
    breadcrumbLabel: 'Attendance',
    icon: Clock,
    navGroup: 'Workforce',
    showInSidebar: true,
    requiredPermissions: ['attendance:view'],
  },
  {
    path: '/attendance/history',
    title: 'Attendance History Log',
    breadcrumbLabel: 'History',
    showInSidebar: false,
    requiredPermissions: ['attendance:view'],
  },
  {
    path: '/attendance/corrections',
    title: 'Attendance Regularization',
    breadcrumbLabel: 'Corrections',
    showInSidebar: false,
    requiredPermissions: ['attendance:manage'],
  },
  {
    path: '/absence',
    title: 'Absence & Leave Management',
    breadcrumbLabel: 'Absence',
    icon: Calendar,
    navGroup: 'Workforce',
    showInSidebar: true,
    requiredPermissions: ['leave:view'],
  },
  {
    path: '/absence/calendar',
    title: 'Department Leave Calendar',
    breadcrumbLabel: 'Leave Calendar',
    showInSidebar: false,
    requiredPermissions: ['leave:view'],
  },

  // Operations & Planning
  {
    path: '/scheduling',
    title: 'Workforce Shift Scheduling',
    breadcrumbLabel: 'Scheduling',
    icon: CheckSquare,
    navGroup: 'Operations',
    showInSidebar: true,
    requiredPermissions: ['schedule:view'],
  },
  {
    path: '/scheduling/shifts',
    title: 'Roster Shifts Planner',
    breadcrumbLabel: 'Shifts',
    showInSidebar: false,
    requiredPermissions: ['schedule:view'],
  },
  {
    path: '/scheduling/swaps',
    title: 'Shift Swap Approvals',
    breadcrumbLabel: 'Swaps',
    showInSidebar: false,
    requiredPermissions: ['schedule:swap'],
  },
  {
    path: '/analytics',
    title: 'Productivity & Workforce Analytics',
    breadcrumbLabel: 'Analytics',
    icon: BarChart3,
    navGroup: 'Operations',
    showInSidebar: true,
    requiredPermissions: ['analytics:view'],
  },
  {
    path: '/compliance',
    title: 'Regulatory & Overtime Compliance',
    breadcrumbLabel: 'Compliance',
    icon: ShieldCheck,
    navGroup: 'Operations',
    showInSidebar: true,
    requiredPermissions: ['compliance:view'],
  },
  {
    path: '/payroll',
    title: 'Payroll & Wage Processing',
    breadcrumbLabel: 'Payroll',
    icon: DollarSign,
    navGroup: 'Operations',
    showInSidebar: true,
    requiredPermissions: ['payroll:view'],
  },
  {
    path: '/reports',
    title: 'Enterprise Report Generator',
    breadcrumbLabel: 'Reports',
    icon: FileText,
    navGroup: 'Operations',
    showInSidebar: true,
    requiredPermissions: ['report:export'],
  },

  // Governance & Preferences
  {
    path: '/notifications',
    title: 'Notifications Center',
    breadcrumbLabel: 'Notifications',
    icon: Bell,
    navGroup: 'Governance',
    showInSidebar: true,
  },
  {
    path: '/audit-logs',
    title: 'Platform Audit & Compliance Trail',
    breadcrumbLabel: 'Audit Logs',
    icon: Activity,
    navGroup: 'Governance',
    showInSidebar: true,
    allowedRoles: ['admin'],
    requiredPermissions: ['audit:view'],
  },
  {
    path: '/settings',
    title: 'System Preferences & Integrations',
    breadcrumbLabel: 'Settings',
    icon: Settings,
    navGroup: 'Governance',
    showInSidebar: true,
    allowedRoles: ['admin'],
    requiredPermissions: ['settings:manage'],
  },
  {
    path: '/profile',
    title: 'My Profile & Credentials',
    breadcrumbLabel: 'Profile',
    icon: User,
    showInSidebar: false,
  },

  // Fallback / Error States
  {
    path: '/403',
    title: '403 Forbidden',
    breadcrumbLabel: 'Access Denied',
    icon: AlertCircle,
    showInSidebar: false,
  },
  {
    path: '/404',
    title: '404 Not Found',
    breadcrumbLabel: 'Not Found',
    icon: AlertCircle,
    showInSidebar: false,
  },
];
