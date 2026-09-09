import { DollarSign, Download } from 'lucide-react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import React from 'react';
import { AppCard } from '../../../components/common/AppCard';
import { KPICardShell } from '../../../components/common/KPICardShell';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { PageShell } from '../../../components/layout/PageShell';

export const PayrollPage: React.FC = () => {
  return (
    <PageShell
      title="Payroll & Wage Processing"
      description="Calculate gross pay, overtime premiums, statutory deductions, and generate payslips."
      actions={
        <Button variant="outlined" startIcon={<Download size={16} />}>
          Export Payroll Summary
        </Button>
      }
    >
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell title="Total Payroll Cost" value="—" subtitle="Current cycle" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell title="Processed Timesheets" value="—" subtitle="Verified records" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell title="Overtime Premiums" value="—" subtitle="Approved extra hours" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell title="Pay Cycle Status" value="—" subtitle="Draft stage" />
        </Grid>
      </Grid>

      <AppCard title="Payroll Batch Summary" subheader="Active payroll run records and pay distribution">
        <EmptyState
          title="Payroll Batch Initialized"
          description="Payroll records and batch calculations will populate dynamically from verified timesheet inputs."
          icon={<DollarSign size={32} />}
        />
      </AppCard>
    </PageShell>
  );
};
