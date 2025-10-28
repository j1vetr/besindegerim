import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";

const app = express();

// Serve attached_assets as static files with cache headers
app.use("/attached_assets", express.static(path.join(process.cwd(), "attached_assets"), {
  maxAge: "1y",
  immutable: true,
  setHeaders: (res) => {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
}));

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Import SSR module at top level (prevent esbuild tree-shaking)
import { registerSSRRoutes, handleSSRRequest } from "./ssr";

(async () => {
  // Always register sitemap.xml and robots.txt routes (both dev and prod)
  // These MUST be before API routes to prevent /api/foods/:slug catching them
  app.get("/sitemap.xml", async (_req: Request, res: Response) => {
    try {
      const { storage } = await import("./storage");
      const { categoryToSlug } = await import("@shared/utils");
      const foods = await storage.getAllFoods();
      const categoryGroups = await storage.getCategoryGroups();
      const baseUrl = process.env.BASE_URL || "https://besindegerim.com";
      
      const urls = [
        // Ana sayfa (priority 1.0)
        { loc: baseUrl, priority: "1.0" },
        
        // Hesaplayıcılar hub (priority 0.95)
        { loc: `${baseUrl}/hesaplayicilar`, priority: "0.95" },
        
        // Her bir hesaplayıcı (priority 0.9)
        { loc: `${baseUrl}/hesaplayici/gunluk-kalori-ihtiyaci`, priority: "0.9" },
        { loc: `${baseUrl}/hesaplayici/bmi`, priority: "0.9" },
        { loc: `${baseUrl}/hesaplayici/ideal-kilo`, priority: "0.9" },
        { loc: `${baseUrl}/hesaplayici/gunluk-su-ihtiyaci`, priority: "0.9" },
        { loc: `${baseUrl}/hesaplayici/protein-gereksinimi`, priority: "0.9" },
        { loc: `${baseUrl}/hesaplayici/porsiyon-cevirici`, priority: "0.9" },
        { loc: `${baseUrl}/hesaplayici/kilo-verme-suresi`, priority: "0.9" },
        
        // Tüm gıdalar (priority 0.85)
        { loc: `${baseUrl}/tum-gidalar`, priority: "0.85" },
        
        // Kurumsal sayfalar (priority 0.5)
        { loc: `${baseUrl}/hakkimizda`, priority: "0.5" },
        { loc: `${baseUrl}/iletisim`, priority: "0.5" },
        { loc: `${baseUrl}/gizlilik-politikasi`, priority: "0.3" },
        { loc: `${baseUrl}/kullanim-kosullari`, priority: "0.3" },
        { loc: `${baseUrl}/cerez-politikasi`, priority: "0.3" },
      ];
      
      // Kategori ve alt kategori sayfaları (priority 0.8)
      categoryGroups.forEach((group: any) => {
        const mainCategorySlug = categoryToSlug(group.mainCategory);
        urls.push({
          loc: `${baseUrl}/kategori/${mainCategorySlug}`,
          priority: "0.8"
        });
        
        group.subcategories.forEach((subcategory: string) => {
          const subcategorySlug = categoryToSlug(subcategory);
          urls.push({
            loc: `${baseUrl}/kategori/${mainCategorySlug}/${subcategorySlug}`,
            priority: "0.75"
          });
        });
      });
      
      // Gıda detay sayfaları (priority 0.7)
      foods.forEach((food: any) => {
        urls.push({
          loc: `${baseUrl}/${food.slug}`,
          priority: "0.7"
        });
      });

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url.loc}</loc>
    <priority>${url.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

      res.type("application/xml").send(sitemap);
    } catch (error) {
      console.error("[sitemap.xml] Error:", error);
      res.status(500).send("Server Error");
    }
  });

  app.get("/robots.txt", (_req: Request, res: Response) => {
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${process.env.BASE_URL || "https://besindegerim.com"}/sitemap.xml`;
    res.type("text/plain").send(robotsTxt);
  });

  // Production modda SSR routes'u API routes'tan ÖNCE register et
  if (process.env.NODE_ENV !== "development") {
    // Production Mode: SSR routes FIRST (prevent /api/foods/:slug catching sitemap/robots)
    registerSSRRoutes(app);
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the full error in production
    console.error('[ERROR]', err.stack || err);

    res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "development") {
    // Dev Mode: SSR → Vite
    
    // 1️⃣ ÖNCE: SSR middleware (Bot detection)
    app.use("*", async (req, res, next) => {
      // API ve static dosyaları skip et → Vite'a bırak
      if (
        req.path.startsWith('/api/') || 
        req.path.startsWith('/@') ||
        req.path.startsWith('/src/') ||
        req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/)
      ) {
        return next(); // ⏩ Vite'a geç
      }
      
      // Bot detection (basit user-agent check)
      const userAgent = req.headers['user-agent'] || '';
      const isBot = /bot|crawler|spider|crawling|googlebot|bingbot/i.test(userAgent);
      
      if (isBot) {
        // 🤖 Bot ise SSR render → STOP
        return await handleSSRRequest(req, res);
      }
      
      // 👤 Normal kullanıcı → next() → Vite SPA
      next();
    });
    
    // 2️⃣ SONRA: Vite middleware (Catch-all SPA routing)
    await setupVite(app, server);
  } else {
    // Production Mode: Static file serving
    const distPath = path.resolve(process.cwd(), "dist", "public");
    
    // Serve static assets (CSS, JS, images)
    app.use(express.static(distPath, {
      maxAge: "1y",
      immutable: true,
    }));
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
