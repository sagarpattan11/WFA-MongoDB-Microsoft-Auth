import {
  Edit2,
  Fingerprint,
  Key,
  Trash2,
} from 'lucide-react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import {
  fetchUserCredentials,
  PasskeyCredentialInfo,
  renameUserCredential,
  revokeUserCredential,
} from '../../../auth/webauthn.service';
import { ConfirmationDialog } from '../../../components/common/ConfirmationDialog';
import { PageShell } from '../../../components/layout/PageShell';
import { useThemeContext } from '../../../theme/ThemeProvider';
import { ThemeMode } from '../../../theme/theme.types';

export const SettingsPage: React.FC = () => {
  const { mode, setThemeMode } = useThemeContext();
  const user = useAppSelector((state) => state.auth.user);

  const [credentials, setCredentials] = useState<PasskeyCredentialInfo[]>([]);
  const [loadingCredentials, setLoadingCredentials] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Rename Dialog State
  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
  const [selectedCred, setSelectedCred] = useState<PasskeyCredentialInfo | null>(null);
  const [newFriendlyName, setNewFriendlyName] = useState<string>('');

  // Revoke Dialog State
  const [revokeDialogOpen, setRevokeDialogOpen] = useState<boolean>(false);
  const [credToRevoke, setCredToRevoke] = useState<PasskeyCredentialInfo | null>(null);

  const loadCredentials = async () => {
    setLoadingCredentials(true);
    try {
      const data = await fetchUserCredentials();
      setCredentials(data);
    } catch {
      // If unauthenticated or no credentials, ignore gracefully
    } finally {
      setLoadingCredentials(false);
    }
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  const handleOpenRename = (cred: PasskeyCredentialInfo) => {
    setSelectedCred(cred);
    setNewFriendlyName(cred.friendlyName);
    setRenameDialogOpen(true);
  };

  const handleSaveRename = async () => {
    if (!selectedCred || !newFriendlyName.trim()) return;
    try {
      await renameUserCredential(selectedCred._id, newFriendlyName.trim());
      setSuccessMsg('Passkey renamed successfully.');
      setRenameDialogOpen(false);
      loadCredentials();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorMsg(errorObj.message || 'Failed to rename passkey.');
    }
  };

  const handleOpenRevoke = (cred: PasskeyCredentialInfo) => {
    setCredToRevoke(cred);
    setRevokeDialogOpen(true);
  };

  const handleConfirmRevoke = async () => {
    if (!credToRevoke) return;
    try {
      await revokeUserCredential(credToRevoke._id);
      setSuccessMsg('Passkey revoked.');
      setRevokeDialogOpen(false);
      loadCredentials();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorMsg(errorObj.message || 'Failed to revoke passkey.');
    }
  };

  return (
    <PageShell
      title="System Preferences & Passkey Security"
      description="Manage visual appearance, authentication credentials, and security devices."
    >
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      )}

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 760 }}>
        {/* Passkey & FIDO2 Security Devices */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Registered Passkeys & Security Keys
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Passwordless FIDO2 credentials registered to {user?.email || 'your account'}.
                </Typography>
              </Box>
            </Box>

            {loadingCredentials ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                  Loading security keys...
                </Typography>
              </Box>
            ) : credentials.length === 0 ? (
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'action.hover',
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Fingerprint size={32} style={{ opacity: 0.6, marginBottom: 8 }} />
                <Typography variant="body2" fontWeight={600}>
                  No Additional Passkeys Registered
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  You can register multiple devices (Windows Hello, Touch ID, or YubiKey).
                </Typography>
              </Box>
            ) : (
              <List sx={{ bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
                {credentials.map((cred, idx) => (
                  <React.Fragment key={cred._id}>
                    {idx > 0 && <Divider />}
                    <ListItem
                      secondaryAction={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenRename(cred)}
                            aria-label="Rename passkey"
                          >
                            <Edit2 size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenRevoke(cred)}
                            aria-label="Revoke passkey"
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemIcon>
                        <Key size={22} color="#0F6CBD" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" fontWeight={600}>
                            {cred.friendlyName}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            Registered on {new Date(cred.createdAt).toLocaleDateString()} • Last used:{' '}
                            {new Date(cred.lastUsedAt).toLocaleDateString()}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Visual Appearance & Theme */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Visual Appearance & Theme
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select your preferred visual appearance. Preferences are stored locally on your device.
            </Typography>

            <RadioGroup
              value={mode}
              onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
            >
              <FormControlLabel
                value="light"
                control={<Radio />}
                label="Light Mode (Standard enterprise high-contrast theme)"
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
              Platform Security Protocol
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={500}>
                • WebAuthn / Passkey Authentication: Active (FIDO2 Standard)
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ mt: 1 }}>
                • MongoDB Cluster Storage: Connected with Mongoose ODM
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Rename Passkey Modal */}
      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Rename Passkey</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Friendly Name"
            value={newFriendlyName}
            onChange={(e) => setNewFriendlyName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRenameDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveRename} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Revoke Confirmation Dialog */}
      <ConfirmationDialog
        open={revokeDialogOpen}
        title="Revoke Passkey"
        message={`Are you sure you want to revoke "${credToRevoke?.friendlyName}"? This device will no longer be able to sign in to your account.`}
        confirmLabel="Revoke Device"
        confirmColor="error"
        onConfirm={handleConfirmRevoke}
        onCancel={() => setRevokeDialogOpen(false)}
      />
    </PageShell>
  );
};
