import { X } from 'lucide-react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import React from 'react';

export interface AppDrawerProps extends Omit<DrawerProps, 'title'> {
  title?: React.ReactNode;
  onClose: () => void;
  width?: number | string;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({
  title,
  onClose,
  children,
  width = 360,
  open,
  anchor = 'right',
  ...rest
}) => {
  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width, maxWidth: '100%' },
      }}
      {...rest}
    >
      {title && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
            <IconButton onClick={onClose} size="small" aria-label="Close drawer">
              <X size={20} />
            </IconButton>
          </Box>
          <Divider />
        </>
      )}
      <Box sx={{ p: 2, overflowY: 'auto', flex: 1 }}>{children}</Box>
    </Drawer>
  );
};
