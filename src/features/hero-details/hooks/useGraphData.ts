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
  // Collect only starship IDs that are in both person.starships and film.starships for each film
  // This ensures we only fetch starships that the person actually used in specific films
  const starshipIds = useMemo(() => {
    if (!person || films.length === 0) return [];
    
    const relevantStarshipIds: number[] = [];
    
    films.forEach(film => {
      // Find intersection: starships that are in both person.starships and film.starships
      const filmStarships = (film.starships || []).filter(starshipId => 
        person.starships.includes(starshipId)
      );
      relevantStarshipIds.push(...filmStarships);
    });
    
    // Remove duplicates
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
