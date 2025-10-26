import React from "react";
import { type Food } from "@shared/schema";

interface FoodCardProps {
  food: Food;
  compact?: boolean;
}

export function FoodCard({ food, compact = false }: FoodCardProps) {
  const imageUrl = food.imageUrl || "https://via.placeholder.com/300";

  if (compact) {
    // Compact mode: horizontal layout - minimal
    return (
      <a
        href={`/${food.slug}`}
        className="block group"
        data-testid={`link-food-${food.slug}`}
      >
        <div className="bg-[#111] border border-white/10 rounded-md hover:border-[#1f8a4d]/50 transition-colors">
          <div className="flex gap-4 p-4">
            {/* Small Image */}
            <div className="flex-shrink-0 w-20 h-20 bg-black rounded-md overflow-hidden">
              <img
                src={imageUrl}
                alt={food.name}
                className="w-full h-full object-cover"
                data-testid={`img-food-${food.slug}`}
                loading="lazy"
              />
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3
                className="text-sm font-semibold text-white mb-1 truncate"
                data-testid={`text-food-name-${food.slug}`}
              >
                {food.name}
              </h3>
              <p className="text-xs text-white/60 mb-1">
                <span className="font-bold text-[#1f8a4d]" data-testid={`text-calories-${food.slug}`}>
                  {Number(food.calories).toFixed(0)} kal
                </span>
              </p>
              <p className="text-xs text-white/50 truncate" data-testid={`text-serving-${food.slug}`}>
                {food.servingLabel}
              </p>
            </div>
          </div>
        </div>
      </a>
    );
  }

  // Full mode: Clean minimal card
  return (
    <a
      href={`/${food.slug}`}
      className="block group"
      data-testid={`link-food-${food.slug}`}
    >
      {/* Main Card Container */}
      <div className="h-full bg-[#111] border border-white/10 rounded-md overflow-hidden hover:border-[#1f8a4d]/50 transition-colors">
        {/* Image Section */}
        <div className="relative h-48 bg-black overflow-hidden">
          <img
            src={imageUrl}
            alt={food.name}
            className="w-full h-full object-cover"
            data-testid={`img-food-${food.slug}`}
            loading="lazy"
          />

          {/* Category Badge - Top Left */}
          {food.category && (
            <div className="absolute top-3 left-3">
              <span className="text-xs px-3 py-1 bg-[#1f8a4d]/20 text-[#1f8a4d] rounded-full font-medium border border-[#1f8a4d]/30">
                {food.category}
              </span>
            </div>
          )}

          {/* Calorie Badge - Top Right */}
          <div className="absolute top-3 right-3">
            <div className="bg-[#111]/90 border border-white/20 rounded-md px-3 py-2">
              <div className="text-right">
                <div className="text-xl font-bold text-white" data-testid={`badge-calories-${food.slug}`}>
                  {Number(food.calories).toFixed(0)}
                </div>
                <div className="text-xs text-white/60">kal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Food Name */}
          <h3
            className="text-lg font-semibold text-white mb-2 line-clamp-2"
            data-testid={`text-food-name-${food.slug}`}
          >
            {food.name}
          </h3>
          
          {/* Serving Info */}
          <p className="text-sm text-white/60 mb-4" data-testid={`text-serving-${food.slug}`}>
            {food.servingLabel}
          </p>

          {/* Macros - Simple Pills */}
          <div className="flex gap-2 flex-wrap">
            {/* Protein */}
            <span className="text-xs px-2 py-1 bg-white/5 text-white/70 rounded border border-white/10" data-testid={`text-protein-${food.slug}`}>
              {Number(food.protein || 0).toFixed(1)}g protein
            </span>

            {/* Carbs */}
            <span className="text-xs px-2 py-1 bg-white/5 text-white/70 rounded border border-white/10" data-testid={`text-carbs-${food.slug}`}>
              {Number(food.carbs || 0).toFixed(1)}g karb
            </span>

            {/* Fat */}
            <span className="text-xs px-2 py-1 bg-white/5 text-white/70 rounded border border-white/10" data-testid={`text-fat-${food.slug}`}>
              {Number(food.fat || 0).toFixed(1)}g yağ
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
