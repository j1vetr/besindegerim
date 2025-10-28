import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Flame, Zap, TrendingUp, Activity } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface BMRCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface BMRResult {
  bmr: number;
  tdee: number;
  formula: string;
  activityLevel: string;
  activityMultiplier: number;
}

export default function BMRCalculator({ categoryGroups, currentPath }: BMRCalculatorProps) {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState<number>(30);
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175);
  const [activity, setActivity] = useState<number>(1.55);
  const [formula, setFormula] = useState<"harris" | "mifflin">("mifflin");
  const [result, setResult] = useState<BMRResult | null>(null);

  const activityLevels = [
    { value: 1.2, label: "Hareketsiz", desc: "Hiç egzersiz yok", icon: "🛋️" },
    { value: 1.375, label: "Az Aktif", desc: "Haftada 1-3 gün", icon: "🚶" },
    { value: 1.55, label: "Orta Aktif", desc: "Haftada 3-5 gün", icon: "🏃" },
    { value: 1.725, label: "Çok Aktif", desc: "Haftada 6-7 gün", icon: "💪" },
    { value: 1.9, label: "Ekstra Aktif", desc: "Günde 2x egzersiz", icon: "🏋️" }
  ];

  const calculateBMR = (e: React.FormEvent) => {
    e.preventDefault();
    
    let bmr: number;
    let formulaName: string;

    if (formula === "harris") {
      // Harris-Benedict Formula
      if (gender === "male") {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
      formulaName = "Harris-Benedict";
    } else {
      // Mifflin-St Jeor Formula (more accurate)
      if (gender === "male") {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
      } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
      }
      formulaName = "Mifflin-St Jeor";
    }

    const tdee = bmr * activity;
    const activityLabel = activityLevels.find(a => a.value === activity)?.label || "";

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      formula: formulaName,
      activityLevel: activityLabel,
      activityMultiplier: activity
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-400 to-red-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-red-400 to-pink-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-orange-400 hover:text-orange-300 font-medium text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full inline-block border border-orange-500/30">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full px-6 py-3 mb-6 shadow-2xl shadow-orange-500/50 border border-orange-400/30">
              <Flame className="w-6 h-6 animate-pulse" />
              <span className="font-bold">Metabolizma Hızınızı Keşfedin</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-orange-400 via-red-500 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              Bazal Metabolizma Hızı (BMR) Hesaplayıcı
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Dinlenirken yaktığınız kaloriyi öğrenin ve günlük kalori ihtiyacınızı belirleyin
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg shadow-orange-500/50">
                  <Flame className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Bilgilerinizi Girin</h2>
              </div>

              <form onSubmit={calculateBMR} className="space-y-8">
                {/* Formula Selection */}
                <div className="space-y-4">
                  <label className="text-lg font-bold text-white">Formül Seçimi</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormula("mifflin")}
                      className={`p-4 rounded-2xl font-bold transition-all duration-300 ${
                        formula === "mifflin"
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/50 scale-105"
                          : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      <div className="text-sm">Mifflin-St Jeor</div>
                      <div className="text-xs opacity-75">(Daha Doğru)</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormula("harris")}
                      className={`p-4 rounded-2xl font-bold transition-all duration-300 ${
                        formula === "harris"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-2xl shadow-blue-500/50 scale-105"
                          : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      <div className="text-sm">Harris-Benedict</div>
                      <div className="text-xs opacity-75">(Klasik)</div>
                    </button>
                  </div>
                </div>

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
                        <div className="text-xs opacity-75 mt-1">{level.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-16 text-xl font-black bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 hover:from-orange-600 hover:via-red-700 hover:to-pink-600 shadow-2xl shadow-orange-500/50 rounded-2xl border-2 border-orange-400/50 hover:scale-105 transition-all duration-300"
                >
                  <Zap className="w-6 h-6 mr-2 animate-pulse" />
                  BMR ve TDEE'yi Hesapla
                </Button>
              </form>
            </div>

            {result && (
              <div className="space-y-6">
                <div className="backdrop-blur-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-3xl border border-orange-400/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
                    <h3 className="text-2xl font-black text-white">Bazal Metabolizma Hızınız</h3>
                  </div>
                  <div className="text-7xl font-black bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent mb-2">
                    {result.bmr}
                  </div>
                  <p className="text-gray-300 text-sm mb-4">kalori/gün (dinlenme durumunda)</p>
                  <div className="text-sm text-gray-300 bg-white/5 rounded-xl p-4">
                    Hesaplama: {result.formula}
                  </div>
                </div>

                <div className="backdrop-blur-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-3xl border border-green-400/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-8 h-8 text-green-400 animate-pulse" />
                    <h3 className="text-2xl font-black text-white">Günlük Kalori İhtiyacınız (TDEE)</h3>
                  </div>
                  <div className="text-7xl font-black bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent mb-2">
                    {result.tdee}
                  </div>
                  <p className="text-gray-300 text-sm mb-4">kalori/gün ({result.activityLevel})</p>
                  <div className="text-sm text-gray-300 bg-white/5 rounded-xl p-4">
                    BMR × {result.activityMultiplier} = {result.tdee} kcal
                  </div>
                </div>

                <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-3xl border border-blue-400/30 p-8 shadow-2xl">
                  <h3 className="text-2xl font-black text-white mb-4">Hedef Kalori Alımınız</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-300 mb-2">Kilo Ver</div>
                      <div className="text-3xl font-black bg-gradient-to-r from-red-300 to-orange-400 bg-clip-text text-transparent">
                        {result.tdee - 500}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">-500 kcal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-300 mb-2">Koru</div>
                      <div className="text-3xl font-black bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                        {result.tdee}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">TDEE</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-300 mb-2">Kilo Al</div>
                      <div className="text-3xl font-black bg-gradient-to-r from-blue-300 to-cyan-400 bg-clip-text text-transparent">
                        {result.tdee + 300}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">+300 kcal</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEO Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-12">
              <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Bazal Metabolizma Hızı (BMR) Nedir?
              </h2>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Bazal Metabolizma Hızı (BMR), vücudunuzun tamamen dinlenme halindeyken hayatta kalmak için harcadığı minimum kalori miktarıdır. Yani hiçbir fiziksel aktivite yapmadan, sadece nefes alıp vermek, kalp atışı, kan dolaşımı, hücre üretimi, beyin fonksiyonları ve vücut sıcaklığını korumak için yakılan enerjidir. BMR, toplam günlük enerji harcamasının (TDEE) %60-75'ini oluşturur. BMR bireysel olarak değişir; yaş, cinsiyet, kilo, boy, kas kütlesi ve genetik faktörler etkilidir. Erkeklerin BMR'si genellikle kadınlardan %5-10 daha yüksektir çünkü daha fazla kas kütlesine sahiptirler. Yaş ilerledikçe BMR azalır; her on yılda yaklaşık %2-3 düşer çünkü kas kütlesi azalır ve yağ kütlesi artar. Kas dokusu yağ dokusundan metabolik olarak daha aktiftir; 1 kg kas günde 13 kalori yakarken, 1 kg yağ sadece 4.5 kalori yakar.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                BMR Hesaplama Formülleri: Harris-Benedict ve Mifflin-St Jeor
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                En yaygın iki BMR formülü Harris-Benedict ve Mifflin-St Jeor'dur. Harris-Benedict formülü 1919'da geliştirilmiştir; erkekler için: BMR = 88.362 + (13.397 × kilo) + (4.799 × boy) - (5.677 × yaş). Kadınlar için: BMR = 447.593 + (9.247 × kilo) + (3.098 × boy) - (4.330 × yaş). Mifflin-St Jeor formülü 1990'da güncellenmiştir ve daha doğrudur; erkekler için: BMR = (10 × kilo) + (6.25 × boy) - (5 × yaş) + 5. Kadınlar için: BMR = (10 × kilo) + (6.25 × boy) - (5 × yaş) - 161. Mifflin-St Jeor %5 daha doğrudur çünkü modern yaşam tarzı ve vücut kompozisyonunu daha iyi yansıtır. Ancak her iki formül de ortalama değerler verir; gerçek BMR bireysel olarak %10-15 farklılık gösterebilir. En doğru ölçüm yöntemi indirekt kalorimetri (metabolik test) cihazlarıdır ancak bu pahalı ve uzmanlık gerektirir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                TDEE: Toplam Günlük Enerji Harcaması
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                TDEE (Total Daily Energy Expenditure), vücudunuzun bir günde toplam harcadığı enerjidir ve BMR'ye aktivite seviyenizi ekleyerek hesaplanır. TDEE = BMR × Aktivite Çarpanı. Hareketsiz yaşam (hiç egzersiz yok): BMR × 1.2. Az aktif (haftada 1-3 gün hafif egzersiz): BMR × 1.375. Orta aktif (haftada 3-5 gün orta egzersiz): BMR × 1.55. Çok aktif (haftada 6-7 gün yoğun egzersiz): BMR × 1.725. Ekstra aktif (günde 2x egzersiz veya fiziksel işçi): BMR × 1.9. TDEE'yi bilmek kilo yönetimi için kritiktir. Kilo vermek için TDEE'den günlük 300-500 kalori açığı yaratmalısınız. Kilo almak için TDEE'ye günlük 200-300 kalori fazlası eklemelisiniz. Kilonuzu korumak için TDEE kadar kalori almalısınız. Örnek: 75 kg, 175 cm, 30 yaşında erkek, orta aktif: BMR ≈ 1750 kcal, TDEE ≈ 1750 × 1.55 = 2713 kcal. Kilo vermek için günde 2213 kcal almalı (-500).
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                BMR'yi Artırma Yöntemleri
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Kas kütlesini artırmak BMR'yi yükseltmenin en etkili yoludur; dirençli antrenman (ağırlık kaldırma) yapın, haftada 3-4 gün. 2-3 kg kas kazanmak BMR'yi günde 50-75 kalori artırır. Protein alımını yükseltin; protein sindirimi termal etki yaratır ve metabolizmayı %15-30 hızlandırır (yağ %0-3, karbonhidrat %5-10). HIIT (High-Intensity Interval Training) yapın; yoğun egzersiz sonrası 24-48 saat boyunca metabolizma yüksek kalır (EPOC etkisi). Yeterli uyuyun; az uyku metabolizmayı %5-8 yavaşlatır ve açlık hormonlarını artırır. Düzenli öğünler yiyin; çok uzun aç kalmak metabolizmayı yavaşlatır. Su için; günde 2-3 litre su metabolizmayı %10-30 artırabilir. Kahve ve yeşil çay tüketin; kafein ve kateşinler metabolizmayı geçici olarak hızlandırır. Soğuk ortamda vakit geçirin; vücut ısınma için enerji har car. Aşırı kalori kısıtlamasından kaçının; günlük BMR'nin altında kalori almak metabolizmayı %20-30 yavaşlatır ve "açlık modu"na girer.
              </p>

              <div className="mt-12 text-center">
                <a 
                  href="/hesaplayicilar" 
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg hover:from-orange-600 hover:to-red-700 shadow-2xl shadow-orange-500/50 border border-orange-400/30 hover:scale-105 transition-all duration-300"
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
