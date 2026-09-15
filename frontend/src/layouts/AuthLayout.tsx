import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { env } from '../config/env.config';

export const AuthLayout: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        {/* Brand Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            component="img"
            src="/Stackly_logo.png"
            alt="Stackly Logo"
            sx={{
              height: 56,
              maxWidth: 200,
              objectFit: 'contain',
              mb: 1.5,
            }}
          />
          <Typography variant="h4" component="h1" fontWeight={700} color="text.primary">
            Workforce Analytics Platform
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Enterprise Workforce Intelligence & Operational Governance
          </Typography>
        </Box>

        {/* Auth Content Card */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Outlet />
        </Paper>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Version {env.version} &bull; Protected by Enterprise Microsoft Entra ID Security
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
