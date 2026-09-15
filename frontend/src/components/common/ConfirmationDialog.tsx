import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import React from 'react';

export type DialogVariant = 'confirm' | 'success' | 'error' | 'warning' | 'info';

export interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  variant?: DialogVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: 'primary' | 'error' | 'warning' | 'info' | 'success';
  hideCancel?: boolean;
  loading?: boolean;
  onConfirm?: () => void;
  onCancel: () => void;
  onClose?: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  variant = 'confirm',
  confirmLabel,
  cancelLabel = 'Cancel',
  confirmColor,
  hideCancel,
  loading = false,
  onConfirm,
  onCancel,
  onClose,
}) => {
  const handleClose = onClose || onCancel;
  const handleConfirm = onConfirm || handleClose;

  // Derive defaults based on variant
  const isFeedbackOnly = variant === 'success' || variant === 'error' || variant === 'info';
  const shouldHideCancel = hideCancel !== undefined ? hideCancel : isFeedbackOnly;

  const resolvedConfirmLabel =
    confirmLabel || (isFeedbackOnly ? 'OK' : variant === 'warning' ? 'Proceed' : 'Confirm');

  const resolvedColor =
    confirmColor ||
    (variant === 'success'
      ? 'success'
      : variant === 'error'
      ? 'error'
      : variant === 'warning'
      ? 'warning'
      : variant === 'info'
      ? 'info'
      : 'primary');

  const renderIcon = () => {
    switch (variant) {
      case 'success':
        return (
          <Box sx={{ color: 'success.main', display: 'flex', alignItems: 'center' }}>
            <CheckCircle2 size={24} />
          </Box>
        );
      case 'error':
        return (
          <Box sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}>
            <AlertCircle size={24} />
          </Box>
        );
      case 'warning':
        return (
          <Box sx={{ color: 'warning.main', display: 'flex', alignItems: 'center' }}>
            <AlertTriangle size={24} />
          </Box>
        );
      case 'info':
        return (
          <Box sx={{ color: 'info.main', display: 'flex', alignItems: 'center' }}>
            <Info size={24} />
          </Box>
        );
      default:
        if (resolvedColor === 'error') {
          return (
            <Box sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}>
              <AlertTriangle size={24} />
            </Box>
          );
        }
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 0.5,
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.16)',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1, fontWeight: 700 }}>
        {renderIcon()}
        <Typography variant="h6" component="span" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 1 }}>
        <DialogContentText
          sx={{
            color: 'text.primary',
            fontSize: '0.925rem',
            lineHeight: 1.5,
            whiteSpace: 'pre-line',
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1.5 }}>
        {!shouldHideCancel && (
          <Button onClick={onCancel} disabled={loading} color="inherit" sx={{ borderRadius: 1.5 }}>
            {cancelLabel}
          </Button>
        )}
        <Button
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
          color={resolvedColor}
          autoFocus
          sx={{ borderRadius: 1.5, minWidth: 80, fontWeight: 600 }}
        >
          {resolvedConfirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
