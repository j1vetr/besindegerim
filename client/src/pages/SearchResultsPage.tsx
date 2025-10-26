import React from "react";
import { type Food, type CategoryGroup } from "@shared/schema";
import { SearchForm } from "@/components/SearchForm";
import { FoodCard } from "@/components/FoodCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface SearchResultsPageProps {
  query: string;
  results: Food[];
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

export function SearchResultsPage({ query, results, categoryGroups, currentPath }: SearchResultsPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      <main className="flex-1 bg-gradient-to-br from-white via-green-50/20 to-white">
      {/* Search Section with Gradient Background */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-[#22c55e]/10 to-[#16a34a]/10 border-b border-green-100">
        <div className="max-w-2xl mx-auto">
          <h1
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center"
            data-testid="text-search-title"
          >
            Gıda Ara
          </h1>
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl p-2">
            <SearchForm initialQuery={query} />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {query && (
            <div className="mb-8 text-center">
              <p
                className="text-lg text-gray-600"
                data-testid="text-search-query"
              >
                <span className="font-semibold text-gray-800">"{query}"</span> için{" "}
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full text-sm font-medium">
                  {results.length} gıda
                </span>{" "}
                bulundu
              </p>
            </div>
          )}

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20" data-testid="empty-state">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-xl text-gray-700 font-medium mb-3">
                {query
                  ? `"${query}" için sonuç bulunamadı`
                  : "Aramak için yukarıdaki formu kullanın"}
              </p>
              <p className="text-gray-500 mb-8">
                Farklı bir arama terimi deneyin veya ana sayfaya dönün
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white font-semibold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg hover:shadow-xl"
                data-testid="link-home-search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Ana Sayfaya Dön
              </a>
            </div>
          )}
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
