import {
  Activity,
  Database,
  Key,
  ShieldCheck,
} from 'lucide-react';
import Grid from '@mui/material/Grid';
import React from 'react';
import { AppCard } from '../../../components/common/AppCard';
import { KPICardShell } from '../../../components/common/KPICardShell';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { PageShell } from '../../../components/layout/PageShell';

export const AdminDashboardPage: React.FC = () => {
  return (
    <PageShell
      title="Admin Governance Console"
      description="System-wide security policies, role-based access control management, and platform audit trail."
    >
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="System Roles"
            value="5"
            subtitle="Configured RBAC tiers"
            icon={<Key size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Security Posture"
            value="Healthy"
            subtitle="Entra ID Guard active"
            icon={<ShieldCheck size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Active Sessions"
            value="—"
            subtitle="Real-time connections"
            icon={<Activity size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Data Cluster"
            value="Standby"
            subtitle="MongoDB Cluster Engine"
            icon={<Database size={20} />}
          />
        </Grid>
      </Grid>

      <AppCard title="Security & Audit Governance" subheader="Recent administrative actions and permission audits">
        <EmptyState
          title="Audit Log Stream Ready"
          description="Administrative governance events and platform audit entries will be recorded in real-time."
          icon={<ShieldCheck size={32} />}
        />
      </AppCard>
    </PageShell>
  );
};
