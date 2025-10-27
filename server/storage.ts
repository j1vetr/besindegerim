// Database storage implementation following javascript_database blueprint pattern
import { foods, type Food, type InsertFood, type CategoryGroup } from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc } from "drizzle-orm";

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IStorage {
  // Food operations
  getFoodBySlug(slug: string): Promise<Food | undefined>;
  getFoodById(id: string): Promise<Food | undefined>;
  getFoodByFdcId(fdcId: number): Promise<Food | undefined>;
  createFood(food: InsertFood): Promise<Food>;
  updateFood(id: string, food: Partial<InsertFood>): Promise<Food | undefined>;
  getAllFoods(limit?: number): Promise<Food[]>;
  getAllFoodsPaginated(page: number, limit: number): Promise<PaginatedResult<Food>>;
  getPopularFoods(limit: number): Promise<Food[]>;
  getRandomFoods(count: number, excludeId?: string): Promise<Food[]>;
  searchFoods(query: string, limit?: number): Promise<Food[]>;
  getFoodsByCategory(category: string, limit?: number): Promise<Food[]>;
  getFoodsBySubcategory(subcategory: string, limit?: number): Promise<Food[]>;
  getAllCategories(): Promise<string[]>;
  getCategoryGroups(): Promise<CategoryGroup[]>;
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

  async getAllFoodsPaginated(page: number, limit: number): Promise<PaginatedResult<Food>> {
    const offset = (page - 1) * limit;
    
    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(foods);
    
    const total = countResult?.count || 0;
    const totalPages = Math.ceil(total / limit);
    
    // Get paginated items
    const items = await db
      .select()
      .from(foods)
      .orderBy(desc(foods.cachedAt))
      .limit(limit)
      .offset(offset);
    
    return {
      items,
      page,
      limit,
      total,
      totalPages,
    };
  }

  async getPopularFoods(limit: number): Promise<Food[]> {
    // Return most recently cached foods (or by calories desc)
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

  async getFoodsBySubcategory(subcategory: string, limit: number = 50): Promise<Food[]> {
    return db
      .select()
      .from(foods)
      .where(eq(foods.subcategory, subcategory))
      .orderBy(desc(foods.calories))
      .limit(limit);
  }

  async getCategoryGroups(): Promise<CategoryGroup[]> {
    // Get all unique category/subcategory combinations
    const results = await db
      .selectDistinct({ 
        category: foods.category, 
        subcategory: foods.subcategory 
      })
      .from(foods)
      .orderBy(foods.category, foods.subcategory);
    
    // Group by main category
    const grouped = new Map<string, string[]>();
    for (const row of results) {
      if (!row.category) continue;
      
      if (!grouped.has(row.category)) {
        grouped.set(row.category, []);
      }
      
      if (row.subcategory) {
        grouped.get(row.category)!.push(row.subcategory);
      }
    }
    
    // Convert to CategoryGroup array with ordered categories
    const categoryOrder = [
      "Hayvansal Ürünler",
      "Bitkisel Ürünler", 
      "Tahıllar ve Baklagiller",
      "Yağlar ve Soslar",
      "Tatlılar ve Atıştırmalıklar",
      "İçecekler"
    ];
    
    return categoryOrder
      .filter(cat => grouped.has(cat))
      .map(cat => ({
        mainCategory: cat,
        subcategories: grouped.get(cat)!
      }));
  }
}

export const storage = new DatabaseStorage();
