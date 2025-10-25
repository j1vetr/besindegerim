// Seed script to import common Turkish foods from USDA
import { searchFoods, getFoodById, normalizeFoodData, generateSlug } from "./usda-client";
import { storage } from "./storage";

// Common Turkish foods with their USDA search queries
const turkishFoods = [
  { query: "tomato raw", turkishName: "Domates", fdcId: 170457 },
  { query: "apple raw", turkishName: "Elma", fdcId: 171688 },
  { query: "banana raw", turkishName: "Muz", fdcId: 173944 },
  { query: "chicken breast", turkishName: "Tavuk Göğsü", fdcId: 171477 },
  { query: "rice white", turkishName: "Pirinç", fdcId: 169756 },
  { query: "bread white", turkishName: "Beyaz Ekmek", fdcId: 172687 },
  { query: "milk whole", turkishName: "Süt", fdcId: 171265 },
  { query: "egg whole", turkishName: "Yumurta", fdcId: 173424 },
  { query: "cucumber raw", turkishName: "Salatalık", fdcId: 168409 },
  { query: "carrot raw", turkishName: "Havuç", fdcId: 170393 },
  { query: "potato raw", turkishName: "Patates", fdcId: 170026 },
  { query: "orange raw", turkishName: "Portakal", fdcId: 169097 },
  { query: "yogurt plain", turkishName: "Yoğurt", fdcId: 170903 },
  { query: "cheese cheddar", turkishName: "Kaşar Peyniri", fdcId: 173417 },
  { query: "beef ground", turkishName: "Kıyma", fdcId: 174032 },
];

async function seedDatabase() {
  console.log("🌱 Starting database seed...\n");

  let imported = 0;
  let skipped = 0;

  for (const food of turkishFoods) {
    try {
      // Check if already exists
      const existing = await storage.getFoodByFdcId(food.fdcId);
      if (existing) {
        console.log(`⏭️  Skipping ${food.turkishName} (already exists)`);
        skipped++;
        continue;
      }

      console.log(`📥 Importing ${food.turkishName}...`);

      // Fetch from USDA API
      const usdaFood = await getFoodById(food.fdcId);

      // Normalize to our schema
      const normalizedData = normalizeFoodData(usdaFood, food.turkishName);

      // Generate slug
      const slug = generateSlug(normalizedData.name);

      // Create in database
      const createdFood = await storage.createFood({
        ...normalizedData,
        slug,
      });

      console.log(`✅ Imported: ${createdFood.name} (${createdFood.calories} kcal per ${createdFood.servingLabel})\n`);
      imported++;

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`❌ Failed to import ${food.turkishName}:`, error);
    }
  }

  console.log(`\n🎉 Seed complete!`);
  console.log(`   Imported: ${imported} foods`);
  console.log(`   Skipped: ${skipped} foods (already exist)`);
}

// Run the seed
seedDatabase()
  .then(() => {
    console.log("\n✨ Database seeded successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  });
