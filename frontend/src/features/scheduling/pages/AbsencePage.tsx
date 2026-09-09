import { Plus } from 'lucide-react';
import Button from '@mui/material/Button';
import React from 'react';
import { ColumnDef, DataTableShell } from '../../../components/common/DataTableShell';
import { PageShell } from '../../../components/layout/PageShell';

interface AbsenceRecord extends Record<string, unknown> {
  id: string;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
}

export const AbsencePage: React.FC = () => {
  const columns: ColumnDef<AbsenceRecord>[] = [
    { id: 'employee', header: 'Employee' },
    { id: 'type', header: 'Leave Type' },
    { id: 'startDate', header: 'Start Date' },
    { id: 'endDate', header: 'End Date' },
    { id: 'status', header: 'Approval Status' },
  ];

  return (
    <PageShell
      title="Absence & Leave Management"
      description="Track paid time off (PTO), sick leaves, vacation requests, and statutory absences."
      actions={
        <Button variant="contained" startIcon={<Plus size={16} />}>
          Request Leave
        </Button>
      }
    >
      <DataTableShell<AbsenceRecord>
        columns={columns}
        data={[]}
        emptyTitle="No Leave Requests Found"
        emptyDescription="Submitted absence requests will be listed here for approval workflows."
      />
    </PageShell>
  );
};
