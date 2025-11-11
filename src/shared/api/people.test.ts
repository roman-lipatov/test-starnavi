import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPeople, getPerson } from './people';
import axiosInstance from './axiosInstance';
import type { Person, ApiResponse } from '../types/api';

// Mock axios instance
vi.mock('./axiosInstance', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('people API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPeople', () => {
    it('should fetch people list with pagination', async () => {
      const mockResponse: ApiResponse<Person> = {
        count: 82,
        next: 'https://sw-api.starnavi.io/people/?page=2',
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

      vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockResponse });

      const result = await getPeople(1);

      expect(axiosInstance.get).toHaveBeenCalledWith('/people/?page=1');
      expect(result).toEqual(mockResponse);
      expect(result.count).toBe(82);
      expect(result.results).toHaveLength(1);
    });

    it('should use default page 1 if no page provided', async () => {
      const mockResponse: ApiResponse<Person> = {
        count: 82,
        next: null,
        previous: null,
        results: [],
      };

      vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockResponse });

      await getPeople();

      expect(axiosInstance.get).toHaveBeenCalledWith('/people/?page=1');
    });
  });

  describe('getPerson', () => {
    it('should fetch single person by ID', async () => {
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

      vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockPerson });

      const result = await getPerson(1);

      expect(axiosInstance.get).toHaveBeenCalledWith('/people/1/');
      expect(result).toEqual(mockPerson);
      expect(result.name).toBe('Luke Skywalker');
    });

    it('should handle string ID', async () => {
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
        films: [],
        species: [],
        vehicles: [],
        starships: [],
        created: '',
        edited: '',
        url: '',
      };

      vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockPerson });

      await getPerson('1');

      expect(axiosInstance.get).toHaveBeenCalledWith('/people/1/');
    });
  });
});

