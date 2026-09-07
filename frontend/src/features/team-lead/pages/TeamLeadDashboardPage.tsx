import {
  AlertTriangle,
  CheckSquare,
  Clock,
  Users,
} from 'lucide-react';
import Grid from '@mui/material/Grid';
import React from 'react';
import { AppCard } from '../../../components/common/AppCard';
import { KPICardShell } from '../../../components/common/KPICardShell';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { PageShell } from '../../../components/layout/PageShell';

export const TeamLeadDashboardPage: React.FC = () => {
  return (
    <PageShell
      title="Team Lead Operations Desk"
      description="Squad-level roster status, break tracking, and shift swap coordination."
    >
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Squad Size"
            value="—"
            subtitle="Assigned members"
            icon={<Users size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="On Duty"
            value="—"
            subtitle="Active squad members"
            icon={<Clock size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Shift Tasks"
            value="—"
            subtitle="Completed today"
            icon={<CheckSquare size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Coverage Alerts"
            value="—"
            subtitle="Critical gaps"
            icon={<AlertTriangle size={20} />}
          />
        </Grid>
      </Grid>

      <AppCard title="Squad Operations" subheader="Live task allocation and coverage tracking">
        <EmptyState
          title="Squad Activity Stream"
          description="Operational metrics and coverage status will be displayed here."
          icon={<Users size={32} />}
        />
      </AppCard>
    </PageShell>
  );
};
