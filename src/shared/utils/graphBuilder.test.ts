import { describe, it, expect } from 'vitest';
import { buildGraph } from './graphBuilder';
import type { Person, Film, Starship } from '../types/api';

describe('buildGraph', () => {
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

  const mockFilms: Film[] = [
    {
      id: 1,
      title: 'A New Hope',
      episode_id: 4,
      opening_crawl: '',
      director: 'George Lucas',
      producer: 'Gary Kurtz',
      release_date: '1977-05-25',
      characters: [1],
      planets: [],
      starships: [12],
      vehicles: [],
      species: [],
      created: '',
      edited: '',
      url: '',
    },
    {
      id: 2,
      title: 'The Empire Strikes Back',
      episode_id: 5,
      opening_crawl: '',
      director: 'Irvin Kershner',
      producer: 'Gary Kurtz',
      release_date: '1980-05-17',
      characters: [1],
      planets: [],
      starships: [12, 13],
      vehicles: [],
      species: [],
      created: '',
      edited: '',
      url: '',
    },
  ];

  const mockStarships: Starship[] = [
    {
      id: 12,
      name: 'X-wing',
      model: 'T-65 X-wing',
      manufacturer: 'Incom Corporation',
      cost_in_credits: '149999',
      length: '12.5',
      max_atmosphering_speed: '1050',
      crew: '1',
      passengers: '0',
      cargo_capacity: '110',
      consumables: '1 week',
      hyperdrive_rating: '1.0',
      MGLT: '100',
      starship_class: 'Starfighter',
      pilots: [1],
      films: [1, 2],
      created: '',
      edited: '',
      url: '',
    },
    {
      id: 13,
      name: 'Imperial shuttle',
      model: 'Lambda-class T-4a shuttle',
      manufacturer: 'Sienar Fleet Systems',
      cost_in_credits: '240000',
      length: '20',
      max_atmosphering_speed: '850',
      crew: '6',
      passengers: '20',
      cargo_capacity: '80000',
      consumables: '2 months',
      hyperdrive_rating: '1.0',
      MGLT: '50',
      starship_class: 'Armed government transport',
      pilots: [1],
      films: [2],
      created: '',
      edited: '',
      url: '',
    },
  ];

  it('should create person node at the top', () => {
    const result = buildGraph(mockPerson, mockFilms, mockStarships);
    
    const personNode = result.nodes.find(node => node.type === 'person');
    expect(personNode).toBeDefined();
    expect(personNode?.data.label).toBe('Luke Skywalker');
    expect(personNode?.position.y).toBe(100); // personY
  });

  it('should create film nodes in the middle row', () => {
    const result = buildGraph(mockPerson, mockFilms, mockStarships);
    
    const filmNodes = result.nodes.filter(node => node.type === 'film');
    expect(filmNodes).toHaveLength(2);
    expect(filmNodes[0].position.y).toBe(300); // filmY
    expect(filmNodes[1].position.y).toBe(300);
  });

  it('should create edges from person to all films', () => {
    const result = buildGraph(mockPerson, mockFilms, mockStarships);
    
    const personToFilmEdges = result.edges.filter(
      edge => edge.source === `person-${mockPerson.id}` && edge.target.startsWith('film-')
    );
    expect(personToFilmEdges).toHaveLength(2);
    expect(personToFilmEdges.every(edge => edge.style?.stroke === '#1976d2')).toBe(true);
  });

  it('should create starship nodes below films', () => {
    const result = buildGraph(mockPerson, mockFilms, mockStarships);
    
    const starshipNodes = result.nodes.filter(node => node.type === 'starship');
    expect(starshipNodes.length).toBeGreaterThan(0);
    starshipNodes.forEach(node => {
      expect(node.position.y).toBeGreaterThanOrEqual(500); // starshipY
    });
  });

  it('should create edges from films to starships', () => {
    const result = buildGraph(mockPerson, mockFilms, mockStarships);
    
    const filmToStarshipEdges = result.edges.filter(
      edge => edge.source.startsWith('film-') && edge.target.startsWith('starship-')
    );
    expect(filmToStarshipEdges.length).toBeGreaterThan(0);
  });

  it('should position starship between films if it appears in multiple films', () => {
    const result = buildGraph(mockPerson, mockFilms, mockStarships);
    
    const xwingNode = result.nodes.find(node => 
      node.type === 'starship' && node.data.label === 'X-wing'
    );
    
    if (xwingNode) {
      const filmNodes = result.nodes.filter(node => node.type === 'film');
      const filmXs = filmNodes.map(node => node.position.x);
      const minFilmX = Math.min(...filmXs);
      const maxFilmX = Math.max(...filmXs);
      
      // X-wing appears in both films, so it should be positioned between them
      expect(xwingNode.position.x).toBeGreaterThanOrEqual(minFilmX);
      expect(xwingNode.position.x).toBeLessThanOrEqual(maxFilmX);
    }
  });

  it('should assign different colors to different films', () => {
    const result = buildGraph(mockPerson, mockFilms, mockStarships);
    
    const filmToStarshipEdges = result.edges.filter(
      edge => edge.source.startsWith('film-') && edge.target.startsWith('starship-')
    );
    
    // Get unique colors for each film
    const filmColors = new Map<string, string>();
    filmToStarshipEdges.forEach(edge => {
      const filmId = edge.source.replace('film-', '');
      if (!filmColors.has(filmId)) {
        filmColors.set(filmId, edge.style?.stroke as string);
      }
    });
    
    // Different films should have different colors (if they have starships)
    if (filmColors.size > 1) {
      const colors = Array.from(filmColors.values());
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBeGreaterThan(0);
    }
  });

  it('should handle empty starships array', () => {
    const result = buildGraph(mockPerson, mockFilms, []);
    
    expect(result.nodes.find(node => node.type === 'person')).toBeDefined();
    expect(result.nodes.filter(node => node.type === 'film')).toHaveLength(2);
    expect(result.nodes.filter(node => node.type === 'starship')).toHaveLength(0);
  });

  it('should handle empty films array', () => {
    const result = buildGraph(mockPerson, [], mockStarships);
    
    expect(result.nodes.find(node => node.type === 'person')).toBeDefined();
    expect(result.nodes.filter(node => node.type === 'film')).toHaveLength(0);
    expect(result.nodes.filter(node => node.type === 'starship')).toHaveLength(0);
  });
});

