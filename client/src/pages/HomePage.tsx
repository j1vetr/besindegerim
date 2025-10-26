import React from "react";
import { type Food } from "@shared/schema";
import { FoodCard } from "@/components/FoodCard";
import { SearchForm } from "@/components/SearchForm";
import { Header } from "@/components/Header";
import { Database, TrendingUp, Sparkles } from "lucide-react";

interface HomePageProps {
  categories?: string[];
  popularFoods?: Food[];
  currentPath?: string;
}

export default function HomePage({ 
  categories = [], 
  popularFoods = [],
  currentPath = "/"
}: HomePageProps = {}) {
  const isLoading = false;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header categories={categories} currentPath={currentPath} />
      
      <main>
        {/* Hero Section - Minimal */}
        <section className="bg-black py-20 sm:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight">
              Besin Değerleri Platformu
            </h1>
            
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              Gerçek porsiyon bazlı kalori ve besin değerleri. USDA verisi.
            </p>

            {/* Search Form */}
            <div className="max-w-2xl mx-auto mb-16">
              <SearchForm />
            </div>

            {/* Stats - Simple Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
              <div 
                className="bg-[#111] border border-white/10 rounded-md p-6 hover:border-[#1f8a4d]/50 transition-colors"
                data-testid="stat-pill-0"
              >
                <Database className="w-8 h-8 mx-auto mb-3 text-[#1f8a4d]" />
                <p className="text-sm md:text-base font-semibold text-white">98+ Gıda</p>
              </div>
              
              <div 
                className="bg-[#111] border border-white/10 rounded-md p-6 hover:border-[#1f8a4d]/50 transition-colors"
                data-testid="stat-pill-1"
              >
                <TrendingUp className="w-8 h-8 mx-auto mb-3 text-[#1f8a4d]" />
                <p className="text-sm md:text-base font-semibold text-white">Gerçek Porsiyon</p>
              </div>
              
              <div 
                className="bg-[#111] border border-white/10 rounded-md p-6 hover:border-[#1f8a4d]/50 transition-colors"
                data-testid="stat-pill-2"
              >
                <Database className="w-8 h-8 mx-auto mb-3 text-[#1f8a4d]" />
                <p className="text-sm md:text-base font-semibold text-white">USDA Verisi</p>
              </div>
              
              <div 
                className="bg-[#111] border border-white/10 rounded-md p-6 hover:border-[#1f8a4d]/50 transition-colors"
                data-testid="stat-pill-3"
              >
                <Sparkles className="w-8 h-8 mx-auto mb-3 text-[#1f8a4d]" />
                <p className="text-sm md:text-base font-semibold text-white">Vitamin & Mineral</p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Foods Section */}
        <section className="bg-[#0b1d16] py-16 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
                Popüler Gıdalar
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                En çok aranan besin değerlerini keşfedin
              </p>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#111] border border-white/10 rounded-md h-80"
                  ></div>
                ))}
              </div>
            ) : (
              <>
                {/* Food Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {popularFoods.map((food) => (
                    <FoodCard key={food.id} food={food} />
                  ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                  <a
                    href="/kategori/sebzeler"
                    className="inline-flex items-center gap-2 bg-[#1f8a4d] text-white px-8 py-3 rounded-md font-medium hover:bg-[#27a35f] transition-colors"
                    data-testid="link-view-all"
                  >
                    <span>Tüm Gıdaları Keşfet</span>
                    <TrendingUp className="w-5 h-5" />
                  </a>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-black py-16 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Title */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
                Neden Besin Değerim?
              </h2>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1: USDA Verisi */}
              <div 
                className="bg-[#111] border border-white/10 rounded-md p-8 hover:border-[#1f8a4d]/50 transition-colors"
                data-testid="feature-card-0"
              >
                <div className="w-12 h-12 bg-[#1f8a4d]/20 rounded-md flex items-center justify-center mb-6">
                  <Database className="w-6 h-6 text-[#1f8a4d]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">USDA Verisi</h3>
                <p className="text-white/80 leading-relaxed">
                  Amerika Tarım Bakanlığı'ndan doğrulanmış, bilimsel verilerle desteklenen besin değerleri
                </p>
              </div>

              {/* Feature 2: Gerçek Porsiyon */}
              <div 
                className="bg-[#111] border border-white/10 rounded-md p-8 hover:border-[#1f8a4d]/50 transition-colors"
                data-testid="feature-card-1"
              >
                <div className="w-12 h-12 bg-[#1f8a4d]/20 rounded-md flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-[#1f8a4d]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Gerçek Porsiyon</h3>
                <p className="text-white/80 leading-relaxed">
                  100g yerine gerçek porsiyon bazlı kalori hesaplama. Örnek: '1 orta domates = 22 kal'
                </p>
              </div>

              {/* Feature 3: Detaylı Bilgi */}
              <div 
                className="bg-[#111] border border-white/10 rounded-md p-8 hover:border-[#1f8a4d]/50 transition-colors"
                data-testid="feature-card-2"
              >
                <div className="w-12 h-12 bg-[#1f8a4d]/20 rounded-md flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-[#1f8a4d]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Detaylı Bilgi</h3>
                <p className="text-white/80 leading-relaxed">
                  Kalori, makro besinler, 20+ vitamin ve minerallerle tam analiz
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
