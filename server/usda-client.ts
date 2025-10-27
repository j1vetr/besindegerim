// Enhanced USDA FoodData Central API Client with full nutrition + Branded Foods support
import type { USDAFoodResponse, InsertFood, MicronutrientsData } from "@shared/schema";
import { getWikimediaImage } from "./wikipedia-client";

const USDA_API_BASE = "https://api.nal.usda.gov/fdc/v1";
const API_KEY = process.env.FOODDATA_API_KEY;

if (!API_KEY) {
  throw new Error("FOODDATA_API_KEY environment variable is required");
}

/**
 * Search for foods by query (includes Foundation, SR Legacy, Branded)
 */
export async function searchFoods(query: string, pageSize: number = 25, dataType?: string[]): Promise<any[]> {
  const url = `${USDA_API_BASE}/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(query)}&pageSize=${pageSize}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`USDA API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.foods || [];
}

/**
 * Search specifically for branded foods (Lay's, Doritos, Coca-Cola, etc.)
 */
export async function searchBrandedFoods(query: string, pageSize: number = 25): Promise<any[]> {
  const url = `${USDA_API_BASE}/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(query)}&dataType=Branded&pageSize=${pageSize}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`USDA API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.foods || [];
}

/**
 * Get detailed food information by FDC ID
 */
export async function getFoodById(fdcId: number): Promise<any> {
  const url = `${USDA_API_BASE}/food/${fdcId}?api_key=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`USDA API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Enhanced nutrient extraction with ALL USDA nutrients
 * Includes macros, micros, vitamins, minerals
 */
function extractAllNutrients(nutrients: any[], servingSize: number) {
  // Helper to find nutrient by ID and calculate per serving
  const getNutrient = (nutrientId: number): number | undefined => {
    const foodNutrient = nutrients.find((fn: any) => fn.nutrient?.id === nutrientId);
    if (!foodNutrient || foodNutrient.amount === undefined) return undefined;
    
    // USDA values are typically per 100g, scale to our serving size
    const valuePer100g = foodNutrient.amount;
    return (valuePer100g * servingSize) / 100;
  };

  // MACRONUTRIENTS (using official USDA nutrient IDs)
  const macros = {
    calories: getNutrient(1008) || 0, // Energy (kcal)
    protein: getNutrient(1003), // Protein
    fat: getNutrient(1004), // Total lipid (fat)
    saturatedFat: getNutrient(1258), // Fatty acids, total saturated
    transFat: getNutrient(1257), // Fatty acids, total trans
    cholesterol: getNutrient(1253), // Cholesterol
    carbs: getNutrient(1005), // Carbohydrate, by difference
    fiber: getNutrient(1079), // Fiber, total dietary
    sugar: getNutrient(2000), // Sugars, total including NLEA
    addedSugar: getNutrient(1235), // Added sugars
    sodium: getNutrient(1093), // Sodium, Na
    potassium: getNutrient(1092), // Potassium, K
  };

  // MICRONUTRIENTS - comprehensive vitamin & mineral mapping
  const micronutrients: MicronutrientsData = {};

  const micronutrientMap: Record<number, string> = {
    // Vitamins
    1106: "vitamin_a", // Vitamin A, RAE
    1162: "vitamin_c", // Vitamin C, total ascorbic acid
    1114: "vitamin_d", // Vitamin D (D2 + D3)
    1109: "vitamin_e", // Vitamin E (alpha-tocopherol)
    1185: "vitamin_k", // Vitamin K (phylloquinone)
    1165: "thiamin", // Thiamin (B1)
    1166: "riboflavin", // Riboflavin (B2)
    1167: "niacin", // Niacin (B3)
    1175: "vitamin_b6", // Vitamin B-6
    1178: "vitamin_b12", // Vitamin B-12
    1177: "folate", // Folate, total
    1176: "folate_dfe", // Folate, DFE
    1170: "pantothenic_acid", // Pantothenic acid (B5)
    1180: "choline", // Choline, total
    
    // Minerals
    1087: "calcium", // Calcium, Ca
    1089: "iron", // Iron, Fe
    1090: "magnesium", // Magnesium, Mg
    1091: "phosphorus", // Phosphorus, P
    1095: "zinc", // Zinc, Zn
    1098: "copper", // Copper, Cu
    1101: "manganese", // Manganese, Mn
    1103: "selenium", // Selenium, Se
    1096: "fluoride", // Fluoride, F
    1100: "iodine", // Iodine, I
  };

  nutrients.forEach((foodNutrient: any) => {
    const nutrientId = foodNutrient.nutrient?.id;
    const key = micronutrientMap[nutrientId];
    if (key && foodNutrient.amount !== undefined) {
      const valuePer100g = foodNutrient.amount;
      const valuePerServing = (valuePer100g * servingSize) / 100;
      
      micronutrients[key] = {
        amount: Math.round(valuePerServing * 100) / 100, // Round to 2 decimals
        unit: foodNutrient.nutrient.unitName || "mg",
      };
    }
  });

  return { macros, micronutrients };
}

/**
 * Normalize USDA food data to our database schema (ENHANCED VERSION)
 * Supports Foundation, Survey, and Branded Foods
 */
export function normalizeFoodData(
  usdaFood: any,
  turkishName?: string
): Omit<InsertFood, "slug"> {
  const fdcId = usdaFood.fdcId;
  const dataType = usdaFood.dataType; // "Foundation", "SR Legacy", "Branded", etc.
  
  // Name handling - prioritize Turkish, then description
  let nameEn = usdaFood.description || usdaFood.lowercaseDescription || "";
  
  // For branded foods, use brandOwner + brandName if available
  if (dataType === "Branded" && usdaFood.brandOwner && usdaFood.brandName) {
    nameEn = `${usdaFood.brandOwner} ${usdaFood.brandName}`;
  }
  
  const name = turkishName || nameEn;

  // Extract serving information from USDA data
  let servingSize = 100; // Default to 100g
  let servingLabel = "1 porsiyon (100g)";

  // Priority 1: Food portions (most accurate)
  if (usdaFood.foodPortions && usdaFood.foodPortions.length > 0) {
    const portion = usdaFood.foodPortions[0];
    
    if (portion.gramWeight && portion.gramWeight > 0) {
      servingSize = portion.gramWeight;
      const grams = Math.round(servingSize);
      
      // Use portion description if available
      if (portion.portionDescription) {
        servingLabel = `${portion.portionDescription} (${grams}g)`;
      } else {
        servingLabel = `1 porsiyon (${grams}g)`;
      }
    }
  } 
  // Priority 2: Serving size field
  else if (usdaFood.servingSize && usdaFood.servingSizeUnit) {
    const unit = usdaFood.servingSizeUnit.toLowerCase();
    if (unit === 'g' || unit === 'gram' || unit === 'grams') {
      servingSize = usdaFood.servingSize;
      const grams = Math.round(servingSize);
      servingLabel = `1 porsiyon (${grams}g)`;
    }
  }
  // Priority 3: Branded foods often have household serving size
  else if (dataType === "Branded" && usdaFood.householdServingFullText) {
    // Try to extract grams from household serving
    servingLabel = usdaFood.householdServingFullText;
    // Keep 100g default for calculations unless specified
  }

  // Extract all nutrients
  const nutrients = usdaFood.foodNutrients || [];
  const { macros, micronutrients } = extractAllNutrients(nutrients, servingSize);

  return {
    fdcId,
    name,
    nameEn,
    servingSize: servingSize.toString(),
    servingLabel,
    // Macronutrients
    calories: macros.calories.toString(),
    protein: macros.protein?.toString(),
    fat: macros.fat?.toString(),
    saturatedFat: macros.saturatedFat?.toString(),
    transFat: macros.transFat?.toString(),
    cholesterol: macros.cholesterol?.toString(),
    carbs: macros.carbs?.toString(),
    fiber: macros.fiber?.toString(),
    sugar: macros.sugar?.toString(),
    addedSugar: macros.addedSugar?.toString(),
    sodium: macros.sodium?.toString(),
    potassium: macros.potassium?.toString(),
    // Micronutrients
    micronutrients: Object.keys(micronutrients).length > 0 ? micronutrients : null,
    imageUrl: null,
  };
}

/**
 * Normalize USDA food data with image fetching from Wikipedia/Wikimedia Commons
 */
export async function normalizeFoodDataWithImage(
  usdaFood: any,
  turkishName?: string,
  category?: string
): Promise<Omit<InsertFood, "slug">> {
  const baseData = normalizeFoodData(usdaFood, turkishName);
  
  // Fetch image from Wikipedia/Wikimedia Commons (translates Turkish to English internally)
  try {
    const searchQuery = turkishName || baseData.name;
    
    // Get image from Wikipedia/Wikimedia Commons
    let imageUrl = await getWikimediaImage(searchQuery);
    
    // Fallback to placeholder if not found
    if (!imageUrl) {
      console.warn(`⚠️  No image found for "${searchQuery}", using placeholder`);
      imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";
    }
    
    return {
      ...baseData,
      category: category || "Diğer",
      imageUrl,
    };
  } catch (error) {
    console.error("Error fetching image:", error);
    // Always provide a placeholder image
    return {
      ...baseData,
      category: category || "Diğer",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    };
  }
}

/**
 * Generate a slug from food name (Turkish-friendly)
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
