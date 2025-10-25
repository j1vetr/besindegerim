import React from "react";
import { type Food } from "@shared/schema";
import { SearchForm } from "@/components/SearchForm";
import { FoodCard } from "@/components/FoodCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, Zap, TrendingUp, Sparkles } from "lucide-react";

interface HomePageProps {
  popularFoods: Food[];
  categories?: string[];
  currentPath?: string;
}

export function HomePage({ popularFoods, categories, currentPath }: HomePageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} currentPath={currentPath} />
      <main className="flex-1">
        {/* Hero Section - Modern & Eye-catching */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#22c55e] via-[#16a34a] to-[#15803d]">
          {/* Animated Background Shapes - CSS Only */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-60 -left-40 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-8">
              {/* Short, Punchy Headline */}
              <h1
                className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight"
                data-testid="text-title"
              >
                Besin Değeri
                <br />
                <span className="bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                  Anında
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-medium" data-testid="text-subtitle">
                Porsiyon bazlı doğru kalori ve besin değerleri
              </p>

              {/* Glassmorphic Search */}
              <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-3 max-w-3xl mx-auto border border-white/20">
                <SearchForm />
              </div>
            </div>

            {/* Stats Pills - Quick Metrics */}
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              <div className="backdrop-blur-md bg-white/20 rounded-full px-6 py-3 border border-white/30 hover:bg-white/30 transition-colors">
                <span className="text-white font-bold text-lg">98+ Gıda</span>
              </div>
              <div className="backdrop-blur-md bg-white/20 rounded-full px-6 py-3 border border-white/30 hover:bg-white/30 transition-colors">
                <span className="text-white font-bold text-lg">Gerçek Porsiyon</span>
              </div>
              <div className="backdrop-blur-md bg-white/20 rounded-full px-6 py-3 border border-white/30 hover:bg-white/30 transition-colors">
                <span className="text-white font-bold text-lg">USDA Verisi</span>
              </div>
              <div className="backdrop-blur-md bg-white/20 rounded-full px-6 py-3 border border-white/30 hover:bg-white/30 transition-colors">
                <span className="text-white font-bold text-lg">Vitamin & Mineral</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Value Props - Modern Cards */}
        <section className="py-12 px-4 bg-gradient-to-b from-white to-emerald-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <Card className="group relative overflow-visible hover-elevate active-elevate-2" data-testid="card-feature-serving">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#22c55e]/10 to-transparent rounded-bl-full"></div>
                <CardContent className="relative p-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Utensils className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Porsiyon Bazlı</h3>
                  <p className="text-gray-600 leading-relaxed">
                    "1 orta domates" gibi gerçek porsiyonlarla kalori hesabı
                  </p>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="group relative overflow-visible hover-elevate active-elevate-2" data-testid="card-feature-search">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-transparent rounded-bl-full"></div>
                <CardContent className="relative p-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Anlık Arama</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Aradığınız gıdayı saniyeler içinde bulun
                  </p>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="group relative overflow-visible hover-elevate active-elevate-2" data-testid="card-feature-details">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#22c55e]/10 to-transparent rounded-bl-full"></div>
                <CardContent className="relative p-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Detaylı Bilgi</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Kalori, makro besinler, vitamin ve minerallerle tam analiz
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Popular Foods - Modern Grid */}
        {popularFoods.length > 0 && (
          <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="h-1 w-12 bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full"></div>
                  <h2
                    className="text-3xl md:text-5xl font-black text-gray-900"
                    data-testid="text-popular-title"
                  >
                    Popüler Gıdalar
                  </h2>
                  <div className="h-1 w-12 bg-gradient-to-r from-[#16a34a] to-[#22c55e] rounded-full"></div>
                </div>
                <p className="text-gray-600 text-lg">
                  En çok aranan besin değerlerini keşfedin
                </p>
              </div>
              
              {/* Food Grid - Stunning Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {popularFoods.map((food) => (
                  <FoodCard key={food.id} food={food} />
                ))}
              </div>

              {/* View All CTA */}
              <div className="text-center mt-12">
                <a
                  href="/kategori/Meyveler"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  data-testid="link-explore-all"
                >
                  Tüm Gıdaları Keşfet
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Why Choose Us - Alternating Layout */}
        <section className="py-16 px-4 bg-gradient-to-b from-emerald-50/50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Neden <span className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] bg-clip-text text-transparent">Besin Değerim?</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Türkiye'nin en doğru ve güncel besin değerleri platformu
              </p>
            </div>

            <div className="space-y-12">
              {/* Feature 1 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-[#22c55e]/20 to-[#16a34a]/20 rounded-3xl p-8 border-2 border-[#22c55e]/30">
                    <div className="text-6xl font-black text-[#22c55e] mb-2">100%</div>
                    <div className="text-2xl font-bold text-gray-900">Doğru Veri</div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">USDA Kaynaklı</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Tüm besin değerleri USDA FoodData Central API'den alınır. Güvenilir, bilimsel, güncel.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-3xl p-8 border-2 border-teal-500/30">
                    <Sparkles className="w-16 h-16 text-teal-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">Hızlı Erişim</div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Saniyeler İçinde</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Arama, kategori veya popüler gıdalar ile aradığınız bilgiye anında ulaşın.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
