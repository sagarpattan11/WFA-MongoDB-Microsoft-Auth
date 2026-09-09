import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { PageShell } from '../../../components/layout/PageShell';

export const ProfilePage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <PageShell
      title="My Profile & Credentials"
      description="View enterprise identity profile, assigned RBAC permissions, and session credentials."
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar
                src={user?.avatarUrl}
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  fontWeight: 700,
                }}
              >
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </Avatar>

              <Typography variant="h6" fontWeight={700}>
                {user?.displayName || 'Enterprise User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || 'user@enterprise.com'}
              </Typography>

              <Chip
                label={user?.roles?.[0] ? user.roles[0].toUpperCase() : 'EMPLOYEE'}
                color="primary"
                size="small"
                sx={{ mt: 2, fontWeight: 600 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Identity & Access Rights
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Assigned enterprise roles and active permissions authenticated via Microsoft Entra ID.
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Assigned Roles:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {user?.roles?.map((role) => (
                  <Chip key={role} label={role} variant="outlined" />
                )) || <Chip label="Standard Employee" variant="outlined" />}
              </Box>

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Security Provider:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Microsoft Entra ID (Single Sign-On & Multi-Factor Authentication)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
};
