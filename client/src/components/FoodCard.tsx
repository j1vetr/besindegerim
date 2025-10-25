import React from "react";
import { type Food } from "@shared/schema";
import { Flame, TrendingUp } from "lucide-react";

interface FoodCardProps {
  food: Food;
  compact?: boolean;
}

export function FoodCard({ food, compact = false }: FoodCardProps) {
  const imageUrl = food.imageUrl || "https://via.placeholder.com/300";

  if (compact) {
    // Compact mode: horizontal layout with glassmorphism
    return (
      <a
        href={`/${food.slug}`}
        className="block group"
        data-testid={`link-food-${food.slug}`}
      >
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-1 shadow-lg shadow-black/20 hover:shadow-emerald-500/20">
          <div className="flex gap-4 p-4">
            {/* Small Image */}
            <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-emerald-900/20 to-cyan-900/20 rounded-xl overflow-hidden relative border border-emerald-500/20">
              <img
                src={imageUrl}
                alt={food.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                data-testid={`img-food-${food.slug}`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3
                className="text-sm font-bold text-slate-100 mb-1 truncate group-hover:text-emerald-400 transition-colors"
                data-testid={`text-food-name-${food.slug}`}
              >
                {food.name}
              </h3>
              <p className="text-xs text-slate-400 mb-1">
                <span className="font-black text-emerald-400" data-testid={`text-calories-${food.slug}`}>
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

  // Full mode: Futuristic 3D card with neon accents
  return (
    <a
      href={`/${food.slug}`}
      className="block group"
      data-testid={`link-food-${food.slug}`}
    >
      {/* Main Card Container with 3D Transform */}
      <div className="relative h-full backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 overflow-hidden transition-all duration-700 hover:bg-white/10 hover:border-emerald-500/50 hover:scale-105 hover:-translate-y-2 shadow-2xl shadow-black/40 hover:shadow-emerald-500/30">
        {/* Image Section with Gradient Overlay */}
        <div className="relative h-64 bg-gradient-to-br from-emerald-900/30 via-cyan-900/20 to-purple-900/30 overflow-hidden">
          <img
            src={imageUrl}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            data-testid={`img-food-${food.slug}`}
            loading="lazy"
          />
          
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent opacity-80"></div>
          
          {/* Neon Glow Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/20 group-hover:via-transparent group-hover:to-transparent transition-all duration-700"></div>

          {/* Category Badge - Top Left */}
          {food.category && (
            <div className="absolute top-4 left-4">
              <div className="backdrop-blur-md bg-emerald-500/20 border border-emerald-500/50 rounded-full px-4 py-1.5 shadow-lg shadow-emerald-500/30">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  {food.category}
                </span>
              </div>
            </div>
          )}

          {/* Floating Calorie Badge - Top Right with Neon Glow */}
          <div className="absolute top-4 right-4">
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/5 rounded-2xl px-4 py-3 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/40 group-hover:shadow-emerald-500/60 group-hover:scale-110 transition-all duration-500">
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-400 drop-shadow-lg" />
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-50 drop-shadow-lg" data-testid={`badge-calories-${food.slug}`}>
                    {Number(food.calories).toFixed(0)}
                  </div>
                  <div className="text-xs font-bold text-slate-400 leading-none uppercase tracking-wide">
                    kal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Food Name */}
          <h3
            className="text-xl font-black text-slate-100 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-500"
            data-testid={`text-food-name-${food.slug}`}
          >
            {food.name}
          </h3>
          
          {/* Serving Info */}
          <div className="flex items-center gap-2 mb-6 text-sm text-slate-400">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span data-testid={`text-serving-${food.slug}`}>
              {food.servingLabel}
            </span>
          </div>

          {/* Macros Grid - Futuristic Pills */}
          <div className="grid grid-cols-3 gap-3">
            {/* Protein */}
            <div className="backdrop-blur-md bg-gradient-to-br from-teal-500/10 to-teal-600/5 rounded-xl p-3 border border-teal-500/30 hover:border-teal-400/60 transition-all duration-500 group/macro">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500/30 to-teal-600/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover/macro:scale-110 transition-transform shadow-lg shadow-teal-500/20">
                <span className="text-sm font-black text-teal-300">P</span>
              </div>
              <div className="text-center">
                <div className="text-base font-black text-teal-400" data-testid={`text-protein-${food.slug}`}>
                  {Number(food.protein || 0).toFixed(1)}
                </div>
                <div className="text-xs text-slate-500 font-medium">gram</div>
              </div>
            </div>

            {/* Carbs */}
            <div className="backdrop-blur-md bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-xl p-3 border border-orange-500/30 hover:border-orange-400/60 transition-all duration-500 group/macro">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500/30 to-orange-600/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover/macro:scale-110 transition-transform shadow-lg shadow-orange-500/20">
                <span className="text-sm font-black text-orange-300">K</span>
              </div>
              <div className="text-center">
                <div className="text-base font-black text-orange-400" data-testid={`text-carbs-${food.slug}`}>
                  {Number(food.carbs || 0).toFixed(1)}
                </div>
                <div className="text-xs text-slate-500 font-medium">gram</div>
              </div>
            </div>

            {/* Fat */}
            <div className="backdrop-blur-md bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-3 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 group/macro">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover/macro:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                <span className="text-sm font-black text-purple-300">Y</span>
              </div>
              <div className="text-center">
                <div className="text-base font-black text-purple-400" data-testid={`text-fat-${food.slug}`}>
                  {Number(food.fat || 0).toFixed(1)}
                </div>
                <div className="text-xs text-slate-500 font-medium">gram</div>
              </div>
            </div>
          </div>

          {/* Hover Indicator with Neon Arrow */}
          <div className="mt-6 flex items-center justify-center gap-2 text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <span className="text-sm font-bold">Detayları Gör</span>
            <svg 
              className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7l5 5m0 0l-5 5m5-5H6" 
              />
            </svg>
          </div>

          {/* Bottom Neon Accent Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>
      </div>
    </a>
  );
}
