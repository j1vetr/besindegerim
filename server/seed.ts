// Seed script to import common Turkish foods from USDA with categories
import { searchFoods, getFoodById, normalizeFoodDataWithImage, generateSlug } from "./usda-client";
import { storage } from "./storage";

// Common Turkish foods with their USDA search queries and categories
const turkishFoods = [
  // Tahıllar & Ekmekler
  { query: "bread white", turkishName: "Beyaz Ekmek", fdcId: 172687, category: "Tahıllar & Ekmekler" },
  { query: "bread whole wheat", turkishName: "Kepekli Ekmek", fdcId: 172816, category: "Tahıllar & Ekmekler" },
  { query: "toast bread", turkishName: "Tost Ekmeği", fdcId: 172687, category: "Tahıllar & Ekmekler" },
  { query: "bagel plain", turkishName: "Simit", fdcId: 172666, category: "Tahıllar & Ekmekler" },
  { query: "croissant", turkishName: "Kruvasan", fdcId: 172684, category: "Tahıllar & Ekmekler" },
  { query: "pasta cooked", turkishName: "Makarna", fdcId: 169738, category: "Tahıllar & Ekmekler" },
  { query: "spaghetti cooked", turkishName: "Spagetti", fdcId: 169738, category: "Tahıllar & Ekmekler" },
  { query: "rice white cooked", turkishName: "Pirinç", fdcId: 169756, category: "Tahıllar & Ekmekler" },
  { query: "bulgur cooked", turkishName: "Bulgur", fdcId: 170286, category: "Tahıllar & Ekmekler" },
  { query: "oats", turkishName: "Yulaf Ezmesi", fdcId: 169705, category: "Tahıllar & Ekmekler" },
  { query: "cornflakes", turkishName: "Mısır Gevreği", fdcId: 173901, category: "Tahıllar & Ekmekler" },
  { query: "crackers", turkishName: "Kraker", fdcId: 174685, category: "Tahıllar & Ekmekler" },
  { query: "potato chips", turkishName: "Cips", fdcId: 172335, category: "Atıştırmalıklar" },
  
  // Et & Tavuk
  { query: "chicken breast", turkishName: "Tavuk Göğsü", fdcId: 171477, category: "Et & Tavuk" },
  { query: "chicken thigh", turkishName: "Tavuk But", fdcId: 173626, category: "Et & Tavuk" },
  { query: "chicken fried", turkishName: "Kızarmış Tavuk", fdcId: 171494, category: "Et & Tavuk" },
  { query: "turkey breast", turkishName: "Hindi Eti", fdcId: 171116, category: "Et & Tavuk" },
  { query: "beef ground", turkishName: "Kıyma", fdcId: 174032, category: "Et & Tavuk" },
  { query: "beef steak", turkishName: "Biftek", fdcId: 174032, category: "Et & Tavuk" },
  { query: "lamb", turkishName: "Kuzu Eti", fdcId: 174347, category: "Et & Tavuk" },
  { query: "sausage", turkishName: "Sosis", fdcId: 174582, category: "Et & Tavuk" },
  { query: "salami", turkishName: "Salam", fdcId: 173889, category: "Et & Tavuk" },
  
  // Balık & Deniz Ürünleri
  { query: "fish salmon", turkishName: "Somon", fdcId: 175168, category: "Balık & Deniz Ürünleri" },
  { query: "fish tuna", turkishName: "Ton Balığı", fdcId: 175149, category: "Balık & Deniz Ürünleri" },
  { query: "shrimp", turkishName: "Karides", fdcId: 175180, category: "Balık & Deniz Ürünleri" },
  
  // Sebzeler
  { query: "tomato raw", turkishName: "Domates", fdcId: 170457, category: "Sebzeler" },
  { query: "cucumber raw", turkishName: "Salatalık", fdcId: 168409, category: "Sebzeler" },
  { query: "pepper bell", turkishName: "Dolmalık Biber", fdcId: 170108, category: "Sebzeler" },
  { query: "eggplant", turkishName: "Patlıcan", fdcId: 169228, category: "Sebzeler" },
  { query: "zucchini", turkishName: "Kabak", fdcId: 169291, category: "Sebzeler" },
  { query: "carrot raw", turkishName: "Havuç", fdcId: 170393, category: "Sebzeler" },
  { query: "potato raw", turkishName: "Patates", fdcId: 170026, category: "Sebzeler" },
  { query: "onion raw", turkishName: "Soğan", fdcId: 170000, category: "Sebzeler" },
  { query: "garlic raw", turkishName: "Sarımsak", fdcId: 169230, category: "Sebzeler" },
  { query: "broccoli raw", turkishName: "Brokoli", fdcId: 170379, category: "Sebzeler" },
  { query: "cauliflower raw", turkishName: "Karnabahar", fdcId: 170390, category: "Sebzeler" },
  { query: "spinach raw", turkishName: "Ispanak", fdcId: 168462, category: "Sebzeler" },
  { query: "lettuce raw", turkishName: "Marul", fdcId: 169248, category: "Sebzeler" },
  { query: "parsley raw", turkishName: "Maydanoz", fdcId: 170416, category: "Sebzeler" },
  { query: "green beans", turkishName: "Fasulye", fdcId: 169961, category: "Sebzeler" },
  { query: "mushrooms raw", turkishName: "Mantar", fdcId: 169251, category: "Sebzeler" },
  
  // Meyveler
  { query: "apple raw", turkishName: "Elma", fdcId: 171688, category: "Meyveler" },
  { query: "pear raw", turkishName: "Armut", fdcId: 169118, category: "Meyveler" },
  { query: "banana raw", turkishName: "Muz", fdcId: 173944, category: "Meyveler" },
  { query: "strawberries raw", turkishName: "Çilek", fdcId: 167762, category: "Meyveler" },
  { query: "cherries raw", turkishName: "Kiraz", fdcId: 173032, category: "Meyveler" },
  { query: "watermelon raw", turkishName: "Karpuz", fdcId: 167765, category: "Meyveler" },
  { query: "melon cantaloupe", turkishName: "Kavun", fdcId: 169092, category: "Meyveler" },
  { query: "peach raw", turkishName: "Şeftali", fdcId: 169905, category: "Meyveler" },
  { query: "apricot raw", turkishName: "Kayısı", fdcId: 171697, category: "Meyveler" },
  { query: "orange raw", turkishName: "Portakal", fdcId: 169097, category: "Meyveler" },
  { query: "tangerine raw", turkishName: "Mandalina", fdcId: 169103, category: "Meyveler" },
  { query: "lemon raw", turkishName: "Limon", fdcId: 167747, category: "Meyveler" },
  { query: "grapefruit raw", turkishName: "Greyfurt", fdcId: 173949, category: "Meyveler" },
  { query: "grapes raw", turkishName: "Üzüm", fdcId: 174682, category: "Meyveler" },
  { query: "kiwi raw", turkishName: "Kivi", fdcId: 173942, category: "Meyveler" },
  { query: "avocado raw", turkishName: "Avokado", fdcId: 171705, category: "Meyveler" },
  
  // Süt Ürünleri
  { query: "milk whole", turkishName: "Süt", fdcId: 171265, category: "Süt Ürünleri" },
  { query: "yogurt plain", turkishName: "Yoğurt", fdcId: 170903, category: "Süt Ürünleri" },
  { query: "yogurt drink", turkishName: "Ayran", fdcId: 170903, category: "Süt Ürünleri" },
  { query: "butter", turkishName: "Tereyağı", fdcId: 173410, category: "Süt Ürünleri" },
  { query: "cheese cheddar", turkishName: "Kaşar Peyniri", fdcId: 173417, category: "Süt Ürünleri" },
  { query: "cheese feta", turkishName: "Beyaz Peynir", fdcId: 172193, category: "Süt Ürünleri" },
  { query: "cheese mozzarella", turkishName: "Mozzarella", fdcId: 173418, category: "Süt Ürünleri" },
  { query: "cheese cottage", turkishName: "Lor Peyniri", fdcId: 170851, category: "Süt Ürünleri" },
  { query: "cream", turkishName: "Krema", fdcId: 170859, category: "Süt Ürünleri" },
  { query: "ice cream vanilla", turkishName: "Dondurma", fdcId: 170899, category: "Süt Ürünleri" },
  
  // Yumurta & Kahvaltılıklar
  { query: "egg whole raw", turkishName: "Yumurta", fdcId: 173424, category: "Yumurta & Kahvaltılıklar" },
  { query: "egg fried", turkishName: "Sahanda Yumurta", fdcId: 173424, category: "Yumurta & Kahvaltılıklar" },
  { query: "egg boiled", turkishName: "Haşlanmış Yumurta", fdcId: 173424, category: "Yumurta & Kahvaltılıklar" },
  { query: "jam", turkishName: "Reçel", fdcId: 167768, category: "Yumurta & Kahvaltılıklar" },
  { query: "honey", turkishName: "Bal", fdcId: 169640, category: "Yumurta & Kahvaltılıklar" },
  { query: "peanut butter", turkishName: "Fıstık Ezmesi", fdcId: 172470, category: "Yumurta & Kahvaltılıklar" },
  { query: "olives", turkishName: "Zeytin", fdcId: 169094, category: "Yumurta & Kahvaltılıklar" },
  { query: "olive oil", turkishName: "Zeytinyağı", fdcId: 172336, category: "Yumurta & Kahvaltılıklar" },
  
  // Bakliyat
  { query: "lentils cooked", turkishName: "Mercimek", fdcId: 169401, category: "Bakliyat" },
  { query: "chickpeas cooked", turkishName: "Nohut", fdcId: 173757, category: "Bakliyat" },
  { query: "beans kidney cooked", turkishName: "Kuru Fasulye", fdcId: 173735, category: "Bakliyat" },
  { query: "corn", turkishName: "Mısır", fdcId: 169998, category: "Bakliyat" },
  
  // Fast Food
  { query: "hamburger", turkishName: "Hamburger", fdcId: 173869, category: "Fast Food" },
  { query: "cheeseburger", turkishName: "Cheeseburger", fdcId: 173870, category: "Fast Food" },
  { query: "pizza cheese", turkishName: "Pizza", fdcId: 174887, category: "Fast Food" },
  { query: "french fries", turkishName: "Patates Kızartması", fdcId: 172336, category: "Fast Food" },
  { query: "chicken nuggets", turkishName: "Nugget", fdcId: 172334, category: "Fast Food" },
  { query: "hot dog", turkishName: "Hot Dog", fdcId: 174577, category: "Fast Food" },
  
  // İçecekler
  { query: "water", turkishName: "Su", fdcId: 171288, category: "İçecekler" },
  { query: "tea brewed", turkishName: "Çay", fdcId: 171890, category: "İçecekler" },
  { query: "coffee brewed", turkishName: "Kahve", fdcId: 171890, category: "İçecekler" },
  { query: "orange juice", turkishName: "Portakal Suyu", fdcId: 169098, category: "İçecekler" },
  { query: "apple juice", turkishName: "Elma Suyu", fdcId: 167753, category: "İçecekler" },
  { query: "cola", turkishName: "Kola", fdcId: 174851, category: "İçecekler" },
];

async function seedDatabase() {
  console.log("🌱 Starting database seed with categories and Pexels images...\n");

  let imported = 0;
  let skipped = 0;

  for (const food of turkishFoods) {
    try {
      // Check if already exists
      const existing = await storage.getFoodByFdcId(food.fdcId);
      if (existing) {
        // Update existing food with latest data (image + serving label + category)
        console.log(`🔄 Updating ${food.turkishName}...`);
        const usdaFood = await getFoodById(food.fdcId);
        const normalizedData = await normalizeFoodDataWithImage(usdaFood, food.turkishName, food.category);
        
        // Always update - normalizeFoodDataWithImage guarantees imageUrl (Pexels)
        await storage.updateFood(existing.id, {
          category: normalizedData.category,
          imageUrl: normalizedData.imageUrl, // Pexels image
          servingLabel: normalizedData.servingLabel, // Turkish gram-based label
        });
        console.log(`✅ Updated: ${food.turkishName} (${food.category})\n`);
        skipped++;
        continue;
      }

      console.log(`📥 Importing ${food.turkishName}...`);

      // Fetch from USDA API
      const usdaFood = await getFoodById(food.fdcId);

      // Normalize to our schema and fetch Pexels image
      const normalizedData = await normalizeFoodDataWithImage(usdaFood, food.turkishName, food.category);

      // Generate slug
      const slug = generateSlug(normalizedData.name);

      // Create in database
      const createdFood = await storage.createFood({
        ...normalizedData,
        slug,
      });

      console.log(`✅ Imported: ${createdFood.name} (${createdFood.calories} kcal per ${createdFood.servingLabel}) [${food.category}]\n`);
      imported++;

      // Add a small delay to avoid Pexels rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Failed to import ${food.turkishName}:`, error);
    }
  }

  console.log(`\n🎉 Seed complete!`);
  console.log(`   Imported: ${imported} foods`);
  console.log(`   Skipped: ${skipped} foods (already exist)`);
}

// Main execution
async function main() {
  try {
    await seedDatabase();
    console.log("\n✨ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

main();
