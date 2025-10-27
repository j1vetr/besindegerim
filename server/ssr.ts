// SSR Routes - Server-side rendering for specific pages only
import type { Express, Request, Response } from "express";
import HomePage from "../client/src/pages/HomePage";
import AllFoodsPage from "../client/src/pages/AllFoodsPage";
import { FoodDetailPage } from "../client/src/pages/FoodDetailPage";
import { NotFoundPage } from "../client/src/pages/NotFoundPage";
import { SearchResultsPage } from "../client/src/pages/SearchResultsPage";
import { CategoryPage } from "../client/src/pages/CategoryPage";
import { LegalPage } from "../client/src/pages/LegalPage";
import { renderComponentToHTML } from "./render";
import {
  buildMetaForHome,
  buildMetaForFood,
  buildFoodJsonLd,
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildFAQJsonLd,
  buildArticleJsonLd,
  injectHead,
} from "./seo/meta-inject";
import { storage } from "./storage";
import { cache } from "./cache";
import type { Food, CategoryGroup } from "@shared/schema";
import { categoryToSlug } from "@shared/utils";

// Find original category name from slug
function findCategoryBySlug(slug: string, categoryGroups: CategoryGroup[]): string | null {
  for (const group of categoryGroups) {
    // Check main category
    if (categoryToSlug(group.mainCategory) === slug) {
      return group.mainCategory;
    }
    // Check subcategories
    for (const sub of group.subcategories) {
      if (categoryToSlug(sub) === slug) {
        return sub;
      }
    }
  }
  return null;
}

/**
 * Register SSR routes - ONLY for specific SEO-critical pages
 * Interactive pages (calculators, etc.) use client-side rendering
 */
export function registerSSRRoutes(app: Express): void {
  // robots.txt
  app.get("/robots.txt", (req: Request, res: Response) => {
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/*

Sitemap: ${process.env.BASE_URL || "https://besindegerim.com"}/sitemap.xml`;

    res.setHeader("Content-Type", "text/plain");
    res.send(robotsTxt);
  });

  // sitemap.xml
  app.get("/sitemap.xml", async (req: Request, res: Response) => {
    try {
      const baseUrl = process.env.BASE_URL || "https://besindegerim.com";
      
      const cacheKey = "sitemap_foods";
      let allFoods: Food[] | undefined = cache.get<Food[]>(cacheKey);

      if (!allFoods) {
        allFoods = await storage.getAllFoods(1000);
        cache.set(cacheKey, allFoods, 3600000);
      }

      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      const urls = [
        `  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
        `  <url>
    <loc>${baseUrl}/hesaplayicilar</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
        `  <url>
    <loc>${baseUrl}/tum-gidalar</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`,
        ...categoryGroups.flatMap(group => [
          `  <url>
    <loc>${baseUrl}/kategori/${categoryToSlug(group.mainCategory)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
          ...group.subcategories.map(sub => `  <url>
    <loc>${baseUrl}/kategori/${categoryToSlug(group.mainCategory)}/${categoryToSlug(sub)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
        ]),
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

  // Homepage
  app.get("/", async (req: Request, res: Response) => {
    try {
      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      const randomCacheKey = "popular_foods";
      let randomFoods: Food[] | undefined = cache.get<Food[]>(randomCacheKey);
      if (!randomFoods) {
        randomFoods = await storage.getRandomFoods(6);
        cache.set(randomCacheKey, randomFoods, 600000);
      }

      const htmlBody = renderComponentToHTML(
        HomePage({
          popularFoods: randomFoods,
          categoryGroups,
          currentPath: "/",
        })
      );

      const meta = buildMetaForHome();
      const jsonLd = [buildOrganizationJsonLd()];
      const fullHTML = injectHead(htmlBody, meta, jsonLd);
      
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(fullHTML);
    } catch (error) {
      console.error("SSR Error (homepage):", error);
      res.status(500).send("Server Error");
    }
  });

  // Search results
  app.get("/ara", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      
      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      if (!query) {
        const htmlBody = renderComponentToHTML(
          SearchResultsPage({
            query: "",
            results: [],
            categoryGroups,
            currentPath: "/ara",
          })
        );

        const meta = {
          title: "Gıda Ara - besindegerim.com",
          description: "Gıda arayın ve besin değerlerini öğrenin.",
          keywords: "gıda ara, besin değerleri",
          canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/ara`,
        };

        const fullHTML = injectHead(htmlBody, meta);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.send(fullHTML);
        return;
      }

      const cacheKey = `search_${query}`;
      let searchResults: Food[] | undefined = cache.get<Food[]>(cacheKey);

      if (!searchResults) {
        searchResults = await storage.searchFoods(query);
        cache.set(cacheKey, searchResults, 600000);
      }

      const htmlBody = renderComponentToHTML(
        SearchResultsPage({
          query,
          results: searchResults,
          categoryGroups,
          currentPath: "/ara",
        })
      );

      const meta = {
        title: `"${query}" Arama Sonuçları - besindegerim.com`,
        description: `${query} için ${searchResults.length} sonuç bulundu. Besin değerleri ve kalori bilgileri.`,
        keywords: `${query}, besin değerleri, kalori`,
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/ara?q=${encodeURIComponent(query)}`,
      };

      const fullHTML = injectHead(htmlBody, meta);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(fullHTML);
    } catch (error) {
      console.error("SSR Error (search):", error);
      res.status(500).send("Server Error");
    }
  });

  // All foods
  app.get("/tum-gidalar", async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 30;
      const offset = (page - 1) * limit;

      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      const cacheKey = `all_foods_page_${page}`;
      let result: { items: Food[], total: number } | undefined = cache.get(cacheKey);

      if (!result) {
        const allFoods = await storage.getAllFoods(1000);
        const total = allFoods.length;
        const items = allFoods.slice(offset, offset + limit);
        result = { items, total };
        cache.set(cacheKey, result, 600000);
      }

      const totalPages = Math.ceil(result.total / limit);

      const htmlBody = renderComponentToHTML(
        AllFoodsPage({
          initialFoods: result.items,
          initialPage: page,
          initialTotalPages: totalPages,
          initialTotal: result.total,
          categoryGroups,
          currentPath: "/tum-gidalar",
        })
      );

      const meta = {
        title: `Tüm Gıdalar (Sayfa ${page}) - besindegerim.com`,
        description: `Besin değerleri veritabanındaki tüm gıdalar. ${result.total} gıda arasında arayın.`,
        keywords: "tüm gıdalar, besin değerleri listesi, kalori tablosu",
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/tum-gidalar${page > 1 ? `?page=${page}` : ""}`,
      };

      const fullHTML = injectHead(htmlBody, meta);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(fullHTML);
    } catch (error) {
      console.error("SSR Error (all foods):", error);
      res.status(500).send("Server Error");
    }
  });

  // Category pages
  app.get("/kategori/:categorySlug/:subcategorySlug?", async (req: Request, res: Response) => {
    try {
      const { categorySlug, subcategorySlug } = req.params;

      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      const category = findCategoryBySlug(categorySlug, categoryGroups);
      const subcategory = subcategorySlug ? findCategoryBySlug(subcategorySlug, categoryGroups) : null;

      if (!category || (subcategorySlug && !subcategory)) {
        const htmlBody = renderComponentToHTML(NotFoundPage({ categoryGroups, currentPath: req.path }));
        const meta = {
          title: "Kategori Bulunamadı - besindegerim.com",
          description: "Bu kategori bulunamadı.",
          keywords: "kategori, besin değerleri",
          canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${req.path}`,
        };
        const fullHTML = injectHead(htmlBody, meta);
        res.status(404);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.send(fullHTML);
        return;
      }

      const cacheKey = subcategory ? `subcategory_${subcategory}` : `category_${category}`;
      let foods: Food[] | undefined = cache.get<Food[]>(cacheKey);

      if (!foods) {
        if (subcategory) {
          foods = await storage.getFoodsBySubcategory(subcategory);
        } else {
          foods = await storage.getFoodsByCategory(category);
        }
        cache.set(cacheKey, foods, 3600000);
      }

      const displayName = subcategory || category;

      const htmlBody = renderComponentToHTML(
        CategoryPage({
          category: displayName,
          foods,
          categoryGroups,
          currentPath: req.path,
        })
      );

      const meta = {
        title: `${displayName} Besin Değerleri - ${foods.length} Gıda | besindegerim.com`,
        description: `${displayName} kategorisindeki gıdaların besin değerleri, kalori, protein, karbonhidrat ve yağ bilgileri. ${foods.length} farklı gıda.`,
        keywords: `${displayName}, besin değerleri, kalori, ${displayName} gıdaları`,
        canonical: subcategory
          ? `${process.env.BASE_URL || "https://besindegerim.com"}/kategori/${categorySlug}/${subcategorySlug}`
          : `${process.env.BASE_URL || "https://besindegerim.com"}/kategori/${categorySlug}`,
      };

      const fullHTML = injectHead(htmlBody, meta);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(fullHTML);
    } catch (error) {
      console.error("SSR Error (category):", error);
      res.status(500).send("Server Error");
    }
  });

  // Legal pages
  const legalPages = ["gizlilik-politikasi", "kullanim-kosullari", "kvkk", "cerez-politikasi", "hakkimizda", "iletisim"];
  
  legalPages.forEach((slug) => {
    app.get(`/${slug}`, async (req: Request, res: Response) => {
      try {
        const categoryGroupsCacheKey = "all_categories";
        let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
        if (!categoryGroups) {
          categoryGroups = await storage.getCategoryGroups();
          cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
        }

        const htmlBody = renderComponentToHTML(
          LegalPage({
            slug,
            categoryGroups,
            currentPath: `/${slug}`,
          })
        );

        const titles: Record<string, string> = {
          "gizlilik-politikasi": "Gizlilik Politikası",
          "kullanim-kosullari": "Kullanım Koşulları",
          "kvkk": "KVKK Aydınlatma Metni",
          "cerez-politikasi": "Çerez Politikası",
          "hakkimizda": "Hakkımızda",
          "iletisim": "İletişim",
        };

        const meta = {
          title: `${titles[slug]} - besindegerim.com`,
          description: `besindegerim.com ${titles[slug]} sayfası`,
          keywords: `${titles[slug]}, besin değerleri`,
          canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/${slug}`,
        };

        const fullHTML = injectHead(htmlBody, meta);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.send(fullHTML);
      } catch (error) {
        console.error(`SSR Error (${slug}):`, error);
        res.status(500).send("Server Error");
      }
    });
  });

  // Food detail - MUST be last SSR route (catch-all for /:slug)
  app.get("/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      const cacheKey = `food_${slug}`;
      let food: Food | undefined = cache.get<Food>(cacheKey);

      if (!food) {
        food = await storage.getFoodBySlug(slug);
        if (food) {
          cache.set(cacheKey, food, 3600000);
        }
      }

      if (!food) {
        const htmlBody = renderComponentToHTML(NotFoundPage({ categoryGroups, currentPath: req.path }));
        const meta = {
          title: "Gıda Bulunamadı - besindegerim.com",
          description: "Aradığınız gıda bulunamadı.",
          keywords: "404, gıda bulunamadı",
          canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${req.path}`,
        };
        const fullHTML = injectHead(htmlBody, meta);
        res.status(404);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.send(fullHTML);
        return;
      }

      const altCacheKey = `alternatives_${food.id}`;
      let alternatives: Food[] | undefined = cache.get<Food[]>(altCacheKey);

      if (!alternatives) {
        alternatives = await storage.getRandomFoods(4, food.id);
        cache.set(altCacheKey, alternatives, 600000);
      }

      const htmlBody = renderComponentToHTML(
        FoodDetailPage({
          food,
          alternatives,
          categoryGroups,
          currentPath: req.path,
        })
      );

      const meta = buildMetaForFood({
        name: food.name,
        servingLabel: food.servingLabel,
        kcalPerServing: parseFloat(food.calories),
        slug: food.slug,
      });
      
      const jsonLd = [
        buildFoodJsonLd({
          name: food.name,
          slug: food.slug,
          servingLabel: food.servingLabel,
          servingSize: parseFloat(food.servingSize),
          calories: parseFloat(food.calories),
          protein: food.protein ? parseFloat(food.protein) : undefined,
          carbs: food.carbs ? parseFloat(food.carbs) : undefined,
          fat: food.fat ? parseFloat(food.fat) : undefined,
          fiber: food.fiber ? parseFloat(food.fiber) : undefined,
          sugar: food.sugar ? parseFloat(food.sugar) : undefined,
        }),
        buildBreadcrumbJsonLd(food.name, food.slug),
        buildOrganizationJsonLd(),
        buildFAQJsonLd({
          name: food.name,
          servingLabel: food.servingLabel,
          calories: parseFloat(food.calories),
          protein: food.protein ? parseFloat(food.protein) : undefined,
          carbs: food.carbs ? parseFloat(food.carbs) : undefined,
          fat: food.fat ? parseFloat(food.fat) : undefined,
          fiber: food.fiber ? parseFloat(food.fiber) : undefined,
        }),
        buildArticleJsonLd({
          name: food.name,
          slug: food.slug,
          calories: parseFloat(food.calories),
          servingLabel: food.servingLabel,
        }),
      ];

      const fullHTML = injectHead(htmlBody, meta, jsonLd);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(fullHTML);
    } catch (error) {
      console.error("SSR Error (food detail):", error);
      res.status(500).send("Server Error");
    }
  });
}
