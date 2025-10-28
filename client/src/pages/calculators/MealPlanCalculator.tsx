import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Coffee, Sun, Sunset, Moon, Clock, Utensils, Calendar, TrendingUp, Lightbulb, CheckCircle2 } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface MealPlanCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface Meal {
  name: string;
  time: string;
  calories: number;
  percentage: number;
  icon: typeof Coffee;
  color: string;
}

type Strategy = "equal" | "traditional" | "intermittent";

export default function MealPlanCalculator({ categoryGroups, currentPath }: MealPlanCalculatorProps) {
  const [calories, setCalories] = useState<number>(2000);
  const [mealCount, setMealCount] = useState<number>(4);
  const [strategy, setStrategy] = useState<Strategy>("traditional");
  const [meals, setMeals] = useState<Meal[]>([]);

  const strategies = [
    {
      id: "equal" as Strategy,
      name: "Eşit Dağılım",
      icon: "⚖️",
      desc: "Tüm öğünler eşit kalori",
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: "traditional" as Strategy,
      name: "Geleneksel",
      icon: "🍽️",
      desc: "Kahvaltı 25%, öğle 35%, akşam 30%, atıştırma 10%",
      color: "from-emerald-500 to-green-600"
    },
    {
      id: "intermittent" as Strategy,
      name: "Aralıklı Oruç",
      icon: "⏰",
      desc: "Kahvaltı atla, öğle ve akşam büyük",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const calculateMeals = () => {
    let distribution: Meal[] = [];

    if (strategy === "equal") {
      const caloriesPerMeal = Math.round(calories / mealCount);
      const percentage = Math.round(100 / mealCount);

      if (mealCount === 3) {
        distribution = [
          { name: "Kahvaltı", time: "07:00-09:00", calories: caloriesPerMeal, percentage, icon: Coffee, color: "from-orange-400 to-amber-500" },
          { name: "Öğle Yemeği", time: "12:00-14:00", calories: caloriesPerMeal, percentage, icon: Sun, color: "from-yellow-400 to-orange-500" },
          { name: "Akşam Yemeği", time: "18:00-20:00", calories: caloriesPerMeal, percentage, icon: Sunset, color: "from-purple-400 to-pink-500" }
        ];
      } else if (mealCount === 4) {
        distribution = [
          { name: "Kahvaltı", time: "07:00-09:00", calories: caloriesPerMeal, percentage, icon: Coffee, color: "from-orange-400 to-amber-500" },
          { name: "Öğle Yemeği", time: "12:00-14:00", calories: caloriesPerMeal, percentage, icon: Sun, color: "from-yellow-400 to-orange-500" },
          { name: "İkindi Atıştırması", time: "15:00-16:00", calories: caloriesPerMeal, percentage, icon: Utensils, color: "from-green-400 to-emerald-500" },
          { name: "Akşam Yemeği", time: "18:00-20:00", calories: caloriesPerMeal, percentage, icon: Sunset, color: "from-purple-400 to-pink-500" }
        ];
      } else if (mealCount === 5) {
        distribution = [
          { name: "Kahvaltı", time: "07:00-09:00", calories: caloriesPerMeal, percentage, icon: Coffee, color: "from-orange-400 to-amber-500" },
          { name: "Kuşluk Atıştırması", time: "10:00-11:00", calories: caloriesPerMeal, percentage, icon: Utensils, color: "from-lime-400 to-green-500" },
          { name: "Öğle Yemeği", time: "12:00-14:00", calories: caloriesPerMeal, percentage, icon: Sun, color: "from-yellow-400 to-orange-500" },
          { name: "İkindi Atıştırması", time: "15:00-16:00", calories: caloriesPerMeal, percentage, icon: Utensils, color: "from-green-400 to-emerald-500" },
          { name: "Akşam Yemeği", time: "18:00-20:00", calories: caloriesPerMeal, percentage, icon: Sunset, color: "from-purple-400 to-pink-500" }
        ];
      } else {
        distribution = [
          { name: "Kahvaltı", time: "07:00-09:00", calories: caloriesPerMeal, percentage, icon: Coffee, color: "from-orange-400 to-amber-500" },
          { name: "Kuşluk Atıştırması", time: "10:00-11:00", calories: caloriesPerMeal, percentage, icon: Utensils, color: "from-lime-400 to-green-500" },
          { name: "Öğle Yemeği", time: "12:00-14:00", calories: caloriesPerMeal, percentage, icon: Sun, color: "from-yellow-400 to-orange-500" },
          { name: "İkindi Atıştırması", time: "15:00-16:00", calories: caloriesPerMeal, percentage, icon: Utensils, color: "from-green-400 to-emerald-500" },
          { name: "Akşam Yemeği", time: "18:00-20:00", calories: caloriesPerMeal, percentage, icon: Sunset, color: "from-purple-400 to-pink-500" },
          { name: "Gece Atıştırması", time: "21:00-22:00", calories: caloriesPerMeal, percentage, icon: Moon, color: "from-indigo-400 to-purple-500" }
        ];
      }
    } else if (strategy === "traditional") {
      if (mealCount === 3) {
        distribution = [
          { name: "Kahvaltı", time: "07:00-09:00", calories: Math.round(calories * 0.30), percentage: 30, icon: Coffee, color: "from-orange-400 to-amber-500" },
          { name: "Öğle Yemeği", time: "12:00-14:00", calories: Math.round(calories * 0.40), percentage: 40, icon: Sun, color: "from-yellow-400 to-orange-500" },
          { name: "Akşam Yemeği", time: "18:00-20:00", calories: Math.round(calories * 0.30), percentage: 30, icon: Sunset, color: "from-purple-400 to-pink-500" }
        ];
      } else if (mealCount === 4) {
        distribution = [
          { name: "Kahvaltı", time: "07:00-09:00", calories: Math.round(calories * 0.25), percentage: 25, icon: Coffee, color: "from-orange-400 to-amber-500" },
          { name: "Öğle Yemeği", time: "12:00-14:00", calories: Math.round(calories * 0.35), percentage: 35, icon: Sun, color: "from-yellow-400 to-orange-500" },
          { name: "Atıştırma", time: "15:00-16:00", calories: Math.round(calories * 0.10), percentage: 10, icon: Utensils, color: "from-green-400 to-emerald-500" },
          { name: "Akşam Yemeği", time: "18:00-20:00", calories: Math.round(calories * 0.30), percentage: 30, icon: Sunset, color: "from-purple-400 to-pink-500" }
        ];
      } else if (mealCount === 5) {
        distribution = [
          { name: "Kahvaltı", time: "07:00-09:00", calories: Math.round(calories * 0.25), percentage: 25, icon: Coffee, color: "from-orange-400 to-amber-500" },
          { name: "Kuşluk", time: "10:00-11:00", calories: Math.round(calories * 0.08), percentage: 8, icon: Utensils, color: "from-lime-400 to-green-500" },
          { name: "Öğle Yemeği", time: "12:00-14:00", calories: Math.round(calories * 0.32), percentage: 32, icon: Sun, color: "from-yellow-400 to-orange-500" },
          { name: "İkindi", time: "15:00-16:00", calories: Math.round(calories * 0.07), percentage: 7, icon: Utensils, color: "from-green-400 to-emerald-500" },
          { name: "Akşam Yemeği", time: "18:00-20:00", calories: Math.round(calories * 0.28), percentage: 28, icon: Sunset, color: "from-purple-400 to-pink-500" }
        ];
      } else {
        distribution = [
          { name: "Kahvaltı", time: "07:00-09:00", calories: Math.round(calories * 0.22), percentage: 22, icon: Coffee, color: "from-orange-400 to-amber-500" },
          { name: "Kuşluk", time: "10:00-11:00", calories: Math.round(calories * 0.08), percentage: 8, icon: Utensils, color: "from-lime-400 to-green-500" },
          { name: "Öğle Yemeği", time: "12:00-14:00", calories: Math.round(calories * 0.28), percentage: 28, icon: Sun, color: "from-yellow-400 to-orange-500" },
          { name: "İkindi", time: "15:00-16:00", calories: Math.round(calories * 0.08), percentage: 8, icon: Utensils, color: "from-green-400 to-emerald-500" },
          { name: "Akşam Yemeği", time: "18:00-20:00", calories: Math.round(calories * 0.26), percentage: 26, icon: Sunset, color: "from-purple-400 to-pink-500" },
          { name: "Gece", time: "21:00-22:00", calories: Math.round(calories * 0.08), percentage: 8, icon: Moon, color: "from-indigo-400 to-purple-500" }
        ];
      }
    } else {
      if (mealCount === 3) {
        distribution = [
          { name: "Öğle Yemeği", time: "12:00-14:00", calories: Math.round(calories * 0.45), percentage: 45, icon: Sun, color: "from-yellow-400 to-orange-500" },
          { name: "Atıştırma", time: "16:00-17:00", calories: Math.round(calories * 0.15), percentage: 15, icon: Utensils, color: "from-green-400 to-emerald-500" },
          { name: "Akşam Yemeği", time: "18:00-20:00", calories: Math.round(calories * 0.40), percentage: 40, icon: Sunset, color: "from-purple-400 to-pink-500" }
        ];
      } else if (mealCount === 4) {
        distribution = [
          { name: "Öğle Yemeği", time: "12:00-14:00", calories: Math.round(calories * 0.40), percentage: 40, icon: Sun, color: "from-yellow-400 to-orange-500" },
          { name: "İkindi Atıştırması", time: "15:00-16:00", calories: Math.round(calories * 0.15), percentage: 15, icon: Utensils, color: "from-green-400 to-emerald-500" },
          { name: "Akşam Yemeği", time: "18:00-20:00", calories: Math.round(calories * 0.35), percentage: 35, icon: Sunset, color: "from-purple-400 to-pink-500" },
          { name: "Gece Atıştırması", time: "21:00-22:00", calories: Math.round(calories * 0.10), percentage: 10, icon: Moon, color: "from-indigo-400 to-purple-500" }
        ];
      } else if (mealCount === 5) {
        distribution = [
          { name: "Öğle Yemeği", time: "12:00-14:00", calories: Math.round(calories * 0.35), percentage: 35, icon: Sun, color: "from-yellow-400 to-orange-500" },
          { name: "İkindi Atıştırması", time: "15:00-16:00", calories: Math.round(calories * 0.12), percentage: 12, icon: Utensils, color: "from-green-400 to-emerald-500" },
          { name: "Akşam Yemeği", time: "18:00-20:00", calories: Math.round(calories * 0.30), percentage: 30, icon: Sunset, color: "from-purple-400 to-pink-500" },
          { name: "Gece Atıştırması 1", time: "21:00-21:30", calories: Math.round(calories * 0.12), percentage: 12, icon: Moon, color: "from-indigo-400 to-purple-500" },
          { name: "Gece Atıştırması 2", time: "22:00-22:30", calories: Math.round(calories * 0.11), percentage: 11, icon: Moon, color: "from-violet-400 to-indigo-500" }
        ];
      } else {
        distribution = [
          { name: "Öğle Yemeği", time: "12:00-14:00", calories: Math.round(calories * 0.30), percentage: 30, icon: Sun, color: "from-yellow-400 to-orange-500" },
          { name: "İkindi Atıştırması 1", time: "15:00-15:30", calories: Math.round(calories * 0.10), percentage: 10, icon: Utensils, color: "from-green-400 to-emerald-500" },
          { name: "İkindi Atıştırması 2", time: "16:00-16:30", calories: Math.round(calories * 0.10), percentage: 10, icon: Utensils, color: "from-teal-400 to-cyan-500" },
          { name: "Akşam Yemeği", time: "18:00-20:00", calories: Math.round(calories * 0.28), percentage: 28, icon: Sunset, color: "from-purple-400 to-pink-500" },
          { name: "Gece Atıştırması 1", time: "21:00-21:30", calories: Math.round(calories * 0.12), percentage: 12, icon: Moon, color: "from-indigo-400 to-purple-500" },
          { name: "Gece Atıştırması 2", time: "22:00-22:30", calories: Math.round(calories * 0.10), percentage: 10, icon: Moon, color: "from-violet-400 to-indigo-500" }
        ];
      }
    }

    setMeals(distribution);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400 to-green-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-400 to-teal-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-emerald-400 hover:text-emerald-300 font-medium text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full inline-block border border-emerald-500/30" data-testid="link-back-calculators">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full px-6 py-3 mb-6 shadow-2xl shadow-emerald-500/50 border border-emerald-400/30">
              <Calendar className="w-6 h-6 animate-pulse" />
              <span className="font-bold">Akıllı Öğün Planlama</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400 bg-clip-text text-transparent drop-shadow-2xl">
              Öğün Planı Hesaplayıcı
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Günlük kalorinizi ideal öğün zamanlamasıyla dağıtın - Hedeflerinize özel beslenme stratejisi
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Calculator Form */}
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl shadow-lg shadow-emerald-500/50">
                  <Utensils className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Öğün Ayarlarınız</h2>
              </div>

              <div className="space-y-8">
                {/* Calories Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      Günlük Kalori Hedefi
                    </label>
                    <span className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                      {calories}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1200"
                    max="4000"
                    step="50"
                    value={calories}
                    onChange={(e) => setCalories(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-emerald-400 [&::-webkit-slider-thumb]:to-green-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-emerald-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                    data-testid="slider-calories"
                  />
                  <div className="flex justify-between text-xs text-gray-400 px-1">
                    <span>1200 kcal</span>
                    <span>4000 kcal</span>
                  </div>
                </div>

                {/* Meal Count */}
                <div className="space-y-4">
                  <label className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-400" />
                    Öğün Sayısı
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[3, 4, 5, 6].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setMealCount(count)}
                        className={`p-4 rounded-xl font-bold text-2xl transition-all duration-300 ${
                          mealCount === count
                            ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-2xl shadow-emerald-500/50 scale-110"
                            : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                        }`}
                        data-testid={`button-meals-${count}`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Strategy Selection */}
                <div className="space-y-4">
                  <label className="text-lg font-bold text-white flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Dağıtım Stratejisi
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {strategies.map((strat) => (
                      <button
                        key={strat.id}
                        type="button"
                        onClick={() => setStrategy(strat.id)}
                        className={`p-4 rounded-xl text-left transition-all duration-300 ${
                          strategy === strat.id
                            ? `bg-gradient-to-br ${strat.color} text-white shadow-2xl shadow-emerald-500/50 scale-105`
                            : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                        }`}
                        data-testid={`button-strategy-${strat.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{strat.icon}</span>
                          <div className="flex-1">
                            <div className="font-bold text-lg">{strat.name}</div>
                            <div className="text-xs opacity-75 mt-1">{strat.desc}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={calculateMeals}
                  className="w-full h-16 text-xl font-black bg-gradient-to-r from-emerald-500 via-green-600 to-teal-500 hover:from-emerald-600 hover:via-green-700 hover:to-teal-600 shadow-2xl shadow-emerald-500/50 rounded-2xl border-2 border-emerald-400/50 hover:scale-105 transition-all duration-300"
                  data-testid="button-calculate"
                >
                  <Calendar className="w-6 h-6 mr-2 animate-pulse" />
                  Öğün Planımı Oluştur
                </Button>
              </div>
            </div>

            {/* Results */}
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl shadow-lg shadow-emerald-500/50">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Öğün Planınız</h2>
              </div>

              {meals.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="w-20 h-20 text-emerald-400/30 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    Öğün planınızı görmek için yukarıdaki bilgileri doldurup hesaplayın
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Timeline */}
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400/50 via-green-500/50 to-emerald-400/50 rounded-full"></div>
                    
                    {/* Meal cards */}
                    <div className="space-y-6">
                      {meals.map((meal, index) => {
                        const Icon = meal.icon;
                        return (
                          <div key={index} className="relative flex gap-4 items-start" data-testid={`meal-card-${index}`}>
                            {/* Timeline dot */}
                            <div className={`relative z-10 p-3 bg-gradient-to-br ${meal.color} rounded-2xl shadow-lg shadow-emerald-500/30`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Card */}
                            <div className="flex-1 backdrop-blur-xl bg-white/5 rounded-2xl p-5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="text-xl font-bold text-white">{meal.name}</h3>
                                  <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                                    <Clock className="w-3 h-3" />
                                    {meal.time}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                                    {meal.calories}
                                  </div>
                                  <div className="text-xs text-gray-400">kalori</div>
                                </div>
                              </div>

                              {/* Percentage bar */}
                              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${meal.color} rounded-full transition-all duration-1000`}
                                  style={{ width: `${meal.percentage}%` }}
                                ></div>
                              </div>
                              <div className="text-right mt-1">
                                <span className="text-xs font-bold text-emerald-400">{meal.percentage}% günlük kalori</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mt-8 p-6 backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-2xl border-2 border-emerald-400/30">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      Özet
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Toplam Kalori</p>
                        <p className="text-2xl font-black text-emerald-400">{calories} kcal</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Öğün Sayısı</p>
                        <p className="text-2xl font-black text-green-400">{mealCount} öğün</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SEO Content */}
          <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-8 md:p-12 space-y-8 mb-16">
            <div>
              <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                Öğün Zamanlaması ve Sıklığının Önemi
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Öğün planlaması, sadece ne yediğiniz kadar, ne zaman yediğinizle de ilgilidir. Bilimsel araştırmalar, öğün zamanlaması ve sıklığının metabolizma, enerji seviyeleri, kilo kontrolü ve genel sağlık üzerinde önemli etkileri olduğunu göstermektedir. Doğru öğün planı oluşturmak, vücudunuzu optimal performans için hazırlar ve beslenme hedeflerinize ulaşmanızı kolaylaştırır.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Geleneksel üç öğün yaklaşımından, günde altı küçük öğüne veya aralıklı oruç gibi modern stratejilere kadar birçok seçenek bulunmaktadır. Her bir yaklaşımın kendine özgü avantajları vardır ve doğru seçim, yaşam tarzınıza, aktivite seviyenize ve sağlık hedeflerinize bağlıdır. Bu rehberde, farklı öğün stratejilerini, bunların etkilerini ve sizin için en uygun planı nasıl oluşturacağınızı keşfedeceksiniz.
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <Coffee className="w-8 h-8 text-emerald-400" />
                Kahvaltının Kritik Rolü
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                "Günün en önemli öğünü" olarak bilinen kahvaltı, vücudunuzu uzun bir gece açlığından sonra yeniden enerjilendiren ilk öğündür. Kaliteli bir kahvaltı, metabolizmanızı hızlandırır, kan şekeri seviyenizi dengeler ve gün boyu sürecek enerji sağlar. Araştırmalar, düzenli kahvaltı yapan kişilerin daha iyi konsantrasyon gösterdiğini, öğle yemeğinde daha az yeme eğiliminde olduklarını ve kilo kontrolünde daha başarılı olduklarını göstermektedir.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                İdeal bir kahvaltı, kompleks karbonhidratlar, kaliteli protein ve sağlıklı yağları içermelidir. Yulaf ezmesi, tam tahıllı ekmek, yumurta, süt ürünleri, meyveler ve fındık gibi besinler mükemmel seçeneklerdir. Günlük kalorinizin %25-30'unu kahvaltıda tüketmek, dengeli bir başlangıç sağlar. Örneğin, 2000 kalorili bir diyette, kahvaltının 500-600 kalori arasında olması ideal kabul edilir.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Kahvaltı zamanlaması da önemlidir. Uyanmadan sonraki ilk 1-2 saat içinde kahvaltı yapmak, metabolizmayı başlatmak ve enerji seviyelerini optimize etmek için ideal zamandır. Sabah 7:00-9:00 arası en yaygın kahvaltı saatleridir, ancak bu sizin uyku düzeninize göre ayarlanabilir. Önemli olan, vücudunuza düzenli bir ritim kazandırmaktır.
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <Sun className="w-8 h-8 text-yellow-400" />
                Öğün Sıklığı: 3 mü 6 mı?
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Günde kaç öğün yenmesi gerektiği konusu, beslenme dünyasında en çok tartışılan konulardan biridir. Geleneksel yaklaşım günde üç ana öğün önerirken, bazı uzmanlar daha sık ama küçük öğünlerin metabolizmayı hızlandırdığını savunur. Gerçek şu ki, her iki yaklaşımın da bilimsel dayanakları vardır ve doğru seçim kişiye özeldir.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                <strong className="text-emerald-400">Üç Öğün Yaklaşımı:</strong> Günde üç ana öğün (kahvaltı, öğle, akşam) tüketen kişiler genellikle daha basit bir beslenme rutinine sahiptir. Bu yaklaşım, vücudun öğünler arasında yağ yakmasına izin verir ve kan şekeri seviyelerinde daha az dalgalanma yaratabilir. Özellikle meşgul yaşam tarzına sahip kişiler için pratiktir. Her öğün, günlük kalorinizin yaklaşık %30-35'ini içermelidir.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                <strong className="text-green-400">Altı Küçük Öğün:</strong> Günde 5-6 küçük öğün tüketen kişiler, metabolizmalarını sürekli aktif tutmayı hedefler. Bu strateji, açlık hissini minimize eder ve kan şekeri seviyelerini stabil tutar. Özellikle sporcular ve kas kütlesi artırmak isteyenler için idealdir. Her öğün, günlük kalorinizin %15-20'sini içermelidir. Ancak bu yaklaşım daha fazla planlama ve disiplin gerektirir.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Hangi yaklaşımı seçerseniz seçin, tutarlılık anahtardır. Vücudunuz düzenli beslenme zamanlarına alıştığında, metabolizmanız optimize olur ve enerji seviyeleri stabilleşir. Deneyerek sizin için en iyi çalışan öğün sıklığını bulmanız önemlidir.
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <Clock className="w-8 h-8 text-purple-400" />
                Aralıklı Oruç (Intermittent Fasting)
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Aralıklı oruç, son yıllarda büyük popülerlik kazanan bir beslenme stratejisidir. Bu yaklaşım, belirli saatlerde yemek yemek ve belirli saatlerde oruç tutmayı içerir. En popüler yöntem 16:8'dir - günün 16 saatinde oruç, 8 saatlik pencerede yemek yeme. Örneğin, öğle 12:00'de ilk öğününüzü tüketir ve akşam 20:00'ye kadar yeme pencerenizi tamamlarsınız.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Aralıklı oruç birçok sağlık fayda sağlayabilir: yağ yakımını artırır, insülin duyarlılığını iyileştirir, hücresel onarımı teşvik eder (otofaji) ve yaşlanma karşıtı etkiler gösterebilir. Ancak herkes için uygun değildir. Hamileler, emziren anneler, diyabeti olanlar ve yeme bozuklukları geçmişi olanlar dikkatli olmalıdır.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Aralıklı oruç uygularken, yeme pencerenizdeki öğünlerin kalitesi kritiktir. İlk öğününüz (öğle yemeği) günlük kalorinizin %40-45'ini içermeli ve protein, kompleks karbonhidrat ve sağlıklı yağlar açısından zengin olmalıdır. Akşam yemeği %35-40, ara atıştırmalar ise %15-20 arasında kalmalıdır. Bol su içmek, özellikle oruç döneminde, çok önemlidir.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Bu yönteme yeni başlıyorsanız, yavaş başlayın. İlk hafta 12:12 (12 saat oruç, 12 saat yeme) ile başlayıp, vücudunuz alıştıkça 16:8'e geçebilirsiniz. Bazı kişiler için 14:10 da mükemmel bir denge noktasıdır. Kendinizi dinleyin ve ihtiyaçlarınıza göre ayarlayın.
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <Utensils className="w-8 h-8 text-teal-400" />
                Öğün Hazırlığı (Meal Prep) Stratejileri
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Başarılı bir öğün planı oluşturmanın sırrı, hazırlıktır. Meal prep (öğün hazırlığı), haftanın belirli günlerinde birden fazla öğünü önceden hazırlama pratiğidir. Bu yaklaşım, zamandan tasarruf sağlar, sağlıklı seçimler yapmanızı kolaylaştırır ve ani kararlarla sağlıksız yiyeceklere yönelme riskini azaltır.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                <strong className="text-teal-400">Temel Meal Prep İpuçları:</strong> Pazar günleri 2-3 saat ayırarak haftanın tüm öğünlerini hazırlayabilirsiniz. Protein kaynaklarını (tavuk, balık, et, baklagiller) pişirin ve porsiyonlayın. Sebzeleri doğrayın ve saklayın. Karmaşık karbonhidratları (kinoa, esmer pirinç, patates) hazırlayın. Her şeyi cam veya BPA içermeyen plastik kaplarda saklayın. Buzdolabında 3-4 gün, dondurucuda 2-3 ay dayanır.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Kalori kontrolü için porsiyon boyutlarına dikkat edin. Dijital mutfak terazisi kullanarak her öğünü tartın. Örneğin, 400 kalorili bir öğün: 150g tavuk göğsü (165 kcal), 200g esmer pirinç (215 kcal), 100g brokoli (35 kcal) içerebilir. Çeşitlilik sağlamak için her hafta farklı protein ve sebze kombinasyonları deneyin.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Atıştırmalıkları da önceden hazırlayın. Ceviz, badem, hurma, protein barları gibi sağlıklı atıştırmalıkları küçük kaplarda porsiyonlayın. Bu şekilde aç kaldığınızda sağlıklı seçeneklere kolayca erişebilirsiniz. Meal prep, özellikle meşgul çalışma hayatı olan kişiler için oyun değiştiricidir.
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-orange-400" />
                Hedeflerinize Göre Öğün Dağılımı
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Öğün dağılımınız, fitness ve sağlık hedeflerinize göre şekillenmelidir. Kilo vermek, kas yapmak veya performans artırmak isteyenler için farklı stratejiler vardır.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                <strong className="text-orange-400">Kilo Verme:</strong> Kalori açığı oluşturmanız gerekir, ancak öğün zamanlaması hala önemlidir. Kahvaltınızı zengin protein ve lifle başlatın - bu açlığı kontrol eder. Öğle yemeğini en büyük öğününüz yapın (%35-40 kalori). Akşam yemeğini erken saatte ve daha hafif tutun (%25-30). Gece atıştırmalarından kaçının. 2000 kalorinin altında bir hedef için 3-4 öğün ideal olabilir.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                <strong className="text-purple-400">Kas Yapma:</strong> Kalori fazlası gereklidir ve öğün sıklığı önemlidir. Günde 5-6 öğün yiyerek protein sentezini sürekli aktif tutun. Her öğünde 25-40g protein hedefleyin. Antrenman öncesi (2-3 saat önce) karbonhidrat ağırlıklı öğün, antrenman sonrası (30 dakika içinde) protein ve karbonhidrat kombinasyonu önemlidir. Toplam kalori fazlası günlük +300-500 kalori olmalı.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                <strong className="text-green-400">Performans Artırma:</strong> Enerji seviyelerini stabil tutmak için düzenli öğünler kritiktir. Antrenman günlerinde karbonhidratları artırın, dinlenme günlerinde azaltın. Yarışma öncesi son 3 saatte hafif, sindirimi kolay öğün tercih edin. Uzun mesafe koşucuları ve dayanıklılık sporcuları daha sık atıştırmadan fayda görür. Hidrasyonu ihmal etmeyin - öğünlerle birlikte bol su için.
              </p>
            </div>

            <div className="p-6 backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-2xl border-2 border-emerald-400/30">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                Sonuç ve Öneriler
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Mükemmel öğün planı, bireyseldir. Yaşam tarzınız, aktivite seviyeniz, metabolizmanız ve hedefleriniz benzersizdir. Bu hesaplayıcıyı kullanarak farklı stratejileri deneyin. 2-4 hafta bir yöntemi tutarlı şekilde uygulayın ve vücudunuzun tepkilerini gözlemleyin. Enerji seviyeleri, uyku kalitesi, kilo değişiklikleri ve genel sağlık hissinizi not edin. Gerekirse ayarlamalar yapın. Unutmayın, en iyi plan, sürdürebileceğiniz plandır. Sabırlı olun ve kendinize karşı nazik olun - beslenme yolculuğu bir maraton, sprint değil.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
