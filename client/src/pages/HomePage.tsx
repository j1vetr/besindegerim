import React from "react";
import { type Food } from "@shared/schema";
import { FoodCard } from "@/components/FoodCard";
import { SearchForm } from "@/components/SearchForm";
import { Header } from "@/components/Header";
import { Sparkles, TrendingUp, Zap, Database } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f172a] to-[#020617] text-slate-50">
      <Header categories={categories} currentPath={currentPath} />
      
      <main>
        {/* Futuristic Hero Section with Glassmorphism */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          {/* Glowing Orbs */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-20 text-center">
            {/* Floating Badge */}
            <div className="inline-flex items-center gap-2 backdrop-blur-xl bg-white/5 border border-emerald-500/30 rounded-full px-6 py-3 mb-8 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-500">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-semibold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Türkiye'nin Geleceği
              </span>
            </div>

            {/* Main Heading with Neon Gradient */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                Besin Değerleri
              </span>
              <br />
              <span className="text-slate-100">
                Platformu
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Gerçek porsiyon bazlı kalori ve besin değerleri. 
              <span className="text-emerald-400 font-semibold"> USDA verisiyle</span> desteklenen, 
              <span className="text-cyan-400 font-semibold"> vitamin ve minerallerle</span> zenginleştirilmiş platform.
            </p>

            {/* Glassmorphic Search Form */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="backdrop-blur-2xl bg-white/10 rounded-3xl p-2 border-2 border-emerald-500/30 shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-500">
                <SearchForm />
              </div>
            </div>

            {/* Stats Grid - Futuristic Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-500 group" data-testid="stat-pill-0">
                <Database className="w-8 h-8 mx-auto mb-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                <p className="text-sm md:text-base font-bold text-slate-100">98+ Gıda</p>
              </div>
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-500 group" data-testid="stat-pill-1">
                <TrendingUp className="w-8 h-8 mx-auto mb-3 text-cyan-400 group-hover:scale-110 transition-transform" />
                <p className="text-sm md:text-base font-bold text-slate-100">Gerçek Porsiyon</p>
              </div>
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-500 group" data-testid="stat-pill-2">
                <Zap className="w-8 h-8 mx-auto mb-3 text-purple-400 group-hover:scale-110 transition-transform" />
                <p className="text-sm md:text-base font-bold text-slate-100">USDA Verisi</p>
              </div>
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-500 group" data-testid="stat-pill-3">
                <Sparkles className="w-8 h-8 mx-auto mb-3 text-blue-400 group-hover:scale-110 transition-transform" />
                <p className="text-sm md:text-base font-bold text-slate-100">Vitamin & Mineral</p>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-8 h-12 border-2 border-emerald-500/50 rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-emerald-400 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Popular Foods Section - Futuristic Grid */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          {/* Section Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f172a] to-transparent"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-500"></div>
                <Sparkles className="w-6 h-6 text-emerald-400" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-500"></div>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black mb-4">
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Popüler Gıdalar
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
                En çok aranan besin değerlerini keşfedin
              </p>

              {/* Neon Underline */}
              <div className="mt-6 mx-auto w-24 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 h-96 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <>
                {/* Food Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {popularFoods.map((food) => (
                    <FoodCard key={food.id} food={food} />
                  ))}
                </div>

                {/* View All CTA */}
                <div className="text-center mt-16">
                  <a
                    href="/kategori/sebzeler"
                    className="inline-flex items-center gap-3 backdrop-blur-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border-2 border-emerald-500/50 hover:border-emerald-400 rounded-2xl px-8 py-4 text-lg font-bold text-slate-100 transition-all duration-500 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105"
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

        {/* Features Section - Glassmorphic Cards */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Section Title */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Neden Besin Değerim?
                </span>
              </h2>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1: USDA Verisi */}
              <div className="group backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2" data-testid="feature-card-0">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
                  <Database className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-3">USDA Verisi</h3>
                <p className="text-slate-400 leading-relaxed">Amerika Tarım Bakanlığı'ndan doğrulanmış, bilimsel verilerle desteklenen besin değerleri</p>
                <div className="mt-6 h-1 w-16 bg-gradient-to-r from-emerald-500 to-transparent rounded-full group-hover:w-full transition-all duration-700"></div>
              </div>

              {/* Feature 2: Gerçek Porsiyon */}
              <div className="group backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2" data-testid="feature-card-1">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
                  <TrendingUp className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-3">Gerçek Porsiyon</h3>
                <p className="text-slate-400 leading-relaxed">100g yerine gerçek porsiyon bazlı kalori hesaplama. Örnek: '1 orta domates = 22 kal'</p>
                <div className="mt-6 h-1 w-16 bg-gradient-to-r from-cyan-500 to-transparent rounded-full group-hover:w-full transition-all duration-700"></div>
              </div>

              {/* Feature 3: Detaylı Bilgi */}
              <div className="group backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2" data-testid="feature-card-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-3">Detaylı Bilgi</h3>
                <p className="text-slate-400 leading-relaxed">Kalori, makro besinler, 20+ vitamin ve minerallerle tam analiz</p>
                <div className="mt-6 h-1 w-16 bg-gradient-to-r from-purple-500 to-transparent rounded-full group-hover:w-full transition-all duration-700"></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
