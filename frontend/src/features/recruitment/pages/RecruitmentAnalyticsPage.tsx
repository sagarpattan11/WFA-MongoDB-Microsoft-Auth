import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
  UserPlus,
  Clock,
  Users,
  CheckCircle2,
  RefreshCw,
  Target,
  Share2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';
import { ColumnDef, DataTableShell } from '../../../components/common/DataTableShell';
import { ExportReportMenu } from '../../../components/common/ExportReportMenu';
import { AppSearchField } from '../../../components/common/AppSearchField';
import { AppSelect } from '../../../components/common/AppSelect';

interface RecruitmentSummary {
  openPositions: number;
  totalRequisitions: number;
  totalApplications: number;
  shortlistedCount: number;
  interviewedCount: number;
  offeredCount: number;
  hiredCount: number;
  timeToHireDays: number;
  costPerHire: number;
  offerAcceptanceRate: number;
}

interface FunnelItem {
  stage: string;
  count: number;
  percentage: number;
  color: string;
}

interface SourcingChannelData {
  channel: string;
  applicants: number;
  hires: number;
}

interface RequisitionItem extends Record<string, unknown> {
  _id: string;
  requisitionId: string;
  jobTitle: string;
  department: string;
  location: string;
  openPositions: number;
  status: 'open' | 'interviewing' | 'filled' | 'cancelled';
  metrics?: {
    applicationsCount: number;
    shortlistedCount: number;
    interviewedCount: number;
    offeredCount: number;
    hiredCount: number;
    costPerHire: number;
    timeToHireDays: number;
  };
  createdAt: string;
}

interface ApplicationItem extends Record<string, unknown> {
  _id: string;
  candidateId: string;
  candidateName: string;
  email: string;
  phone?: string;
  requisitionId: string;
  jobTitle: string;
  department: string;
  location: string;
  sourceChannel: string;
  stage: string;
  appliedDate: string;
  interviewScore?: number;
  timeInPipelineDays: number;
  costToSource: number;
}

export const RecruitmentAnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<RecruitmentSummary | null>(null);
  const [funnel, setFunnel] = useState<FunnelItem[]>([]);
  const [channels, setChannels] = useState<SourcingChannelData[]>([]);

  // Tab State: 0 = Open Requisitions, 1 = Candidate Pipeline Applications
  const [activeTab, setActiveTab] = useState(0);

  // Requisitions State
  const [requisitions, setRequisitions] = useState<RequisitionItem[]>([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqSearch, setReqSearch] = useState('');
  const [reqPage, setReqPage] = useState(1);
  const [reqPageSize, setReqPageSize] = useState(10);
  const [reqTotalPages, setReqTotalPages] = useState(1);
  const [reqTotalCount, setReqTotalCount] = useState(0);

  // Applications State
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [appLoading, setAppLoading] = useState(false);
  const [appSearch, setAppSearch] = useState('');
  const [appStageFilter, setAppStageFilter] = useState('ALL');
  const [appChannelFilter, setAppChannelFilter] = useState('ALL');
  const [appPage, setAppPage] = useState(1);
  const [appPageSize, setAppPageSize] = useState(10);
  const [appTotalPages, setAppTotalPages] = useState(1);
  const [appTotalCount, setAppTotalCount] = useState(0);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, funRes, bdRes] = await Promise.all([
        apiClient.get(API_ENDPOINTS.RECRUITMENT.SUMMARY),
        apiClient.get(API_ENDPOINTS.RECRUITMENT.FUNNEL),
        apiClient.get(API_ENDPOINTS.RECRUITMENT.BREAKDOWN),
      ]);

      setSummary(sumRes.data.data);
      setFunnel(funRes.data.data?.funnel || []);
      setChannels(bdRes.data.data?.byChannel || []);
    } catch (err: any) {
      console.error('Error fetching recruitment telemetry:', err);
      setError(err.message || 'Failed to load recruitment analytics telemetry.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequisitions = async () => {
    setReqLoading(true);
    try {
      const params: Record<string, any> = {
        page: reqPage,
        limit: reqPageSize,
      };
      if (reqSearch.trim()) params.q = reqSearch.trim();

      const res = await apiClient.get(API_ENDPOINTS.RECRUITMENT.REQUISITIONS, { params });
      const data = res.data.data;
      setRequisitions(data.requisitions || []);
      setReqTotalPages(data.pagination?.totalPages || 1);
      setReqTotalCount(data.pagination?.total || 0);
    } catch (err) {
      console.error('Error loading requisitions:', err);
    } finally {
      setReqLoading(false);
    }
  };

  const fetchApplications = async () => {
    setAppLoading(true);
    try {
      const params: Record<string, any> = {
        page: appPage,
        limit: appPageSize,
      };
      if (appSearch.trim()) params.q = appSearch.trim();
      if (appStageFilter !== 'ALL') params.stage = appStageFilter;
      if (appChannelFilter !== 'ALL') params.sourceChannel = appChannelFilter;

      const res = await apiClient.get(API_ENDPOINTS.RECRUITMENT.APPLICATIONS, { params });
      const data = res.data.data;
      setApplications(data.applications || []);
      setAppTotalPages(data.pagination?.totalPages || 1);
      setAppTotalCount(data.pagination?.total || 0);
    } catch (err) {
      console.error('Error loading applications:', err);
    } finally {
      setAppLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (activeTab === 0) {
      fetchRequisitions();
    } else {
      fetchApplications();
    }
  }, [activeTab, reqPage, reqPageSize, reqSearch, appPage, appPageSize, appSearch, appStageFilter, appChannelFilter]);

  const requisitionColumns: ColumnDef<RequisitionItem>[] = [
    {
      id: 'requisitionId',
      header: 'Requisition ID',
      width: '140px',
      maxWidth: 140,
      accessor: (row) => (
        <span className="font-mono text-xs font-semibold text-primary">{row.requisitionId}</span>
      ),
    },
    {
      id: 'jobTitle',
      header: 'Job Title & Openings',
      maxWidth: 240,
      accessor: (row) => (
        <div>
          <div className="font-semibold text-neutral-900 dark:text-neutral-100">{row.jobTitle}</div>
          <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
            {row.openPositions} {row.openPositions === 1 ? 'position' : 'positions'} open
          </div>
        </div>
      ),
    },
    {
      id: 'department',
      header: 'Department',
      maxWidth: 180,
      accessor: (row) => <span className="text-xs text-neutral-700 dark:text-neutral-300">{row.department}</span>,
    },
    {
      id: 'location',
      header: 'Location',
      maxWidth: 160,
      accessor: (row) => <span className="text-xs text-neutral-600 dark:text-neutral-400">{row.location}</span>,
    },
    {
      id: 'status',
      header: 'Requisition Status',
      align: 'center',
      width: '130px',
      accessor: (row) => {
        const color = row.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300' : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300';
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${color}`}>
            {row.status?.toUpperCase()}
          </span>
        );
      },
    },
    {
      id: 'costPerHire',
      header: 'Cost Per Hire',
      align: 'right',
      width: '120px',
      accessor: (row) => (
        <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
          ${row.metrics?.costPerHire?.toLocaleString() || '4,200'}
        </span>
      ),
    },
    {
      id: 'timeToHireDays',
      header: 'Time to Hire',
      align: 'right',
      width: '120px',
      accessor: (row) => (
        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
          {row.metrics?.timeToHireDays || 30} days
        </span>
      ),
    },
  ];

  const applicationColumns: ColumnDef<ApplicationItem>[] = [
    {
      id: 'candidateId',
      header: 'Candidate ID',
      width: '130px',
      maxWidth: 130,
      accessor: (row) => (
        <span className="font-mono text-xs font-semibold text-primary">{row.candidateId}</span>
      ),
    },
    {
      id: 'candidateName',
      header: 'Candidate Name',
      maxWidth: 200,
      accessor: (row) => (
        <div>
          <div className="font-semibold text-neutral-900 dark:text-neutral-100">{row.candidateName}</div>
          <div className="text-[11px] text-neutral-600 dark:text-neutral-400">{row.email}</div>
        </div>
      ),
    },
    {
      id: 'jobTitle',
      header: 'Target Job & Requisition',
      maxWidth: 220,
      accessor: (row) => (
        <div>
          <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200">{row.jobTitle}</div>
          <div className="text-[11px] text-neutral-600 dark:text-neutral-400">{row.requisitionId} • {row.department}</div>
        </div>
      ),
    },
    {
      id: 'sourceChannel',
      header: 'Channel',
      width: '130px',
      accessor: (row) => (
        <span className="inline-flex items-center gap-1 text-xs text-neutral-700 dark:text-neutral-300">
          <Share2 className="w-3 h-3 text-neutral-600 dark:text-neutral-400" />
          {row.sourceChannel}
        </span>
      ),
    },
    {
      id: 'interviewScore',
      header: 'Interview Score',
      align: 'center',
      width: '130px',
      accessor: (row) => (
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
          {row.interviewScore ? `${row.interviewScore}/10` : 'Pending'}
        </span>
      ),
    },
    {
      id: 'timeInPipelineDays',
      header: 'In Pipeline',
      align: 'right',
      width: '110px',
      accessor: (row) => (
        <span className="text-xs text-neutral-700 dark:text-neutral-300">
          {row.timeInPipelineDays} days
        </span>
      ),
    },
    {
      id: 'stage',
      header: 'Pipeline Stage',
      align: 'center',
      width: '130px',
      accessor: (row) => {
        const stageColors: Record<string, string> = {
          applied: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300',
          shortlisted: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300',
          interviewing: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300',
          offered: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300',
          hired: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300',
          rejected: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300',
          withdrawn: 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300',
        };
        const cls = stageColors[row.stage] || stageColors['applied'];
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cls}`}>
            {row.stage?.toUpperCase()}
          </span>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1600, margin: '0 auto' }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}>
        <div>
          <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', itemsCenter: 'center', gap: 1.5, color: 'text.primary' }}>
            <UserPlus className="w-6 h-6 text-primary shrink-0" />
            Recruitment & Talent Acquisition Analytics
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Sourcing efficiency, full-funnel conversion rates, time-to-hire velocity, and candidate cost analysis.
          </Typography>
        </div>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => { fetchAnalytics(); fetchRequisitions(); fetchApplications(); }}
            startIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Refresh Data
          </Button>
          <ExportReportMenu module="recruitment" buttonLabel="Export Recruitment Report" />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* KPI Cards Grid */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {/* KPI 1: Open Positions */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                  Open Positions
                </Typography>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'primary.main', color: 'white', display: 'flex' }}>
                  <Target className="w-4 h-4" />
                </Box>
              </Box>
              {loading ? (
                <Skeleton variant="text" width={100} height={36} />
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {summary?.openPositions || 9}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <span className="font-semibold text-primary">{summary?.totalRequisitions || 4} Requisitions</span>
                    <span>active</span>
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* KPI 2: Total Applications */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                  Applications In Flow
                </Typography>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#881798', color: 'white', display: 'flex' }}>
                  <Users className="w-4 h-4" />
                </Box>
              </Box>
              {loading ? (
                <Skeleton variant="text" width={100} height={36} />
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#881798' }}>
                    {summary?.totalApplications || 227}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    {summary?.shortlistedCount || 57} shortlisted ({Math.round(((summary?.shortlistedCount || 57) / (summary?.totalApplications || 227)) * 100)}%)
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* KPI 3: Avg Time to Hire */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                  Avg Time-To-Hire
                </Typography>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#C19C00', color: 'white', display: 'flex' }}>
                  <Clock className="w-4 h-4" />
                </Box>
              </Box>
              {loading ? (
                <Skeleton variant="text" width={100} height={36} />
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {summary?.timeToHireDays || 33} <span className="text-base font-normal text-neutral-600">days</span>
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    Target SLA: under 35 days
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* KPI 4: Offer Acceptance Rate & Cost */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                  Offer Acceptance
                </Typography>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#107C41', color: 'white', display: 'flex' }}>
                  <CheckCircle2 className="w-4 h-4" />
                </Box>
              </Box>
              {loading ? (
                <Skeleton variant="text" width={100} height={36} />
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#107C41' }}>
                    {summary?.offerAcceptanceRate || 85.0}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    Avg Cost Per Hire: ${summary?.costPerHire?.toLocaleString() || '4,625'}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Visualizations Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Recruitment Funnel Chart */}
        <Grid item xs={12} lg={6}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Hiring Pipeline Funnel
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Application volume to offer conversion
                  </Typography>
                </div>
              </Box>

              {loading ? (
                <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 2 }} />
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                  {funnel.map((item) => (
                    <Box key={item.stage}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{item.stage}</span>
                        <span className="text-xs font-bold" style={{ color: item.color }}>
                          {item.count} ({item.percentage}%)
                        </span>
                      </Box>
                      <div className="w-full h-3.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sourcing Channels Chart */}
        <Grid item xs={12} lg={6}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Sourcing Channel Effectiveness
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Volume vs successful hires by source
                  </Typography>
                </div>
              </Box>

              {loading ? (
                <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 2 }} />
              ) : (
                <Box sx={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={channels}
                      margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                      <XAxis dataKey="channel" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                      <YAxis tick={{ fontSize: 11 }} />
                      <RechartsTooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="applicants" fill="#0F6CBD" name="Total Applicants" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="hires" fill="#107C41" name="Successful Hires" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Directory Section with Tabs */}
      <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2.5 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}>
          <Tabs value={activeTab} onChange={(_e, v) => setActiveTab(v)}>
            <Tab
              label={`Open Requisitions (${reqTotalCount})`}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: 13 }}
            />
            <Tab
              label={`Candidate Applications (${appTotalCount})`}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: 13 }}
            />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {activeTab === 0 ? (
            <div>
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Active Job Openings
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Open requisitions and recruitment metrics
                </Typography>
              </Box>

              <Box sx={{ mb: 2.5, maxWidth: 400 }}>
                <AppSearchField
                  placeholder="Search job title, ID, dept..."
                  value={reqSearch}
                  onChange={setReqSearch}
                />
              </Box>

              <DataTableShell
                columns={requisitionColumns}
                data={requisitions}
                loading={reqLoading}
                page={reqPage}
                totalPages={reqTotalPages}
                totalItems={reqTotalCount}
                pageSize={reqPageSize}
                pageSizeOptions={[5, 10, 25]}
                onPageChange={setReqPage}
                onPageSizeChange={(newSize) => {
                  setReqPageSize(newSize);
                  setReqPage(1);
                }}
                emptyTitle="No Requisitions Found"
                emptyDescription="No job requisitions match your search criteria."
              />
            </div>
          ) : (
            <div>
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Candidate Applications Pipeline
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Candidate stages, channel sources, and evaluation scores
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'stretch', md: 'center' },
                  gap: 1.5,
                  mb: 2.5,
                }}
              >
                <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 240 } }}>
                  <AppSearchField
                    placeholder="Search candidate, role, req..."
                    value={appSearch}
                    onChange={setAppSearch}
                  />
                </Box>
                <AppSelect
                  label="Stage"
                  value={appStageFilter}
                  onChange={setAppStageFilter}
                  options={[
                    { label: 'All Stages', value: 'ALL' },
                    { label: 'Applied', value: 'applied' },
                    { label: 'Shortlisted', value: 'shortlisted' },
                    { label: 'Interviewing', value: 'interviewing' },
                    { label: 'Offered', value: 'offered' },
                    { label: 'Hired', value: 'hired' },
                    { label: 'Rejected', value: 'rejected' },
                  ]}
                  sx={{ width: { xs: '100%', md: 160 } }}
                />
                <AppSelect
                  label="Channel"
                  value={appChannelFilter}
                  onChange={setAppChannelFilter}
                  options={[
                    { label: 'All Channels', value: 'ALL' },
                    { label: 'LinkedIn', value: 'LinkedIn' },
                    { label: 'Referral', value: 'Referral' },
                    { label: 'Career Portal', value: 'Career Portal' },
                    { label: 'Agency', value: 'Agency' },
                    { label: 'Campus', value: 'Campus' },
                  ]}
                  sx={{ width: { xs: '100%', md: 170 } }}
                />
              </Box>

              <DataTableShell
                columns={applicationColumns}
                data={applications}
                loading={appLoading}
                page={appPage}
                totalPages={appTotalPages}
                totalItems={appTotalCount}
                pageSize={appPageSize}
                pageSizeOptions={[5, 10, 25, 50]}
                onPageChange={setAppPage}
                onPageSizeChange={(newSize) => {
                  setAppPageSize(newSize);
                  setAppPage(1);
                }}
                emptyTitle="No Candidate Applications Found"
                emptyDescription="No applications match your selected filters."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
