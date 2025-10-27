import { hydrateRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import "./index.css";

// Lazy load page components
const HomePage = lazy(() => import("./pages/HomePage"));
const FoodDetailPage = lazy(() => import("./pages/FoodDetailPage").then(m => ({ default: m.FoodDetailPage })));
const CategoryPage = lazy(() => import("./pages/CategoryPage").then(m => ({ default: m.CategoryPage })));
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage").then(m => ({ default: m.SearchResultsPage })));
const LegalPage = lazy(() => import("./pages/LegalPage").then(m => ({ default: m.LegalPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));

// Simple client-side routing to match SSR
function getPageComponent() {
  const path = window.location.pathname;
  const search = window.location.search;
  
  // Parse props from SSR (if available)
  const propsElement = document.getElementById("__PAGE_PROPS__");
  const pageProps = propsElement ? JSON.parse(propsElement.textContent || "{}") : {};
  
  // Route matching (must match server/ssr.ts routes)
  if (path === "/" || path === "") {
    return <HomePage {...pageProps} />;
  }
  
  if (path.startsWith("/ara") || search.includes("q=")) {
    return <SearchResultsPage {...pageProps} />;
  }
  
  if (path.startsWith("/kategori/")) {
    return <CategoryPage {...pageProps} />;
  }
  
  // Legal pages
  if (path === "/gizlilik-politikasi" || path === "/kullanim-kosullari" || 
      path === "/kvkk" || path === "/cerez-politikasi" || 
      path === "/hakkimizda" || path === "/iletisim") {
    return <LegalPage {...pageProps} />;
  }
  
  // Food detail pages (catch-all slug)
  if (path.match(/^\/[a-z0-9-]+$/)) {
    return <FoodDetailPage {...pageProps} />;
  }
  
  return <NotFoundPage {...pageProps} />;
}

// Hydrate the app
const PageComponent = getPageComponent();

hydrateRoot(
  document.getElementById("root")!,
  <Suspense fallback={<div>Yükleniyor...</div>}>
    {PageComponent}
  </Suspense>
);
