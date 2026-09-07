import { Home, ShieldAlert } from 'lucide-react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Forbidden403Props {
  requiredPermission?: string;
  requiredRole?: string;
}

export const Forbidden403: React.FC<Forbidden403Props> = ({
  requiredPermission,
  requiredRole,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        p: 3,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 5,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            bgcolor: 'warning.light',
            color: 'warning.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <ShieldAlert size={36} />
        </Box>

        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          403 - Access Denied
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          You do not have the necessary enterprise privileges to access this resource or perform this operation.
        </Typography>

        {(requiredRole || requiredPermission) && (
          <Box
            sx={{
              p: 1.5,
              mb: 3,
              bgcolor: 'action.hover',
              borderRadius: 1.5,
              display: 'inline-block',
            }}
          >
            <Typography variant="caption" color="text.secondary" fontFamily="monospace">
              Required: {requiredRole ? `Role [${requiredRole}]` : `Permission [${requiredPermission}]`}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button
            variant="contained"
            startIcon={<Home size={16} />}
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
