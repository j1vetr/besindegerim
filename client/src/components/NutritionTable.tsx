import React from "react";
import { type Food, type MicronutrientsData } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Droplet, Heart, Shield, Sparkles, Zap } from "lucide-react";

interface NutritionTableProps {
  food: Food;
}

interface NutritionRow {
  name: string;
  amount: string;
  unit: string;
  category: "macro" | "vitamin" | "mineral";
  icon?: React.ReactNode;
  color?: string;
}

export function NutritionTable({ food }: NutritionTableProps) {
  // Build comprehensive nutrition rows
  const nutritionRows: NutritionRow[] = [];

  // MACRONUTRIENTS
  if (food.protein) {
    nutritionRows.push({
      name: "Protein",
      amount: Number(food.protein).toFixed(1),
      unit: "g",
      category: "macro",
      color: "teal",
    });
  }
  if (food.carbs) {
    nutritionRows.push({
      name: "Karbonhidrat",
      amount: Number(food.carbs).toFixed(1),
      unit: "g",
      category: "macro",
      color: "orange",
    });
  }
  if (food.fiber) {
    nutritionRows.push({
      name: "Lif",
      amount: Number(food.fiber).toFixed(1),
      unit: "g",
      category: "macro",
      color: "green",
    });
  }
  if (food.sugar) {
    nutritionRows.push({
      name: "Şeker",
      amount: Number(food.sugar).toFixed(1),
      unit: "g",
      category: "macro",
      color: "pink",
    });
  }
  if (food.addedSugar && Number(food.addedSugar) > 0) {
    nutritionRows.push({
      name: "Eklenmiş Şeker",
      amount: Number(food.addedSugar).toFixed(1),
      unit: "g",
      category: "macro",
      color: "rose",
    });
  }
  if (food.fat) {
    nutritionRows.push({
      name: "Yağ (Toplam)",
      amount: Number(food.fat).toFixed(1),
      unit: "g",
      category: "macro",
      color: "yellow",
    });
  }
  if (food.saturatedFat && Number(food.saturatedFat) > 0) {
    nutritionRows.push({
      name: "Doymuş Yağ",
      amount: Number(food.saturatedFat).toFixed(1),
      unit: "g",
      category: "macro",
      color: "amber",
    });
  }
  if (food.transFat && Number(food.transFat) > 0) {
    nutritionRows.push({
      name: "Trans Yağ",
      amount: Number(food.transFat).toFixed(1),
      unit: "g",
      category: "macro",
      color: "red",
    });
  }
  if (food.cholesterol && Number(food.cholesterol) > 0) {
    nutritionRows.push({
      name: "Kolesterol",
      amount: Number(food.cholesterol).toFixed(0),
      unit: "mg",
      category: "macro",
      color: "red",
    });
  }
  if (food.sodium && Number(food.sodium) > 0) {
    nutritionRows.push({
      name: "Sodyum",
      amount: Number(food.sodium).toFixed(0),
      unit: "mg",
      category: "mineral",
      color: "blue",
    });
  }
  if (food.potassium && Number(food.potassium) > 0) {
    nutritionRows.push({
      name: "Potasyum",
      amount: Number(food.potassium).toFixed(0),
      unit: "mg",
      category: "mineral",
      color: "purple",
    });
  }

  // MICRONUTRIENTS from JSON
  if (food.micronutrients) {
    const micros = food.micronutrients as MicronutrientsData;
    Object.entries(micros).forEach(([key, value]) => {
      const formatted = formatNutrientName(key);
      nutritionRows.push({
        name: formatted.name,
        amount: value.amount.toFixed(1),
        unit: value.unit,
        category: formatted.category,
        color: formatted.color,
      });
    });
  }

  // Group by category
  const macros = nutritionRows.filter((r) => r.category === "macro");
  const vitamins = nutritionRows.filter((r) => r.category === "vitamin");
  const minerals = nutritionRows.filter((r) => r.category === "mineral");

  return (
    <div className="space-y-8" data-testid="nutrition-table">
      {/* Macronutrients Section */}
      {macros.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">Makro Besinler</h3>
          </div>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {macros.map((row, index) => (
                  <div
                    key={row.name}
                    className={`p-6 border-b md:border-r ${
                      index % 2 === 1 ? "md:border-r-0" : ""
                    } ${
                      index >= macros.length - 2 ? "border-b-0" : ""
                    } hover:bg-emerald-50/50 transition-colors group`}
                    data-testid={`row-nutrient-${index}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getNutrientColorClass(row.color || "gray")} group-hover:scale-125 transition-transform`}></div>
                        <span className="text-gray-800 font-semibold">{row.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-gray-900">
                          {row.amount}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">{row.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vitamins Section */}
      {vitamins.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">Vitaminler</h3>
          </div>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                {vitamins.map((row, index) => (
                  <div
                    key={row.name}
                    className={`p-5 border-b sm:border-r ${
                      (index + 1) % 3 === 0 ? "lg:border-r-0" : ""
                    } ${
                      (index + 1) % 2 === 0 ? "sm:border-r-0 lg:border-r" : ""
                    } ${
                      index >= vitamins.length - 3 ? "border-b-0" : ""
                    } hover:bg-amber-50/50 transition-colors group`}
                    data-testid={`row-vitamin-${index}`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getNutrientColorClass(row.color || "gray")}`}></div>
                        <span className="text-sm font-semibold text-gray-700">{row.name}</span>
                      </div>
                      <div>
                        <span className="text-xl font-black text-gray-900">
                          {row.amount}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">{row.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Minerals Section */}
      {minerals.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">Mineraller</h3>
          </div>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                {minerals.map((row, index) => (
                  <div
                    key={row.name}
                    className={`p-5 border-b sm:border-r ${
                      (index + 1) % 3 === 0 ? "lg:border-r-0" : ""
                    } ${
                      (index + 1) % 2 === 0 ? "sm:border-r-0 lg:border-r" : ""
                    } ${
                      index >= minerals.length - 3 ? "border-b-0" : ""
                    } hover:bg-blue-50/50 transition-colors group`}
                    data-testid={`row-mineral-${index}`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getNutrientColorClass(row.color || "gray")}`}></div>
                        <span className="text-sm font-semibold text-gray-700">{row.name}</span>
                      </div>
                      <div>
                        <span className="text-xl font-black text-gray-900">
                          {row.amount}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">{row.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {macros.length === 0 && vitamins.length === 0 && minerals.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Droplet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Bu gıda için detaylı besin değerleri henüz mevcut değil.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper function to get static Tailwind color classes (avoids dynamic class generation)
function getNutrientColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    teal: "bg-teal-500",
    orange: "bg-orange-500",
    green: "bg-green-500",
    pink: "bg-pink-500",
    rose: "bg-rose-500",
    yellow: "bg-yellow-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    gray: "bg-gray-500",
    emerald: "bg-emerald-500",
    cyan: "bg-cyan-500",
    indigo: "bg-indigo-500",
    violet: "bg-violet-500",
    fuchsia: "bg-fuchsia-500",
    brown: "bg-amber-700",
  };
  return colorMap[color] || "bg-gray-500";
}

// Helper function to format nutrient names with category and color
function formatNutrientName(key: string): { name: string; category: "vitamin" | "mineral"; color: string } {
  const nameMap: Record<string, { name: string; category: "vitamin" | "mineral"; color: string }> = {
    // Vitamins
    vitamin_a: { name: "A Vitamini", category: "vitamin", color: "orange" },
    vitamin_c: { name: "C Vitamini", category: "vitamin", color: "yellow" },
    vitamin_d: { name: "D Vitamini", category: "vitamin", color: "amber" },
    vitamin_e: { name: "E Vitamini", category: "vitamin", color: "green" },
    vitamin_k: { name: "K Vitamini", category: "vitamin", color: "emerald" },
    vitamin_b6: { name: "B6 Vitamini", category: "vitamin", color: "blue" },
    vitamin_b12: { name: "B12 Vitamini", category: "vitamin", color: "indigo" },
    thiamin: { name: "Tiamin (B1)", category: "vitamin", color: "violet" },
    riboflavin: { name: "Riboflavin (B2)", category: "vitamin", color: "purple" },
    niacin: { name: "Niasin (B3)", category: "vitamin", color: "fuchsia" },
    folate: { name: "Folat", category: "vitamin", color: "pink" },
    folate_dfe: { name: "Folat DFE", category: "vitamin", color: "rose" },
    pantothenic_acid: { name: "Pantotenik Asit (B5)", category: "vitamin", color: "red" },
    choline: { name: "Kolin", category: "vitamin", color: "orange" },
    
    // Minerals
    calcium: { name: "Kalsiyum", category: "mineral", color: "blue" },
    iron: { name: "Demir", category: "mineral", color: "red" },
    magnesium: { name: "Magnezyum", category: "mineral", color: "green" },
    phosphorus: { name: "Fosfor", category: "mineral", color: "purple" },
    zinc: { name: "Çinko", category: "mineral", color: "gray" },
    copper: { name: "Bakır", category: "mineral", color: "amber" },
    manganese: { name: "Manganez", category: "mineral", color: "brown" },
    selenium: { name: "Selenyum", category: "mineral", color: "yellow" },
    fluoride: { name: "Florür", category: "mineral", color: "cyan" },
    iodine: { name: "İyot", category: "mineral", color: "indigo" },
  };

  return nameMap[key] || { 
    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "), 
    category: "mineral", 
    color: "gray" 
  };
}
