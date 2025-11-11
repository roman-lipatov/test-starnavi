import { useQueries, type UseQueryResult } from '@tanstack/react-query';
import { getStarship } from '@/shared/api/starships';
import type { Starship } from '@/shared/types/api';

export const useStarshipsQuery = (starshipIds: number[]): UseQueryResult<Starship, Error>[] => {
  return useQueries({
    queries: starshipIds.map((id) => ({
      queryKey: ['starship', id],
      queryFn: () => getStarship(id),
      enabled: !!id,
    })),
  });
};

