import { RefreshCw, ServerCrash } from 'lucide-react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React from 'react';

export const ServerError500: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
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
            bgcolor: 'error.light',
            color: 'error.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <ServerCrash size={36} />
        </Box>

        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          500 - Server Exception
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The server encountered an unexpected internal condition that prevented it from fulfilling the request.
        </Typography>

        <Button
          variant="contained"
          startIcon={<RefreshCw size={16} />}
          onClick={onRetry || (() => window.location.reload())}
        >
          Retry Request
        </Button>
      </Paper>
    </Box>
  );
};
