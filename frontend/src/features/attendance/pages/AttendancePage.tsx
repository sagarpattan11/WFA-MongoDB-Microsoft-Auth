import { Clock, Download } from 'lucide-react';
import Button from '@mui/material/Button';
import React from 'react';
import { ColumnDef, DataTableShell } from '../../../components/common/DataTableShell';
import { PageShell } from '../../../components/layout/PageShell';

interface AttendanceRow extends Record<string, unknown> {
  id: string;
  employeeName: string;
  checkIn: string;
  checkOut: string;
  status: string;
}

export const AttendancePage: React.FC = () => {
  const columns: ColumnDef<AttendanceRow>[] = [
    { id: 'employeeName', header: 'Employee' },
    { id: 'checkIn', header: 'Check In' },
    { id: 'checkOut', header: 'Check Out' },
    { id: 'status', header: 'Status' },
  ];

  return (
    <PageShell
      title="Live Attendance Records"
      description="Real-time check-in telemetries, working hours, and daily attendance logs."
      actions={
        <>
          <Button variant="outlined" startIcon={<Download size={16} />}>
            Export Timesheet
          </Button>
          <Button variant="contained" startIcon={<Clock size={16} />}>
            Manual Clock In
          </Button>
        </>
      }
    >
      <DataTableShell<AttendanceRow>
        columns={columns}
        data={[]}
        emptyTitle="No Attendance Records for Today"
        emptyDescription="Live check-ins will stream dynamically via real-time telemetry."
      />
    </PageShell>
  );
};
