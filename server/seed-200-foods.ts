import { db } from './db';
import { storage } from './storage';
import { searchFoods, getFoodById, normalizeFoodData, generateSlug } from './usda-client';
import { cache } from './cache';

// Import a food from USDA by query
async function importFoodFromUSDA(query: string, turkishName?: string): Promise<{ success: boolean; message?: string; food?: any }> {
  try {
    // Search USDA for the food
    const searchResults = await searchFoods(query, 5);
    
    if (!searchResults || searchResults.length === 0) {
      return { success: false, message: `No results found for "${query}"` };
    }
    
    // Get the first result
    const firstResult = searchResults[0];
    const fdcId = firstResult.fdcId;
    
    // Check if already exists
    const existing = await storage.getFoodByFdcId(fdcId);
    if (existing) {
      return { success: false, message: `Food already exists: ${existing.name}` };
    }
    
    // Fetch detailed data
    const usdaFood = await getFoodById(fdcId);
    
    // Normalize to our schema
    const normalizedData = normalizeFoodData(usdaFood, turkishName);
    
    // Generate slug
    const slug = generateSlug(normalizedData.name);
    
    // Create in database
    const food = await storage.createFood({
      ...normalizedData,
      slug,
    });
    
    // Clear caches
    cache.delete("popular_foods");
    cache.delete("sitemap_foods");
    
    return { success: true, food };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// Türkiye'de en çok tüketilen 200+ besin
const turkishFoods = [
  // ET VE TAVUK (25 çeşit)
  { query: "beef, ground", turkishName: "Kıyma (Dana)" },
  { query: "beef, chuck", turkishName: "Dana Bonfile" },
  { query: "beef, ribeye", turkishName: "Dana Antrikot" },
  { query: "lamb, leg", turkishName: "Kuzu Eti" },
  { query: "lamb, ground", turkishName: "Kuzu Kıyma" },
  { query: "chicken breast", turkishName: "Tavuk Göğsü" },
  { query: "chicken thigh", turkishName: "Tavuk But" },
  { query: "chicken wing", turkishName: "Tavuk Kanat" },
  { query: "turkey breast", turkishName: "Hindi Göğsü" },
  { query: "turkey, ground", turkishName: "Hindi Kıyma" },
  { query: "sausage, beef", turkishName: "Sosis" },
  { query: "bacon", turkishName: "Bacon" },
  { query: "salami", turkishName: "Salam" },
  { query: "bologna", turkishName: "Dana Jambon" },
  { query: "liver, beef", turkishName: "Dana Ciğeri" },
  { query: "liver, chicken", turkishName: "Tavuk Ciğeri" },
  { query: "meatball", turkishName: "Köfte" },
  { query: "ham", turkishName: "Jambon" },
  { query: "pastrami", turkishName: "Pastırma" },
  { query: "duck meat", turkishName: "Ördek Eti" },
  
  // SÜT ÜRÜNLERİ (20 çeşit)
  { query: "milk, whole", turkishName: "Tam Yağlı Süt" },
  { query: "milk, low fat", turkishName: "Az Yağlı Süt" },
  { query: "milk, skim", turkishName: "Yağsız Süt" },
  { query: "yogurt, plain", turkishName: "Yoğurt (Sade)" },
  { query: "yogurt, greek", turkishName: "Süzme Yoğurt" },
  { query: "yogurt, low fat", turkishName: "Az Yağlı Yoğurt" },
  { query: "kefir", turkishName: "Kefir" },
  { query: "ayran", turkishName: "Ayran" },
  { query: "cheese, cheddar", turkishName: "Kaşar Peyniri" },
  { query: "cheese, feta", turkishName: "Beyaz Peynir" },
  { query: "cheese, mozzarella", turkishName: "Mozzarella" },
  { query: "cheese, cottage", turkishName: "Lor Peyniri" },
  { query: "cheese, cream", turkishName: "Krem Peynir" },
  { query: "cheese, goat", turkishName: "Keçi Peyniri" },
  { query: "butter", turkishName: "Tereyağı" },
  { query: "cream, heavy", turkishName: "Krema" },
  { query: "cream, sour", turkishName: "Ekşi Krema" },
  { query: "ice cream, vanilla", turkishName: "Dondurma (Vanilyalı)" },
  { query: "ice cream, chocolate", turkishName: "Dondurma (Çikolatalı)" },
  
  // DENİZ ÜRÜNLERİ (20 çeşit)
  { query: "salmon, raw", turkishName: "Somon Balığı" },
  { query: "tuna, raw", turkishName: "Ton Balığı" },
  { query: "sea bass", turkishName: "Levrek" },
  { query: "sea bream", turkishName: "Çipura" },
  { query: "anchovy", turkishName: "Hamsi" },
  { query: "mackerel", turkishName: "Uskumru" },
  { query: "sardines", turkishName: "Sardalya" },
  { query: "trout", turkishName: "Alabalık" },
  { query: "cod", turkishName: "Morina Balığı" },
  { query: "shrimp, raw", turkishName: "Karides" },
  { query: "squid", turkishName: "Kalamar" },
  { query: "octopus", turkishName: "Ahtapot" },
  { query: "mussels", turkishName: "Midye" },
  { query: "clams", turkishName: "İstiridye" },
  { query: "crab", turkishName: "Yengeç" },
  { query: "lobster", turkishName: "Istakoz" },
  { query: "tuna, canned", turkishName: "Konserve Ton Balığı" },
  
  // YUMURTA (3 çeşit)
  { query: "egg, whole, raw", turkishName: "Yumurta (Çiğ)" },
  { query: "egg, white, raw", turkishName: "Yumurta Akı" },
  { query: "egg, yolk, raw", turkishName: "Yumurta Sarısı" },
  
  // MEYVELER (35 çeşit)
  { query: "orange", turkishName: "Portakal" },
  { query: "mandarin", turkishName: "Mandalina" },
  { query: "grapefruit", turkishName: "Greyfurt" },
  { query: "grape", turkishName: "Üzüm" },
  { query: "watermelon", turkishName: "Karpuz" },
  { query: "melon", turkishName: "Kavun" },
  { query: "strawberry", turkishName: "Çilek" },
  { query: "cherry", turkishName: "Kiraz" },
  { query: "apricot", turkishName: "Kayısı" },
  { query: "peach", turkishName: "Şeftali" },
  { query: "nectarine", turkishName: "Nektarin" },
  { query: "plum", turkishName: "Erik" },
  { query: "pomegranate", turkishName: "Nar" },
  { query: "fig", turkishName: "İncir" },
  { query: "kiwi", turkishName: "Kivi" },
  { query: "pineapple", turkishName: "Ananas" },
  { query: "mango", turkishName: "Mango" },
  { query: "papaya", turkishName: "Papaya" },
  { query: "avocado", turkishName: "Avokado" },
  { query: "banana", turkishName: "Muz" },
  { query: "blackberry", turkishName: "Böğürtlen" },
  { query: "raspberry", turkishName: "Ahududu" },
  { query: "blueberry", turkishName: "Yaban Mersini" },
  { query: "cranberry", turkishName: "Kızılcık" },
  { query: "date", turkishName: "Hurma" },
  { query: "raisins", turkishName: "Kuru Üzüm" },
  { query: "dried apricot", turkishName: "Kuru Kayısı" },
  { query: "dried fig", turkishName: "Kuru İncir" },
  { query: "prune", turkishName: "Kuru Erik" },
  { query: "coconut", turkishName: "Hindistan Cevizi" },
  { query: "lychee", turkishName: "Lişe" },
  { query: "persimmon", turkishName: "Cennet Hurması" },
  { query: "quince", turkishName: "Ayva" },
  
  // SEBZELER (35 çeşit)
  { query: "eggplant", turkishName: "Patlıcan" },
  { query: "zucchini", turkishName: "Kabak (Sakız)" },
  { query: "cucumber", turkishName: "Salatalık" },
  { query: "lettuce, iceberg", turkishName: "Marul (Buzdolabı)" },
  { query: "lettuce, romaine", turkishName: "Marul (Yeşil)" },
  { query: "arugula", turkishName: "Roka" },
  { query: "spinach, raw", turkishName: "Ispanak (Çiğ)" },
  { query: "radish", turkishName: "Turp" },
  { query: "turnip", turkishName: "Şalgam" },
  { query: "beet", turkishName: "Pancar" },
  { query: "potato", turkishName: "Patates" },
  { query: "sweet potato", turkishName: "Tatlı Patates" },
  { query: "onion", turkishName: "Soğan" },
  { query: "garlic", turkishName: "Sarımsak" },
  { query: "leek", turkishName: "Pırasa" },
  { query: "scallion", turkishName: "Yeşil Soğan" },
  { query: "ginger", turkishName: "Zencefil" },
  { query: "mushroom, white", turkishName: "Mantar (Beyaz)" },
  { query: "mushroom, portobello", turkishName: "Mantar (Portobello)" },
  { query: "corn, sweet", turkishName: "Mısır (Tatlı)" },
  { query: "peas, green", turkishName: "Bezelye (Yeşil)" },
  { query: "green bean", turkishName: "Taze Fasulye" },
  { query: "okra", turkishName: "Bamya (Taze)" },
  { query: "pepper, jalapeno", turkishName: "Jalapeno Biber" },
  { query: "chili pepper", turkishName: "Acı Biber (Kırmızı)" },
  { query: "tomato, cherry", turkishName: "Çeri Domates" },
  { query: "tomato, sun-dried", turkishName: "Kurutulmuş Domates" },
  { query: "parsley", turkishName: "Maydanoz" },
  { query: "cilantro", turkishName: "Kişniş" },
  { query: "basil", turkishName: "Fesleğen" },
  { query: "mint", turkishName: "Nane" },
  { query: "dill", turkishName: "Dereotu" },
  { query: "thyme", turkishName: "Kekik" },
  { query: "rosemary", turkishName: "Biberiye" },
  { query: "oregano", turkishName: "Kekik (Oregan)" },
  
  // KURUYEMİŞLER VE TOHUMLAR (20 çeşit)
  { query: "walnut", turkishName: "Ceviz" },
  { query: "almond", turkishName: "Badem" },
  { query: "hazelnut", turkishName: "Fındık" },
  { query: "pistachio", turkishName: "Antep Fıstığı" },
  { query: "cashew", turkishName: "Kaju" },
  { query: "peanut", turkishName: "Yer Fıstığı" },
  { query: "peanut butter", turkishName: "Fıstık Ezmesi" },
  { query: "sunflower seeds", turkishName: "Ayçiçek Çekirdeği" },
  { query: "pumpkin seeds", turkishName: "Kabak Çekirdeği" },
  { query: "sesame seeds", turkishName: "Susam" },
  { query: "tahini", turkishName: "Tahin" },
  { query: "chia seeds", turkishName: "Chia Tohumu" },
  { query: "flaxseed", turkishName: "Keten Tohumu" },
  { query: "poppy seeds", turkishName: "Haşhaş" },
  { query: "pine nuts", turkishName: "Çam Fıstığı" },
  { query: "macadamia", turkishName: "Makadamya" },
  { query: "pecan", turkishName: "Pekan Cevizi" },
  
  // YAĞLAR VE SOSLAR (15 çeşit)
  { query: "olive oil", turkishName: "Zeytinyağı" },
  { query: "olive oil, extra virgin", turkishName: "Sızma Zeytinyağı" },
  { query: "sunflower oil", turkishName: "Ayçiçek Yağı" },
  { query: "corn oil", turkishName: "Mısır Yağı" },
  { query: "canola oil", turkishName: "Kanola Yağı" },
  { query: "coconut oil", turkishName: "Hindistan Cevizi Yağı" },
  { query: "sesame oil", turkishName: "Susam Yağı" },
  { query: "mayonnaise", turkishName: "Mayonez" },
  { query: "ketchup", turkishName: "Ketçap" },
  { query: "mustard", turkishName: "Hardal" },
  { query: "soy sauce", turkishName: "Soya Sosu" },
  { query: "vinegar, balsamic", turkishName: "Balzamik Sirke" },
  { query: "vinegar, apple cider", turkishName: "Elma Sirkesi" },
  { query: "hot sauce", turkishName: "Acı Sos" },
  
  // TATLILAR VE ŞEKERLER (15 çeşit)
  { query: "honey", turkishName: "Bal" },
  { query: "sugar, white", turkishName: "Beyaz Şeker" },
  { query: "sugar, brown", turkishName: "Esmer Şeker" },
  { query: "maple syrup", turkishName: "Akçaağaç Şurubu" },
  { query: "molasses", turkishName: "Pekmez" },
  { query: "jam, strawberry", turkishName: "Çilek Reçeli" },
  { query: "jam, apricot", turkishName: "Kayısı Reçeli" },
  { query: "chocolate, dark", turkishName: "Bitter Çikolata" },
  { query: "chocolate, milk", turkishName: "Sütlü Çikolata" },
  { query: "chocolate, white", turkishName: "Beyaz Çikolata" },
  { query: "nutella", turkishName: "Fındık Kreması" },
  { query: "marshmallow", turkishName: "Marshmallow" },
  { query: "jelly", turkishName: "Jöle" },
  
  // EKMEK VE HAMUR İŞLERİ (15 çeşit)
  { query: "bread, multigrain", turkishName: "Tam Tahıllı Ekmek" },
  { query: "bread, rye", turkishName: "Çavdar Ekmeği" },
  { query: "bagel", turkishName: "Simit (Bagel)" },
  { query: "pita bread", turkishName: "Pide Ekmeği" },
  { query: "naan", turkishName: "Naan Ekmeği" },
  { query: "pasta, spaghetti", turkishName: "Makarna (Spagetti)" },
  { query: "pasta, penne", turkishName: "Makarna (Penne)" },
  { query: "pasta, fusilli", turkishName: "Makarna (Burgu)" },
  { query: "lasagna noodles", turkishName: "Lazanya" },
  { query: "pancake", turkishName: "Pankek" },
  { query: "waffle", turkishName: "Waffle" },
  { query: "muffin, blueberry", turkishName: "Muffin (Yaban Mersinli)" },
  { query: "doughnut", turkishName: "Donut" },
  { query: "pizza dough", turkishName: "Pizza Hamuru" },
  
  // İÇECEKLER VE DİĞER (10 çeşit)
  { query: "coffee, brewed", turkishName: "Kahve (Demleme)" },
  { query: "tea, black", turkishName: "Siyah Çay" },
  { query: "tea, green", turkishName: "Yeşil Çay" },
  { query: "orange juice", turkishName: "Portakal Suyu" },
  { query: "apple juice", turkishName: "Elma Suyu" },
  { query: "tomato juice", turkishName: "Domates Suyu" },
  { query: "cola", turkishName: "Kola" },
  { query: "lemonade", turkishName: "Limonata" },
  { query: "protein powder", turkishName: "Protein Tozu" },
  { query: "tofu", turkishName: "Tofu" },
];

async function seedFoods() {
  console.log(`Starting import of ${turkishFoods.length} Turkish foods...`);
  
  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;
  
  for (let i = 0; i < turkishFoods.length; i++) {
    const food = turkishFoods[i];
    console.log(`\n[${i + 1}/${turkishFoods.length}] Processing: ${food.turkishName} (${food.query})`);
    
    try {
      // USDA'dan ara ve import et
      const result = await importFoodFromUSDA(food.query, food.turkishName);
      
      if (result.success) {
        successCount++;
        console.log(`✓ Successfully imported: ${food.turkishName}`);
      } else {
        if (result.message?.includes('already exists')) {
          skippedCount++;
          console.log(`⊘ Skipped (already exists): ${food.turkishName}`);
        } else {
          failCount++;
          console.log(`✗ Failed: ${food.turkishName} - ${result.message}`);
        }
      }
      
      // USDA API rate limiting - wait 1.2 seconds between requests
      await new Promise(resolve => setTimeout(resolve, 1200));
      
    } catch (error) {
      failCount++;
      console.error(`✗ Error importing ${food.turkishName}:`, error);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('IMPORT SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total foods: ${turkishFoods.length}`);
  console.log(`✓ Successfully imported: ${successCount}`);
  console.log(`⊘ Skipped (already exists): ${skippedCount}`);
  console.log(`✗ Failed: ${failCount}`);
  console.log('='.repeat(50));
  
  // Toplam besin sayısını göster
  const allFoods = await storage.getAllFoods();
  console.log(`\nTotal foods in database: ${allFoods.length}`);
  
  process.exit(0);
}

seedFoods().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
