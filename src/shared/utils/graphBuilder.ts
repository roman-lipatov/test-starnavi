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

  const personNode: Node = {
    id: `person-${person.id}`,
    type: 'person',
    position: { x: 400, y: 300 },
    data: {
      label: person.name,
      image: getHeroCardImage(person.id),
    },
  };
  nodes.push(personNode);

  films.forEach((film, index) => {
    const angle = (2 * Math.PI * index) / films.length;
    const radius = 250;
    const x = 400 + radius * Math.cos(angle);
    const y = 300 + radius * Math.sin(angle);

    const filmNode: Node = {
      id: `film-${film.id}`,
      type: 'film',
      position: { x, y },
      data: {
        label: film.title,
        episode: film.episode_id,
      },
    };
    nodes.push(filmNode);

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

    // Show only starships that the person used in this specific film
    // (must be in both person.starships and film.starships)
    const filmStarships = starships.filter(starship => 
      person.starships.includes(starship.id) && 
      film.starships.includes(starship.id)
    );

    // Position starships in an arc from the film
    filmStarships.forEach((starship, shipIndex) => {
      // Calculate angle spread for ships (spread them in an arc)
      const shipAngleSpread = Math.min(0.8, filmStarships.length * 0.15); // Max 0.8 radians spread
      const shipAngleOffset = (shipIndex - (filmStarships.length - 1) / 2) * (shipAngleSpread / Math.max(1, filmStarships.length - 1));
      const shipAngle = angle + shipAngleOffset;
      
      const shipRadius = radius + 250; // Increased radius to move ships further from films
      const shipX = 400 + shipRadius * Math.cos(shipAngle);
      const shipY = 300 + shipRadius * Math.sin(shipAngle);

      const starshipNode: Node = {
        id: `starship-${starship.id}`,
        type: 'starship',
        position: { x: shipX, y: shipY },
        data: {
          label: starship.name,
          model: starship.model,
        },
      };
      nodes.push(starshipNode);

      edges.push({
        id: `film-${film.id}-starship-${starship.id}`,
        source: `film-${film.id}`,
        target: `starship-${starship.id}`,
        sourceHandle: 'source',
        targetHandle: 'target',
        type: 'smoothstep',
        animated: false,
        style: { strokeWidth: 2, stroke: '#dc004e' },
      });
    });
  });

  return { nodes, edges };
};

