import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerSSRRoutes } from "./ssr";
import { searchFoods, getFoodById, normalizeFoodData, generateSlug } from "./usda-client";
import { cache } from "./cache";
import type { InsertFood } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Register SSR routes (must be last to catch all non-API routes)
  registerSSRRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
