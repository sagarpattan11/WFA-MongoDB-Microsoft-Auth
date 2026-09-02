import { BarChart3, Download } from 'lucide-react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import React from 'react';
import { AppCard } from '../../../components/common/AppCard';
import { KPICardShell } from '../../../components/common/KPICardShell';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { PageShell } from '../../../components/layout/PageShell';

export const AnalyticsPage: React.FC = () => {
  return (
    <PageShell
      title="Productivity & Workforce Analytics"
      description="Deep analytical intelligence on attendance trends, overtime distributions, and capacity utilization."
      actions={
        <Button variant="outlined" startIcon={<Download size={16} />}>
          Export Analytics Data
        </Button>
      }
    >
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell title="Attendance Rate" value="—" subtitle="Rolling 30 days" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell title="Overtime Volume" value="—" subtitle="Total hours" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell title="Tardiness Index" value="—" subtitle="Deviation rate" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell title="Capacity Utilization" value="—" subtitle="Roster vs actual" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <AppCard title="Workforce Trends & Variance" subheader="Aggregated overtime and utilization metrics">
            <EmptyState
              title="Analytics Engine Standby"
              description="Analytics charts will render with Recharts once aggregated data pipelines are connected."
              icon={<BarChart3 size={32} />}
              minHeight="280px"
            />
          </AppCard>
        </Grid>
        <Grid item xs={12} lg={4}>
          <AppCard title="Department Breakdown" subheader="Relative headcount and productivity">
            <EmptyState
              title="No Department Metrics"
              description="Metrics will calculate dynamically upon data availability."
              icon={<BarChart3 size={32} />}
              minHeight="280px"
            />
          </AppCard>
        </Grid>
      </Grid>
    </PageShell>
  );
};
