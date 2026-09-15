import {
  Menu as MenuIcon,
  Moon,
  Sun,
} from 'lucide-react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { toggleMobileDrawer, toggleSidebar } from '../../store/slices/uiSlice';
import { useThemeContext } from '../../theme/ThemeProvider';
import { BreadcrumbNav } from './BreadcrumbNav';
import { NotificationMenu } from './NotificationMenu';
import { UserMenu } from './UserMenu';

// Standard Brand Color (#0F6CBD - Microsoft Fluent Brand Blue)
const STANDARD_NAVBAR_COLOR = '#0F6CBD';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { resolvedMode, toggleTheme } = useThemeContext();

  const isLightMode = resolvedMode === 'light';

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: isLightMode ? 'rgba(0, 0, 0, 0.08)' : 'divider',
        bgcolor: isLightMode ? STANDARD_NAVBAR_COLOR : 'background.paper',
        color: isLightMode ? '#ffffff' : 'text.primary',
        transition: 'background-color 0.25s ease, color 0.25s ease',
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 2, sm: 3 }, gap: 2 }}>
        {/* Sidebar Toggle: Desktop (Collapse) & Mobile (Drawer) */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Toggle navigation sidebar"
          onClick={() => {
            if (window.innerWidth < 900) {
              dispatch(toggleMobileDrawer());
            } else {
              dispatch(toggleSidebar());
            }
          }}
          sx={{
            color: isLightMode ? '#ffffff' : 'inherit',
            '&:hover': {
              bgcolor: isLightMode ? 'rgba(255, 255, 255, 0.12)' : undefined,
            },
          }}
        >
          <MenuIcon size={20} />
        </IconButton>

        {/* Dynamic Breadcrumbs */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, flex: 1 }}>
          <BreadcrumbNav isInverse={isLightMode} />
        </Box>

        <Box sx={{ flex: { xs: 1, md: 0 } }} />

        {/* Theme Toggle Button */}
        <Tooltip title={`Switch to ${isLightMode ? 'Dark' : 'Light'} Mode`}>
          <IconButton
            color="inherit"
            aria-label="Toggle visual theme"
            onClick={toggleTheme}
            sx={{
              color: isLightMode ? '#ffffff' : 'inherit',
              '&:hover': {
                bgcolor: isLightMode ? 'rgba(255, 255, 255, 0.12)' : undefined,
              },
            }}
          >
            {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
          </IconButton>
        </Tooltip>

        {/* Notifications Popover Menu */}
        <NotificationMenu isInverse={isLightMode} />

        {/* User Identity & Profile Menu */}
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
};
