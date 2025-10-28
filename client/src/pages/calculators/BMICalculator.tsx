import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Scale, TrendingUp, Heart, AlertCircle, Zap } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface BMICalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  healthyMin: number;
  healthyMax: number;
  recommendation: string;
}

export default function BMICalculator({ categoryGroups, currentPath }: BMICalculatorProps) {
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [result, setResult] = useState<BMIResult | null>(null);

  const getBMICategory = (bmi: number): { category: string; color: string; recommendation: string } => {
    if (bmi < 18.5) {
      return {
        category: "Zayıf",
        color: "from-blue-400 to-blue-600",
        recommendation: "Sağlıklı kilo almak için kalori açığınızı kapatın ve dengeli beslenin. Protein, karbonhidrat ve sağlıklı yağları dengeli tüketin."
      };
    } else if (bmi < 25) {
      return {
        category: "Normal Kilolu (Sağlıklı)",
        color: "from-green-400 to-green-600",
        recommendation: "Harika! Sağlıklı kilo aralığındasınız. Mevcut beslenme ve egzersiz rutininizi sürdürün."
      };
    } else if (bmi < 30) {
      return {
        category: "Fazla Kilolu",
        color: "from-yellow-400 to-orange-500",
        recommendation: "Sağlıklı kilo vermek için günlük 300-500 kalori açığı oluşturun. Düzenli egzersiz ve dengeli beslenme önemlidir."
      };
    } else if (bmi < 35) {
      return {
        category: "Obezite (1. Derece)",
        color: "from-orange-500 to-red-500",
        recommendation: "Sağlık riskleri artmaktadır. Bir diyetisyen ve doktor gözetiminde kilo verme programı başlatın."
      };
    } else if (bmi < 40) {
      return {
        category: "Obezite (2. Derece)",
        color: "from-red-500 to-red-700",
        recommendation: "Ciddi sağlık riskleri var. Mutlaka uzman gözetiminde kapsamlı bir program gereklidir."
      };
    } else {
      return {
        category: "Obezite (3. Derece / Morbid)",
        color: "from-red-700 to-red-900",
        recommendation: "Acil tıbbi değerlendirme gereklidir. Bir endokrinolog ve diyetisyen ile çalışmanız önerilir."
      };
    }
  };

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const w = weight;
    const h = height / 100;
    const bmi = w / (h * h);
    const { category, color, recommendation } = getBMICategory(bmi);
    
    const healthyMin = 18.5 * (h * h);
    const healthyMax = 24.9 * (h * h);

    setResult({
      bmi: parseFloat(bmi.toFixed(1)),
      category,
      color,
      healthyMin: parseFloat(healthyMin.toFixed(1)),
      healthyMax: parseFloat(healthyMax.toFixed(1)),
      recommendation
    });
  };

  // BMI meter visualization
  const getBMIPosition = (bmi: number) => {
    if (bmi < 15) return 0;
    if (bmi > 40) return 100;
    return ((bmi - 15) / 25) * 100;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-blue-400 hover:text-blue-300 font-medium text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full inline-block border border-blue-500/30">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full px-6 py-3 mb-6 shadow-2xl shadow-blue-500/50 border border-blue-400/30">
              <Scale className="w-6 h-6 animate-pulse" />
              <span className="font-bold">WHO Standartları</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-cyan-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-2xl">
              BMI (Vücut Kitle İndeksi) Hesaplayıcı
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Dünya Sağlık Örgütü standartlarına göre BMI değerinizi ve sağlıklı kilo aralığınızı öğrenin
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Calculator Form */}
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl shadow-lg shadow-blue-500/50">
                  <Scale className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">BMI Hesapla</h2>
              </div>

              <form onSubmit={calculateBMI} className="space-y-8">
                {/* Weight Slider */}
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

                {/* Height Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Boy (cm)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                      {height}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="220"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-400 [&::-webkit-slider-thumb]:to-cyan-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-blue-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                  />
                  <div className="flex justify-between text-xs text-gray-400 px-1">
                    <span>120 cm</span>
                    <span>220 cm</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-16 text-xl font-black bg-gradient-to-r from-blue-500 via-cyan-600 to-indigo-500 hover:from-blue-600 hover:via-cyan-700 hover:to-indigo-600 shadow-2xl shadow-blue-500/50 rounded-2xl border-2 border-blue-400/50 hover:scale-105 transition-all duration-300"
                >
                  <Zap className="w-6 h-6 mr-2 animate-pulse" />
                  BMI Hesapla
                </Button>
              </form>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {/* Main BMI Result */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="w-8 h-8 text-cyan-400 animate-pulse" />
                    <h3 className="text-2xl font-black text-white">BMI Değeriniz</h3>
                  </div>

                  <div className={`bg-gradient-to-br ${result.color} rounded-2xl p-8 text-white shadow-2xl mb-6`}>
                    <div className="text-7xl font-black mb-2">{result.bmi}</div>
                    <div className="text-2xl font-bold">{result.category}</div>
                  </div>

                  {/* BMI Meter */}
                  <div className="space-y-3">
                    <div className="text-sm text-gray-300 font-semibold">BMI Skalası (WHO)</div>
                    <div className="relative h-6 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-600 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 h-full w-1 bg-white shadow-2xl shadow-white/50 transition-all duration-500"
                        style={{ left: `${getBMIPosition(result.bmi)}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-2 py-1 rounded text-xs font-bold">
                          {result.bmi}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>15</span>
                      <span>18.5</span>
                      <span>25</span>
                      <span>30</span>
                      <span>35</span>
                      <span>40</span>
                    </div>
                  </div>
                </div>

                {/* Healthy Range */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-3xl border border-green-400/30 p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-8 h-8 text-green-400 animate-pulse" />
                    <h3 className="text-2xl font-black text-white">Sağlıklı Kilo Aralığınız</h3>
                  </div>
                  <div className="text-5xl font-black bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent mb-2">
                    {result.healthyMin} - {result.healthyMax} kg
                  </div>
                  <p className="text-gray-300 text-sm">Boyunuza göre ideal kilo aralığı (BMI 18.5-24.9)</p>
                </div>

                {/* Recommendation */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-3xl border border-purple-400/30 p-8 shadow-2xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-2xl font-black text-white mb-3">Öneri</h3>
                      <p className="text-gray-300 leading-relaxed">{result.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEO Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-12">
              <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                BMI (Vücut Kitle İndeksi) Nedir ve Neden Önemlidir?
              </h2>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Vücut Kitle İndeksi (Body Mass Index - BMI), kilo ve boy arasındaki oranı kullanarak vücut yağ oranını tahmin eden, 
                dünya genelinde kabul görmüş bir sağlık göstergesidir. 19. yüzyılda Belçikalı matematikçi Adolphe Quetelet tarafından 
                geliştirilen bu formül, Dünya Sağlık Örgütü (WHO) tarafından obezite ve kilo problemlerini tespit etmek için standart 
                bir ölçüm yöntemi olarak kullanılmaktadır. BMI = Kilo (kg) / Boy² (m²) formülüyle hesaplanır ve 18.5 ile 24.9 arası 
                değerler normal kabul edilir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                BMI Kategorileri ve Sağlık Riskleri
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                WHO'ya göre BMI değerleri altı ana kategoriye ayrılır. 18.5'in altındaki değerler "zayıf" kategorisinde yer alır ve 
                yetersiz beslenme, kemik erimesi, bağışıklık sistemi zayıflığı gibi riskler taşır. 18.5-24.9 arası "normal" kabul edilir 
                ve bu aralıkta olmak kronik hastalık risklerini minimize eder. 25-29.9 arası "fazla kilolu" kategorisindedir; kalp hastalığı, 
                diyabet ve yüksek tansiyon riski artar. 30-34.9 arası 1. derece obezite, 35-39.9 arası 2. derece obezite, 40 ve üzeri ise 
                morbid obezite olarak sınıflandırılır ve ciddi sağlık problemlerine yol açar.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                BMI'nın Sınırlamaları: Tek Başına Yeterli Değil
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                BMI pratikte kullanışlı olsa da bazı önemli sınırlamaları vardır. Kas kütlesi yüksek olan sporcuların BMI'si yüksek 
                çıkabilir çünkü kas dokusu yağ dokusundan daha ağırdır. Örneğin profesyonel bir vücut geliştirici "obez" kategorisinde 
                görünebilir ama aslında vücut yağ oranı çok düşüktür. Ayrıca BMI yaş, cinsiyet ve etnik köken farklılıklarını hesaba katmaz. 
                Kadınlar erkeklere göre doğal olarak daha yüksek vücut yağ oranına sahiptir ama aynı BMI standardı kullanılır. 
                Asya kökenli insanlarda daha düşük BMI değerlerinde bile sağlık riskleri görülebilir. Bu nedenle BMI'yı bel çevresi ölçümü, 
                vücut yağ oranı analizi ve kan testleriyle birlikte değerlendirmek gerekir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Sağlıklı Kilo Aralığına Ulaşmak İçin İpuçları
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Eğer BMI değeriniz normal aralığın dışındaysa, panik yapmayın. Küçük değişikliklerle büyük farklar yaratabilirsiniz. 
                Kilo vermek istiyorsanız, günlük kalori ihtiyacınızdan 300-500 kcal eksik alın; bu haftada 0.25-0.5 kg sağlıklı kilo 
                kaybı sağlar. Hızlı kilo verme diyetleri genellikle sürdürülemez ve yoyo etkisi yaratır. Bunun yerine dengeli beslenme, 
                düzenli egzersiz ve yeterli uyku alışkanlıkları edinin. Proteinden zengin gıdalar (tavuk, balık, yumurta, baklagiller) 
                tokluk hissi verir ve kas kaybını önler. Tam tahıllar (yulaf, esmer pirinç, tam buğday ekmeği) kan şekerini dengeleyerek 
                aşırı yeme isteğini azaltır. Sebze ve meyveleri bol tüketin; lif içeriği sayesinde hem tokluk hissi verir hem de 
                sindirim sistemini düzenler.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Egzersiz ve Aktivite Seviyesini Artırma
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                BMI'nizi düşürmek için diyet kadar egzersiz de önemlidir. Haftada en az 150 dakika orta yoğunlukta (hızlı yürüyüş, 
                bisiklet, yüzme) veya 75 dakika yoğun (koşu, HIIT) kardiyovasküler egzersiz yapın. Ayrıca haftada 2-3 kez direnç 
                antrenmanı (ağırlık kaldırma, vücut ağırlığı egzersizleri) ekleyin. Kas kütlesi arttıkça bazal metabolizma hızınız 
                yükselir ve dinlenirken bile daha fazla kalori yakarsınız. Günlük yaşamınızda da aktif olmaya çalışın: asansör yerine 
                merdiven kullanın, araba yerine yürüyerek gidin, masa başında çalışıyorsanız her saatte kalkıp kısa bir yürüyüş yapın.
              </p>

              <div className="mt-12 text-center">
                <a 
                  href="/hesaplayicilar" 
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold text-lg hover:from-blue-600 hover:to-cyan-700 shadow-2xl shadow-blue-500/50 border border-blue-400/30 hover:scale-105 transition-all duration-300"
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
