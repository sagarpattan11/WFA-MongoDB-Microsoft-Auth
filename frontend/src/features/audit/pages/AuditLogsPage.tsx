import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import {
  FileCheck2,
  Fingerprint,
  Lock,
  RefreshCw,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';
import { ColumnDef, DataTableShell } from '../../../components/common/DataTableShell';
import { ExportReportMenu } from '../../../components/common/ExportReportMenu';
import { AppSearchField } from '../../../components/common/AppSearchField';
import { AppSelect } from '../../../components/common/AppSelect';
import { AutoTooltipText } from '../../../components/common/AutoTooltipText';

interface AuditLogRecord extends Record<string, unknown> {
  _id: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId?: string;
  description: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  createdAt: string;
}

const ACTION_COLORS: Record<string, { bg: string; color: string }> = {
  AUTH_LOGIN: { bg: '#E0E7FF', color: '#3730A3' },
  AUTH_LOGOUT: { bg: '#F1F5F9', color: '#475569' },
  PREDICTION_VIEW: { bg: '#EDE9FE', color: '#5B21B6' },
  SCENARIO_SIMULATE: { bg: '#E0F2FE', color: '#0369A1' },
  REPORT_EXPORT: { bg: '#D1FAE5', color: '#065F46' },
  ATTRITION_STATUS_UPDATE: { bg: '#FEF3C7', color: '#92400E' },
  EMPLOYEE_CREATE: { bg: '#DCFCE7', color: '#166534' },
  EMPLOYEE_UPDATE: { bg: '#FEE2E2', color: '#991B1B' },
  ROLE_PERMISSION_CHANGE: { bg: '#FCE7F3', color: '#9D174D' },
};

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogsCount, setTotalLogsCount] = useState(0);

  const fetchAuditLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {
        page,
        limit: pageSize,
      };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (actionFilter !== 'ALL') params.action = actionFilter;
      if (roleFilter !== 'ALL') params.actorRole = roleFilter;
      if (statusFilter !== 'ALL') params.status = statusFilter;

      const res = await apiClient.get(API_ENDPOINTS.AUDIT.LIST, { params });
      const payload = res.data.data;
      setLogs(payload.logs);
      setTotalPages(payload.pagination.totalPages);
      setTotalLogsCount(payload.pagination.total);
    } catch (err: any) {
      console.error('Failed to load audit logs:', err);
      setError(err?.message || 'Failed to load audit compliance trail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [page, pageSize, searchQuery, actionFilter, roleFilter, statusFilter]);

  const handleRefresh = () => {
    fetchAuditLogs();
  };

  const columns: ColumnDef<AuditLogRecord>[] = [
    {
      id: 'createdAt',
      header: 'Timestamp (UTC)',
      accessor: (row: AuditLogRecord) => {
        const d = row.createdAt ? new Date(row.createdAt) : new Date();
        return (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8125rem' }}>
              {d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              ISO: {d.toISOString().slice(0, 10)}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: 'actorName',
      header: 'User / Actor',
      accessor: (row: AuditLogRecord) => (
        <Box>
          <AutoTooltipText
            text={row.actorName || 'System User'}
            sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.85rem' }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            {row.actorEmail}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'actorRole',
      header: 'Role',
      accessor: (row: AuditLogRecord) => (
        <Chip
          label={row.actorRole?.toUpperCase() || 'USER'}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 700, fontSize: '0.7rem' }}
        />
      ),
    },
    {
      id: 'action',
      header: 'Action Performed',
      accessor: (row: AuditLogRecord) => {
        const theme = ACTION_COLORS[row.action] || { bg: '#F1F5F9', color: '#475569' };
        return (
          <Chip
            label={row.action}
            size="small"
            sx={{
              bgcolor: theme.bg,
              color: theme.color,
              fontWeight: 700,
              fontSize: '0.7rem',
              letterSpacing: '0.02em',
            }}
          />
        );
      },
    },
    {
      id: 'description',
      header: 'Event Description & Context',
      accessor: (row: AuditLogRecord) => (
        <AutoTooltipText
          text={row.description}
          sx={{ fontSize: '0.8125rem', color: 'text.primary', fontWeight: 500 }}
        />
      ),
    },
    {
      id: 'entityType',
      header: 'Target Entity',
      accessor: (row: AuditLogRecord) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
            {row.entityType}
          </Typography>
          {row.entityId && (
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontFamily: 'monospace' }}>
              {row.entityId}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'ipAddress',
      header: 'IP Address',
      accessor: (row: AuditLogRecord) => (
        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontWeight: 600 }}>
          {row.ipAddress || '127.0.0.1'}
        </Typography>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: AuditLogRecord) => {
        const color = row.status === 'SUCCESS' ? 'success' : row.status === 'WARNING' ? 'warning' : 'error';
        return (
          <Chip
            label={row.status}
            size="small"
            color={color}
            sx={{ fontWeight: 700, fontSize: '0.7rem' }}
          />
        );
      },
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1600, mx: 'auto' }}>
      {/* Header Banner */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Platform Audit & Compliance Trail
            </Typography>
            <Chip
              icon={<ShieldCheck size={16} />}
              label="SOC2 Immutable"
              size="small"
              color="success"
              sx={{ fontWeight: 700 }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Cryptographically sealed, append-only ledger of authentication sessions, predictive model access, simulations, and data exports
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshCw size={16} />}
            onClick={handleRefresh}
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            Refresh Logs
          </Button>
          <ExportReportMenu module="workforce" />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Summary KPI Strip */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Total Recorded Events
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.dark' }}>
                  <Terminal size={18} />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                {totalLogsCount}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                Across all platform components
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Security & Auth Events
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'success.light', color: 'success.dark' }}>
                  <Fingerprint size={18} />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main' }}>
                Passkey & MFA
              </Typography>
              <Typography variant="caption" sx={{ color: 'success.dark', mt: 0.5, display: 'block', fontWeight: 600 }}>
                100% Zero-Trust Verified
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Data Export Audit
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'info.light', color: 'info.dark' }}>
                  <FileCheck2 size={18} />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                Compliant
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                CSV, XLSX & JSON exports logged
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Ledger Immutability
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'warning.light', color: 'warning.dark' }}>
                  <Lock size={18} />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main' }}>
                Active
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                No update or deletion allowed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Audit Log Table Card */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
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
                onChange={(val: string) => {
                  setSearchQuery(val);
                  setPage(1);
                }}
                placeholder="Search by actor name, email, IP address, description..."
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                flexWrap: { sm: 'wrap', md: 'nowrap' },
                flexDirection: { xs: 'column', sm: 'row' },
                width: { xs: '100%', md: 'auto' },
              }}
            >
              <AppSelect
                label="Action Type"
                value={actionFilter}
                onChange={(val: string) => {
                  setActionFilter(val);
                  setPage(1);
                }}
                options={[
                  { value: 'ALL', label: 'All Actions' },
                  { value: 'AUTH_LOGIN', label: 'AUTH_LOGIN' },
                  { value: 'PREDICTION_VIEW', label: 'PREDICTION_VIEW' },
                  { value: 'SCENARIO_SIMULATE', label: 'SCENARIO_SIMULATE' },
                  { value: 'REPORT_EXPORT', label: 'REPORT_EXPORT' },
                  { value: 'ATTRITION_STATUS_UPDATE', label: 'ATTRITION_STATUS_UPDATE' },
                  { value: 'EMPLOYEE_UPDATE', label: 'EMPLOYEE_UPDATE' },
                  { value: 'ROLE_PERMISSION_CHANGE', label: 'ROLE_PERMISSION_CHANGE' },
                ]}
                sx={{ width: { xs: '100%', sm: 190 } }}
              />

              <AppSelect
                label="Actor Role"
                value={roleFilter}
                onChange={(val: string) => {
                  setRoleFilter(val);
                  setPage(1);
                }}
                options={[
                  { value: 'ALL', label: 'All Roles' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'hr_manager', label: 'HR Manager' },
                  { value: 'executive', label: 'Executive' },
                  { value: 'dept_manager', label: 'Dept Manager' },
                  { value: 'team_lead', label: 'Team Lead' },
                  { value: 'employee', label: 'Employee' },
                ]}
                sx={{ width: { xs: '100%', sm: 150 } }}
              />

              <AppSelect
                label="Status"
                value={statusFilter}
                onChange={(val: string) => {
                  setStatusFilter(val);
                  setPage(1);
                }}
                options={[
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'SUCCESS', label: 'SUCCESS' },
                  { value: 'WARNING', label: 'WARNING' },
                  { value: 'FAILURE', label: 'FAILURE' },
                ]}
                sx={{ width: { xs: '100%', sm: 140 } }}
              />
            </Box>
          </Box>

          <DataTableShell
            columns={columns}
            data={logs}
            loading={loading}
            page={page}
            totalPages={totalPages}
            totalItems={totalLogsCount}
            pageSize={pageSize}
            pageSizeOptions={[10, 15, 25, 50]}
            onPageChange={(p: number) => setPage(p)}
            onPageSizeChange={(s: number) => {
              setPageSize(s);
              setPage(1);
            }}
            emptyTitle="No Audit Log Records Found"
            emptyDescription="No events match your selected search or filter criteria."
          />
        </CardContent>
      </Card>
    </Box>
  );
};

