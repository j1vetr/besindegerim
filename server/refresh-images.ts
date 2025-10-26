// Refresh Pexels images for existing foods in database
import { storage } from "./storage";
import { searchPexelsImage } from "./pexels-client";

async function refreshImages() {
  console.log("🖼️  Refreshing Pexels images for all foods...\n");

  try {
    // Get all foods from database
    const allFoods = await storage.getAllFoods(500);
    console.log(`📦 Found ${allFoods.length} foods in database\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const food of allFoods) {
      try {
        console.log(`🔄 Updating image for: ${food.name}`);
        
        // Fetch new image from Pexels with improved search query
        const imageUrl = await searchPexelsImage(food.name);
        
        if (imageUrl) {
          // Update food with new image URL
          await storage.updateFood(food.id, { imageUrl });
          console.log(`✅ Updated: ${food.name}`);
          successCount++;
        } else {
          console.log(`⚠️  No image found for: ${food.name}`);
          errorCount++;
        }

        // Rate limiting: wait 500ms between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`❌ Error updating ${food.name}:`, error);
        errorCount++;
      }
    }

    console.log(`\n✨ Image refresh complete!`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }

  process.exit(0);
}

refreshImages();
