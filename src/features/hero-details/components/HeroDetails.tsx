import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Box, 
  Typography, 
  Divider, 
  Chip, 
  Tabs, 
  Tab, 
  Avatar 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { usePersonQuery } from '../hooks/usePersonQuery';
import { useFilmsQuery } from '../hooks/useFilmsQuery';
import { Loader } from '@/shared/components/Loader';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { getHeroCardImage } from '@/shared/utils/heroImages';
import { getInitials } from '@/shared/utils/getInitials';
import { capitalize } from '@/shared/utils/capitalize';
import { useMemo, useState } from 'react';
import { HeroGraph } from './HeroGraph';
import type { Person } from '@/shared/types/api';

type HeroDetailsProps = {
  heroId: number;
  onClose: () => void;
}

type ViewMode = 'info' | 'graph';

const InfoCard = ({ label, value }: { label: string; value: string | number }) => (
  <Box sx={{ p: 2, borderRadius: 1, bgcolor: 'grey.50' }}>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="body1" fontWeight="medium">{value}</Typography>
  </Box>
);

const getPersonInfoFields = (person: Person) => [
  { label: 'Height', value: `${person.height} cm` },
  { label: 'Mass', value: `${person.mass} kg` },
  { label: 'Hair Color', value: capitalize(person.hair_color) },
  { label: 'Skin Color', value: capitalize(person.skin_color) },
  { label: 'Eye Color', value: capitalize(person.eye_color) },
  { label: 'Birth Year', value: person.birth_year },
  { label: 'Gender', value: capitalize(person.gender) },
  { label: 'Starships', value: person.starships.length },
];

export const HeroDetails = ({ heroId, onClose }: HeroDetailsProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('info');
  const [imageError, setImageError] = useState(false);
  const { data: person, isLoading, error } = usePersonQuery(heroId);
  const filmsQueries = useFilmsQuery(person?.films || []);
  
  const films = useMemo(() => {
    return filmsQueries
      .map(query => query.data)
      .filter((film): film is NonNullable<typeof film> => film !== undefined);
  }, [filmsQueries]);
  
  const isLoadingFilms = filmsQueries.some(query => query.isLoading);

  return (
    <Dialog 
      open={true} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={false}
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: 0, sm: 2 },
            maxHeight: { xs: '100vh', sm: '90vh' },
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="h2" fontWeight="bold">
            Hero Details
          </Typography>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
        {isLoading && <Loader />}
        {error && <ErrorMessage message={error.message} />}
        {person && (
          <Box>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              {imageError ? (
                <Box
                  sx={{
                    width: { xs: 150, sm: 200 },
                    height: { xs: 150, sm: 200 },
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    boxShadow: 4,
                    border: '4px solid',
                    borderColor: 'primary.main',
                    mx: 'auto',
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 100, sm: 140 },
                      height: { xs: 100, sm: 140 },
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: { xs: '2.5rem', sm: '3.5rem' },
                      fontWeight: 'bold',
                    }}
                  >
                    {getInitials(person.name)}
                  </Avatar>
                </Box>
              ) : (
                <Box
                  component="img"
                  src={getHeroCardImage(person.id)}
                  alt={person.name}
                  sx={{
                    width: { xs: 150, sm: 200 },
                    height: { xs: 150, sm: 200 },
                    borderRadius: 2,
                    objectFit: 'cover',
                    boxShadow: 4,
                    border: '4px solid',
                    borderColor: 'primary.main',
                  }}
                  onError={() => {
                    setImageError(true);
                  }}
                />
              )}
              <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                {person.name}
              </Typography>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={viewMode} 
                onChange={(_, newValue) => setViewMode(newValue)}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  },
                }}
              >
                <Tab label="Info View" value="info" />
                <Tab label="Graph View" value="graph" />
              </Tabs>
            </Box>
            {viewMode === 'info' ? (
              <Box>
                <Box 
                  sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: 2, 
                    mb: 3 
                  }}
                >
                  {getPersonInfoFields(person).map((field) => (
                    <InfoCard key={field.label} label={field.label} value={field.value} />
                  ))}
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Films
                  </Typography>
                  {isLoadingFilms ? (
                    <Typography color="text.secondary">Loading films...</Typography>
                  ) : films.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      {films.map((film) => (
                        <Chip 
                          key={film.id} 
                          label={film.title} 
                          color="primary" 
                          variant="outlined"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
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

