import { X } from 'lucide-react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import React from 'react';

export interface AppModalProps extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  onClose: () => void;
}

export const AppModal: React.FC<AppModalProps> = ({
  title,
  onClose,
  children,
  maxWidth = 'sm',
  fullWidth = true,
  ...rest
}) => {
  return (
    <Dialog onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth} {...rest}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 2,
        }}
      >
        <Typography variant="h6" component="div" fontWeight={600}>
          {title}
        </Typography>
        <IconButton aria-label="Close dialog" onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
};
