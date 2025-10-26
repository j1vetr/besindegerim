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
    <header className="sticky top-0 z-50 w-full bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top bar - Logo & Categories */}
        <div className="flex items-center gap-6 mb-4">
          {/* Logo */}
          <a href="/" data-testid="link-home" className="flex-shrink-0">
            <span className="text-2xl font-bold text-white">
              Besin<span className="text-[#1f8a4d]">Değerim</span>
            </span>
          </a>

          {/* Categories - Horizontal pills */}
          <div className="flex flex-1 items-center gap-2 overflow-x-auto scrollbar-hide min-w-0">
            <a 
              href="/" 
              data-testid="link-category-all"
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isHomeActive
                  ? "bg-[#1f8a4d] text-white"
                  : "bg-white/5 text-white/80 hover:bg-white/10 border border-white/10"
              }`}
            >
              Tümü
            </a>
            {categories.map((category) => (
              <a 
                key={category} 
                href={`/kategori/${encodeURIComponent(category)}`}
                data-testid={`link-category-${category}`}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isCategoryActive(category)
                    ? "bg-[#1f8a4d] text-white"
                    : "bg-white/5 text-white/80 hover:bg-white/10 border border-white/10"
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
          data-testid="form-search"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              name="q"
              placeholder="Hangi gıdanın besin değerlerini öğrenmek istersiniz?"
              className="h-12 w-full rounded-md border border-white/20 bg-black/50 pl-12 pr-6 text-base text-white placeholder:text-white/50 outline-none transition-colors focus:border-[#1f8a4d]"
              data-testid="input-search"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
