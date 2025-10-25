import React from "react";
import { type Food } from "@shared/schema";
import { SearchForm } from "@/components/SearchForm";
import { FoodCard } from "@/components/FoodCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface HomePageProps {
  popularFoods: Food[];
  categories?: string[];
  currentPath?: string;
}

export function HomePage({ popularFoods, categories, currentPath }: HomePageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} currentPath={currentPath} />
      <main className="flex-1 bg-gradient-to-br from-white via-green-50/30 to-white">
      {/* Hero Section with Gradient */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/90 to-[#16a34a]/80"></div>
        
        {/* Decorative Circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg"
            data-testid="text-title"
          >
            Türkiye'nin En Kapsamlı<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-green-100">
              Gıda Besin Değerleri Rehberi
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto drop-shadow" data-testid="text-subtitle">
            Gerçek porsiyon bazlı kalori ve besin değerleri. Binlerce gıda, anlık arama, detaylı bilgiler.
          </p>

          {/* Modern Search Bar with Glassmorphism */}
          <div className="backdrop-blur-md bg-white/90 rounded-2xl shadow-2xl p-2 max-w-2xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Popular Foods Section */}
      {popularFoods.length > 0 && (
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 relative inline-block"
                data-testid="text-popular-title"
              >
                Popüler Gıdalar
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full"></div>
              </h2>
              <p className="text-gray-600 mt-6">
                En çok aranan gıdaların besin değerlerini keşfedin
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {popularFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-green-50/50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Gerçek Porsiyon Bazlı</h3>
              <p className="text-gray-600">
                100g değil, gerçek porsiyon ölçüleri. "1 orta domates" gibi anlaşılır veriler.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Hızlı Arama</h3>
              <p className="text-gray-600">
                Binlerce gıda arasından istediğinizi hızlıca bulun ve besin değerlerini görün.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Detaylı Besin Değerleri</h3>
              <p className="text-gray-600">
                Kalori, protein, karbonhidrat, yağ ve daha fazlası. Tüm besin değerleri tek bir yerde.
              </p>
            </div>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
