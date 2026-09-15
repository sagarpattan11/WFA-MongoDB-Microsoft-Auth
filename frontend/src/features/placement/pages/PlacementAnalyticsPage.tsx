import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  RefreshCw,
  Users,
  Building2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';
import { ColumnDef, DataTableShell } from '../../../components/common/DataTableShell';
import { ExportReportMenu } from '../../../components/common/ExportReportMenu';
import { AppSearchField } from '../../../components/common/AppSearchField';
import { AppSelect } from '../../../components/common/AppSelect';

interface PlacementSummary {
  totalCandidates: number;
  placedCandidates: number;
  retainedCandidates: number;
  placementRate: number;
  retentionRate: number;
  avgPlacementTimeDays: number;
  salary: {
    minSalary: number;
    avgSalary: number;
    maxSalary: number;
  };
}

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  color: string;
}

interface BreakdownData {
  byDepartment: Array<{ name: string; count: number; avgSalary: number }>;
  bySkillDomain: Array<{ name: string; count: number }>;
  byLocation: Array<{ name: string; count: number }>;
  byEmployer: Array<{ name: string; count: number; avgSalary: number }>;
}

interface PlacementCandidate extends Record<string, unknown> {
  _id: string;
  candidateId: string;
  candidateName: string;
  email: string;
  department: string;
  skillDomain: string;
  targetRole: string;
  location: string;
  offeredSalary: number;
  status: 'in-training' | 'interviewing' | 'placed' | 'retained' | 'opted-out';
  placementDurationDays: number;
  employerName: string;
  notes?: string;
  createdAt: string;
}

export const PlacementAnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<PlacementSummary | null>(null);
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);
  const [breakdowns, setBreakdowns] = useState<BreakdownData | null>(null);

  // Candidate Directory State
  const [candidates, setCandidates] = useState<PlacementCandidate[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCandidatesCount, setTotalCandidatesCount] = useState(0);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, funnelRes, bdRes] = await Promise.all([
        apiClient.get(API_ENDPOINTS.PLACEMENT.SUMMARY),
        apiClient.get(API_ENDPOINTS.PLACEMENT.FUNNEL),
        apiClient.get(API_ENDPOINTS.PLACEMENT.BREAKDOWN),
      ]);

      setSummary(sumRes.data.data);
      setFunnel(funnelRes.data.data?.funnel || []);
      setBreakdowns(bdRes.data.data);
    } catch (err: any) {
      console.error('Error fetching placement telemetry:', err);
      setError(err.message || 'Failed to load placement analytics telemetry.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    setTableLoading(true);
    try {
      const params: Record<string, any> = {
        page,
        limit: pageSize,
      };
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (deptFilter !== 'ALL') params.department = deptFilter;

      const res = await apiClient.get(API_ENDPOINTS.PLACEMENT.CANDIDATES, { params });
      const data = res.data.data;
      setCandidates(data.candidates || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCandidatesCount(data.pagination?.total || 0);
    } catch (err) {
      console.error('Error loading placement candidates:', err);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [page, pageSize, searchQuery, statusFilter, deptFilter]);

  const candidateColumns: ColumnDef<PlacementCandidate>[] = [
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
      maxWidth: 180,
      accessor: (row) => (
        <div>
          <div className="font-semibold text-neutral-900 dark:text-neutral-100">{row.candidateName}</div>
          <div className="text-[11px] text-neutral-600 dark:text-neutral-400">{row.email}</div>
        </div>
      ),
    },
    {
      id: 'targetRole',
      header: 'Target Role & Domain',
      maxWidth: 220,
      accessor: (row) => (
        <div>
          <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200">{row.targetRole}</div>
          <div className="text-[11px] text-neutral-600 dark:text-neutral-400">{row.skillDomain}</div>
        </div>
      ),
    },
    {
      id: 'department',
      header: 'Department',
      maxWidth: 160,
      accessor: (row) => <span className="text-xs text-neutral-700 dark:text-neutral-300">{row.department}</span>,
    },
    {
      id: 'employerName',
      header: 'Client Employer',
      maxWidth: 180,
      accessor: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-neutral-800 dark:text-neutral-200">
          <Building2 className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400 shrink-0" />
          <span>{row.employerName}</span>
        </div>
      ),
    },
    {
      id: 'offeredSalary',
      header: 'Annual Package',
      align: 'right',
      width: '130px',
      accessor: (row) => (
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          ${row.offeredSalary?.toLocaleString()}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Placement Status',
      align: 'center',
      width: '140px',
      accessor: (row) => {
        const colorMap: Record<string, { color: 'success' | 'info' | 'primary' | 'warning' | 'default'; label: string }> = {
          placed: { color: 'success', label: 'Placed' },
          retained: { color: 'info', label: 'Retained (90d)' },
          'in-training': { color: 'primary', label: 'In Training' },
          interviewing: { color: 'warning', label: 'Interviewing' },
          'opted-out': { color: 'default', label: 'Opted Out' },
        };
        const cfg = colorMap[row.status] || colorMap['in-training'];
        return (
          <Chip
            label={cfg.label}
            color={cfg.color}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
          />
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
            <Briefcase className="w-6 h-6 text-primary shrink-0" />
            Placement & Deployment Analytics
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Enterprise talent conversion, corporate placements, employer partner velocity, and 90-day retention rates.
          </Typography>
        </div>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => { fetchAnalytics(); fetchCandidates(); }}
            startIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Refresh Data
          </Button>
          <ExportReportMenu module="placement" buttonLabel="Export Placement Report" />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* KPI Cards Grid */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {/* KPI 1 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                  Total Talent Pool
                </Typography>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'primary.main', color: 'white', display: 'flex' }}>
                  <Users className="w-4 h-4" />
                </Box>
              </Box>
              {loading ? (
                <Skeleton variant="text" width={100} height={36} />
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {summary?.totalCandidates || 35}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <span className="font-semibold text-emerald-600">{summary?.placedCandidates || 22} Placed</span>
                    <span>across enterprise partners</span>
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* KPI 2 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                  Placement Success Rate
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
                    {summary?.placementRate || 62.9}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    Ratio of candidates successfully placed
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* KPI 3 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                  Avg Placement Velocity
                </Typography>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#881798', color: 'white', display: 'flex' }}>
                  <Clock className="w-4 h-4" />
                </Box>
              </Box>
              {loading ? (
                <Skeleton variant="text" width={100} height={36} />
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {summary?.avgPlacementTimeDays || 38} <span className="text-base font-normal text-neutral-600">days</span>
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    From training commencement to offer
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* KPI 4 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                  Avg Placed Compensation
                </Typography>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#008272', color: 'white', display: 'flex' }}>
                  <DollarSign className="w-4 h-4" />
                </Box>
              </Box>
              {loading ? (
                <Skeleton variant="text" width={100} height={36} />
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    ${summary?.salary?.avgSalary?.toLocaleString() || '114,500'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    Peak: ${summary?.salary?.maxSalary?.toLocaleString() || '145,000'} / year
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Visualizations Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Placement Funnel Chart */}
        <Grid item xs={12} lg={6}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Placement Conversion Funnel
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    End-to-end talent journey progression
                  </Typography>
                </div>
              </Box>

              {loading ? (
                <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 2 }} />
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                  {funnel.map((stg) => (
                    <Box key={stg.stage}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {stg.stage}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: stg.color }}>
                          {stg.count} candidates ({stg.percentage}%)
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          height: 12,
                          borderRadius: 6,
                          bgcolor: 'action.hover',
                          overflow: 'hidden',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${Math.max(4, stg.percentage)}%`,
                            height: '100%',
                            bgcolor: stg.color,
                            borderRadius: 6,
                            transition: 'width 0.6s ease-in-out',
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Placements by Skill Domain & Salary */}
        <Grid item xs={12} lg={6}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Placements by Domain & Avg Compensation
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Volume vs compensation distribution
                  </Typography>
                </div>
              </Box>

              {loading ? (
                <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 2 }} />
              ) : (
                <Box sx={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={breakdowns?.byDepartment || []}
                      margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                      <YAxis tick={{ fontSize: 11 }} />
                      <RechartsTooltip
                        formatter={(val: any, name: string) => [
                          name === 'avgSalary' ? `$${Number(val).toLocaleString()}` : val,
                          name === 'avgSalary' ? 'Avg Salary' : 'Placed Staff',
                        ]}
                      />
                      <Bar dataKey="count" fill="#0F6CBD" name="Placed Count" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Candidates Directory Table Section */}
      <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2.5 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Candidate Placement Directory
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Showing {totalCandidatesCount} tracked talent placement records
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
                placeholder="Search candidate, role, employer..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </Box>
            <AppSelect
              label="Department"
              value={deptFilter}
              onChange={setDeptFilter}
              options={[
                { label: 'All Departments', value: 'ALL' },
                { label: 'Engineering', value: 'Engineering & Technology' },
                { label: 'Human Resources', value: 'Human Resources' },
                { label: 'Finance', value: 'Finance & Accounting' },
                { label: 'Operations', value: 'Operations & Logistics' },
                { label: 'Enterprise Sales', value: 'Enterprise Sales' },
              ]}
              sx={{ width: { xs: '100%', md: 200 } }}
            />
            <AppSelect
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: 'Placed', value: 'placed' },
                { label: 'In Training', value: 'in-training' },
                { label: 'Interviewing', value: 'interviewing' },
                { label: 'Retained', value: 'retained' },
                { label: 'Opted Out', value: 'opted-out' },
              ]}
              sx={{ width: { xs: '100%', md: 160 } }}
            />
          </Box>

          <DataTableShell
            columns={candidateColumns}
            data={candidates}
            loading={tableLoading}
            page={page}
            totalPages={totalPages}
            totalItems={totalCandidatesCount}
            pageSize={pageSize}
            pageSizeOptions={[5, 10, 25, 50]}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
            }}
            emptyTitle="No Placement Records Found"
            emptyDescription="No candidates match your current search and filter criteria."
          />
        </CardContent>
      </Card>
    </Box>
  );
};
