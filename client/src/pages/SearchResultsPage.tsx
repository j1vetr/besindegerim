import React from "react";
import { type Food } from "@shared/schema";
import { SearchForm } from "@/components/SearchForm";
import { FoodCard } from "@/components/FoodCard";

interface SearchResultsPageProps {
  query: string;
  results: Food[];
}

export function SearchResultsPage({ query, results }: SearchResultsPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Search Section */}
      <section className="py-12 md:py-16 px-4 border-b border-border">
        <div className="max-w-2xl mx-auto">
          <h1
            className="text-2xl md:text-3xl font-semibold text-foreground mb-6 text-center"
            data-testid="text-search-title"
          >
            Gıda Ara
          </h1>
          <SearchForm initialQuery={query} />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {query && (
            <p
              className="text-base text-muted-foreground mb-6"
              data-testid="text-search-query"
            >
              <span className="font-medium text-foreground">"{query}"</span> için sonuçlar:{" "}
              {results.length} gıda bulundu
            </p>
          )}

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16" data-testid="empty-state">
              <p className="text-lg text-muted-foreground mb-4">
                {query
                  ? `"${query}" için sonuç bulunamadı`
                  : "Aramak için yukarıdaki formu kullanın"}
              </p>
              <a
                href="/"
                className="text-primary hover:underline font-medium"
                data-testid="link-home-search"
              >
                ← Ana Sayfaya Dön
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
