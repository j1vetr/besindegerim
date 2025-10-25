import React from "react";
import { type Food } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Flame, TrendingUp } from "lucide-react";

interface FoodCardProps {
  food: Food;
  compact?: boolean;
}

export function FoodCard({ food, compact = false }: FoodCardProps) {
  const imageUrl = food.imageUrl || "https://via.placeholder.com/250";

  if (compact) {
    // Compact mode: horizontal layout
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
              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-50 rounded-xl overflow-hidden relative">
                <img
                  src={imageUrl}
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  data-testid={`img-food-${food.slug}`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3
                  className="text-sm font-bold text-foreground mb-1 truncate"
                  data-testid={`text-food-name-${food.slug}`}
                >
                  {food.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-1">
                  <span className="font-bold text-[#22c55e]" data-testid={`text-calories-${food.slug}`}>
                    {Number(food.calories).toFixed(0)} kal
                  </span>
                </p>
                <p className="text-xs text-muted-foreground truncate" data-testid={`text-serving-${food.slug}`}>
                  {food.servingLabel}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </a>
    );
  }

  // Full mode: stunning card with modern design
  return (
    <a
      href={`/${food.slug}`}
      className="block group"
      data-testid={`link-food-${food.slug}`}
    >
      {/* Wrapper for hover-elevate */}
      <div className="hover-elevate transition-all duration-500 h-full">
        <Card className="h-full overflow-hidden relative">
          {/* Image Container with Gradient Overlay */}
          <div className="relative h-56 bg-gradient-to-br from-emerald-100 via-green-50 to-teal-50 overflow-hidden">
            <img
              src={imageUrl}
              alt={food.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              data-testid={`img-food-${food.slug}`}
              loading="lazy"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
            
            {/* Floating Calorie Badge */}
            <div className="absolute top-4 right-4">
              <div className="backdrop-blur-md bg-white/95 rounded-2xl px-4 py-2 shadow-lg border border-white/40">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <div className="text-right">
                    <div className="text-xl font-black text-gray-900" data-testid={`badge-calories-${food.slug}`}>
                      {Number(food.calories).toFixed(0)}
                    </div>
                    <div className="text-xs font-semibold text-gray-500 leading-none">kal</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Badge */}
            {food.category && (
              <div className="absolute top-4 left-4">
                <div className="backdrop-blur-md bg-[#22c55e]/90 rounded-full px-3 py-1.5 shadow-lg border border-white/40">
                  <span className="text-xs font-bold text-white">{food.category}</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <h3
              className="text-xl font-black text-foreground mb-3 line-clamp-2 group-hover:text-[#22c55e] transition-colors"
              data-testid={`text-food-name-${food.slug}`}
            >
              {food.name}
            </h3>
            
            {/* Serving Info */}
            <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#22c55e]" />
              <span data-testid={`text-serving-${food.slug}`}>
                {food.servingLabel}
              </span>
            </p>

            {/* Macros Grid - Enhanced */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
              {/* Protein */}
              <div className="text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-50 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <span className="text-xs font-black text-teal-700">P</span>
                </div>
                <div className="text-sm font-bold text-teal-600" data-testid={`text-protein-${food.slug}`}>
                  {Number(food.protein || 0).toFixed(1)}
                  <span className="text-xs text-muted-foreground">g</span>
                </div>
              </div>

              {/* Carbs */}
              <div className="text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <span className="text-xs font-black text-orange-700">K</span>
                </div>
                <div className="text-sm font-bold text-orange-600" data-testid={`text-carbs-${food.slug}`}>
                  {Number(food.carbs || 0).toFixed(1)}
                  <span className="text-xs text-muted-foreground">g</span>
                </div>
              </div>

              {/* Fat */}
              <div className="text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <span className="text-xs font-black text-yellow-700">Y</span>
                </div>
                <div className="text-sm font-bold text-yellow-600" data-testid={`text-fat-${food.slug}`}>
                  {Number(food.fat || 0).toFixed(1)}
                  <span className="text-xs text-muted-foreground">g</span>
                </div>
              </div>
            </div>

            {/* Hover Indicator */}
            <div className="mt-4 flex items-center justify-center gap-2 text-[#22c55e] opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-sm font-bold">Detayları Gör</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Card>
      </div>
    </a>
  );
}
