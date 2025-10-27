import fs from "fs/promises";
import path from "path";
import { db } from "./db";
import { foods } from "../shared/schema";
import { eq } from "drizzle-orm";

// Slug normalizer - dosya isminden slug türet
function normalizeToSlug(filename: string): string {
  // Remove extension and hash
  const base = filename
    .replace(/\.(webp|png|jpg|jpeg)$/i, "")
    .replace(/_[a-f0-9]{8}$/, ""); // Remove hash suffix
  
  return base
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
}

// Türkçe karakterleri normalize et
function turkishToSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// Manuel eşleştirme tablosu - Türkçe slug → İngilizce dosya base name (hash olmadan)
const manualMappings: Record<string, string> = {
  // Meyveler
  "kayisi": "fresh-apricots",
  "avokado": "fresh-avocado",
  "bogurtlen": "fresh-blackberries",
  "yaban-mersini": "fresh-blueberries",
  "kavun": "fresh-cantaloupe-melon",
  "kizilcik": "fresh-cranberries",
  "i-ncir": "fresh-figs",
  "greyfurt": "fresh-grapefruit",
  "uzum": "fresh-grapes",
  "kivi": "fresh-green-kiwifruit",
  "mango": "fresh-mango",
  "seftali": "fresh-peach",
  "ananas": "fresh-pineapple",
  "erik": "fresh-plums",
  "nar": "fresh-pomegranate",
  "cilek": "fresh-strawberries",
  "kiraz": "fresh-sweet-cherries",
  "karpuz": "fresh-watermelon-slice",
  "kuru-kayisi": "dried-apricots",
  "kuru-i-ncir": "dried-figs",
  "hurma": "medjool-dates",
  "elma-suyu": "apple-juice-glass",
  "portakal-suyu": "orange-juice-glass",
  "kayisi-receli": "apricot-jam-jar",
  "cilek-receli": "strawberry-jam-jar",
  
  // Sebzeler
  "ceri-domates": "cherry-tomatoes",
  "misir": "fresh-corn-cob",
  "domates-suyu": "tomato-juice-glass",
  "mantar-beyaz": "white-mushrooms",
  "mantar-shiitake": "shiitake-mushrooms",
  "marul-romaine": "romaine-lettuce",
  
  // Deniz Ürünleri
  "hamsi": "fresh-anchovy-fish",
  "alabalik": "fried-trout-fish",
  "konserve-ton-baligi": "canned-tuna-fish",
  "morina-baligi": "cod-fish",
  "yengec": "fresh-crab",
  "istakoz": "fresh-lobster",
  "midye": "fresh-mussels",
  "ahtapot": "fresh-octopus",
  "i-stiridye": "fresh-oysters",
  "kalamar": "fresh-squid",
  "uskumru": "mackerel-fish",
  "somon-baligi": "raw-salmon-fish",
  "levrek": "raw-sea-bass",
  "karides": "raw-shrimp",
  "ton-baligi": "raw-tuna-fish",
  "sardalya": "sardines-fish",
  "cipura": "sea-bream-fish",
  
  // Et Ürünleri
  "dana-cigeri": "beef-liver",
  "sosis": "beef-sausage",
  "dana-bonfile": "beef-tenderloin",
  "dana-jambon": "bologna-ham",
  "bacon": "cooked-beef-bacon",
  "salam": "cooked-beef-salami",
  "kiyma-dana": "ground-beef",
  "kuzu-kiyma": "ground-lamb",
  "tavuk-cigeri": "raw-chicken-liver",
  "tavuk-kanat": "raw-chicken-wings",
  "kuzu-eti": "raw-lamb-meat",
  "dana-antrikot": "ribeye-steak",
  "jambon": "sliced-restaurant-ham",
  "pastirma": "pastrami-deli-meat",
  
  // Süt Ürünleri
  "ayran": "ayran-yogurt-drink",
  "tereyagi": "butter-block",
  "kasar-peyniri": "cheddar-cheese-slices",
  "dondurma-cikolatali": "chocolate-ice-cream",
  "lor-peyniri": "cottage-cheese",
  "krem-peynir": "cream-cheese-spread",
  "yagsiz-sut": "fat-free-skim-milk",
  "beyaz-peynir": "feta-cheese",
  "keci-peyniri": "goat-cheese",
  "suzme-yogurt": "greek-yogurt",
  "az-yagli-sut": "low-fat-milk",
  "mozzarella": "mozzarella-cheese",
  "yogurt-sade": "plain-nonfat-yogurt",
  "dondurma-vanilyali": "vanilla-ice-cream",
  "tam-yagli-sut": "whole-milk-glass",
  "kefir": "kefir-yogurt-drink",
  
  // Tahıllar & Bakliyat
  "amarant": "amaranth-grains-bowl",
  "esmer-pirinc": "brown-rice-grains",
  "nohut-unu": "chickpea-flour-powder",
  "misir-unu": "corn-flour-powder",
  "barbunya": "cranberry-borlotti-beans",
  "nohut": "dried-chickpeas-bowl",
  "bakla-kuru": "dried-fava-beans",
  "noodle-kuru": "dried-rice-noodles",
  "kirmizi-mercimek": "dried-split-peas",
  "jasmine-pirinc": "jasmine-rice-grains",
  "pinto-fasulye": "pinto-beans-bowl",
  "soya-unu": "soy-flour-powder",
  "misir-taneni": "sweet-corn-kernels",
  
  // Yumurta
  "yumurta-cig": "whole-raw-egg",
  "yumurta-aki": "raw-egg-white",
  "yumurta-sarisi": "raw-egg-yolk",
  
  // Fırın Ürünleri
  "waffle": "belgian-waffle",
  "muffin-yaban-mersinli": "blueberry-muffin",
  "kraker": "crispy-crackers-stacked",
  "lazanya": "lasagna-dish",
  "pankek": "pancake-stack",
  "makarna-spagetti": "spaghetti-pasta",
  "tam-tahilli-ekmek": "whole-wheat-bread",
  
  // Yağlar & Tohumlar
  "hindistan-cevizi-yagi": "coconut-oil-jar",
  "hindistan-cevizi": "raw-coconut-meat",
  "brezilya-fistigi": "brazil-nuts-photo",
  "kaju": "cashew-nuts-photo",
  "chia-tohumu": "chia-seeds-photo",
  "ceviz": "english-walnuts-photo",
  "keten-tohumu-yagi": "flaxseed-oil-photo",
  "cam-fistigi": "pine-nuts-photo",
  "antep-fistigi": "pistachio-nuts-photo",
  "badem": "raw-almonds-photo",
  "findik": "raw-hazelnuts-photo",
  "susam": "sesame-seeds-photo",
  "aycicek-tohumu": "sunflower-seeds-photo",
  
  // İçecekler
  "sutlu-cikolata": "chocolate-almond-milk",
  "elma-sirkesi": "apple-cider-vinegar",
  
  // Yeni eklenen görseller (Ekim 2025)
  "kola": "cola-soda-bottle-product-photo",
  "domates": "fresh-red-tomato-photo",
  "muz": "fresh-banana-bunch-photo",
  "salatalik": "fresh-cucumber-photo",
  "tavuk-gogsu": "raw-chicken-breast-photo",
  "elma": "fresh-red-apple-photo",
  "portakal": "fresh-orange-fruit-photo",
  "patlican": "fresh-eggplant-photo",
  "makarna": "cooked-spaghetti-pasta-photo",
  "bulgur": "bulgur-wheat-grains-photo",
};

// Benzerlik skorlama - Levenshtein mesafesi basit versiyonu
function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(s1: string, s2: string): number {
  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) {
      costs[s2.length] = lastValue;
    }
  }
  return costs[s2.length];
}

async function fixImageMapping() {
  console.log("🔍 Görsel eşleştirmesi düzeltiliyor...\n");

  // 1. Tüm gıdaları al
  const allFoods = await db.select().from(foods);
  console.log(`📊 Toplam ${allFoods.length} gıda bulundu`);

  // 2. Tüm görselleri al
  const imagesDir = path.join(process.cwd(), "attached_assets/generated_images");
  const imageFiles = (await fs.readdir(imagesDir))
    .filter(f => f.endsWith(".webp") || f.endsWith(".png"));
  console.log(`🖼️  Toplam ${imageFiles.length} görsel bulundu\n`);

  // 3. Her dosya için slug map oluştur
  const imageSlugMap = new Map<string, string>();
  imageFiles.forEach(filename => {
    const slug = normalizeToSlug(filename);
    imageSlugMap.set(slug, filename);
  });

  // 4. Eşleştirme yap
  let updated = 0;
  let matched = 0;
  let unmatched = 0;

  for (const food of allFoods) {
    const foodSlug = turkishToSlug(food.slug);
    let matchedImage: string | null = null;

    // Strateji 1: Manuel eşleştirme
    if (manualMappings[foodSlug]) {
      const manualSlug = manualMappings[foodSlug];
      const found = imageFiles.find(f => normalizeToSlug(f) === manualSlug);
      if (found) {
        matchedImage = found;
        console.log(`✓ Manuel: ${food.name} → ${found}`);
      }
    }

    // Strateji 2: Direkt slug eşleşmesi
    if (!matchedImage && imageSlugMap.has(foodSlug)) {
      matchedImage = imageSlugMap.get(foodSlug)!;
      console.log(`✓ Direkt: ${food.name} → ${matchedImage}`);
    }

    // Strateji 3: İngilizce adıyla eşleşme
    if (!matchedImage && food.nameEn) {
      const enSlug = normalizeToSlug(food.nameEn);
      const found = imageFiles.find(f => normalizeToSlug(f) === enSlug);
      if (found) {
        matchedImage = found;
        console.log(`✓ İngilizce: ${food.name} (${food.nameEn}) → ${found}`);
      }
    }

    // Strateji 4: Fuzzy matching (benzerlik > 0.7)
    if (!matchedImage) {
      let bestMatch: { file: string; score: number } | null = null;
      
      for (const [imgSlug, imgFile] of Array.from(imageSlugMap.entries())) {
        const score = similarity(foodSlug, imgSlug);
        if (score > 0.7 && (!bestMatch || score > bestMatch.score)) {
          bestMatch = { file: imgFile, score };
        }
      }

      if (bestMatch) {
        matchedImage = bestMatch.file;
        console.log(`~ Fuzzy (${(bestMatch.score * 100).toFixed(0)}%): ${food.name} → ${matchedImage}`);
      }
    }

    // Eşleştirme başarılı mı?
    if (matchedImage) {
      const newImageUrl = `attached_assets/generated_images/${matchedImage}`;
      
      // Sadece değişti ise güncelle
      if (food.imageUrl !== newImageUrl) {
        await db
          .update(foods)
          .set({ imageUrl: newImageUrl })
          .where(eq(foods.id, food.id));
        updated++;
      }
      matched++;
    } else {
      console.log(`✗ Eşleşmedi: ${food.name} (${foodSlug})`);
      unmatched++;
    }
  }

  console.log("\n📈 Özet:");
  console.log(`  ✓ Eşleşen: ${matched}/${allFoods.length}`);
  console.log(`  📝 Güncellenen: ${updated}`);
  console.log(`  ✗ Eşleşmeyen: ${unmatched}`);
  
  if (unmatched > 0) {
    console.log("\n⚠️  Eşleşmeyen gıdalar için manuel görsel eklenmeli veya AI ile oluşturulmalı.");
  }
}

// Çalıştır
fixImageMapping()
  .then(() => {
    console.log("\n✅ Görsel eşleştirmesi tamamlandı!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Hata:", error);
    process.exit(1);
  });
