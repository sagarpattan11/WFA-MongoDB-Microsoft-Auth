import Card, { CardProps } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader, { CardHeaderProps } from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import React from 'react';

export interface AppCardProps extends Omit<CardProps, 'title'> {
  title?: React.ReactNode;
  subheader?: React.ReactNode;
  action?: React.ReactNode;
  headerProps?: CardHeaderProps;
  noPadding?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({
  title,
  subheader,
  action,
  children,
  headerProps,
  noPadding = false,
  ...rest
}) => {
  const hasHeader = title || subheader || action;

  return (
    <Card {...rest}>
      {hasHeader && (
        <>
          <CardHeader
            title={title}
            subheader={subheader}
            action={action}
            titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            subheaderTypographyProps={{ variant: 'caption' }}
            {...headerProps}
          />
          <Divider />
        </>
      )}
      {noPadding ? children : <CardContent>{children}</CardContent>}
    </Card>
  );
};
