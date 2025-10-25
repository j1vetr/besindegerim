import React from "react";
import { type Food } from "@shared/schema";
import { CalorieCard } from "@/components/CalorieCard";
import { NutritionTable } from "@/components/NutritionTable";
import { FoodCard } from "@/components/FoodCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface FoodDetailPageProps {
  food: Food;
  alternatives: Food[];
  categories?: string[];
  currentPath?: string;
}

export function FoodDetailPage({ food, alternatives, categories, currentPath }: FoodDetailPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} currentPath={currentPath} />
      <main className="flex-1 bg-gradient-to-br from-white via-green-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Hero Section - Food Image & Name */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Large Food Image */}
            <div className="relative">
              {food.imageUrl ? (
                <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="w-full h-[400px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-300"
                    data-testid="img-food-detail"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              ) : (
                <div className="w-full h-[400px] md:h-[500px] rounded-2xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center shadow-2xl">
                  <svg
                    className="w-32 h-32 text-green-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Food Info & Calorie Card */}
            <div>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-8 leading-tight"
                data-testid="text-food-name"
              >
                {food.name}
              </h1>
              <CalorieCard food={food} />
            </div>
          </div>
        </div>

        {/* Macronutrient Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {/* Protein Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Protein</h3>
            </div>
            <p className="text-3xl font-bold text-teal-600">{Number(food.protein || 0).toFixed(1)}g</p>
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-500 to-teal-600" style={{ width: "75%" }}></div>
            </div>
          </div>

          {/* Carbs Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Karbonhidrat</h3>
            </div>
            <p className="text-3xl font-bold text-orange-600">{Number(food.carbs || 0).toFixed(1)}g</p>
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600" style={{ width: "60%" }}></div>
            </div>
          </div>

          {/* Fat Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Yağ</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{Number(food.fat || 0).toFixed(1)}g</p>
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600" style={{ width: "40%" }}></div>
            </div>
          </div>
        </div>

        {/* Detailed Nutrition Table */}
        <section className="mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center"
            data-testid="text-nutrition-title"
          >
            Detaylı Besin Değerleri
          </h2>
          <NutritionTable food={food} />
        </section>

        {/* Alternatives Section */}
        {alternatives.length > 0 && (
          <section className="mb-12">
            <div className="text-center mb-10">
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 relative inline-block"
                data-testid="text-alternatives-title"
              >
                Benzer Gıdalar
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full"></div>
              </h2>
              <p className="text-gray-600 mt-6">
                Bu gıdaya alternatif olabilecek diğer seçenekler
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {alternatives.map((altFood) => (
                <FoodCard key={altFood.id} food={altFood} />
              ))}
            </div>
          </section>
        )}

        {/* Back to Home Link */}
        <div className="text-center mt-16">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white font-semibold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            data-testid="link-home"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
