import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React from 'react';
import { EmptyState } from '../feedback/EmptyState';
import { ErrorState } from '../feedback/ErrorState';
import { PageLoader } from '../feedback/PageLoader';
import { BreadcrumbNav } from './BreadcrumbNav';

export interface PageShellProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry?: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export const PageShell: React.FC<PageShellProps> = ({
  title,
  description,
  actions,
  children,
  loading = false,
  error = null,
  empty = false,
  emptyTitle,
  emptyDescription,
  onRetry,
  maxWidth = 'xl',
}) => {
  return (
    <Container maxWidth={maxWidth} sx={{ py: { xs: 2.5, sm: 3.5 }, px: { xs: 2, sm: 3 } }}>
      {/* Dynamic Breadcrumb Trail */}
      <BreadcrumbNav />

      {/* Header / Title / Action Area */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3.5,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} color="text.primary">
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          )}
        </Box>

        {actions && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            {actions}
          </Box>
        )}
      </Box>

      {/* State-aware Content Area */}
      {loading ? (
        <PageLoader minHeight="400px" />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} minHeight="400px" />
      ) : empty ? (
        <EmptyState title={emptyTitle} description={emptyDescription} minHeight="400px" />
      ) : (
        <Box>{children}</Box>
      )}
    </Container>
  );
};
