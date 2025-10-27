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

(async () => {
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
        const { handleSSRRequest } = await import("./ssr");
        return await handleSSRRequest(req, res);
      }
      
      // 👤 Normal kullanıcı → next() → Vite SPA
      next();
    });
    
    // 2️⃣ SONRA: Vite middleware (Catch-all SPA routing)
    await setupVite(app, server);
  } else {
    // Production Mode: SSR → Static
    const { registerSSRRoutes } = await import("./ssr");
    const distPath = path.resolve(process.cwd(), "dist", "public");
    
    // 1️⃣ ÖNCE: SSR routes (sitemap.xml, robots.txt, dynamic pages)
    registerSSRRoutes(app);
    
    // 2️⃣ SONRA: Serve static assets (CSS, JS, images) - catch-all için
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
