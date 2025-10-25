// SSR Routes - Server-side rendering for all pages
import type { Express, Request, Response } from "express";
import { HomePage } from "../client/src/pages/HomePage";
import { FoodDetailPage } from "../client/src/pages/FoodDetailPage";
import { NotFoundPage } from "../client/src/pages/NotFoundPage";
import { SearchResultsPage } from "../client/src/pages/SearchResultsPage";
import { renderComponentToHTML } from "./render";
import {
  buildMetaForHome,
  buildMetaForFood,
  buildFoodJsonLd,
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  injectHead,
} from "./seo/meta-inject";
import { storage } from "./storage";
import { cache } from "./cache";
import type { Food } from "@shared/schema";

/**
 * Register SSR routes
 */
export function registerSSRRoutes(app: Express): void {
  // Search results route
  app.get("/ara", async (req: Request, res: Response) => {
    try {
      const query = (req.query.q as string) || "";

      // If no query, redirect to homepage
      if (!query) {
        return res.redirect("/");
      }

      // Search in database
      const results = await storage.searchFoods(query, 50);

      // Render search results page
      const htmlBody = renderComponentToHTML(
        SearchResultsPage({ query, results })
      );

      // Build meta tags for search
      const meta = {
        title: `"${query}" Arama Sonuçları - kacgram.net`,
        description: `${query} için gıda besin değerleri arama sonuçları. ${results.length} gıda bulundu.`,
        keywords: `${query}, kalori, besin değeri, arama`,
        canonical: `${process.env.BASE_URL || "https://kacgram.net"}/ara?q=${encodeURIComponent(query)}`,
      };

      const jsonLd = [buildOrganizationJsonLd()];

      // Inject head and send response
      const fullHTML = injectHead(htmlBody, meta, jsonLd);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(fullHTML);
    } catch (error) {
      console.error("SSR Error (search):", error);
      res.status(500).send("Server Error");
    }
  });

  // Homepage route
  app.get("/", async (req: Request, res: Response) => {
    try {
      // Get popular foods from cache or database
      const cacheKey = "popular_foods";
      let popularFoods: Food[] | undefined = cache.get<Food[]>(cacheKey);

      if (!popularFoods) {
        popularFoods = await storage.getAllFoods(8); // Get 8 popular foods
        cache.set(cacheKey, popularFoods, 600000); // Cache for 10 minutes
      }

      // Render homepage component
      const htmlBody = renderComponentToHTML(
        HomePage({ popularFoods })
      );

      // Build meta tags
      const meta = buildMetaForHome();
      const jsonLd = [buildOrganizationJsonLd()];

      // Inject head and send response
      const fullHTML = injectHead(htmlBody, meta, jsonLd);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(fullHTML);
    } catch (error) {
      console.error("SSR Error (homepage):", error);
      res.status(500).send("Server Error");
    }
  });

  // Food detail route
  app.get("/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      // Skip if it looks like a static asset
      if (slug.includes(".")) {
        return res.status(404).send("Not Found");
      }

      // Get food from cache or database
      const cacheKey = `food_${slug}`;
      let food: Food | undefined = cache.get<Food>(cacheKey);

      if (!food) {
        food = await storage.getFoodBySlug(slug);
        if (food) {
          cache.set(cacheKey, food, 3600000); // Cache for 1 hour
        }
      }

      if (!food) {
        // Food not found - render 404 page
        const htmlBody = renderComponentToHTML(NotFoundPage({}));
        const meta = {
          title: "Sayfa Bulunamadı - kacgram.net",
          description: "Aradığınız gıda bulunamadı.",
          keywords: "404, bulunamadı",
          canonical: `${process.env.BASE_URL || "https://kacgram.net"}/${slug}`,
        };
        const fullHTML = injectHead(htmlBody, meta);
        return res.status(404).send(fullHTML);
      }

      // Get 6 random alternative foods
      const alternativesCacheKey = `alternatives_${food.id}`;
      let alternatives: Food[] | undefined = cache.get<Food[]>(alternativesCacheKey);

      if (!alternatives) {
        alternatives = await storage.getRandomFoods(6, food.id);
        cache.set(alternativesCacheKey, alternatives, 600000); // Cache for 10 minutes
      }

      // Render food detail page
      const htmlBody = renderComponentToHTML(
        FoodDetailPage({ food, alternatives })
      );

      // Build meta tags
      const meta = buildMetaForFood({
        name: food.name,
        servingLabel: food.servingLabel,
        kcalPerServing: Number(food.calories),
        slug: food.slug,
      });

      // Build JSON-LD schemas
      const jsonLd = [
        buildFoodJsonLd({
          name: food.name,
          slug: food.slug,
          servingLabel: food.servingLabel,
          servingSize: Number(food.servingSize),
          calories: Number(food.calories),
          protein: food.protein ? Number(food.protein) : undefined,
          carbs: food.carbs ? Number(food.carbs) : undefined,
          fat: food.fat ? Number(food.fat) : undefined,
          fiber: food.fiber ? Number(food.fiber) : undefined,
          sugar: food.sugar ? Number(food.sugar) : undefined,
        }),
        buildBreadcrumbJsonLd(food.name, food.slug),
        buildOrganizationJsonLd(),
      ];

      // Inject head and send response
      const fullHTML = injectHead(htmlBody, meta, jsonLd);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(fullHTML);
    } catch (error) {
      console.error("SSR Error (food detail):", error);
      res.status(500).send("Server Error");
    }
  });

  // robots.txt
  app.get("/robots.txt", (req: Request, res: Response) => {
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/*

Sitemap: ${process.env.BASE_URL || "https://kacgram.net"}/sitemap.xml`;

    res.setHeader("Content-Type", "text/plain");
    res.send(robotsTxt);
  });

  // Dynamic sitemap.xml
  app.get("/sitemap.xml", async (req: Request, res: Response) => {
    try {
      const baseUrl = process.env.BASE_URL || "https://kacgram.net";
      
      // Get all foods for sitemap
      const cacheKey = "sitemap_foods";
      let allFoods: Food[] | undefined = cache.get<Food[]>(cacheKey);

      if (!allFoods) {
        allFoods = await storage.getAllFoods(1000); // Get up to 1000 foods
        cache.set(cacheKey, allFoods, 3600000); // Cache for 1 hour
      }

      // Build sitemap XML
      const urls = [
        // Homepage
        `  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
        // Food pages
        ...allFoods.map(
          (food) => `  <url>
    <loc>${baseUrl}/${food.slug}</loc>
    <lastmod>${food.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
        ),
      ];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

      res.setHeader("Content-Type", "application/xml");
      res.send(sitemap);
    } catch (error) {
      console.error("Sitemap Error:", error);
      res.status(500).send("Server Error");
    }
  });
}
