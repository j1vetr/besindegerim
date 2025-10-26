import React from "react";
import { type Food } from "@shared/schema";
import { Flame, Beef, Wheat, Droplet, Sparkles } from "lucide-react";

interface FoodCardProps {
  food: Food;
  compact?: boolean;
}

export function FoodCard({ food, compact = false }: FoodCardProps) {
  const imageUrl = food.imageUrl || "https://via.placeholder.com/300";

  if (compact) {
    // Compact mode: horizontal layout - light futuristic
    return (
      <a
        href={`/${food.slug}`}
        className="block group"
        data-testid={`link-food-${food.slug}`}
      >
        <div className="bg-white border-2 border-green-200/50 rounded-2xl hover:border-green-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-green-500/10">
          <div className="flex gap-4 p-4">
            {/* Small Image */}
            <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl overflow-hidden">
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
                className="text-sm font-semibold text-slate-900 mb-1 truncate"
                data-testid={`text-food-name-${food.slug}`}
              >
                {food.name}
              </h3>
              <p className="text-xs text-slate-600 mb-1">
                <span className="font-bold text-green-600" data-testid={`text-calories-${food.slug}`}>
                  {Number(food.calories).toFixed(0)} kal
                </span>
              </p>
              <p className="text-xs text-slate-500 truncate" data-testid={`text-serving-${food.slug}`}>
                {food.servingLabel}
              </p>
            </div>
          </div>
        </div>
      </a>
    );
  }

  // Full mode: Modern Futuristic Card with Icons
  return (
    <a
      href={`/${food.slug}`}
      className="block group"
      data-testid={`link-food-${food.slug}`}
    >
      {/* Main Card Container - Glassmorphic */}
      <div className="h-full backdrop-blur-xl bg-white/80 border-2 border-green-200/50 rounded-3xl overflow-hidden hover:border-green-400/60 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 shadow-xl shadow-green-500/10 hover:shadow-2xl hover:shadow-green-500/25">
        {/* Image Section */}
        <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            data-testid={`img-food-${food.slug}`}
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>

          {/* Category Badge - Top Left */}
          {food.category && (
            <div className="absolute top-3 left-3">
              <span className="text-xs px-3 py-1.5 bg-white/90 backdrop-blur-md text-green-700 rounded-full font-semibold border border-green-200/50 shadow-lg">
                {food.category}
              </span>
            </div>
          )}

          {/* Floating Calorie Badge - Top Right */}
          <div className="absolute top-3 right-3">
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/95 to-white/85 border-2 border-green-400/50 rounded-2xl px-3 py-2 shadow-lg shadow-green-500/30 group-hover:shadow-xl group-hover:shadow-green-500/50 group-hover:scale-110 transition-all duration-500">
              <div className="flex items-center gap-1.5">
                <Flame className="w-5 h-5 text-orange-500" />
                <div className="text-right">
                  <div className="text-xl font-black text-green-600" data-testid={`badge-calories-${food.slug}`}>
                    {Number(food.calories).toFixed(0)}
                  </div>
                  <div className="text-[10px] font-bold text-slate-600">kcal</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sparkle Icon - Bottom Right */}
          <div className="absolute bottom-3 right-3">
            <Sparkles className="w-6 h-6 text-white/80 drop-shadow-lg" />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 bg-gradient-to-br from-white to-green-50/20">
          {/* Food Name */}
          <h3
            className="text-lg font-black text-slate-900 mb-2 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-emerald-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500"
            data-testid={`text-food-name-${food.slug}`}
          >
            {food.name}
          </h3>
          
          {/* Serving Info */}
          <p className="text-xs text-slate-600 mb-4 flex items-center gap-1.5" data-testid={`text-serving-${food.slug}`}>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            {food.servingLabel}
          </p>

          {/* Macros Grid - Modern Icon Layout */}
          <div className="grid grid-cols-3 gap-2">
            {/* Protein */}
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200/50 group-hover:scale-105 transition-transform">
              <Beef className="w-4 h-4 text-green-600 mb-1" />
              <div className="text-xs font-bold text-green-700" data-testid={`text-protein-${food.slug}`}>
                {Number(food.protein || 0).toFixed(1)}g
              </div>
              <div className="text-[10px] text-slate-600">Protein</div>
            </div>

            {/* Carbs */}
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-200/50 group-hover:scale-105 transition-transform">
              <Wheat className="w-4 h-4 text-emerald-600 mb-1" />
              <div className="text-xs font-bold text-emerald-700" data-testid={`text-carbs-${food.slug}`}>
                {Number(food.carbs || 0).toFixed(1)}g
              </div>
              <div className="text-[10px] text-slate-600">Karb</div>
            </div>

            {/* Fat */}
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200/50 group-hover:scale-105 transition-transform">
              <Droplet className="w-4 h-4 text-green-600 mb-1" />
              <div className="text-xs font-bold text-green-700" data-testid={`text-fat-${food.slug}`}>
                {Number(food.fat || 0).toFixed(1)}g
              </div>
              <div className="text-[10px] text-slate-600">Yağ</div>
            </div>
          </div>
        </div>

        {/* Bottom Green Gradient Accent Line */}
        <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"></div>
      </div>
    </a>
  );
}
