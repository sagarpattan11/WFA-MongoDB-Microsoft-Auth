import { createTheme } from '@mui/material/styles';
import { designTokens } from './tokens';
import { typographyConfig } from './typography';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      light: designTokens.colors.primary[400],
      main: designTokens.colors.primary[600],
      dark: designTokens.colors.primary[800],
      contrastText: '#ffffff',
    },
    secondary: {
      light: designTokens.colors.secondary[400],
      main: designTokens.colors.secondary[500],
      dark: designTokens.colors.secondary[700],
      contrastText: '#ffffff',
    },
    success: designTokens.colors.success,
    warning: designTokens.colors.warning,
    error: designTokens.colors.error,
    info: designTokens.colors.info,
    background: {
      default: designTokens.surfaces.light.background,
      paper: designTokens.surfaces.light.paper,
    },
    text: {
      primary: designTokens.surfaces.light.textPrimary,
      secondary: designTokens.surfaces.light.textSecondary,
    },
    divider: designTokens.surfaces.light.border,
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
            outline: `2px solid ${designTokens.colors.primary[500]}`,
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.lg,
          border: `1px solid ${designTokens.surfaces.light.border}`,
          boxShadow: designTokens.shadows.light[1],
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
