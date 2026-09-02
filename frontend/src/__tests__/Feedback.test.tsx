import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { EmptyState } from '../components/feedback/EmptyState';
import { ErrorBoundary } from '../components/feedback/ErrorBoundary';
import { Forbidden403 } from '../components/feedback/Forbidden403';
import { NotFound404 } from '../components/feedback/NotFound404';
import { PageLoader } from '../components/feedback/PageLoader';

const BuggyComponent = () => {
  throw new Error('Test explosive component fault');
};

describe('Feedback Components', () => {
  it('PageLoader renders with accessible status role', () => {
    render(<PageLoader message="Loading test assets..." />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading test assets...')).toBeInTheDocument();
  });

  it('EmptyState renders custom title and description', () => {
    render(
      <EmptyState
        title="Custom Empty Title"
        description="Custom Empty Description"
        actionLabel="Add Item"
        onAction={() => {}}
      />
    );

    expect(screen.getByText('Custom Empty Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Empty Description')).toBeInTheDocument();
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('Forbidden403 renders access denied screen with recovery action', () => {
    render(
      <BrowserRouter>
        <Forbidden403 requiredRole="admin" />
      </BrowserRouter>
    );

    expect(screen.getByText(/403 - Access Denied/i)).toBeInTheDocument();
    expect(screen.getByText(/Required: Role \[admin\]/i)).toBeInTheDocument();
    expect(screen.getByText(/Return to Dashboard/i)).toBeInTheDocument();
  });

  it('NotFound404 renders 404 page with navigation options', () => {
    render(
      <BrowserRouter>
        <NotFound404 />
      </BrowserRouter>
    );

    expect(screen.getByText(/404 - Page Not Found/i)).toBeInTheDocument();
    expect(screen.getByText(/Go to Dashboard/i)).toBeInTheDocument();
  });

  it('ErrorBoundary catches child error and renders fallback instead of crashing', () => {
    const originalError = console.error;
    console.error = () => {};

    render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Application Encountered an Error/i)).toBeInTheDocument();
    expect(screen.getByText(/Reload Page/i)).toBeInTheDocument();

    console.error = originalError;
  });
});
