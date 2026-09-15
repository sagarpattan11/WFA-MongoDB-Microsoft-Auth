import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import {
  ArrowRight,
  GraduationCap,
  RefreshCw,
  Sliders,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';
import { ColumnDef, DataTableShell } from '../../../components/common/DataTableShell';
import { ExportReportMenu } from '../../../components/common/ExportReportMenu';
import { AppSearchField } from '../../../components/common/AppSearchField';
import { AppSelect } from '../../../components/common/AppSelect';
import { AutoTooltipText } from '../../../components/common/AutoTooltipText';

interface ForecastingSummary {
  summary: {
    currentHeadcount: number;
    projectedDemand: number;
    netGap: number;
    hiringRequirement: number;
    upskillingRequirement: number;
    upskillSharePercentage: number;
    confidenceScore: number;
    financials: {
      hiringBudget: number;
      upskillingBudget: number;
      totalBudgetImpact: number;
    };
  };
  horizonBreakdown: Array<{
    horizon: string;
    currentHeadcount: number;
    projectedDemand: number;
    gap: number;
    hiringRequirement: number;
    upskillingRequirement: number;
    budgetImpact: number;
  }>;
}

interface SkillDemandData {
  emergingSkills: Array<{
    skillName: string;
    demandCount: number;
    departments: string[];
    avgGap: number;
  }>;
  shrinkingSkills: Array<{
    skillName: string;
    decreaseCount: number;
    departments: string[];
  }>;
}

interface SimulationResult {
  baseHeadcount: number;
  baselineTrajectory: Array<{ period: string; headcount: number }>;
  simulatedTrajectory: Array<{ period: string; headcount: number }>;
  gapAnalysis: {
    baselineGap12M: number;
    simulatedGap12M: number;
    internalUpskilledFill: number;
    turnoverSavedPositions: number;
    gapClosurePercentage: number;
  };
  financialImpact: {
    totalInvestment: number;
    simulatedTotalCost: number;
    baselineTotalCost: number;
    projectedNetSavings: number;
    estimatedRoiMultiplier: number;
  };
}

interface DemandForecastItem extends Record<string, unknown> {
  _id: string;
  department: string;
  targetRole: string;
  timeHorizon: '6M' | '12M' | '24M';
  currentHeadcount: number;
  projectedDemand: number;
  gap: number;
  hiringRequirement: number;
  upskillingRequirement: number;
  criticalSkills: string[];
  shrinkingSkills: string[];
  confidenceScore: number;
  scenario: 'baseline' | 'expansion' | 'conservative';
  totalBudgetImpact: number;
}

export const WorkforceForecastingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summaryData, setSummaryData] = useState<ForecastingSummary | null>(null);
  const [skillDemand, setSkillDemand] = useState<SkillDemandData | null>(null);

  // Scenario Controls
  const [scenario, setScenario] = useState<'baseline' | 'expansion' | 'conservative'>('baseline');
  const [horizon, setHorizon] = useState<'6M' | '12M' | '24M'>('12M');

  // Interactive "What-If" Simulator State
  const [simGrowthRate, setSimGrowthRate] = useState<number>(15);
  const [simRetentionBudget, setSimRetentionBudget] = useState<number>(60000);
  const [simUpskillingBudget, setSimUpskillingBudget] = useState<number>(40000);
  const [simAttritionMitigation, setSimAttritionMitigation] = useState<number>(25);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Forecast Table State
  const [forecasts, setForecasts] = useState<DemandForecastItem[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalForecastsCount, setTotalForecastsCount] = useState(0);

  const fetchSummaryAndSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, skillRes] = await Promise.all([
        apiClient.get(API_ENDPOINTS.FORECASTING.SUMMARY, {
          params: { scenario, timeHorizon: horizon },
        }),
        apiClient.get(API_ENDPOINTS.FORECASTING.SKILL_DEMAND),
      ]);
      setSummaryData(sumRes.data.data);
      setSkillDemand(skillRes.data.data);
    } catch (err: any) {
      console.error('Failed to load forecasting telemetry:', err);
      setError(err?.message || 'Failed to load workforce demand forecasting analytics');
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    try {
      const simRes = await apiClient.post(API_ENDPOINTS.FORECASTING.SIMULATE, {
        growthRatePercent: simGrowthRate,
        retentionBudget: simRetentionBudget,
        upskillingBudget: simUpskillingBudget,
        attritionMitigationPercent: simAttritionMitigation,
      });
      setSimulationResult(simRes.data.data.results);
    } catch (err) {
      console.error('Simulation calculation failed:', err);
    }
  };

  const fetchForecastsTable = async () => {
    setTableLoading(true);
    try {
      const params: Record<string, any> = {
        page,
        limit: pageSize,
        scenario,
        timeHorizon: horizon,
      };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (deptFilter !== 'ALL') params.department = deptFilter;

      const res = await apiClient.get(API_ENDPOINTS.FORECASTING.FORECASTS, { params });
      const payload = res.data.data;
      setForecasts(payload.forecasts);
      setTotalPages(payload.pagination.totalPages);
      setTotalForecastsCount(payload.pagination.total);
    } catch (err) {
      console.error('Failed to load forecasts table:', err);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryAndSkills();
  }, [scenario, horizon]);

  useEffect(() => {
    runSimulation();
  }, [simGrowthRate, simRetentionBudget, simUpskillingBudget, simAttritionMitigation]);

  useEffect(() => {
    fetchForecastsTable();
  }, [page, pageSize, searchQuery, deptFilter, scenario, horizon]);

  const handleRefresh = () => {
    fetchSummaryAndSkills();
    runSimulation();
    fetchForecastsTable();
  };

  const columns: ColumnDef<DemandForecastItem>[] = [
    {
      id: 'targetRole',
      header: 'Role & Department',
      accessor: (row: DemandForecastItem) => (
        <Box>
          <AutoTooltipText
            text={row.targetRole}
            sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem' }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            {row.department}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'timeHorizon',
      header: 'Horizon',
      accessor: (row: DemandForecastItem) => (
        <Chip
          label={row.timeHorizon}
          size="small"
          color={row.timeHorizon === '6M' ? 'primary' : row.timeHorizon === '12M' ? 'secondary' : 'default'}
          sx={{ fontWeight: 700 }}
        />
      ),
    },
    {
      id: 'currentHeadcount',
      header: 'Current vs Need',
      accessor: (row: DemandForecastItem) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.currentHeadcount}
          </Typography>
          <ArrowRight size={14} color="#6B7280" />
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {row.projectedDemand}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'gap',
      header: 'Net Gap',
      accessor: (row: DemandForecastItem) => (
        <Chip
          label={`+${row.gap} Heads`}
          size="small"
          sx={{
            fontWeight: 700,
            bgcolor: row.gap > 5 ? 'error.light' : 'warning.light',
            color: row.gap > 5 ? 'error.dark' : 'warning.dark',
          }}
        />
      ),
    },
    {
      id: 'hiringRequirement',
      header: 'Talent Sourcing Strategy',
      accessor: (row: DemandForecastItem) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            icon={<GraduationCap size={12} />}
            label={`${row.upskillingRequirement} Upskill`}
            size="small"
            variant="outlined"
            color="success"
            sx={{ fontSize: '0.7rem', fontWeight: 600 }}
          />
          <Chip
            icon={<UserPlus size={12} />}
            label={`${row.hiringRequirement} External`}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ fontSize: '0.7rem', fontWeight: 600 }}
          />
        </Box>
      ),
    },
    {
      id: 'criticalSkills',
      header: 'Critical Emerging Skills',
      accessor: (row: DemandForecastItem) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {row.criticalSkills?.slice(0, 2).map((sk: string, idx: number) => (
            <Chip
              key={idx}
              label={sk}
              size="small"
              sx={{ fontSize: '0.675rem', bgcolor: 'action.hover' }}
            />
          ))}
          {row.criticalSkills?.length > 2 && (
            <Chip
              label={`+${row.criticalSkills.length - 2}`}
              size="small"
              sx={{ fontSize: '0.675rem' }}
            />
          )}
        </Box>
      ),
    },
    {
      id: 'totalBudgetImpact',
      header: 'Budget Impact',
      accessor: (row: DemandForecastItem) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          ${row.totalBudgetImpact?.toLocaleString()}
        </Typography>
      ),
    },
  ];

  // Combined chart data for What-If Trajectory
  const simulationChartData = simulationResult?.baselineTrajectory.map((base, idx) => ({
    period: base.period,
    Baseline: base.headcount,
    Simulated: simulationResult.simulatedTrajectory[idx]?.headcount || base.headcount,
  })) || [];

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
              Workforce Demand Forecasting & Simulation
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Future headcount projections across 6M, 12M, 24M horizons with interactive "What-If" scenario simulation
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <AppSelect
            label="Scenario"
            value={scenario}
            onChange={(val: string) => setScenario(val as any)}
            options={[
              { value: 'baseline', label: 'Baseline Growth' },
              { value: 'expansion', label: 'Aggressive Expansion' },
              { value: 'conservative', label: 'Conservative Stance' },
            ]}
            sx={{ minWidth: 160 }}
          />

          <AppSelect
            label="Horizon"
            value={horizon}
            onChange={(val: string) => setHorizon(val as any)}
            options={[
              { value: '6M', label: '6 Months' },
              { value: '12M', label: '12 Months (1 Year)' },
              { value: '24M', label: '24 Months (2 Years)' },
            ]}
            sx={{ minWidth: 140 }}
          />

          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshCw size={16} />}
            onClick={handleRefresh}
            disabled={loading || tableLoading}
            sx={{ borderRadius: 2 }}
          >
            Refresh
          </Button>
          <ExportReportMenu module="forecasting" />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* KPI Cards Grid */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Projected Demand ({horizon})
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
                    {summaryData?.summary.projectedDemand || 0}
                    <Typography component="span" variant="body1" sx={{ color: 'text.secondary', fontWeight: 600, ml: 1 }}>
                      Heads
                    </Typography>
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    Current: {summaryData?.summary.currentHeadcount || 0} active employees
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Net Talent Gap
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'warning.light', color: 'warning.dark' }}>
                  <TrendingUp size={18} />
                </Box>
              </Box>
              {loading ? (
                <Skeleton width="60%" height={40} />
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.dark' }}>
                    +{summaryData?.summary.netGap || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    {summaryData?.summary.hiringRequirement || 0} External • {summaryData?.summary.upskillingRequirement || 0} Internal Upskill
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Internal Upskill Share
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
                    {summaryData?.summary.upskillSharePercentage || 55}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'success.dark', mt: 0.5, display: 'block', fontWeight: 600 }}>
                    Promoting talent from within
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Confidence Score
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'info.light', color: 'info.dark' }}>
                  <Sparkles size={18} />
                </Box>
              </Box>
              {loading ? (
                <Skeleton width="60%" height={40} />
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'info.main' }}>
                    {summaryData?.summary.confidenceScore || 88}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    Model precision based on 24M telemetry
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 1 Visual Charts: Horizon Trajectory & Emerging vs Shrinking Skills */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                Headcount Demand by Time Horizon
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                Projected demand vs current supply across 6M, 12M, and 24M planning windows
              </Typography>

              {loading ? (
                <Skeleton height={260} />
              ) : (
                <Box sx={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={summaryData?.horizonBreakdown || []}
                      margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="horizon" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="currentHeadcount" fill="#94A3B8" name="Current Supply" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="projectedDemand" fill="#3B82F6" name="Projected Need" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="upskillingRequirement" fill="#10B981" name="Internal Upskill" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                Emerging vs Shrinking Skill Matrix
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                High-demand capability targets vs retiring legacy skillsets
              </Typography>

              {loading ? (
                <Skeleton height={260} />
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'success.dark', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                      🚀 Top Emerging High-Demand Skills
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {skillDemand?.emergingSkills.slice(0, 5).map((sk, idx) => (
                        <Chip
                          key={idx}
                          label={`${sk.skillName} (+${sk.demandCount})`}
                          size="small"
                          color="success"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'error.dark', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                      📉 Shrinking / Declining Legacy Skills
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {skillDemand?.shrinkingSkills.slice(0, 5).map((sk, idx) => (
                        <Chip
                          key={idx}
                          label={`${sk.skillName}`}
                          size="small"
                          color="error"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 2: INTERACTIVE "WHAT-IF" SCENARIO SIMULATOR */}
      <Card
        elevation={0}
        sx={{
          border: '2px solid',
          borderColor: 'primary.main',
          borderRadius: 3,
          mb: 3,
          bgcolor: 'background.paper',
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 3.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.main', color: '#fff' }}>
              <Sliders size={20} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                Interactive "What-If" Scenario Simulator
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Adjust dynamic sliders to simulate budget impacts, talent gap closure, and headcount trajectory in real time
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={4} sx={{ mt: 1 }}>
            {/* Left Controls Column */}
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Growth Rate Slider */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Target Headcount Growth
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      {simGrowthRate > 0 ? `+${simGrowthRate}%` : `${simGrowthRate}%`}
                    </Typography>
                  </Box>
                  <Slider
                    value={simGrowthRate}
                    min={-20}
                    max={50}
                    step={5}
                    onChange={(_, val) => setSimGrowthRate(val as number)}
                    valueLabelDisplay="auto"
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Adjust anticipated business demand expansion or contraction
                  </Typography>
                </Box>

                {/* Retention Incentive Slider */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Retention Incentive Pool
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'success.main' }}>
                      ${simRetentionBudget.toLocaleString()}
                    </Typography>
                  </Box>
                  <Slider
                    value={simRetentionBudget}
                    min={0}
                    max={200000}
                    step={10000}
                    onChange={(_, val) => setSimRetentionBudget(val as number)}
                    valueLabelDisplay="auto"
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Bonus pool and market parity adjustment funds
                  </Typography>
                </Box>

                {/* Upskilling Investment Slider */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Upskilling & Reskilling Investment
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'info.main' }}>
                      ${simUpskillingBudget.toLocaleString()}
                    </Typography>
                  </Box>
                  <Slider
                    value={simUpskillingBudget}
                    min={0}
                    max={100000}
                    step={5000}
                    onChange={(_, val) => setSimUpskillingBudget(val as number)}
                    valueLabelDisplay="auto"
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Training certifications and AI capability bootcamps
                  </Typography>
                </Box>

                {/* Attrition Mitigation Slider */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Attrition Mitigation Target
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'warning.dark' }}>
                      {simAttritionMitigation}% Turnover Reduction
                    </Typography>
                  </Box>
                  <Slider
                    value={simAttritionMitigation}
                    min={0}
                    max={50}
                    step={5}
                    onChange={(_, val) => setSimAttritionMitigation(val as number)}
                    valueLabelDisplay="auto"
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Expected reduction in employee departures
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right Live Simulation Output Column */}
            <Grid item xs={12} md={7}>
              <Box sx={{ bgcolor: 'background.default', p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    Simulated Trajectory vs Baseline
                  </Typography>
                  <Chip
                    icon={<Zap size={14} />}
                    label="Real-time Live Computation"
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>

                {/* Trajectory Comparison Chart */}
                <Box sx={{ width: '100%', height: 200, mb: 2.5 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simulationChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Baseline" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" />
                      <Line type="monotone" dataKey="Simulated" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>

                {/* Simulation KPI Badges */}
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.paper', textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Gap Closure
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.main' }}>
                        {simulationResult?.gapAnalysis.gapClosurePercentage || 0}%
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.paper', textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Upskilled Fill
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'info.main' }}>
                        +{simulationResult?.gapAnalysis.internalUpskilledFill || 0} Heads
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.paper', textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Turnover Saved
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'warning.dark' }}>
                        +{simulationResult?.gapAnalysis.turnoverSavedPositions || 0} Retained
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.paper', textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Net Savings
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.main' }}>
                        ${Math.round((simulationResult?.financialImpact.projectedNetSavings || 0) / 1000)}k
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Row 3: Departmental Talent Demand Forecast Table */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Departmental Headcount Demand & Skill Requirements
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Showing {totalForecastsCount} target roles across active horizons and scenarios
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
                onChange={(val: string) => {
                  setSearchQuery(val);
                  setPage(1);
                }}
                placeholder="Search by role, department, or critical skill..."
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <AppSelect
                label="Department"
                value={deptFilter}
                onChange={(val: string) => {
                  setDeptFilter(val);
                  setPage(1);
                }}
                options={[
                  { value: 'ALL', label: 'All Departments' },
                  { value: 'Engineering & Technology', label: 'Engineering' },
                  { value: 'Enterprise Sales', label: 'Enterprise Sales' },
                  { value: 'Human Resources', label: 'Human Resources' },
                  { value: 'Finance & Accounting', label: 'Finance' },
                  { value: 'Operations & Logistics', label: 'Operations' },
                ]}
                sx={{ minWidth: 160 }}
              />
            </Box>
          </Box>

          <DataTableShell
            columns={columns}
            data={forecasts}
            loading={tableLoading}
            page={page}
            totalPages={totalPages}
            totalItems={totalForecastsCount}
            pageSize={pageSize}
            pageSizeOptions={[5, 10, 25, 50]}
            onPageChange={(p: number) => setPage(p)}
            onPageSizeChange={(s: number) => {
              setPageSize(s);
              setPage(1);
            }}
            emptyTitle="No Demand Forecasts Found"
            emptyDescription="No forecast records match your current search and filter criteria."
          />
        </CardContent>
      </Card>
    </Box>
  );
};
