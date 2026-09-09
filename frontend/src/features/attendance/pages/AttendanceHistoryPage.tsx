import { Download } from 'lucide-react';
import Button from '@mui/material/Button';
import React from 'react';
import { ColumnDef, DataTableShell } from '../../../components/common/DataTableShell';
import { PageShell } from '../../../components/layout/PageShell';

interface HistoryRecord extends Record<string, unknown> {
  id: string;
  date: string;
  employee: string;
  totalHours: string;
  overtime: string;
  status: string;
}

export const AttendanceHistoryPage: React.FC = () => {
  const columns: ColumnDef<HistoryRecord>[] = [
    { id: 'date', header: 'Date' },
    { id: 'employee', header: 'Employee' },
    { id: 'totalHours', header: 'Total Hours' },
    { id: 'overtime', header: 'Overtime' },
    { id: 'status', header: 'Status' },
  ];

  return (
    <PageShell
      title="Attendance History Log"
      description="Historical timesheet data, attendance records, and cumulative work hours."
      actions={
        <Button variant="outlined" startIcon={<Download size={16} />}>
          Export Historical Log
        </Button>
      }
    >
      <DataTableShell<HistoryRecord>
        columns={columns}
        data={[]}
        emptyTitle="No Historical Attendance Data"
        emptyDescription="Historical timesheets and punch records will appear here as records are generated."
      />
    </PageShell>
  );
};
