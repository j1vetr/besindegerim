// SSR Routes - Server-side rendering with wildcard route
import type { Express, Request, Response } from "express";
import HomePage from "../client/src/pages/HomePage";
import AllFoodsPage from "../client/src/pages/AllFoodsPage";
import { FoodDetailPage } from "../client/src/pages/FoodDetailPage";
import { NotFoundPage } from "../client/src/pages/NotFoundPage";
import { SearchResultsPage } from "../client/src/pages/SearchResultsPage";
import { CategoryPage } from "../client/src/pages/CategoryPage";
import { LegalPage } from "../client/src/pages/LegalPage";
import CalculatorsHubPage from "../client/src/pages/CalculatorsHubPage";
import CalorieCalculatorPage from "../client/src/pages/CalorieCalculatorPage";
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
 * Register SSR routes
 */
export function registerSSRRoutes(app: Express): void {
  // robots.txt - static route
  app.get("/robots.txt", (req: Request, res: Response) => {
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/*

Sitemap: ${process.env.BASE_URL || "https://besindegerim.com"}/sitemap.xml`;

    res.setHeader("Content-Type", "text/plain");
    res.send(robotsTxt);
  });

  // sitemap.xml - dynamic route
  app.get("/sitemap.xml", async (req: Request, res: Response) => {
    try {
      const baseUrl = process.env.BASE_URL || "https://besindegerim.com";
      
      // Get all foods for sitemap
      const cacheKey = "sitemap_foods";
      let allFoods: Food[] | undefined = cache.get<Food[]>(cacheKey);

      if (!allFoods) {
        allFoods = await storage.getAllFoods(1000); // Get up to 1000 foods
        cache.set(cacheKey, allFoods, 3600000); // Cache for 1 hour
      }

      // Get category groups
      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      // Build sitemap XML
      const urls = [
        // Homepage
        `  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
        // Hesaplayıcılar hub
        `  <url>
    <loc>${baseUrl}/hesaplayicilar</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
        // Günlük Kalori Hesaplayıcı
        `  <url>
    <loc>${baseUrl}/hesaplayicilar/gunluk-kalori-ihtiyaci</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
        // All Foods
        `  <url>
    <loc>${baseUrl}/tum-gidalar</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`,
        // Categories
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

  // **WILDCARD ROUTE** - Catches all other paths
  app.get("*", async (req: Request, res: Response) => {
    try {
      const path = req.path;
      const query = req.query;
      
      // Parse URL - count slashes
      const segments = path.split("/").filter(Boolean); // Remove empty strings
      const segmentCount = segments.length;

      // Get category groups (needed by most pages)
      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      // Route to correct renderer based on URL pattern
      
      // ===== LEVEL 0: Root (/) =====
      if (segmentCount === 0) {
        await renderHomePage(res, categoryGroups, path);
        return;
      }

      // ===== LEVEL 1: Single segment =====
      if (segmentCount === 1) {
        const segment = segments[0];

        // /ara?q=query - Search
        if (segment === "ara" && query.q) {
          await renderSearchPage(res, query.q as string, categoryGroups, path);
          return;
        }

        // /tum-gidalar - All Foods
        if (segment === "tum-gidalar") {
          await renderAllFoodsPage(res, categoryGroups, path, query);
          return;
        }

        // /hesaplayicilar - Calculators Hub
        if (segment === "hesaplayicilar") {
          await renderCalculatorsHub(res, categoryGroups, path);
          return;
        }

        // Legal pages
        const legalPages = ["gizlilik-politikasi", "kullanim-kosullari", "kvkk", "cerez-politikasi", "hakkimizda", "iletisim"];
        if (legalPages.includes(segment)) {
          await renderLegalPage(res, segment, categoryGroups, path);
          return;
        }

        // /:slug - Food Detail
        await renderFoodDetailPage(res, segment, categoryGroups, path);
        return;
      }

      // ===== LEVEL 2: Two segments =====
      if (segmentCount === 2) {
        const [segment1, segment2] = segments;

        // /kategori/:categorySlug - Main Category
        if (segment1 === "kategori") {
          await renderCategoryPage(res, segment2, null, categoryGroups, path);
          return;
        }

        // /hesaplayicilar/:calculatorSlug - Specific Calculator
        if (segment1 === "hesaplayicilar") {
          if (segment2 === "gunluk-kalori-ihtiyaci") {
            await renderCalorieCalculator(res, categoryGroups, path);
            return;
          }
          // Future calculators will be added here
        }

        // Not found
        await render404(res, categoryGroups, path);
        return;
      }

      // ===== LEVEL 3: Three segments =====
      if (segmentCount === 3) {
        const [segment1, segment2, segment3] = segments;

        // /kategori/:categorySlug/:subcategorySlug - Subcategory
        if (segment1 === "kategori") {
          await renderCategoryPage(res, segment2, segment3, categoryGroups, path);
          return;
        }

        // Not found
        await render404(res, categoryGroups, path);
        return;
      }

      // Default: 404
      await render404(res, categoryGroups, path);

    } catch (error) {
      console.error("SSR Wildcard Error:", error);
      res.status(500).send("Server Error");
    }
  });
}

// ===== RENDER FUNCTIONS =====

async function renderHomePage(res: Response, categoryGroups: CategoryGroup[], currentPath: string) {
  // Get random foods
  const randomCacheKey = "popular_foods";
  let randomFoods: Food[] | undefined = cache.get<Food[]>(randomCacheKey);
  if (!randomFoods) {
    randomFoods = await storage.getRandomFoods(6);
    cache.set(randomCacheKey, randomFoods, 600000); // 10 min
  }

  const htmlBody = renderComponentToHTML(
    HomePage({
      popularFoods: randomFoods,
      categoryGroups,
      currentPath,
    })
  );

  const meta = buildMetaForHome();
  const jsonLd = [buildOrganizationJsonLd()];
  const fullHTML = injectHead(htmlBody, meta, jsonLd);
  
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(fullHTML);
}

async function renderSearchPage(res: Response, query: string, categoryGroups: CategoryGroup[], currentPath: string) {
  const cacheKey = `search_${query}`;
  let searchResults: Food[] | undefined = cache.get<Food[]>(cacheKey);

  if (!searchResults) {
    searchResults = await storage.searchFoods(query);
    cache.set(cacheKey, searchResults, 600000); // 10 min
  }

  const htmlBody = renderComponentToHTML(
    SearchResultsPage({
      query,
      results: searchResults,
      categoryGroups,
      currentPath,
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
}

async function renderAllFoodsPage(res: Response, categoryGroups: CategoryGroup[], currentPath: string, query: any) {
  const page = parseInt(query.page as string) || 1;
  const limit = 30;
  const offset = (page - 1) * limit;

  const cacheKey = `all_foods_page_${page}`;
  let result: { items: Food[], total: number } | undefined = cache.get(cacheKey);

  if (!result) {
    const allFoods = await storage.getAllFoods(1000);
    const total = allFoods.length;
    const items = allFoods.slice(offset, offset + limit);
    result = { items, total };
    cache.set(cacheKey, result, 600000); // 10 min
  }

  const totalPages = Math.ceil(result.total / limit);

  const htmlBody = renderComponentToHTML(
    AllFoodsPage({
      initialFoods: result.items,
      initialPage: page,
      initialTotalPages: totalPages,
      initialTotal: result.total,
      categoryGroups,
      currentPath,
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
}

async function renderCalculatorsHub(res: Response, categoryGroups: CategoryGroup[], currentPath: string) {
  const htmlBody = renderComponentToHTML(
    CalculatorsHubPage({
      categoryGroups,
      currentPath,
    })
  );

  const meta = {
    title: "Beslenme Hesaplayıcıları - Kalori, BMI, Protein, Makro Hesaplama | besindegerim.com",
    description: "Günlük kalori ihtiyacı, BMI, ideal kilo, protein gereksinimi, su ihtiyacı ve daha fazlasını hesaplayın. Bilimsel formüllerle doğru sonuçlar.",
    keywords: "beslenme hesaplayıcı, kalori hesaplama, bmi hesaplama, protein hesaplama, makro hesaplama, su ihtiyacı",
    canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/hesaplayicilar`,
  };

  const jsonLd = [buildOrganizationJsonLd()];
  const fullHTML = injectHead(htmlBody, meta, jsonLd);
  
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(fullHTML);
}

async function renderCalorieCalculator(res: Response, categoryGroups: CategoryGroup[], currentPath: string) {
  const htmlBody = renderComponentToHTML(
    CalorieCalculatorPage({
      categoryGroups,
      currentPath,
    })
  );

  const meta = {
    title: "Günlük Kalori İhtiyacı Hesaplama - BMR ve TDEE Hesaplayıcı | besindegerim.com",
    description: "BMR ve TDEE hesaplayarak günlük kalori ihtiyacınızı öğrenin. Kilo vermek, almak veya korumak için gereken kalori ve makro besin hesaplama.",
    keywords: "günlük kalori ihtiyacı, bmr hesaplama, tdee hesaplama, makro hesaplama, kalori hesaplama, günlük kalori",
    canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/hesaplayicilar/gunluk-kalori-ihtiyaci`,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Günde kaç kalori almalıyım?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "TDEE hesaplama ile başlayın. Kilo vermek için 300-750 kalori açık, kas kazanmak için 300-500 kalori fazla verin. Kadınlar minimum 1200, erkekler minimum 1500 kalori tüketmelidir."
        }
      },
      {
        "@type": "Question",
        name: "BMR nedir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "BMR (Basal Metabolic Rate), vücudunuzun dinlenme halindeyken yaklaşık 24 saatte yaktığı kalori miktarıdır. Nefes almak, kan pompalaması, hücre üretimi gibi temel yaşam fonksiyonları için gerekli enerjidir."
        }
      },
      {
        "@type": "Question",
        name: "TDEE nasıl hesaplanır?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "TDEE, BMR'inizi aktivite seviyenizle çarparak bulunur. Aktivite çarpanları: Hareketsiz (1.2), Az Aktif (1.375), Orta Aktif (1.55), Çok Aktif (1.725), Aşırı Aktif (1.9)."
        }
      }
    ]
  };

  const jsonLd = [buildOrganizationJsonLd(), faqJsonLd];
  const fullHTML = injectHead(htmlBody, meta, jsonLd);
  
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(fullHTML);
}

async function renderLegalPage(res: Response, slug: string, categoryGroups: CategoryGroup[], currentPath: string) {
  const htmlBody = renderComponentToHTML(
    LegalPage({
      slug,
      categoryGroups,
      currentPath,
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
}

async function renderFoodDetailPage(res: Response, slug: string, categoryGroups: CategoryGroup[], currentPath: string) {
  const cacheKey = `food_${slug}`;
  let food: Food | undefined = cache.get<Food>(cacheKey);

  if (!food) {
    food = await storage.getFoodBySlug(slug);
    if (food) {
      cache.set(cacheKey, food, 3600000); // 1 hour
    }
  }

  if (!food) {
    await render404(res, categoryGroups, currentPath);
    return;
  }

  // Get alternatives
  const altCacheKey = `alternatives_${food.id}`;
  let alternatives: Food[] | undefined = cache.get<Food[]>(altCacheKey);

  if (!alternatives) {
    alternatives = await storage.getRandomFoods(4, food.id);
    cache.set(altCacheKey, alternatives, 600000); // 10 min
  }

  const htmlBody = renderComponentToHTML(
    FoodDetailPage({
      food,
      alternatives,
      categoryGroups,
      currentPath,
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
}

async function renderCategoryPage(
  res: Response,
  categorySlug: string,
  subcategorySlug: string | null,
  categoryGroups: CategoryGroup[],
  currentPath: string
) {
  // Convert slugs to original names
  const category = findCategoryBySlug(categorySlug, categoryGroups);
  const subcategory = subcategorySlug ? findCategoryBySlug(subcategorySlug, categoryGroups) : null;

  if (!category) {
    await render404(res, categoryGroups, currentPath);
    return;
  }

  // If subcategory slug provided but not found, 404
  if (subcategorySlug && !subcategory) {
    await render404(res, categoryGroups, currentPath);
    return;
  }

  // Get foods
  const cacheKey = subcategory ? `subcategory_${subcategory}` : `category_${category}`;
  let foods: Food[] | undefined = cache.get<Food[]>(cacheKey);

  if (!foods) {
    if (subcategory) {
      foods = await storage.getFoodsBySubcategory(subcategory);
    } else {
      foods = await storage.getFoodsByCategory(category);
    }
    cache.set(cacheKey, foods, 3600000); // 1 hour
  }

  // Display name is subcategory if available, otherwise main category
  const displayName = subcategory || category;
  
  const htmlBody = renderComponentToHTML(
    CategoryPage({
      category: displayName,
      foods,
      categoryGroups,
      currentPath,
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
}

async function render404(res: Response, categoryGroups: CategoryGroup[], currentPath: string) {
  const htmlBody = renderComponentToHTML(
    NotFoundPage({
      categoryGroups,
      currentPath,
    })
  );

  const meta = {
    title: "Sayfa Bulunamadı - besindegerim.com",
    description: "Aradığınız sayfa bulunamadı.",
    keywords: "404, sayfa bulunamadı",
    canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${currentPath}`,
  };

  const fullHTML = injectHead(htmlBody, meta);
  res.status(404);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(fullHTML);
}
