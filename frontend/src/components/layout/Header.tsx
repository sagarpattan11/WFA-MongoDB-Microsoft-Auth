import {
  Bell,
  Menu as MenuIcon,
  Moon,
  Search,
  Sun,
} from 'lucide-react';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { toggleMobileDrawer, toggleSidebar } from '../../store/slices/uiSlice';
import { useThemeContext } from '../../theme/ThemeProvider';
import { BreadcrumbNav } from './BreadcrumbNav';
import { UserMenu } from './UserMenu';

// Standard Brand Color (#0F6CBD - Microsoft Fluent Brand Blue)
const STANDARD_NAVBAR_COLOR = '#0F6CBD';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { resolvedMode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();

  const isLightMode = resolvedMode === 'light';

  const handleSearchClick = () => {
    // Placeholder trigger for global search
  };

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

        {/* Global Search Bar Placeholder */}
        <Paper
          component="form"
          onClick={handleSearchClick}
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            width: { sm: 220, md: 280 },
            px: 1.5,
            py: 0.5,
            bgcolor: isLightMode ? 'rgba(255, 255, 255, 0.15)' : 'action.hover',
            borderRadius: 2,
            border: 1,
            borderColor: isLightMode ? 'rgba(255, 255, 255, 0.25)' : 'divider',
            boxShadow: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: isLightMode ? 'rgba(255, 255, 255, 0.22)' : 'action.selected',
            },
          }}
        >
          <Search
            size={16}
            style={{
              opacity: isLightMode ? 0.9 : 0.6,
              marginRight: 8,
              color: isLightMode ? '#ffffff' : 'inherit',
            }}
          />
          <InputBase
            placeholder="Search employees, shifts, reports..."
            disabled
            sx={{
              fontSize: '0.875rem',
              width: '100%',
              cursor: 'pointer',
              color: isLightMode ? '#ffffff' : 'inherit',
              '& .MuiInputBase-input::placeholder': {
                color: isLightMode ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                opacity: 1,
              },
            }}
          />
        </Paper>

        <Box sx={{ flex: { xs: 1, md: 0 } }} />

        {/* Theme Toggle Button */}
        <Tooltip title={`Switch to ${isLightMode ? 'Dark' : 'Light'} Mode`}>
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            aria-label="Toggle theme mode"
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

        {/* Notification Bell */}
        <Tooltip title="Notifications">
          <IconButton
            color="inherit"
            aria-label="View notifications"
            onClick={() => navigate('/notifications')}
            sx={{
              color: isLightMode ? '#ffffff' : 'inherit',
              '&:hover': {
                bgcolor: isLightMode ? 'rgba(255, 255, 255, 0.12)' : undefined,
              },
            }}
          >
            <Badge
              badgeContent={3}
              sx={{
                '& .MuiBadge-badge': {
                  bgcolor: isLightMode ? '#ef4444' : 'error.main',
                  color: '#ffffff',
                },
              }}
            >
              <Bell size={20} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Profile Avatar & Dropdown */}
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
};
