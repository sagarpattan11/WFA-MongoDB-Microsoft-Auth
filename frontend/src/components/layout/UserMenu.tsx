import {
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logoutUserSession } from '../../auth/webauthn.service';
import { logout } from '../../store/slices/authSlice';

export const UserMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    handleClose();
    navigate(path);
  };

  const handleSignOut = async () => {
    handleClose();
    try {
      await logoutUserSession();
    } catch {
      // Ignore network errors on logout
    }
    // Dispatch logout to clear session state in Redux
    dispatch(logout());
    // Redirect cleanly to login screen
    navigate('/login');
  };

  const displayName = user?.displayName || 'Enterprise User';
  const roleName = user?.roles?.[0] ? user.roles[0].toUpperCase() : 'EMPLOYEE';
  const initial = displayName.charAt(0).toUpperCase();
  const isOpen = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        size="small"
        aria-label="Open user profile menu"
        aria-controls={isOpen ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
        sx={{ ml: 1 }}
      >
        <Avatar
          src={user?.avatarUrl}
          sx={{ width: 34, height: 34, bgcolor: '#0F6CBD', fontSize: '0.9rem', fontWeight: 600 }}
        >
          {initial}
        </Avatar>
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 220, mt: 1, borderRadius: 2 },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600} noWrap>
            {displayName}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" noWrap>
            {user?.email || 'user@enterprise.com'}
          </Typography>
          <Box
            sx={{
              display: 'inline-block',
              mt: 0.5,
              px: 1,
              py: 0.2,
              borderRadius: 1,
              bgcolor: 'action.hover',
            }}
          >
            <Typography variant="caption" fontWeight={700} color="primary.main">
              {roleName}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <MenuItem onClick={() => handleNavigate('/profile')}>
          <ListItemIcon>
            <User size={18} />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>

        <MenuItem onClick={() => handleNavigate('/settings')}>
          <ListItemIcon>
            <Settings size={18} />
          </ListItemIcon>
          <ListItemText primary="Preferences & Passkeys" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleSignOut} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <LogOut size={18} />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </MenuItem>
      </Menu>
    </>
  );
};
