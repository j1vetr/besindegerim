import React from "react";
import { Search } from "lucide-react";

interface HeaderProps {
  categories?: string[];
  currentPath?: string;
}

export function Header({ categories = [], currentPath = "/" }: HeaderProps = {}) {
  // Check if a category is active based on current path
  const isCategoryActive = (category: string) => {
    const encodedPath = `/kategori/${encodeURIComponent(category)}`;
    try {
      return currentPath === decodeURIComponent(encodedPath);
    } catch {
      return currentPath === encodedPath;
    }
  };

  const isHomeActive = currentPath === "/" || currentPath.startsWith("/?");

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top bar - Logo & Search */}
        <div className="flex h-20 items-center gap-6">
          {/* Logo - Bigger and more prominent */}
          <a href="/" data-testid="link-home" className="flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="Besin Değerim" 
              className="h-14 w-auto transition-transform hover:scale-105"
              data-testid="img-logo"
            />
          </a>

          {/* Search Bar - Centered & Prominent */}
          <form 
            action="/ara"
            method="GET"
            className="flex flex-1 max-w-2xl items-center"
            data-testid="form-search"
          >
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="q"
                placeholder="Gıda, besin değeri ara..."
                className="h-12 w-full rounded-full border-2 border-muted bg-muted/30 pl-12 pr-6 text-base ring-offset-background placeholder:text-muted-foreground transition-all focus-visible:border-primary focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                data-testid="input-search"
              />
            </div>
          </form>
        </div>

        {/* Categories bar - Clean scrollable pills */}
        <div className="flex h-14 items-center gap-2 overflow-x-auto border-t scrollbar-hide">
          <a 
            href="/" 
            data-testid="link-category-all"
            className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all hover-elevate active-elevate-2 inline-block ${
              isHomeActive
                ? "bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white shadow-md"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            Tümü
          </a>
          {categories.map((category) => (
            <a 
              key={category} 
              href={`/kategori/${encodeURIComponent(category)}`}
              data-testid={`link-category-${category}`}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all hover-elevate active-elevate-2 inline-block ${
                isCategoryActive(category)
                  ? "bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white shadow-md"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
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
