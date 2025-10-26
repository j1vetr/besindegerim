import React from "react";
import { Search, ChevronDown } from "lucide-react";
import { SearchAutocomplete } from "./SearchAutocomplete";
import { ClientOnly } from "./ClientOnly";

interface CategoryGroup {
  mainCategory: string;
  subcategories: string[];
}

interface HeaderProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

export function Header({ categoryGroups = [], currentPath = "/" }: HeaderProps) {
  const isHomeActive = currentPath === "/" || currentPath.startsWith("/?");

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 border-b-2 border-green-200/50 shadow-lg shadow-green-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top bar - Logo & Search */}
        <div className="flex items-center gap-4 mb-3">
          {/* Logo */}
          <a href="/" data-testid="link-home" className="flex-shrink-0 hover:scale-105 transition-transform">
            <img 
              src="/logo.png" 
              alt="Besin Değerim" 
              className="h-24 w-auto"
              data-testid="img-header-logo"
            />
          </a>

          {/* Search Bar with Autocomplete (Progressive Enhancement) */}
          <div className="flex-1">
            <ClientOnly fallback={
              <form action="/ara" method="GET" data-testid="form-search">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Gıda ara... (ör: domates, tavuk, elma)"
                    className="h-11 w-full rounded-2xl border-2 border-green-200/50 bg-white pl-12 pr-6 text-sm text-slate-900 placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-green-500"
                    data-testid="input-search"
                  />
                </div>
              </form>
            }>
              <SearchAutocomplete 
                placeholder="Gıda ara... (ör: domates, tavuk, elma)"
                compact={true}
              />
            </ClientOnly>
          </div>
        </div>

        {/* Categories - Horizontal Scroll with Dropdowns */}
        <div className="relative -mx-4 px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            <a 
              href="/" 
              data-testid="link-category-all"
              className={`flex-shrink-0 snap-start whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                isHomeActive
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                  : "bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-200/50"
              }`}
            >
              Tümü
            </a>
            
            {categoryGroups.map((group) => (
              <div key={group.mainCategory} className="relative group flex-shrink-0 snap-start">
                {/* Main Category Button */}
                <button 
                  className="whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-200/50 flex items-center gap-1"
                  data-testid={`button-category-${group.mainCategory}`}
                >
                  {group.mainCategory}
                  <ChevronDown className="w-3 h-3" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50 min-w-[200px] bg-white rounded-2xl shadow-xl border-2 border-green-200/50 overflow-hidden">
                  {group.subcategories.map((subcategory) => (
                    <a
                      key={subcategory}
                      href={`/kategori/${encodeURIComponent(subcategory)}`}
                      className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                      data-testid={`link-subcategory-${subcategory}`}
                    >
                      {subcategory}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </header>
  );
}
