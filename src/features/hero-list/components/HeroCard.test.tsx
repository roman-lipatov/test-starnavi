import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroCard } from './HeroCard';
import type { Person } from '@/shared/types/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ReactNode } from 'react';

// Mock providers
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const theme = createTheme();

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  </QueryClientProvider>
);

describe('HeroCard', () => {
  const mockPerson: Person = {
    id: 1,
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
    homeworld: 1,
    films: [1, 2],
    species: [],
    vehicles: [],
    starships: [12, 13],
    created: '2014-12-09T13:50:51.644000Z',
    edited: '2014-12-20T21:17:56.891000Z',
    url: 'https://sw-api.starnavi.io/people/1/',
  };

  it('should render person name', () => {
    const handleClick = vi.fn();
    render(
      <TestWrapper>
        <HeroCard person={mockPerson} onClick={handleClick} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
  });

  it('should call onClick when card is clicked', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <TestWrapper>
        <HeroCard person={mockPerson} onClick={handleClick} />
      </TestWrapper>
    );
    
    const card = container.querySelector('[class*="MuiCard"]') as HTMLElement;
    if (card) {
      card.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });

  it('should display hero image', () => {
    const handleClick = vi.fn();
    render(
      <TestWrapper>
        <HeroCard person={mockPerson} onClick={handleClick} />
      </TestWrapper>
    );
    
    const image = screen.getByAltText('Luke Skywalker');
    expect(image).toBeInTheDocument();
  });
});

