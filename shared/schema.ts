import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Foods table - stores normalized food data from USDA API
export const foods = pgTable("foods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // USDA FDC ID for reference
  fdcId: integer("fdc_id").notNull().unique(),
  // URL-friendly slug (e.g., "domates")
  slug: text("slug").notNull().unique(),
  // Turkish food name
  name: text("name").notNull(),
  // English name from USDA (for API reference)
  nameEn: text("name_en"),
  // Category (e.g., "Meyveler", "Sebzeler", "Et & Tavuk", etc.)
  category: text("category").notNull().default("Diğer"),
  // Serving information from USDA API
  servingSize: decimal("serving_size", { precision: 10, scale: 2 }).notNull(), // in grams
  servingLabel: text("serving_label").notNull(), // e.g., "1 orta domates", "1 porsiyon"
  // Nutrition per serving
  calories: decimal("calories", { precision: 10, scale: 2 }).notNull(),
  protein: decimal("protein", { precision: 10, scale: 2 }), // grams
  fat: decimal("fat", { precision: 10, scale: 2 }), // grams
  carbs: decimal("carbs", { precision: 10, scale: 2 }), // grams
  fiber: decimal("fiber", { precision: 10, scale: 2 }), // grams
  sugar: decimal("sugar", { precision: 10, scale: 2 }), // grams
  // Micronutrients stored as JSON (flexible structure for available data)
  // Example: { "vitamin_c": { "amount": 10, "unit": "mg" }, "calcium": { "amount": 20, "unit": "mg" } }
  micronutrients: jsonb("micronutrients"),
  // Image URL (from Pexels)
  imageUrl: text("image_url"),
  // Cache metadata
  cachedAt: timestamp("cached_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Insert schema for foods
export const insertFoodSchema = createInsertSchema(foods).omit({
  id: true,
  cachedAt: true,
  updatedAt: true,
});

export type InsertFood = z.infer<typeof insertFoodSchema>;
export type Food = typeof foods.$inferSelect;

// Type for micronutrients JSON structure
export interface Micronutrient {
  amount: number;
  unit: string;
}

export interface MicronutrientsData {
  [key: string]: Micronutrient;
}

// Type for USDA API response (simplified - we'll normalize this)
export interface USDAFoodResponse {
  fdcId: number;
  description: string;
  foodNutrients: Array<{
    nutrientId: number;
    nutrientName: string;
    value: number;
    unitName: string;
  }>;
  servingSize?: number;
  servingSizeUnit?: string;
  foodPortions?: Array<{
    portionDescription: string;
    gramWeight: number;
  }>;
}
