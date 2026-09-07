import {
  Calendar,
  DollarSign,
  FileText,
  Users,
} from 'lucide-react';
import Grid from '@mui/material/Grid';
import React from 'react';
import { AppCard } from '../../../components/common/AppCard';
import { KPICardShell } from '../../../components/common/KPICardShell';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { PageShell } from '../../../components/layout/PageShell';

export const HrDashboardPage: React.FC = () => {
  return (
    <PageShell
      title="HR Executive Dashboard"
      description="Workforce headcount planning, leave authorization queues, and compliance status."
    >
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Total Headcount"
            value="—"
            subtitle="Across all departments"
            icon={<Users size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Pending Leaves"
            value="—"
            subtitle="Awaiting HR review"
            icon={<Calendar size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Payroll Cycle"
            value="—"
            subtitle="Current cycle status"
            icon={<DollarSign size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Onboarding Queue"
            value="—"
            subtitle="Pending provisioning"
            icon={<FileText size={20} />}
          />
        </Grid>
      </Grid>

      <AppCard title="HR Action Center" subheader="Pending approvals, contracts, and regulatory filings">
        <EmptyState
          title="No Pending Action Items"
          description="Employee leave requests and compliance alerts will appear here for HR review."
          icon={<Users size={32} />}
        />
      </AppCard>
    </PageShell>
  );
};
