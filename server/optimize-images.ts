import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { db } from './db';
import { foods } from '../shared/schema';
import { sql } from 'drizzle-orm';

async function optimizeImages() {
  const imagesDir = join(process.cwd(), 'client/public/food-images');
  const files = await readdir(imagesDir);
  
  console.log(`Found ${files.length} images to optimize...`);
  
  for (const file of files) {
    if (!file.endsWith('.png')) continue;
    
    const inputPath = join(imagesDir, file);
    const outputFile = file.replace('.png', '.webp');
    const outputPath = join(imagesDir, outputFile);
    
    try {
      // Optimize: resize to max 800px width, convert to WebP with 85% quality
      await sharp(inputPath)
        .resize(800, 600, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .webp({ quality: 85 })
        .toFile(outputPath);
      
      console.log(`✓ Optimized: ${file} -> ${outputFile}`);
    } catch (error) {
      console.error(`✗ Failed to optimize ${file}:`, error);
    }
  }
  
  console.log('\nUpdating database URLs...');
  
  // Update all /food-images/*.png URLs to *.webp
  await db.execute(sql`
    UPDATE foods 
    SET image_url = REPLACE(image_url, '.png', '.webp')
    WHERE image_url LIKE '/food-images/%.png'
  `);
  
  console.log('✓ Database updated successfully!');
  console.log('\nOptimization complete! 🎉');
  process.exit(0);
}

optimizeImages().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
