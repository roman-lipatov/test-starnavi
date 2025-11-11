import { useMemo } from 'react';
import { useStarshipsQuery } from './useStarshipsQuery';
import type { Person, Film } from '@/shared/types/api';
import { buildGraph } from '@/shared/utils/graphBuilder';
import type { Node, Edge } from 'reactflow';

type GraphData = {
  nodes: Node[];
  edges: Edge[];
};

export const useGraphData = (_heroId: number, person: Person, films: Film[]): { graphData: GraphData | null; isLoading: boolean; error?: string } => {
  // Collect unique starship IDs from all films
  const starshipIds = useMemo(() => {
    const allIds = films.flatMap(film => film.starships || []);
    // Remove duplicates
    return Array.from(new Set(allIds));
  }, [films]);

  const starshipsQueries = useStarshipsQuery(starshipIds);
  
  const starships = useMemo(() => {
    return starshipsQueries
      .map(query => query.data)
      .filter((starship): starship is NonNullable<typeof starship> => starship !== undefined);
  }, [starshipsQueries]);

  const isLoadingStarships = starshipsQueries.some(query => query.isLoading);
  const hasErrors = starshipsQueries.some(query => query.error);

  const graphData = useMemo(() => {
    if (!person || films.length === 0) return null;
    
    return buildGraph(person, films, starships);
  }, [person, films, starships]);

  return {
    graphData,
    isLoading: isLoadingStarships,
    error: hasErrors ? 'Some starships failed to load' : undefined,
  };
};
