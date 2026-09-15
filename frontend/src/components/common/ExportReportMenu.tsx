import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Download } from 'lucide-react';
import { env } from '../../config/env.config';

export interface ExportReportMenuProps {
  module: 'workforce' | 'placement' | 'recruitment' | 'learning' | 'attrition' | 'forecasting' | 'executive' | 'performance';
  buttonLabel?: string;
  className?: string;
}

export const ExportReportMenu: React.FC<ExportReportMenuProps> = ({
  module,
  buttonLabel = 'Export Report',
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const url = `${env.apiUrl}/reports/export?module=${module}&format=csv`;

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Export request failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `wfa_${module}_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Failed to download CSV report:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={handleExportCSV}
      disabled={isExporting}
      startIcon={
        isExporting ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          <Download size={16} />
        )
      }
      sx={{
        textTransform: 'none',
        borderRadius: 2,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        height: 36,
      }}
    >
      {isExporting ? 'Exporting CSV...' : buttonLabel}
    </Button>
  );
};
