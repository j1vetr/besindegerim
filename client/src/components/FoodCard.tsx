import React from "react";
import { type Food } from "@shared/schema";
import { Flame } from "lucide-react";

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

  // Full mode: Light Futuristic Glass Card
  return (
    <a
      href={`/${food.slug}`}
      className="block group"
      data-testid={`link-food-${food.slug}`}
    >
      {/* Main Card Container - Glassmorphic */}
      <div className="h-full backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-3xl overflow-hidden hover:border-green-500/50 hover:scale-105 hover:-translate-y-2 transition-all duration-500 shadow-xl shadow-green-500/10 hover:shadow-2xl hover:shadow-green-500/30">
        {/* Image Section */}
        <div className="relative h-64 bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            data-testid={`img-food-${food.slug}`}
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent"></div>

          {/* Category Badge - Top Left */}
          {food.category && (
            <div className="absolute top-4 left-4">
              <span className="text-xs px-3 py-1.5 bg-white/80 backdrop-blur-md text-green-700 rounded-full font-semibold border-2 border-green-200/50 shadow-lg shadow-green-500/20">
                {food.category}
              </span>
            </div>
          )}

          {/* Floating Calorie Badge - Top Right */}
          <div className="absolute top-4 right-4">
            <div className="backdrop-blur-xl bg-white/80 border-2 border-green-500/50 rounded-2xl px-4 py-3 shadow-lg shadow-green-500/30 group-hover:shadow-xl group-hover:shadow-green-500/50 group-hover:scale-110 transition-all duration-500">
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" />
                <div className="text-right">
                  <div className="text-2xl font-black text-green-600" data-testid={`badge-calories-${food.slug}`}>
                    {Number(food.calories).toFixed(0)}
                  </div>
                  <div className="text-xs font-bold text-slate-600">kal</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 bg-gradient-to-br from-white to-green-50/30">
          {/* Food Name */}
          <h3
            className="text-xl font-black text-slate-900 mb-3 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-emerald-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500"
            data-testid={`text-food-name-${food.slug}`}
          >
            {food.name}
          </h3>
          
          {/* Serving Info */}
          <p className="text-sm text-slate-600 mb-4" data-testid={`text-serving-${food.slug}`}>
            {food.servingLabel}
          </p>

          {/* Macros - Gradient Pills */}
          <div className="flex gap-2 flex-wrap">
            {/* Protein */}
            <span 
              className="text-xs px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full font-medium border border-green-200/50"
              data-testid={`text-protein-${food.slug}`}
            >
              {Number(food.protein || 0).toFixed(1)}g protein
            </span>

            {/* Carbs */}
            <span 
              className="text-xs px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 rounded-full font-medium border border-emerald-200/50"
              data-testid={`text-carbs-${food.slug}`}
            >
              {Number(food.carbs || 0).toFixed(1)}g karb
            </span>

            {/* Fat */}
            <span 
              className="text-xs px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full font-medium border border-green-200/50"
              data-testid={`text-fat-${food.slug}`}
            >
              {Number(food.fat || 0).toFixed(1)}g yağ
            </span>
          </div>
        </div>

        {/* Bottom Green Gradient Accent Line */}
        <div className="h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"></div>
      </div>
    </a>
  );
}
