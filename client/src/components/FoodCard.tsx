import React from "react";
import { type Food } from "@shared/schema";
import { Card } from "@/components/ui/card";

interface FoodCardProps {
  food: Food;
  compact?: boolean;
}

export function FoodCard({ food, compact = false }: FoodCardProps) {
  const imageSize = compact ? "h-24 w-24" : "h-32 w-32 md:h-40 md:w-40";
  const href = `/${food.slug}`;

  return (
    <a
      href={href}
      className="block hover-elevate transition-shadow duration-200"
      data-testid={`link-food-${food.slug}`}
    >
      <Card className={`overflow-hidden ${compact ? 'p-3' : 'p-4'}`}>
        <div className={`flex ${compact ? 'gap-3' : 'flex-col gap-3'}`}>
          {/* Food Image */}
          <div className={`flex-shrink-0 ${compact ? '' : 'mx-auto'}`}>
            {food.imageUrl ? (
              <img
                src={food.imageUrl}
                alt={food.name}
                className={`${imageSize} rounded-lg object-cover`}
                loading="lazy"
                data-testid={`img-food-${food.slug}`}
              />
            ) : (
              <div
                className={`${imageSize} rounded-lg bg-accent/30 flex items-center justify-center`}
                data-testid={`placeholder-food-${food.slug}`}
              >
                <svg
                  className="w-12 h-12 text-accent-foreground/40"
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

          {/* Food Info */}
          <div className={`flex-1 ${compact ? '' : 'text-center'}`}>
            <h3
              className={`font-semibold text-foreground mb-1 ${compact ? 'text-sm' : 'text-base'}`}
              data-testid={`text-food-name-${food.slug}`}
            >
              {food.name}
            </h3>
            <p
              className="text-sm text-muted-foreground"
              data-testid={`text-calories-${food.slug}`}
            >
              <span className="font-medium text-primary">{food.calories}</span> kcal
              <span className="text-xs block mt-0.5">{food.servingLabel}</span>
            </p>
          </div>
        </div>
      </Card>
    </a>
  );
}
