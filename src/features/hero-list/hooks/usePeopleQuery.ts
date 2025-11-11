import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getPeople } from '@/shared/api/people';
import type { ApiResponse, Person } from '@/shared/types/api';

export const usePeopleQuery = (page: number = 1): UseQueryResult<ApiResponse<Person>, Error> => {
  return useQuery<ApiResponse<Person>, Error>({
    queryKey: ['people', page],
    queryFn: () => getPeople(page),
  });
};
