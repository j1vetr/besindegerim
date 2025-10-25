import React from "react";
import { type Food } from "@shared/schema";
import { Card } from "@/components/ui/card";

interface CalorieCardProps {
  food: Food;
}

export function CalorieCard({ food }: CalorieCardProps) {
  return (
    <Card
      className="relative overflow-hidden p-8 md:p-10 shadow-xl bg-gradient-to-br from-white to-green-50/30"
      data-testid="card-calories"
    >
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-100/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-100/50 rounded-full blur-2xl"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-8">
        {/* Icon */}
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1 font-medium uppercase tracking-wide">Porsiyon</p>
          <p className="text-lg md:text-xl font-semibold text-foreground" data-testid="text-serving">
            {food.servingLabel}
          </p>
          {food.servingSize && (
            <p className="text-sm text-muted-foreground mt-1" data-testid="text-serving-size">
              ({Number(food.servingSize).toFixed(0)} gram)
            </p>
          )}
        </div>

        {/* Calorie Display */}
        <div className="text-right">
          <p
            className="text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#22c55e] to-[#16a34a] leading-none"
            data-testid="text-calorie-amount"
          >
            {Number(food.calories).toFixed(0)}
          </p>
          <p className="text-lg md:text-2xl text-muted-foreground mt-2 font-medium">kalori</p>
        </div>
      </div>
    </Card>
  );
}
