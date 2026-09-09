import React from 'react';
import { useLocation } from 'react-router-dom';
import { APP_ROUTES } from '../../routes/route.config';
import { AppBreadcrumb, BreadcrumbItem } from '../common/AppBreadcrumb';

interface BreadcrumbNavProps {
  isInverse?: boolean;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ isInverse = false }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard')) {
    return null;
  }

  const items: BreadcrumbItem[] = pathnames.map((segment, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
    const matched = APP_ROUTES.find((r) => r.path === routeTo);

    return {
      label: matched ? matched.breadcrumbLabel : segment.charAt(0).toUpperCase() + segment.slice(1),
      path: index === pathnames.length - 1 ? undefined : routeTo,
    };
  });

  return <AppBreadcrumb items={items} isInverse={isInverse} />;
};
