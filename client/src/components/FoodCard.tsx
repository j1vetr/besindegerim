import React from "react";
import { type Food } from "@shared/schema";
import { Card } from "@/components/ui/card";

interface FoodCardProps {
  food: Food;
  compact?: boolean;
}

export function FoodCard({ food, compact = false }: FoodCardProps) {
  const imageUrl = food.imageUrl || "https://via.placeholder.com/250";

  if (compact) {
    // Compact mode: horizontal layout, smaller
    return (
      <a
        href={`/${food.slug}`}
        className="block group"
        data-testid={`link-food-${food.slug}`}
      >
        <div className="hover-elevate transition-all duration-300">
          <Card className="p-3">
            <div className="flex gap-3">
              {/* Small Image */}
              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  data-testid={`img-food-${food.slug}`}
                  loading="lazy"
                />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3
                  className="text-sm font-semibold text-foreground mb-1 truncate"
                  data-testid={`text-food-name-${food.slug}`}
                >
                  {food.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-primary" data-testid={`text-calories-${food.slug}`}>
                    {Number(food.calories).toFixed(0)}
                  </span>
                  {" "}kal
                </p>
                <p className="text-xs text-muted-foreground mt-0.5" data-testid={`text-serving-${food.slug}`}>
                  {food.servingLabel}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </a>
    );
  }

  // Full mode: vertical layout, larger
  return (
    <a
      href={`/${food.slug}`}
      className="block group"
      data-testid={`link-food-${food.slug}`}
    >
      {/* Wrapper for hover-elevate (no overflow-hidden here) */}
      <div className="hover-elevate transition-all duration-300 h-full">
        <Card className="h-full">
          {/* Image Container - overflow hidden only here */}
          <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-50 overflow-hidden">
            <img
              src={imageUrl}
              alt={food.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              data-testid={`img-food-${food.slug}`}
              loading="lazy"
            />
            {/* Calorie Badge */}
            <div 
              className="absolute top-3 right-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg"
              data-testid={`badge-calories-${food.slug}`}
            >
              {Number(food.calories).toFixed(0)} kal
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3
              className="text-lg font-semibold text-foreground mb-2 line-clamp-2"
              data-testid={`text-food-name-${food.slug}`}
            >
              {food.name}
            </h3>
            
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary" data-testid={`text-calories-${food.slug}`}>
                  {Number(food.calories).toFixed(0)}
                </span>
                {" "}kal{" · "}
                <span data-testid={`text-serving-${food.slug}`}>
                  {food.servingLabel}
                </span>
              </p>
              {food.servingSize && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{Number(food.servingSize).toFixed(0)}g</span>
                </div>
              )}
            </div>

            {/* Macros Preview */}
            <div className="pt-3 border-t border-border flex justify-between text-xs">
              <div className="flex items-center gap-1">
                <span className="font-medium text-teal-600">P:</span> 
                <span className="text-muted-foreground" data-testid={`text-protein-${food.slug}`}>
                  {Number(food.protein || 0).toFixed(1)}g
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-orange-600">K:</span> 
                <span className="text-muted-foreground" data-testid={`text-carbs-${food.slug}`}>
                  {Number(food.carbs || 0).toFixed(1)}g
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-yellow-600">Y:</span> 
                <span className="text-muted-foreground" data-testid={`text-fat-${food.slug}`}>
                  {Number(food.fat || 0).toFixed(1)}g
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </a>
  );
}
