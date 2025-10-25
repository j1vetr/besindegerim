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
    <header className="sticky top-0 z-50 w-full border-b-2 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        {/* Top bar - Logo & Categories on same line */}
        <div className="flex items-center gap-6 pb-3">
          {/* Logo - Much bigger */}
          <a href="/" data-testid="link-home" className="flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="Besin Değerim" 
              className="h-20 w-auto transition-transform hover:scale-105"
              data-testid="img-logo"
            />
          </a>

          {/* Categories - Horizontal scrollable pills next to logo */}
          <div className="flex flex-1 flex-wrap items-center gap-2 overflow-x-auto scrollbar-hide min-w-0">
            <a 
              href="/" 
              data-testid="link-category-all"
              className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-bold transition-all hover-elevate active-elevate-2 inline-block ${
                isHomeActive
                  ? "bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white shadow-lg"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              Tümü
            </a>
            {categories.map((category) => (
              <a 
                key={category} 
                href={`/kategori/${encodeURIComponent(category)}`}
                data-testid={`link-category-${category}`}
                className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-bold transition-all hover-elevate active-elevate-2 inline-block ${
                  isCategoryActive(category)
                    ? "bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white shadow-lg"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                }`}
              >
                {category}
              </a>
            ))}
          </div>
        </div>

        {/* Search Bar - Full width below */}
        <form 
          action="/ara"
          method="GET"
          className="pb-1"
          data-testid="form-search"
        >
          <div className="relative">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              name="q"
              placeholder="Hangi gıdanın besin değerlerini öğrenmek istersiniz?"
              className="h-14 w-full rounded-full border-2 border-muted bg-gradient-to-r from-muted/20 to-muted/40 pl-14 pr-6 text-base font-medium ring-offset-background placeholder:text-muted-foreground transition-all focus-visible:border-primary focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              data-testid="input-search"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
