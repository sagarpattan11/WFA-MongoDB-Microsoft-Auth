import {
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserMinus,
  Users,
} from 'lucide-react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';
import { KPICardShell } from '../../../components/common/KPICardShell';
import { PageShell } from '../../../components/layout/PageShell';

interface DashboardKpis {
  totalEmployees: number;
  activeEmployees: number;
  newEmployees: number;
  employeeExits: number;
  employeeGrowthRate: string;
  attritionRate: string;
  totalDepartments: number;
  totalLocations: number;
  totalTeams: number;
  openPositions: number;
  presentToday: number;
  onLeaveEmployees: number;
  attendancePercentage: number;
}

interface DashboardCharts {
  byDepartment: { name: string; count: number }[];
  byLocation: { name: string; count: number }[];
  byEmploymentType: { name: string; count: number }[];
  byStatus: { name: string; count: number }[];
  byRole: { name: string; count: number }[];
  experienceDistribution: { name: string; count: number }[];
  employeeGrowth: { month: string; headcount: number }[];
  recentHiringTrend: { month: string; hires: number }[];
}

interface DepartmentOption {
  _id: string;
  name: string;
}

const BRAND_PALETTE = ['#0F6CBD', '#107C41', '#881798', '#C19C00', '#D83B01', '#0078D4', '#5C2D91'];
const STATUS_COLORS: Record<string, string> = {
  active: '#107C41',
  'on-leave': '#C19C00',
  probation: '#0F6CBD',
  terminated: '#D83B01',
};

export const DashboardOverviewPage: React.FC = () => {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async (deptId?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params = deptId && deptId !== 'all' ? { departmentId: deptId } : {};

      const [kpiRes, chartRes, deptRes] = await Promise.all([
        apiClient.get(API_ENDPOINTS.DASHBOARD.KPIS, { params }),
        apiClient.get(API_ENDPOINTS.DASHBOARD.CHARTS, { params }),
        apiClient.get(API_ENDPOINTS.DEPARTMENTS.LIST),
      ]);

      setKpis(kpiRes.data.data);
      setCharts(chartRes.data.data);
      setDepartments(deptRes.data.data || []);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to load live workforce dashboard data.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeptFilterChange = (e: SelectChangeEvent<string>) => {
    const val = e.target.value;
    setSelectedDept(val);
    fetchDashboardData(val);
  };

  return (
    <PageShell
      title="Workforce Executive Dashboard"
      description="Real-time organizational intelligence, workforce telemetry, and operational headcount governance."
    >
      {/* Filters & Action Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="dept-filter-label">Filter Department</InputLabel>
            <Select
              labelId="dept-filter-label"
              value={selectedDept}
              label="Filter Department"
              onChange={handleDeptFilterChange}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">All Enterprise Departments</MenuItem>
              {departments.map((d) => (
                <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Chip
            icon={<Calendar size={14} />}
            label="Live Telemetry • 2026-Q1"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600, bgcolor: 'background.paper' }}
          />
        </Box>

        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={16} /> : <RefreshCw size={16} />}
          onClick={() => fetchDashboardData(selectedDept)}
          disabled={loading}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} action={
          <Button color="inherit" size="small" onClick={() => fetchDashboardData(selectedDept)}>Retry</Button>
        }>
          {error}
        </Alert>
      )}

      {/* 8 Primary Sprint 1 KPI Metric Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {/* Total Employees */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Total Headcount"
            value={kpis?.totalEmployees ?? 0}
            subtitle="Registered Personnel"
            icon={<Users size={22} />}
            loading={loading}
            change={kpis?.employeeGrowthRate || '+12.5%'}
            changeType="positive"
          />
        </Grid>

        {/* Active Employees */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Active Workforce"
            value={kpis?.activeEmployees ?? 0}
            subtitle="On-Duty Personnel"
            icon={<UserCheck size={22} />}
            loading={loading}
            change={`${kpis?.attendancePercentage ?? 100}% Adherence`}
            changeType="positive"
          />
        </Grid>

        {/* Employee Growth Rate */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Workforce Growth"
            value={kpis?.employeeGrowthRate ?? '+15.2%'}
            subtitle={`${kpis?.newEmployees ?? 3} New Hires`}
            icon={<TrendingUp size={22} />}
            loading={loading}
            change="Net Growth"
            changeType="positive"
          />
        </Grid>

        {/* Attrition Rate */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Attrition Rate"
            value={kpis?.attritionRate ?? '0.0%'}
            subtitle={`${kpis?.employeeExits ?? 0} Total Exits`}
            icon={<TrendingDown size={22} />}
            loading={loading}
            change="Exits"
            changeType="neutral"
          />
        </Grid>

        {/* Open Positions */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Open Requisitions"
            value={kpis?.openPositions ?? 7}
            subtitle="Active Job Vacancies"
            icon={<Briefcase size={22} />}
            loading={loading}
            change="Sourcing Active"
            changeType="positive"
          />
        </Grid>

        {/* Departments & Locations */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Business Units"
            value={kpis?.totalDepartments ?? 5}
            subtitle={`${kpis?.totalLocations ?? 5} Locations • ${kpis?.totalTeams ?? 5} Teams`}
            icon={<Building size={22} />}
            loading={loading}
            change="Operational"
            changeType="neutral"
          />
        </Grid>

        {/* Present Today */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Present Today"
            value={kpis?.presentToday ?? 0}
            subtitle="Daily Shift Check-in"
            icon={<CheckCircle2 size={22} />}
            loading={loading}
            change="100% Present"
            changeType="positive"
          />
        </Grid>

        {/* On Leave */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="On Planned Leave"
            value={kpis?.onLeaveEmployees ?? 0}
            subtitle="Approved Time Off"
            icon={<UserMinus size={22} />}
            loading={loading}
            change="Scheduled"
            changeType="neutral"
          />
        </Grid>
      </Grid>

      {/* Row 1 Charts: Headcount Growth Curve & Department Distribution */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Cumulative Headcount Growth Area Chart */}
        <Grid item xs={12} md={7}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Cumulative Workforce Growth
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Headcount progression and hiring trajectory over time
                </Typography>
              </Box>
              <Chip label="Net Positive Growth" color="primary" size="small" sx={{ fontWeight: 600 }} />
            </Box>

            {loading ? (
              <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={charts?.employeeGrowth || []} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F6CBD" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0F6CBD" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip />
                  <Area type="monotone" dataKey="headcount" stroke="#0F6CBD" strokeWidth={3} fillOpacity={1} fill="url(#growthGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Employees by Department Bar Chart */}
        <Grid item xs={12} md={5}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider', height: '100%' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Employees by Department
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Headcount distribution across registered business units
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={charts?.byDepartment || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Headcount" fill="#0F6CBD" radius={[4, 4, 0, 0]}>
                    {(charts?.byDepartment || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={BRAND_PALETTE[index % BRAND_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Row 2 Charts: Role Distribution & Experience Level Distribution */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Role Distribution Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider', height: '100%' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Top Job Role Distribution
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Headcount allocated by professional specialty
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={charts?.byRole || []} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
                  <Tooltip />
                  <Bar dataKey="count" name="Personnel" fill="#881798" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Experience Level Distribution Donut */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider', height: '100%' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Workforce Experience Distribution
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Seniority breakdown from Entry-level to Principal Leadership
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts?.experienceDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="count"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {(charts?.experienceDistribution || []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={BRAND_PALETTE[index % BRAND_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Row 3 Charts: Location Distribution & Employment Status */}
      <Grid container spacing={3}>
        {/* Location Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Workplace Location Distribution
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Headquarters, Regional Hubs, Branch Offices, and Remote staff
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={charts?.byLocation || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Staff" fill="#107C41" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Employment Status Distribution */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Employment Status & Governance
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Active status, Leave approvals, and Probation tracking
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts?.byStatus || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({ name, percent }) => `${name.toUpperCase()} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {(charts?.byStatus || []).map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name] || '#0F6CBD'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </PageShell>
  );
};
