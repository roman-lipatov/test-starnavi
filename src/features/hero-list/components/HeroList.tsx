import { Pagination, Box } from '@mui/material';
import { usePeopleQuery } from '../hooks/usePeopleQuery';
import { HeroCard } from './HeroCard';
import { Loader } from '@/shared/components/Loader';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { useState } from 'react';

 type HeroListProps = {
  onHeroClick: (heroId: number) => void;
}

export const HeroList = ({ onHeroClick }: HeroListProps) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = usePeopleQuery(page);

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          '& > *': {
            flex: {
              xs: '1 1 100%',
              sm: '1 1 calc(50% - 8px)',
              md: '1 1 calc(33.333% - 11px)',
              lg: '1 1 calc(25% - 12px)',
            },
          },
        }}
      >
        {data?.results.map((person) => (
          <HeroCard 
            key={person.id} 
            person={person} 
            onClick={() => onHeroClick(person.id)} 
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination 
          count={Math.ceil((data?.count || 0) / 10)} 
          page={page} 
          onChange={(_, value) => setPage(value)} 
        />
      </Box>
    </Box>
  );
};