import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { usePeopleQuery } from './usePeopleQuery';
import { getPeople } from '@/shared/api/people';
import type { Person, ApiResponse } from '@/shared/types/api';

// Mock API function
vi.mock('@/shared/api/people', () => ({
  getPeople: vi.fn(),
}));

describe('usePeopleQuery', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should fetch people data', async () => {
    const mockResponse: ApiResponse<Person> = {
      count: 82,
      next: null,
      previous: null,
      results: [
        {
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
        },
      ],
    };

    vi.mocked(getPeople).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePeopleQuery(1), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getPeople).toHaveBeenCalledWith(1);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should handle loading state', () => {
    vi.mocked(getPeople).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => usePeopleQuery(1), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('should handle error state', async () => {
    const error = new Error('Network error');
    vi.mocked(getPeople).mockRejectedValue(error);

    const { result } = renderHook(() => usePeopleQuery(1), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });
});

