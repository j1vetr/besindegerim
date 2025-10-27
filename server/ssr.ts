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
  renderCategoryPage,
} from "./render";
import {
  buildMetaForHome,
  buildMetaForFood,
  injectHead,
} from "./seo/meta-inject";
import { storage } from "./storage";
import { cache } from "./cache";
import type { Food, CategoryGroup } from "@shared/schema";
import { findMainCategoryBySlug, findSubcategoryBySlug, categoryToSlug } from "@shared/utils";

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
 * Development modda tek bir request'i handle et (Vite'ın önünde)
 */
export async function handleSSRRequest(req: Request, res: Response): Promise<void> {
  const templatePath = path.resolve(process.cwd(), "client", "index.html");
  
  try {
    // Get category groups (cache)
    const categoryGroupsCacheKey = "all_categories";
    let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
    if (!categoryGroups) {
      categoryGroups = await storage.getCategoryGroups();
      cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
    }

    // Ana sayfa
    if (req.path === "/") {
      const popularCacheKey = "popular_foods";
      let foods: Food[] | undefined = cache.get<Food[]>(popularCacheKey);
      if (!foods) {
        foods = await storage.getPopularFoods(12);
        cache.set(popularCacheKey, foods, 600000);
      }
      const renderResult = await renderHomePage(foods || [], categoryGroups);
      const meta = buildMetaForHome();
      return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    }

    // Tüm gıdalar
    if (req.path === "/tum-gidalar") {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 30;
      const offset = (page - 1) * limit;
      const allFoods = await storage.getAllFoods();
      const totalPages = Math.ceil(allFoods.length / limit);
      const foods = allFoods.slice(offset, offset + limit);
      const renderResult = await renderAllFoodsPage(foods, categoryGroups, page, totalPages);
      const meta = {
        title: `Tüm Gıdalar - Sayfa ${page} | besindegerim.com`,
        description: `${allFoods.length} gıdanın besin değerlerini keşfedin`,
        keywords: "besin değerleri, kalori, gıdalar",
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/tum-gidalar?page=${page}`,
      };
      return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    }

    // Kategori: /kategori/:categorySlug/:subcategorySlug
    const categoryMatch = req.path.match(/^\/kategori\/([^/]+)\/([^/]+)$/);
    if (categoryMatch) {
      const [, categorySlug, subcategorySlug] = categoryMatch;
      const mainCategory = findMainCategoryBySlug(categorySlug, categoryGroups);
      const subcategory = findSubcategoryBySlug(subcategorySlug, categoryGroups);

      if (!mainCategory || !subcategory) {
        const renderResult = await render404Page(categoryGroups);
        const meta = {
          title: "Kategori Bulunamadı - besindegerim.com",
          description: "Aradığınız kategori bulunamadı.",
          keywords: "besin değerleri",
          canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${req.path}`,
        };
        return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
      }

      const cacheKey = `subcategory_${subcategory}`;
      let foods: Food[] | undefined = cache.get<Food[]>(cacheKey);
      if (!foods) {
        foods = await storage.getFoodsBySubcategory(subcategory);
        cache.set(cacheKey, foods, 3600000);
      }

      const renderResult = await renderCategoryPage(foods, categoryGroups, mainCategory, subcategory);
      const meta = {
        title: `${subcategory} - ${mainCategory} | besindegerim.com`,
        description: `${subcategory} kategorisindeki gıdaların besin değerleri. ${foods.length} gıda bulundu.`,
        keywords: `${subcategory}, ${mainCategory}, besin değerleri, kalori`,
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${req.path}`,
      };
      return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    }

    // Ana kategori: /kategori/:categorySlug
    const mainCategoryMatch = req.path.match(/^\/kategori\/([^/]+)$/);
    if (mainCategoryMatch) {
      const [, categorySlug] = mainCategoryMatch;
      const categoryName = findMainCategoryBySlug(categorySlug, categoryGroups);

      if (!categoryName) {
        const renderResult = await render404Page(categoryGroups);
        const meta = {
          title: "Kategori Bulunamadı - besindegerim.com",
          description: "Aradığınız kategori bulunamadı.",
          keywords: "besin değerleri",
          canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${req.path}`,
        };
        return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
      }

      const cacheKey = `category_${categoryName}`;
      let foods: Food[] | undefined = cache.get<Food[]>(cacheKey);
      if (!foods) {
        foods = await storage.getFoodsByCategory(categoryName);
        cache.set(cacheKey, foods, 3600000);
      }

      const renderResult = await renderCategoryPage(foods, categoryGroups, categoryName);
      const meta = {
        title: `${categoryName} | besindegerim.com`,
        description: `${categoryName} kategorisindeki gıdaların besin değerleri. ${foods.length} gıda bulundu.`,
        keywords: `${categoryName}, besin değerleri, kalori`,
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${req.path}`,
      };
      return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    }

    // Gıda detay: /:slug
    const slug = req.path.slice(1);
    if (slug && !slug.includes(".")) {
      const cacheKey = `food_${slug}`;
      let food: Food | undefined = cache.get<Food>(cacheKey);
      if (!food) {
        food = await storage.getFoodBySlug(slug);
        if (food) {
          cache.set(cacheKey, food, 3600000);
        }
      }

      if (!food) {
        const renderResult = await render404Page(categoryGroups);
        const meta = {
          title: "Gıda Bulunamadı - besindegerim.com",
          description: "Aradığınız gıda bulunamadı.",
          keywords: "besin değerleri",
          canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${req.path}`,
        };
        return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
      }

      const renderResult = await renderFoodDetailPage(food, categoryGroups);
      const meta = buildMetaForFood({
        name: food.name,
        servingLabel: food.servingLabel || `${food.servingSize}g`,
        kcalPerServing: parseFloat(food.calories),
        slug: food.slug,
      });
      return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    }

    // 404
    const renderResult = await render404Page(categoryGroups);
    const meta = {
      title: "Sayfa Bulunamadı - besindegerim.com",
      description: "Aradığınız sayfa bulunamadı.",
      keywords: "besin değerleri",
      canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${req.path}`,
    };
    await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
  } catch (error) {
    console.error("[SSR handleSSRRequest] Error:", error);
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

  // Kategori sayfası: /kategori/:categorySlug/:subcategorySlug
  app.get("/kategori/:categorySlug/:subcategorySlug", async (req: Request, res: Response) => {
    try {
      const { categorySlug, subcategorySlug } = req.params;

      // Get category groups
      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      // Find original category names from slugs
      const mainCategory = findMainCategoryBySlug(categorySlug, categoryGroups);
      const subcategory = findSubcategoryBySlug(subcategorySlug, categoryGroups);

      if (!mainCategory || !subcategory) {
        const renderResult = await render404Page(categoryGroups);
        const meta = {
          title: "Kategori Bulunamadı - besindegerim.com",
          description: "Aradığınız kategori bulunamadı.",
          keywords: "besin değerleri",
          canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${req.path}`,
        };
        return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
      }

      // Get foods by subcategory
      const cacheKey = `subcategory_${subcategory}`;
      let foods: Food[] | undefined = cache.get<Food[]>(cacheKey);
      if (!foods) {
        foods = await storage.getFoodsBySubcategory(subcategory);
        cache.set(cacheKey, foods, 3600000);
      }

      // Render
      const renderResult = await renderCategoryPage(foods, categoryGroups, mainCategory, subcategory);
      const meta = {
        title: `${subcategory} - ${mainCategory} | besindegerim.com`,
        description: `${subcategory} kategorisindeki gıdaların besin değerleri. ${foods.length} gıda bulundu.`,
        keywords: `${subcategory}, ${mainCategory}, besin değerleri, kalori`,
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${req.path}`,
      };

      await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    } catch (error) {
      console.error("[SSR /kategori/:categorySlug/:subcategorySlug] Error:", error);
      res.status(500).send("Server Error");
    }
  });

  // Ana kategori sayfası: /kategori/:categorySlug
  app.get("/kategori/:categorySlug", async (req: Request, res: Response) => {
    try {
      const { categorySlug } = req.params;

      // Get category groups
      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      // Find original category name from slug
      const categoryName = findMainCategoryBySlug(categorySlug, categoryGroups);

      if (!categoryName) {
        const renderResult = await render404Page(categoryGroups);
        const meta = {
          title: "Kategori Bulunamadı - besindegerim.com",
          description: "Aradığınız kategori bulunamadı.",
          keywords: "besin değerleri",
          canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${req.path}`,
        };
        return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
      }

      // Get foods by category
      const cacheKey = `category_${categoryName}`;
      let foods: Food[] | undefined = cache.get<Food[]>(cacheKey);
      if (!foods) {
        foods = await storage.getFoodsByCategory(categoryName);
        cache.set(cacheKey, foods, 3600000);
      }

      // Render
      const renderResult = await renderCategoryPage(foods, categoryGroups, categoryName);
      const meta = {
        title: `${categoryName} | besindegerim.com`,
        description: `${categoryName} kategorisindeki gıdaların besin değerleri. ${foods.length} gıda bulundu.`,
        keywords: `${categoryName}, besin değerleri, kalori`,
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${req.path}`,
      };

      await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    } catch (error) {
      console.error("[SSR /kategori/:categorySlug] Error:", error);
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
        slug === "kategori" ||
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
