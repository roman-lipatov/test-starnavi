import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getPerson } from '@/shared/api/people';
import type { Person } from '@/shared/types/api';

export const usePersonQuery = (id: string | number | null): UseQueryResult<Person, Error> => {
  return useQuery<Person, Error>({
    queryKey: ['person', id],
    queryFn: () => getPerson(id!),
    enabled: !!id,
  });
};

