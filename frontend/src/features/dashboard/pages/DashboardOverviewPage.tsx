import {
  Activity,
  AlertCircle,
  Clock,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Grid from '@mui/material/Grid';
import React from 'react';
import { AppCard } from '../../../components/common/AppCard';
import { KPICardShell } from '../../../components/common/KPICardShell';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { PageShell } from '../../../components/layout/PageShell';

export const DashboardOverviewPage: React.FC = () => {
  return (
    <PageShell
      title="Dashboard Overview"
      description="Real-time operational summary, workforce attendance, and compliance monitoring."
    >
      {/* KPI Section Shells */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Total Workforce"
            value="—"
            subtitle="Active headcount"
            icon={<Users size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Present Today"
            value="—"
            subtitle="Real-time check-ins"
            icon={<Clock size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Compliance Score"
            value="—"
            subtitle="Audit health"
            icon={<ShieldCheck size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Active Roster Shifts"
            value="—"
            subtitle="Scheduled coverage"
            icon={<Activity size={20} />}
          />
        </Grid>
      </Grid>

      {/* Main Content Panels */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <AppCard title="Live Workforce Telemetry" subheader="Real-time attendance and shift distribution">
            <EmptyState
              title="Awaiting Live Telemetry"
              description="Real-time workforce activity stream will be active upon connecting data persistence and live socket stream."
              icon={<Clock size={32} />}
              minHeight="280px"
            />
          </AppCard>
        </Grid>

        <Grid item xs={12} lg={4}>
          <AppCard title="System & Compliance Alerts" subheader="Active exceptions and policy warnings">
            <EmptyState
              title="No Pending Alerts"
              description="All systems are operating within defined regulatory thresholds."
              icon={<AlertCircle size={32} />}
              minHeight="280px"
            />
          </AppCard>
        </Grid>
      </Grid>
    </PageShell>
  );
};
