import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Heart, Target, TrendingUp, Zap, Users } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface IdealWeightCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface WeightResult {
  divine: number;
  broca: number;
  current: number;
  difference: number;
}

export default function IdealWeightCalculator({ categoryGroups, currentPath }: IdealWeightCalculatorProps) {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState<number>(170);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [result, setResult] = useState<WeightResult | null>(null);

  const calculateIdealWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const h = height;
    const current = currentWeight;
    
    let divine = 0;
    if (gender === "male") {
      divine = 50 + 2.3 * ((h - 152.4) / 2.54);
    } else {
      divine = 45.5 + 2.3 * ((h - 152.4) / 2.54);
    }

    const broca = gender === "male" ? (h - 100) * 0.9 : (h - 100) * 0.85;

    setResult({
      divine: parseFloat(divine.toFixed(1)),
      broca: parseFloat(broca.toFixed(1)),
      current,
      difference: current > 0 ? parseFloat((current - divine).toFixed(1)) : 0
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-pink-900 to-slate-900">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-400 to-rose-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-pink-400 hover:text-pink-300 font-medium text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full inline-block border border-pink-500/30">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full px-6 py-3 mb-6 shadow-2xl shadow-pink-500/50 border border-pink-400/30">
              <Heart className="w-6 h-6 animate-pulse" />
              <span className="font-bold">Devine & Broca Formülleri</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-pink-400 via-rose-500 to-red-400 bg-clip-text text-transparent drop-shadow-2xl">
              İdeal Kilo Hesaplayıcı
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Boyunuza ve cinsiyetinize göre bilimsel formüllerle ideal kilonuzu hesaplayın
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Calculator Form */}
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl shadow-lg shadow-pink-500/50">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Bilgilerinizi Girin</h2>
              </div>

              <form onSubmit={calculateIdealWeight} className="space-y-8">
                {/* Gender */}
                <div className="space-y-4">
                  <label className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-pink-400" />
                    Cinsiyet
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      className={`p-4 rounded-2xl font-bold transition-all duration-300 ${
                        gender === "male"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-2xl shadow-blue-500/50 scale-105"
                          : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      👨 Erkek
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      className={`p-4 rounded-2xl font-bold transition-all duration-300 ${
                        gender === "female"
                          ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-2xl shadow-pink-500/50 scale-105"
                          : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      👩 Kadın
                    </button>
                  </div>
                </div>

                {/* Height */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Boy (cm)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                      {height}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="140"
                    max="220"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-400 [&::-webkit-slider-thumb]:to-cyan-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-blue-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                  />
                  <div className="flex justify-between text-xs text-gray-400 px-1">
                    <span>140 cm</span>
                    <span>220 cm</span>
                  </div>
                </div>

                {/* Current Weight (Optional) */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Mevcut Kilonuz (İsteğe Bağlı)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                      {currentWeight > 0 ? currentWeight : '-'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-orange-400 [&::-webkit-slider-thumb]:to-red-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-orange-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                  />
                  <div className="flex justify-between text-xs text-gray-400 px-1">
                    <span>Belirtmek istemiyorum</span>
                    <span>200 kg</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-16 text-xl font-black bg-gradient-to-r from-pink-500 via-rose-600 to-red-500 hover:from-pink-600 hover:via-rose-700 hover:to-red-600 shadow-2xl shadow-pink-500/50 rounded-2xl border-2 border-pink-400/50 hover:scale-105 transition-all duration-300"
                >
                  <Zap className="w-6 h-6 mr-2 animate-pulse" />
                  İdeal Kilo Hesapla
                </Button>
              </form>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {/* Devine Formula */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-3xl border border-pink-400/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300">
                  <h3 className="text-2xl font-black text-white mb-4">Devine Formülü</h3>
                  <div className="text-6xl font-black bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent mb-2">
                    {result.divine} kg
                  </div>
                  <p className="text-gray-300 text-sm">En yaygın kullanılan ideal kilo formülü</p>
                </div>

                {/* Broca Formula */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-rose-500/20 to-red-600/20 rounded-3xl border border-rose-400/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300">
                  <h3 className="text-2xl font-black text-white mb-4">Broca Formülü</h3>
                  <div className="text-6xl font-black bg-gradient-to-r from-rose-300 to-red-400 bg-clip-text text-transparent mb-2">
                    {result.broca} kg
                  </div>
                  <p className="text-gray-300 text-sm">Alternatif ideal kilo hesaplama yöntemi</p>
                </div>

                {/* Current Status */}
                {result.current > 0 && (
                  <div className={`backdrop-blur-2xl rounded-3xl border p-8 shadow-2xl ${
                    result.difference > 0 
                      ? 'bg-gradient-to-br from-orange-500/20 to-amber-600/20 border-orange-400/30' 
                      : result.difference < 0
                      ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-400/30'
                      : 'bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-400/30'
                  }`}>
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className={`w-8 h-8 animate-pulse ${
                        result.difference > 0 ? 'text-orange-400' : result.difference < 0 ? 'text-green-400' : 'text-blue-400'
                      }`} />
                      <h3 className="text-2xl font-black text-white">Mevcut Durumunuz</h3>
                    </div>
                    <div className={`text-5xl font-black mb-3 bg-gradient-to-r ${
                      result.difference > 0 
                        ? 'from-orange-300 to-amber-400' 
                        : result.difference < 0
                        ? 'from-green-300 to-emerald-400'
                        : 'from-blue-300 to-cyan-400'
                    } bg-clip-text text-transparent`}>
                      {result.difference === 0 ? 'İdeal Kilodasınız!' : 
                       result.difference > 0 ? `+${result.difference} kg fazla` : 
                       `${Math.abs(result.difference)} kg eksik`}
                    </div>
                    <p className="text-gray-300">
                      {result.difference === 0 ? 'Tebrikler! İdeal kilo aralığındasınız.' :
                       result.difference > 0 ? 'İdeal kilonuza ulaşmak için vermeniz gereken kilo (Devine formülüne göre)' :
                       'İdeal kilonuza ulaşmak için almanız gereken kilo (Devine formülüne göre)'}
                    </p>
                  </div>
                )}

                {/* Visual Comparison */}
                {result.current > 0 && (
                  <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-8 shadow-2xl">
                    <h3 className="text-2xl font-black text-white mb-6">Görsel Karşılaştırma</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-semibold">Mevcut Kilo</span>
                          <span className="text-xl font-black text-orange-400">{result.current} kg</span>
                        </div>
                        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-lg shadow-orange-500/50"
                            style={{ width: `${(result.current / Math.max(result.current, result.divine, result.broca)) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-semibold">İdeal Kilo (Devine)</span>
                          <span className="text-xl font-black text-pink-400">{result.divine} kg</span>
                        </div>
                        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-pink-500 to-rose-600 rounded-full shadow-lg shadow-pink-500/50"
                            style={{ width: `${(result.divine / Math.max(result.current, result.divine, result.broca)) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-semibold">İdeal Kilo (Broca)</span>
                          <span className="text-xl font-black text-rose-400">{result.broca} kg</span>
                        </div>
                        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full shadow-lg shadow-rose-500/50"
                            style={{ width: `${(result.broca / Math.max(result.current, result.divine, result.broca)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SEO Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-12">
              <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                İdeal Kilo Nedir ve Nasıl Hesaplanır?
              </h2>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                İdeal vücut ağırlığı, kişinin sağlığını optimize edecek ve kronik hastalık risklerini minimize edecek kilo aralığıdır. 
                Bu kavram, yalnızca estetik kaygılardan değil, kalp sağlığı, metabolik fonksiyonlar ve yaşam kalitesi gibi faktörlerden 
                etkilenir. İdeal kilo hesaplamak için birçok formül geliştirilmiştir ve en popüler ikisi Devine ve Broca formülleridir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                Devine Formülü: Altın Standart
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                1974 yılında Dr. Ben J. Devine tarafından geliştirilen bu formül, ilaç dozajı hesaplamak için tasarlanmış olsa da 
                bugün ideal kilo hesaplamada en yaygın kullanılan yöntemdir. Erkekler için: 50 kg + 2.3 kg × (boy - 152.4 cm) / 2.54, 
                kadınlar için: 45.5 kg + 2.3 kg × (boy - 152.4 cm) / 2.54 formülü kullanılır. Bu formül özellikle Batı toplumları için 
                optimize edilmiştir ve orta yapılı bireyler için oldukça doğru sonuçlar verir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Broca Formülü: Basit ve Pratik
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                19. yüzyılda Fransız cerrah Paul Broca tarafından geliştirilen bu formül daha basittir: Erkekler için (boy - 100) × 0.9, 
                kadınlar için (boy - 100) × 0.85. Örneğin 170 cm boyundaki bir erkek için ideal kilo (170 - 100) × 0.9 = 63 kg'dır. 
                Bu formül Avrupa'da hala yaygın kullanılır ve pratik olması nedeniyle tercih edilir. Ancak çok uzun veya çok kısa bireyler 
                için Devine formülü kadar hassas değildir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                İdeal Kilo ile BMI Arasındaki Fark
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                İdeal kilo formülleri mutlak bir sayı verirken, BMI bir aralık sunar (18.5-24.9). İdeal kilo hesaplamaları genellikle 
                daha kişiselleştirilmiş sonuçlar verir çünkü cinsiyet farkını dikkate alır. Ancak her iki yöntem de kas kütlesi, 
                kemik yoğunluğu ve vücut kompozisyonunu göz ardı eder. Örneğin bir sporcu, ideal kilosunun üstünde olabilir ama 
                vücut yağ oranı düşüktür. Bu nedenle bu hesaplamaları bir başlangıç noktası olarak görün ve vücut kompozisyon analizi, 
                bel çevresi ölçümü gibi ek yöntemlerle destekleyin.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                İdeal Kiloya Ulaşmak İçin Stratejiler
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                İdeal kilonuzun üzerindeyseniz, hızlı sonuç vaat eden sert diyetlerden kaçının. Yavaş ve sürdürülebilir kilo kaybı 
                en etkilidir. Haftada 0.5-1 kg hedefleyin; bu günlük 500-1000 kalori açığı demektir. İdeal kilonuzun altındaysanız, 
                sağlıklı kilo almak için protein açısından zengin bir diyet ve kuvvet antrenmanı yapın. Her iki durumda da bir diyetisyen 
                veya beslenme uzmanı ile çalışmak size kişiselleştirilmiş bir plan sağlayacaktır. Unutmayın: Bu hesaplamalar genel 
                rehberdir; kişisel sağlık durumunuz farklılık gösterebilir.
              </p>

              <div className="mt-12 text-center">
                <a 
                  href="/hesaplayicilar" 
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-lg hover:from-pink-600 hover:to-rose-700 shadow-2xl shadow-pink-500/50 border border-pink-400/30 hover:scale-105 transition-all duration-300"
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
