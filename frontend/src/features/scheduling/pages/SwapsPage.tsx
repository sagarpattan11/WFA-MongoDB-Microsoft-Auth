import React from 'react';
import { ColumnDef, DataTableShell } from '../../../components/common/DataTableShell';
import { PageShell } from '../../../components/layout/PageShell';

interface SwapRecord extends Record<string, unknown> {
  id: string;
  requestor: string;
  targetEmployee: string;
  shiftDate: string;
  status: string;
  action: string;
}

export const SwapsPage: React.FC = () => {
  const columns: ColumnDef<SwapRecord>[] = [
    { id: 'requestor', header: 'Requesting Employee' },
    { id: 'targetEmployee', header: 'Target Employee' },
    { id: 'shiftDate', header: 'Shift Date' },
    { id: 'status', header: 'Approval Status' },
    { id: 'action', header: 'Action' },
  ];

  return (
    <PageShell
      title="Shift Swap Approvals"
      description="Review peer-to-peer shift trade requests, manager authorizations, and automated conflict audits."
    >
      <DataTableShell<SwapRecord>
        columns={columns}
        data={[]}
        emptyTitle="No Pending Shift Swaps"
        emptyDescription="Submitted shift swap requests will appear here for team lead and manager approval."
      />
    </PageShell>
  );
};
