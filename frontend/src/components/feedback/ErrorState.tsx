import { AlertCircle, RefreshCw } from 'lucide-react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  minHeight?: string | number;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load content',
  message = 'An unexpected error occurred while fetching data from the server.',
  onRetry,
  minHeight = '320px',
}) => {
  return (
    <Box
      role="alert"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        minHeight,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: 'error.light',
          color: 'error.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <AlertCircle size={28} />
      </Box>

      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440, mb: onRetry ? 3 : 0 }}>
        {message}
      </Typography>

      {onRetry && (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshCw size={16} />}
          onClick={onRetry}
        >
          Retry Request
        </Button>
      )}
    </Box>
  );
};
