import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import React from 'react';

export interface KPICardShellProps {
  title: string;
  value?: string | number | null;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  subtitle?: string;
  loading?: boolean;
}

export const KPICardShell: React.FC<KPICardShellProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  subtitle,
  loading = false,
}) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'success.main';
    if (changeType === 'negative') return 'error.main';
    return 'text.secondary';
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: 'action.hover',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        {loading ? (
          <Box>
            <Skeleton variant="text" width="50%" height={40} />
            <Skeleton variant="text" width="70%" height={20} />
          </Box>
        ) : (
          <Box>
            <Typography variant="h4" component="div" fontWeight={700} sx={{ mb: 0.5 }}>
              {value !== undefined && value !== null ? value : '—'}
            </Typography>

            {(change || subtitle) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                {change && (
                  <Typography variant="caption" fontWeight={600} sx={{ color: getChangeColor() }}>
                    {change}
                  </Typography>
                )}
                {subtitle && (
                  <Typography variant="caption" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
