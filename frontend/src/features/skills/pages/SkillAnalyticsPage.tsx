import {
  AlertTriangle,
  Award,
  BrainCircuit,
  CheckCircle2,
  GraduationCap,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MuiTooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';

interface SkillKPIs {
  totalSkillsTracked: number;
  certifiedEmployeesCount: number;
  certifiedPercentage: number;
  criticalSkillGapsCount: number;
  averageWorkforceProficiency: number;
}

interface CategoryDistItem {
  name: string;
  count: number;
}

interface SkillProficiencyItem {
  name: string;
  category: string;
  department: string;
  benchmark: number;
  currentAvg: number;
  gap: number;
  coverageCount: number;
  criticality: string;
}

interface GapItem {
  department: string;
  requiredProficiency: number;
  availableProficiency: number;
  gapScore: number;
  coveragePercentage: number;
}

interface TrainingCourse {
  _id: string;
  title: string;
  courseCode: string;
  targetSkillName: string;
  category: string;
  provider: string;
  durationHours: number;
  enrolledCount: number;
  completionRate: number;
  averageAssessmentScore: number;
  status: string;
  description?: string;
}

const CATEGORY_COLORS = ['#0F6CBD', '#107C41', '#881798', '#C19C00', '#D83B01'];

export const SkillAnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [kpis, setKpis] = useState<SkillKPIs | null>(null);
  const [categoryDist, setCategoryDist] = useState<CategoryDistItem[]>([]);
  const [topSkills, setTopSkills] = useState<SkillProficiencyItem[]>([]);
  const [missingGaps, setMissingGaps] = useState<SkillProficiencyItem[]>([]);
  const [gapAnalysis, setGapAnalysis] = useState<GapItem[]>([]);
  const [recommendations, setRecommendations] = useState<TrainingCourse[]>([]);

  const fetchSkillAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, gapsRes, recsRes] = await Promise.all([
        apiClient.get(API_ENDPOINTS.SKILLS.OVERVIEW),
        apiClient.get(API_ENDPOINTS.SKILLS.GAPS),
        apiClient.get(API_ENDPOINTS.SKILLS.RECOMMENDATIONS),
      ]);

      const ovData = overviewRes.data.data;
      setKpis(ovData.kpis);
      setCategoryDist(ovData.categoryDistribution || []);
      setTopSkills(ovData.topSkills || []);
      setMissingGaps(ovData.missingOrCriticalGaps || []);

      setGapAnalysis(gapsRes.data.data || []);
      setRecommendations(recsRes.data.data || []);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to load skill analytics data.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillAnalytics();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h5" component="h1" fontWeight={700}>
              Skill Analytics & Intelligence
            </Typography>
            <Chip
              icon={<Sparkles size={14} />}
              label="Sprint 1 Live Module"
              color="primary"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Workforce skill distribution, departmental gap analysis, certifications, and training recommendations.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={16} /> : <RefreshCw size={16} />}
          onClick={fetchSkillAnalytics}
          disabled={loading}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Refresh Analytics
        </Button>
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} action={
          <Button color="inherit" size="small" onClick={fetchSkillAnalytics}>Retry</Button>
        }>
          {error}
        </Alert>
      )}

      {/* 4 Skill KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Total Skills */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={1} sx={{ borderRadius: 3, border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Skills Tracked
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.main', display: 'flex' }}>
                  <BrainCircuit size={20} />
                </Box>
              </Box>
              {loading ? (
                <Skeleton variant="text" width={80} height={40} />
              ) : (
                <Typography variant="h4" fontWeight={700}>
                  {kpis?.totalSkillsTracked || 13}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Across 5 Enterprise Departments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Certified Workforce */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={1} sx={{ borderRadius: 3, border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Certified Workforce
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'success.light', color: 'success.main', display: 'flex' }}>
                  <Award size={20} />
                </Box>
              </Box>
              {loading ? (
                <Skeleton variant="text" width={80} height={40} />
              ) : (
                <Typography variant="h4" fontWeight={700} color="success.main">
                  {kpis?.certifiedPercentage || 83}%
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                {kpis?.certifiedEmployeesCount || 10} certified specialists active
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Critical Skill Gaps */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={1} sx={{ borderRadius: 3, border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Critical Skill Gaps
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'warning.light', color: 'warning.main', display: 'flex' }}>
                  <AlertTriangle size={20} />
                </Box>
              </Box>
              {loading ? (
                <Skeleton variant="text" width={80} height={40} />
              ) : (
                <Typography variant="h4" fontWeight={700} color="warning.main">
                  {kpis?.criticalSkillGapsCount || 3}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Training recommendations available
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Proficiency */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={1} sx={{ borderRadius: 3, border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Workforce Benchmark
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'info.light', color: 'info.main', display: 'flex' }}>
                  <TrendingUp size={20} />
                </Box>
              </Box>
              {loading ? (
                <Skeleton variant="text" width={80} height={40} />
              ) : (
                <Typography variant="h4" fontWeight={700}>
                  {kpis?.averageWorkforceProficiency || 3.8} / 5.0
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Target industry level: 4.0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Visual Charts: Department Gap Analysis & Category Distribution */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Department Skill Gap Bar Chart */}
        <Grid item xs={12} md={7}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Required vs. Available Skills by Department
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Comparison between target industry benchmark and current workforce proficiency
                </Typography>
              </Box>
            </Box>

            {loading ? (
              <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={gapAnalysis} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="department" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
                  <RechartsTooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="requiredProficiency" name="Target Benchmark (1-5)" fill="#881798" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="availableProficiency" name="Current Proficiency (1-5)" fill="#0F6CBD" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Skill Category Distribution Donut Chart */}
        <Grid item xs={12} md={5}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider', height: '100%' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Skill Inventory by Category
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Proportion of Technical, Domain, Compliance & Leadership skills
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDist}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="count"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {categoryDist.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Top Skills vs Missing Gaps 2-Column Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Top Workforce Skills */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CheckCircle2 size={18} color="#107C41" />
              <Typography variant="subtitle1" fontWeight={700}>
                Top Organizational Skill Strengths
              </Typography>
            </Box>

            {loading ? (
              <Skeleton variant="rectangular" height={180} />
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {topSkills.map((sk) => (
                  <Box key={sk.name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {sk.name}
                      </Typography>
                      <Typography variant="body2" color="primary.main" fontWeight={700}>
                        {sk.currentAvg} / 5.0
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(sk.currentAvg / 5) * 100}
                      sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover' }}
                      color="primary"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {sk.department}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {sk.coverageCount} specialists active
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Missing or Critical Skill Deficits */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AlertTriangle size={18} color="#D83B01" />
              <Typography variant="subtitle1" fontWeight={700}>
                Critical Skill Deficits & Gaps
              </Typography>
            </Box>

            {loading ? (
              <Skeleton variant="rectangular" height={180} />
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {missingGaps.map((sk) => (
                  <Box key={sk.name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {sk.name}
                      </Typography>
                      <Chip
                        label={`Gap: -${sk.gap} pts`}
                        color="error"
                        size="small"
                        sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.max(15, (sk.currentAvg / sk.benchmark) * 100)}
                      sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover' }}
                      color="error"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Target: {sk.benchmark}.0 | Current: {sk.currentAvg || 0}.0
                      </Typography>
                      <Typography variant="caption" color="error.main" fontWeight={600}>
                        {sk.criticality.toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Training & Certification Recommendations Table */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <GraduationCap size={20} color="#0F6CBD" />
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Automated Training & Certification Recommendations
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Curated learning plans mapped to current departmental skill gaps
            </Typography>
          </Box>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Course & Code</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Target Skill</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Provider</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Completion Rate</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Assessment Avg</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : recommendations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                    No training recommendations currently required.
                  </TableCell>
                </TableRow>
              ) : (
                recommendations.map((course) => (
                  <TableRow key={course._id} hover>
                    <TableCell>
                      <MuiTooltip title={course.description || course.title} arrow placement="top" enterDelay={200}>
                        <Box sx={{ cursor: 'default' }}>
                          <Typography variant="body2" fontWeight={600}>
                            {course.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {course.courseCode}
                          </Typography>
                        </Box>
                      </MuiTooltip>
                    </TableCell>
                    <TableCell>
                      <MuiTooltip title={`Curated for skill: ${course.targetSkillName}`} arrow placement="top">
                        <Chip label={course.targetSkillName} size="small" variant="outlined" sx={{ cursor: 'default' }} />
                      </MuiTooltip>
                    </TableCell>
                    <TableCell>
                      <MuiTooltip title={`Course Provider: ${course.provider}`} arrow placement="top">
                        <Typography variant="body2" sx={{ cursor: 'default' }}>
                          {course.provider}
                        </Typography>
                      </MuiTooltip>
                    </TableCell>
                    <TableCell>{course.durationHours} hrs</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={course.completionRate}
                          sx={{ width: 60, height: 6, borderRadius: 3 }}
                          color={course.completionRate >= 80 ? 'success' : 'warning'}
                        />
                        <Typography variant="caption" fontWeight={600}>
                          {course.completionRate}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700} color="primary.main">
                        {course.averageAssessmentScore}/100
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={course.status.toUpperCase()}
                        size="small"
                        color={course.status === 'active' ? 'success' : 'default'}
                        sx={{ fontSize: '0.65rem', height: 20 }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
