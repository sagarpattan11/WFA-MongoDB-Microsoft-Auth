import React from 'react';
import { ColumnDef, DataTableShell } from '../../../components/common/DataTableShell';
import { PageShell } from '../../../components/layout/PageShell';

interface NotificationRecord extends Record<string, unknown> {
  id: string;
  title: string;
  category: string;
  receivedAt: string;
  status: string;
}

export const NotificationsPage: React.FC = () => {
  const columns: ColumnDef<NotificationRecord>[] = [
    { id: 'title', header: 'Notification' },
    { id: 'category', header: 'Category' },
    { id: 'receivedAt', header: 'Time' },
    { id: 'status', header: 'Status' },
  ];

  return (
    <PageShell
      title="Notifications Center"
      description="System alerts, schedule modifications, shift trade requests, and approval notifications."
    >
      <DataTableShell<NotificationRecord>
        columns={columns}
        data={[]}
        emptyTitle="No New Notifications"
        emptyDescription="You're completely up to date. Real-time updates will arrive via Socket.IO."
      />
    </PageShell>
  );
};
