import React from 'react';
import { ColumnDef, DataTableShell } from '../../../components/common/DataTableShell';
import { PageShell } from '../../../components/layout/PageShell';

interface ShiftPlanRecord extends Record<string, unknown> {
  id: string;
  date: string;
  shift: string;
  department: string;
  headcount: string;
}

export const ShiftsPage: React.FC = () => {
  const columns: ColumnDef<ShiftPlanRecord>[] = [
    { id: 'date', header: 'Date' },
    { id: 'shift', header: 'Shift Pattern' },
    { id: 'department', header: 'Department' },
    { id: 'headcount', header: 'Staff Headcount' },
  ];

  return (
    <PageShell
      title="Roster Shifts Planner"
      description="Detailed shift plan distribution, daily requirements, and workload balancing."
    >
      <DataTableShell<ShiftPlanRecord>
        columns={columns}
        data={[]}
        emptyTitle="No Roster Plans Created"
        emptyDescription="Roster plans will be available once the scheduling persistence module is active."
      />
    </PageShell>
  );
};
