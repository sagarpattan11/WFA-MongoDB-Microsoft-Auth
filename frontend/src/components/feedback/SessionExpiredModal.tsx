import { Lock } from 'lucide-react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SessionExpiredModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = () => {
      setOpen(true);
    };

    window.addEventListener('wfa:session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('wfa:session-expired', handleSessionExpired);
    };
  }, []);

  const handleSignIn = () => {
    setOpen(false);
    navigate('/login');
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="session-expired-title"
      aria-describedby="session-expired-description"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="session-expired-title" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: '50%',
            bgcolor: 'warning.light',
            color: 'warning.main',
            display: 'flex',
          }}
        >
          <Lock size={20} />
        </Box>
        Session Expired
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="session-expired-description">
          Your enterprise session has expired due to inactivity or token revocation. Please sign in again with Microsoft Entra ID to continue.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button variant="contained" fullWidth onClick={handleSignIn}>
          Sign In Again
        </Button>
      </DialogActions>
    </Dialog>
  );
};
