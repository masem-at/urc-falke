import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    const titleElement = screen.getByText(/URC Falke/i);
    expect(titleElement).toBeDefined();
  });

  it('renders the description', () => {
    render(<App />);
    const descElement = screen.getByText(/USV Falkensteiner Radclub Event-Management PWA/i);
    expect(descElement).toBeDefined();
  });
});
