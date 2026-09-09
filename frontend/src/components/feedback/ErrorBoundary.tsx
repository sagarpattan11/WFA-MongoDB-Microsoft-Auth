import { AlertTriangle, RefreshCw } from 'lucide-react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React component tree:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3,
            bgcolor: 'background.default',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 540,
              width: '100%',
              textAlign: 'center',
              borderRadius: 3,
              border: 1,
              borderColor: 'error.light',
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'error.light',
                color: 'error.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <AlertTriangle size={32} />
            </Box>

            <Typography variant="h5" component="h1" gutterBottom fontWeight={600}>
              Application Encountered an Error
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              An unexpected fault occurred in the user interface. You can try refreshing the page or restarting the session.
            </Typography>

            {this.state.error && process.env.NODE_ENV === 'development' && (
              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  textAlign: 'left',
                  overflow: 'auto',
                  maxHeight: 160,
                }}
              >
                <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', m: 0 }}>
                  {this.state.error.message}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={this.handleReset}
                sx={{ minWidth: 120 }}
              >
                Try Again
              </Button>
              <Button
                variant="contained"
                startIcon={<RefreshCw size={16} />}
                onClick={this.handleReload}
                sx={{ minWidth: 120 }}
              >
                Reload Page
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
