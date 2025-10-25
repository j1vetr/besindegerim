// USDA FoodData Central API Client
import type { USDAFoodResponse, InsertFood, MicronutrientsData } from "@shared/schema";
import { getFoodImage } from "./openfoodfacts-client";

const USDA_API_BASE = "https://api.nal.usda.gov/fdc/v1";
const API_KEY = process.env.FOODDATA_API_KEY;

if (!API_KEY) {
  throw new Error("FOODDATA_API_KEY environment variable is required");
}

/**
 * Search for foods by query
 */
export async function searchFoods(query: string, pageSize: number = 10): Promise<any[]> {
  const url = `${USDA_API_BASE}/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(query)}&pageSize=${pageSize}`;

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
 * Normalize USDA food data to our database schema
 * Important: Uses serving-based calculations, NOT per 100g
 */
export function normalizeFoodData(
  usdaFood: any,
  turkishName?: string
): Omit<InsertFood, "slug"> {
  const fdcId = usdaFood.fdcId;
  const nameEn = usdaFood.description || usdaFood.lowercaseDescription || "";
  const name = turkishName || nameEn;

  // Extract serving information from USDA data
  let servingSize = 100; // Default to 100g if no portion data
  let servingLabel = "1 porsiyon (100g)";

  // Check for food portions (preferred)
  if (usdaFood.foodPortions && usdaFood.foodPortions.length > 0) {
    const portion = usdaFood.foodPortions[0]; // Use first portion
    
    // Only use gramWeight if available, otherwise use 100g default
    if (portion.gramWeight && portion.gramWeight > 0) {
      servingSize = portion.gramWeight;
      const grams = Math.round(servingSize);
      servingLabel = `1 porsiyon (${grams}g)`;
    } else {
      // No gramWeight available, use 100g default
      servingSize = 100;
      servingLabel = "1 porsiyon (100g)";
    }
  } else if (usdaFood.servingSize && usdaFood.servingSizeUnit) {
    // Check if servingSizeUnit is already in grams
    const unit = usdaFood.servingSizeUnit.toLowerCase();
    if (unit === 'g' || unit === 'gram' || unit === 'grams') {
      servingSize = usdaFood.servingSize;
      const grams = Math.round(servingSize);
      servingLabel = `1 porsiyon (${grams}g)`;
    } else {
      // Unknown unit, use 100g default
      servingSize = 100;
      servingLabel = "1 porsiyon (100g)";
    }
  }

  // Extract nutrients and calculate per serving
  const nutrients = usdaFood.foodNutrients || [];
  
  // Helper to find nutrient by ID and calculate per serving
  const getNutrient = (nutrientId: number): number | undefined => {
    const foodNutrient = nutrients.find((fn: any) => fn.nutrient?.id === nutrientId);
    if (!foodNutrient || foodNutrient.amount === undefined) return undefined;
    
    // USDA values are typically per 100g, scale to our serving size
    const valuePer100g = foodNutrient.amount;
    return (valuePer100g * servingSize) / 100;
  };

  // Macronutrients (USDA nutrient IDs)
  const calories = getNutrient(1008) || 0; // Energy (kcal)
  const protein = getNutrient(1003); // Protein
  const fat = getNutrient(1004); // Total lipid (fat)
  const carbs = getNutrient(1005); // Carbohydrate
  const fiber = getNutrient(1079); // Fiber
  const sugar = getNutrient(2000); // Total sugars

  // Micronutrients - collect available ones
  const micronutrients: MicronutrientsData = {};

  const micronutrientMap: Record<number, string> = {
    1162: "vitamin_c", // Vitamin C
    1106: "vitamin_a", // Vitamin A
    1114: "vitamin_d", // Vitamin D
    1109: "vitamin_e", // Vitamin E
    1185: "vitamin_k", // Vitamin K
    1175: "vitamin_b6", // Vitamin B6
    1178: "vitamin_b12", // Vitamin B12
    1165: "thiamin", // Thiamin
    1166: "riboflavin", // Riboflavin
    1167: "niacin", // Niacin
    1177: "folate", // Folate
    1087: "calcium", // Calcium
    1089: "iron", // Iron
    1090: "magnesium", // Magnesium
    1091: "phosphorus", // Phosphorus
    1092: "potassium", // Potassium
    1093: "sodium", // Sodium
    1095: "zinc", // Zinc
    1098: "copper", // Copper
    1101: "manganese", // Manganese
    1103: "selenium", // Selenium
  };

  nutrients.forEach((foodNutrient: any) => {
    const nutrientId = foodNutrient.nutrient?.id;
    const key = micronutrientMap[nutrientId];
    if (key && foodNutrient.amount !== undefined) {
      const valuePer100g = foodNutrient.amount;
      const valuePerServing = (valuePer100g * servingSize) / 100;
      
      micronutrients[key] = {
        amount: Math.round(valuePerServing * 10) / 10, // Round to 1 decimal
        unit: foodNutrient.nutrient.unitName || "mg",
      };
    }
  });

  return {
    fdcId,
    name,
    nameEn,
    servingSize: servingSize.toString(),
    servingLabel,
    calories: calories.toString(),
    protein: protein?.toString(),
    fat: fat?.toString(),
    carbs: carbs?.toString(),
    fiber: fiber?.toString(),
    sugar: sugar?.toString(),
    micronutrients: Object.keys(micronutrients).length > 0 ? micronutrients : null,
    imageUrl: null, // We'll use placeholders or add images later
  };
}

/**
 * Normalize USDA food data with image fetching from OpenFoodFacts/Wikimedia
 */
export async function normalizeFoodDataWithImage(
  usdaFood: any,
  turkishName?: string
): Promise<Omit<InsertFood, "slug">> {
  const baseData = normalizeFoodData(usdaFood, turkishName);
  
  // Fetch image from OpenFoodFacts or Wikimedia Commons
  try {
    const imageUrl = await getFoodImage(
      baseData.nameEn || "food", 
      turkishName || baseData.name
    );
    return {
      ...baseData,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", // Fallback to food placeholder
    };
  } catch (error) {
    console.error("Error fetching food image:", error);
    // Always provide a placeholder image
    return {
      ...baseData,
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", // Generic food image
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
