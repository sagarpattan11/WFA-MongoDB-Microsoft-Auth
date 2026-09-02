import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Forbidden403 } from '../components/feedback/Forbidden403';
import { NotFound404 } from '../components/feedback/NotFound404';
import { PageLoader } from '../components/feedback/PageLoader';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { AnalyticsPage } from '../features/analytics/pages/AnalyticsPage';
import { AttendanceCorrectionsPage } from '../features/attendance/pages/AttendanceCorrectionsPage';
import { AttendanceHistoryPage } from '../features/attendance/pages/AttendanceHistoryPage';
import { AttendancePage } from '../features/attendance/pages/AttendancePage';
import { AuditLogsPage } from '../features/audit/pages/AuditLogsPage';
import { AuthCallbackPage } from '../features/auth/pages/AuthCallbackPage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { CompliancePage } from '../features/compliance/pages/CompliancePage';
import { DashboardOverviewPage } from '../features/dashboard/pages/DashboardOverviewPage';
import { EmployeeDashboardPage } from '../features/employee/pages/EmployeeDashboardPage';
import { EmployeeDetailPage } from '../features/employees/pages/EmployeeDetailPage';
import { EmployeesPage } from '../features/employees/pages/EmployeesPage';
import { HrDashboardPage } from '../features/hr/pages/HrDashboardPage';
import { ManagerDashboardPage } from '../features/manager/pages/ManagerDashboardPage';
import { NotificationsPage } from '../features/notifications/pages/NotificationsPage';
import { PayrollPage } from '../features/payroll/pages/PayrollPage';
import { ProfilePage } from '../features/profile/pages/ProfilePage';
import { ReportsPage } from '../features/reports/pages/ReportsPage';
import { AbsenceCalendarPage } from '../features/scheduling/pages/AbsenceCalendarPage';
import { AbsencePage } from '../features/scheduling/pages/AbsencePage';
import { SchedulingPage } from '../features/scheduling/pages/SchedulingPage';
import { ShiftsPage } from '../features/scheduling/pages/ShiftsPage';
import { SwapsPage } from '../features/scheduling/pages/SwapsPage';
import { SettingsPage } from '../features/settings/pages/SettingsPage';
import { TeamLeadDashboardPage } from '../features/team-lead/pages/TeamLeadDashboardPage';
import { AuthLayout } from '../layouts/AuthLayout';
import { MainLayout } from '../layouts/MainLayout';
import { RequireAuth } from './RequireAuth';
import { RequireRole } from './RequireRole';

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader message="Loading page component..." />}>
      <Routes>
        {/* Public Authentication Shell Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Route>

        {/* Protected Enterprise Layout Routes */}
        <Route
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        >
          {/* Root redirect to Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Core Overview */}
          <Route path="/dashboard" element={<DashboardOverviewPage />} />

          {/* Role-Specific Dashboards */}
          <Route
            path="/admin/dashboard"
            element={
              <RequireRole roles={['admin']}>
                <AdminDashboardPage />
              </RequireRole>
            }
          />
          <Route
            path="/hr/dashboard"
            element={
              <RequireRole roles={['admin', 'hr']}>
                <HrDashboardPage />
              </RequireRole>
            }
          />
          <Route
            path="/manager/dashboard"
            element={
              <RequireRole roles={['admin', 'hr', 'manager']}>
                <ManagerDashboardPage />
              </RequireRole>
            }
          />
          <Route
            path="/team-lead/dashboard"
            element={
              <RequireRole roles={['admin', 'hr', 'manager', 'team-lead']}>
                <TeamLeadDashboardPage />
              </RequireRole>
            }
          />
          <Route path="/employee/dashboard" element={<EmployeeDashboardPage />} />

          {/* Workforce Management */}
          <Route
            path="/employees"
            element={
              <RequireRole permissions={['employee:view']}>
                <EmployeesPage />
              </RequireRole>
            }
          />
          <Route
            path="/employees/:id"
            element={
              <RequireRole permissions={['employee:view']}>
                <EmployeeDetailPage />
              </RequireRole>
            }
          />
          <Route
            path="/attendance"
            element={
              <RequireRole permissions={['attendance:view']}>
                <AttendancePage />
              </RequireRole>
            }
          />
          <Route
            path="/attendance/history"
            element={
              <RequireRole permissions={['attendance:view']}>
                <AttendanceHistoryPage />
              </RequireRole>
            }
          />
          <Route
            path="/attendance/corrections"
            element={
              <RequireRole permissions={['attendance:manage']}>
                <AttendanceCorrectionsPage />
              </RequireRole>
            }
          />
          <Route
            path="/absence"
            element={
              <RequireRole permissions={['leave:view']}>
                <AbsencePage />
              </RequireRole>
            }
          />
          <Route
            path="/absence/calendar"
            element={
              <RequireRole permissions={['leave:view']}>
                <AbsenceCalendarPage />
              </RequireRole>
            }
          />

          {/* Operations & Analytics */}
          <Route
            path="/scheduling"
            element={
              <RequireRole permissions={['schedule:view']}>
                <SchedulingPage />
              </RequireRole>
            }
          />
          <Route
            path="/scheduling/shifts"
            element={
              <RequireRole permissions={['schedule:view']}>
                <ShiftsPage />
              </RequireRole>
            }
          />
          <Route
            path="/scheduling/swaps"
            element={
              <RequireRole permissions={['schedule:swap']}>
                <SwapsPage />
              </RequireRole>
            }
          />
          <Route
            path="/analytics"
            element={
              <RequireRole permissions={['analytics:view']}>
                <AnalyticsPage />
              </RequireRole>
            }
          />
          <Route
            path="/compliance"
            element={
              <RequireRole permissions={['compliance:view']}>
                <CompliancePage />
              </RequireRole>
            }
          />
          <Route
            path="/payroll"
            element={
              <RequireRole permissions={['payroll:view']}>
                <PayrollPage />
              </RequireRole>
            }
          />
          <Route
            path="/reports"
            element={
              <RequireRole permissions={['report:export']}>
                <ReportsPage />
              </RequireRole>
            }
          />

          {/* Governance & Preferences */}
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route
            path="/audit-logs"
            element={
              <RequireRole roles={['admin']} permissions={['audit:view']}>
                <AuditLogsPage />
              </RequireRole>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireRole roles={['admin']} permissions={['settings:manage']}>
                <SettingsPage />
              </RequireRole>
            }
          />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Error Feedback Routes inside Layout */}
          <Route path="/403" element={<Forbidden403 />} />
          <Route path="/404" element={<NotFound404 />} />
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </Suspense>
  );
};
