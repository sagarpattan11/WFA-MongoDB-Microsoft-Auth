import { ArrowRight, Shield } from 'lucide-react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getMicrosoftAuthConfig } from '../../../auth/auth.config';
import { MicrosoftSignInButton } from '../../../components/common/MicrosoftSignInButton';

export const LoginPage: React.FC = () => {
  const authConfig = getMicrosoftAuthConfig();
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>
        Enterprise Single Sign-On
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Access the Workforce Analytics Platform using your official Microsoft corporate account.
      </Typography>

      {!authConfig.isConfigured ? (
        <Alert severity="info" sx={{ mb: 3, textAlign: 'left', borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Microsoft Entra ID Standby Mode
          </Typography>
          <Typography variant="caption" display="block">
            Microsoft Entra ID credentials are in standby mode. You can explore the application workspace and layout modules.
          </Typography>
        </Alert>
      ) : null}

      <Box sx={{ my: 2 }}>
        <MicrosoftSignInButton />
      </Box>

      {!authConfig.isConfigured && (
        <Box sx={{ mt: 2, mb: 1 }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            endIcon={<ArrowRight size={18} />}
            onClick={() => navigate('/dashboard')}
            sx={{
              bgcolor: '#0F6CBD',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.2,
              '&:hover': { bgcolor: '#0b5291' },
            }}
          >
            Enter Dashboard Workspace
          </Button>
        </Box>
      )}

      <Divider sx={{ my: 3 }}>
        <Typography variant="caption" color="text.secondary">
          SECURITY PROTOCOL
        </Typography>
      </Divider>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'text.secondary' }}>
        <Shield size={16} />
        <Typography variant="caption">
          Protected by Microsoft Entra ID Conditional Access & MFA
        </Typography>
      </Box>
    </Box>
  );
};
