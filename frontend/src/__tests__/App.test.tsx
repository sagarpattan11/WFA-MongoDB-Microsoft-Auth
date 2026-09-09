import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('App Root Component', () => {
  it('renders application brand and navigation shell without throwing errors', () => {
    render(<App />);

    const brandElements = screen.getAllByText(/Workforce/i);
    expect(brandElements.length).toBeGreaterThan(0);

    const platformElements = screen.getAllByText(/Analytics Platform/i);
    expect(platformElements.length).toBeGreaterThan(0);
  });

  it('renders dashboard navigation link and overview title', () => {
    render(<App />);

    const dashboardElements = screen.getAllByText(/Dashboard/i);
    expect(dashboardElements.length).toBeGreaterThan(0);
  });
});
