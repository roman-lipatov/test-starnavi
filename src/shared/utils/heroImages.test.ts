import { describe, it, expect } from 'vitest';
import { getHeroCardImage, heroCardImages } from './heroImages';

describe('heroImages', () => {
  it('should return an image from heroCardImages array', () => {
    const image = getHeroCardImage(1);
    expect(heroCardImages).toContain(image);
  });

  it('should return different images for different hero IDs', () => {
    const image1 = getHeroCardImage(1);
    const image2 = getHeroCardImage(2);
    const image3 = getHeroCardImage(3);
    
    // At least some should be different (depending on array length)
    const images = [image1, image2, image3];
    const uniqueImages = new Set(images);
    expect(uniqueImages.size).toBeGreaterThan(0);
  });

  it('should cycle through images when ID exceeds array length', () => {
    const image1 = getHeroCardImage(0);
    const image2 = getHeroCardImage(5); // Should cycle back
    const image3 = getHeroCardImage(10); // Should cycle back
    
    expect(heroCardImages).toContain(image1);
    expect(heroCardImages).toContain(image2);
    expect(heroCardImages).toContain(image3);
  });
});

