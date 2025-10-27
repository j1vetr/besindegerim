import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { storage } from "./storage";
import { registerSSRRoutes } from "./ssr";
import { searchFoods, getFoodById, normalizeFoodData, generateSlug } from "./usda-client";
import { cache } from "./cache";
import type { InsertFood } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from client/public in development
  if (app.get("env") === "development") {
    const publicPath = path.resolve(import.meta.dirname, "..", "client", "public");
    app.use(express.static(publicPath));
  }

  // API routes for backend operations
  // All API routes are prefixed with /api

  /**
   * API: Search for foods via USDA and optionally import them
   * GET /api/search?q=tomato
   */
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }

      // Check cache first
      const cacheKey = `usda_search_${query.toLowerCase()}`;
      let results = cache.get<any[]>(cacheKey);

      if (!results) {
        // Fetch from USDA API
        results = await searchFoods(query, 20);
        cache.set(cacheKey, results, 3600000); // Cache for 1 hour
      }

      res.json({ results });
    } catch (error) {
      console.error("Search API Error:", error);
      res.status(500).json({ error: "Failed to search foods" });
    }
  });

  /**
   * API: Import a food from USDA by FDC ID
   * POST /api/import
   * Body: { fdcId: number, turkishName?: string }
   */
  app.post("/api/import", async (req, res) => {
    try {
      const { fdcId, turkishName } = req.body;

      if (!fdcId) {
        return res.status(400).json({ error: "fdcId is required" });
      }

      // Check if food already exists
      const existing = await storage.getFoodByFdcId(fdcId);
      if (existing) {
        return res.json({ food: existing, imported: false });
      }

      // Fetch from USDA
      const usdaFood = await getFoodById(fdcId);
      
      // Normalize to our schema
      const normalizedData = normalizeFoodData(usdaFood, turkishName);
      
      // Generate slug
      const slug = generateSlug(normalizedData.name);

      // Create in database
      const food = await storage.createFood({
        ...normalizedData,
        slug,
      });

      // Clear relevant caches
      cache.delete("popular_foods");
      cache.delete("sitemap_foods");

      res.json({ food, imported: true });
    } catch (error) {
      console.error("Import API Error:", error);
      res.status(500).json({ error: "Failed to import food" });
    }
  });

  /**
   * API: Get random foods (for alternatives)
   * GET /api/random?count=6&exclude=food-id
   */
  app.get("/api/random", async (req, res) => {
    try {
      const count = parseInt(req.query.count as string) || 6;
      const excludeId = req.query.exclude as string | undefined;

      const foods = await storage.getRandomFoods(count, excludeId);
      res.json({ foods });
    } catch (error) {
      console.error("Random API Error:", error);
      res.status(500).json({ error: "Failed to get random foods" });
    }
  });

  /**
   * API: Get all categories
   * GET /api/categories
   */
  app.get("/api/categories", async (req, res) => {
    try {
      const cacheKey = "all_categories";
      let categories = cache.get<string[]>(cacheKey);

      if (!categories) {
        categories = await storage.getAllCategories();
        cache.set(cacheKey, categories, 3600000); // Cache for 1 hour
      }

      res.json(categories);
    } catch (error) {
      console.error("Categories API Error:", error);
      res.status(500).json({ error: "Failed to get categories" });
    }
  });

  /**
   * API: Get category groups (with subcategories)
   * GET /api/category-groups
   */
  app.get("/api/category-groups", async (req, res) => {
    try {
      const cacheKey = "all_category_groups";
      let categoryGroups = cache.get<any[]>(cacheKey);

      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(cacheKey, categoryGroups, 3600000); // Cache for 1 hour
      }

      res.json(categoryGroups);
    } catch (error) {
      console.error("Category Groups API Error:", error);
      res.status(500).json({ error: "Failed to get category groups" });
    }
  });

  /**
   * API: Get food by slug
   * GET /api/foods/:slug
   */
  app.get("/api/foods/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const cacheKey = `food_${slug}`;
      let food = cache.get<any>(cacheKey);

      if (!food) {
        food = await storage.getFoodBySlug(slug);
        if (food) {
          cache.set(cacheKey, food, 3600000); // Cache for 1 hour
        }
      }

      if (!food) {
        return res.status(404).json({ error: "Food not found" });
      }

      // Get alternatives
      const alternatives = await storage.getRandomFoods(6, food.id);

      res.json({ food, alternatives });
    } catch (error) {
      console.error("Food Detail API Error:", error);
      res.status(500).json({ error: "Failed to get food" });
    }
  });

  /**
   * API: Get foods by category
   * GET /api/foods/category/:category
   */
  app.get("/api/foods/category/:category", async (req, res) => {
    try {
      const category = decodeURIComponent(req.params.category);
      const cacheKey = `category_${category}`;
      let foods = cache.get<any[]>(cacheKey);

      if (!foods) {
        foods = await storage.getFoodsByCategory(category);
        cache.set(cacheKey, foods, 600000); // Cache for 10 minutes
      }

      res.json({ foods });
    } catch (error) {
      console.error("Category Foods API Error:", error);
      res.status(500).json({ error: "Failed to get foods by category" });
    }
  });

  /**
   * API: Get foods by subcategory
   * GET /api/foods/subcategory/:subcategory
   */
  app.get("/api/foods/subcategory/:subcategory", async (req, res) => {
    try {
      const subcategory = decodeURIComponent(req.params.subcategory);
      const cacheKey = `subcategory_${subcategory}`;
      let foods = cache.get<any[]>(cacheKey);

      if (!foods) {
        foods = await storage.getFoodsBySubcategory(subcategory);
        cache.set(cacheKey, foods, 600000); // Cache for 10 minutes
      }

      res.json({ foods });
    } catch (error) {
      console.error("Subcategory Foods API Error:", error);
      res.status(500).json({ error: "Failed to get foods by subcategory" });
    }
  });

  /**
   * API: Search foods in database (for autocomplete)
   * GET /api/foods/search?q=domates
   */
  app.get("/api/foods/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 3) {
        return res.json({ foods: [] });
      }

      const cacheKey = `foods_search_${query.toLowerCase()}`;
      let foods = cache.get<any[]>(cacheKey);

      if (!foods) {
        foods = await storage.searchFoods(query, 8);
        cache.set(cacheKey, foods, 600000); // Cache for 10 minutes
      }

      res.json({ foods });
    } catch (error) {
      console.error("Foods Search API Error:", error);
      res.status(500).json({ error: "Failed to search foods" });
    }
  });

  // Register SSR routes only in production (must be last to catch all non-API routes)
  // In development, Vite dev server handles all page rendering
  if (app.get("env") !== "development") {
    registerSSRRoutes(app);
  }

  const httpServer = createServer(app);
  return httpServer;
}
