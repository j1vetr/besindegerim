import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Droplets, Activity, Sun, Zap } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface WaterIntakeCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface WaterResult {
  liters: number;
  glasses: number;
  bottles: number;
}

export default function WaterIntakeCalculator({ categoryGroups, currentPath }: WaterIntakeCalculatorProps) {
  const [weight, setWeight] = useState<number>(70);
  const [activity, setActivity] = useState<number>(1.0);
  const [climate, setClimate] = useState<number>(1.0);
  const [result, setResult] = useState<WaterResult | null>(null);

  const calculateWater = (e: React.FormEvent) => {
    e.preventDefault();
    const w = weight;
    const activityFactor = activity;
    const climateFactor = climate;
    
    const baseWater = w * 0.033;
    const totalWater = baseWater * activityFactor * climateFactor;
    
    setResult({
      liters: parseFloat(totalWater.toFixed(2)),
      glasses: Math.round(totalWater / 0.25),
      bottles: Math.round(totalWater / 0.5)
    });
  };

  const activityLevels = [
    { value: 1.0, label: "Hareketsiz", icon: "🛋️" },
    { value: 1.2, label: "Az Aktif", icon: "🚶" },
    { value: 1.4, label: "Orta Aktif", icon: "🏃" },
    { value: 1.6, label: "Çok Aktif", icon: "💪" },
    { value: 1.8, label: "Ekstra Aktif", icon: "🏋️" }
  ];

  const climateLevels = [
    { value: 0.9, label: "Soğuk İklim", icon: "❄️" },
    { value: 1.0, label: "Ilıman İklim", icon: "🌤️" },
    { value: 1.2, label: "Sıcak İklim", icon: "☀️" },
    { value: 1.4, label: "Çok Sıcak", icon: "🔥" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-cyan-400 hover:text-cyan-300 font-medium text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full inline-block border border-cyan-500/30">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full px-6 py-3 mb-6 shadow-2xl shadow-cyan-500/50 border border-cyan-400/30">
              <Droplets className="w-6 h-6 animate-pulse" />
              <span className="font-bold">Kişiselleştirilmiş Hidrasyon</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-2xl">
              Günlük Su İhtiyacı Hesaplayıcı
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Kilonuza, aktivite seviyenize ve iklime göre günlük su ihtiyacınızı hesaplayın
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Calculator Form */}
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/50">
                  <Droplets className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Bilgilerinizi Girin</h2>
              </div>

              <form onSubmit={calculateWater} className="space-y-8">
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

                {/* Activity Level */}
                <div className="space-y-4">
                  <label className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Aktivite Seviyesi
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {activityLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setActivity(level.value)}
                        className={`p-4 rounded-xl text-left transition-all duration-300 ${
                          activity === level.value
                            ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-2xl shadow-cyan-500/50 scale-105"
                            : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        <div className="text-2xl mb-2">{level.icon}</div>
                        <div className="font-bold text-sm">{level.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Climate */}
                <div className="space-y-4">
                  <label className="text-lg font-bold text-white flex items-center gap-2">
                    <Sun className="w-5 h-5 text-yellow-400" />
                    İklim
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {climateLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setClimate(level.value)}
                        className={`p-4 rounded-xl text-left transition-all duration-300 ${
                          climate === level.value
                            ? "bg-gradient-to-br from-orange-500 to-yellow-600 text-white shadow-2xl shadow-orange-500/50 scale-105"
                            : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        <div className="text-2xl mb-2">{level.icon}</div>
                        <div className="font-bold text-sm">{level.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-16 text-xl font-black bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-500 hover:from-cyan-600 hover:via-blue-700 hover:to-indigo-600 shadow-2xl shadow-cyan-500/50 rounded-2xl border-2 border-cyan-400/50 hover:scale-105 transition-all duration-300"
                >
                  <Zap className="w-6 h-6 mr-2 animate-pulse" />
                  Su İhtiyacını Hesapla
                </Button>
              </form>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {/* Total Water */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl border border-cyan-400/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <Droplets className="w-10 h-10 text-cyan-400 animate-pulse" />
                    <h3 className="text-2xl font-black text-white">Toplam Su İhtiyacınız</h3>
                  </div>
                  <div className="text-7xl font-black bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-2">
                    {result.liters} L
                  </div>
                  <p className="text-gray-300 text-sm">Günlük önerilen su tüketimi</p>
                </div>

                {/* Glasses & Bottles */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-3xl border border-blue-400/30 p-6 shadow-2xl">
                    <div className="text-5xl mb-3">🥤</div>
                    <div className="text-4xl font-black bg-gradient-to-r from-blue-300 to-indigo-400 bg-clip-text text-transparent mb-2">
                      {result.glasses}
                    </div>
                    <p className="text-gray-300 text-sm">Bardak (250ml)</p>
                  </div>

                  <div className="backdrop-blur-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-3xl border border-indigo-400/30 p-6 shadow-2xl">
                    <div className="text-5xl mb-3">💧</div>
                    <div className="text-4xl font-black bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent mb-2">
                      {result.bottles}
                    </div>
                    <p className="text-gray-300 text-sm">Şişe (500ml)</p>
                  </div>
                </div>

                {/* Tips */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-3xl border border-yellow-400/30 p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Sun className="w-8 h-8 text-yellow-400" />
                    <h3 className="text-2xl font-black text-white">Hidrasyon İpuçları</h3>
                  </div>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span>Egzersiz öncesi, sırası ve sonrasında ekstra su için</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span>Sabah kalktığınızda 1-2 bardak su için</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span>Yemeklerden 30 dk önce su içmeyi alışkanlık haline getirin</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span>Idrarınızın rengi açık sarı ise yeterli su içiyorsunuz</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* SEO Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-12">
              <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Günlük Su İhtiyacı Nedir ve Neden Önemlidir?
              </h2>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Vücudumuzun %60-70'i sudan oluşur ve su, yaşamsal fonksiyonların sürdürülmesi için kritik öneme sahiptir. Günlük su ihtiyacı 
                kişiden kişiye değişir; vücut ağırlığı, aktivite seviyesi, iklim koşulları ve genel sağlık durumu gibi faktörler bu ihtiyacı etkiler. 
                Genel kural olarak, günlük 2-3 litre su tüketimi önerilir, ancak bu miktar bireysel faktörlere göre artabilir. Örneğin 70 kg'lık 
                hareketsiz bir birey için yaklaşık 2.3 litre yeterli olabilirken, aynı kilodaki aktif bir sporcu için 3-4 litre gerekebilir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Su İhtiyacını Etkileyen Faktörler
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Vücut ağırlığı başlıca faktördür; genellikle kilogram başına 30-40ml su önerilir. Fiziksel aktivite su kaybını artırır; yoğun 
                egzersiz sırasında saatte 1-2 litre ter kaybedilebilir. İklim koşulları da önemlidir: sıcak ve nemli havalarda su kaybı artar, 
                soğuk iklimlerde azalır. Hamilelik ve emzirme dönemlerinde su ihtiyacı artar. Yüksek proteinli diyetler ve kafeinin metabolik 
                etkileri de ek su tüketimini gerektirebilir. Alkol dehidrasyona neden olur; her alkol tüketiminden sonra ekstra su almanız önerilir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Susuzluğun Belirtileri ve Sağlık Etkileri
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Hafif dehidrasyon (%1-2 vücut ağırlığı kaybı) bile performansı olumsuz etkiler: konsantrasyon azalır, baş ağrısı başlar, 
                yorgunluk hissedilir. Orta dereceli dehidrasyon (%3-5) kuru ağız, koyu renkli idrar, baş dönmesi ve kalp çarpıntısına yol açar. 
                Ciddi dehidrasyon (%6+) hayati tehlike yaratır: kan basıncı düşer, organ yetmezliği riski artar. Kronik yetersiz su tüketimi 
                böbrek taşları, idrar yolu enfeksiyonları, kabızlık ve cilt problemleri riskini artırır. Bilişsel fonksiyonlar da etkilenir; 
                araştırmalar hafif dehidrasyonun hafıza, dikkat ve tepki süresini olumsuz etkilediğini gösteriyor.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Doğru Hidrasyon Stratejileri
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Susuzluk hissetmeden önce su için; susuzluk zaten hafif dehidrasyonun belirtisidir. Sabah kalktığınızda 1-2 bardak su için; 
                gece boyunca vücut su kaybeder. Yemeklerden 30 dakika önce su içmek sindirime yardımcı olur. Egzersiz öncesi 2 saat içinde 
                500ml, egzersiz sırasında her 15-20 dakikada 200ml, sonrasında kaybolan her 0.5 kg için 600ml su alın. Kahve ve çay da 
                hidrasyona katkıda bulunur (kafeinin hafif diüretik etkisine rağmen). Meyve ve sebzeler de su kaynağıdır; salatalık, karpuz, 
                kavun %90+ su içerir. Idrarınızın rengi en iyi göstergedir: açık sarı idealdir, koyu sarı dehidrasyonu işaret eder.
              </p>

              <div className="mt-12 text-center">
                <a 
                  href="/hesaplayicilar" 
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:from-cyan-600 hover:to-blue-700 shadow-2xl shadow-cyan-500/50 border border-cyan-400/30 hover:scale-105 transition-all duration-300"
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
