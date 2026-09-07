import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

export interface AppButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  loading = false,
  loadingText,
  disabled,
  startIcon,
  ...rest
}) => {
  return (
    <Button
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
      {...rest}
    >
      {loading ? (loadingText || children) : children}
    </Button>
  );
};
