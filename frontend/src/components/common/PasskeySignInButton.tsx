import { Fingerprint } from 'lucide-react';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

export interface PasskeySignInButtonProps extends ButtonProps {
  loading?: boolean;
}

export const PasskeySignInButton: React.FC<PasskeySignInButtonProps> = ({
  loading = false,
  disabled,
  onClick,
  sx,
  ...props
}) => {
  return (
    <Button
      variant="contained"
      fullWidth
      size="large"
      disabled={disabled || loading}
      onClick={onClick}
      startIcon={
        loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <Fingerprint size={20} />
        )
      }
      sx={{
        bgcolor: '#0F6CBD',
        color: '#ffffff',
        py: 1.3,
        fontSize: '0.95rem',
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: 2,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          bgcolor: '#0b5291',
        },
        ...sx,
      }}
      {...props}
    >
      {loading ? 'Authenticating Passkey...' : 'Sign in with Passkey'}
    </Button>
  );
};
