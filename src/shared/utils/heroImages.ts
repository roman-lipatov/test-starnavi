/**
 * Get hero image URL from starwars-visualguide.com
 * Falls back to placeholder if image is not available
 */
export const getHeroCardImage = (heroId: number): string => {
  // starwars-visualguide.com uses character IDs for images
  return `https://starwars-visualguide.com/assets/img/characters/${heroId}.jpg`;
};

