
export const heroCardImages = [
  'https://images.unsplash.com/photo-1533616688419-b7a585564566?w=400&h=400&fit=crop&q=80', // Space/Star Wars theme
  'https://images.unsplash.com/photo-1579935110464-fcd041be62d0?w=400&h=400&fit=crop&q=80', // Galaxy stars
  'https://images.unsplash.com/photo-1524169358666-79f22534bc6e?w=400&h=400&fit=crop&q=80', // Space battle
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop&q=80', // Sci-fi space
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&q=80', // Space nebula
];

export const getHeroCardImage = (heroId: number): string => {
  const imageIndex = heroId % heroCardImages.length;
  return heroCardImages[imageIndex];
};

