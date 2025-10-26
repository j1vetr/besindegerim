// Script to translate English serving labels to Turkish
import { db } from "./db";
import { foods } from "@shared/schema";
import { eq } from "drizzle-orm";

// Translation mapping for common serving size terms
const translations: Record<string, string> = {
  // Volume measurements
  "cup": "su bardağı",
  "fl oz": "ml",
  "fluid ounce": "ml",
  
  // Weight measurements  
  "oz": "dilim",
  
  // Spoon measurements
  "tbsp": "yemek kaşığı",
  "tablespoon": "yemek kaşığı",
  "tsp": "çay kaşığı",
  "teaspoon": "çay kaşığı",
  
  // Container types
  "can": "kutu",
  "bottle": "şişe",
  "container": "kap",
  
  // Piece/portion terms
  "slice": "dilim",
  "piece": "adet",
  "chunk": "parça",
  "fillet": "fileto",
  "serving": "porsiyon",
  "portion": "porsiyon",
  
  // Size descriptors
  "large": "büyük",
  "medium": "orta",
  "small": "küçük",
  "any size": "herhangi bir boyutta",
  "regular": "normal",
  
  // Other food items
  "melon": "karpuz",
  "sushi": "suşi",
  
  // Preparation states
  "cooked": "pişmiş",
  "raw": "çiğ",
  "mashed": "püre",
  "chopped": "doğranmış",
  "sliced": "dilimlenmiş",
  "diced": "küp doğranmış",
  
  // Other
  "NFS": "",
  "Not Further Specified": "",
  "Guideline amount per": "Porsiyon başına",
  "of beverage": "içecek",
  "with ice": "buzlu",
  "Quantity not specified": "Miktar belirtilmemiş",
};

// Special cases for better Turkish translations
const specialCases: Record<string, string> = {
  // Milk and beverages - use ml or fincan
  "1 fl oz": "1 fincan",
  "1 cup": "1 su bardağı",
  
  // Bacon, meat slices
  "1 oz, cooked": "1 dilim pişmiş",
  
  // Can/bottle conversions
  "1 can or bottle (16 fl oz)": "1 kutu (480 ml)",
  "1 can (6 fl oz)": "1 küçük kutu (180 ml)",
};

function translateServingLabel(label: string): string {
  let translated = label;
  
  // Don't translate if already Turkish (but not "fincan" which contains "can")
  if (label.includes("fincan")) {
    return label; // Already Turkish
  }
  
  const hasEnglish = /\b(cup|oz|tbsp|tsp|bottle|slice|piece|chunk|fillet|large|medium|small|cooked|mashed|sushi|melon|guideline|quantity)\b/i.test(label);
  if (!hasEnglish) {
    return label; // Already Turkish
  }
  
  // Remove parentheses content temporarily
  const gramMatch = label.match(/\((\d+\.?\d*)(g|ml)?\)/);
  const baseLabel = label.replace(/\([^)]*\)/, "").trim();
  
  // Apply special cases first
  for (const [english, turkish] of Object.entries(specialCases)) {
    if (baseLabel.toLowerCase().includes(english.toLowerCase())) {
      translated = turkish;
      if (gramMatch) {
        translated += ` (${gramMatch[1]}${gramMatch[2] || 'g'})`;
      }
      return translated;
    }
  }
  
  // Apply general translations - order matters! More specific first
  translated = baseLabel;
  
  // Apply translations in specific order to avoid conflicts
  const orderedTranslations = [
    "any size", "Quantity not specified", "Guideline amount per", 
    "Not Further Specified", "of beverage", "with ice",
    "tablespoon", "teaspoon", "fluid ounce",
    "tbsp", "tsp", "fl oz",
    "slice", "piece", "chunk", "fillet", "serving", "portion",
    "large", "medium", "small", "regular",
    "melon", "sushi",
    "cooked", "raw", "mashed", "chopped", "sliced", "diced",
    "bottle", "container",
    "cup", "can", "oz", // These last to avoid conflicts
    "NFS"
  ];
  
  for (const english of orderedTranslations) {
    if (translations[english]) {
      const regex = new RegExp(`\\b${english}\\b`, "gi");
      translated = translated.replace(regex, translations[english]);
    }
  }
  
  // Clean up
  translated = translated
    .replace(/,\s*,/g, ",") // Remove double commas
    .replace(/\s+/g, " ") // Normalize spaces
    .replace(/,\s*\(/g, " (") // Clean comma before parenthesis
    .replace(/\s*,\s*$/g, "") // Remove trailing comma
    .trim();
  
  // Add back gram info if exists
  if (gramMatch) {
    translated += ` (${gramMatch[1]}${gramMatch[2] || 'g'})`;
  }
  
  return translated;
}

async function translateAllServings() {
  console.log("🔄 Translating serving labels to Turkish...\n");
  
  // Get all foods with English serving labels
  const allFoods = await db.select().from(foods);
  
  let updatedCount = 0;
  
  for (const food of allFoods) {
    const originalLabel = food.servingLabel;
    
    // Skip if already looks Turkish (no English keywords)
    const hasEnglish = /cup|oz|tbsp|tsp|can|bottle|cooked|mashed|NFS/i.test(originalLabel);
    
    if (!hasEnglish) {
      continue;
    }
    
    const translatedLabel = translateServingLabel(originalLabel);
    
    if (translatedLabel !== originalLabel) {
      console.log(`📝 ${food.name}`);
      console.log(`   Before: ${originalLabel}`);
      console.log(`   After:  ${translatedLabel}\n`);
      
      await db
        .update(foods)
        .set({ servingLabel: translatedLabel })
        .where(eq(foods.id, food.id));
      
      updatedCount++;
    }
  }
  
  console.log(`✅ Translation complete! Updated ${updatedCount} serving labels.`);
}

// Run the translation
translateAllServings().catch(console.error);
