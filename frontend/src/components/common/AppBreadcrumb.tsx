import { ChevronRight, Home } from 'lucide-react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface AppBreadcrumbProps {
  items: BreadcrumbItem[];
  isInverse?: boolean;
}

export const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({ items, isInverse = false }) => {
  const linkColor = isInverse ? 'rgba(255, 255, 255, 0.85)' : 'inherit';
  const activeColor = isInverse ? '#ffffff' : 'text.primary';
  const separatorColor = isInverse ? 'rgba(255, 255, 255, 0.6)' : 'inherit';

  return (
    <Breadcrumbs
      separator={<ChevronRight size={14} color={isInverse ? 'rgba(255, 255, 255, 0.7)' : undefined} />}
      aria-label="breadcrumb navigation"
      sx={{
        '& .MuiBreadcrumbs-separator': {
          color: separatorColor,
        },
      }}
    >
      <Link
        component={RouterLink}
        to="/dashboard"
        color={linkColor}
        underline="hover"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        <Home size={14} />
        Home
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (isLast || !item.path) {
          return (
            <Typography
              key={index}
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: activeColor,
              }}
              aria-current={isLast ? 'page' : undefined}
            >
              {item.label}
            </Typography>
          );
        }

        return (
          <Link
            key={index}
            component={RouterLink}
            to={item.path}
            color={linkColor}
            underline="hover"
            sx={{ fontSize: '0.875rem', fontWeight: 500 }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};
