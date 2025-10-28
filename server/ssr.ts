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
  renderAboutPage,
  renderContactPage,
  renderPrivacyPage,
  renderTermsPage,
  renderCookiePage,
  renderCalculatorPage,
  renderCalculatorsHubPage,
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
import { getAboutPageSchema, getContactPageSchema, serializeSchema } from "./seo/schemas";

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
  
  // Wildcard route kullandığımız için path yerine originalUrl kullan
  const requestPath = req.originalUrl.split('?')[0]; // Query string'i kaldır
  console.log("[SSR handleSSRRequest] path:", requestPath);
  
  try {
    // Get category groups (cache)
    const categoryGroupsCacheKey = "all_categories";
    let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
    if (!categoryGroups) {
      categoryGroups = await storage.getCategoryGroups();
      cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
    }

    // Kategori: /kategori/:categorySlug/:subcategorySlug (ÖNCE kontrol et)
    const categoryMatch = requestPath.match(/^\/kategori\/([^/]+)\/([^/]+)$/);
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
          canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${requestPath}`,
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
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${requestPath}`,
      };
      return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    }

    // Ana kategori: /kategori/:categorySlug
    const mainCategoryMatch = requestPath.match(/^\/kategori\/([^/]+)$/);
    if (mainCategoryMatch) {
      const [, categorySlug] = mainCategoryMatch;
      const categoryName = findMainCategoryBySlug(categorySlug, categoryGroups);

      if (!categoryName) {
        const renderResult = await render404Page(categoryGroups);
        const meta = {
          title: "Kategori Bulunamadı - besindegerim.com",
          description: "Aradığınız kategori bulunamadı.",
          keywords: "besin değerleri",
          canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${requestPath}`,
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
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${requestPath}`,
      };
      return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    }

    // Ana sayfa
    if (requestPath === "/") {
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
    if (requestPath === "/tum-gidalar") {
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

    // Gizlilik Politikası
    if (requestPath === "/gizlilik-politikasi") {
      const renderResult = await renderPrivacyPage(categoryGroups);
      const meta = {
        title: "Gizlilik Politikası | besindegerim.com",
        description: "besindegerim.com Gizlilik Politikası. Kişisel verilerinizin korunması, KVKK uyumu ve veri güvenliği hakkında detaylı bilgiler.",
        keywords: "gizlilik politikası, KVKK, kişisel verilerin korunması, veri güvenliği",
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/gizlilik-politikasi`,
      };
      return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    }

    // Kullanım Koşulları
    if (requestPath === "/kullanim-kosullari") {
      const renderResult = await renderTermsPage(categoryGroups);
      const meta = {
        title: "Kullanım Koşulları | besindegerim.com",
        description: "besindegerim.com Kullanım Koşulları. Web sitesi kullanım kuralları, sorumluluklar, fikri mülkiyet hakları ve yasal bilgiler.",
        keywords: "kullanım koşulları, terms of service, yasal bilgiler, fikri mülkiyet",
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/kullanim-kosullari`,
      };
      return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    }

    // Çerez Politikası
    if (requestPath === "/cerez-politikasi") {
      const renderResult = await renderCookiePage(categoryGroups);
      const meta = {
        title: "Çerez Politikası | besindegerim.com",
        description: "besindegerim.com Çerez Politikası. Çerez kullanımı, türleri, amaçları ve yönetimi hakkında detaylı bilgiler.",
        keywords: "çerez politikası, cookie policy, çerez kullanımı, gizlilik",
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/cerez-politikasi`,
      };
      return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    }

    // Hesaplayıcılar Hub
    if (requestPath === "/hesaplayicilar") {
      const renderResult = await renderCalculatorsHubPage(categoryGroups);
      const meta = {
        title: "8 Bilimsel Hesaplayıcı - BMI, Kalori, Protein, Vücut Yağ Yüzdesi | besindegerim.com",
        description: "Ücretsiz 8 hesaplayıcı: günlük kalori (BMR/TDEE), BMI, vücut yağ yüzdesi, ideal kilo, protein gereksinimi, su ihtiyacı, porsiyon çevirici ve kilo verme süresi.",
        keywords: "BMI hesaplama, günlük kalori, protein hesaplama, su ihtiyacı, ideal kilo, porsiyon çevirici",
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/hesaplayicilar`,
      };
      return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    }

    // Tek bir hesaplayıcı: /hesaplayici/:calculatorId
    const calculatorMatch = requestPath.match(/^\/hesaplayici\/([^/]+)$/);
    if (calculatorMatch) {
      const [, calculatorId] = calculatorMatch;
      const validCalculators = [
        "gunluk-kalori-ihtiyaci",
        "bmi",
        "vucut-yag-yuzde",
        "ideal-kilo",
        "gunluk-su-ihtiyaci",
        "protein-gereksinimi",
        "porsiyon-cevirici",
        "kilo-verme-suresi"
      ];
      
      if (!validCalculators.includes(calculatorId)) {
        const renderResult = await render404Page(categoryGroups);
        const meta = {
          title: "Hesaplayıcı Bulunamadı - besindegerim.com",
          description: "Aradığınız hesaplayıcı bulunamadı.",
          keywords: "hesaplayıcılar",
          canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${requestPath}`,
        };
        return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
      }
      
      const renderResult = await renderCalculatorPage(calculatorId, categoryGroups);
      
      // Calculator-specific meta tags
      const calculatorMetas: Record<string, any> = {
        "gunluk-kalori-ihtiyaci": {
          title: "Günlük Kalori İhtiyacı Hesaplama - BMR & TDEE | besindegerim.com",
          description: "BMR ve TDEE hesaplayarak günlük kalori ihtiyacınızı öğrenin. Mifflin-St Jeor formülü ile doğru sonuçlar. Makro besin dağılımınızı hesaplayın.",
          keywords: "günlük kalori, BMR hesaplama, TDEE, kalori ihtiyacı, makro besinler"
        },
        "bmi": {
          title: "BMI Hesaplama - Vücut Kitle İndeksi | besindegerim.com",
          description: "WHO standartlarına göre BMI (Vücut Kitle İndeksi) hesaplayın. Sağlıklı kilo aralığınızı öğrenin. Ücretsiz BMI hesaplayıcı.",
          keywords: "BMI hesaplama, vücut kitle indeksi, ideal kilo, sağlıklı kilo"
        },
        "vucut-yag-yuzde": {
          title: "Vücut Yağ Yüzdesi Hesaplama - Navy Method | besindegerim.com",
          description: "Navy Method ile vücut yağ yüzdesini hesaplayın. Bel, boyun ve kalça ölçümleriyle BMI'dan çok daha doğru sonuç.",
          keywords: "vücut yağ yüzdesi, body fat, Navy Method, yağ oranı hesaplama"
        },
        "ideal-kilo": {
          title: "İdeal Kilo Hesaplama - Devine & Broca Formülü | besindegerim.com",
          description: "Boyunuza ve cinsiyetinize göre ideal kilonuzu hesaplayın. Devine ve Broca formülleri ile bilimsel sonuçlar.",
          keywords: "ideal kilo, ideal kilo hesaplama, sağlıklı kilo, hedef kilo"
        },
        "gunluk-su-ihtiyaci": {
          title: "Günlük Su İhtiyacı Hesaplama | besindegerim.com",
          description: "Kilonuza, aktivite seviyenize ve iklime göre günlük su ihtiyacınızı hesaplayın. Sağlıklı hidrasyon için öneriler.",
          keywords: "günlük su ihtiyacı, su hesaplama, hidrasyon, günde kaç litre su"
        },
        "protein-gereksinimi": {
          title: "Günlük Protein Gereksinimi Hesaplama | besindegerim.com",
          description: "Hedefinize ve aktivite seviyenize göre günlük protein ihtiyacınızı hesaplayın. Kas yapma, kilo verme için protein önerileri.",
          keywords: "protein hesaplama, günlük protein, protein ihtiyacı, kas yapma proteini"
        },
        "porsiyon-cevirici": {
          title: "Porsiyon Çevirici - Gram, Kaşık, Bardak Dönüştürme | besindegerim.com",
          description: "Gramajı porsiyona, porsiyonu kaşık ve bardağa çevirin. Kolay porsiyon hesaplama aracı.",
          keywords: "porsiyon çevirici, gram porsiyon, kaşık bardak dönüşümü"
        },
        "kilo-verme-suresi": {
          title: "Kilo Verme/Alma Süresi Hesaplama | besindegerim.com",
          description: "Hedef kilonuza ulaşmak için gereken süreyi hesaplayın. Sağlıklı kilo verme planı oluşturun.",
          keywords: "kilo verme süresi, kilo alma süresi, hedef kilo, zayıflama planı"
        }
      };
      
      const meta = calculatorMetas[calculatorId] || {
        title: "Hesaplayıcı | besindegerim.com",
        description: "Hesaplayıcı",
        keywords: "hesaplayıcı"
      };
      meta.canonical = `${process.env.BASE_URL || "https://besindegerim.com"}${requestPath}`;
      
      return await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    }

    // Gıda detay: /:slug
    const slug = requestPath.slice(1);
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
          canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${requestPath}`,
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
      canonical: `${process.env.BASE_URL || "https://besindegerim.com"}${requestPath}`,
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

  // Hesaplayıcılar Hub: /hesaplayicilar
  app.get("/hesaplayicilar", async (req: Request, res: Response) => {
    try {
      // Get category groups
      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      // Render
      const { renderCalculatorsHubPage } = await import("./render");
      const renderResult = await renderCalculatorsHubPage(categoryGroups);
      const meta = {
        title: "Beslenme Hesaplayıcıları - 7 Ücretsiz Araç | besindegerim.com",
        description: "Günlük kalori, BMI, protein gereksinimi, su ihtiyacı ve daha fazlası. Bilimsel formüllerle desteklenen ücretsiz hesaplayıcılar.",
        keywords: "kalori hesaplama, BMI, protein hesaplama, su ihtiyacı, beslenme hesaplayıcı",
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/hesaplayicilar`,
      };

      await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    } catch (error) {
      console.error("[SSR /hesaplayicilar] Error:", error);
      res.status(500).send("Server Error");
    }
  });

  // Hesaplayıcı detay: /hesaplayicilar/:calculatorId
  app.get("/hesaplayicilar/:calculatorId", async (req: Request, res: Response) => {
    try {
      const { calculatorId } = req.params;

      // Get category groups
      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      // Render
      const { renderCalculatorPage } = await import("./render");
      const renderResult = await renderCalculatorPage(calculatorId, categoryGroups);
      
      const calculatorTitles: Record<string, string> = {
        "gunluk-kalori-ihtiyaci": "Günlük Kalori ve Makro Hesaplayıcı",
        "bmi": "Vücut Kitle İndeksi (BMI) Hesaplama",
        "ideal-kilo": "İdeal Kilo Hesaplayıcı",
        "gunluk-su-ihtiyaci": "Günlük Su İhtiyacı Hesaplama",
        "protein-gereksinimi": "Günlük Protein Gereksinimi",
        "porsiyon-cevirici": "Porsiyon Çevirici",
        "kilo-verme-suresi": "Kilo Verme/Alma Süresi Hesaplama",
        "vucut-yag-yuzde": "Vücut Yağ Yüzdesi Hesaplayıcı",
        "bmr": "Bazal Metabolizma Hızı (BMR) Hesaplayıcı",
        "makro-hesaplayici": "Makro Dağılımı Hesaplayıcı",
        "ogun-plani": "Öğün Planlayıcı",
        "vitamin-mineral": "Vitamin ve Mineral İhtiyacı Hesaplayıcı",
        "1rm": "1RM (One Rep Max) Hesaplayıcı",
        "kalori-yakma": "Kalori Yakım Hesaplayıcı",
        "vucut-olcumleri": "Vücut Ölçümleri ve WHR Hesaplayıcı",
        "gida-karsilastirma": "Gıda Karşılaştırma"
      };

      const meta = {
        title: `${calculatorTitles[calculatorId] || "Hesaplayıcı"} | besindegerim.com`,
        description: `${calculatorTitles[calculatorId] || "Hesaplayıcı"} - Bilimsel formüllerle desteklenen ücretsiz araç.`,
        keywords: `${calculatorId}, hesaplama, beslenme, kalori`,
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/hesaplayicilar/${calculatorId}`,
      };

      await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    } catch (error) {
      console.error("[SSR /hesaplayicilar/:calculatorId] Error:", error);
      res.status(500).send("Server Error");
    }
  });

  // Hakkımızda (About) Page: /hakkimizda
  app.get("/hakkimizda", async (req: Request, res: Response) => {
    try {
      // Get category groups
      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      // Render
      const renderResult = await renderAboutPage(categoryGroups);
      const schema = getAboutPageSchema();
      const meta = {
        title: "Hakkımızda - Türkiye'nin En Kapsamlı Besin Değerleri Platformu | besindegerim.com",
        description: "besindegerim.com, 266+ gıdanın gerçek porsiyon bazlı besin değerleri ve 16 hesaplayıcı ile Türkiye'nin en güvenilir beslenme platformudur. Misyonumuz, değerlerimiz ve hikayemizi keşfedin.",
        keywords: "hakkımızda, besin değerleri platformu, beslenme, kalori hesaplama, misyon, değerler, USDA verileri",
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/hakkimizda`,
        jsonLd: serializeSchema(schema),
      };

      await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    } catch (error) {
      console.error("[SSR /hakkimizda] Error:", error);
      res.status(500).send("Server Error");
    }
  });

  // İletişim (Contact) Page: /iletisim
  app.get("/iletisim", async (req: Request, res: Response) => {
    try {
      // Get category groups
      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      // Render
      const renderResult = await renderContactPage(categoryGroups);
      const schema = getContactPageSchema();
      const meta = {
        title: "İletişim - Bize Ulaşın | besindegerim.com",
        description: "besindegerim.com ile iletişime geçin. Sorularınız, önerileriniz ve işbirliği teklifleri için info@besindegerim.com adresinden bize ulaşabilirsiniz.",
        keywords: "iletişim, destek, geri bildirim, email, besindegerim iletişim, müşteri hizmetleri",
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/iletisim`,
        jsonLd: serializeSchema(schema),
      };

      await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    } catch (error) {
      console.error("[SSR /iletisim] Error:", error);
      res.status(500).send("Server Error");
    }
  });

  // Gizlilik Politikası: /gizlilik-politikasi
  app.get("/gizlilik-politikasi", async (req: Request, res: Response) => {
    try {
      // Get category groups
      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      // Render
      const renderResult = await renderPrivacyPage(categoryGroups);
      const meta = {
        title: "Gizlilik Politikası | besindegerim.com",
        description: "besindegerim.com Gizlilik Politikası. Kişisel verilerinizin korunması, KVKK uyumu ve veri güvenliği hakkında detaylı bilgiler.",
        keywords: "gizlilik politikası, KVKK, kişisel verilerin korunması, veri güvenliği",
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/gizlilik-politikasi`,
      };

      await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    } catch (error) {
      console.error("[SSR /gizlilik-politikasi] Error:", error);
      res.status(500).send("Server Error");
    }
  });

  // Kullanım Koşulları: /kullanim-kosullari
  app.get("/kullanim-kosullari", async (req: Request, res: Response) => {
    try {
      // Get category groups
      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      // Render
      const renderResult = await renderTermsPage(categoryGroups);
      const meta = {
        title: "Kullanım Koşulları | besindegerim.com",
        description: "besindegerim.com Kullanım Koşulları. Web sitesi kullanım kuralları, sorumluluklar, fikri mülkiyet hakları ve yasal bilgiler.",
        keywords: "kullanım koşulları, terms of service, yasal bilgiler, fikri mülkiyet",
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/kullanim-kosullari`,
      };

      await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    } catch (error) {
      console.error("[SSR /kullanim-kosullari] Error:", error);
      res.status(500).send("Server Error");
    }
  });

  // Çerez Politikası: /cerez-politikasi
  app.get("/cerez-politikasi", async (req: Request, res: Response) => {
    try {
      // Get category groups
      const categoryGroupsCacheKey = "all_categories";
      let categoryGroups: CategoryGroup[] | undefined = cache.get<CategoryGroup[]>(categoryGroupsCacheKey);
      if (!categoryGroups) {
        categoryGroups = await storage.getCategoryGroups();
        cache.set(categoryGroupsCacheKey, categoryGroups, 3600000);
      }

      // Render
      const renderResult = await renderCookiePage(categoryGroups);
      const meta = {
        title: "Çerez Politikası | besindegerim.com",
        description: "besindegerim.com Çerez Politikası. Çerez kullanımı, türleri, amaçları ve yönetimi hakkında detaylı bilgiler.",
        keywords: "çerez politikası, cookie policy, çerez kullanımı, gizlilik",
        canonical: `${process.env.BASE_URL || "https://besindegerim.com"}/cerez-politikasi`,
      };

      await renderHTMLWithMeta(req, res, templatePath, renderResult, meta);
    } catch (error) {
      console.error("[SSR /cerez-politikasi] Error:", error);
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
