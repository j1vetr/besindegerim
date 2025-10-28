import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Activity, Zap, TrendingUp, AlertCircle } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface BodyFatCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface BodyFatResult {
  bodyFatPercentage: number;
  category: string;
  fatMass: number;
  leanMass: number;
  healthStatus: string;
  color: string;
}

export default function BodyFatCalculator({ categoryGroups, currentPath }: BodyFatCalculatorProps) {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState<number>(30);
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175);
  const [waist, setWaist] = useState<number>(85);
  const [neck, setNeck] = useState<number>(38);
  const [hip, setHip] = useState<number>(95);
  const [result, setResult] = useState<BodyFatResult | null>(null);

  const calculateBodyFat = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Navy Method formula
    let bodyFat: number;
    if (gender === "male") {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    }

    const fatMass = (weight * bodyFat) / 100;
    const leanMass = weight - fatMass;

    let category = "";
    let healthStatus = "";
    let color = "";

    if (gender === "male") {
      if (bodyFat < 6) { category = "Esansiyel Yağ"; healthStatus = "Çok Düşük - Sağlık Riski"; color = "from-blue-500 to-cyan-600"; }
      else if (bodyFat < 14) { category = "Atletik"; healthStatus = "Mükemmel"; color = "from-green-500 to-emerald-600"; }
      else if (bodyFat < 18) { category = "Fit"; healthStatus = "İyi"; color = "from-lime-500 to-green-600"; }
      else if (bodyFat < 25) { category = "Ortalama"; healthStatus = "Kabul Edilebilir"; color = "from-yellow-500 to-orange-600"; }
      else { category = "Obez"; healthStatus = "Yüksek - Sağlık Riski"; color = "from-orange-500 to-red-600"; }
    } else {
      if (bodyFat < 14) { category = "Esansiyel Yağ"; healthStatus = "Çok Düşük - Sağlık Riski"; color = "from-blue-500 to-cyan-600"; }
      else if (bodyFat < 21) { category = "Atletik"; healthStatus = "Mükemmel"; color = "from-green-500 to-emerald-600"; }
      else if (bodyFat < 25) { category = "Fit"; healthStatus = "İyi"; color = "from-lime-500 to-green-600"; }
      else if (bodyFat < 32) { category = "Ortalama"; healthStatus = "Kabul Edilebilir"; color = "from-yellow-500 to-orange-600"; }
      else { category = "Obez"; healthStatus = "Yüksek - Sağlık Riski"; color = "from-orange-500 to-red-600"; }
    }

    setResult({
      bodyFatPercentage: parseFloat(bodyFat.toFixed(1)),
      category,
      fatMass: parseFloat(fatMass.toFixed(1)),
      leanMass: parseFloat(leanMass.toFixed(1)),
      healthStatus,
      color
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-indigo-400 hover:text-indigo-300 font-medium text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full inline-block border border-indigo-500/30">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full px-6 py-3 mb-6 shadow-2xl shadow-indigo-500/50 border border-indigo-400/30">
              <Activity className="w-6 h-6 animate-pulse" />
              <span className="font-bold">Navy Method - En Doğru Sonuç</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              Vücut Yağ Yüzdesi Hesaplayıcı
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Vücut ölçümlerinize göre yağ yüzdenizi hesaplayın - BMI'dan çok daha doğru!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Calculator Form */}
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/50">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Ölçümlerinizi Girin</h2>
              </div>

              <form onSubmit={calculateBodyFat} className="space-y-8">
                {/* Gender */}
                <div className="space-y-4">
                  <label className="text-lg font-bold text-white">Cinsiyet</label>
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

                {/* Age */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Yaş</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                      {age}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-400 [&::-webkit-slider-thumb]:to-pink-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-purple-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                  />
                </div>

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
                    min="40"
                    max="150"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-orange-400 [&::-webkit-slider-thumb]:to-red-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-orange-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                  />
                </div>

                {/* Height */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Boy (cm)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                      {height}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="140"
                    max="210"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-green-400 [&::-webkit-slider-thumb]:to-emerald-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-green-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                  />
                </div>

                {/* Waist */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Bel Çevresi (cm)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                      {waist}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="140"
                    value={waist}
                    onChange={(e) => setWaist(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-400 [&::-webkit-slider-thumb]:to-cyan-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-blue-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                  />
                </div>

                {/* Neck */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Boyun Çevresi (cm)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                      {neck}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="50"
                    value={neck}
                    onChange={(e) => setNeck(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-yellow-400 [&::-webkit-slider-thumb]:to-amber-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-yellow-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                  />
                </div>

                {/* Hip (Female only) */}
                {gender === "female" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-lg font-bold text-white">Kalça Çevresi (cm)</label>
                      <span className="text-4xl font-black bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                        {hip}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="70"
                      max="140"
                      value={hip}
                      onChange={(e) => setHip(parseInt(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-pink-500/20 to-rose-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-400 [&::-webkit-slider-thumb]:to-rose-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-pink-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-16 text-xl font-black bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 shadow-2xl shadow-indigo-500/50 rounded-2xl border-2 border-indigo-400/50 hover:scale-105 transition-all duration-300"
                >
                  <Zap className="w-6 h-6 mr-2 animate-pulse" />
                  Yağ Yüzdesini Hesapla
                </Button>
              </form>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {/* Main Result */}
                <div className={`backdrop-blur-2xl bg-gradient-to-br ${result.color}/20 rounded-3xl border border-${result.color.split(' ')[1].split('-')[1]}-400/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300`}>
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-8 h-8 text-white animate-pulse" />
                    <h3 className="text-2xl font-black text-white">Vücut Yağ Yüzdeniz</h3>
                  </div>
                  <div className="text-8xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4">
                    %{result.bodyFatPercentage}
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-white">{result.category}</p>
                    <p className="text-lg text-gray-200">{result.healthStatus}</p>
                  </div>
                </div>

                {/* Fat & Lean Mass */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="backdrop-blur-2xl bg-gradient-to-br from-red-500/20 to-orange-600/20 rounded-3xl border border-red-400/30 p-6 shadow-2xl">
                    <h3 className="text-lg font-black text-white mb-2">Yağ Kütlesi</h3>
                    <div className="text-4xl font-black bg-gradient-to-r from-red-300 to-orange-400 bg-clip-text text-transparent">
                      {result.fatMass} kg
                    </div>
                  </div>
                  <div className="backdrop-blur-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-3xl border border-green-400/30 p-6 shadow-2xl">
                    <h3 className="text-lg font-black text-white mb-2">Yağsız Kütle</h3>
                    <div className="text-4xl font-black bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                      {result.leanMass} kg
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-3xl border border-blue-400/30 p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-black text-white">Nasıl Ölçülür?</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Bel: Göbeğin en geniş noktasından ölçün</li>
                    <li>• Boyun: Gırtlağın hemen altından ölçün</li>
                    <li>• Kalça (kadınlar): Kalçanın en geniş noktasından ölçün</li>
                    <li>• Sabah aç karnına ölçüm yapın</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* SEO Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-12">
              <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Vücut Yağ Yüzdesi Nedir ve Neden Önemlidir?
              </h2>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Vücut yağ yüzdesi, toplam vücut ağırlığınızın yüzde kaçının yağdan oluştuğunu gösteren kritik bir sağlık göstergesidir. BMI (Vücut Kitle İndeksi) sadece kilo ve boyunuzu dikkate alırken, vücut yağ yüzdesi kas kütlesi ile yağ kütlesi arasındaki farkı ortaya koyar. İki kişi aynı BMI'ye sahip olabilir ancak biri atletik ve kaslı, diğeri yüksek yağ oranına sahip olabilir. Bu yüzden vücut yağ yüzdesi gerçek sağlık durumunuzu anlamak için çok daha doğru bir ölçümdür. Esansiyel yağ hayati fonksiyonlar için gereklidir; erkekler için %3-5, kadınlar için %8-12 oranında olmalıdır. Atletik bireyler erkeklerde %6-13, kadınlarda %14-20 arasında yağ yüzdesine sahiptir. Sağlıklı aralık erkekler için %14-17, kadınlar için %21-24'tür. %25'in üzerindeki (erkekler) veya %32'nin üzerindeki (kadınlar) değerler obezite riski taşır.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Navy Method: En Doğru Vücut Yağ Hesaplama Yöntemi
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Navy Method (ABD Donanması Yöntemi), vücut yağ yüzdesini hesaplamak için kullanılan en güvenilir ve bilimsel olarak kanıtlanmış yöntemlerden biridir. Bu yöntem, boy, bel çevresi ve boyun çevresi ölçümlerini kullanır; kadınlar için kalça çevresi de eklenir. Yöntemin doğruluğu %3-4 hata payı ile profesyonel DEXA taraması ile karşılaştırılabilir düzeydedir. Biyoelektrik empedans analizi (vücut yağ ölçerler) su dengesi, yemek zamanlaması ve egzersizden etkilenirken, Navy Method bu dış faktörlerden bağımsızdır. Ölçümler basittir: bir mezura yeterlidir. Erkekler için formül: 495 / (1.0324 - 0.19077 × log10(bel - boyun) + 0.15456 × log10(boy)) - 450. Kadınlar için: 495 / (1.29579 - 0.35004 × log10(bel + kalça - boyun) + 0.22100 × log10(boy)) - 450. Doğru ölçüm için sabah aç karnına, tuvaletten sonra ölçün. Mezurayı cildinize sıkı ama rahat şekilde tutun; çok gevşek veya çok sıkı olmasın.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Vücut Yağ Kategorileri ve Sağlık Etkileri
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Erkekler için esansiyel yağ %2-5 aralığındadır; bunun altına düşmek hormon dengesizliği, bağışıklık sistemi zayıflaması ve organ hasarına yol açar. Atletik seviye %6-13 arasıdır; profesyonel sporcular bu aralıkta olur. Görünür karın kasları (six-pack) genellikle %10'un altında belirginleşir. Fit seviye %14-17'dir; bu sağlıklı ve sürdürülebilir bir aralıktır. Ortalama %18-24 kabul edilebilir ancak sağlık riskleri artmaya başlar. %25'in üzerinde obezite başlar; tip 2 diyabet, kalp hastalıkları, yüksek tansiyon ve bazı kanser türleri riski artar. Kadınlar için esansiyel yağ %10-13'tür; bunun altına düşmek menstrüel siklusu bozar ve kemik yoğunluğunu azaltır. Atletik seviye %14-20 arasıdır; bu aralıkta kadınlar fit ve sağlıklıdır. Fit seviye %21-24'tür; görünür kas tanımı ve sağlıklı görünüm vardır. Ortalama %25-31 kabul edilebilir. %32'nin üzerinde obezite riski başlar. Kadınlarda yağ dağılımı erkeklerden farklıdır; genellikle kalça, uyluk ve göğüs bölgesinde birikir (subkutan yağ). Erkeklerde karın bölgesinde (visseral yağ) birikir ki bu daha tehlikelidir çünkü organları sarar ve metabolik hastalık riskini artırır.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Vücut Yağ Yüzdesini Azaltma Stratejileri
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Kalori açığı yaratmak temel prensiptir; yediğinizden daha fazla yakmalısınız. Ancak aşırı açık (günlük 1000+ kalori) kas kaybına neden olur; günlük 300-500 kalori açığı idealdir. Protein alımını artırın; kilogram başına 1.6-2.2g protein kas kaybını önler ve tokluk hissi verir. Dirençli antrenman (ağırlık kaldırma) yapın; haftada 3-4 gün kuvvet antrenmanı metabolizmayı yükseltir ve kas kütlesini korur. Kardio egzersizleri ekleyin ancak aşırı yapmayın; haftada 150-300 dakika orta yoğunlukta kardio yeterlidir. HIIT (High-Intensity Interval Training) yağ yakımını hızlandırır. Uyku kalitesi kritiktir; az uyku grelin (açlık hormonu) artırır ve leptin (tokluk hormonu) azaltır. Günde 7-9 saat kaliteli uyku hedefleyin. Stres yönetimi önemlidir; kronik stres kortizol seviyesini yükseltir ve karın bölgesinde yağ birikimine neden olur. Meditasyon, yoga ve derin nefes egzersizleri stresi azaltır. İşlenmiş gıdalardan kaçının; bunlar yüksek kalori, düşük besin değeri sunar. Sebze, meyve, tam tahıllar ve yağsız proteinler tüketin. Şekerli içecekleri kesin; bunlar boş kalori ve insülin direncine yol açar. Su için; günde 2-3 litre su metabolizmayı destekler. Sabırlı olun; sağlıklı yağ kaybı ayda %1-2 oranındadır. Hızlı diyetler geçicidir ve yoyo etkisi yaratır.
              </p>

              <div className="mt-12 text-center">
                <a 
                  href="/hesaplayicilar" 
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg hover:from-indigo-600 hover:to-purple-700 shadow-2xl shadow-indigo-500/50 border border-indigo-400/30 hover:scale-105 transition-all duration-300"
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
