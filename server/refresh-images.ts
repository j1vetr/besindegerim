// Refresh images for existing foods with filtering + Wikipedia fallback
import { storage } from "./storage";
import { searchPexelsImage } from "./pexels-client";
import { getWikipediaImage } from "./wikipedia-client";

async function refreshImages() {
  console.log("🖼️  Refreshing images with Pexels filtering + Wikipedia fallback...\n");

  try {
    // Get all foods from database
    const allFoods = await storage.getAllFoods(500);
    console.log(`📦 Found ${allFoods.length} foods in database\n`);

    let pexelsCount = 0;
    let wikipediaCount = 0;
    let placeholderCount = 0;
    let errorCount = 0;

    for (const food of allFoods) {
      try {
        console.log(`🔄 Updating image for: ${food.name}`);
        
        // Try Pexels first (with filtering)
        let imageUrl = await searchPexelsImage(food.name, food.name);
        let source = 'pexels';
        
        // If Pexels fails, try Wikipedia (only with English names to avoid encoding issues)
        if (!imageUrl && food.nameEn) {
          console.log(`  📚 Trying Wikipedia for: ${food.nameEn}`);
          imageUrl = await getWikipediaImage(food.nameEn);
          source = 'wikipedia';
        }
        
        if (imageUrl) {
          // Update food with new image URL
          await storage.updateFood(food.id, { imageUrl });
          console.log(`✅ Updated: ${food.name} (source: ${source})`);
          
          if (source === 'pexels') pexelsCount++;
          else if (source === 'wikipedia') wikipediaCount++;
        } else {
          console.log(`⚠️  No image found for: ${food.name} - keeping existing`);
          placeholderCount++;
        }

        // Rate limiting: wait 600ms between requests (to be safe with APIs)
        await new Promise(resolve => setTimeout(resolve, 600));
      } catch (error) {
        console.error(`❌ Error updating ${food.name}:`, error);
        errorCount++;
      }
    }

    console.log(`\n✨ Image refresh complete!`);
    console.log(`📸 Pexels: ${pexelsCount}`);
    console.log(`📚 Wikipedia: ${wikipediaCount}`);
    console.log(`⚠️  No update: ${placeholderCount}`);
    console.log(`❌ Errors: ${errorCount}`);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }

  process.exit(0);
}

refreshImages();
