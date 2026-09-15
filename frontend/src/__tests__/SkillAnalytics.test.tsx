import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { store } from '../app/store';
import { SkillAnalyticsPage } from '../features/skills/pages/SkillAnalyticsPage';
import { AppThemeProvider } from '../theme/ThemeProvider';

describe('Skill Analytics Page Component', () => {
  it('renders skill analytics header and KPI labels properly', () => {
    render(
      <Provider store={store}>
        <AppThemeProvider>
          <BrowserRouter>
            <SkillAnalyticsPage />
          </BrowserRouter>
        </AppThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/Skill Analytics & Intelligence/i)).toBeInTheDocument();
    expect(screen.getByText(/Skills Tracked/i)).toBeInTheDocument();
    expect(screen.getByText(/Certified Workforce/i)).toBeInTheDocument();
    expect(screen.getByText(/Critical Skill Gaps/i)).toBeInTheDocument();
    expect(screen.getByText(/Workforce Benchmark/i)).toBeInTheDocument();
  });

  it('renders skill distribution and training recommendation sections', () => {
    render(
      <Provider store={store}>
        <AppThemeProvider>
          <BrowserRouter>
            <SkillAnalyticsPage />
          </BrowserRouter>
        </AppThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/Required vs. Available Skills by Department/i)).toBeInTheDocument();
    expect(screen.getByText(/Top Organizational Skill Strengths/i)).toBeInTheDocument();
    expect(screen.getByText(/Critical Skill Deficits & Gaps/i)).toBeInTheDocument();
    expect(screen.getByText(/Automated Training & Certification Recommendations/i)).toBeInTheDocument();
  });
});
