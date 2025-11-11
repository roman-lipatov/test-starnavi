import { Card, CardContent, CardMedia, Typography, Box, Chip, Avatar } from '@mui/material';
import type { Person } from '@/shared/types/api';
import { getHeroCardImage } from '@/shared/utils/heroImages';
import { getInitials } from '@/shared/utils/getInitials';
import { useState } from 'react';

export const HeroCard = ({ person, onClick }: { person: Person; onClick: () => void }) => {
  const cardImage = getHeroCardImage(person.id);
  const [imageError, setImageError] = useState(false);

  return (
    <Card 
      onClick={onClick} 
      sx={{ 
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: 8,
        },
      }}
    >
      {imageError ? (
        <Box
          sx={{
            height: 240,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'primary.main',
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '3rem',
              fontWeight: 'bold',
            }}
          >
            {getInitials(person.name)}
          </Avatar>
        </Box>
      ) : (
        <CardMedia
          component="img"
          height="240"
          image={cardImage}
          alt={person.name}
          sx={{
            objectFit: 'cover',
            backgroundColor: 'grey.200',
          }}
          onError={() => {
            setImageError(true);
          }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
          {person.name}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 'auto' }}>
          <Chip 
            label={`${person.films.length} ${person.films.length === 1 ? 'Film' : 'Films'}`}
            size="small"
            color="primary"
            variant="outlined"
          />
          {person.starships.length > 0 && (
            <Chip 
              label={`${person.starships.length} ${person.starships.length === 1 ? 'Starship' : 'Starships'}`}
              size="small"
              color="secondary"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};