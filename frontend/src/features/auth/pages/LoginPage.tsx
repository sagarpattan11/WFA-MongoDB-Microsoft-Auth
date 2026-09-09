import {
  AlertCircle,
  Fingerprint,
  KeyRound,
  Shield,
  UserPlus,
} from 'lucide-react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { UserRole } from '../../../auth/auth.types';
import { checkWebAuthnCapability, loginWithPasskey, registerWithPasskey } from '../../../auth/webauthn.service';
import { setAuthenticatedUser } from '../../../store/slices/authSlice';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<number>(0); // 0 = Login, 1 = Register
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('hr_manager');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [webAuthnSupported, setWebAuthnSupported] = useState<boolean>(true);

  useEffect(() => {
    checkWebAuthnCapability().then(({ supported }) => {
      setWebAuthnSupported(supported);
    });
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const user = await loginWithPasskey(username.trim() || undefined);
      dispatch(
        setAuthenticatedUser({
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          roles: (user.roles as UserRole[]) || ['employee'],
        })
      );
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Passkey login failure:', err);
      const errorObj = err as { name?: string; message?: string; response?: { data?: { error?: { message?: string } } } };
      if (errorObj.name === 'NotAllowedError') {
        setErrorMsg('Passkey authentication was cancelled or timed out.');
      } else {
        setErrorMsg(
          errorObj.response?.data?.error?.message ||
            errorObj.message ||
            'Passkey verification failed. Ensure your security key or biometric is registered.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!username.trim() || !email.trim()) {
      setErrorMsg('Please provide a username and corporate email address.');
      return;
    }

    setLoading(true);

    try {
      const user = await registerWithPasskey(
        username.trim(),
        email.trim(),
        displayName.trim() || undefined,
        undefined,
        selectedRole
      );

      dispatch(
        setAuthenticatedUser({
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          roles: (user.roles as UserRole[]) || ['employee'],
        })
      );

      setSuccessMsg('Passkey registered successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (err: unknown) {
      console.error('Passkey registration failure:', err);
      const errorObj = err as { name?: string; message?: string; response?: { data?: { error?: { message?: string } } } };
      if (errorObj.name === 'NotAllowedError') {
        setErrorMsg('Registration prompt was cancelled.');
      } else {
        setErrorMsg(
          errorObj.response?.data?.error?.message ||
            errorObj.message ||
            'Failed to register passkey. Ensure your browser or device supports WebAuthn.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 440, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" fontWeight={700} gutterBottom>
          Passwordless Passkey Access
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Authenticate securely using Windows Hello, Touch ID, Face ID, or FIDO2 Hardware Security Keys.
        </Typography>
      </Box>

      {!webAuthnSupported && (
        <Alert severity="warning" icon={<AlertCircle size={20} />} sx={{ mb: 3, textAlign: 'left' }}>
          Your browser does not support standard WebAuthn/Passkeys. Please use a modern browser (Chrome, Edge, Safari, Firefox).
        </Alert>
      )}

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2.5, textAlign: 'left' }} onClose={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      )}

      {successMsg && (
        <Alert severity="success" sx={{ mb: 2.5, textAlign: 'left' }}>
          {successMsg}
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onChange={(_, val) => {
          setActiveTab(val);
          setErrorMsg(null);
        }}
        variant="fullWidth"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab icon={<KeyRound size={18} />} iconPosition="start" label="Sign In" />
        <Tab icon={<UserPlus size={18} />} iconPosition="start" label="Register Passkey" />
      </Tabs>

      {activeTab === 0 ? (
        /* Login Tab */
        <Box component="form" onSubmit={handleLogin}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Optional: Enter your username/email, or click below for instant discoverable passkey login.
          </Typography>

          <TextField
            fullWidth
            size="small"
            label="Username or Email (Optional)"
            placeholder="e.g. alexander.wright or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            sx={{ mb: 2.5 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !webAuthnSupported}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : <Fingerprint size={22} />
            }
            sx={{
              bgcolor: '#0F6CBD',
              py: 1.3,
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': { bgcolor: '#0b5291' },
            }}
          >
            {loading ? 'Verifying Biometric / Security Key...' : 'Sign In with Passkey / Security Key'}
          </Button>
        </Box>
      ) : (
        /* Registration Tab */
        <Box component="form" onSubmit={handleRegister}>
          <TextField
            fullWidth
            required
            size="small"
            label="Corporate Username"
            placeholder="e.g. hr.manager or your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            required
            type="email"
            size="small"
            label="Corporate Email"
            placeholder="e.g. hr@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            label="Full Name (Display Name)"
            placeholder="e.g. Sarah Jenkins (HR Lead)"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
            <InputLabel id="role-select-label">Select Workspace Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={selectedRole}
              label="Select Workspace Role"
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="hr_manager">HR Manager (Full Workforce & Skill Analytics)</MenuItem>
              <MenuItem value="admin">System Admin (Full Access & Settings)</MenuItem>
              <MenuItem value="executive">Executive / VP (Strategic Analytics)</MenuItem>
              <MenuItem value="dept_manager">Department Manager (Team Analytics)</MenuItem>
              <MenuItem value="team_lead">Team Lead (Operational Visibility)</MenuItem>
              <MenuItem value="employee">Employee (Self-Service View)</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !webAuthnSupported}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : <Shield size={20} />
            }
            sx={{
              bgcolor: '#198754',
              py: 1.3,
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': { bgcolor: '#157347' },
            }}
          >
            {loading ? 'Registering Credential...' : 'Create & Register Passkey'}
          </Button>
        </Box>
      )}

      <Divider sx={{ my: 3 }}>
        <Typography variant="caption" color="text.secondary">
          FIDO2 & WEBAUTHN STANDARD
        </Typography>
      </Divider>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          color: 'text.secondary',
        }}
      >
        <Shield size={16} />
        <Typography variant="caption">
          Private keys never leave your device. Cryptographically verified by MongoDB backend.
        </Typography>
      </Box>
    </Box>
  );
};
