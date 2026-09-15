import {
  CheckCircle2,
  Download,
  Edit2,
  Eye,
  FileText,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
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
import Tooltip from '@mui/material/Tooltip';
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
  departmentId: string | { _id: string; name?: string; code?: string };
}

const getTeamDeptId = (t: TeamOption): string => {
  if (typeof t.departmentId === 'object' && t.departmentId !== null) {
    return (t.departmentId as { _id: string })._id;
  }
  return String(t.departmentId || '');
};

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
  experienceYears?: number;
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
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

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
  const [formExperienceYears, setFormExperienceYears] = useState<string>('');
  const [formSalary, setFormSalary] = useState<string>('');
  const [formHireDate, setFormHireDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeRow | null>(null);

  // CSV Import / Export State
  const [importModalOpen, setImportModalOpen] = useState<boolean>(false);
  const [importLoading, setImportLoading] = useState<boolean>(false);
  const [parsedImportRows, setParsedImportRows] = useState<Record<string, any>[]>([]);
  const [importFileName, setImportFileName] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);

  // Reusable Feedback Modal State (Save, Update, Error, Duplicate Alert, etc.)
  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    variant: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    title: '',
    message: '',
    variant: 'success',
  });

  const showFeedback = (
    title: string,
    message: string,
    variant: 'success' | 'error' | 'warning' | 'info' = 'success'
  ) => {
    setFeedbackModal({ open: true, title, message, variant });
  };

  const closeFeedback = () => {
    setFeedbackModal((prev) => ({ ...prev, open: false }));
  };

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
        limit: pageSize,
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
  }, [page, pageSize, searchQuery, selectedDept, selectedStatus]);

  useEffect(() => {
    loadMetadata();
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setModalError(null);
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
    setFormExperienceYears('');
    setFormSalary('');
    setFormHireDate(new Date().toISOString().split('T')[0]);
    setModalOpen(true);
  };

  const handleOpenEditModal = (emp: EmployeeRow) => {
    setIsEditing(true);
    setEditingId(emp._id);
    setModalError(null);
    setFormEmployeeId(emp.employeeId);
    setFormFirstName(emp.firstName);
    setFormLastName(emp.lastName);
    setFormEmail(emp.email);
    setFormPhone(emp.phone || '');
    const deptId = typeof emp.departmentId === 'object' && emp.departmentId !== null ? emp.departmentId._id : (emp.departmentId || '');
    const teamId = typeof emp.teamId === 'object' && emp.teamId !== null ? emp.teamId._id : (emp.teamId || '');
    setFormDeptId(deptId);
    setFormTeamId(teamId);
    setFormJobTitle(emp.jobTitle);
    setFormEmpType(emp.employmentType);
    setFormStatus(emp.status);
    setFormLocation(emp.location);
    setFormExperienceYears(emp.experienceYears !== undefined && emp.experienceYears !== null ? String(emp.experienceYears) : '');
    setFormSalary(emp.salary ? String(emp.salary) : '');
    setFormHireDate(emp.hireDate ? new Date(emp.hireDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    setModalOpen(true);
  };

  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);
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
      experienceYears: formExperienceYears !== '' && !isNaN(Number(formExperienceYears)) ? Number(formExperienceYears) : 0,
      salary: formSalary ? Number(formSalary) : 0,
      hireDate: formHireDate ? new Date(formHireDate) : new Date(),
    };

    try {
      if (isEditing && editingId) {
        await apiClient.put(API_ENDPOINTS.EMPLOYEES.UPDATE(editingId), payload);
        const successText = `Profile details for "${formFirstName} ${formLastName}" (${formEmployeeId}) have been updated.`;
        setSuccessMsg(successText);
        showFeedback('Profile Updated Successfully', successText, 'success');
      } else {
        await apiClient.post(API_ENDPOINTS.EMPLOYEES.CREATE, payload);
        const successText = `Employee "${formFirstName} ${formLastName}" (${formEmployeeId}) has been registered successfully.`;
        setSuccessMsg(successText);
        showFeedback('Employee Saved Successfully', successText, 'success');
      }
      setModalOpen(false);
      loadEmployees();
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { error?: { message?: string }; message?: string } };
        message?: string;
      };
      const apiErrMsg =
        errorObj.response?.data?.error?.message ||
        errorObj.response?.data?.message ||
        errorObj.message ||
        'Failed to save employee profile. Please review the details.';
      setModalError(apiErrMsg);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    try {
      await apiClient.delete(API_ENDPOINTS.EMPLOYEES.DELETE(employeeToDelete._id));
      const msg = `Employee "${employeeToDelete.firstName} ${employeeToDelete.lastName}" (${employeeToDelete.employeeId}) has been soft-deleted and archived.`;
      setSuccessMsg(msg);
      showFeedback('Employee Deleted Successfully', msg, 'success');
      setDeleteDialogOpen(false);
      loadEmployees();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: { message?: string } } } };
      const errText = errorObj.response?.data?.error?.message || 'Failed to delete employee record.';
      setErrorMsg(errText);
    }
  };

  const handleRestoreEmployee = async (emp: EmployeeRow) => {
    try {
      await apiClient.patch(API_ENDPOINTS.EMPLOYEES.RESTORE(emp._id));
      const msg = `Employee "${emp.firstName} ${emp.lastName}" (${emp.employeeId}) restored to active directory.`;
      setSuccessMsg(msg);
      showFeedback('Employee Restored Successfully', msg, 'success');
      loadEmployees();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: { message?: string } } } };
      const errText = errorObj.response?.data?.error?.message || 'Failed to restore employee record.';
      setErrorMsg(errText);
    }
  };

  const handleToggleStatus = async (emp: EmployeeRow) => {
    const nextStatus = emp.status === 'active' ? 'on-leave' : 'active';
    try {
      await apiClient.patch(API_ENDPOINTS.EMPLOYEES.UPDATE_STATUS(emp._id), { status: nextStatus });
      const msg = `Employment status for "${emp.firstName} ${emp.lastName}" updated to "${nextStatus}".`;
      setSuccessMsg(msg);
      showFeedback('Status Updated', msg, 'success');
      loadEmployees();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: { message?: string } } } };
      const errText = errorObj.response?.data?.error?.message || 'Failed to update employment status.';
      setErrorMsg(errText);
    }
  };

  // Export CSV Handler
  const handleExportCSV = async () => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.EMPLOYEES.EXPORT);
      const data: EmployeeRow[] = res.data.data;
      if (!data || data.length === 0) {
        setErrorMsg('No employee records available to export.');
        return;
      }

      const headers = [
        'Employee ID',
        'First Name',
        'Last Name',
        'Email',
        'Phone',
        'Department',
        'Department Code',
        'Team',
        'Job Title',
        'Employment Type',
        'Status',
        'Location',
        'Experience (Years)',
        'Salary ($)',
        'Hire Date',
      ];

      const csvRows = [headers.join(',')];

      data.forEach((emp) => {
        const deptName = typeof emp.departmentId === 'object' && emp.departmentId !== null ? emp.departmentId.name : '';
        const deptCode = typeof emp.departmentId === 'object' && emp.departmentId !== null ? emp.departmentId.code : '';
        const teamName = typeof emp.teamId === 'object' && emp.teamId !== null ? emp.teamId.name : '';
        
        let hireDateStr = '';
        if (emp.hireDate) {
          try {
            const d = new Date(emp.hireDate);
            if (!isNaN(d.getTime())) {
              hireDateStr = d.toISOString().split('T')[0];
            }
          } catch {
            hireDateStr = '';
          }
        }

        const row = [
          `"${emp.employeeId || ''}"`,
          `"${(emp.firstName || '').replace(/"/g, '""')}"`,
          `"${(emp.lastName || '').replace(/"/g, '""')}"`,
          `"${emp.email || ''}"`,
          `"${emp.phone || ''}"`,
          `"${deptName.replace(/"/g, '""')}"`,
          `"${deptCode}"`,
          `"${teamName.replace(/"/g, '""')}"`,
          `"${(emp.jobTitle || '').replace(/"/g, '""')}"`,
          `"${emp.employmentType || ''}"`,
          `"${emp.status || ''}"`,
          `"${emp.location || ''}"`,
          emp.experienceYears !== undefined ? emp.experienceYears : 0,
          emp.salary || 0,
          `"${hireDateStr}"`,
        ];
        csvRows.push(row.join(','));
      });

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `workforce_employees_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setSuccessMsg('Employee CSV export downloaded successfully.');
      showFeedback(
        'Export Completed',
        'Active employee records have been successfully exported and downloaded to your computer as a CSV spreadsheet.',
        'success'
      );
    } catch (err) {
      console.error('Export CSV error:', err);
      setErrorMsg('Failed to export employee dataset.');
    }
  };

  // Download Sample CSV Template
  const handleDownloadSampleCSV = () => {
    const headers = [
      'employeeId',
      'firstName',
      'lastName',
      'email',
      'phone',
      'department',
      'team',
      'jobTitle',
      'employmentType',
      'status',
      'location',
      'experienceYears',
      'salary',
      'hireDate',
    ];
    const sampleRows = [
      headers.join(','),
      'EMP-8101,John,Doe,john.doe@enterprise.com,+1-555-0100,Engineering,Frontend Core,Senior Frontend Engineer,Full-Time,active,Headquarters,5,135000,2023-01-15',
      'EMP-8102,Jane,Smith,jane.smith@enterprise.com,+1-555-0101,Sales,Major Accounts,Enterprise Account Exec,Full-Time,active,Remote,3,95000,2023-06-20',
    ];
    const blob = new Blob([sampleRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'employee_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // CSV File Upload & Parsing Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    setImportError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        if (!text) throw new Error('File is empty.');

        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          throw new Error('CSV must contain at least a header row and 1 data row.');
        }

        const rawHeaders = lines[0].split(',').map((h) => h.replace(/^["']|["']$/g, '').trim());
        const headerMap: Record<string, string> = {
          'employeeid': 'employeeId',
          'employee id': 'employeeId',
          'firstname': 'firstName',
          'first name': 'firstName',
          'lastname': 'lastName',
          'last name': 'lastName',
          'email': 'email',
          'email address': 'email',
          'phone': 'phone',
          'department': 'department',
          'department code': 'department',
          'departmentid': 'departmentId',
          'team': 'team',
          'teamid': 'teamId',
          'jobtitle': 'jobTitle',
          'job title': 'jobTitle',
          'employmenttype': 'employmentType',
          'employment type': 'employmentType',
          'status': 'status',
          'location': 'location',
          'experienceyears': 'experienceYears',
          'experience (years)': 'experienceYears',
          'experience': 'experienceYears',
          'salary': 'salary',
          'annual salary': 'salary',
          'salary ($)': 'salary',
          'hiredate': 'hireDate',
          'hire date': 'hireDate',
          'hire_date': 'hireDate',
          'joiningdate': 'hireDate',
          'joining date': 'hireDate',
          'hire date (yyyy-mm-dd)': 'hireDate',
        };

        const parsedRows: Record<string, any>[] = [];
        for (let i = 1; i < lines.length; i++) {
          const rowLine = lines[i];
          const values: string[] = [];
          let currentVal = '';
          let insideQuote = false;
          for (let c = 0; c < rowLine.length; c++) {
            const char = rowLine[c];
            if (char === '"') {
              insideQuote = !insideQuote;
            } else if (char === ',' && !insideQuote) {
              values.push(currentVal.trim().replace(/^["']|["']$/g, ''));
              currentVal = '';
            } else {
              currentVal += char;
            }
          }
          values.push(currentVal.trim().replace(/^["']|["']$/g, ''));

          const rowObj: Record<string, any> = {};
          rawHeaders.forEach((h, idx) => {
            const key = headerMap[h.toLowerCase().trim()] || h.trim();
            rowObj[key] = values[idx] || '';
          });

          if (rowObj.firstName || rowObj.email) {
            parsedRows.push(rowObj);
          }
        }

        if (parsedRows.length === 0) {
          throw new Error('No valid employee records found in CSV file.');
        }

        setParsedImportRows(parsedRows);
      } catch (err: any) {
        setImportError(err?.message || 'Failed to parse CSV file.');
      }
    };
    reader.readAsText(file);
  };

  // Submit Import to Backend
  const handleExecuteImport = async () => {
    if (parsedImportRows.length === 0) return;
    setImportLoading(true);
    setImportError(null);
    try {
      const res = await apiClient.post(API_ENDPOINTS.EMPLOYEES.IMPORT, {
        employees: parsedImportRows,
      });
      const result = res.data.data;
      const msg = `Bulk import complete: ${result.insertedCount} employee(s) added successfully (${result.skippedCount} skipped/duplicates).`;
      setSuccessMsg(msg);
      showFeedback('Bulk Import Complete', msg, 'success');
      setImportModalOpen(false);
      setParsedImportRows([]);
      setImportFileName('');
      loadEmployees();
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || 'Failed to import employee records.';
      setImportError(errMsg);
    } finally {
      setImportLoading(false);
    }
  };

  const columns: ColumnDef<EmployeeRow>[] = [
    {
      id: 'employeeId',
      header: 'ID',
      width: 150,
      accessor: (row) => (
        <Tooltip title={`Employee Identifier: ${row.employeeId}`} arrow placement="top">
          <Typography variant="body2" fontWeight={600} color="primary.main">
            {row.employeeId}
          </Typography>
        </Tooltip>
      ),
    },
    {
      id: 'name',
      header: 'Employee Name',
      maxWidth: 220,
      accessor: (row) => {
        const fullName = `${row.firstName} ${row.lastName}`;
        return (
          <Box sx={{ maxWidth: 220 }}>
            <Tooltip title={fullName} arrow placement="top" enterDelay={250}>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {fullName}
              </Typography>
            </Tooltip>
            <Tooltip title={row.email} arrow placement="top" enterDelay={250}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {row.email}
              </Typography>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      id: 'department',
      header: 'Department',
      maxWidth: 180,
      accessor: (row) => {
        const deptName = row.departmentId?.name || '—';
        const teamName = row.teamId?.name;
        return (
          <Box sx={{ maxWidth: 180 }}>
            <Tooltip title={`Department: ${deptName}${teamName ? ` | Team: ${teamName}` : ''}`} arrow placement="top" enterDelay={250}>
              <Typography
                variant="body2"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {deptName}
              </Typography>
            </Tooltip>
            {teamName && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {teamName}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      id: 'jobTitle',
      header: 'Job Title',
      maxWidth: 220,
      accessor: (row) => (
        <Box sx={{ maxWidth: 220 }}>
          <Tooltip title={`Role: ${row.jobTitle}`} arrow placement="top" enterDelay={250}>
            <Typography
              variant="body2"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {row.jobTitle}
            </Typography>
          </Tooltip>
          <Tooltip title={`Location: ${row.location} | Type: ${row.employmentType}${row.experienceYears !== undefined ? ` | Experience: ${row.experienceYears} Years` : ''}`} arrow placement="top" enterDelay={250}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {row.location} • {row.employmentType}{row.experienceYears !== undefined ? ` • ${row.experienceYears}y exp` : ''}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },
    {
      id: 'hireDate',
      header: 'Hire Date',
      width: 130,
      accessor: (row) => {
        const dateStr = row.hireDate
          ? new Date(row.hireDate).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : '—';
        return (
          <Tooltip title={`Joined: ${dateStr}`} arrow placement="top" enterDelay={250}>
            <Typography variant="body2" color="text.secondary">
              {dateStr}
            </Typography>
          </Tooltip>
        );
      },
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
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="outlined"
            startIcon={<Download size={16} />}
            onClick={handleExportCSV}
            sx={{ flex: { xs: 1, sm: 'none' }, whiteSpace: 'nowrap' }}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<Upload size={16} />}
            onClick={() => {
              setImportModalOpen(true);
              setParsedImportRows([]);
              setImportFileName('');
              setImportError(null);
            }}
            sx={{ flex: { xs: 1, sm: 'none' }, whiteSpace: 'nowrap' }}
          >
            Import CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={handleOpenAddModal}
            sx={{ bgcolor: '#0F6CBD', width: { xs: '100%', sm: 'auto' }, whiteSpace: 'nowrap' }}
          >
            Add Employee
          </Button>
        </Box>
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
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
          mb: 3,
          p: { xs: 2, sm: 2.5 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ flex: { md: 1 }, width: { xs: '100%', md: 'auto' } }}>
          <AppSearchField
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setPage(1);
            }}
            placeholder="Search by name, ID, email, title..."
            fullWidth
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
            width: { xs: '100%', md: 'auto' },
            flexWrap: { sm: 'wrap', md: 'nowrap' },
          }}
        >
          <FormControl size="small" sx={{ width: { xs: '100%', sm: 220, md: 200 } }}>
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

          <FormControl size="small" sx={{ width: { xs: '100%', sm: 180, md: 180 } }}>
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
              variant="outlined"
              color="inherit"
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('');
                setSelectedStatus('');
                setPage(1);
              }}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                height: 38,
                whiteSpace: 'nowrap',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 1.5,
              }}
            >
              Reset Filters
            </Button>
          )}
        </Box>
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
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
      />

      {/* Add / Edit Employee Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSaveEmployee}>
          <DialogTitle fontWeight={600}>
            {isEditing ? 'Edit Employee Record' : 'Register New Employee'}
          </DialogTitle>
          <DialogContent dividers>
            {modalError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setModalError(null)}>
                {modalError}
              </Alert>
            )}
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
                    onChange={(e) => {
                      setFormDeptId(e.target.value);
                      setFormTeamId('');
                    }}
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
                      .filter((t) => !formDeptId || getTeamDeptId(t) === formDeptId)
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
                  type="date"
                  size="small"
                  label="Hire / Joining Date"
                  value={formHireDate}
                  onChange={(e) => setFormHireDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  label="Experience (Years)"
                  value={formExperienceYears}
                  onChange={(e) => setFormExperienceYears(e.target.value)}
                  placeholder="Optional"
                  inputProps={{ min: 0, max: 50, step: 0.5 }}
                />
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

      {/* CSV Import Modal */}
      <Dialog
        open={importModalOpen}
        onClose={() => !importLoading && setImportModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Upload size={20} color="#0F6CBD" />
            Bulk Import Employees from CSV
          </Box>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FileText size={14} />}
            onClick={handleDownloadSampleCSV}
            sx={{ fontSize: '0.75rem' }}
          >
            Download Sample CSV Template
          </Button>
        </DialogTitle>
        <DialogContent dividers>
          {importError && (
            <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setImportError(null)}>
              {importError}
            </Alert>
          )}

          {/* Upload Area */}
          <Box
            sx={{
              p: 3,
              border: '2px dashed',
              borderColor: parsedImportRows.length > 0 ? 'success.main' : 'divider',
              borderRadius: 2,
              textAlign: 'center',
              bgcolor: 'background.default',
              mb: 2.5,
            }}
          >
            <input
              type="file"
              accept=".csv"
              id="csv-file-upload"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor="csv-file-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<Upload size={16} />}
                sx={{ mb: 1, bgcolor: '#0F6CBD' }}
              >
                Choose CSV File
              </Button>
            </label>
            <Typography variant="body2" color="text.secondary">
              {importFileName ? (
                <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Selected File: {importFileName} ({parsedImportRows.length} record(s) parsed)
                </Box>
              ) : (
                'Select a comma-separated (.csv) file containing employee records'
              )}
            </Typography>
          </Box>

          {/* Preview of Parsed Rows */}
          {parsedImportRows.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Preview: First {Math.min(5, parsedImportRows.length)} of {parsedImportRows.length} Employee(s)
                </Typography>
                <Chip
                  icon={<CheckCircle2 size={14} />}
                  label={`${parsedImportRows.length} Ready to Import`}
                  color="success"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              <Box sx={{ maxHeight: 220, overflowY: 'auto', border: 1, borderColor: 'divider', borderRadius: 1.5 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                    <tr>
                      <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>ID</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Name</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Email</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Department</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Job Title</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Exp (Yrs)</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Hire Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedImportRows.slice(0, 5).map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 12px' }}>{row.employeeId || 'Auto'}</td>
                        <td style={{ padding: '8px 12px', fontWeight: 600 }}>{row.firstName} {row.lastName}</td>
                        <td style={{ padding: '8px 12px' }}>{row.email}</td>
                        <td style={{ padding: '8px 12px' }}>{row.department || row.departmentId || 'Default'}</td>
                        <td style={{ padding: '8px 12px' }}>{row.jobTitle || 'Engineer'}</td>
                        <td style={{ padding: '8px 12px' }}>{row.experienceYears || '0'}</td>
                        <td style={{ padding: '8px 12px' }}>{row.hireDate ? String(row.hireDate).split('T')[0] : 'Today'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setImportModalOpen(false)} color="inherit" disabled={importLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleExecuteImport}
            disabled={parsedImportRows.length === 0 || importLoading}
            startIcon={<Upload size={16} />}
            sx={{ bgcolor: '#0F6CBD' }}
          >
            {importLoading ? 'Importing...' : `Import ${parsedImportRows.length} Employee(s)`}
          </Button>
        </DialogActions>
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

      {/* Reusable Action Feedback Modal (Save, Update, Delete, Duplicate Error, etc.) */}
      <ConfirmationDialog
        open={feedbackModal.open}
        title={feedbackModal.title}
        message={feedbackModal.message}
        variant={feedbackModal.variant}
        confirmLabel="OK"
        onConfirm={closeFeedback}
        onCancel={closeFeedback}
        onClose={closeFeedback}
      />
    </PageShell>
  );
};
