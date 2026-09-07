import Alert, { AlertProps } from '@mui/material/Alert';
import Badge, { BadgeProps } from '@mui/material/Badge';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import React from 'react';

export const AppTooltip: React.FC<TooltipProps> = ({ arrow = true, children, ...rest }) => {
  return (
    <Tooltip arrow={arrow} {...rest}>
      {children}
    </Tooltip>
  );
};

export const AppBadge: React.FC<BadgeProps> = (props) => {
  return <Badge {...props} />;
};

export const AppAlert: React.FC<AlertProps> = (props) => {
  return <Alert variant="filled" {...props} />;
};
