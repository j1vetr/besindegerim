import React from "react";
import { type Food } from "@shared/schema";
import { SearchForm } from "@/components/SearchForm";
import { FoodCard } from "@/components/FoodCard";

interface HomePageProps {
  popularFoods: Food[];
}

export function HomePage({ popularFoods }: HomePageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1
            className="text-3xl md:text-4xl font-semibold text-foreground mb-4"
            data-testid="text-title"
          >
            Gıda Besin Değerleri
          </h1>
          <p className="text-base text-muted-foreground mb-8" data-testid="text-subtitle">
            Gerçek porsiyon bazlı kalori ve besin değerleri
          </p>
          <SearchForm />
        </div>
      </section>

      {/* Popular Foods */}
      {popularFoods.length > 0 && (
        <section className="py-12 px-4 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-2xl md:text-3xl font-semibold text-foreground mb-8 text-center"
              data-testid="text-popular-title"
            >
              Popüler Gıdalar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
