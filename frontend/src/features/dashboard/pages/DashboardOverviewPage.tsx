import {
  Activity,
  Award,
  BarChart3,
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  PieChart as PieChartIcon,
  TrendingUp,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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
  totalDepartments: number;
  totalTeams: number;
  presentToday: number;
  onLeaveEmployees: number;
  newHires: number;
  attendancePercentage: number;
}

interface DashboardCharts {
  employeesByDepartment: { name: string; count: number }[];
  employeesByLocation: { location: string; count: number }[];
  employmentTypeDistribution: { type: string; count: number }[];
  employeeStatusDistribution: { status: string; count: number }[];
  recentHiringTrend: { month: string; hires: number }[];
  employeeGrowth: { month: string; headcount: number }[];
}

const COLORS = ['#0F6CBD', '#107C41', '#FF8C00', '#D83B01', '#881798', '#0078D4', '#5C2D91'];
const STATUS_COLORS: Record<string, string> = {
  active: '#107C41',
  'on-leave': '#FF8C00',
  probation: '#0078D4',
  terminated: '#D83B01',
};

export const DashboardOverviewPage: React.FC = () => {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [kpiRes, chartRes] = await Promise.all([
        apiClient.get(API_ENDPOINTS.DASHBOARD.KPIS),
        apiClient.get(API_ENDPOINTS.DASHBOARD.CHARTS),
      ]);
      setKpis(kpiRes.data.data);
      setCharts(chartRes.data.data);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: { message?: string } } } };
      setErrorMsg(errorObj.response?.data?.error?.message || 'Failed to aggregate dashboard telemetries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <PageShell title="Workforce Operations Intelligence" description="Aggregating live organizational telemetry">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={36} sx={{ color: '#0F6CBD', mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Aggregating MongoDB workforce telemetries...
          </Typography>
        </Box>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Workforce Intelligence & Telemetry Dashboard"
      description="Live organizational metrics aggregated in real-time from MongoDB."
    >
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      )}

      {/* 8 Live KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {/* 1. Total Employees */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Total Employees"
            value={kpis?.totalEmployees ?? 0}
            icon={<Users size={22} color="#0F6CBD" />}
            change="+8%"
            changeType="positive"
            subtitle="Registered in MongoDB"
          />
        </Grid>

        {/* 2. Active Employees */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Active Employees"
            value={kpis?.activeEmployees ?? 0}
            icon={<UserCheck size={22} color="#107C41" />}
            subtitle="Engaged workforce"
          />
        </Grid>

        {/* 3. Total Departments */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Total Departments"
            value={kpis?.totalDepartments ?? 0}
            icon={<Building size={22} color="#881798" />}
            subtitle="Business units"
          />
        </Grid>

        {/* 4. Total Teams */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Total Teams"
            value={kpis?.totalTeams ?? 0}
            icon={<Briefcase size={22} color="#0078D4" />}
            subtitle="Operational pods"
          />
        </Grid>

        {/* 5. Employees Present Today */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Employees Present Today"
            value={kpis?.presentToday ?? 0}
            icon={<CheckCircle2 size={22} color="#107C41" />}
            subtitle="On duty headcount"
          />
        </Grid>

        {/* 6. Employees on Leave */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Employees on Leave"
            value={kpis?.onLeaveEmployees ?? 0}
            icon={<UserMinus size={22} color="#FF8C00" />}
            subtitle="Planned / medical leaves"
          />
        </Grid>

        {/* 7. New Hires */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="New Hires"
            value={kpis?.newHires ?? 0}
            icon={<UserPlus size={22} color="#0F6CBD" />}
            subtitle="Joined last 90 days"
          />
        </Grid>

        {/* 8. Attendance Percentage */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICardShell
            title="Attendance Percentage"
            value={`${kpis?.attendancePercentage ?? 100}%`}
            icon={<Award size={22} color="#107C41" />}
            change="+1.2%"
            changeType="positive"
            subtitle="Shift adherence rate"
          />
        </Grid>
      </Grid>

      {/* 6 Live Recharts Analytics Visualizations */}
      <Grid container spacing={3}>
        {/* 1. Employees by Department */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Building size={20} color="#0F6CBD" />
                <Typography variant="h6" fontWeight={600}>
                  Employees by Department
                </Typography>
              </Box>
              <Box sx={{ height: 280, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts?.employeesByDepartment || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0F6CBD" radius={[4, 4, 0, 0]}>
                      {(charts?.employeesByDepartment || []).map((_, index) => (
                        <Cell key={`cell-dept-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 2. Employees by Location */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <BarChart3 size={20} color="#107C41" />
                <Typography variant="h6" fontWeight={600}>
                  Employees by Work Location
                </Typography>
              </Box>
              <Box sx={{ height: 280, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts?.employeesByLocation || []} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                    <YAxis dataKey="location" type="category" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#107C41" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 3. Employment Type Distribution */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <PieChartIcon size={20} color="#881798" />
                <Typography variant="h6" fontWeight={600}>
                  Employment Type Distribution
                </Typography>
              </Box>
              <Box sx={{ height: 260, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts?.employmentTypeDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="count"
                      nameKey="type"
                    >
                      {(charts?.employmentTypeDistribution || []).map((_, index) => (
                        <Cell key={`cell-type-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 4. Employee Growth over Time */}
        <Grid item xs={12} md={6} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <TrendingUp size={20} color="#0F6CBD" />
                <Typography variant="h6" fontWeight={600}>
                  Cumulative Employee Growth
                </Typography>
              </Box>
              <Box sx={{ height: 260, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts?.employeeGrowth || []} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F6CBD" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0F6CBD" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="headcount" stroke="#0F6CBD" strokeWidth={2} fillOpacity={1} fill="url(#growthGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 5. Employee Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Activity size={20} color="#FF8C00" />
                <Typography variant="h6" fontWeight={600}>
                  Employee Status Distribution
                </Typography>
              </Box>
              <Box sx={{ height: 260, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts?.employeeStatusDistribution || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      nameKey="status"
                    >
                      {(charts?.employeeStatusDistribution || []).map((entry, index) => (
                        <Cell
                          key={`cell-status-${index}`}
                          fill={STATUS_COLORS[entry.status] || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 6. Recent Hiring Trend */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Calendar size={20} color="#0078D4" />
                <Typography variant="h6" fontWeight={600}>
                  Recent Hiring Trend (Past Months)
                </Typography>
              </Box>
              <Box sx={{ height: 260, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts?.recentHiringTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="hires" fill="#0078D4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
};
