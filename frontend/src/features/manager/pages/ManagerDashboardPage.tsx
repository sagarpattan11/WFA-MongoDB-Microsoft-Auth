import {
  Calendar,
  CheckCircle,
  Clock,
  Users,
} from 'lucide-react';
import Grid from '@mui/material/Grid';
import React from 'react';
import { AppCard } from '../../../components/common/AppCard';
import { KPICardShell } from '../../../components/common/KPICardShell';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { PageShell } from '../../../components/layout/PageShell';

export const ManagerDashboardPage: React.FC = () => {
  return (
    <PageShell
      title="Department Manager Portal"
      description="Departmental shift coverage, overtime monitoring, and employee attendance approvals."
    >
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Team Members"
            value="—"
            subtitle="Department roster"
            icon={<Users size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Team Attendance"
            value="—"
            subtitle="Today's check-ins"
            icon={<Clock size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Shift Approvals"
            value="—"
            subtitle="Pending swap requests"
            icon={<Calendar size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="SLA Compliance"
            value="—"
            subtitle="Team target status"
            icon={<CheckCircle size={20} />}
          />
        </Grid>
      </Grid>

      <AppCard title="Department Roster & Exceptions" subheader="Active shifts and overtime authorizations">
        <EmptyState
          title="Roster Data Synchronizing"
          description="Shift rosters and attendance exceptions will populate once MongoDB storage is connected."
          icon={<Clock size={32} />}
        />
      </AppCard>
    </PageShell>
  );
};
