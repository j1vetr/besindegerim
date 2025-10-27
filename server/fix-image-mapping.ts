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
  
  // Yeni eklenen görseller (Ekim 2025 - İlk Batch)
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
  
  // Yeni eklenen görseller (Ekim 2025 - İkinci Batch - 60 görsel)
  // Grup 1: Sebze ve Meyveler
  "brokoli": "fresh-broccoli-vegetable-photo",
  "havuc": "fresh-carrots-photo",
  "ispanak": "fresh-spinach-leaves-photo",
  "karnabahar": "fresh-cauliflower-photo",
  "marul": "fresh-lettuce-head-photo",
  "roka": "fresh-arugula-leaves-photo",
  "patates": "fresh-potatoes-photo",
  "sogan": "fresh-onions-photo",
  "sarimsak": "fresh-garlic-bulbs-photo",
  "limon": "fresh-lemons-photo",
  "armut": "fresh-pear-fruit-photo",
  "mandalina": "fresh-mandarin-oranges-photo",
  "pancar": "fresh-beetroot-photo",
  "kabak": "fresh-zucchini-photo",
  "yesil-biber": "fresh-green-bell-pepper-photo",
  
  // Grup 2: Tahıllar, Baklagiller, Et
  "bugday": "wheat-grains-photo",
  "arpa": "barley-grains-photo",
  "kinoa": "quinoa-grains-photo",
  "dari": "millet-grains-photo",
  "pirinc": "white-rice-grains-photo",
  "beyaz-fasulye": "white-beans-photo",
  "siyah-fasulye": "black-beans-photo",
  "kirmizi-fasulye": "red-kidney-beans-photo",
  "soya-fasulyesi": "soybeans-photo",
  "edamame": "edamame-beans-photo",
  "misir-gevregi": "corn-flakes-cereal-photo",
  "beyaz-ekmek": "white-bread-loaf-photo",
  "simit": "turkish-simit-bread-photo",
  "kizarmis-tavuk": "fried-chicken-pieces-photo",
  "kirmizi-biber": "fresh-red-bell-pepper-photo",
  
  // Grup 3: Fırın Ürünleri ve İçecekler
  "kruvasan": "croissant-pastry-photo",
  "kuskus": "couscous-grains-photo",
  "misir-tortilla": "corn-tortillas-photo",
  "limonata": "fresh-lemonade-glass-photo",
  "bamya": "fresh-okra-pods-photo",
  "kuskonmaz": "fresh-asparagus-spears-photo",
  "donut": "glazed-donut-photo",
  "kofte": "turkish-kofte-meatballs-photo",
  "bal": "honey-jar-photo",
  "hardal": "yellow-mustard-jar-photo",
  "bitter-cikolata": "dark-chocolate-bar-photo",
  "fistik-ezmesi": "peanut-butter-jar-photo",
  "soya-sosu": "soy-sauce-bottle-photo",
  "tofu": "tofu-block-photo",
  "aci-biber": "fresh-chili-peppers-photo",
  
  // Grup 4: Diğer Önemli Gıdalar
  "kale": "fresh-kale-leaves-photo",
  "bruksel-lahanasi": "fresh-brussels-sprouts-photo",
  "tatli-patates": "fresh-sweet-potato-photo",
  "kuru-uzum": "golden-raisins-photo",
  "yer-fistigi": "roasted-peanuts-photo",
  "yesil-zeytin": "green-olives-photo",
  "siyah-zeytin": "black-olives-photo",
  "tursu": "pickled-cucumbers-jar-photo",
  "yulaf-ezmesi": "cooked-oatmeal-porridge-photo",
  "cavdar": "rye-bread-loaf-photo",
  "pirasa": "fresh-leeks-photo",
  
  // Yeni eklenen görseller (Ocak 2025 - Üçüncü Batch - 92 görsel)
  // Grup 1: Sebzeler & Baharatlar (15)
  "enginar": "fresh-artichoke-vegetable-photo",
  "bambu-filizi": "fresh-bamboo-shoots-photo",
  "feslegen": "fresh-basil-leaves-photo",
  "cin-lahanasi": "fresh-bok-choy-photo",
  "kereviz-sapi": "fresh-celery-stalks-photo",
  "tere": "fresh-watercress-greens-photo",
  "kisnis": "fresh-cilantro-coriander-photo",
  "dereotu": "fresh-dill-herb-photo",
  "zencefil": "fresh-ginger-root-photo",
  "yesil-fasulye": "fresh-green-beans-photo",
  "yesil-sogan": "fresh-green-onions-photo",
  "bezelye-taze": "fresh-green-peas-photo",
  "nane": "fresh-mint-leaves-photo",
  "maydanoz": "fresh-parsley-herb-photo",
  "biberiye": "fresh-rosemary-herb-photo",
  
  // Grup 2: Meyveler & Tatlılar (15)
  "ahududu": "fresh-raspberries-photo",
  "turp": "fresh-radishes-photo",
  "ayva": "fresh-quince-fruit-photo",
  "trabzon-hurmasi": "fresh-persimmon-fruit-photo",
  "papaya": "fresh-papaya-fruit-photo",
  "nektarin": "fresh-nectarines-fruit-photo",
  "kekik": "fresh-thyme-herb-photo",
  "zerdecal": "fresh-turmeric-root-photo",
  "salgam": "fresh-turnip-vegetable-photo",
  "kuru-erik": "dried-prunes-photo",
  "marshmallow": "fluffy-marshmallows-photo",
  "meyve-jellisi": "fruit-jelly-dessert-photo",
  "pekmez": "grape-molasses-jar-photo",
  "pizza": "pizza-slice-photo",
  "donut-sade": "plain-doughnut-cake-photo",
  
  // Grup 3: Tahıllar & Baklagiller (16)
  "nohut-kuru": "dried-chickpeas-photo",
  "bezelye-kuru": "dried-split-peas-photo",
  "yesil-mercimek": "green-lentils-photo",
  "basmati-pirinc": "basmati-rice-grains-photo",
  "i-rmik": "semolina-flour-photo",
  "tef": "teff-grains-photo",
  "dari": "sorghum-grains-photo",
  "lima-fasulyesi": "lima-beans-photo",
  "mungo-fasulyesi": "mung-beans-photo",
  "lupin-fasulyesi": "lupin-beans-photo",
  "naan-ekmegi": "naan-bread-flatbread-photo",
  "pide-ekmegi": "turkish-pide-flatbread-photo",
  "tam-tahilli-ekmek": "whole-grain-bread-photo",
  "kereviz-koku": "celery-root-vegetable-photo",
  "misir-kocani": "fresh-sweet-corn-photo",
  "kirmizi-lahana": "red-cabbage-head-photo",
  
  // Grup 4: Et & Süt Ürünleri (15)
  "dana-eti-genc": "raw-beef-veal-photo",
  "tavuk-but": "raw-chicken-thighs-photo",
  "ordek-eti": "raw-duck-breast-photo",
  "hindi-gogsu": "raw-turkey-breast-photo",
  "hindi-kiyma": "ground-turkey-meat-photo",
  "krema": "heavy-cream-photo",
  "az-yagli-yogurt": "low-fat-yogurt-photo",
  "eksi-krema": "sour-cream-bowl-photo",
  "beyaz-lahana": "white-cabbage-head-photo",
  "beyaz-seker": "white-granulated-sugar-photo",
  "beyaz-cikolata": "white-chocolate-bar-photo",
  "esmer-seker": "brown-sugar-photo",
  "nori": "nori-seaweed-sheets-photo",
  "wakame": "wakame-seaweed-salad-photo",
  "tempeh": "tempeh-block-photo",
  
  // Grup 5: Yağlar & Tohumlar (16)
  "aycicek-yagi": "sunflower-oil-bottle-photo",
  "kanola-yagi": "canola-oil-bottle-photo",
  "misir-yagi": "corn-oil-bottle-photo",
  "zeytinyagi": "olive-oil-bottle-photo",
  "sizma-zeytinyagi": "extra-virgin-olive-oil-photo",
  "susam-yagi": "sesame-oil-bottle-photo",
  "keten-tohumu": "flax-seeds-photo",
  "aycicek-cekirdegi": "raw-sunflower-seeds-photo",
  "kabak-cekirdegi": "pumpkin-seeds-photo",
  "tahin": "tahini-paste-jar-photo",
  "pekan-cevizi": "pecan-nuts-photo",
  "makadamya": "macadamia-nuts-photo",
  "mayonez": "mayonnaise-jar-photo",
  "balzamik-sirke": "balsamic-vinegar-bottle-photo",
  "hashas": "poppy-seeds-photo",
  "akcaagac-surubu": "maple-syrup-bottle-photo",
  
  // Grup 6: İçecekler & Diğer (15)
  "kahve": "brewed-black-coffee-photo",
  "yesil-cay": "green-tea-cup-photo",
  "siyah-cay": "black-tea-cup-photo",
  "enerji-icecegi": "energy-drink-can-photo",
  "protein-tozu": "protein-powder-scoop-photo",
  "ketcap": "ketchup-bottle-photo",
  "aci-sos": "hot-sauce-bottle-photo",
  "findik-kremasi": "hazelnut-chocolate-spread-photo",
  "mantar-portobello": "portobello-mushrooms-photo",
  "jalapeno-biber": "fresh-jalapeno-peppers-photo",
  "kurutulmus-domates": "sun-dried-tomatoes-photo",
  "cips": "potato-chips-photo",
  "kuru-oregan": "dried-oregano-herb-photo",
  
  // Slug varyasyonları ve alternatif isimler
  "deniz-yosunu-nori": "nori-seaweed-sheets-photo",
  "deniz-yosunu-wakame": "wakame-seaweed-salad-photo",
  "kahve-demleme": "brewed-black-coffee-photo",
  "enerji-i-cecegi": "energy-drink-can-photo",
  "jole": "fruit-jelly-dessert-photo",
  "bugday-tortilla": "wheat-flour-tortillas-photo",
  "misir-taneni": "sweet-corn-kernels-photo",
  "misir-tanesi": "sweet-corn-kernels-photo",
  "kepekli-ekmek": "whole-grain-bread-photo",
  "su-teresi": "fresh-watercress-greens-photo",
  "teff": "teff-grains-photo",
  "sorgum": "sorghum-grains-photo",
  "taze-misir": "fresh-sweet-corn-photo",
  "taze-fasulye": "fresh-green-beans-photo",
  "cennet-hurmasi": "fresh-persimmon-fruit-photo",
  "kekik-oregan": "dried-oregano-herb-photo",
  "lise": "fresh-leeks-photo",
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
