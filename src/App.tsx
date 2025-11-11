import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { HeroList } from './features/hero-list/components/HeroList';
import { HeroDetails } from './features/hero-details/components/HeroDetails';

function App() {
  const [selectedHeroId, setSelectedHeroId] = useState<number | null>(null);

  const handleHeroClick = (heroId: number) => {
    setSelectedHeroId(heroId);
  };

  const handleCloseDetails = () => {
    setSelectedHeroId(null);
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ mb: { xs: 3, sm: 4 }, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', sm: '3rem' },
            fontWeight: 'bold',
          }}
        >
          Star Wars Heroes
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          Explore the galaxy of Star Wars characters
        </Typography>
      </Box>
      <HeroList onHeroClick={handleHeroClick} />
      {selectedHeroId && (
        <HeroDetails heroId={selectedHeroId} onClose={handleCloseDetails} />
      )}
    </Container>
  );
}

export default App;
