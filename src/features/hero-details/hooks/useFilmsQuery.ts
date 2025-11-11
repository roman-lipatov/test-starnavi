import { useQueries, type UseQueryResult } from '@tanstack/react-query';
import { getFilm } from '@/shared/api/films';
import type { Film } from '@/shared/types/api';

export const useFilmsQuery = (filmIds: number[]): UseQueryResult<Film, Error>[] => {
  return useQueries({
    queries: filmIds.map((id) => ({
      queryKey: ['film', id],
      queryFn: () => getFilm(id),
      enabled: !!id,
    })),
  });
};

