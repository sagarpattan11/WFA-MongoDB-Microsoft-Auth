import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('App Root Component', () => {
  it('renders application brand and session validator or login interface without crashing', async () => {
    render(<App />);

    await waitFor(() => {
      const authOrBrand = screen.getAllByText(/Passkey|Workforce|Session/i);
      expect(authOrBrand.length).toBeGreaterThan(0);
    });
  });

  it('renders passkey authentication access on unauthenticated landing', async () => {
    render(<App />);

    await waitFor(() => {
      const loginHeading = screen.getAllByText(/Passwordless|Passkey/i);
      expect(loginHeading.length).toBeGreaterThan(0);
    });
  });
});
