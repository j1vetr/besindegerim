import React from "react";
import type { Food } from "@shared/schema";
import { FoodCard } from "@/components/FoodCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface CategoryPageProps {
  category: string;
  foods: Food[];
  categories?: string[];
  currentPath?: string;
}

export function CategoryPage(props?: CategoryPageProps) {
  // Default props for SSR
  const category = props?.category || "Kategori";
  const foods = props?.foods || [];
  const categories = props?.categories;
  const currentPath = props?.currentPath;

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} currentPath={currentPath} />
      <main className="flex-1 bg-gradient-to-br from-white via-green-50/20 to-white">
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground" data-testid="text-category-title">
          {category}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground" data-testid="text-category-count">
          {foods.length} gıda bulundu
        </p>
      </div>

      {foods.length === 0 ? (
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-12 text-center">
          <p className="text-lg text-muted-foreground" data-testid="text-no-foods">
            Bu kategoride henüz gıda bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
      </div>
      </main>
      <Footer />
    </div>
  );
}
