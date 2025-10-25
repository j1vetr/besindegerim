import React from "react";
import { type Food } from "@shared/schema";
import { Card } from "@/components/ui/card";

interface CalorieCardProps {
  food: Food;
}

export function CalorieCard({ food }: CalorieCardProps) {
  return (
    <Card
      className="border-2 border-primary p-6 shadow-md"
      data-testid="card-calories"
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">Porsiyon</p>
          <p className="text-base font-medium text-foreground" data-testid="text-serving">
            {food.servingLabel}
          </p>
          {food.servingSize && (
            <p className="text-xs text-muted-foreground mt-1" data-testid="text-serving-size">
              ({Number(food.servingSize).toFixed(0)} g)
            </p>
          )}
        </div>
        <div className="text-right">
          <p
            className="text-4xl md:text-5xl font-semibold text-foreground leading-none"
            data-testid="text-calorie-amount"
          >
            {Number(food.calories).toFixed(0)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">kcal</p>
        </div>
      </div>
    </Card>
  );
}
