import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { store } from '../app/store';
import { AttritionPredictionPage } from '../features/attrition/pages/AttritionPredictionPage';
import { WorkforceForecastingPage } from '../features/forecasting/pages/WorkforceForecastingPage';
import { ExecutiveCockpitPage } from '../features/executive/pages/ExecutiveCockpitPage';
import { AnalyticsPage } from '../features/analytics/pages/AnalyticsPage';
import { AuditLogsPage } from '../features/audit/pages/AuditLogsPage';
import { AppThemeProvider } from '../theme/ThemeProvider';

describe('Sprint 3 Analytics & Executive Modules', () => {
  it('renders Attrition Prediction Page with KPIs, Risk Distribution, Drivers, and Employee Roster', () => {
    render(
      <Provider store={store}>
        <AppThemeProvider>
          <BrowserRouter>
            <AttritionPredictionPage />
          </BrowserRouter>
        </AppThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/Attrition Prediction & Flight Risk/i)).toBeInTheDocument();
    expect(screen.getByText(/Average Flight Risk/i)).toBeInTheDocument();
    expect(screen.getByText(/High & Critical Flight Risk/i)).toBeInTheDocument();
    expect(screen.getByText(/Replacement Exposure/i)).toBeInTheDocument();
    expect(screen.getByText(/Retention Strategy ROI/i)).toBeInTheDocument();
    expect(screen.getByText(/Workforce Risk Distribution/i)).toBeInTheDocument();
    expect(screen.getByText(/Top Flight Risk Drivers & Influence/i)).toBeInTheDocument();
    expect(screen.getByText(/Prescriptive Retention Playbook/i)).toBeInTheDocument();
    expect(screen.getByText(/Flight Risk Employee Directory/i)).toBeInTheDocument();
  });

  it('renders Workforce Demand Forecasting Page with Horizons, Simulator, and Demand Table', () => {
    render(
      <Provider store={store}>
        <AppThemeProvider>
          <BrowserRouter>
            <WorkforceForecastingPage />
          </BrowserRouter>
        </AppThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/Workforce Demand Forecasting & Simulation/i)).toBeInTheDocument();
    expect(screen.getByText(/Net Talent Gap/i)).toBeInTheDocument();
    expect(screen.getByText(/Internal Upskill Share/i)).toBeInTheDocument();
    expect(screen.getByText(/Confidence Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Headcount Demand by Time Horizon/i)).toBeInTheDocument();
    expect(screen.getByText(/Emerging vs Shrinking Skill Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Interactive "What-If" Scenario Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/Departmental Headcount Demand & Skill Requirements/i)).toBeInTheDocument();
  });

  it('renders Executive Cockpit Page with Health Scorecard, Dimensions, Alerts feed, and Scorecards Table', () => {
    render(
      <Provider store={store}>
        <AppThemeProvider>
          <BrowserRouter>
            <ExecutiveCockpitPage />
          </BrowserRouter>
        </AppThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/Executive Cockpit & Strategic Telemetry/i)).toBeInTheDocument();
    expect(screen.getByText(/Overall Enterprise Workforce Health Index/i)).toBeInTheDocument();
    expect(screen.getByText(/Workforce Stability/i)).toBeInTheDocument();
    expect(screen.getByText(/Skill & Training Velocity/i)).toBeInTheDocument();
    expect(screen.getByText(/Placement & Hiring Velocity/i)).toBeInTheDocument();
    expect(screen.getByText(/Predictive Flight Risk/i)).toBeInTheDocument();
    expect(screen.getByText(/Executive Strategic Dimensions/i)).toBeInTheDocument();
    expect(screen.getByText(/Real-Time Strategic Alerts & Action Items/i)).toBeInTheDocument();
    expect(screen.getByText(/Departmental Executive Health Scorecards/i)).toBeInTheDocument();
  });

  it('renders Performance & Productivity Analytics Page with KPIs, Trends, and Reviews Roster', () => {
    render(
      <Provider store={store}>
        <AppThemeProvider>
          <BrowserRouter>
            <AnalyticsPage />
          </BrowserRouter>
        </AppThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/Performance & Productivity Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Evaluated Headcount/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg Performance Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Goal Completion Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/High Performers/i)).toBeInTheDocument();
    expect(screen.getByText(/Quarterly Performance & Goal Trends/i)).toBeInTheDocument();
    expect(screen.getByText(/Promotion & Succession Readiness/i)).toBeInTheDocument();
    expect(screen.getByText(/Quarterly Performance Reviews Roster/i)).toBeInTheDocument();
  });

  it('renders Audit & Compliance Trail Page with Security Indicators, Actions, and Immutable Log Table', () => {
    render(
      <Provider store={store}>
        <AppThemeProvider>
          <BrowserRouter>
            <AuditLogsPage />
          </BrowserRouter>
        </AppThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/Platform Audit & Compliance Trail/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Recorded Events/i)).toBeInTheDocument();
    expect(screen.getByText(/Security & Auth Events/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Export Audit/i)).toBeInTheDocument();
    expect(screen.getByText(/Ledger Immutability/i)).toBeInTheDocument();
  });
});
