import { ShieldCheck } from 'lucide-react';
import Grid from '@mui/material/Grid';
import React from 'react';
import { AppCard } from '../../../components/common/AppCard';
import { KPICardShell } from '../../../components/common/KPICardShell';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { PageShell } from '../../../components/layout/PageShell';

export const CompliancePage: React.FC = () => {
  return (
    <PageShell
      title="Regulatory & Overtime Compliance"
      description="Automated monitoring of statutory working hour limits, mandatory rest periods, and labor standards."
    >
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell title="Compliance Health" value="—" subtitle="Statutory threshold" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell title="Policy Violations" value="—" subtitle="Active breaches" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell title="Rest Period Breaches" value="—" subtitle="Mandatory break gaps" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell title="Pending Audits" value="—" subtitle="Requires sign-off" />
        </Grid>
      </Grid>

      <AppCard title="Active Compliance Audit Ledger" subheader="Recorded exceptions and policy rules">
        <EmptyState
          title="Zero Compliance Violations"
          description="Compliance rules engine will evaluate all active shifts and timesheets against labor policies."
          icon={<ShieldCheck size={32} />}
        />
      </AppCard>
    </PageShell>
  );
};
