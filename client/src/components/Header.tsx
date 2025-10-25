import React from "react";
import { Search } from "lucide-react";

interface HeaderProps {
  categories?: string[];
  currentPath?: string;
}

export function Header({ categories = [], currentPath = "/" }: HeaderProps = {}) {
  // Check if a category is active based on current path
  // Note: Express's req.path is already decoded, so we need to decode our comparison too
  const isCategoryActive = (category: string) => {
    const encodedPath = `/kategori/${encodeURIComponent(category)}`;
    try {
      return currentPath === decodeURIComponent(encodedPath);
    } catch {
      // Fallback if decoding fails
      return currentPath === encodedPath;
    }
  };

  const isHomeActive = currentPath === "/" || currentPath.startsWith("/?");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" data-testid="link-home">
            <div className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-lg px-3 py-2 transition-all">
              <img 
                src="/logo.png" 
                alt="Besin Değerim Logo" 
                className="h-10 w-auto"
                data-testid="img-logo"
              />
              <span className="hidden text-xl font-bold text-foreground sm:inline">
                Besin Değerim
              </span>
            </div>
          </a>

          {/* Search - Using form action for SSR compatibility */}
          <form 
            action="/ara"
            method="GET"
            className="flex flex-1 max-w-md items-center gap-2"
            data-testid="form-search"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="q"
                placeholder="Gıda ara..."
                className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                data-testid="input-search"
              />
            </div>
          </form>
        </div>

        {/* Categories bar */}
        <div className="flex h-12 items-center gap-2 overflow-x-auto border-t pb-1 pt-1 scrollbar-hide">
          <a 
            href="/" 
            data-testid="link-category-all"
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all hover-elevate active-elevate-2 inline-block ${
              isHomeActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Tümü
          </a>
          {categories.map((category) => (
            <a 
              key={category} 
              href={`/kategori/${encodeURIComponent(category)}`}
              data-testid={`link-category-${category}`}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all hover-elevate active-elevate-2 inline-block ${
                isCategoryActive(category)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {category}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
