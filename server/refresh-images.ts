// Refresh images for existing foods using Wikipedia/Wikimedia Commons
import { storage } from "./storage";
import { getWikimediaImage } from "./wikipedia-client";

async function refreshImages() {
  console.log("🖼️  Refreshing images from Wikipedia/Wikimedia Commons...\n");

  try {
    // Get all foods from database
    const allFoods = await storage.getAllFoods(500);
    console.log(`📦 Found ${allFoods.length} foods in database\n`);

    let successCount = 0;
    let noImageCount = 0;
    let errorCount = 0;

    for (const food of allFoods) {
      try {
        console.log(`🔄 Updating image for: ${food.name}`);
        
        // Get image from Wikipedia/Wikimedia Commons (auto-translates Turkish to English)
        const imageUrl = await getWikimediaImage(food.name);
        
        if (imageUrl) {
          // Update food with new image URL
          await storage.updateFood(food.id, { imageUrl });
          console.log(`✅ Updated: ${food.name}`);
          successCount++;
        } else {
          console.log(`⚠️  No image found for: ${food.name} - keeping existing`);
          noImageCount++;
        }

        // Rate limiting: wait 1000ms between requests (be nice to Wikipedia)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Error updating ${food.name}:`, error);
        errorCount++;
      }
    }

    console.log(`\n✨ Image refresh complete!`);
    console.log(`✅ Updated: ${successCount}`);
    console.log(`⚠️  No image: ${noImageCount}`);
    console.log(`❌ Errors: ${errorCount}`);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }

  process.exit(0);
}

refreshImages();
