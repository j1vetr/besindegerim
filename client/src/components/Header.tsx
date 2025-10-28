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

// Mobile menu panel component - Rendered outside header
function MobileMenuPanel({ 
  categoryGroups, 
  isOpen, 
  onClose 
}: { 
  categoryGroups: CategoryGroup[], 
  isOpen: boolean, 
  onClose: () => void 
}) {
  return (
    <div className="lg:hidden">
      {/* Backdrop - Starts below header */}
      <div 
        className={`fixed top-[64px] sm:top-[72px] left-0 right-0 bottom-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 z-[55]' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        data-testid="mobile-menu-backdrop"
      />
      
      {/* Menu Panel - SLIDE FROM LEFT, BELOW HEADER */}
      <div 
        className={`fixed top-[64px] sm:top-[72px] left-0 bottom-0 w-[85vw] max-w-[320px] bg-white shadow-2xl z-[60] overflow-y-auto transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ willChange: 'transform' }}
        data-testid="mobile-menu-panel"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-green-700 mb-4">Menü</h2>
          
          <div className="space-y-2">
            {/* Hesaplayıcılar Ana Link */}
            <a
              href="/hesaplayicilar"
              onClick={onClose}
              className="block px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
              data-testid="link-mobile-calculators"
            >
              Hesaplayıcılar
            </a>

            {/* Hesaplayıcılar Alt Menüsü - 16 Calculator */}
            <div className="ml-4 space-y-1 mt-1">
              <a
                href="/hesaplayicilar/gunluk-kalori-ihtiyaci"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                data-testid="link-mobile-calc-daily-calorie"
              >
                Günlük Kalori ve Makro
              </a>
              <a
                href="/hesaplayicilar/bmi"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                data-testid="link-mobile-calc-bmi"
              >
                BMI (Vücut Kitle İndeksi)
              </a>
              <a
                href="/hesaplayicilar/ideal-kilo"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                data-testid="link-mobile-calc-ideal-weight"
              >
                İdeal Kilo
              </a>
              <a
                href="/hesaplayicilar/gunluk-su-ihtiyaci"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                data-testid="link-mobile-calc-water"
              >
                Günlük Su İhtiyacı
              </a>
              <a
                href="/hesaplayicilar/protein-gereksinimi"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                data-testid="link-mobile-calc-protein"
              >
                Protein Gereksinimi
              </a>
              <a
                href="/hesaplayicilar/porsiyon-cevirici"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                data-testid="link-mobile-calc-portion"
              >
                Porsiyon Çevirici
              </a>
              <a
                href="/hesaplayicilar/kilo-verme-suresi"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                data-testid="link-mobile-calc-weight-loss"
              >
                Kilo Verme/Alma Süresi
              </a>
              <a
                href="/hesaplayicilar/vucut-yag-yuzde"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                data-testid="link-mobile-calc-body-fat"
              >
                Vücut Yağ Yüzdesi
              </a>
              <a
                href="/hesaplayicilar/bmr"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                data-testid="link-mobile-calc-bmr"
              >
                BMR (Bazal Metabolizma)
              </a>
              <a
                href="/hesaplayicilar/makro-hesaplayici"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                data-testid="link-mobile-calc-macro"
              >
                Makro Dağılımı
              </a>
              <a
                href="/hesaplayicilar/ogun-plani"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                data-testid="link-mobile-calc-meal-plan"
              >
                Öğün Planlayıcı
              </a>
              <a
                href="/hesaplayicilar/vitamin-mineral"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                data-testid="link-mobile-calc-vitamin"
              >
                Vitamin & Mineral İhtiyacı
              </a>
              <a
                href="/hesaplayicilar/1rm"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                data-testid="link-mobile-calc-1rm"
              >
                1RM (Maksimum Kuvvet)
              </a>
              <a
                href="/hesaplayicilar/kalori-yakma"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                data-testid="link-mobile-calc-calorie-burn"
              >
                Kalori Yakım
              </a>
              <a
                href="/hesaplayicilar/vucut-olcumleri"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                data-testid="link-mobile-calc-body-measurements"
              >
                Vücut Ölçümleri
              </a>
              <a
                href="/hesaplayicilar/gida-karsilastirma"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                data-testid="link-mobile-calc-food-comparison"
              >
                Gıda Karşılaştırma
              </a>
            </div>

            {/* Tümü Link */}
            <a
              href="/tum-gidalar"
              onClick={onClose}
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
                onClick={onClose}
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
  );
}

export function Header({ categoryGroups = [], currentPath = "/" }: HeaderProps) {
  const isHomeActive = currentPath === "/" || currentPath.startsWith("/?");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Panel - Rendered OUTSIDE header to avoid container constraints */}
      <MobileMenuPanel 
        categoryGroups={categoryGroups} 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 border-b-2 border-green-200/50 shadow-lg shadow-green-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          {/* Top bar - Logo, Search & Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Hamburger Button - Inside header flex layout */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                data-testid="button-mobile-menu"
                aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-green-700" />
                ) : (
                  <Menu className="w-6 h-6 text-green-700" />
                )}
              </button>
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
            {/* Hesaplayıcılar Dropdown - Desktop */}
            <div className="relative group flex-shrink-0 snap-start">
              <a 
                href="/hesaplayicilar" 
                data-testid="link-calculators"
                className="inline-block whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg border-2 border-green-500"
              >
                Hesaplayıcılar
              </a>
              
              {/* Dropdown Menu - Hover to show - 2 COLUMNS - Right aligned to prevent overflow */}
              <div className="absolute top-full right-0 mt-2 w-[620px] max-w-[90vw] bg-white rounded-xl shadow-2xl border-2 border-green-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {/* Column 1 */}
                    <a
                      href="/hesaplayicilar/gunluk-kalori-ihtiyaci"
                      className="block px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      data-testid="link-calc-daily-calorie"
                    >
                      Günlük Kalori ve Makro
                    </a>
                    <a
                      href="/hesaplayicilar/bmi"
                      className="block px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      data-testid="link-calc-bmi"
                    >
                      BMI (Vücut Kitle İndeksi)
                    </a>
                    <a
                      href="/hesaplayicilar/ideal-kilo"
                      className="block px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      data-testid="link-calc-ideal-weight"
                    >
                      İdeal Kilo
                    </a>
                    <a
                      href="/hesaplayicilar/gunluk-su-ihtiyaci"
                      className="block px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      data-testid="link-calc-water"
                    >
                      Günlük Su İhtiyacı
                    </a>
                    <a
                      href="/hesaplayicilar/protein-gereksinimi"
                      className="block px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      data-testid="link-calc-protein"
                    >
                      Protein Gereksinimi
                    </a>
                    <a
                      href="/hesaplayicilar/porsiyon-cevirici"
                      className="block px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      data-testid="link-calc-portion"
                    >
                      Porsiyon Çevirici
                    </a>
                    <a
                      href="/hesaplayicilar/kilo-verme-suresi"
                      className="block px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      data-testid="link-calc-weight-loss"
                    >
                      Kilo Verme/Alma Süresi
                    </a>
                    <a
                      href="/hesaplayicilar/vucut-yag-yuzde"
                      className="block px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      data-testid="link-calc-body-fat"
                    >
                      Vücut Yağ Yüzdesi
                    </a>
                    
                    {/* Column 2 */}
                    <a
                      href="/hesaplayicilar/bmr"
                      className="block px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      data-testid="link-calc-bmr"
                    >
                      BMR (Bazal Metabolizma)
                    </a>
                    <a
                      href="/hesaplayicilar/makro-hesaplayici"
                      className="block px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      data-testid="link-calc-macro"
                    >
                      Makro Dağılımı
                    </a>
                    <a
                      href="/hesaplayicilar/ogun-plani"
                      className="block px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      data-testid="link-calc-meal-plan"
                    >
                      Öğün Planlayıcı
                    </a>
                    <a
                      href="/hesaplayicilar/vitamin-mineral"
                      className="block px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      data-testid="link-calc-vitamin"
                    >
                      Vitamin & Mineral İhtiyacı
                    </a>
                    <a
                      href="/hesaplayicilar/1rm"
                      className="block px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      data-testid="link-calc-1rm"
                    >
                      1RM (Maksimum Kuvvet)
                    </a>
                    <a
                      href="/hesaplayicilar/kalori-yakma"
                      className="block px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      data-testid="link-calc-calorie-burn"
                    >
                      Kalori Yakım
                    </a>
                    <a
                      href="/hesaplayicilar/vucut-olcumleri"
                      className="block px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      data-testid="link-calc-body-measurements"
                    >
                      Vücut Ölçümleri
                    </a>
                    <a
                      href="/hesaplayicilar/gida-karsilastirma"
                      className="block px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      data-testid="link-calc-food-comparison"
                    >
                      Gıda Karşılaştırma
                    </a>
                  </div>
                </div>
              </div>
            </div>

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
    </>
  );
}
