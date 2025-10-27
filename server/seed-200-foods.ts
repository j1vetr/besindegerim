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

// Türkiye'de en çok tüketilen yeni besinler (mevcut veritabanında olmayanlar)
const turkishFoods = [
  // ET VE TAVUK (yeni olanlar)
  { query: "beef, ground, raw", turkishName: "Kıyma (Dana)" },
  { query: "beef, tenderloin", turkishName: "Dana Bonfile" },
  { query: "beef, ribeye steak", turkishName: "Dana Antrikot" },
  { query: "lamb, leg, raw", turkishName: "Kuzu Eti" },
  { query: "lamb, ground, raw", turkishName: "Kuzu Kıyma" },
  { query: "chicken, wing, raw", turkishName: "Tavuk Kanat" },
  { query: "turkey, breast, raw", turkishName: "Hindi Göğsü" },
  { query: "turkey, ground, raw", turkishName: "Hindi Kıyma" },
  { query: "sausage, beef", turkishName: "Sosis" },
  { query: "bacon, cooked", turkishName: "Bacon" },
  { query: "salami, beef", turkishName: "Salam" },
  { query: "bologna", turkishName: "Dana Jambon" },
  { query: "beef liver, raw", turkishName: "Dana Ciğeri" },
  { query: "chicken liver, raw", turkishName: "Tavuk Ciğeri" },
  { query: "meatballs, beef", turkishName: "Köfte" },
  { query: "ham, sliced", turkishName: "Jambon" },
  { query: "pastrami", turkishName: "Pastırma" },
  { query: "duck, meat only, raw", turkishName: "Ördek Eti" },
  { query: "veal, raw", turkishName: "Dana Eti (Genç)" },
  
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
  
  // MEYVELER (yeni olanlar - mevcut: Elma, Muz, Portakal, Limon, Armut)
  { query: "mandarin, raw", turkishName: "Mandalina" },
  { query: "grapefruit, raw", turkishName: "Greyfurt" },
  { query: "grapes, raw", turkishName: "Üzüm" },
  { query: "watermelon, raw", turkishName: "Karpuz" },
  { query: "melon, cantaloupe, raw", turkishName: "Kavun" },
  { query: "strawberries, raw", turkishName: "Çilek" },
  { query: "cherries, sweet, raw", turkishName: "Kiraz" },
  { query: "apricots, raw", turkishName: "Kayısı" },
  { query: "peaches, raw", turkishName: "Şeftali" },
  { query: "nectarines, raw", turkishName: "Nektarin" },
  { query: "plums, raw", turkishName: "Erik" },
  { query: "pomegranates, raw", turkishName: "Nar" },
  { query: "figs, raw", turkishName: "İncir" },
  { query: "kiwifruit, raw", turkishName: "Kivi" },
  { query: "pineapple, raw", turkishName: "Ananas" },
  { query: "mango, raw", turkishName: "Mango" },
  { query: "papaya, raw", turkishName: "Papaya" },
  { query: "avocado, raw", turkishName: "Avokado" },
  { query: "blackberries, raw", turkishName: "Böğürtlen" },
  { query: "raspberries, raw", turkishName: "Ahududu" },
  { query: "blueberries, raw", turkishName: "Yaban Mersini" },
  { query: "cranberries, raw", turkishName: "Kızılcık" },
  { query: "dates, medjool", turkishName: "Hurma" },
  { query: "raisins, seedless", turkishName: "Kuru Üzüm" },
  { query: "apricots, dried", turkishName: "Kuru Kayısı" },
  { query: "figs, dried", turkishName: "Kuru İncir" },
  { query: "prunes, dried", turkishName: "Kuru Erik" },
  { query: "coconut meat, raw", turkishName: "Hindistan Cevizi" },
  { query: "lychees, raw", turkishName: "Lişe" },
  { query: "persimmons, raw", turkishName: "Cennet Hurması" },
  { query: "quince, raw", turkishName: "Ayva" },
  
  // SEBZELER (yeni olanlar - mevcut: Patlıcan, Kabak, Salatalık, Marul, Roka, Ispanak, Turp, Şalgam, Pancar, Patates, Tatlı Patates, Soğan, Sarımsak, Pırasa, Zencefil, Domates, Bamya, Acı Biber, Yeşil Biber, Kırmızı Biber)
  { query: "lettuce, romaine, raw", turkishName: "Marul (Romaine)" },
  { query: "scallion, raw", turkishName: "Yeşil Soğan" },
  { query: "mushrooms, white, raw", turkishName: "Mantar (Beyaz)" },
  { query: "mushrooms, portobello, raw", turkishName: "Mantar (Portobello)" },
  { query: "mushrooms, shiitake, raw", turkishName: "Mantar (Shiitake)" },
  { query: "pepper, jalapeno, raw", turkishName: "Jalapeno Biber" },
  { query: "tomatoes, cherry, raw", turkishName: "Çeri Domates" },
  { query: "tomatoes, sun-dried", turkishName: "Kurutulmuş Domates" },
  { query: "parsley, fresh", turkishName: "Maydanoz" },
  { query: "cilantro, raw", turkishName: "Kişniş" },
  { query: "basil, fresh", turkishName: "Fesleğen" },
  { query: "mint, fresh", turkishName: "Nane" },
  { query: "dill, fresh", turkishName: "Dereotu" },
  { query: "thyme, fresh", turkishName: "Kekik" },
  { query: "rosemary, fresh", turkishName: "Biberiye" },
  { query: "oregano, dried", turkishName: "Kekik (Oregan)" },
  
  // KURUYEMİŞLER VE TOHUMLAR (yeni olanlar - mevcut: Yer Fıstığı)
  { query: "walnuts, english", turkishName: "Ceviz" },
  { query: "almonds, raw", turkishName: "Badem" },
  { query: "hazelnuts, raw", turkishName: "Fındık" },
  { query: "pistachios, raw", turkishName: "Antep Fıstığı" },
  { query: "cashews, raw", turkishName: "Kaju" },
  { query: "peanut butter, smooth", turkishName: "Fıstık Ezmesi" },
  { query: "sunflower seeds, raw", turkishName: "Ayçiçek Çekirdeği" },
  { query: "pumpkin seeds, raw", turkishName: "Kabak Çekirdeği" },
  { query: "sesame seeds, raw", turkishName: "Susam" },
  { query: "tahini, sesame", turkishName: "Tahin" },
  { query: "chia seeds", turkishName: "Chia Tohumu" },
  { query: "flaxseed, raw", turkishName: "Keten Tohumu" },
  { query: "poppy seed", turkishName: "Haşhaş" },
  { query: "pine nuts, dried", turkishName: "Çam Fıstığı" },
  { query: "macadamia nuts, raw", turkishName: "Makadamya" },
  { query: "pecans, raw", turkishName: "Pekan Cevizi" },
  { query: "brazil nuts, raw", turkishName: "Brezilya Fıstığı" },
  
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
  
  // EKMEK VE HAMUR İŞLERİ (yeni olanlar - mevcut: Beyaz Ekmek, Kepekli Ekmek, Kruvasan, Makarna, Simit)
  { query: "bread, multigrain", turkishName: "Tam Tahıllı Ekmek" },
  { query: "pita bread, white", turkishName: "Pide Ekmeği" },
  { query: "naan bread", turkishName: "Naan Ekmeği" },
  { query: "pasta, spaghetti, enriched", turkishName: "Makarna (Spagetti)" },
  { query: "pasta, penne, dry", turkishName: "Makarna (Penne)" },
  { query: "pasta, fusilli, dry", turkishName: "Makarna (Burgu)" },
  { query: "lasagna, dry", turkishName: "Lazanya" },
  { query: "pancakes, plain", turkishName: "Pankek" },
  { query: "waffles, plain", turkishName: "Waffle" },
  { query: "muffins, blueberry", turkishName: "Muffin (Yaban Mersinli)" },
  { query: "doughnuts, cake-type", turkishName: "Donut" },
  { query: "pizza, cheese", turkishName: "Pizza" },
  
  // İÇECEKLER VE DİĞER (yeni olanlar - mevcut: Tofu)
  { query: "coffee, brewed, black", turkishName: "Kahve (Demleme)" },
  { query: "tea, black, brewed", turkishName: "Siyah Çay" },
  { query: "tea, green, brewed", turkishName: "Yeşil Çay" },
  { query: "orange juice, raw", turkishName: "Portakal Suyu" },
  { query: "apple juice, unsweetened", turkishName: "Elma Suyu" },
  { query: "tomato juice, canned", turkishName: "Domates Suyu" },
  { query: "carbonated beverage, cola", turkishName: "Kola" },
  { query: "lemonade, frozen concentrate", turkishName: "Limonata" },
  { query: "protein powder, whey", turkishName: "Protein Tozu" },
  { query: "energy drink", turkishName: "Enerji İçeceği" },
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
