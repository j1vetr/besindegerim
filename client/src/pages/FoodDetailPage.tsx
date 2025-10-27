import React from "react";
import { type Food, type CategoryGroup } from "@shared/schema";
import { CalorieCard } from "@/components/CalorieCard";
import { NutritionTable } from "@/components/NutritionTable";
import { FoodCard } from "@/components/FoodCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Heart, Zap, Activity, Shield, Flame } from "lucide-react";

interface FoodDetailPageProps {
  food: Food;
  alternatives: Food[];
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

export function FoodDetailPage({ food, alternatives, categoryGroups, currentPath }: FoodDetailPageProps) {
  // Ensure absolute path for image
  const imageUrl = food.imageUrl 
    ? (food.imageUrl.startsWith('/') ? food.imageUrl : `/${food.imageUrl}`)
    : null;

  // Calculate macro percentages for visual bars
  const totalMacros = Number(food.protein || 0) + Number(food.carbs || 0) + Number(food.fat || 0);
  const proteinPercent = totalMacros > 0 ? (Number(food.protein || 0) / totalMacros) * 100 : 0;
  const carbsPercent = totalMacros > 0 ? (Number(food.carbs || 0) / totalMacros) * 100 : 0;
  const fatPercent = totalMacros > 0 ? (Number(food.fat || 0) / totalMacros) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      <main className="flex-1">
        {/* Hero Section - Stunning Visual with Image */}
        <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-[#22c55e] via-[#16a34a] to-[#15803d]">
          {/* Background Image with Overlay */}
          {imageUrl && (
            <div className="absolute inset-0 hidden md:block">
              <img
                src={imageUrl}
                alt={food.name}
                className="w-full h-full object-cover opacity-20"
                data-testid="img-food-detail-bg"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/90 via-[#16a34a]/95 to-[#15803d]/90"></div>
            </div>
          )}

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left: Food Image Card */}
              <div className="order-2 lg:order-1">
                {imageUrl ? (
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl group border-4 border-white/30 backdrop-blur-sm">
                    <img
                      src={imageUrl}
                      alt={food.name}
                      className="w-full h-[400px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                      data-testid="img-food-detail"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    {/* Calorie Badge */}
                    <div className="absolute bottom-6 right-6 backdrop-blur-xl bg-white/95 rounded-2xl px-6 py-4 border border-white/40 shadow-2xl">
                      <div className="flex items-center gap-3">
                        <Flame className="w-8 h-8 text-orange-500" />
                        <div>
                          <div className="text-3xl font-black text-gray-900">{Number(food.calories).toFixed(0)}</div>
                          <div className="text-sm font-semibold text-gray-600">kalori</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-[400px] md:h-[500px] rounded-3xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl border-4 border-white/30">
                    <Flame className="w-32 h-32 text-white/50" />
                  </div>
                )}
              </div>

              {/* Right: Food Info */}
              <div className="order-1 lg:order-2 text-center lg:text-left">
                <div className="inline-block mb-3 md:mb-4 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                  <span className="text-white font-semibold text-sm">{food.category}</span>
                </div>
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 md:mb-6 leading-tight drop-shadow-2xl"
                  data-testid="text-food-name"
                >
                  {food.name}
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-6 md:mb-8 font-medium">
                  {food.servingLabel}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                  <div className="backdrop-blur-md bg-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/20">
                    <div className="text-2xl md:text-3xl font-black text-white">{Number(food.protein || 0).toFixed(1)}<span className="text-lg md:text-xl">g</span></div>
                    <div className="text-xs md:text-sm text-white/80 font-semibold mt-1">Protein</div>
                  </div>
                  <div className="backdrop-blur-md bg-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/20">
                    <div className="text-2xl md:text-3xl font-black text-white">{Number(food.carbs || 0).toFixed(1)}<span className="text-lg md:text-xl">g</span></div>
                    <div className="text-xs md:text-sm text-white/80 font-semibold mt-1">Karb.</div>
                  </div>
                  <div className="backdrop-blur-md bg-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/20">
                    <div className="text-2xl md:text-3xl font-black text-white">{Number(food.fat || 0).toFixed(1)}<span className="text-lg md:text-xl">g</span></div>
                    <div className="text-xs md:text-sm text-white/80 font-semibold mt-1">Yağ</div>
                  </div>
                </div>

                {/* Macro Breakdown Bar */}
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
                  <div className="text-white/90 text-sm font-semibold mb-3">Makro Dağılım</div>
                  <div className="flex h-4 rounded-full overflow-hidden bg-white/20">
                    <div
                      className="bg-gradient-to-r from-teal-400 to-teal-500"
                      style={{ width: `${proteinPercent}%` }}
                      title={`Protein: ${proteinPercent.toFixed(0)}%`}
                    ></div>
                    <div
                      className="bg-gradient-to-r from-orange-400 to-orange-500"
                      style={{ width: `${carbsPercent}%` }}
                      title={`Karbonhidrat: ${carbsPercent.toFixed(0)}%`}
                    ></div>
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500"
                      style={{ width: `${fatPercent}%` }}
                      title={`Yağ: ${fatPercent.toFixed(0)}%`}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-white/70 font-medium">
                    <span>🥩 {proteinPercent.toFixed(0)}%</span>
                    <span>🌾 {carbsPercent.toFixed(0)}%</span>
                    <span>🧈 {fatPercent.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Nutrition Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-white via-emerald-50/30 to-white">
          <div className="max-w-7xl mx-auto">
            {/* Quick Answer Box - Featured Snippet Optimized */}
            <div className="mb-16 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4" data-testid="heading-quick-answer">
                  {food.name} Kaç Kalori?
                </h2>
                <div className="flex items-baseline gap-3 mb-6">
                  <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent" data-testid="text-quick-answer-calories">
                    {Number(food.calories).toFixed(0)}
                  </div>
                  <div className="text-2xl font-bold text-gray-600">kalori</div>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed" data-testid="text-quick-answer-description">
                  <strong>{food.name}</strong>, {food.servingLabel} başına <strong>{Number(food.calories).toFixed(0)} kalori</strong> içerir. 
                  Bu değer gerçek porsiyon bazlı USDA verilerine göre hesaplanmıştır.
                </p>
              </div>
            </div>

            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-1 bg-gradient-to-r from-[#22c55e] to-transparent rounded-full"></div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900">
                  Besin Değerleri Detayı
                </h2>
                <div className="w-12 h-1 bg-gradient-to-l from-[#22c55e] to-transparent rounded-full"></div>
              </div>
              <p className="text-gray-600 text-lg">
                Porsiyon başına kapsamlı besin değerleri analizi
              </p>
            </div>

            {/* Enhanced Macro Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {/* Protein Card */}
              <Card className="group hover-elevate active-elevate-2 overflow-visible">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-transparent rounded-bl-full"></div>
                <CardContent className="relative p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Activity className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black text-teal-600">{Number(food.protein || 0).toFixed(1)}</div>
                      <div className="text-sm font-semibold text-gray-500">gram</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Protein</h3>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
                      style={{ width: `${Math.min(proteinPercent, 100)}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              {/* Carbs Card */}
              <Card className="group hover-elevate active-elevate-2 overflow-visible">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full"></div>
                <CardContent className="relative p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Zap className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black text-orange-600">{Number(food.carbs || 0).toFixed(1)}</div>
                      <div className="text-sm font-semibold text-gray-500">gram</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Karbonhidrat</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Lif</span>
                      <span className="font-semibold">{Number(food.fiber || 0).toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Şeker</span>
                      <span className="font-semibold">{Number(food.sugar || 0).toFixed(1)}g</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fat Card - Enhanced with saturated fat, trans fat */}
              <Card className="group hover-elevate active-elevate-2 overflow-visible">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-bl-full"></div>
                <CardContent className="relative p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black text-yellow-600">{Number(food.fat || 0).toFixed(1)}</div>
                      <div className="text-sm font-semibold text-gray-500">gram</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Yağ</h3>
                  <div className="space-y-2">
                    {food.saturatedFat && Number(food.saturatedFat) > 0 && (
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Doymuş</span>
                        <span className="font-semibold">{Number(food.saturatedFat).toFixed(1)}g</span>
                      </div>
                    )}
                    {food.transFat && Number(food.transFat) > 0 && (
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Trans</span>
                        <span className="font-semibold">{Number(food.transFat).toFixed(1)}g</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Cholesterol Card */}
              {food.cholesterol && Number(food.cholesterol) > 0 && (
                <Card className="group hover-elevate active-elevate-2 overflow-visible">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-bl-full"></div>
                  <CardContent className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Heart className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-black text-red-600">{Number(food.cholesterol).toFixed(0)}</div>
                        <div className="text-sm font-semibold text-gray-500">mg</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Kolesterol</h3>
                    <p className="text-xs text-gray-600">Porsiyon başına</p>
                  </CardContent>
                </Card>
              )}

              {/* Sodium Card */}
              {food.sodium && Number(food.sodium) > 0 && (
                <Card className="group hover-elevate active-elevate-2 overflow-visible">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
                  <CardContent className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Shield className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-black text-blue-600">{Number(food.sodium).toFixed(0)}</div>
                        <div className="text-sm font-semibold text-gray-500">mg</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Sodyum</h3>
                    <p className="text-xs text-gray-600">Tuz içeriği</p>
                  </CardContent>
                </Card>
              )}

              {/* Potassium Card */}
              {food.potassium && Number(food.potassium) > 0 && (
                <Card className="group hover-elevate active-elevate-2 overflow-visible">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full"></div>
                  <CardContent className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Zap className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-black text-purple-600">{Number(food.potassium).toFixed(0)}</div>
                        <div className="text-sm font-semibold text-gray-500">mg</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Potasyum</h3>
                    <p className="text-xs text-gray-600">Elektrolit dengesi</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Nutrition Summary Table - SEO Optimized */}
            <div className="mb-16 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center" data-testid="heading-nutrition-table">
                {food.name} Besin Değerleri Tablosu
              </h3>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-green-200/50">
                <table className="w-full" data-testid="table-nutrition-summary">
                  <caption className="sr-only">{food.name} Besin Değerleri Tablosu - {food.servingLabel} başına</caption>
                  <thead className="bg-gradient-to-r from-green-500 to-emerald-500">
                    <tr>
                      <th className="text-left py-4 px-6 text-white font-bold">Besin Öğesi</th>
                      <th className="text-right py-4 px-6 text-white font-bold">Miktar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover-elevate">
                      <td className="py-4 px-6 font-semibold text-gray-900">Kalori</td>
                      <td className="py-4 px-6 text-right font-bold text-green-600" data-testid="text-table-calories">{Number(food.calories).toFixed(0)} kcal</td>
                    </tr>
                    <tr className="hover-elevate bg-gray-50/50">
                      <td className="py-4 px-6 font-semibold text-gray-900">Protein</td>
                      <td className="py-4 px-6 text-right font-bold text-teal-600" data-testid="text-table-protein">{Number(food.protein || 0).toFixed(1)} g</td>
                    </tr>
                    <tr className="hover-elevate">
                      <td className="py-4 px-6 font-semibold text-gray-900">Karbonhidrat</td>
                      <td className="py-4 px-6 text-right font-bold text-orange-600" data-testid="text-table-carbs">{Number(food.carbs || 0).toFixed(1)} g</td>
                    </tr>
                    {food.fiber && Number(food.fiber) > 0 && (
                      <tr className="hover-elevate bg-gray-50/50">
                        <td className="py-4 px-6 pl-12 text-gray-700">• Lif</td>
                        <td className="py-4 px-6 text-right text-gray-700" data-testid="text-table-fiber">{Number(food.fiber).toFixed(1)} g</td>
                      </tr>
                    )}
                    {food.sugar && Number(food.sugar) > 0 && (
                      <tr className="hover-elevate">
                        <td className="py-4 px-6 pl-12 text-gray-700">• Şeker</td>
                        <td className="py-4 px-6 text-right text-gray-700" data-testid="text-table-sugar">{Number(food.sugar).toFixed(1)} g</td>
                      </tr>
                    )}
                    <tr className="hover-elevate bg-gray-50/50">
                      <td className="py-4 px-6 font-semibold text-gray-900">Yağ</td>
                      <td className="py-4 px-6 text-right font-bold text-yellow-600" data-testid="text-table-fat">{Number(food.fat || 0).toFixed(1)} g</td>
                    </tr>
                    {food.saturatedFat && Number(food.saturatedFat) > 0 && (
                      <tr className="hover-elevate">
                        <td className="py-4 px-6 pl-12 text-gray-700">• Doymuş Yağ</td>
                        <td className="py-4 px-6 text-right text-gray-700" data-testid="text-table-saturated-fat">{Number(food.saturatedFat).toFixed(1)} g</td>
                      </tr>
                    )}
                    {food.cholesterol && Number(food.cholesterol) > 0 && (
                      <tr className="hover-elevate bg-gray-50/50">
                        <td className="py-4 px-6 font-semibold text-gray-900">Kolesterol</td>
                        <td className="py-4 px-6 text-right font-bold text-red-600" data-testid="text-table-cholesterol">{Number(food.cholesterol).toFixed(0)} mg</td>
                      </tr>
                    )}
                    {food.sodium && Number(food.sodium) > 0 && (
                      <tr className="hover-elevate">
                        <td className="py-4 px-6 font-semibold text-gray-900">Sodyum</td>
                        <td className="py-4 px-6 text-right font-bold text-blue-600" data-testid="text-table-sodium">{Number(food.sodium).toFixed(0)} mg</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Complete Nutrition Table */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Vitamin ve Mineral İçeriği
              </h3>
              <NutritionTable food={food} />
            </div>

            {/* FAQ Section - Google Featured Snippets */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-10 text-center">
                Sık Sorulan Sorular
              </h2>
              <div className="space-y-6">
                {/* Question 1 */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200/50 overflow-hidden hover-elevate">
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
                    <h3 className="text-xl font-bold text-gray-900">{food.name} kaç kalori?</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 leading-relaxed">
                      {food.name}, {food.servingLabel} başına <strong>{Number(food.calories).toFixed(0)} kalori</strong> içerir. 
                      Bu değer gerçek porsiyon bazlı USDA verilerine göre hesaplanmıştır.
                    </p>
                  </div>
                </div>

                {/* Question 2 */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200/50 overflow-hidden hover-elevate">
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
                    <h3 className="text-xl font-bold text-gray-900">{food.name} besin değerleri nedir?</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 leading-relaxed">
                      {food.name} besin değerleri ({food.servingLabel} başına): <strong>{Number(food.calories).toFixed(0)} kalori</strong>, 
                      {food.protein && <> <strong>{Number(food.protein).toFixed(1)}g protein</strong>,</>}
                      {food.carbs && <> <strong>{Number(food.carbs).toFixed(1)}g karbonhidrat</strong>,</>}
                      {food.fat && <> <strong>{Number(food.fat).toFixed(1)}g yağ</strong></>}
                      {food.fiber && <>, <strong>{Number(food.fiber).toFixed(1)}g lif</strong></>} içerir.
                    </p>
                  </div>
                </div>

                {/* Question 3 */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200/50 overflow-hidden hover-elevate">
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
                    <h3 className="text-xl font-bold text-gray-900">{food.name} sağlıklı mı?</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 leading-relaxed">
                      {food.name}, dengeli beslenme programının bir parçası olarak tüketilebilir. {food.servingLabel} başına {Number(food.calories).toFixed(0)} kalori içerir ve besin değerleri açısından
                      {food.protein && <> {Number(food.protein).toFixed(1)}g protein</>}
                      {food.carbs && <>, {Number(food.carbs).toFixed(1)}g karbonhidrat</>}
                      {food.fat && <> ve {Number(food.fat).toFixed(1)}g yağ</>} sağlar.
                    </p>
                  </div>
                </div>

                {/* Question 4 */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200/50 overflow-hidden hover-elevate">
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
                    <h3 className="text-xl font-bold text-gray-900">{food.name} porsiyon miktarı ne kadar?</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 leading-relaxed">
                      {food.name} için standart porsiyon miktarı <strong>{food.servingLabel}</strong> olarak tanımlanmıştır. 
                      Bu porsiyon <strong>{Number(food.calories).toFixed(0)} kalori</strong> içerir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Alternatives Section */}
        {alternatives.length > 0 && (
          <section className="py-16 px-4 bg-gradient-to-b from-emerald-50/50 to-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2
                  className="text-3xl md:text-4xl font-black text-gray-900 mb-4"
                  data-testid="text-alternatives-title"
                >
                  Benzer Gıdalar
                </h2>
                <p className="text-gray-600 text-lg">
                  Bu gıdaya alternatif olabilecek diğer seçenekler
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {alternatives.map((altFood) => (
                  <FoodCard key={altFood.id} food={altFood} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to Home */}
        <div className="text-center py-12 bg-white">
          <a
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white font-bold rounded-2xl hover:shadow-2xl active:scale-95 transition-all shadow-lg"
            data-testid="link-home"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ana Sayfaya Dön
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
