import React from "react";
import { type Food, type MicronutrientsData } from "@shared/schema";

interface NutritionTableProps {
  food: Food;
}

interface NutritionRow {
  name: string;
  amount: string;
  unit: string;
}

export function NutritionTable({ food }: NutritionTableProps) {
  // Build nutrition rows (macros first, then micros)
  const nutritionRows: NutritionRow[] = [];

  // Macronutrients
  if (food.protein) {
    nutritionRows.push({
      name: "Protein",
      amount: Number(food.protein).toFixed(1),
      unit: "g",
    });
  }
  if (food.carbs) {
    nutritionRows.push({
      name: "Karbonhidrat",
      amount: Number(food.carbs).toFixed(1),
      unit: "g",
    });
  }
  if (food.fat) {
    nutritionRows.push({
      name: "Yağ",
      amount: Number(food.fat).toFixed(1),
      unit: "g",
    });
  }
  if (food.fiber) {
    nutritionRows.push({
      name: "Lif",
      amount: Number(food.fiber).toFixed(1),
      unit: "g",
    });
  }
  if (food.sugar) {
    nutritionRows.push({
      name: "Şeker",
      amount: Number(food.sugar).toFixed(1),
      unit: "g",
    });
  }

  // Micronutrients from JSON
  if (food.micronutrients) {
    const micros = food.micronutrients as MicronutrientsData;
    Object.entries(micros).forEach(([key, value]) => {
      nutritionRows.push({
        name: formatNutrientName(key),
        amount: value.amount.toFixed(1),
        unit: value.unit,
      });
    });
  }

  return (
    <div className="overflow-x-auto" data-testid="nutrition-table">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-border">
            <th className="text-left py-3 px-4 font-medium text-foreground">
              Besin
            </th>
            <th className="text-right py-3 px-4 font-medium text-foreground">
              Miktar
            </th>
            <th className="text-left py-3 px-4 font-medium text-foreground">
              Birim
            </th>
          </tr>
        </thead>
        <tbody>
          {nutritionRows.map((row, index) => (
            <tr
              key={row.name}
              className={index % 2 === 0 ? "bg-muted/30" : "bg-background"}
              data-testid={`row-nutrient-${index}`}
            >
              <td className="py-3 px-4 text-foreground">{row.name}</td>
              <td className="py-3 px-4 text-right font-medium text-foreground">
                {row.amount}
              </td>
              <td className="py-3 px-4 text-muted-foreground">{row.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Helper function to format nutrient names in Turkish
function formatNutrientName(key: string): string {
  const nameMap: Record<string, string> = {
    vitamin_c: "C Vitamini",
    vitamin_a: "A Vitamini",
    vitamin_d: "D Vitamini",
    vitamin_e: "E Vitamini",
    vitamin_k: "K Vitamini",
    vitamin_b6: "B6 Vitamini",
    vitamin_b12: "B12 Vitamini",
    thiamin: "Tiamin (B1)",
    riboflavin: "Riboflavin (B2)",
    niacin: "Niasin (B3)",
    folate: "Folat",
    calcium: "Kalsiyum",
    iron: "Demir",
    magnesium: "Magnezyum",
    phosphorus: "Fosfor",
    potassium: "Potasyum",
    sodium: "Sodyum",
    zinc: "Çinko",
    copper: "Bakır",
    manganese: "Manganez",
    selenium: "Selenyum",
  };

  return nameMap[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
}
