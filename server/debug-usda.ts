// Debug script to inspect USDA API response
import { getFoodById } from "./usda-client";

async function debugUSDA() {
  try {
    console.log("Fetching tomato (FDC ID: 170457)...\n");
    const food = await getFoodById(170457);
    
    // Print full JSON to see structure
    console.log("=== FULL RESPONSE (first 3000 chars) ===");
    console.log(JSON.stringify(food, null, 2).substring(0, 3000));
    console.log("\n...(truncated)...\n");
    
    // Check if foodNutrients exists and what it contains
    console.log("=== FOOD NUTRIENTS STRUCTURE ===");
    if (food.foodNutrients && food.foodNutrients.length > 0) {
      console.log("First nutrient keys:", Object.keys(food.foodNutrients[0]));
      console.log("First nutrient:", JSON.stringify(food.foodNutrients[0], null, 2));
      console.log("\nSecond nutrient:", JSON.stringify(food.foodNutrients[1], null, 2));
      console.log("\nThird nutrient:", JSON.stringify(food.foodNutrients[2], null, 2));
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
}

debugUSDA();
