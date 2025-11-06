import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App Component', () => {
  test('renders the header', () => {
    render(<App />);
    const headerElement = screen.getByText(/Gestão Financeira/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders the sidebar', () => {
    render(<App />);
    const sidebarElement = screen.getByRole('navigation');
    expect(sidebarElement).toBeInTheDocument();
  });

  test('renders the dashboard by default', () => {
    render(<App />);
    const dashboardElement = screen.getByText(/Resumo Financeiro/i);
    expect(dashboardElement).toBeInTheDocument();
  });
});