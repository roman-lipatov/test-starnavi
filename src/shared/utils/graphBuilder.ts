import type { Person, Film, Starship } from '../types/api';
import type { Node, Edge } from 'reactflow';
import { getHeroCardImage } from './heroImages';

type GraphData = {
  nodes: Node[];
  edges: Edge[];
}

export const buildGraph = (
  person: Person,
  films: Film[],
  starships: Starship[]
): GraphData => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Layout constants for top-down hierarchy
  const startX = 400;
  const personY = 100; // Top level - person
  const filmY = 300; // Middle level - films
  const starshipY = 500; // Bottom level - starships
  const horizontalSpacing = 250; // Space between films horizontally
  
  // Color palette for film-to-starship connections
  const filmColors = [
    '#000000', // Black
    '#dc004e', // Red
    '#4caf50', // Green
    '#e91e63', // Pink
    '#1976d2', // Blue
  ];
  
  const filmColorMap = new Map<number, string>();
  const filmPositions = new Map<number, { x: number; y: number }>();
  
  // Assign colors based on episode_id for consistency
  films.forEach((film) => {
    filmColorMap.set(film.id, filmColors[(film.episode_id - 1) % filmColors.length]);
  });
  
  // Sort films by episode_id for consistent ordering
  const sortedFilms = [...films].sort((a, b) => a.episode_id - b.episode_id);
  
  // Create person node at the top center
  const personNode: Node = {
    id: `person-${person.id}`,
    type: 'person',
    position: { x: startX, y: personY },
    data: {
      label: person.name,
      image: getHeroCardImage(person.id),
    },
  };
  nodes.push(personNode);
  
  // Calculate total width needed for films
  const totalWidth = (sortedFilms.length - 1) * horizontalSpacing;
  const startFilmX = startX - totalWidth / 2;
  
  // Create film nodes in the middle row
  sortedFilms.forEach((film, index) => {
    const filmX = startFilmX + index * horizontalSpacing;
    const filmYPos = filmY;
    
    filmPositions.set(film.id, { x: filmX, y: filmYPos });
    
    const filmNode: Node = {
      id: `film-${film.id}`,
      type: 'film',
      position: { x: filmX, y: filmYPos },
      data: {
        label: film.title,
        episode: film.episode_id,
      },
    };
    nodes.push(filmNode);

    // Edge from person to film
    edges.push({
      id: `person-${person.id}-film-${film.id}`,
      source: `person-${person.id}`,
      target: `film-${film.id}`,
      sourceHandle: 'source',
      targetHandle: 'target',
      type: 'smoothstep',
      animated: false,
      style: { strokeWidth: 2, stroke: '#1976d2' },
    });
  });

  // Group starships - track which films each starship appears in
  const starshipToFilms = new Map<number, Film[]>();
  const allStarships: Starship[] = [];
  
  starships.forEach(starship => {
    if (!person.starships.includes(starship.id)) return;
    
    const relevantFilms = films.filter(film => 
      film.starships.includes(starship.id)
    );
    
    if (relevantFilms.length > 0) {
      starshipToFilms.set(starship.id, relevantFilms);
      allStarships.push(starship);
    }
  });

  // Group starships by their primary position (X coordinate)
  // This helps avoid overlapping when multiple starships share the same X position
  const starshipGroups = new Map<string, { starship: Starship; films: Film[] }[]>();
  const starshipVerticalSpacing = 100;
  
  allStarships.forEach((starship) => {
    const relevantFilms = starshipToFilms.get(starship.id) || [];
    if (relevantFilms.length === 0) return;
    
    // Calculate X position: if multiple films, position between them; otherwise below the film
    let starshipX: number;
    
    if (relevantFilms.length === 1) {
      const filmPos = filmPositions.get(relevantFilms[0].id);
      if (!filmPos) return;
      starshipX = filmPos.x;
    } else {
      const filmXs = relevantFilms
        .map(f => filmPositions.get(f.id)?.x)
        .filter((x): x is number => x !== undefined);
      
      if (filmXs.length === 0) return;
      starshipX = filmXs.reduce((sum, x) => sum + x, 0) / filmXs.length;
    }
    
    // Round X to group starships at similar positions
    const groupKey = Math.round(starshipX / 10).toString();
    
    if (!starshipGroups.has(groupKey)) {
      starshipGroups.set(groupKey, []);
    }
    starshipGroups.get(groupKey)!.push({ starship, films: relevantFilms });
  });

  // Create starship nodes with vertical spacing to avoid overlaps
  starshipGroups.forEach((group) => {
    group.forEach((item, index) => {
      const { starship, films: relevantFilms } = item;
      
      // Calculate X position
      let starshipX: number;
      if (relevantFilms.length === 1) {
        const filmPos = filmPositions.get(relevantFilms[0].id);
        if (!filmPos) return;
        starshipX = filmPos.x;
      } else {
        const filmXs = relevantFilms
          .map(f => filmPositions.get(f.id)?.x)
          .filter((x): x is number => x !== undefined);
        if (filmXs.length === 0) return;
        starshipX = filmXs.reduce((sum, x) => sum + x, 0) / filmXs.length;
      }
      
      // Vertical position: stack starships that share similar X position
      const starshipYPos = starshipY + index * starshipVerticalSpacing;
      
      const starshipNode: Node = {
        id: `starship-${starship.id}`,
        type: 'starship',
        position: { x: starshipX, y: starshipYPos },
        data: {
          label: starship.name,
          model: starship.model,
        },
      };
      nodes.push(starshipNode);

      // Create edges from all films where this starship appears
      // Use bezier type to avoid crossing when starship is between films
      relevantFilms.forEach(relatedFilm => {
        const filmPos = filmPositions.get(relatedFilm.id);
        if (!filmPos) return;
        
        const filmColor = filmColorMap.get(relatedFilm.id) || '#dc004e';
        edges.push({
          id: `film-${relatedFilm.id}-starship-${starship.id}`,
          source: `film-${relatedFilm.id}`,
          target: `starship-${starship.id}`,
          sourceHandle: 'source',
          targetHandle: 'target',
          type: relevantFilms.length > 1 ? 'bezier' : 'smoothstep', // Use bezier for multi-film starships
          animated: false,
          style: { 
            strokeWidth: 1.5,
            stroke: filmColor,
            opacity: 0.9,
          },
        });
      });
    });
  });

  return { nodes, edges };
};

