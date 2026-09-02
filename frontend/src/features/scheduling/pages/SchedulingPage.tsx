import { Plus } from 'lucide-react';
import Button from '@mui/material/Button';
import React from 'react';
import { ColumnDef, DataTableShell } from '../../../components/common/DataTableShell';
import { PageShell } from '../../../components/layout/PageShell';

interface ShiftScheduleRecord extends Record<string, unknown> {
  id: string;
  shiftName: string;
  timeWindow: string;
  department: string;
  assignedStaff: string;
  coverageStatus: string;
}

export const SchedulingPage: React.FC = () => {
  const columns: ColumnDef<ShiftScheduleRecord>[] = [
    { id: 'shiftName', header: 'Shift Name' },
    { id: 'timeWindow', header: 'Time Window' },
    { id: 'department', header: 'Department' },
    { id: 'assignedStaff', header: 'Assigned Staff' },
    { id: 'coverageStatus', header: 'Coverage' },
  ];

  return (
    <PageShell
      title="Workforce Shift Scheduling"
      description="Design shift patterns, allocate squad rosters, and optimize operational coverage."
      actions={
        <Button variant="contained" startIcon={<Plus size={16} />}>
          Create Shift Pattern
        </Button>
      }
    >
      <DataTableShell<ShiftScheduleRecord>
        columns={columns}
        data={[]}
        emptyTitle="No Active Shift Schedules"
        emptyDescription="Configured shifts and roster schedules will appear here."
      />
    </PageShell>
  );
};
