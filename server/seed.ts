// Seed script to import common Turkish foods from USDA
import { searchFoods, getFoodById, normalizeFoodDataWithImage, generateSlug } from "./usda-client";
import { storage } from "./storage";

// Common Turkish foods with their USDA search queries
const turkishFoods = [
  // Temel Karbonhidratlar
  { query: "bread white", turkishName: "Beyaz Ekmek", fdcId: 172687 },
  { query: "bread whole wheat", turkishName: "Kepekli Ekmek", fdcId: 172816 },
  { query: "toast bread", turkishName: "Tost Ekmeği", fdcId: 172687 },
  { query: "bagel plain", turkishName: "Simit", fdcId: 172666 },
  { query: "croissant", turkishName: "Kruvasan", fdcId: 172684 },
  { query: "pasta cooked", turkishName: "Makarna", fdcId: 169738 },
  { query: "spaghetti cooked", turkishName: "Spagetti", fdcId: 169738 },
  { query: "rice white cooked", turkishName: "Pirinç", fdcId: 169756 },
  { query: "bulgur cooked", turkishName: "Bulgur", fdcId: 170286 },
  { query: "oats", turkishName: "Yulaf Ezmesi", fdcId: 169705 },
  { query: "cornflakes", turkishName: "Mısır Gevreği", fdcId: 173901 },
  { query: "crackers", turkishName: "Kraker", fdcId: 174685 },
  { query: "potato chips", turkishName: "Cips", fdcId: 172335 },
  
  // Et, Tavuk ve Balık
  { query: "chicken breast", turkishName: "Tavuk Göğsü", fdcId: 171477 },
  { query: "chicken thigh", turkishName: "Tavuk But", fdcId: 173626 },
  { query: "chicken fried", turkishName: "Kızarmış Tavuk", fdcId: 171494 },
  { query: "turkey breast", turkishName: "Hindi Eti", fdcId: 171116 },
  { query: "beef ground", turkishName: "Kıyma", fdcId: 174032 },
  { query: "beef steak", turkishName: "Biftek", fdcId: 174032 },
  { query: "lamb", turkishName: "Kuzu Eti", fdcId: 174347 },
  { query: "sausage", turkishName: "Sosis", fdcId: 174582 },
  { query: "salami", turkishName: "Salam", fdcId: 173889 },
  { query: "fish salmon", turkishName: "Somon", fdcId: 175168 },
  { query: "fish tuna", turkishName: "Ton Balığı", fdcId: 175149 },
  { query: "shrimp", turkishName: "Karides", fdcId: 175180 },
  
  // Sebzeler
  { query: "tomato raw", turkishName: "Domates", fdcId: 170457 },
  { query: "cucumber raw", turkishName: "Salatalık", fdcId: 168409 },
  { query: "pepper bell", turkishName: "Dolmalık Biber", fdcId: 170108 },
  { query: "eggplant", turkishName: "Patlıcan", fdcId: 169228 },
  { query: "zucchini", turkishName: "Kabak", fdcId: 169291 },
  { query: "carrot raw", turkishName: "Havuç", fdcId: 170393 },
  { query: "potato raw", turkishName: "Patates", fdcId: 170026 },
  { query: "onion raw", turkishName: "Soğan", fdcId: 170000 },
  { query: "garlic raw", turkishName: "Sarımsak", fdcId: 169230 },
  { query: "broccoli raw", turkishName: "Brokoli", fdcId: 170379 },
  { query: "cauliflower raw", turkishName: "Karnabahar", fdcId: 170390 },
  { query: "spinach raw", turkishName: "Ispanak", fdcId: 168462 },
  { query: "lettuce raw", turkishName: "Marul", fdcId: 169248 },
  { query: "parsley raw", turkishName: "Maydanoz", fdcId: 170416 },
  { query: "green beans", turkishName: "Fasulye", fdcId: 169961 },
  { query: "mushrooms raw", turkishName: "Mantar", fdcId: 169251 },
  
  // Meyveler
  { query: "apple raw", turkishName: "Elma", fdcId: 171688 },
  { query: "pear raw", turkishName: "Armut", fdcId: 169118 },
  { query: "banana raw", turkishName: "Muz", fdcId: 173944 },
  { query: "strawberries raw", turkishName: "Çilek", fdcId: 167762 },
  { query: "cherries raw", turkishName: "Kiraz", fdcId: 173032 },
  { query: "watermelon raw", turkishName: "Karpuz", fdcId: 167765 },
  { query: "melon cantaloupe", turkishName: "Kavun", fdcId: 169092 },
  { query: "peach raw", turkishName: "Şeftali", fdcId: 169905 },
  { query: "apricot raw", turkishName: "Kayısı", fdcId: 171697 },
  { query: "orange raw", turkishName: "Portakal", fdcId: 169097 },
  { query: "tangerine raw", turkishName: "Mandalina", fdcId: 169103 },
  { query: "lemon raw", turkishName: "Limon", fdcId: 167747 },
  { query: "grapefruit raw", turkishName: "Greyfurt", fdcId: 173949 },
  { query: "grapes raw", turkishName: "Üzüm", fdcId: 174682 },
  { query: "kiwi raw", turkishName: "Kivi", fdcId: 173942 },
  { query: "avocado raw", turkishName: "Avokado", fdcId: 171705 },
  
  // Süt ve Süt Ürünleri
  { query: "milk whole", turkishName: "Süt", fdcId: 171265 },
  { query: "yogurt plain", turkishName: "Yoğurt", fdcId: 170903 },
  { query: "yogurt drink", turkishName: "Ayran", fdcId: 170903 },
  { query: "butter", turkishName: "Tereyağı", fdcId: 173410 },
  { query: "cheese cheddar", turkishName: "Kaşar Peyniri", fdcId: 173417 },
  { query: "cheese feta", turkishName: "Beyaz Peynir", fdcId: 172193 },
  { query: "cheese mozzarella", turkishName: "Mozzarella", fdcId: 173418 },
  { query: "cheese cottage", turkishName: "Lor Peyniri", fdcId: 170851 },
  { query: "cream", turkishName: "Krema", fdcId: 170859 },
  { query: "ice cream vanilla", turkishName: "Dondurma", fdcId: 170899 },
  
  // Yumurta & Kahvaltılıklar
  { query: "egg whole raw", turkishName: "Yumurta", fdcId: 173424 },
  { query: "egg fried", turkishName: "Sahanda Yumurta", fdcId: 173424 },
  { query: "egg boiled", turkishName: "Haşlanmış Yumurta", fdcId: 173424 },
  { query: "jam", turkishName: "Reçel", fdcId: 167768 },
  { query: "honey", turkishName: "Bal", fdcId: 169640 },
  { query: "peanut butter", turkishName: "Fıstık Ezmesi", fdcId: 172470 },
  { query: "olives", turkishName: "Zeytin", fdcId: 169094 },
  { query: "olive oil", turkishName: "Zeytinyağı", fdcId: 172336 },
  
  // Bakliyat & Kurubakla
  { query: "lentils cooked", turkishName: "Mercimek", fdcId: 169401 },
  { query: "chickpeas cooked", turkishName: "Nohut", fdcId: 173757 },
  { query: "beans kidney cooked", turkishName: "Kuru Fasulye", fdcId: 173735 },
  { query: "corn", turkishName: "Mısır", fdcId: 169998 },
  
  // Fast Food & Hazır
  { query: "hamburger", turkishName: "Hamburger", fdcId: 173869 },
  { query: "cheeseburger", turkishName: "Cheeseburger", fdcId: 173870 },
  { query: "pizza cheese", turkishName: "Pizza", fdcId: 174887 },
  { query: "french fries", turkishName: "Patates Kızartması", fdcId: 172336 },
  { query: "chicken nuggets", turkishName: "Nugget", fdcId: 172334 },
  { query: "hot dog", turkishName: "Hot Dog", fdcId: 174577 },
  
  // İçecekler
  { query: "water", turkishName: "Su", fdcId: 171288 },
  { query: "tea brewed", turkishName: "Çay", fdcId: 171890 },
  { query: "coffee brewed", turkishName: "Kahve", fdcId: 171890 },
  { query: "orange juice", turkishName: "Portakal Suyu", fdcId: 169098 },
  { query: "apple juice", turkishName: "Elma Suyu", fdcId: 167753 },
  { query: "cola", turkishName: "Kola", fdcId: 174851 },
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

      // Normalize to our schema and fetch image
      const normalizedData = await normalizeFoodDataWithImage(usdaFood, food.turkishName);

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
