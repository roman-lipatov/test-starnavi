import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, Divider, Chip, Tabs, Tab } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { usePersonQuery } from '../hooks/usePersonQuery';
import { useFilmsQuery } from '../hooks/useFilmsQuery';
import { Loader } from '@/shared/components/Loader';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { getHeroCardImage } from '@/shared/utils/heroImages';
import { useMemo, useState } from 'react';
import { HeroGraph } from './HeroGraph';

type HeroDetailsProps = {
  heroId: number;
  onClose: () => void;
}

type ViewMode = 'text' | 'graph';

export const HeroDetails = ({ heroId, onClose }: HeroDetailsProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('text');
  const { data: person, isLoading, error } = usePersonQuery(heroId);
  const filmsQueries = useFilmsQuery(person?.films || []);
  
  const films = useMemo(() => {
    return filmsQueries
      .map(query => query.data)
      .filter((film): film is NonNullable<typeof film> => film !== undefined);
  }, [filmsQueries]);
  
  const isLoadingFilms = filmsQueries.some(query => query.isLoading);

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Hero Details</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {isLoading && <Loader />}
        {error && <ErrorMessage message={error.message} />}
        {person && (
          <Box>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                component="img"
                src={getHeroCardImage(person.id)}
                alt={person.name}
                sx={{
                  width: 200,
                  height: 200,
                  borderRadius: 2,
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200';
                }}
              />
              <Typography variant="h4" sx={{ mt: 2 }}>
                {person.name}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={viewMode} onChange={(_, newValue) => setViewMode(newValue)}>
                <Tab label="Text View" value="text" />
                <Tab label="Graph View" value="graph" />
              </Tabs>
            </Box>
            {viewMode === 'text' ? (
              <Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
                  <Typography><strong>Height:</strong> {person.height} cm</Typography>
                  <Typography><strong>Mass:</strong> {person.mass} kg</Typography>
                  <Typography><strong>Hair Color:</strong> {person.hair_color}</Typography>
                  <Typography><strong>Skin Color:</strong> {person.skin_color}</Typography>
                  <Typography><strong>Eye Color:</strong> {person.eye_color}</Typography>
                  <Typography><strong>Birth Year:</strong> {person.birth_year}</Typography>
                  <Typography><strong>Gender:</strong> {person.gender}</Typography>
                  <Typography><strong>Starships:</strong> {person.starships.length}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    <strong>Films:</strong>
                  </Typography>
                  {isLoadingFilms ? (
                    <Typography color="text.secondary">Loading films...</Typography>
                  ) : films.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {films.map((film) => (
                        <Chip 
                          key={film.id} 
                          label={film.title} 
                          color="primary" 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography color="text.secondary">No films available</Typography>
                  )}
                </Box>
              </Box>
            ) : (
              <HeroGraph heroId={heroId} person={person} films={films} />
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

