import Box from '@mui/material/Box';
import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main App Container */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0, // Prevents horizontal flex overflow
          minHeight: '100vh',
        }}
      >
        {/* Top Header */}
        <Header />

        {/* Viewport Content Area */}
        <Box sx={{ flex: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
};
