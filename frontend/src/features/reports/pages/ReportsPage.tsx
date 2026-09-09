import { Plus } from 'lucide-react';
import Button from '@mui/material/Button';
import React from 'react';
import { ColumnDef, DataTableShell } from '../../../components/common/DataTableShell';
import { PageShell } from '../../../components/layout/PageShell';

interface ReportRecord extends Record<string, unknown> {
  id: string;
  reportName: string;
  type: string;
  frequency: string;
  lastGenerated: string;
  action: string;
}

export const ReportsPage: React.FC = () => {
  const columns: ColumnDef<ReportRecord>[] = [
    { id: 'reportName', header: 'Report Name' },
    { id: 'type', header: 'Type' },
    { id: 'frequency', header: 'Schedule' },
    { id: 'lastGenerated', header: 'Last Generated' },
    { id: 'action', header: 'Action' },
  ];

  return (
    <PageShell
      title="Enterprise Report Generator"
      description="Create custom workforce reports, scheduled CSV/PDF exports, and executive summaries."
      actions={
        <Button variant="contained" startIcon={<Plus size={16} />}>
          New Custom Report
        </Button>
      }
    >
      <DataTableShell<ReportRecord>
        columns={columns}
        data={[]}
        emptyTitle="No Generated Reports"
        emptyDescription="Generated and scheduled workforce reports will be available for download here."
      />
    </PageShell>
  );
};
