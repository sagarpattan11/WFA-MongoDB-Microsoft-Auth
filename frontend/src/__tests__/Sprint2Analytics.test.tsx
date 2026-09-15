import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { store } from '../app/store';
import { PlacementAnalyticsPage } from '../features/placement/pages/PlacementAnalyticsPage';
import { RecruitmentAnalyticsPage } from '../features/recruitment/pages/RecruitmentAnalyticsPage';
import { LearningAnalyticsPage } from '../features/learning/pages/LearningAnalyticsPage';
import { ExportReportMenu } from '../components/common/ExportReportMenu';
import { AppThemeProvider } from '../theme/ThemeProvider';

describe('Sprint 2 Analytics Modules', () => {
  it('renders Placement Analytics Page with KPIs, Funnel, and Directory headers', () => {
    render(
      <Provider store={store}>
        <AppThemeProvider>
          <BrowserRouter>
            <PlacementAnalyticsPage />
          </BrowserRouter>
        </AppThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/Placement & Deployment Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Talent Pool/i)).toBeInTheDocument();
    expect(screen.getByText(/Placement Success Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg Placement Velocity/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg Placed Compensation/i)).toBeInTheDocument();
    expect(screen.getByText(/Candidate Placement Directory/i)).toBeInTheDocument();
  });

  it('renders Recruitment Analytics Page with KPIs, Channels, and Tab options', () => {
    render(
      <Provider store={store}>
        <AppThemeProvider>
          <BrowserRouter>
            <RecruitmentAnalyticsPage />
          </BrowserRouter>
        </AppThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/Recruitment & Talent Acquisition Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Positions/i)).toBeInTheDocument();
    expect(screen.getByText(/Applications In Flow/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg Time-To-Hire/i)).toBeInTheDocument();
    expect(screen.getByText(/Offer Acceptance/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Job Openings/i)).toBeInTheDocument();
  });

  it('renders Learning Analytics Page with KPIs, Skill Gains, and Enrollment directory', () => {
    render(
      <Provider store={store}>
        <AppThemeProvider>
          <BrowserRouter>
            <LearningAnalyticsPage />
          </BrowserRouter>
        </AppThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/Learning & Upskilling Effectiveness Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Enrollments/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg Assessment Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Issued Certifications/i)).toBeInTheDocument();
    expect(screen.getByText(/Effectiveness Index/i)).toBeInTheDocument();
    expect(screen.getByText(/Employee Course Enrollments & Credential Records/i)).toBeInTheDocument();
  });

  it('renders ExportReportMenu with Material-UI download action', () => {
    render(
      <Provider store={store}>
        <AppThemeProvider>
          <ExportReportMenu module="workforce" buttonLabel="Export Data" />
        </AppThemeProvider>
      </Provider>
    );

    const exportBtn = screen.getByRole('button', { name: /Export Data/i });
    expect(exportBtn).toBeInTheDocument();
  });
});
