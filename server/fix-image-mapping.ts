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

// Manuel eşleştirme tablosu - bilinen sorunlu eşleştirmeler
const manualMappings: Record<string, string> = {
  // İçecekler
  "kola": "cola-can",
  "fanta": "orange-soda",
  "sprite": "lemon-lime-soda",
  "gazoz": "sparkling-water",
  "soda": "sparkling-water",
  
  // Ekmek & Unlu Mamuller
  "ekmek": "white-bread",
  "beyaz-ekmek": "white-bread",
  "tam-tahilli-ekmek": "whole-wheat-bread",
  
  // Sebzeler
  "domates": "fresh-tomato",
  "domates-suyu": "tomato-juice-glass",
  "salatalik": "fresh-cucumber",
  "patlican": "fresh-eggplant",
  "biber": "fresh-bell-pepper",
  "sogan": "fresh-onion",
  "sarimsak": "fresh-garlic",
  "havuc": "fresh-carrot",
  "ispanak": "fresh-spinach",
  "brokoli": "fresh-broccoli",
  "karnibahar": "fresh-cauliflower",
  "kabak": "fresh-zucchini",
  
  // Meyveler
  "elma": "fresh-apple",
  "portakal": "fresh-orange",
  "muz": "fresh-banana",
  "armut": "fresh-pear",
  
  // Süt Ürünleri
  "sut": "whole-milk-glass",
  "tam-yagli-sut": "whole-milk-glass",
  "yogurt": "plain-nonfat-yogurt",
  
  // Et & Balık
  "tavuk": "raw-chicken-breast",
  "tavuk-gogsu": "raw-chicken-breast",
  "dana-eti": "ground-beef",
  
  // Yumurta
  "yumurta": "whole-raw-egg",
  "yumurta-cig": "whole-raw-egg",
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
      
      for (const [imgSlug, imgFile] of imageSlugMap.entries()) {
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
