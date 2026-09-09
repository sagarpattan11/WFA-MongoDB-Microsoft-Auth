import {
  Calendar,
  Clock,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import Grid from '@mui/material/Grid';
import React from 'react';
import { AppCard } from '../../../components/common/AppCard';
import { KPICardShell } from '../../../components/common/KPICardShell';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { PageShell } from '../../../components/layout/PageShell';

export const EmployeeDashboardPage: React.FC = () => {
  return (
    <PageShell
      title="Employee Self-Service Workspace"
      description="Personal clock-in/out, upcoming shift roster, leave balance, and payslips."
    >
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Clock Status"
            value="—"
            subtitle="Today's punch"
            icon={<Clock size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Next Shift"
            value="—"
            subtitle="Upcoming assignment"
            icon={<Calendar size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Leave Balance"
            value="—"
            subtitle="Available PTO days"
            icon={<UserCheck size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Latest Payslip"
            value="—"
            subtitle="Current pay cycle"
            icon={<DollarSign size={20} />}
          />
        </Grid>
      </Grid>

      <AppCard title="My Work Schedule" subheader="Upcoming shifts, scheduled breaks, and leave requests">
        <EmptyState
          title="Schedule Synchronization"
          description="Your personal work schedule will be available once the scheduling module is connected."
          icon={<Calendar size={32} />}
        />
      </AppCard>
    </PageShell>
  );
};
