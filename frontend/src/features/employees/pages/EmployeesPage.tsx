import {
  Download,
  Edit2,
  Eye,
  Plus,
  RotateCcw,
  Trash2,
  UserCheck,
  UserX,
} from 'lucide-react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';
import { AppSearchField } from '../../../components/common/AppSearchField';
import { ConfirmationDialog } from '../../../components/common/ConfirmationDialog';
import { ColumnDef, DataTableShell } from '../../../components/common/DataTableShell';
import { PageShell } from '../../../components/layout/PageShell';

export interface DepartmentOption {
  _id: string;
  name: string;
  code: string;
}

export interface TeamOption {
  _id: string;
  name: string;
  departmentId: string;
}

export interface EmployeeRow extends Record<string, unknown> {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId?: { _id: string; name: string; code: string };
  teamId?: { _id: string; name: string };
  jobTitle: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contractor' | 'Intern';
  status: 'active' | 'on-leave' | 'probation' | 'terminated';
  location: 'Headquarters' | 'Remote' | 'Regional Office' | 'Branch Office';
  hireDate: string;
  salary?: number;
  isDeleted?: boolean;
}

export const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();

  // Filters & State
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  // Form Fields
  const [formEmployeeId, setFormEmployeeId] = useState<string>('');
  const [formFirstName, setFormFirstName] = useState<string>('');
  const [formLastName, setFormLastName] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formPhone, setFormPhone] = useState<string>('');
  const [formDeptId, setFormDeptId] = useState<string>('');
  const [formTeamId, setFormTeamId] = useState<string>('');
  const [formJobTitle, setFormJobTitle] = useState<string>('');
  const [formEmpType, setFormEmpType] = useState<string>('Full-Time');
  const [formStatus, setFormStatus] = useState<string>('active');
  const [formLocation, setFormLocation] = useState<string>('Headquarters');
  const [formSalary, setFormSalary] = useState<string>('');

  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeRow | null>(null);

  // Load Departments & Teams
  const loadMetadata = async () => {
    try {
      const [deptRes, teamRes] = await Promise.all([
        apiClient.get(API_ENDPOINTS.DEPARTMENTS.LIST),
        apiClient.get(API_ENDPOINTS.TEAMS.LIST),
      ]);
      setDepartments(deptRes.data.data);
      setTeams(teamRes.data.data);
    } catch (err) {
      console.error('Error loading metadata:', err);
    }
  };

  // Load Employees with pagination & filters
  const loadEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        limit: 10,
      };
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (selectedDept) params.departmentId = selectedDept;
      if (selectedStatus) params.status = selectedStatus;

      const res = await apiClient.get(API_ENDPOINTS.EMPLOYEES.LIST, { params });
      setEmployees(res.data.data.employees);
      setTotalPages(res.data.data.pagination.totalPages);
      setTotalCount(res.data.data.pagination.total);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: { message?: string } } } };
      setErrorMsg(errorObj.response?.data?.error?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedDept, selectedStatus]);

  useEffect(() => {
    loadMetadata();
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormEmployeeId(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormFirstName('');
    setFormLastName('');
    setFormEmail('');
    setFormPhone('');
    setFormDeptId(departments[0]?._id || '');
    setFormTeamId('');
    setFormJobTitle('');
    setFormEmpType('Full-Time');
    setFormStatus('active');
    setFormLocation('Headquarters');
    setFormSalary('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (emp: EmployeeRow) => {
    setIsEditing(true);
    setEditingId(emp._id);
    setFormEmployeeId(emp.employeeId);
    setFormFirstName(emp.firstName);
    setFormLastName(emp.lastName);
    setFormEmail(emp.email);
    setFormPhone(emp.phone || '');
    setFormDeptId(emp.departmentId?._id || '');
    setFormTeamId(emp.teamId?._id || '');
    setFormJobTitle(emp.jobTitle);
    setFormEmpType(emp.employmentType);
    setFormStatus(emp.status);
    setFormLocation(emp.location);
    setFormSalary(emp.salary ? String(emp.salary) : '');
    setModalOpen(true);
  };

  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setErrorMsg(null);

    const payload = {
      employeeId: formEmployeeId,
      firstName: formFirstName,
      lastName: formLastName,
      email: formEmail,
      phone: formPhone,
      departmentId: formDeptId,
      teamId: formTeamId || null,
      jobTitle: formJobTitle,
      employmentType: formEmpType,
      status: formStatus,
      location: formLocation,
      salary: formSalary ? Number(formSalary) : 0,
    };

    try {
      if (isEditing && editingId) {
        await apiClient.put(API_ENDPOINTS.EMPLOYEES.UPDATE(editingId), payload);
        setSuccessMsg('Employee profile updated.');
      } else {
        await apiClient.post(API_ENDPOINTS.EMPLOYEES.CREATE, payload);
        setSuccessMsg('Employee registered successfully.');
      }
      setModalOpen(false);
      loadEmployees();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: { message?: string } } } };
      setErrorMsg(errorObj.response?.data?.error?.message || 'Failed to save employee.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    try {
      await apiClient.delete(API_ENDPOINTS.EMPLOYEES.DELETE(employeeToDelete._id));
      setSuccessMsg(`Employee ${employeeToDelete.firstName} ${employeeToDelete.lastName} soft-deleted.`);
      setDeleteDialogOpen(false);
      loadEmployees();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: { message?: string } } } };
      setErrorMsg(errorObj.response?.data?.error?.message || 'Failed to delete employee.');
    }
  };

  const handleRestoreEmployee = async (emp: EmployeeRow) => {
    try {
      await apiClient.patch(API_ENDPOINTS.EMPLOYEES.RESTORE(emp._id));
      setSuccessMsg(`Employee ${emp.firstName} ${emp.lastName} restored to active directory.`);
      loadEmployees();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: { message?: string } } } };
      setErrorMsg(errorObj.response?.data?.error?.message || 'Failed to restore employee.');
    }
  };

  const handleToggleStatus = async (emp: EmployeeRow) => {
    const nextStatus = emp.status === 'active' ? 'on-leave' : 'active';
    try {
      await apiClient.patch(API_ENDPOINTS.EMPLOYEES.UPDATE_STATUS(emp._id), { status: nextStatus });
      setSuccessMsg(`Status updated to ${nextStatus}.`);
      loadEmployees();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: { message?: string } } } };
      setErrorMsg(errorObj.response?.data?.error?.message || 'Failed to update status.');
    }
  };

  const columns: ColumnDef<EmployeeRow>[] = [
    {
      id: 'employeeId',
      header: 'ID',
      width: 110,
      accessor: (row) => (
        <Typography variant="body2" fontWeight={600} color="primary.main">
          {row.employeeId}
        </Typography>
      ),
    },
    {
      id: 'name',
      header: 'Employee Name',
      accessor: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {row.firstName} {row.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.email}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'department',
      header: 'Department',
      accessor: (row) => row.departmentId?.name || '—',
    },
    {
      id: 'jobTitle',
      header: 'Job Title',
      accessor: (row) => (
        <Box>
          <Typography variant="body2">{row.jobTitle}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.location} • {row.employmentType}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      width: 120,
      accessor: (row) => {
        if (row.isDeleted) {
          return (
            <Chip
              label="ARCHIVED"
              size="small"
              color="error"
              variant="filled"
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            />
          );
        }
        const colorMap: Record<string, 'success' | 'warning' | 'default' | 'error'> = {
          active: 'success',
          'on-leave': 'warning',
          probation: 'default',
          terminated: 'error',
        };
        return (
          <Chip
            label={row.status.toUpperCase()}
            size="small"
            color={colorMap[row.status] || 'default'}
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
          />
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      width: 160,
      align: 'right',
      accessor: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
          {row.isDeleted ? (
            <Button
              size="small"
              variant="outlined"
              color="success"
              startIcon={<RotateCcw size={14} />}
              onClick={() => handleRestoreEmployee(row)}
              sx={{ textTransform: 'none', py: 0.2, px: 1, fontSize: '0.75rem' }}
            >
              Restore
            </Button>
          ) : (
            <>
              <IconButton
                size="small"
                onClick={() => navigate(`/employees/${row._id}`)}
                title="View Details"
              >
                <Eye size={16} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleToggleStatus(row)}
                title={row.status === 'active' ? 'Mark On-Leave' : 'Mark Active'}
                color={row.status === 'active' ? 'default' : 'success'}
              >
                {row.status === 'active' ? <UserCheck size={16} /> : <UserX size={16} />}
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleOpenEditModal(row)}
                title="Edit Profile"
              >
                <Edit2 size={16} />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  setEmployeeToDelete(row);
                  setDeleteDialogOpen(true);
                }}
                title="Soft Delete Employee"
              >
                <Trash2 size={16} />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <PageShell
      title="Employee Directory"
      description="Manage personnel records, departments, job designations, and employment statuses."
      actions={
        <>
          <Button variant="outlined" startIcon={<Download size={16} />}>
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={handleOpenAddModal}
            sx={{ bgcolor: '#0F6CBD' }}
          >
            Add Employee
          </Button>
        </>
      }
    >
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      )}

      {successMsg && (
        <Alert severity="success" sx={{ mb: 2.5 }} onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      )}

      {/* Filter Toolbar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
          alignItems: 'center',
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 240 }}>
          <AppSearchField
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setPage(1);
            }}
            placeholder="Search by name, ID, email, title..."
          />
        </Box>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="dept-filter-label">Department</InputLabel>
          <Select
            labelId="dept-filter-label"
            value={selectedDept}
            label="Department"
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((d) => (
              <MenuItem key={d._id} value={d._id}>
                {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={selectedStatus}
            label="Status"
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">All Active Statuses</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="on-leave">On-Leave</MenuItem>
            <MenuItem value="probation">Probation</MenuItem>
            <MenuItem value="terminated">Terminated</MenuItem>
            <MenuItem value="archived" sx={{ color: 'error.main', fontWeight: 600 }}>
              Archived / Soft-Deleted
            </MenuItem>
          </Select>
        </FormControl>

        {(searchQuery || selectedDept || selectedStatus) && (
          <Button
            size="small"
            onClick={() => {
              setSearchQuery('');
              setSelectedDept('');
              setSelectedStatus('');
              setPage(1);
            }}
          >
            Reset Filters
          </Button>
        )}
      </Box>

      {/* Data Table */}
      <DataTableShell<EmployeeRow>
        columns={columns}
        data={employees}
        loading={loading}
        emptyTitle="No Employees Found"
        emptyDescription="No employee records match the selected filters. Click 'Add Employee' to register personnel."
        page={page}
        totalPages={totalPages}
        totalItems={totalCount}
        pageSize={10}
        onPageChange={setPage}
      />

      {/* Add / Edit Employee Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSaveEmployee}>
          <DialogTitle fontWeight={600}>
            {isEditing ? 'Edit Employee Record' : 'Register New Employee'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Employee ID"
                  value={formEmployeeId}
                  onChange={(e) => setFormEmployeeId(e.target.value)}
                  disabled={isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Job Title"
                  value={formJobTitle}
                  onChange={(e) => setFormJobTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="First Name"
                  value={formFirstName}
                  onChange={(e) => setFormFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Last Name"
                  value={formLastName}
                  onChange={(e) => setFormLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  size="small"
                  label="Corporate Email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Phone Number"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" required>
                  <InputLabel id="form-dept-label">Department</InputLabel>
                  <Select
                    labelId="form-dept-label"
                    value={formDeptId}
                    label="Department"
                    onChange={(e) => setFormDeptId(e.target.value)}
                  >
                    {departments.map((d) => (
                      <MenuItem key={d._id} value={d._id}>
                        {d.name} ({d.code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="form-team-label">Team (Optional)</InputLabel>
                  <Select
                    labelId="form-team-label"
                    value={formTeamId}
                    label="Team (Optional)"
                    onChange={(e) => setFormTeamId(e.target.value)}
                  >
                    <MenuItem value="">None / Unassigned</MenuItem>
                    {teams
                      .filter((t) => !formDeptId || t.departmentId === formDeptId)
                      .map((t) => (
                        <MenuItem key={t._id} value={t._id}>
                          {t.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="form-emp-type-label">Employment Type</InputLabel>
                  <Select
                    labelId="form-emp-type-label"
                    value={formEmpType}
                    label="Employment Type"
                    onChange={(e) => setFormEmpType(e.target.value)}
                  >
                    <MenuItem value="Full-Time">Full-Time</MenuItem>
                    <MenuItem value="Part-Time">Part-Time</MenuItem>
                    <MenuItem value="Contractor">Contractor</MenuItem>
                    <MenuItem value="Intern">Intern</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="form-status-label">Status</InputLabel>
                  <Select
                    labelId="form-status-label"
                    value={formStatus}
                    label="Status"
                    onChange={(e) => setFormStatus(e.target.value)}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="on-leave">On-Leave</MenuItem>
                    <MenuItem value="probation">Probation</MenuItem>
                    <MenuItem value="terminated">Terminated</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="form-loc-label">Work Location</InputLabel>
                  <Select
                    labelId="form-loc-label"
                    value={formLocation}
                    label="Work Location"
                    onChange={(e) => setFormLocation(e.target.value)}
                  >
                    <MenuItem value="Headquarters">Headquarters</MenuItem>
                    <MenuItem value="Remote">Remote</MenuItem>
                    <MenuItem value="Regional Office">Regional Office</MenuItem>
                    <MenuItem value="Branch Office">Branch Office</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  label="Annual Salary ($)"
                  value={formSalary}
                  onChange={(e) => setFormSalary(e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setModalOpen(false)} color="inherit" disabled={modalLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={modalLoading}>
              {modalLoading ? 'Saving...' : isEditing ? 'Update Employee' : 'Create Employee'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Soft Delete Employee Record"
        message={`Are you sure you want to soft-delete "${employeeToDelete?.firstName} ${employeeToDelete?.lastName}" (${employeeToDelete?.employeeId})? The record will be archived.`}
        confirmLabel="Soft Delete"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </PageShell>
  );
};
