import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Eye,
  GraduationCap,
  RefreshCw,
  Users,
  Zap,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';
import { ColumnDef, DataTableShell } from '../../../components/common/DataTableShell';
import { ExportReportMenu } from '../../../components/common/ExportReportMenu';
import { AutoTooltipText } from '../../../components/common/AutoTooltipText';

interface HealthDimension {
  subject: string;
  score: number;
  fullMark: number;
}

interface ExecutiveKPIs {
  workforce: {
    totalHeadcount: number;
    departmentsCount: number;
    locationsCount: number;
    turnoverRate: number;
  };
  skills: {
    totalSkillsTracked: number;
    trainingCompletionRate: number;
    avgSkillGain: number;
    avgFeedback: number;
  };
  recruitmentAndPlacement: {
    placementRate: number;
    totalPlaced: number;
    avgTimeToHireDays: number;
    activeApplications: number;
  };
  attrition: {
    flightRiskPercentage: number;
    highCriticalCount: number;
    totalReplacementExposure: number;
    netRetentionSavings: number;
  };
  forecasting: {
    projected12MDemand: number;
    netTalentGap12M: number;
    hiringRequirement: number;
    upskillingRequirement: number;
    confidenceScore: number;
  };
  alerts: {
    unreadCount: number;
    criticalCount: number;
    totalAlerts: number;
  };
}

interface DepartmentScorecard extends Record<string, unknown> {
  id: string;
  code: string;
  name: string;
  totalHeadcount: number;
  flightRiskRate: number;
  avgRiskScore: number;
  criticalEmployees: number;
  healthScore: number;
  status: 'Optimal' | 'Moderate' | 'Needs Attention';
}

interface WorkforceAlertItem {
  _id: string;
  title: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  message: string;
  department?: string;
  isRead: boolean;
  isResolved: boolean;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
}

export const ExecutiveCockpitPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [overallIndex, setOverallIndex] = useState<number>(91);
  const [healthDimensions, setHealthDimensions] = useState<HealthDimension[]>([]);
  const [kpis, setKpis] = useState<ExecutiveKPIs | null>(null);
  const [departmentScorecards, setDepartmentScorecards] = useState<DepartmentScorecard[]>([]);

  // Alerts State
  const [alerts, setAlerts] = useState<WorkforceAlertItem[]>([]);
  const [alertSeverityTab, setAlertSeverityTab] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(0);

  const fetchExecutiveData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, alertsRes] = await Promise.all([
        apiClient.get(API_ENDPOINTS.EXECUTIVE.OVERVIEW),
        apiClient.get(API_ENDPOINTS.EXECUTIVE.ALERTS),
      ]);

      const ov = overviewRes.data.data;
      const alt = alertsRes.data.data;

      setOverallIndex(ov.overallExecutiveIndex);
      setHealthDimensions(ov.healthDimensions);
      setKpis(ov.kpis);
      setDepartmentScorecards(ov.departmentScorecards);

      setAlerts(alt.alerts);
      setUnreadAlertsCount(alt.unreadCount);
    } catch (err: any) {
      console.error('Failed to load executive overview:', err);
      setError(err?.message || 'Failed to load executive cockpit telemetry');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiClient.patch(API_ENDPOINTS.EXECUTIVE.MARK_READ(id));
      setAlerts((prev) => prev.map((a) => (a._id === id ? { ...a, isRead: true } : a)));
      setUnreadAlertsCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark alert as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.post(API_ENDPOINTS.EXECUTIVE.READ_ALL);
      setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
      setUnreadAlertsCount(0);
    } catch (err) {
      console.error('Failed to mark all alerts as read:', err);
    }
  };

  useEffect(() => {
    fetchExecutiveData();
  }, []);

  const filteredAlerts = alerts.filter((a) => {
    if (alertSeverityTab === 'all') return true;
    return a.severity === alertSeverityTab;
  });

  const deptColumns: ColumnDef<DepartmentScorecard>[] = [
    {
      id: 'name',
      header: 'Department',
      accessor: (row: DepartmentScorecard) => (
        <Box>
          <AutoTooltipText text={row.name} sx={{ fontWeight: 600, color: 'text.primary' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Code: {row.code}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'totalHeadcount',
      header: 'Headcount',
      accessor: (row: DepartmentScorecard) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.totalHeadcount} Active
        </Typography>
      ),
    },
    {
      id: 'flightRiskRate',
      header: 'Flight Risk %',
      accessor: (row: DepartmentScorecard) => (
        <Chip
          label={`${row.flightRiskRate}% Risk (${row.criticalEmployees} Critical)`}
          size="small"
          sx={{
            fontWeight: 700,
            bgcolor: row.flightRiskRate > 20 ? 'error.light' : row.flightRiskRate > 10 ? 'warning.light' : 'success.light',
            color: row.flightRiskRate > 20 ? 'error.dark' : row.flightRiskRate > 10 ? 'warning.dark' : 'success.dark',
          }}
        />
      ),
    },
    {
      id: 'healthScore',
      header: 'Health Index',
      accessor: (row: DepartmentScorecard) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 800 }}>
            {row.healthScore}/100
          </Typography>
          <Chip
            label={row.status}
            size="small"
            variant="outlined"
            color={row.status === 'Optimal' ? 'success' : row.status === 'Moderate' ? 'warning' : 'error'}
            sx={{ fontWeight: 700, fontSize: '0.7rem' }}
          />
        </Box>
      ),
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
              Executive Cockpit & Strategic Telemetry
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Consolidated enterprise health indicators, cross-module radar telemetry, and real-time executive decision alerts
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshCw size={16} />}
            onClick={fetchExecutiveData}
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            Refresh Cockpit
          </Button>
          <ExportReportMenu module="executive" />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Main Executive Health Scorecard Banner */}
      <Card
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          mb: 3,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.05) 100%)',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    {loading ? '--' : overallIndex}
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                      Overall Enterprise Workforce Health Index
                    </Typography>
                    <Chip label="Optimal Health" color="success" size="small" sx={{ fontWeight: 700 }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Calculated from 5 multi-module dimensions across 100 enterprise headcount, 5 departments, and 35 placement accounts.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 2 }}>
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Active Alerts
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: unreadAlertsCount > 0 ? 'error.main' : 'text.primary' }}>
                    {unreadAlertsCount} Unread
                  </Typography>
                </Box>

                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Retention ROI
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.main' }}>
                    +${((kpis?.attrition.netRetentionSavings || 1980000) / 1000000).toFixed(2)}M
                  </Typography>
                </Box>

                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    12M Talent Gap
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    +{kpis?.forecasting.netTalentGap12M || 25} Heads
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Multi-Module KPI Scorecards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Card 1: Workforce Stability */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Workforce Stability
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.dark' }}>
                  <Users size={18} />
                </Box>
              </Box>
              {loading ? (
                <Skeleton width="60%" height={40} />
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    {kpis?.workforce.totalHeadcount || 100}
                    <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>
                      Active Heads
                    </Typography>
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    Annual turnover rate: {kpis?.workforce.turnoverRate || 5.2}%
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2: Skill Readiness */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Skill & Training Velocity
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'success.light', color: 'success.dark' }}>
                  <GraduationCap size={18} />
                </Box>
              </Box>
              {loading ? (
                <Skeleton width="60%" height={40} />
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main' }}>
                    {kpis?.skills.trainingCompletionRate || 70}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    Avg Skill Gain: +{kpis?.skills.avgSkillGain || 1.6} pts • {kpis?.skills.totalSkillsTracked || 20} Skills
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3: Talent Acquisition & Placement */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Placement & Hiring Velocity
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'info.light', color: 'info.dark' }}>
                  <Briefcase size={18} />
                </Box>
              </Box>
              {loading ? (
                <Skeleton width="60%" height={40} />
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'info.main' }}>
                    {kpis?.recruitmentAndPlacement.placementRate || 80}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    Avg {kpis?.recruitmentAndPlacement.avgTimeToHireDays || 26} days time-to-hire
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Card 4: Flight Risk & Retention Exposure */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Predictive Flight Risk
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'warning.light', color: 'warning.dark' }}>
                  <AlertTriangle size={18} />
                </Box>
              </Box>
              {loading ? (
                <Skeleton width="60%" height={40} />
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.dark' }}>
                    {kpis?.attrition.flightRiskPercentage || 18}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    {kpis?.attrition.highCriticalCount || 18} Heads in High/Critical flight risk
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 1 Visuals: Executive Radar Dimensions & Real-Time Alerts Panel */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Radar Chart */}
        <Grid item xs={12} md={5}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                Executive Strategic Dimensions
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                Holistic radar analysis across 5 key organizational pillars
              </Typography>

              {loading ? (
                <Skeleton height={280} />
              ) : (
                <Box sx={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={healthDimensions}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#6366F1"
                        fill="#6366F1"
                        fillOpacity={0.45}
                      />
                      <RechartsTooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Real-Time Alerts & Action Items Panel */}
        <Grid item xs={12} md={7}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Real-Time Strategic Alerts & Action Items
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Instant notification feed requiring executive decisions
                  </Typography>
                </Box>

                {unreadAlertsCount > 0 && (
                  <Button
                    size="small"
                    variant="text"
                    onClick={handleMarkAllRead}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Mark all read
                  </Button>
                )}
              </Box>

              <Tabs
                value={alertSeverityTab}
                onChange={(_, val) => setAlertSeverityTab(val)}
                sx={{ mb: 2, minHeight: 36 }}
              >
                <Tab label="All Alerts" value="all" sx={{ minHeight: 36, textTransform: 'none', py: 0.5 }} />
                <Tab label="Critical" value="critical" sx={{ minHeight: 36, textTransform: 'none', py: 0.5 }} />
                <Tab label="Warning" value="warning" sx={{ minHeight: 36, textTransform: 'none', py: 0.5 }} />
                <Tab label="Info" value="info" sx={{ minHeight: 36, textTransform: 'none', py: 0.5 }} />
              </Tabs>

              {loading ? (
                <Skeleton height={200} />
              ) : filteredAlerts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircle2 size={36} color="#10B981" />
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    No alerts in this category. All systems operating normally.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 300, overflowY: 'auto' }}>
                  {filteredAlerts.map((alert) => (
                    <Box
                      key={alert._id}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: alert.isRead ? 'background.default' : 'action.hover',
                        border: '1px solid',
                        borderColor: alert.severity === 'critical' ? 'error.light' : alert.severity === 'warning' ? 'warning.light' : 'divider',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 1.5,
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Box sx={{ mt: 0.5 }}>
                          {alert.severity === 'critical' ? (
                            <AlertCircle size={18} color="#EF4444" />
                          ) : alert.severity === 'warning' ? (
                            <AlertTriangle size={18} color="#F59E0B" />
                          ) : (
                            <Zap size={18} color="#3B82F6" />
                          )}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            {alert.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
                            {alert.message}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                        {alert.actionUrl && (
                          <Button
                            size="small"
                            variant="outlined"
                            endIcon={<ArrowUpRight size={14} />}
                            onClick={() => navigate(alert.actionUrl!)}
                            sx={{ fontSize: '0.7rem', py: 0.25 }}
                          >
                            {alert.actionLabel || 'View'}
                          </Button>
                        )}
                        {!alert.isRead && (
                          <IconButton
                            size="small"
                            onClick={() => handleMarkAsRead(alert._id)}
                            title="Mark as read"
                          >
                            <Eye size={14} />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 2: Department Executive Scorecards Table */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Departmental Executive Health Scorecards
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Strategic performance and organizational stability index across enterprise business units
            </Typography>
          </Box>

          <DataTableShell
            columns={deptColumns}
            data={departmentScorecards}
            loading={loading}
            emptyTitle="No Department Scorecards"
            emptyDescription="No department scorecards available at this time."
          />
        </CardContent>
      </Card>
    </Box>
  );
};
