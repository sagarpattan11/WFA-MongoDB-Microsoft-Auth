import CircularProgress from '@mui/material/CircularProgress';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';

export interface AppIconButtonProps extends IconButtonProps {
  tooltip?: string;
  loading?: boolean;
}

export const AppIconButton: React.FC<AppIconButtonProps> = ({
  children,
  tooltip,
  loading = false,
  disabled,
  ...rest
}) => {
  const button = (
    <IconButton disabled={disabled || loading} {...rest}>
      {loading ? <CircularProgress size={18} color="inherit" /> : children}
    </IconButton>
  );

  if (tooltip && !disabled) {
    return <Tooltip title={tooltip}>{button}</Tooltip>;
  }

  return button;
};
