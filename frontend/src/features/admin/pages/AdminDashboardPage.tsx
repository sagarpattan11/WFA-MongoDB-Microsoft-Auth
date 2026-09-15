import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import {
  CheckCircle2,
  Fingerprint,
  Key,
  RefreshCw,
  Shield,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';
import { AppSearchField } from '../../../components/common/AppSearchField';
import { AppSelect } from '../../../components/common/AppSelect';
import { ColumnDef, DataTableShell } from '../../../components/common/DataTableShell';
import { KPICardShell } from '../../../components/common/KPICardShell';
import { PageShell } from '../../../components/layout/PageShell';

interface UserAccount extends Record<string, unknown> {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  roles: string[];
  primaryRole: string;
  passkeysCount: number;
  createdAt: string;
}

const ROLE_META: Record<string, { label: string; color: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'default'; description: string }> = {
  admin: { label: 'System Admin', color: 'secondary', description: 'Full root access, RBAC management, and platform configuration' },
  hr_manager: { label: 'HR Manager', color: 'primary', description: 'Full access to workforce directory, skills, learning, and attrition analytics' },
  hr: { label: 'HR Specialist', color: 'primary', description: 'Operational workforce records and recruiting management' },
  executive: { label: 'Executive / VP', color: 'success', description: 'Strategic Executive Cockpit, health scorecards, and high-level KPIs' },
  dept_manager: { label: 'Department Manager', color: 'warning', description: 'Department performance benchmarking, team shifts, and attendance reviews' },
  manager: { label: 'Manager', color: 'warning', description: 'Team operations and appraisal workflows' },
  team_lead: { label: 'Team Lead', color: 'info', description: 'Shift scheduling, attendance check-ins, and team skill tracking' },
  'team-lead': { label: 'Team Lead', color: 'info', description: 'Shift scheduling, attendance check-ins, and team skill tracking' },
  employee: { label: 'Standard Employee', color: 'default', description: 'Self-service portal: profile, training, leave, and clocking' },
};

export const AdminDashboardPage: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Edit Role Modal State
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [newRole, setNewRole] = useState<string>('employee');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(API_ENDPOINTS.AUTH.USERS);
      setUsers(res.data.data || []);
    } catch (err: any) {
      console.error('Failed to load user directory:', err);
      setError(err?.response?.data?.error?.message || err?.message || 'Failed to load user roster');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenRoleModal = (user: UserAccount) => {
    setSelectedUser(user);
    setNewRole(user.primaryRole || 'employee');
  };

  const handleCloseRoleModal = () => {
    setSelectedUser(null);
    setIsUpdating(false);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;
    setIsUpdating(true);
    try {
      await apiClient.patch(API_ENDPOINTS.AUTH.UPDATE_ROLE(selectedUser._id), {
        role: newRole,
      });
      setSuccessMsg(`Successfully updated role for ${selectedUser.displayName} to "${ROLE_META[newRole]?.label || newRole}"`);
      handleCloseRoleModal();
      await fetchUsers();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Failed to update user role:', err);
      setError(err?.response?.data?.error?.message || err?.message || 'Failed to update user role');
    } finally {
      setIsUpdating(false);
    }
  };

  // Filtered Users Roster
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchQuery.trim() ||
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.primaryRole === roleFilter || u.roles?.includes(roleFilter);

    return matchesSearch && matchesRole;
  });

  // Calculate Aggregates
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.roles?.includes('admin')).length;
  const hrExecCount = users.filter((u) => u.roles?.some((r) => ['hr_manager', 'hr', 'executive'].includes(r))).length;
  const totalPasskeys = users.reduce((acc, u) => acc + (u.passkeysCount || 0), 0);

  const columns: ColumnDef<UserAccount>[] = [
    {
      id: 'user',
      header: 'Account & Display Name',
      accessor: (row: UserAccount) => {
        const initials = row.displayName
          ? row.displayName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
          : row.username.slice(0, 2).toUpperCase();

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.85rem', fontWeight: 700 }}>
              {initials}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {row.displayName || row.username}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                @{row.username}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      id: 'email',
      header: 'Corporate Email',
      accessor: (row: UserAccount) => (
        <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '0.85rem' }}>
          {row.email}
        </Typography>
      ),
    },
    {
      id: 'role',
      header: 'Assigned RBAC Role',
      accessor: (row: UserAccount) => {
        const meta = ROLE_META[row.primaryRole] || { label: row.primaryRole, color: 'default' };
        return (
          <Chip
            label={meta.label}
            color={meta.color}
            size="small"
            icon={<Shield size={14} />}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          />
        );
      },
    },
    {
      id: 'passkeys',
      header: 'Passkeys Registered',
      accessor: (row: UserAccount) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Fingerprint size={16} color={row.passkeysCount > 0 ? '#10B981' : '#94A3B8'} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: row.passkeysCount > 0 ? 'text.primary' : 'text.disabled' }}>
            {row.passkeysCount} {row.passkeysCount === 1 ? 'Passkey' : 'Passkeys'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'createdAt',
      header: 'Registered Date',
      accessor: (row: UserAccount) => (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'}
        </Typography>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      accessor: (row: UserAccount) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<UserCheck size={14} />}
          onClick={() => handleOpenRoleModal(row)}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '0.8rem',
            py: 0.5,
          }}
        >
          Assign Role
        </Button>
      ),
    },
  ];

  return (
    <PageShell
      title="Admin Governance Console"
      description="System-wide security policies, role-based access control (RBAC) management, and user privilege administration."
      actions={
        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={16} /> : <RefreshCw size={16} />}
          onClick={fetchUsers}
          disabled={loading}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Refresh Users
        </Button>
      }
    >
      {/* Notifications */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      )}

      {/* KPI Cards Grid */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Registered Accounts"
            value={loading ? '...' : totalUsers.toString()}
            subtitle="Platform User Identities"
            icon={<Users size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="System Administrators"
            value={loading ? '...' : adminCount.toString()}
            subtitle="Root Security Operators"
            icon={<ShieldCheck size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="HR & Executives"
            value={loading ? '...' : hrExecCount.toString()}
            subtitle="Strategic & Talent Leaders"
            icon={<Key size={20} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Active Passkeys"
            value={loading ? '...' : totalPasskeys.toString()}
            subtitle="FIDO2 Hardware Credentials"
            icon={<Fingerprint size={20} />}
          />
        </Grid>
      </Grid>

      {/* User Account & Role Management Table */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          {/* Header Row */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              User Account & Role Assignment Directory
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Assign, elevate, or revoke role-based permissions across all enterprise accounts
            </Typography>
          </Box>

          {/* Filter Toolbar */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 1.5,
              mb: 2.5,
              alignItems: 'stretch',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <AppSearchField
                value={searchQuery}
                onChange={(val: string) => setSearchQuery(val)}
                placeholder="Search user accounts by name, username, or email..."
              />
            </Box>

            <Box sx={{ minWidth: 220 }}>
              <AppSelect
                label="Filter by Role"
                value={roleFilter}
                onChange={(val: string) => setRoleFilter(val)}
                options={[
                  { value: 'ALL', label: 'All Platform Roles' },
                  { value: 'admin', label: 'System Admin' },
                  { value: 'hr_manager', label: 'HR Manager' },
                  { value: 'executive', label: 'Executive / VP' },
                  { value: 'dept_manager', label: 'Department Manager' },
                  { value: 'team_lead', label: 'Team Lead' },
                  { value: 'employee', label: 'Standard Employee' },
                ]}
              />
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ p: 2 }}>
              <Skeleton height={50} sx={{ mb: 1 }} />
              <Skeleton height={50} sx={{ mb: 1 }} />
              <Skeleton height={50} sx={{ mb: 1 }} />
            </Box>
          ) : (
            <DataTableShell
              columns={columns}
              data={filteredUsers}
              emptyTitle="No User Accounts Found"
              emptyDescription="No registered users match your search query or role filter."
            />
          )}
        </CardContent>
      </Card>

      {/* Role Assignment Dialog */}
      <Dialog open={Boolean(selectedUser)} onClose={handleCloseRoleModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Shield size={20} color="#0F6CBD" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Assign Workspace Role
            </Typography>
          </Box>
          <IconButton onClick={handleCloseRoleModal} size="small">
            <X size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          {selectedUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {selectedUser.displayName} (@{selectedUser.username})
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                  {selectedUser.email}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>Current Role:</Typography>
                  <Chip
                    label={ROLE_META[selectedUser.primaryRole]?.label || selectedUser.primaryRole}
                    size="small"
                    color={ROLE_META[selectedUser.primaryRole]?.color || 'default'}
                  />
                </Box>
              </Box>

              <FormControl fullWidth>
                <InputLabel id="role-change-label">New Workspace Role</InputLabel>
                <Select
                  labelId="role-change-label"
                  value={newRole}
                  label="New Workspace Role"
                  onChange={(e) => setNewRole(e.target.value)}
                  disabled={isUpdating}
                >
                  <MenuItem value="admin">System Admin (Full Access & User Management)</MenuItem>
                  <MenuItem value="hr_manager">HR Manager (Full Workforce & Skill Analytics)</MenuItem>
                  <MenuItem value="executive">Executive / VP (Strategic Analytics & Cockpit)</MenuItem>
                  <MenuItem value="dept_manager">Department Manager (Team Operations)</MenuItem>
                  <MenuItem value="team_lead">Team Lead (Shift & Attendance Visibility)</MenuItem>
                  <MenuItem value="employee">Standard Employee (Self-Service View)</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 500 }}>
                  Role Description:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mt: 0.25 }}>
                  {ROLE_META[newRole]?.description}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={handleCloseRoleModal} disabled={isUpdating} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveRole}
            disabled={isUpdating}
            startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : <CheckCircle2 size={16} />}
            sx={{ textTransform: 'none', fontWeight: 600, px: 2.5, borderRadius: 2 }}
          >
            {isUpdating ? 'Updating Role...' : 'Save Role Assignment'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageShell>
  );
};

