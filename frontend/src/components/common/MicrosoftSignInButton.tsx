import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { getMicrosoftAuthConfig } from '../../auth/auth.config';

export interface MicrosoftSignInButtonProps extends Omit<ButtonProps, 'onClick'> {
  loading?: boolean;
  onInitiateSignIn?: () => void;
}

export const MicrosoftSignInButton: React.FC<MicrosoftSignInButtonProps> = ({
  loading = false,
  onInitiateSignIn,
  disabled,
  ...rest
}) => {
  const authConfig = getMicrosoftAuthConfig();
  const isActionDisabled = disabled || loading || !authConfig.isConfigured;

  const handleSignIn = () => {
    if (!authConfig.isConfigured) return;

    if (onInitiateSignIn) {
      onInitiateSignIn();
      return;
    }

    // Direct redirect to backend OAuth initiation endpoint
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/auth/microsoft/login`;
  };

  const buttonContent = (
    <Button
      variant="outlined"
      fullWidth
      size="large"
      disabled={isActionDisabled}
      onClick={handleSignIn}
      startIcon={
        loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <Box
            component="svg"
            viewBox="0 0 21 21"
            sx={{ width: 20, height: 20, mr: 0.5 }}
          >
            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
          </Box>
        )
      }
      sx={{
        py: 1.5,
        fontWeight: 600,
        fontSize: '0.95rem',
        textTransform: 'none',
        borderColor: 'divider',
        color: 'text.primary',
        bgcolor: 'background.paper',
        '&:hover': {
          bgcolor: 'action.hover',
          borderColor: 'text.secondary',
        },
      }}
      {...rest}
    >
      {loading ? 'Connecting to Microsoft...' : 'Sign in with Microsoft'}
    </Button>
  );

  if (!authConfig.isConfigured) {
    return (
      <Tooltip title="Microsoft Entra ID integration is in standby mode. Environment credentials required.">
        <span>{buttonContent}</span>
      </Tooltip>
    );
  }

  return buttonContent;
};
