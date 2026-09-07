import { Download, Plus } from 'lucide-react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { AppSearchField } from '../../../components/common/AppSearchField';
import { ColumnDef, DataTableShell } from '../../../components/common/DataTableShell';
import { PageShell } from '../../../components/layout/PageShell';

interface EmployeeRecord extends Record<string, unknown> {
  id: string;
  name: string;
  department: string;
  jobTitle: string;
  status: string;
}

export const EmployeesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const columns: ColumnDef<EmployeeRecord>[] = [
    { id: 'name', header: 'Employee Name' },
    { id: 'department', header: 'Department' },
    { id: 'jobTitle', header: 'Role Title' },
    { id: 'status', header: 'Status' },
  ];

  return (
    <PageShell
      title="Employee Directory"
      description="Manage enterprise personnel records, departmental assignments, and role bindings."
      actions={
        <>
          <Button variant="outlined" startIcon={<Download size={16} />}>
            Export Directory
          </Button>
          <Button variant="contained" startIcon={<Plus size={16} />}>
            Add Employee
          </Button>
        </>
      }
    >
      <Box sx={{ mb: 3, maxWidth: 360 }}>
        <AppSearchField
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, ID, department..."
        />
      </Box>

      <DataTableShell<EmployeeRecord>
        columns={columns}
        data={[]}
        emptyTitle="No Employees Configured"
        emptyDescription="Employee records will appear here as team members are onboarded."
      />
    </PageShell>
  );
};
