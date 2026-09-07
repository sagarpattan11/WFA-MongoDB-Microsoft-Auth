import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import React from 'react';
import { PageShell } from '../../../components/layout/PageShell';
import { useThemeContext } from '../../../theme/ThemeProvider';
import { ThemeMode } from '../../../theme/theme.types';

export const SettingsPage: React.FC = () => {
  const { mode, setThemeMode } = useThemeContext();

  return (
    <PageShell
      title="System Preferences & Integrations"
      description="Configure user interface theme preferences, notification delivery channels, and platform defaults."
    >
      <Card sx={{ maxWidth: 640 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Visual Appearance & Theme
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select your preferred visual appearance. Visual preferences are stored locally on your device.
          </Typography>

          <RadioGroup
            value={mode}
            onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
          >
            <FormControlLabel
              value="light"
              control={<Radio />}
              label="Light Mode (Crisp high-contrast theme)"
            />
            <FormControlLabel
              value="dark"
              control={<Radio />}
              label="Dark Mode (Slate night theme)"
            />
            <FormControlLabel
              value="system"
              control={<Radio />}
              label="System Default (Synchronize with OS theme)"
            />
          </RadioGroup>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight={600} gutterBottom>
            Enterprise Integration Status
          </Typography>
          <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
            <Typography variant="body2" fontWeight={500}>
              • Microsoft Entra ID SSO: Configured for Enterprise Single Sign-On
            </Typography>
            <Typography variant="body2" fontWeight={500} sx={{ mt: 1 }}>
              • MongoDB Cluster: Configured for Multi-Tenant Data Persistence
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </PageShell>
  );
};
