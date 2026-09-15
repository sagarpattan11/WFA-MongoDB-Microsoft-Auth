import {
  ArrowLeft,
  Building,
  Calendar,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from 'lucide-react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';
import { PageShell } from '../../../components/layout/PageShell';
import { EmployeeRow } from './EmployeesPage';

export const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<EmployeeRow | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiClient
      .get(API_ENDPOINTS.EMPLOYEES.DETAIL(id))
      .then((res) => {
        setEmployee(res.data.data);
      })
      .catch((err) => {
        setErrorMsg(err.response?.data?.error?.message || 'Failed to load employee record.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <PageShell title="Loading Employee..." description="Fetching profile dossier">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </PageShell>
    );
  }

  if (errorMsg || !employee) {
    return (
      <PageShell title="Employee Record" description="Personnel profile view">
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg || 'Employee record could not be found.'}
        </Alert>
        <Button startIcon={<ArrowLeft size={16} />} onClick={() => navigate('/employees')}>
          Back to Directory
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={`${employee.firstName} ${employee.lastName}`}
      description={`Personnel ID: ${employee.employeeId} • ${employee.jobTitle}`}
      actions={
        <Button
          variant="outlined"
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/employees')}
        >
          Back to Directory
        </Button>
      }
    >
      <Grid container spacing={3}>
        {/* Left Column: Primary Overview Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: '#0F6CBD',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 700,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                {employee.firstName.charAt(0)}
                {employee.lastName.charAt(0)}
              </Box>

              <Typography variant="h6" fontWeight={700}>
                {employee.firstName} {employee.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {employee.jobTitle}
              </Typography>

              <Chip
                label={employee.status.toUpperCase()}
                color={
                  employee.status === 'active'
                    ? 'success'
                    : employee.status === 'on-leave'
                    ? 'warning'
                    : 'default'
                }
                size="small"
                sx={{ mt: 1, fontWeight: 600 }}
              />

              <Divider sx={{ my: 2.5 }} />

              <Box sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Mail size={16} color="#666" />
                  <Typography variant="body2">{employee.email}</Typography>
                </Box>
                {employee.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Phone size={16} color="#666" />
                    <Typography variant="body2">{employee.phone}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <MapPin size={16} color="#666" />
                  <Typography variant="body2">{employee.location}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Organizational & Employment Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Organizational & Employment Dossier
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Building size={20} color="#0F6CBD" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Department
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {employee.departmentId?.name || 'Unassigned'} (
                        {employee.departmentId?.code || '—'})
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <User size={20} color="#0F6CBD" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Assigned Team
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {employee.teamId?.name || 'Unassigned'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Shield size={20} color="#0F6CBD" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Employment Type
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {employee.employmentType}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Calendar size={20} color="#0F6CBD" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Hire Date
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {new Date(employee.hireDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {employee.salary !== undefined && employee.salary > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <DollarSign size={20} color="#0F6CBD" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Annual Compensation
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          ${employee.salary.toLocaleString()} / year
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
};
