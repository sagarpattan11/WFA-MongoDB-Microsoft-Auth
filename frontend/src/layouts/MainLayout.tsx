import React from 'react';
import { Outlet } from 'react-router-dom';
import { SessionExpiredModal } from '../components/feedback/SessionExpiredModal';
import { AppShell } from '../components/layout/AppShell';

export const MainLayout: React.FC = () => {
  return (
    <AppShell>
      <Outlet />
      <SessionExpiredModal />
    </AppShell>
  );
};
