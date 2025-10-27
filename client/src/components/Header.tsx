import React, { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";
import { categoryToSlug } from "@shared/utils";
import { SearchAutocomplete } from "./SearchAutocomplete";
import { ClientOnly } from "./ClientOnly";

interface HeaderProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

// Mobile menu component - Simple, SSR-safe
function MobileMenu({ categoryGroups, currentPath }: { categoryGroups: CategoryGroup[], currentPath: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const isHomeActive = currentPath === "/" || currentPath.startsWith("/?");

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={handleClick}
        className="p-2 hover:bg-green-100 rounded-lg transition-colors z-50 relative"
        data-testid="button-mobile-menu"
        aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-green-700" />
        ) : (
          <Menu className="w-6 h-6 text-green-700" />
        )}
      </button>

      {/* Mobile Menu - ALWAYS render but translate off-screen when closed */}
      <div className="lg:hidden">
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
            isOpen ? 'opacity-100 z-[55]' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsOpen(false)}
          data-testid="mobile-menu-backdrop"
        />
        
        {/* Menu Panel - SLIDE FROM LEFT */}
        <div 
          className={`fixed top-0 left-0 bottom-0 w-[85vw] max-w-[320px] bg-white shadow-2xl z-[60] overflow-y-auto transform transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ willChange: 'transform' }}
          data-testid="mobile-menu-panel"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-green-700 mb-4">Kategoriler</h2>
            
            <div className="space-y-2">
              {/* Tümü Link */}
              <a
                href="/tum-gidalar"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition-all"
                data-testid="link-mobile-category-all"
              >
                Tümü
              </a>

              {/* Main Categories Only (no subcategories) */}
              {categoryGroups.map((group) => (
                <a
                  key={group.mainCategory}
                  href={`/kategori/${categoryToSlug(group.mainCategory)}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                  data-testid={`link-mobile-category-${group.mainCategory}`}
                >
                  {group.mainCategory}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Header({ categoryGroups = [], currentPath = "/" }: HeaderProps) {
  const isHomeActive = currentPath === "/" || currentPath.startsWith("/?");

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 border-b-2 border-green-200/50 shadow-lg shadow-green-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        {/* Top bar - Logo, Search & Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Menu - Hidden on desktop */}
          <div className="lg:hidden">
            <MobileMenu categoryGroups={categoryGroups} currentPath={currentPath} />
          </div>

          {/* Logo */}
          <a href="/" data-testid="link-home" className="flex-shrink-0 hover:scale-105 transition-transform">
            <img 
              src="/logo.png" 
              alt="Besin Değerim" 
              className="h-14 sm:h-16 lg:h-20 w-auto"
              data-testid="img-header-logo"
            />
          </a>

          {/* Search Bar with Autocomplete (Progressive Enhancement) */}
          <div className="flex-1 min-w-0">
            <ClientOnly fallback={
              <form action="/ara" method="GET" data-testid="form-search">
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Ara..."
                    className="h-10 sm:h-11 w-full rounded-2xl border-2 border-green-200/50 bg-white pl-10 sm:pl-12 pr-4 sm:pr-6 text-sm text-slate-900 placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-green-500"
                    data-testid="input-search"
                  />
                </div>
              </form>
            }>
              <SearchAutocomplete 
                placeholder="Ara..."
                compact={true}
              />
            </ClientOnly>
          </div>
        </div>

        {/* Categories - Desktop Only Horizontal Scroll with Dropdowns */}
        <div className="hidden lg:block relative -mx-4 px-4 mt-3">
          <div className="flex items-center gap-2 overflow-x-auto overflow-y-visible pb-2 scrollbar-hide snap-x snap-mandatory">
            <a 
              href="/tum-gidalar" 
              data-testid="link-category-all"
              className="flex-shrink-0 snap-start whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-200/50"
            >
              Tümü
            </a>
            
            {categoryGroups.map((group) => (
              <a 
                key={group.mainCategory}
                href={`/kategori/${categoryToSlug(group.mainCategory)}`}
                className="flex-shrink-0 snap-start whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-200/50"
                data-testid={`link-category-${group.mainCategory}`}
              >
                {group.mainCategory}
              </a>
            ))}
          </div>
        </div>

      </div>
    </header>
  );
}
