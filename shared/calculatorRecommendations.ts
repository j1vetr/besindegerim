import type { Food } from "./schema";

export interface CalculatorRecommendation {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  reason: string;
}

/**
 * Get calculator recommendations based on food nutritional values
 * Returns 2 most relevant calculators for the food
 */
export function getCalculatorRecommendations(food: Food): CalculatorRecommendation[] {
  const calories = Number(food.calories || 0);
  const protein = Number(food.protein || 0);
  const carbs = Number(food.carbs || 0);
  const fat = Number(food.fat || 0);
  const category = food.category?.toLowerCase() || '';
  
  const recommendations: CalculatorRecommendation[] = [];

  // High protein foods (>15g) → Protein Requirement + Daily Calorie
  if (protein > 15) {
    recommendations.push({
      id: "protein-gereksinimi",
      title: "Protein Gereksinimi",
      description: "Günlük protein ihtiyacınızı hesaplayın",
      icon: "🥩",
      color: "from-red-500 to-orange-600",
      reason: `${food.name} yüksek protein içeriyor (${protein.toFixed(1)}g)`
    });
    recommendations.push({
      id: "gunluk-kalori-ihtiyaci",
      title: "Günlük Kalori İhtiyacı",
      description: "TDEE ve makro ihtiyacınızı öğrenin",
      icon: "🔥",
      color: "from-green-500 to-emerald-600",
      reason: "Makro dengenizi optimize edin"
    });
    return recommendations;
  }

  // High calorie foods (>300 kcal) → Weight Loss Time + BMI
  if (calories > 300) {
    recommendations.push({
      id: "kilo-verme-suresi",
      title: "Kilo Verme/Alma Süresi",
      description: "Hedef kilonuza ulaşma sürenizi hesaplayın",
      icon: "📈",
      color: "from-amber-500 to-orange-600",
      reason: `${food.name} yüksek kalorili (${calories.toFixed(0)} kcal)`
    });
    recommendations.push({
      id: "bmi",
      title: "BMI Hesaplayıcı",
      description: "Sağlıklı kilo aralığınızı öğrenin",
      icon: "⚖️",
      color: "from-blue-500 to-cyan-600",
      reason: "Kilo hedeflerinizi belirleyin"
    });
    return recommendations;
  }

  // Low calorie foods (<100 kcal) → Ideal Weight + Water Intake
  if (calories < 100) {
    recommendations.push({
      id: "ideal-kilo",
      title: "İdeal Kilo Hesaplayıcı",
      description: "Boyunuza göre ideal kilonuzu hesaplayın",
      icon: "💚",
      color: "from-pink-500 to-rose-600",
      reason: `${food.name} düşük kalorili, sağlıklı seçim`
    });
    recommendations.push({
      id: "gunluk-su-ihtiyaci",
      title: "Günlük Su İhtiyacı",
      description: "Günlük su ihtiyacınızı hesaplayın",
      icon: "💧",
      color: "from-sky-500 to-blue-600",
      reason: "Hidrasyon dengenizi koruyun"
    });
    return recommendations;
  }

  // High carb foods (>40g) → Macro Calculator + Daily Calorie
  if (carbs > 40) {
    recommendations.push({
      id: "makro-hesaplayici",
      title: "Makro Dağılımı",
      description: "Optimal makro oranlarınızı hesaplayın",
      icon: "🍽️",
      color: "from-teal-500 to-cyan-600",
      reason: `${food.name} yüksek karbonhidrat içeriyor`
    });
    recommendations.push({
      id: "gunluk-kalori-ihtiyaci",
      title: "Günlük Kalori İhtiyacı",
      description: "TDEE ve makro ihtiyacınızı öğrenin",
      icon: "🔥",
      color: "from-green-500 to-emerald-600",
      reason: "Dengeli beslenme için"
    });
    return recommendations;
  }

  // Category-based recommendations
  if (category.includes('et') || category.includes('tavuk') || category.includes('balık')) {
    recommendations.push({
      id: "protein-gereksinimi",
      title: "Protein Gereksinimi",
      description: "Günlük protein ihtiyacınızı hesaplayın",
      icon: "🥩",
      color: "from-red-500 to-orange-600",
      reason: "Protein kaynağı tüketiyorsunuz"
    });
    recommendations.push({
      id: "gunluk-kalori-ihtiyaci",
      title: "Günlük Kalori İhtiyacı",
      description: "TDEE ve makro ihtiyacınızı öğrenin",
      icon: "🔥",
      color: "from-green-500 to-emerald-600",
      reason: "Makro dengenizi optimize edin"
    });
    return recommendations;
  }

  if (category.includes('süt') || category.includes('yoğurt') || category.includes('peynir')) {
    recommendations.push({
      id: "vitamin-mineral",
      title: "Vitamin & Mineral İhtiyacı",
      description: "Günlük vitamin/mineral RDA değerlerini öğrenin",
      icon: "💊",
      color: "from-purple-500 to-pink-600",
      reason: "Kalsiyum ve vitamin D kaynağı"
    });
    recommendations.push({
      id: "ideal-kilo",
      title: "İdeal Kilo Hesaplayıcı",
      description: "Boyunuza göre ideal kilonuzu hesaplayın",
      icon: "💚",
      color: "from-pink-500 to-rose-600",
      reason: "Sağlıklı beslenme hedefi için"
    });
    return recommendations;
  }

  if (category.includes('meyve') || category.includes('sebze')) {
    recommendations.push({
      id: "gunluk-su-ihtiyaci",
      title: "Günlük Su İhtiyacı",
      description: "Günlük su ihtiyacınızı hesaplayın",
      icon: "💧",
      color: "from-sky-500 to-blue-600",
      reason: "Su içeriği yüksek besinler"
    });
    recommendations.push({
      id: "vitamin-mineral",
      title: "Vitamin & Mineral İhtiyacı",
      description: "Günlük vitamin/mineral RDA değerlerini öğrenin",
      icon: "💊",
      color: "from-purple-500 to-pink-600",
      reason: "Vitamin ve mineral kaynağı"
    });
    return recommendations;
  }

  // Default recommendations for other foods
  recommendations.push({
    id: "gunluk-kalori-ihtiyaci",
    title: "Günlük Kalori İhtiyacı",
    description: "TDEE ve makro ihtiyacınızı öğrenin",
    icon: "🔥",
    color: "from-green-500 to-emerald-600",
    reason: "Günlük kalori dengenizi öğrenin"
  });
  recommendations.push({
    id: "porsiyon-cevirici",
    title: "Porsiyon Çevirici",
    description: "Gramajı porsiyona, porsiyonu kaşık/bardağa çevirin",
    icon: "📊",
    color: "from-purple-500 to-pink-600",
    reason: "Porsiyon kontrolü için ideal"
  });

  return recommendations;
}
