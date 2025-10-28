import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Apple, Zap, TrendingUp, Target, Flame, Activity } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface MacroCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface MacroResult {
  calories: number;
  protein: { grams: number; calories: number; percentage: number };
  carbs: { grams: number; calories: number; percentage: number };
  fats: { grams: number; calories: number; percentage: number };
  goalName: string;
}

export default function MacroCalculator({ categoryGroups, currentPath }: MacroCalculatorProps) {
  const [weight, setWeight] = useState<number>(75);
  const [activity, setActivity] = useState<number>(1.55);
  const [customGoal, setCustomGoal] = useState<string>("maintain");
  const [result, setResult] = useState<MacroResult | null>(null);

  const activityLevels = [
    { value: 1.2, label: "Hareketsiz", desc: "Hiç egzersiz yok", icon: "🛋️" },
    { value: 1.375, label: "Az Aktif", desc: "Haftada 1-3 gün", icon: "🚶" },
    { value: 1.55, label: "Orta Aktif", desc: "Haftada 3-5 gün", icon: "🏃" },
    { value: 1.725, label: "Çok Aktif", desc: "Haftada 6-7 gün", icon: "💪" },
    { value: 1.9, label: "Ekstra Aktif", desc: "Günde 2x egzersiz", icon: "🏋️" }
  ];

  const presetGoals = [
    { 
      id: "fat-loss", 
      name: "Yağ Yakma", 
      icon: "🔥",
      color: "from-orange-500 to-red-600",
      protein: 40, // %
      carbs: 30,
      fats: 30,
      calorieAdjust: -500
    },
    { 
      id: "muscle-gain", 
      name: "Kas Yapma", 
      icon: "💪",
      color: "from-purple-500 to-pink-600",
      protein: 30,
      carbs: 45,
      fats: 25,
      calorieAdjust: 300
    },
    { 
      id: "maintenance", 
      name: "Kilo Koruma", 
      icon: "⚖️",
      color: "from-green-500 to-emerald-600",
      protein: 30,
      carbs: 40,
      fats: 30,
      calorieAdjust: 0
    },
    { 
      id: "keto", 
      name: "Keto Diyeti", 
      icon: "🥑",
      color: "from-teal-500 to-cyan-600",
      protein: 25,
      carbs: 5,
      fats: 70,
      calorieAdjust: -300
    }
  ];

  const calculateMacros = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate BMR (Mifflin-St Jeor - using average for simplicity)
    const bmr = 10 * weight + 6.25 * 170 - 5 * 30 + 5; // Simplified
    const tdee = bmr * activity;
    
    let calories: number;
    let proteinPercent: number;
    let carbsPercent: number;
    let fatsPercent: number;
    let goalName: string;

    if (customGoal === "lose") {
      calories = tdee - 500;
      proteinPercent = 40;
      carbsPercent = 30;
      fatsPercent = 30;
      goalName = "Kilo Verme";
    } else if (customGoal === "gain") {
      calories = tdee + 300;
      proteinPercent = 30;
      carbsPercent = 45;
      fatsPercent = 25;
      goalName = "Kilo Alma";
    } else {
      calories = tdee;
      proteinPercent = 30;
      carbsPercent = 40;
      fatsPercent = 30;
      goalName = "Kilo Koruma";
    }

    const proteinCals = (calories * proteinPercent) / 100;
    const carbsCals = (calories * carbsPercent) / 100;
    const fatsCals = (calories * fatsPercent) / 100;

    setResult({
      calories: Math.round(calories),
      protein: {
        grams: Math.round(proteinCals / 4),
        calories: Math.round(proteinCals),
        percentage: proteinPercent
      },
      carbs: {
        grams: Math.round(carbsCals / 4),
        calories: Math.round(carbsCals),
        percentage: carbsPercent
      },
      fats: {
        grams: Math.round(fatsCals / 9),
        calories: Math.round(fatsCals),
        percentage: fatsPercent
      },
      goalName
    });
  };

  const applyPreset = (preset: typeof presetGoals[0]) => {
    const bmr = 10 * weight + 6.25 * 170 - 5 * 30 + 5;
    const tdee = bmr * activity;
    const calories = tdee + preset.calorieAdjust;

    const proteinCals = (calories * preset.protein) / 100;
    const carbsCals = (calories * preset.carbs) / 100;
    const fatsCals = (calories * preset.fats) / 100;

    setResult({
      calories: Math.round(calories),
      protein: {
        grams: Math.round(proteinCals / 4),
        calories: Math.round(proteinCals),
        percentage: preset.protein
      },
      carbs: {
        grams: Math.round(carbsCals / 4),
        calories: Math.round(carbsCals),
        percentage: preset.carbs
      },
      fats: {
        grams: Math.round(fatsCals / 9),
        calories: Math.round(fatsCals),
        percentage: preset.fats
      },
      goalName: preset.name
    });
  };

  const pieData = result ? [
    { name: "Protein", value: result.protein.percentage, color: "#10b981" },
    { name: "Karbonhidrat", value: result.carbs.percentage, color: "#3b82f6" },
    { name: "Yağ", value: result.fats.percentage, color: "#f59e0b" }
  ] : [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-teal-400 to-cyan-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-teal-400 hover:text-teal-300 font-medium text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full inline-block border border-teal-500/30">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-full px-6 py-3 mb-6 shadow-2xl shadow-teal-500/50 border border-teal-400/30">
              <Apple className="w-6 h-6 animate-pulse" />
              <span className="font-bold">Kişiselleştirilmiş Makro Dağılımı</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
              Makro Besin Hesaplayıcı
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hedefinize özel protein, karbonhidrat ve yağ oranlarınızı hesaplayın
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Calculator Form */}
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl shadow-lg shadow-teal-500/50">
                  <Apple className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Bilgilerinizi Girin</h2>
              </div>

              <form onSubmit={calculateMacros} className="space-y-8">
                {/* Weight */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Kilo (kg)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                      {weight}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="150"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-teal-500/20 to-cyan-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-teal-400 [&::-webkit-slider-thumb]:to-cyan-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-teal-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                  />
                  <div className="flex justify-between text-xs text-gray-400 px-1">
                    <span>40 kg</span>
                    <span>150 kg</span>
                  </div>
                </div>

                {/* Activity Level */}
                <div className="space-y-4">
                  <label className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Aktivite Seviyesi
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {activityLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setActivity(level.value)}
                        className={`p-4 rounded-xl text-left transition-all duration-300 flex items-center gap-4 ${
                          activity === level.value
                            ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-2xl shadow-teal-500/50 scale-105"
                            : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        <span className="text-2xl">{level.icon}</span>
                        <div className="flex-1">
                          <div className="font-bold">{level.label}</div>
                          <div className="text-xs opacity-75">{level.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goal */}
                <div className="space-y-4">
                  <label className="text-lg font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    Hedefiniz
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => setCustomGoal("lose")}
                      className={`p-4 rounded-xl text-left transition-all duration-300 ${
                        customGoal === "lose"
                          ? "bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-2xl shadow-orange-500/50 scale-105"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      <div className="font-bold">🔥 Kilo Vermek</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomGoal("maintain")}
                      className={`p-4 rounded-xl text-left transition-all duration-300 ${
                        customGoal === "maintain"
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/50 scale-105"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      <div className="font-bold">⚖️ Kilonu Korumak</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomGoal("gain")}
                      className={`p-4 rounded-xl text-left transition-all duration-300 ${
                        customGoal === "gain"
                          ? "bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl shadow-purple-500/50 scale-105"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      <div className="font-bold">💪 Kilo Almak</div>
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-16 text-xl font-black bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-500 hover:from-teal-600 hover:via-cyan-700 hover:to-blue-600 shadow-2xl shadow-teal-500/50 rounded-2xl border-2 border-teal-400/50 hover:scale-105 transition-all duration-300"
                  data-testid="button-calculate-macros"
                >
                  <Zap className="w-6 h-6 mr-2 animate-pulse" />
                  Makrolarımı Hesapla
                </Button>
              </form>

              {/* Preset Goals */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  Hızlı Hedef Seçimi
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {presetGoals.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`p-4 rounded-xl bg-gradient-to-br ${preset.color} text-white shadow-xl hover:scale-105 transition-all duration-300 border border-white/20`}
                      data-testid={`button-preset-${preset.id}`}
                    >
                      <div className="text-2xl mb-2">{preset.icon}</div>
                      <div className="font-bold text-sm">{preset.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {/* Total Calories */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-teal-500/20 to-cyan-600/20 rounded-3xl border border-teal-400/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <Flame className="w-8 h-8 text-teal-400 animate-pulse" />
                    <h3 className="text-2xl font-black text-white">Günlük Kalori</h3>
                  </div>
                  <div className="text-7xl font-black bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent mb-2" data-testid="text-total-calories">
                    {result.calories}
                  </div>
                  <p className="text-gray-300 text-sm">{result.goalName} için</p>
                </div>

                {/* Pie Chart */}
                <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
                  <h3 className="text-2xl font-black text-white mb-6 text-center">Makro Dağılımı</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Macro Details */}
                <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
                  <h3 className="text-2xl font-black text-white mb-6">Detaylı Makrolar</h3>
                  
                  {/* Protein */}
                  <div className="mb-6 p-6 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-2xl border border-green-400/30">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-green-300">🥩 Protein</span>
                      <span className="text-sm text-green-400">{result.protein.percentage}%</span>
                    </div>
                    <div className="text-4xl font-black text-green-300 mb-1" data-testid="text-protein-grams">
                      {result.protein.grams}g
                    </div>
                    <div className="text-sm text-gray-400" data-testid="text-protein-calories">
                      {result.protein.calories} kalori
                    </div>
                  </div>

                  {/* Carbs */}
                  <div className="mb-6 p-6 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl border border-blue-400/30">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-blue-300">🍞 Karbonhidrat</span>
                      <span className="text-sm text-blue-400">{result.carbs.percentage}%</span>
                    </div>
                    <div className="text-4xl font-black text-blue-300 mb-1" data-testid="text-carbs-grams">
                      {result.carbs.grams}g
                    </div>
                    <div className="text-sm text-gray-400" data-testid="text-carbs-calories">
                      {result.carbs.calories} kalori
                    </div>
                  </div>

                  {/* Fats */}
                  <div className="p-6 bg-gradient-to-br from-orange-500/20 to-yellow-600/20 rounded-2xl border border-orange-400/30">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-orange-300">🥑 Yağ</span>
                      <span className="text-sm text-orange-400">{result.fats.percentage}%</span>
                    </div>
                    <div className="text-4xl font-black text-orange-300 mb-1" data-testid="text-fats-grams">
                      {result.fats.grams}g
                    </div>
                    <div className="text-sm text-gray-400" data-testid="text-fats-calories">
                      {result.fats.calories} kalori
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEO Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-12">
              <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                Makro Besinler Nedir ve Neden Önemlidir?
              </h2>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Makro besinler (makronütrientler), vücudumuzun enerji için kullandığı üç ana besin grubudur: protein, karbonhidrat ve yağ. 
                Her birinin kendine özgü işlevleri vardır ve dengeli beslenme için doğru oranlarda tüketilmeleri gerekir. Protein kas yapımı 
                ve onarımı için, karbonhidrat enerji için, yağ ise hormon üretimi ve hücre sağlığı için gereklidir. Günlük kalori alımınızın 
                bu üç makro besin arasında nasıl dağıldığı, hedefinize (kilo verme, kas yapma veya kilo koruma) ulaşmanızda kritik rol oynar.
              </p>

              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Kalori saymanın ötesinde, makro besin dağılımı vücut kompozisyonunuzu doğrudan etkiler. Aynı kalori miktarını farklı makro 
                oranlarıyla tükettiğinizde, vücudunuz tamamen farklı tepkiler verebilir. Örneğin, yüksek proteinli bir diyet kas kaybını önler 
                ve tokluk hissi sağlar, yüksek karbonhidratlı bir diyet ise antrenman performansını artırır, yüksek yağlı ketojenik diyetler 
                ise insülin direncini azaltabilir. Bu nedenle, sadece "ne kadar yediğiniz" değil, "ne yediğiniz" de önemlidir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Makro Besinlerin Özellikleri ve İşlevleri
              </h3>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-green-400">Protein (1g = 4 kalori):</strong> Amino asitlerden oluşur ve kas, kemik, cilt, saç, 
                enzim ve hormonların yapı taşıdır. Vücut 20 amino asit kullanır, bunların 9'u esansiyel amino asittir (vücut üretemez, 
                besinlerle alınmalıdır). Protein kas sentezi için kritiktir ve tokluk hissi sağlar (en yüksek termal etkiye sahip makrodur). 
                Hayvansal kaynaklar (et, balık, yumurta, süt) tam protein iken, bitkisel kaynaklar (baklagiller, tahıllar) genellikle 
                kombinasyonla tamamlanmalıdır. Günlük ihtiyaç vücut ağırlığının kg başına 1.6-2.5g arasında değişir.
              </p>

              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-blue-400">Karbonhidrat (1g = 4 kalori):</strong> Vücudun tercih ettiği birincil enerji kaynağıdır. 
                Glikoz olarak depolanır (kaslarda glikojen, karaciğerde glikojen) ve yoğun egzersizler için gereklidir. Basit karbonhidratlar 
                (şeker, beyaz un) hızlı enerji sağlarken, kompleks karbonhidratlar (tam tahıllar, sebzeler) yavaş salınımlı enerji ve lif 
                sağlar. Düşük karbonhidrat diyetleri (keto) yağ yakımını artırırken, yüksek karbonhidrat diyetleri antrenman kapasitesini 
                artırır. Aktivite seviyeniz ne kadar yüksekse, o kadar fazla karbonhidrata ihtiyacınız vardır.
              </p>

              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-orange-400">Yağ (1g = 9 kalori):</strong> Enerji yoğun bir makrodur ve kalori başına en fazla 
                enerji sağlar. Hormon üretimi, beyin sağlığı, hücre zarı yapımı ve yağda çözünen vitaminlerin (A, D, E, K) emilimi için 
                gereklidir. Doymuş yağlar (hayvansal yağlar), tekli doymamış yağlar (zeytinyağı, avokado) ve çoklu doymamış yağlar 
                (balık yağı, omega-3) olmak üzere üç ana türü vardır. Trans yağlardan kaçınılmalıdır. Günlük kalori alımının %20-35'i 
                yağdan gelmelidir, ancak keto diyetlerde bu oran %60-70'e çıkabilir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Farklı Hedefler İçin Makro Oranları
              </h3>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-orange-400">Yağ Yakma (Fat Loss):</strong> Kalori açığı oluştururken kas kaybını önlemek için 
                yüksek protein (%35-40) önerilir. Orta karbonhidrat (%25-35) antrenman enerjisi sağlar, düşük-orta yağ (%25-30) hormon 
                dengesini korur. Protein tokluk hissi verdiği için açlığı azaltır. Örnek oran: 40% protein, 30% karbonhidrat, 30% yağ. 
                Günlük kalori hedefi genellikle TDEE'nin 300-500 kalori altındadır.
              </p>

              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-purple-400">Kas Yapma (Muscle Gain):</strong> Kalori fazlası oluştururken yüksek protein 
                (%25-35) kas sentezini destekler. Yüksek karbonhidrat (%40-50) yoğun antrenmanlar için enerji sağlar ve kas glikojen 
                depolarını doldurur. Orta yağ (%20-30) hormon üretimini destekler. Örnek oran: 30% protein, 45% karbonhidrat, 25% yağ. 
                Günlük kalori hedefi genellikle TDEE'nin 200-400 kalori üstündedir. Fazla kalori fazlası yağ birikimine neden olur.
              </p>

              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-green-400">Kilo Koruma (Maintenance):</strong> Dengeli bir yaklaşımdır. Orta protein (%25-30) 
                kas kütlesini korur, orta karbonhidrat (%35-45) günlük aktivite için enerji sağlar, orta yağ (%25-35) hormon dengesini 
                korur. Örnek oran: 30% protein, 40% karbonhidrat, 30% yağ. Günlük kalori hedefi TDEE'ye eşittir. Bu oran uzun vadeli 
                sürdürülebilir ve sağlıklıdır.
              </p>

              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-teal-400">Keto Diyeti:</strong> Çok düşük karbonhidrat (%5-10), yüksek yağ (%60-75), orta 
                protein (%20-30) ile vücudu ketoza sokar. Ketoz durumunda vücut yağı enerji kaynağı olarak kullanır. İnsülin seviyelerini 
                düşürdüğü için tip 2 diyabet ve PCOS'ta faydalı olabilir. Ancak antrenman performansını azaltabilir ve adaptasyon süreci 
                (keto gribi) 1-2 hafta sürebilir. Net karbonhidrat günlük 20-50g ile sınırlıdır.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Makroları Nasıl Takip Edersiniz?
              </h3>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Makro takibi, günlük yediğiniz her besin için protein, karbonhidrat ve yağ miktarını kaydetmeyi içerir. MyFitnessPal, 
                Cronometer, Lose It gibi uygulamalar bu süreci kolaylaştırır. Barkod tarama özelliği ile paketli gıdaların makrolarını 
                hızlıca girebilirsiniz. Ev yapımı yemekler için tarif oluşturabilir ve porsiyon başına makroları hesaplayabilirsiniz. 
                Hassas sonuçlar için dijital mutfak terazisi kullanmak önemlidir; göz kararı tahminler %30-50 hata payına sahip olabilir.
              </p>

              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                İlk başta her şeyi tartmak zor gelebilir, ancak 2-3 hafta sonra çoğu insanın zihinsel bir veri tabanı oluşur ve tahminleri 
                daha doğru hale gelir. Günlük makro hedeflerinize %90-95 doğrulukla ulaşmak yeterlidir; mükemmeliyetçilik strese neden 
                olabilir. Haftalık ortalamaya bakmak daha sağlıklıdır çünkü bazı günler hedefin üstünde, bazı günler altında kalabilirsiniz. 
                Önemli olan uzun vadeli tutarlılıktır.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                Makro Zamanlaması (Nutrient Timing)
              </h3>
              
              <p className="text-gray-300 leading-relaxed text-lg">
                Günün hangi saatinde hangi makroyu tükettiğiniz de önemli olabilir, ancak toplam günlük tüketim kadar kritik değildir. 
                <strong> Kahvaltıda protein</strong> tokluk hissini artırır ve gün boyunca kalori alımını azaltır. <strong>Egzersiz 
                öncesi karbonhidrat</strong> (1-3 saat önce) performansı artırır; basit karbonhidratlar hızlı enerji, kompleks 
                karbonhidratlar uzun süreli enerji sağlar. <strong>Egzersiz sonrası protein + karbonhidrat</strong> (30-120 dakika içinde) 
                kas onarımını hızlandırır ve glikojen depolarını yeniler; bu "anabolik pencere" tartışmalıdır ancak faydalı olabilir. 
                <strong> Yatmadan önce protein</strong> (kazein gibi yavaş sindirilen) geceleyin kas sentezini destekler. Günlük 
                makro hedeflerinize ulaşmak zamanlamadan daha önemlidir, ancak bu detaylar %10-15 ekstra avantaj sağlayabilir.
              </p>

              <div className="mt-12 text-center">
                <a 
                  href="/hesaplayicilar" 
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold text-lg hover:from-teal-600 hover:to-cyan-700 shadow-2xl shadow-teal-500/50 border border-teal-400/30 hover:scale-105 transition-all duration-300"
                >
                  Diğer Hesaplayıcıları Gör
                </a>
              </div>
            </div>
          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
