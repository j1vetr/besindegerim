// Database storage implementation following javascript_database blueprint pattern
import { foods, type Food, type InsertFood } from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc } from "drizzle-orm";

export interface IStorage {
  // Food operations
  getFoodBySlug(slug: string): Promise<Food | undefined>;
  getFoodById(id: string): Promise<Food | undefined>;
  getFoodByFdcId(fdcId: number): Promise<Food | undefined>;
  createFood(food: InsertFood): Promise<Food>;
  updateFood(id: string, food: Partial<InsertFood>): Promise<Food | undefined>;
  getAllFoods(limit?: number): Promise<Food[]>;
  getRandomFoods(count: number, excludeId?: string): Promise<Food[]>;
  searchFoods(query: string, limit?: number): Promise<Food[]>;
  getFoodsByCategory(category: string, limit?: number): Promise<Food[]>;
  getAllCategories(): Promise<string[]>;
}

export class DatabaseStorage implements IStorage {
  async getFoodBySlug(slug: string): Promise<Food | undefined> {
    const [food] = await db.select().from(foods).where(eq(foods.slug, slug));
    return food || undefined;
  }

  async getFoodById(id: string): Promise<Food | undefined> {
    const [food] = await db.select().from(foods).where(eq(foods.id, id));
    return food || undefined;
  }

  async getFoodByFdcId(fdcId: number): Promise<Food | undefined> {
    const [food] = await db.select().from(foods).where(eq(foods.fdcId, fdcId));
    return food || undefined;
  }

  async createFood(insertFood: InsertFood): Promise<Food> {
    const [food] = await db
      .insert(foods)
      .values(insertFood)
      .returning();
    return food;
  }

  async updateFood(
    id: string,
    updateData: Partial<InsertFood>
  ): Promise<Food | undefined> {
    const [food] = await db
      .update(foods)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(foods.id, id))
      .returning();
    return food || undefined;
  }

  async getAllFoods(limit: number = 100): Promise<Food[]> {
    return db
      .select()
      .from(foods)
      .orderBy(desc(foods.cachedAt))
      .limit(limit);
  }

  async getRandomFoods(count: number, excludeId?: string): Promise<Food[]> {
    // PostgreSQL random selection
    const query = db
      .select()
      .from(foods)
      .orderBy(sql`RANDOM()`)
      .limit(count);

    if (excludeId) {
      const results = await query;
      return results.filter((food) => food.id !== excludeId);
    }

    return query;
  }

  async searchFoods(query: string, limit: number = 10): Promise<Food[]> {
    // Case-insensitive search on name
    const searchPattern = `%${query.toLowerCase()}%`;
    return db
      .select()
      .from(foods)
      .where(sql`LOWER(${foods.name}) LIKE ${searchPattern}`)
      .limit(limit);
  }

  async getFoodsByCategory(category: string, limit: number = 50): Promise<Food[]> {
    return db
      .select()
      .from(foods)
      .where(eq(foods.category, category))
      .orderBy(desc(foods.calories))
      .limit(limit);
  }

  async getAllCategories(): Promise<string[]> {
    const results = await db
      .selectDistinct({ category: foods.category })
      .from(foods)
      .orderBy(foods.category);
    return results.map((r) => r.category).filter(Boolean);
  }
}

export const storage = new DatabaseStorage();
