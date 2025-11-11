import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import type { Person } from '@/shared/types/api';
import { getHeroCardImage } from '@/shared/utils/heroImages';

export const HeroCard = ({ person, onClick }: { person: Person; onClick: () => void }) => {
  const cardImage = getHeroCardImage(person.id);

  return (
    <Card 
      onClick={onClick} 
      sx={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={cardImage}
        alt={person.name}
        sx={{
          objectFit: 'cover',
        }}
        onError={(e) => {
          // Fallback to a default image if the image fails to load
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400/1976d2/ffffff?text=Star+Wars';
        }}
      />
      <CardContent>
        <Typography variant="h6" component="div" noWrap>
          {person.name}
        </Typography>
      </CardContent>
    </Card>
  );
};