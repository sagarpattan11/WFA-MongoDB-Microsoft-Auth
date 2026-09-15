import {
  Bell,
  CheckCheck,
  Clock,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'security' | 'workforce' | 'analytics';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Passkey Security Alert',
    message: 'New WebAuthn / FIDO2 authenticator registered to your account.',
    time: '5 mins ago',
    read: false,
    type: 'security',
  },
  {
    id: 'notif-2',
    title: 'Personnel Directory Update',
    message: 'Alexander Wright and 9 team profiles synced with MongoDB Atlas.',
    time: '1 hour ago',
    read: false,
    type: 'workforce',
  },
  {
    id: 'notif-3',
    title: 'Workforce Attendance Report',
    message: 'Daily workforce shift adherence is currently tracking at 100%.',
    time: '3 hours ago',
    read: false,
    type: 'analytics',
  },
];

export const NotificationMenu: React.FC<{ isInverse?: boolean }> = ({ isInverse = false }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const open = Boolean(anchorEl);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'security':
        return <ShieldCheck size={18} color="#107C41" />;
      case 'workforce':
        return <UserCheck size={18} color="#0F6CBD" />;
      case 'analytics':
        return <TrendingUp size={18} color="#881798" />;
    }
  };

  return (
    <>
      <Tooltip title="View Notifications">
        <IconButton
          color="inherit"
          aria-label="View notifications"
          onClick={handleOpen}
          sx={{
            color: isInverse ? '#ffffff' : 'inherit',
            '&:hover': {
              bgcolor: isInverse ? 'rgba(255, 255, 255, 0.12)' : undefined,
            },
          }}
        >
          <Badge badgeContent={unreadCount} color="error" variant="dot">
            <Bell size={20} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 4,
          sx: {
            width: 360,
            maxWidth: '90vw',
            maxHeight: 480,
            borderRadius: 2.5,
            mt: 1.5,
            border: 1,
            borderColor: 'divider',
            overflow: 'hidden',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'action.hover',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Badge
                badgeContent={unreadCount}
                color="primary"
                sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}
              />
            )}
          </Box>
          {unreadCount > 0 && (
            <Button
              size="small"
              startIcon={<CheckCheck size={14} />}
              onClick={handleMarkAllAsRead}
              sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0.5 }}
            >
              Mark all read
            </Button>
          )}
        </Box>

        <Divider />

        {/* Notifications List */}
        <List sx={{ p: 0, maxHeight: 360, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
              <Bell size={28} style={{ opacity: 0.4, marginBottom: 8 }} />
              <Typography variant="body2">No notifications at this time.</Typography>
            </Box>
          ) : (
            notifications.map((notif, idx) => (
              <React.Fragment key={notif.id}>
                {idx > 0 && <Divider component="li" />}
                <ListItem
                  onClick={() => handleToggleRead(notif.id)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    bgcolor: notif.read ? 'transparent' : 'action.selected',
                    transition: 'background-color 0.2s ease',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                    {getIcon(notif.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={notif.read ? 500 : 700}
                          fontSize="0.85rem"
                        >
                          {notif.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                          <Clock size={11} />
                          <Typography variant="caption" fontSize="0.7rem">
                            {notif.time}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize="0.8rem"
                        lineHeight={1.3}
                      >
                        {notif.message}
                      </Typography>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))
          )}
        </List>
      </Menu>
    </>
  );
};
