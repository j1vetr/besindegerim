/**
 * SSR Routes - Server-side rendering
 * Pure HTML rendering (React component yok)
 */
import type { Express, Request, Response } from "express";
import fs from "fs";
import path from "path";
import {
  renderHomePage,
  renderFoodDetailPage,
  render404Page,
  renderAllFoodsPage,
} from "./render";
import {
  buildMetaForHome,
  buildMetaForFood,
  injectHead,
} from "./seo/meta-inject";
import { storage } from "./storage";
import { cache } from "./cache";
import type { Food, CategoryGroup } from "@shared/schema";

/**
 * HTML template'ini oku ve meta + body inject et
 */
async function renderHTMLWithMeta(
  req: Request,
  res: Response,
  templatePath: string,
  renderResult: { html: string; statusCode: number },
  meta: any
) {
  try {
    let template = await fs.promises.readFile(templatePath, "utf-8");
    
    // Meta tag'leri inject et
    template = injectHead(template, meta);
    
    // Body içeriğini inject et
    template = template.replace(
      '<div id="root"></div>',
      `<div id="root">${renderResult.html}</div>`
    );
    
    res.status(renderResult.statusCode).set({ "Content-Type": "text/html" }).send(template);
  } catch (error) {
    console.error("HTML render error:", error);
    res.status(500).send("Server Error");
  }
}

/**
 * SSR Route'larını kaydet
 */
export function registerSSRRoutes(app: Express): void {
  const templatePath = path.resolve(process.cwd(), "dist", "public", "index.html");
  
  // Ana sayfa: /
  app.get("/", async (req: Request, res: Response) => {
    try {
      // Get category groups
      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      // Get popular foods
      const popularCacheKey = "popular_foods";
      let foods: Food[] | undefined = cache.get<Food[]>(popularCacheKey);
      if (!foods) {
        foods = await storage.getPopularFoods(12);
        cache.set(popularCacheKey, foods, 600000);
      }

      // Render (foods guaranteed to exist)
      const renderResult = await renderHomePage(foods || [], categoryGroups);
      const meta = buildMetaForHome();
      
      await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    } catch (error) {
      console.error("[SSR /] Error:", error);
      res.status(500).send("Server Error");
    }
  });

  // Tüm gıdalar: /tum-gidalar
  app.get("/tum-gidalar", async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 30;
      const offset = (page - 1) * limit;

      // Get category groups
      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      // Get all foods with pagination
      const allFoods = await storage.getAllFoods();
      const totalPages = Math.ceil(allFoods.length / limit);
      const foods = allFoods.slice(offset, offset + limit);

      // Render
      const renderResult = await renderAllFoodsPage(foods, categoryGroups, page, totalPages);
      const meta = {
        title: `Tüm Gıdalar - Sayfa ${page} | besindegerim.com`,
        description: `${allFoods.length} gıdanın besin değerlerini keşfedin`,
        keywords: "besin değerleri, kalori, gıdalar",
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/tum-gidalar?page=${page}`,
      };

      await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    } catch (error) {
      console.error("[SSR /tum-gidalar] Error:", error);
      res.status(500).send("Server Error");
    }
  });

  // Gıda detay: /:slug (catch-all route - EN SONDA)
  app.get("/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      // Skip static files and special routes
      if (
        slug.includes(".") ||
        slug === "robots.txt" ||
        slug === "sitemap.xml" ||
        slug === "hesaplayicilar" ||
        slug.startsWith("api")
      ) {
        return res.status(404).send("Not Found");
      }

      // Get category groups
      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      // Get food by slug
      const cacheKey = `food_${slug}`;
      let food: Food | undefined = cache.get<Food>(cacheKey);
      if (!food) {
        food = await storage.getFoodBySlug(slug);
        if (food) {
          cache.set(cacheKey, food, 3600000);
        }
      }

      if (!food) {
        // 404
        const renderResult = await render404Page(categoryGroups);
        const meta = {
          title: "Gıda Bulunamadı - besindegerim.com",
          description: "Aradığınız gıda bulunamadı.",
          keywords: "besin değerleri",
          canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${req.path}`,
        };
        return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
      }

      // Render food detail
      const renderResult = await renderFoodDetailPage(food, categoryGroups);
      const meta = buildMetaForFood({
        name: food.name,
        servingLabel: food.servingLabel || `${food.servingSize}g`,
        kcalPerServing: parseFloat(food.calories),
        slug: food.slug,
      });

      await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    } catch (error) {
      console.error("[SSR /:slug] Error:", error);
      res.status(500).send("Server Error");
    }
  });

  // robots.txt
  app.get("/robots.txt", (_req: Request, res: Response) => {
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${process.env.BASE_URL || "https://besindegerim.com"}/sitemap.xml`;
    res.type("text/plain").send(robotsTxt);
  });

  // sitemap.xml
  app.get("/sitemap.xml", async (_req: Request, res: Response) => {
    try {
      const cacheKey = "sitemap_foods";
      let foods: Food[] | undefined = cache.get<Food[]>(cacheKey);
      if (!foods) {
        foods = await storage.getAllFoods();
        cache.set(cacheKey, foods, 3600000);
      }

      const baseUrl = process.env.BASE_URL || "https://besindegerim.com";
      const urls = [
        { loc: baseUrl, priority: "1.0" },
        { loc: `${baseUrl}/tum-gidalar`, priority: "0.9" },
        ...foods.map((food) => ({
          loc: `${baseUrl}/${food.slug}`,
          priority: "0.8",
        })),
      ];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url.loc}</loc>
    <priority>${url.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

      res.type("application/xml").send(sitemap);
    } catch (error) {
      console.error("[SSR /sitemap.xml] Error:", error);
      res.status(500).send("Server Error");
    }
  });
}
