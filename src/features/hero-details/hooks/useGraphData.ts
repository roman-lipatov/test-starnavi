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
  const starshipIds = useMemo(() => {
    if (!person || films.length === 0) return [];
    
    const relevantStarshipIds: number[] = [];
    
    films.forEach(film => {
      const filmStarships = (film.starships || []).filter(starshipId => 
        person.starships.includes(starshipId)
      );
      relevantStarshipIds.push(...filmStarships);
    });
    
    return Array.from(new Set(relevantStarshipIds));
  }, [person, films]);

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
