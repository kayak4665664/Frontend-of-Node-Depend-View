import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component Tests', (): void => {

  it('should render the App component successfully', (): void => {
    render(<App />);
    const graphElement = screen.getByTestId('graph');
    expect(graphElement).toBeTruthy();
  });

  it('should contain at least one tooltip element', (): void => {
    render(<App />);
    const tooltipElements = screen.getAllByTestId('tooltip');
    expect(tooltipElements.length).toBeGreaterThan(0);
  });
});
