import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AppThemeProvider, useThemeContext } from '../theme/ThemeProvider';

const ThemeTestComponent = () => {
  const { resolvedMode, toggleTheme, setThemeMode } = useThemeContext();

  return (
    <div>
      <span data-testid="resolved-mode">{resolvedMode}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setThemeMode('dark')}>Set Dark</button>
      <button onClick={() => setThemeMode('light')}>Set Light</button>
    </div>
  );
};

describe('Theme System & Provider', () => {
  it('defaults to light or system theme and provides theme context', () => {
    render(
      <AppThemeProvider>
        <ThemeTestComponent />
      </AppThemeProvider>
    );

    const mode = screen.getByTestId('resolved-mode');
    expect(mode.textContent).toMatch(/light|dark/);
  });

  it('toggles theme when toggle button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <AppThemeProvider>
        <ThemeTestComponent />
      </AppThemeProvider>
    );

    const mode = screen.getByTestId('resolved-mode');
    const initialMode = mode.textContent;

    await user.click(screen.getByText('Toggle Theme'));

    expect(mode.textContent).not.toBe(initialMode);
  });

  it('sets explicit theme mode and persists to localStorage', async () => {
    const user = userEvent.setup();

    render(
      <AppThemeProvider>
        <ThemeTestComponent />
      </AppThemeProvider>
    );

    await user.click(screen.getByText('Set Dark'));
    expect(screen.getByTestId('resolved-mode').textContent).toBe('dark');
    expect(localStorage.getItem('wfa_ui_theme_preference')).toBe('dark');

    await user.click(screen.getByText('Set Light'));
    expect(screen.getByTestId('resolved-mode').textContent).toBe('light');
    expect(localStorage.getItem('wfa_ui_theme_preference')).toBe('light');
  });
});
