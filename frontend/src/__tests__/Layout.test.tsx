import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { store } from '../app/store';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { AppThemeProvider } from '../theme/ThemeProvider';

describe('Layout Components (Header & Sidebar)', () => {
  it('renders Header with toggle, theme switch, and user menu', () => {
    render(
      <Provider store={store}>
        <AppThemeProvider>
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </AppThemeProvider>
      </Provider>
    );

    expect(screen.getByLabelText(/Toggle navigation sidebar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Toggle theme mode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/View notifications/i)).toBeInTheDocument();
  });

  it('renders Sidebar with navigation groups and collapse button', () => {
    render(
      <Provider store={store}>
        <AppThemeProvider>
          <BrowserRouter>
            <Sidebar />
          </BrowserRouter>
        </AppThemeProvider>
      </Provider>
    );

    expect(screen.getAllByText(/Workforce/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Employees/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Attendance/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Scheduling/i).length).toBeGreaterThan(0);
  });

  it('toggles sidebar collapse state on button click', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <AppThemeProvider>
          <BrowserRouter>
            <Sidebar />
          </BrowserRouter>
        </AppThemeProvider>
      </Provider>
    );

    const collapseButtons = screen.getAllByLabelText(/Collapse sidebar/i);
    expect(collapseButtons.length).toBeGreaterThan(0);
    const collapseButton = collapseButtons[0];
    if (collapseButton) {
      await user.click(collapseButton);
      expect(store.getState().ui.sidebarCollapsed).toBe(true);
    }
  });
});
