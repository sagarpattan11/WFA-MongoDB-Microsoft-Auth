import { createTheme } from '@mui/material/styles';
import { designTokens } from './tokens';
import { typographyConfig } from './typography';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: designTokens.colors.primary[300],
      main: designTokens.colors.primary[500],
      dark: designTokens.colors.primary[700],
      contrastText: '#ffffff',
    },
    secondary: {
      light: designTokens.colors.secondary[300],
      main: designTokens.colors.secondary[400],
      dark: designTokens.colors.secondary[600],
      contrastText: '#0f172a',
    },
    success: {
      light: '#86efac',
      main: '#22c55e',
      dark: '#16a34a',
      contrastText: '#ffffff',
    },
    warning: {
      light: '#fde68a',
      main: '#f59e0b',
      dark: '#d97706',
      contrastText: '#0f172a',
    },
    error: {
      light: '#fca5a5',
      main: '#ef4444',
      dark: '#dc2626',
      contrastText: '#ffffff',
    },
    info: {
      light: '#7dd3fc',
      main: '#0ea5e9',
      dark: '#0284c7',
      contrastText: '#ffffff',
    },
    background: {
      default: designTokens.surfaces.dark.background,
      paper: designTokens.surfaces.dark.paper,
    },
    text: {
      primary: designTokens.surfaces.dark.textPrimary,
      secondary: designTokens.surfaces.dark.textSecondary,
    },
    divider: designTokens.surfaces.dark.border,
  },
  typography: typographyConfig,
  shape: {
    borderRadius: 8,
  },
  breakpoints: {
    values: designTokens.breakpoints.values,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.md,
          textTransform: 'none',
          fontWeight: designTokens.typography.fontWeight.medium,
          boxShadow: 'none',
          '&:focus-visible': {
            outline: `2px solid ${designTokens.colors.primary[400]}`,
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.lg,
          border: `1px solid ${designTokens.surfaces.dark.border}`,
          boxShadow: designTokens.shadows.dark[1],
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
