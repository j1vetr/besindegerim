import React from "react";
import { SearchAutocomplete } from "./SearchAutocomplete";

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
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 border-b-2 border-green-200/50 shadow-lg shadow-green-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top bar - Logo & Categories */}
        <div className="flex items-center gap-6 mb-4">
          {/* Logo - Restored! */}
          <a href="/" data-testid="link-home" className="flex-shrink-0 hover:scale-105 transition-transform">
            <img 
              src="/logo.png" 
              alt="Besin Değerim" 
              className="h-16 w-auto"
              data-testid="img-logo"
            />
          </a>

          {/* Categories - Green Pills */}
          <div className="flex flex-1 items-center gap-2 flex-wrap min-w-0">
            <a 
              href="/" 
              data-testid="link-category-all"
              className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                isHomeActive
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                  : "bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-200/50"
              }`}
            >
              Tümü
            </a>
            {categories.map((category) => (
              <a 
                key={category} 
                href={`/kategori/${encodeURIComponent(category)}`}
                data-testid={`link-category-${category}`}
                className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  isCategoryActive(category)
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                    : "bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-200/50"
                }`}
              >
                {category}
              </a>
            ))}
          </div>
        </div>

        {/* Search Bar with Autocomplete */}
        <SearchAutocomplete 
          placeholder="Hangi gıdanın besin değerlerini öğrenmek istersiniz?"
          compact={true}
        />
      </div>
    </header>
  );
}
