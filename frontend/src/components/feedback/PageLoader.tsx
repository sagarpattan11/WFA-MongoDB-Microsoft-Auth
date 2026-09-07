import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import React from 'react';

interface PageLoaderProps {
  message?: string;
  minHeight?: string | number;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading workspace resources...',
  minHeight = '60vh',
}) => {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        p: 4,
        gap: 2,
      }}
    >
      <CircularProgress size={40} thickness={4} color="primary" />
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {message}
      </Typography>
    </Box>
  );
};
