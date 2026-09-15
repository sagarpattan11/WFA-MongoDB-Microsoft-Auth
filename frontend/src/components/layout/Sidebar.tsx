import {
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { env } from '../../config/env.config';
import { APP_ROUTES, RouteMetadata } from '../../routes/route.config';
import { setMobileDrawerOpen, toggleSidebar } from '../../store/slices/uiSlice';

const SIDEBAR_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { sidebarCollapsed, mobileDrawerOpen } = useAppSelector((state) => state.ui);
  const user = useAppSelector((state) => state.auth.user);

  const navGroups: ('Core' | 'Workforce' | 'Operations' | 'Governance')[] = [
    'Core',
    'Workforce',
    'Operations',
    'Governance',
  ];

  const sidebarRoutes = APP_ROUTES.filter((route) => route.showInSidebar);

  const handleNavigate = (path: string) => {
    navigate(path);
    dispatch(setMobileDrawerOpen(false));
  };

  const renderNavList = (isMobile = false) => {
    const isCollapsed = !isMobile && sidebarCollapsed;

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Brand Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            px: isCollapsed ? 1 : 2.5,
            py: 2,
            minHeight: 64,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              overflow: 'hidden',
            }}
            onClick={() => handleNavigate('/dashboard')}
          >
            {/* Logo Icon */}
            <Box
              component="img"
              src="/Stackly_logo.png"
              alt="Stackly Logo"
              sx={{
                width: 36,
                height: 36,
                objectFit: 'contain',
                borderRadius: 1,
                flexShrink: 0,
              }}
            />

            {!isCollapsed && (
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="subtitle1" fontWeight={700} noWrap lineHeight={1.2}>
                  Workforce
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500} noWrap>
                  Analytics Platform
                </Typography>
              </Box>
            )}
          </Box>

          {isMobile && (
            <IconButton
              onClick={() => dispatch(setMobileDrawerOpen(false))}
              size="small"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </IconButton>
          )}
        </Box>

        <Divider />

        {/* User Role Badge Indicator */}
        {!isCollapsed && (
          <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'action.hover' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Current Access Role
            </Typography>
            <Chip
              label={user?.roles?.[0] ? user.roles[0].toUpperCase() : 'ENTERPRISE ACCESS'}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mt: 0.5, fontWeight: 600, fontSize: '0.7rem' }}
            />
          </Box>
        )}

        {/* Navigation Item Groups */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: isCollapsed ? 1 : 1.5, py: 1.5 }}>
          {navGroups.map((group) => {
            const groupRoutes = sidebarRoutes.filter((r) => r.navGroup === group);
            if (groupRoutes.length === 0) return null;

            return (
              <List
                key={group}
                component="nav"
                aria-labelledby={`nav-group-${group.toLowerCase()}`}
                sx={{ py: 0.5 }}
                subheader={
                  !isCollapsed ? (
                    <ListSubheader
                      id={`nav-group-${group.toLowerCase()}`}
                      disableSticky
                      sx={{
                        bgcolor: 'transparent',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'text.secondary',
                        lineHeight: '24px',
                        position: 'static',
                        px: 1,
                        mt: 1,
                        mb: 0.5,
                      }}
                    >
                      {group}
                    </ListSubheader>
                  ) : undefined
                }
              >
                {groupRoutes.map((route: RouteMetadata) => {
                  const isActive =
                    location.pathname === route.path ||
                    (route.path !== '/dashboard' && location.pathname.startsWith(route.path));
                  const Icon = route.icon;

                  const button = (
                    <ListItemButton
                      selected={isActive}
                      onClick={() => handleNavigate(route.path)}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        py: 1,
                        px: isCollapsed ? 1.5 : 2,
                        justifyContent: isCollapsed ? 'center' : 'initial',
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: '#ffffff',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                          '& .MuiListItemIcon-root': {
                            color: '#ffffff',
                          },
                        },
                      }}
                    >
                      {Icon && (
                        <ListItemIcon
                          sx={{
                            minWidth: isCollapsed ? 'auto' : 36,
                            color: isActive ? 'inherit' : 'text.secondary',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon size={18} />
                        </ListItemIcon>
                      )}
                      {!isCollapsed && (
                        <ListItemText
                          primary={route.breadcrumbLabel}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                            fontWeight: isActive ? 600 : 500,
                          }}
                        />
                      )}
                    </ListItemButton>
                  );

                  return (
                    <ListItem key={route.path} disablePadding>
                      {isCollapsed ? (
                        <Tooltip title={route.breadcrumbLabel} placement="right">
                          <Box sx={{ width: '100%' }}>{button}</Box>
                        </Tooltip>
                      ) : (
                        button
                      )}
                    </ListItem>
                  );
                })}
              </List>
            );
          })}
        </Box>

        <Divider />

        {/* Footer: Version & Collapse Control */}
        <Box
          sx={{
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
          }}
        >
          {!isCollapsed && (
            <Typography variant="caption" color="text.secondary">
              WFA Platform {env.version}
            </Typography>
          )}

          {!isMobile && (
            <IconButton
              size="small"
              onClick={() => dispatch(toggleSidebar())}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </IconButton>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: sidebarCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            borderRight: 1,
            borderColor: 'divider',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: 'hidden',
          },
        }}
      >
        {renderNavList(false)}
      </Drawer>

      {/* Mobile Swipeable Drawer */}
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={() => dispatch(setMobileDrawerOpen(false))}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {renderNavList(true)}
      </Drawer>
    </>
  );
};
