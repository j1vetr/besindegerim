import React from "react";
import { type Food, type MicronutrientsData } from "@shared/schema";

interface NutritionTableProps {
  food: Food;
}

interface NutritionRow {
  name: string;
  amount: string;
  unit: string;
  category: "macro" | "micro";
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
      category: "macro",
    });
  }
  if (food.carbs) {
    nutritionRows.push({
      name: "Karbonhidrat",
      amount: Number(food.carbs).toFixed(1),
      unit: "g",
      category: "macro",
    });
  }
  if (food.fat) {
    nutritionRows.push({
      name: "Yağ",
      amount: Number(food.fat).toFixed(1),
      unit: "g",
      category: "macro",
    });
  }
  if (food.fiber) {
    nutritionRows.push({
      name: "Lif",
      amount: Number(food.fiber).toFixed(1),
      unit: "g",
      category: "macro",
    });
  }
  if (food.sugar) {
    nutritionRows.push({
      name: "Şeker",
      amount: Number(food.sugar).toFixed(1),
      unit: "g",
      category: "macro",
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
        category: "micro",
      });
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl shadow-lg" data-testid="nutrition-table">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <th className="text-left py-4 px-6 font-semibold">
              Besin Değeri
            </th>
            <th className="text-right py-4 px-6 font-semibold">
              Miktar
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {nutritionRows.map((row, index) => (
            <tr
              key={row.name}
              className={`border-b border-gray-100 hover:bg-green-50 transition-colors ${
                index % 2 === 0 ? "bg-green-50/30" : "bg-white"
              }`}
              data-testid={`row-nutrient-${index}`}
            >
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  {/* Icon based on category */}
                  {row.category === "macro" && (
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {getNutrientIcon(row.name)}
                    </div>
                  )}
                  <span className="text-gray-800 font-medium">{row.name}</span>
                </div>
              </td>
              <td className="py-4 px-6 text-right">
                <span className="text-gray-900 font-semibold text-lg">
                  {row.amount}
                </span>
                <span className="text-gray-500 ml-1">{row.unit}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Helper function to get nutrient icons
function getNutrientIcon(nutrientName: string) {
  switch (nutrientName) {
    case "Protein":
      return (
        <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    case "Karbonhidrat":
      return (
        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "Yağ":
      return (
        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
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
