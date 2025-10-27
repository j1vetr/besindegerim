import { db } from "./db";
import { foods } from "@shared/schema";
import { sql } from "drizzle-orm";

// Category mapping structure
const categoryMappings = {
  // HAYVANSAL ÜRÜNLER
  "Hayvansal Ürünler": {
    "Et ve Tavuk": [
      "kıyma", "bonfile", "antrikot", "kuzu", "dana", "tavuk", "hindi", 
      "ciğer", "köfte", "jambon", "sosis", "bacon", "salam", "pastırma",
      "ördek", "veal", "but", "göğsü", "kanat"
    ],
    "Süt Ürünleri": [
      "süt", "yoğurt", "peynir", "tereyağı", "krema", "dondurma", 
      "kefir", "ayran", "kaşar", "beyaz peynir", "mozzarella", "lor", "keçi"
    ],
    "Deniz Ürünleri": [
      "somon", "ton", "levrek", "çipura", "hamsi", "uskumru", "sardalya",
      "alabalık", "morina", "palamut", "lüfer", "mezgit", "karides",
      "kalamar", "ahtapot", "midye", "yengeç", "istakoz", "balık"
    ],
    "Yumurta": ["yumurta", "egg"]
  },
  
  // BİTKİSEL ÜRÜNLER
  "Bitkisel Ürünler": {
    "Meyveler": [
      "elma", "armut", "portakal", "mandalina", "greyfurt", "limon", "üzüm",
      "karpuz", "kavun", "muz", "çilek", "kiraz", "kayısı", "şeftali",
      "nektarin", "erik", "nar", "incir", "kivi", "ananas", "mango",
      "papaya", "avokado", "böğürtlen", "ahududu", "yaban mersini",
      "kızılcık", "hurma", "kuru üzüm", "kuru kayısı", "kuru erik",
      "hindistan cevizi", "lişe", "cennet hurması", "ayva"
    ],
    "Sebzeler": [
      "domates", "salatalık", "patlıcan", "kabak", "havuç", "ıspanak",
      "brokoli", "karnabahar", "lahana", "marul", "roka", "pancar",
      "patates", "tatlı patates", "soğan", "sarımsak", "pırasa",
      "turp", "şalgam", "kereviz", "kuşkonmaz", "biber", "bamya",
      "enginar", "mantar", "çeri domates", "yeşil soğan"
    ],
    "Kuruyemiş ve Tohumlar": [
      "ceviz", "badem", "fındık", "antep fıstığı", "fıstık", "kaju",
      "ayçiçek çekirdeği", "kabak çekirdeği", "susam", "tahin",
      "chia", "keten tohumu", "haşhaş", "çam fıstığı", "makadamya",
      "pekan", "brezilya fıstığı"
    ],
    "Baharatlar ve Otlar": [
      "maydanoz", "kişniş", "fesleğen", "nane", "dereotu", "kekik",
      "biberiye", "oregan", "zencefil", "zerdeçal", "karabiber",
      "kimyon", "tarçın", "kırmızı pul biber", "sumak", "safran",
      "kişniş tohumu", "hardal tohumu", "anason", "rezene"
    ]
  },
  
  // TAHILLAR VE BAKLAGİLLER
  "Tahıllar ve Baklagiller": {
    "Tahıllar": [
      "pirinç", "bulgur", "buğday", "yulaf", "arpa", "mısır", "kinoa",
      "kuskus", "darı", "amarant", "sorgum", "teff", "çavdar", "irmik",
      "noodle", "basmati", "jasmine", "esmer pirinç"
    ],
    "Baklagiller": [
      "nohut", "mercimek", "fasulye", "barbunya", "bezelye", "bakla",
      "soya", "edamame", "tempeh", "tofu", "mungo", "lupin", "lima",
      "pinto", "siyah fasulye", "kırmızı fasulye"
    ],
    "Ekmek ve Hamur İşleri": [
      "ekmek", "simit", "kruvasan", "kepekli", "tam tahıllı", "pide",
      "naan", "makarna", "spagetti", "penne", "burgu", "lazanya",
      "pankek", "waffle", "muffin", "donut", "pizza", "tortilla"
    ]
  },
  
  // YAĞLAR VE SOSLAR
  "Yağlar ve Soslar": {
    "Yağlar ve Soslar": [
      "zeytinyağı", "tereyağı", "ayçiçek yağı", "mısır yağı",
      "kanola yağı", "hindistan cevizi yağı", "susam yağı",
      "mayonez", "hardal", "ketçap", "soya sosu", "sirke",
      "balzamik", "ranch", "barbekü sosu"
    ]
  },
  
  // TATLILAR VE ATIŞTIRMALIKLAR
  "Tatlılar ve Atıştırmalıklar": {
    "Tatlılar ve Atıştırmalıklar": [
      "çikolata", "bal", "reçel", "marmelat", "şeker", "kurabiye",
      "kek", "brownie", "fındık kreması", "marshmallow", "jöle",
      "cips", "kraker", "gevrek"
    ]
  },
  
  // İÇECEKLER
  "İçecekler": {
    "İçecekler": [
      "kahve", "çay", "suyu", "kola", "limonata", "enerji içeceği",
      "protein tozu"
    ]
  }
};

async function assignCategories() {
  console.log("Starting category assignment...\n");
  
  let totalUpdated = 0;
  let uncategorized: string[] = [];
  
  // Get all foods
  const allFoods = await db.select().from(foods);
  console.log(`Total foods to categorize: ${allFoods.length}\n`);
  
  for (const food of allFoods) {
    const foodName = food.name.toLowerCase();
    let matched = false;
    
    // Try to match with category patterns
    for (const [mainCategory, subcategories] of Object.entries(categoryMappings)) {
      for (const [subcategory, keywords] of Object.entries(subcategories)) {
        // Check if any keyword matches the food name
        const isMatch = keywords.some(keyword => 
          foodName.includes(keyword.toLowerCase())
        );
        
        if (isMatch) {
          await db.update(foods)
            .set({ 
              category: mainCategory, 
              subcategory: subcategory 
            })
            .where(sql`id = ${food.id}`);
          
          console.log(`✓ ${food.name} → ${mainCategory} / ${subcategory}`);
          totalUpdated++;
          matched = true;
          break;
        }
      }
      if (matched) break;
    }
    
    if (!matched) {
      uncategorized.push(food.name);
    }
  }
  
  console.log(`\n${"=".repeat(60)}`);
  console.log("CATEGORY ASSIGNMENT SUMMARY");
  console.log("=".repeat(60));
  console.log(`✓ Categorized: ${totalUpdated}`);
  console.log(`⊘ Uncategorized: ${uncategorized.length}`);
  
  if (uncategorized.length > 0) {
    console.log(`\nUncategorized items:`);
    uncategorized.forEach(name => console.log(`  - ${name}`));
  }
  
  console.log("=".repeat(60));
}

assignCategories().catch(console.error);
