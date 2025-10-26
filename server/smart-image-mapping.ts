import fs from "fs/promises";
import path from "path";
import { db } from "./db";
import { foods } from "../shared/schema";
import { eq } from "drizzle-orm";

// Türkçe-İngilizce eşleştirme tablosu
const foodNameMapping: Record<string, string[]> = {
  // Meyveler
  "Apple_cider_vinegar": ["Elma Sirkesi"],
  "Apple_juice_glass": ["Elma Suyu"],
  "Apricot_jam_jar": ["Kayısı Reçeli"],
  "Fresh_apricots": ["Kayısı"],
  "Fresh_avocado": ["Avokado"],
  "Fresh_blackberries": ["Böğürtlen"],
  "Fresh_blueberries": ["Yaban Mersini"],
  "Fresh_cantaloupe_melon": ["Kavun"],
  "Fresh_cranberries": ["Kızılcık"],
  "Fresh_figs": ["İncir"],
  "Fresh_grapefruit": ["Greyfurt"],
  "Fresh_grapes": ["Üzüm"],
  "Fresh_green_kiwifruit": ["Kivi"],
  "Fresh_lychee_fruit": ["Lişe"],
  "Fresh_mango": ["Mango"],
  "Fresh_nectarines": ["Nektarin"],
  "Fresh_papaya": ["Papaya"],
  "Fresh_peach": ["Şeftali"],
  "Fresh_persimmon": ["Cennet Hurması"],
  "Fresh_pineapple": ["Ananas"],
  "Fresh_plums": ["Erik"],
  "Fresh_pomegranate": ["Nar"],
  "Fresh_quince": ["Ayva"],
  "Fresh_strawberries": ["Çilek"],
  "Fresh_sweet_cherries": ["Kiraz"],
  "Fresh_watermelon_slice": ["Karpuz"],
  "Dried_apricots": ["Kuru Kayısı"],
  "Dried_figs": ["Kuru İncir"],
  "Dried_prunes": ["Kuru Erik"],
  "Golden_raisins": ["Kuru Üzüm"],
  "Medjool_dates": ["Hurma"],
  "Orange_juice_glass": ["Portakal Suyu"],
  "Strawberry_jam_jar": ["Çilek Reçeli"],
  "Frozen_lemonade_concentrate": ["Limonata"],
  
  // Sebzeler
  "Cherry_tomatoes": ["Çeri Domates"],
  "Fresh_corn_cob": ["Mısır"],
  "fresh_green_peas": ["Bezelye"],
  "Fresh_jalapeno_peppers": ["Jalapeno Biber"],
  "Spring_onions_scallions": ["Yeşil Soğan"],
  "Sun-dried_tomatoes": ["Kurutulmuş Domates"],
  "Tomato_juice_glass": ["Domates Suyu"],
  "White_mushrooms": ["Mantar (Beyaz)"],
  "Portobello_mushroom": ["Mantar (Portobello)"],
  "Shiitake_mushrooms": ["Mantar (Shiitake)"],
  "Romaine_lettuce": ["Marul (Romaine)"],
  "Fresh_rosemary": ["Biberiye"],
  
  // Deniz Ürünleri
  "Fresh_anchovy_fish": ["Hamsi"],
  "Fried_trout_fish": ["Alabalık"],
  "Canned_tuna_fish": ["Konserve Ton Balığı"],
  "Cod_fish": ["Morina Balığı"],
  "Fresh_crab": ["Yengeç"],
  "Fresh_lobster": ["Istakoz"],
  "Fresh_mussels": ["Midye"],
  "Fresh_octopus": ["Ahtapot"],
  "Fresh_oysters": ["İstiridye"],
  "Fresh_squid": ["Kalamar"],
  "Mackerel_fish": ["Uskumru"],
  "Raw_salmon_fish": ["Somon Balığı"],
  "Raw_sea_bass": ["Levrek"],
  "Raw_shrimp": ["Karides"],
  "Raw_tuna_fish": ["Ton Balığı"],
  "Sardines_fish": ["Sardalya"],
  "Sea_bream_fish": ["Çipura"],
  
  // Et Ürünleri
  "Beef_liver": ["Dana Ciğeri"],
  "Beef_sausage": ["Sosis"],
  "Beef_tenderloin": ["Dana Bonfile"],
  "Bologna_ham": ["Dana Jambon"],
  "Cooked_beef_bacon": ["Bacon"],
  "Cooked_beef_salami": ["Salam"],
  "Ground_beef": ["Kıyma (Dana)"],
  "Ground_lamb": ["Kuzu Kıyma"],
  "Ground_turkey": ["Hindi Kıyma"],
  "Ground_veal": ["Dana Eti (Genç)"],
  "Meatless_meatball": ["Köfte"],
  "Pastrami_deli_meat": ["Pastırma"],
  "Raw_chicken_liver": ["Tavuk Ciğeri"],
  "Raw_chicken_wings": ["Tavuk Kanat"],
  "Raw_duck_meat": ["Ördek Eti"],
  "Raw_lamb_meat": ["Kuzu Eti"],
  "Raw_turkey_breast": ["Hindi Göğsü"],
  "Ribeye_steak": ["Dana Antrikot"],
  "Sliced_restaurant_ham": ["Jambon"],
  
  // Süt Ürünleri
  "Ayran_yogurt_drink": ["Ayran"],
  "Butter_block": ["Tereyağı"],
  "Cheddar_cheese_slices": ["Kaşar Peyniri"],
  "Chocolate_ice_cream": ["Dondurma (Çikolatalı)"],
  "Cottage_cheese": ["Lor Peyniri"],
  "Cream_cheese_spread": ["Krem Peynir"],
  "Fat_free_skim_milk": ["Yağsız Süt"],
  "Feta_cheese": ["Beyaz Peynir"],
  "Goat_cheese": ["Keçi Peyniri"],
  "Greek_yogurt": ["Süzme Yoğurt"],
  "Heavy_cream": ["Krema"],
  "Kefir_yogurt_drink": ["Kefir"],
  "Low_fat_milk": ["Az Yağlı Süt"],
  "Low_fat_yogurt": ["Az Yağlı Yoğurt"],
  "Mozzarella_cheese": ["Mozzarella"],
  "Plain_nonfat_yogurt": ["Yoğurt (Sade)"],
  "Sour_cream": ["Ekşi Krema"],
  "Vanilla_ice_cream": ["Dondurma (Vanilyalı)"],
  "Whole_milk_glass": ["Tam Yağlı Süt"],
  
  // Tahıllar & Bakliyat
  "amaranth_grains_bowl": ["Amarant"],
  "brown_rice_grains": ["Esmer Pirinç"],
  "chickpea_flour_powder": ["Nohut Unu"],
  "corn_flour_powder": ["Mısır Unu"],
  "cranberry_borlotti_beans": ["Barbunya"],
  "dried_chickpeas_bowl": ["Nohut"],
  "dried_fava_beans": ["Bakla"],
  "dried_rice_noodles": ["Pirinç Eriştesi"],
  "dried_split_peas": ["Mercimek"],
  "jasmine_rice_grains": ["Beyaz Pirinç"],
  "lupin_beans_bowl": ["Lupini"],
  "pinto_beans_bowl": ["Pinto Fasulyesi"],
  "soy_flour_powder": ["Soya Unu"],
  "sweet_corn_kernels": ["Tatlı Mısır"],
  
  // Yumurta
  "Whole_raw_egg": ["Yumurta (Çiğ)"],
  "Raw_egg_white": ["Yumurta Akı"],
  "Raw_egg_yolk": ["Yumurta Sarısı"],
  
  // Fırın Ürünleri
  "Belgian_waffle": ["Waffle"],
  "Blueberry_muffin": ["Muffin (Yaban Mersinli)"],
  "crispy_crackers_stacked": ["Kraker"],
  "Lasagna_dish": ["Lazanya"],
  "Naan_bread": ["Naan Ekmeği"],
  "Pancake_stack": ["Pankek"],
  "Pita_bread": ["Pide Ekmeği"],
  "Plain_doughnut_cake": ["Donut"],
  "Spaghetti_pasta": ["Makarna (Spagetti)"],
  "wheat_flour_tortillas": ["Tortilla"],
  "Whole_wheat_bread": ["Tam Tahıllı Ekmek"],
  "whole_wheat_bread_7dc565f2": ["Tam Tahıllı Ekmek"],
  
  // Yağlar & Tohumlar
  "Coconut_oil_jar": ["Hindistan Cevizi Yağı"],
  "Raw_coconut_meat": ["Hindistan Cevizi"],
  "Raw_pumpkin_seeds": ["Kabak Çekirdeği"],
  "Brazil_nuts_photo": ["Brezilya Fıstığı"],
  "Cashew_nuts_photo": ["Kaju"],
  "Chia_seeds_photo": ["Chia Tohumu"],
  "English_walnuts_photo": ["Ceviz"],
  "Flaxseed_oil_photo": ["Keten Tohumu Yağı"],
  "Pecan_halves_photo": ["Pekan Cevizi"],
  "Pine_nuts_photo": ["Çam Fıstığı"],
  "Pistachio_nuts_photo": ["Antep Fıstığı"],
  "Poppy_seeds_photo": ["Haşhaş Tohumu"],
  "Raw_almonds_photo": ["Badem"],
  "Raw_hazelnuts_photo": ["Fındık"],
  "Sesame_oil_photo": ["Susam Yağı"],
  "Sesame_seeds_photo": ["Susam"],
  "Sunflower_seeds_photo": ["Ayçiçek Tohumu"],
  
  // Soslar & İçecekler
  "Chocolate_almond_milk": ["Sütlü Çikolata"],
  "Nutella_hazelnut_spread": ["Fındık Kreması"],
  "Soy_sauce_bottle": ["Soya Sosu"],
  "Tahini_sesame_butter": ["Tahin"],
  
  // Diğer
  "crispy_potato_chips_photo": ["Cips"],
  "nori_seaweed_sheets": ["Deniz Yosunu - Nori"],
  "wakame_seaweed_dried": ["Deniz Yosunu - Wakame"],
  "Dried_oregano_photo": ["Kekik"],
  "Fresh_basil_leaves_photo": ["Fesleğen"],
  "Fresh_cilantro_leaves_photo": ["Kişniş"],
  "Fresh_dill_herb_photo": ["Dereotu"]
};

async function main() {
  console.log("🎨 Akıllı Görsel Eşleştirme Başlatılıyor...\n");
  
  const dir = path.join(process.cwd(), "attached_assets", "generated_images");
  const files = await fs.readdir(dir);
  const webpFiles = files.filter(f => f.endsWith('.webp'));
  
  console.log(`📸 ${webpFiles.length} WebP dosyası bulundu\n`);
  
  let updates = 0;
  
  for (const file of webpFiles) {
    // Dosya adından base name'i al (uzantısız)
    const baseName = file.replace('.webp', '');
    
    // Eşleştirme tablosunda bul
    const turkishNames = foodNameMapping[baseName];
    
    if (!turkishNames || turkishNames.length === 0) {
      console.log(`⚠️  Eşleştirme bulunamadı: ${baseName}`);
      continue;
    }
    
    // Her Türkçe isim için veritabanını güncelle
    for (const turkishName of turkishNames) {
      const result = await db
        .update(foods)
        .set({ imageUrl: `attached_assets/generated_images/${file}` })
        .where(eq(foods.name, turkishName));
      
      if (result.rowCount && result.rowCount > 0) {
        console.log(`✅ ${turkishName} → ${file}`);
        updates++;
      }
    }
  }
  
  console.log("\n" + "=".repeat(50));
  console.log(`💾 ${updates} ürün doğru görsellerle güncellendi`);
  console.log("=".repeat(50));
}

main().catch(console.error);
