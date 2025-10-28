import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Beef, TrendingUp, Sparkles, Zap, Target } from "lucide-react";
import type { CategoryGroup, Food } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface ProteinCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface ProteinResult {
  min: number;
  max: number;
  recommended: number;
  meals: number;
  perMeal: number;
}

export default function ProteinCalculator({ categoryGroups, currentPath }: ProteinCalculatorProps) {
  const [weight, setWeight] = useState<number>(70);
  const [goal, setGoal] = useState<string>("maintain");
  const [activity, setActivity] = useState<string>("moderate");
  const [result, setResult] = useState<ProteinResult | null>(null);

  const { data: highProteinFoods } = useQuery<{ foods: Food[] }>({
    queryKey: ["/api/foods/search", { q: "tavuk", limit: 6 }],
    enabled: !!result
  });

  const calculateProtein = (e: React.FormEvent) => {
    e.preventDefault();
    const w = weight;
    
    let multiplier = 1.6;
    if (goal === "weight-loss" && activity === "high") multiplier = 2.2;
    else if (goal === "weight-loss") multiplier = 2.0;
    else if (goal === "muscle-gain") multiplier = 2.4;
    else if (activity === "high") multiplier = 2.0;
    else if (activity === "low") multiplier = 1.2;

    const recommended = w * multiplier;
    const min = w * 1.2;
    const max = w * 2.6;

    setResult({
      min: Math.round(min),
      max: Math.round(max),
      recommended: Math.round(recommended),
      meals: 4,
      perMeal: Math.round(recommended / 4)
    });
  };

  const goals = [
    { value: "weight-loss", label: "Kilo Vermek", color: "from-orange-500 to-red-600", icon: "📉" },
    { value: "maintain", label: "Kilonu Korumak", color: "from-green-500 to-emerald-600", icon: "⚖️" },
    { value: "muscle-gain", label: "Kas Yapmak", color: "from-purple-500 to-pink-600", icon: "💪" }
  ];

  const activityLevels = [
    { value: "low", label: "Düşük", desc: "Hareketsiz yaşam" },
    { value: "moderate", label: "Orta", desc: "Haftada 2-4 gün spor" },
    { value: "high", label: "Yüksek", desc: "Haftada 5+ gün spor" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-400 to-orange-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-400 to-yellow-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-red-400 hover:text-red-300 font-medium text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full inline-block border border-red-500/30">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-full px-6 py-3 mb-6 shadow-2xl shadow-red-500/50 border border-red-400/30">
              <Beef className="w-6 h-6 animate-pulse" />
              <span className="font-bold">Hedef Bazlı Hesaplama</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-red-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl">
              Günlük Protein Gereksinimi Hesaplayıcı
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hedefinize ve aktivite seviyenize göre günlük protein ihtiyacınızı öğrenin
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Calculator Form */}
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl shadow-lg shadow-red-500/50">
                  <Beef className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Bilgilerinizi Girin</h2>
              </div>

              <form onSubmit={calculateProtein} className="space-y-8">
                {/* Weight */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Kilo (kg)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                      {weight}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="200"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-orange-400 [&::-webkit-slider-thumb]:to-red-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-orange-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                  />
                  <div className="flex justify-between text-xs text-gray-400 px-1">
                    <span>30 kg</span>
                    <span>200 kg</span>
                  </div>
                </div>

                {/* Goal */}
                <div className="space-y-4">
                  <label className="text-lg font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-yellow-400" />
                    Hedefiniz
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {goals.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => setGoal(g.value)}
                        className={`p-4 rounded-xl text-left transition-all duration-300 flex items-center gap-4 ${
                          goal === g.value
                            ? `bg-gradient-to-br ${g.color} text-white shadow-2xl scale-105`
                            : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        <span className="text-3xl">{g.icon}</span>
                        <span className="font-bold text-lg">{g.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Activity Level */}
                <div className="space-y-4">
                  <label className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Aktivite Seviyesi
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {activityLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setActivity(level.value)}
                        className={`p-4 rounded-xl text-left transition-all duration-300 ${
                          activity === level.value
                            ? "bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl shadow-purple-500/50 scale-105"
                            : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        <div className="font-bold">{level.label}</div>
                        <div className="text-xs opacity-75 mt-1">{level.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-16 text-xl font-black bg-gradient-to-r from-red-500 via-orange-600 to-yellow-500 hover:from-red-600 hover:via-orange-700 hover:to-yellow-600 shadow-2xl shadow-red-500/50 rounded-2xl border-2 border-red-400/50 hover:scale-105 transition-all duration-300"
                >
                  <Zap className="w-6 h-6 mr-2 animate-pulse" />
                  Protein İhtiyacını Hesapla
                </Button>
              </form>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {/* Recommended Protein */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-red-500/20 to-orange-600/20 rounded-3xl border border-red-400/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-8 h-8 text-red-400 animate-pulse" />
                    <h3 className="text-2xl font-black text-white">Önerilen Protein</h3>
                  </div>
                  <div className="text-7xl font-black bg-gradient-to-r from-red-300 to-orange-400 bg-clip-text text-transparent mb-2">
                    {result.recommended}g
                  </div>
                  <p className="text-gray-300 text-sm">Günlük protein hedefi</p>
                </div>

                {/* Per Meal */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-orange-500/20 to-yellow-600/20 rounded-3xl border border-orange-400/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300">
                  <h3 className="text-2xl font-black text-white mb-4">Öğün Başı Protein</h3>
                  <div className="text-5xl font-black bg-gradient-to-r from-orange-300 to-yellow-400 bg-clip-text text-transparent mb-2">
                    {result.perMeal}g
                  </div>
                  <p className="text-gray-300 text-sm">{result.meals} öğüne bölündüğünde</p>
                </div>

                {/* Range */}
                <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-8 shadow-2xl">
                  <h3 className="text-2xl font-black text-white mb-6">Protein Aralığı</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Minimum</p>
                      <p className="text-3xl font-black text-blue-400">{result.min}g</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Maksimum</p>
                      <p className="text-3xl font-black text-purple-400">{result.max}g</p>
                    </div>
                  </div>
                  <div className="mt-6 h-4 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-red-500 to-purple-600 rounded-full shadow-lg transition-all duration-1000"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEO Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-12">
              <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                Protein Nedir ve Neden Bu Kadar Önemlidir?
              </h2>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Protein, vücudun yapı taşlarından biridir ve kaslar, kemikler, cilt, saç, hormonlar ve enzimler dahil olmak üzere hemen hemen 
                her hücrenin oluşumunda rol oynar. Amino asitlerden oluşur ve vücudumuz 20 farklı amino asit kullanır. 9 tanesi "esansiyel" 
                olarak sınıflandırılır çünkü vücut bunları üretemez ve besinlerle alınması gerekir. Günlük protein ihtiyacı kişinin kiloya, 
                aktivite seviyesine ve hedeflerine göre değişir. Genel kural olarak, vücut ağırlığının kg başına 0.8-2.2g protein önerilir. 
                Hareketsiz bir birey için minimum 0.8g yeterli olabilirken, sporcu veya kas yapma hedefi olan bireyler için 2.0-2.4g gereklidir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Protein İhtiyacını Etkileyen Faktörler
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Aktivite seviyesi en önemli faktördür; dirençli antrenman (ağırlık kaldırma) yapanlar kas sentezi için daha fazla protein 
                gerektirir. Kilo kaybı hedefleyenler proteini artırmalıdır çünkü protein tokluk hissi verir ve kas kaybını önler. Yaş ilerledikçe 
                protein ihtiyacı artar; yaşlılarda kas kaybı (sarkopeni) riski yüksektir ve daha fazla protein bu riski azaltır. Hamileler ve 
                emziren anneler ekstra protein gerektirir. Yaralanma veya hastalık dönemlerinde iyileşme için protein ihtiyacı artar. Vejetaryen 
                ve veganlar bitkisel protein kaynaklarının kalitesini göz önünde bulundurarak daha fazla protein almalıdır.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Protein Kaynakları: Hayvansal vs Bitkisel
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Hayvansal protein kaynakları (tavuk, balık, yumurta, süt ürünleri, kırmızı et) "tam protein"dir; tüm esansiyel amino asitleri 
                içerir. Özellikle tavuk göğsü yağsız ve yüksek proteinlidir (100g = 31g protein). Balık hem protein hem de omega-3 yağ asitleri 
                sağlar. Yumurta biyolojik değeri en yüksek protein kaynağıdır (1 yumurta = 6-7g protein). Bitkisel protein kaynakları genellikle 
                "eksik protein"dir ancak kombinasyon halinde tam olabilir: fasulye + pirinç, humus + ekmek gibi. Kinoa, soya ve edamame tam 
                proteindir. Baklagiller (mercimek, nohut, fasulye) hem protein hem lif sağlar. Tofu ve tempeh soya bazlı yüksek proteinli 
                alternatiflerdir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Protein Zamanlaması ve Dağılımı
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Günlük proteini eşit öğünlere dağıtmak daha etkilidir. Her öğünde 25-40g protein almak kas sentezini optimize eder. Kahvaltıda 
                protein almak tokluk hissini artırır ve gün boyu kalori alımını azaltır. Egzersiz sonrası 1-2 saat içinde protein almak kas 
                onarımını hızlandırır; bu "anabolik pencere" kritik öneme sahiptir. Yatmadan önce yavaş sindirilen protein (kazein gibi) geceleyin 
                kas sentezini destekler. Protein tozları pratik olsa da, doğal gıdalardan protein almak daha sağlıklıdır çünkü vitamin, mineral ve 
                lif de sağlar. Aşırı protein tüketimi (3g/kg'dan fazla) böbreklere zarar verebilir ve kalsiyum kaybına yol açabilir. Dengeli bir 
                yaklaşım en iyisidir.
              </p>

              <div className="mt-12 text-center">
                <a 
                  href="/hesaplayicilar" 
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold text-lg hover:from-red-600 hover:to-orange-700 shadow-2xl shadow-red-500/50 border border-red-400/30 hover:scale-105 transition-all duration-300"
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
