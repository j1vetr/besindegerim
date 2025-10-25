import React from "react";
import { type Food } from "@shared/schema";
import { CalorieCard } from "@/components/CalorieCard";
import { NutritionTable } from "@/components/NutritionTable";
import { FoodCard } from "@/components/FoodCard";
import { Card } from "@/components/ui/card";

interface FoodDetailPageProps {
  food: Food;
  alternatives: Food[];
}

export function FoodDetailPage({ food, alternatives }: FoodDetailPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Food Image */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              {food.imageUrl ? (
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="h-48 w-48 md:h-64 md:w-64 rounded-lg object-cover shadow-sm"
                  data-testid="img-food-detail"
                />
              ) : (
                <div className="h-48 w-48 md:h-64 md:w-64 rounded-lg bg-accent/30 flex items-center justify-center shadow-sm">
                  <svg
                    className="w-20 h-20 text-accent-foreground/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Food Name & Calorie Card */}
            <div className="flex-1 w-full">
              <h1
                className="text-3xl md:text-4xl font-semibold text-foreground mb-6"
                data-testid="text-food-name"
              >
                {food.name}
              </h1>
              <CalorieCard food={food} />
            </div>
          </div>
        </div>

        {/* Nutrition Table */}
        <section className="mb-12">
          <h2
            className="text-2xl md:text-3xl font-semibold text-foreground mb-6"
            data-testid="text-nutrition-title"
          >
            Besin Değerleri
          </h2>
          <Card className="p-0 overflow-hidden">
            <NutritionTable food={food} />
          </Card>
        </section>

        {/* Alternatives Section */}
        {alternatives.length > 0 && (
          <section className="mb-8">
            <h2
              className="text-2xl md:text-3xl font-semibold text-foreground mb-6"
              data-testid="text-alternatives-title"
            >
              Benzer Gıdalar
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {alternatives.map((altFood) => (
                <FoodCard key={altFood.id} food={altFood} compact />
              ))}
            </div>
          </section>
        )}

        {/* Back to Home Link */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="text-primary hover:underline font-medium"
            data-testid="link-home"
          >
            ← Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </div>
  );
}
