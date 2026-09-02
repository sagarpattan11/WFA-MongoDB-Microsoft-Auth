import { ArrowLeft, User } from 'lucide-react';
import Button from '@mui/material/Button';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppCard } from '../../../components/common/AppCard';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { PageShell } from '../../../components/layout/PageShell';

export const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <PageShell
      title={`Employee Profile: ${id || ''}`}
      description="Detailed workforce record, employment lifecycle, shift schedule, and leave ledger."
      actions={
        <Button
          variant="outlined"
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/employees')}
        >
          Back to Directory
        </Button>
      }
    >
      <AppCard title="Personnel Record">
        <EmptyState
          title="Employee Profile Unavailable"
          description="Detailed employee profile telemetry and job records are loaded securely from the enterprise directory."
          icon={<User size={32} />}
        />
      </AppCard>
    </PageShell>
  );
};
