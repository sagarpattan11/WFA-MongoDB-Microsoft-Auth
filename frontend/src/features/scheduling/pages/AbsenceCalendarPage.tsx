import { Calendar } from 'lucide-react';
import React from 'react';
import { AppCard } from '../../../components/common/AppCard';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { PageShell } from '../../../components/layout/PageShell';

export const AbsenceCalendarPage: React.FC = () => {
  return (
    <PageShell
      title="Department Leave Calendar"
      description="Visual calendar matrix of team leaves, public holidays, and coverage availability."
    >
      <AppCard title="Department Vacation & Holiday Schedule">
        <EmptyState
          title="Leave Calendar Synchronizing"
          description="Interactive multi-department absence timeline and scheduled time-off records."
          icon={<Calendar size={32} />}
        />
      </AppCard>
    </PageShell>
  );
};
