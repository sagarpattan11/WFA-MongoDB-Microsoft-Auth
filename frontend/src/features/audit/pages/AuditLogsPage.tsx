import React from 'react';
import { ColumnDef, DataTableShell } from '../../../components/common/DataTableShell';
import { PageShell } from '../../../components/layout/PageShell';

interface AuditLogRecord extends Record<string, unknown> {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entity: string;
  ipAddress: string;
}

export const AuditLogsPage: React.FC = () => {
  const columns: ColumnDef<AuditLogRecord>[] = [
    { id: 'timestamp', header: 'Timestamp' },
    { id: 'actor', header: 'User / Actor' },
    { id: 'action', header: 'Action Performed' },
    { id: 'entity', header: 'Target Entity' },
    { id: 'ipAddress', header: 'IP Address' },
  ];

  return (
    <PageShell
      title="Platform Audit & Compliance Trail"
      description="Immutable record of administrative actions, authentication attempts, and authorization updates."
    >
      <DataTableShell<AuditLogRecord>
        columns={columns}
        data={[]}
        emptyTitle="No Audit Logs Recorded"
        emptyDescription="System audit entries and compliance events will be recorded here."
      />
    </PageShell>
  );
};
