import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, Flame, TrendingUp, Activity, Zap, Target, Users } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";

interface DailyCalorieCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface CalorieResults {
  bmr: number;
  tdee: number;
  maintain: number;
  mildWeightLoss: number;
  weightLoss: number;
  extremeWeightLoss: number;
  mildWeightGain: number;
  weightGain: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function DailyCalorieCalculator({ categoryGroups, currentPath }: DailyCalorieCalculatorProps) {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState<number>(30);
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175);
  const [activityLevel, setActivityLevel] = useState<number>(1.2);
  const [goal, setGoal] = useState<string>("maintain");
  const [results, setResults] = useState<CalorieResults | null>(null);

  const calculateBMR = (): number => {
    if (gender === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  const calculateCalories = (e: React.FormEvent) => {
    e.preventDefault();

    const bmr = calculateBMR();
    const tdee = bmr * activityLevel;

    let targetCalories = tdee;
    if (goal === "weight-loss") targetCalories = tdee - 500;
    else if (goal === "mild-weight-loss") targetCalories = tdee - 250;
    else if (goal === "extreme-weight-loss") targetCalories = tdee - 1000;
    else if (goal === "weight-gain") targetCalories = tdee + 500;
    else if (goal === "mild-weight-gain") targetCalories = tdee + 250;

    const protein = weight * 2.2;
    const fat = (targetCalories * 0.25) / 9;
    const carbs = (targetCalories - (protein * 4 + fat * 9)) / 4;

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      maintain: Math.round(tdee),
      mildWeightLoss: Math.round(tdee - 250),
      weightLoss: Math.round(tdee - 500),
      extremeWeightLoss: Math.round(tdee - 1000),
      mildWeightGain: Math.round(tdee + 250),
      weightGain: Math.round(tdee + 500),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
    });
  };

  const activityLevels = [
    { value: 1.2, label: "Hareketsiz", desc: "Hiç egzersiz yok" },
    { value: 1.375, label: "Az Aktif", desc: "Haftada 1-3 gün" },
    { value: 1.55, label: "Orta Aktif", desc: "Haftada 3-5 gün" },
    { value: 1.725, label: "Çok Aktif", desc: "Haftada 6-7 gün" },
    { value: 1.9, label: "Ekstra Aktif", desc: "Günde 2x egzersiz" },
  ];

  const goals = [
    { value: "extreme-weight-loss", label: "Hızlı Kilo Ver", desc: "haftada 1 kg", color: "from-red-500 to-pink-600" },
    { value: "weight-loss", label: "Kilo Ver", desc: "haftada 0.5 kg", color: "from-orange-500 to-red-500" },
    { value: "mild-weight-loss", label: "Yavaş Kilo Ver", desc: "haftada 0.25 kg", color: "from-yellow-500 to-orange-500" },
    { value: "maintain", label: "Kilonu Koru", desc: "sabit kal", color: "from-green-500 to-emerald-600" },
    { value: "mild-weight-gain", label: "Yavaş Kilo Al", desc: "haftada 0.25 kg", color: "from-blue-500 to-cyan-600" },
    { value: "weight-gain", label: "Kilo Al", desc: "haftada 0.5 kg", color: "from-purple-500 to-blue-600" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-green-400 hover:text-green-300 font-medium text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full inline-block border border-green-500/30">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full px-6 py-3 mb-6 shadow-2xl shadow-green-500/50 border border-green-400/30">
              <Flame className="w-6 h-6 animate-pulse" />
              <span className="font-bold">En Popüler Hesaplayıcı</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent drop-shadow-2xl">
              Günlük Kalori ve Makro Hesaplayıcı
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              BMR, TDEE ve kişiselleştirilmiş makro besin dağılımınızı bilimsel formüllerle hesaplayın
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Calculator Form - Glassmorphic Design */}
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg shadow-green-500/50">
                  <Calculator className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Bilgilerinizi Girin</h2>
              </div>

              <form onSubmit={calculateCalories} className="space-y-8">
                {/* Gender - Modern Toggle */}
                <div className="space-y-4">
                  <Label className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-400" />
                    Cinsiyet
                  </Label>
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

                {/* Age - Custom Range Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-bold text-white">Yaş</Label>
                    <span className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                      {age}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-green-400 [&::-webkit-slider-thumb]:to-emerald-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-green-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                  />
                  <div className="flex justify-between text-xs text-gray-400 px-1">
                    <span>15 yaş</span>
                    <span>100 yaş</span>
                  </div>
                </div>

                {/* Weight - Custom Range Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-bold text-white">Kilo (kg)</Label>
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

                {/* Height - Custom Range Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-bold text-white">Boy (cm)</Label>
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

                {/* Activity Level - Visual Cards */}
                <div className="space-y-4">
                  <Label className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    Aktivite Seviyesi
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {activityLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setActivityLevel(level.value)}
                        className={`p-4 rounded-xl text-left transition-all duration-300 ${
                          activityLevel === level.value
                            ? "bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl shadow-purple-500/50 scale-105"
                            : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        <div className="font-bold text-sm">{level.label}</div>
                        <div className="text-xs opacity-75 mt-1">{level.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goal - Colorful Cards */}
                <div className="space-y-4">
                  <Label className="text-lg font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-yellow-400" />
                    Hedefiniz
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {goals.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => setGoal(g.value)}
                        className={`p-4 rounded-xl text-left transition-all duration-300 ${
                          goal === g.value
                            ? `bg-gradient-to-br ${g.color} text-white shadow-2xl scale-105`
                            : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        <div className="font-bold text-sm">{g.label}</div>
                        <div className="text-xs opacity-75 mt-1">{g.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-16 text-xl font-black bg-gradient-to-r from-green-500 via-emerald-600 to-teal-500 hover:from-green-600 hover:via-emerald-700 hover:to-teal-600 shadow-2xl shadow-green-500/50 rounded-2xl border-2 border-green-400/50 hover:scale-105 transition-all duration-300"
                >
                  <Zap className="w-6 h-6 mr-2 animate-pulse" />
                  Hesapla
                </Button>
              </form>
            </div>

            {/* Results - Animated Cards */}
            {results && (
              <div className="space-y-6">
                {/* BMR Card */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-3xl border border-orange-400/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
                    <h3 className="text-2xl font-black text-white">BMR (Bazal Metabolizma)</h3>
                  </div>
                  <div className="text-6xl font-black bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent mb-2">
                    {results.bmr.toLocaleString()} kcal
                  </div>
                  <p className="text-gray-300 text-sm">Dinlenirken yaktığınız kalori</p>
                </div>

                {/* TDEE Card */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-3xl border border-green-400/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-8 h-8 text-green-400 animate-pulse" />
                    <h3 className="text-2xl font-black text-white">TDEE (Günlük Harcama)</h3>
                  </div>
                  <div className="text-6xl font-black bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent mb-2">
                    {results.tdee.toLocaleString()} kcal
                  </div>
                  <p className="text-gray-300 text-sm">Günlük toplam harcadığınız kalori</p>
                </div>

                {/* Macros Card */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-3xl border border-purple-400/30 p-8 shadow-2xl">
                  <h3 className="text-2xl font-black text-white mb-6">Makro Besin Dağılımı</h3>
                  
                  <div className="space-y-6">
                    {/* Protein */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-bold">Protein</span>
                        <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                          {results.protein}g
                        </span>
                      </div>
                      <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full shadow-lg shadow-blue-500/50 transition-all duration-1000"
                             style={{ width: `${(results.protein / (results.protein + results.carbs + results.fat)) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Carbs */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-bold">Karbonhidrat</span>
                        <span className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                          {results.carbs}g
                        </span>
                      </div>
                      <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg shadow-green-500/50 transition-all duration-1000"
                             style={{ width: `${(results.carbs / (results.protein + results.carbs + results.fat)) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Fat */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-bold">Yağ</span>
                        <span className="text-2xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                          {results.fat}g
                        </span>
                      </div>
                      <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-lg shadow-orange-500/50 transition-all duration-1000"
                             style={{ width: `${(results.fat / (results.protein + results.carbs + results.fat)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEO Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-12">
              <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Günlük Kalori İhtiyacı Nedir?
              </h2>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Günlük kalori ihtiyacınız, vücudunuzun fonksiyonlarını sürdürmek ve günlük aktivitelerinizi yapabilmek için gereken enerji miktarıdır. 
                Bu değer iki ana bileşenden oluşur: Bazal Metabolizma Hızı (BMR) ve aktivite faktörü. BMR, vücudunuzun dinlenirken harcadığı kaloridir; 
                solunum, kan dolaşımı, hücre üretimi gibi yaşamsal fonksiyonlar için gereklidir. Toplam Günlük Enerji Harcaması (TDEE) ise BMR'nize 
                fiziksel aktivite seviyenizi ekleyerek bulunur. Örneğin hareketsiz bir yaşam süren 70 kg, 170 cm boyunda, 30 yaşında bir erkek için 
                BMR yaklaşık 1650 kcal iken, TDEE orta aktif bir yaşamla 2550 kcal'ye ulaşabilir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                BMR Hesaplama Formülleri
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                En yaygın kullanılan iki BMR formülü Mifflin-St Jeor ve Harris-Benedict'tir. Mifflin-St Jeor (1990) daha modern ve doğru kabul edilir. 
                Erkekler için: (10 × kilo kg) + (6.25 × boy cm) - (5 × yaş) + 5, kadınlar için: (10 × kilo kg) + (6.25 × boy cm) - (5 × yaş) - 161. 
                Harris-Benedict formülü (1919, 1984'te revize) daha eski ama hala kullanılır. Aktivite faktörleri: hareketsiz (1.2), az aktif (1.375), 
                orta aktif (1.55), çok aktif (1.725), ekstra aktif (1.9) olarak belirlenir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Makro Besinler: Protein, Karbonhidrat, Yağ
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Kalori ihtiyacınızı bilmek yeterli değil; bu kalorilerin hangi makro besinlerden geldiği de kritik önem taşır. Protein vücut yapı taşıdır, 
                kas onarımı ve bağışıklık sistemi için gereklidir. Karbonhidrat enerji kaynağıdır, özellikle beyin ve kaslar için. Yağ hormon üretimi, 
                vitamin emilimi ve hücre zarı sağlığı için gereklidir. Dengeli dağılım: protein %25-35 (vücut ağırlığının kg başına 1.6-2.2g), 
                karbonhidrat %40-50 (düşük karbonhidrat diyetlerde %20-30), yağ %25-35 (sağlıklı yağlar tercih edilmeli). Kilo vermek isteyenler 
                proteini artırmalı, karbonhidratı azaltmalı; kas yapmak isteyenler hem proteini hem karbonhidratı artırmalıdır.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Kalori Açığı ve Fazlası Stratejileri
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Kilo yönetimi basit bir denklemdir: kalori açığı (yediğinizden az yakma) kilo kaybına, kalori fazlası kilo almaya yol açar. 
                Sağlıklı kilo kaybı için haftada 0.5-1 kg hedefleyin; bu günlük 500-1000 kalori açığı demektir. Aşırı kalori kısıtlaması (günde 
                1200 kcal'nin altı) metabolizmayı yavaşlatır ve kas kaybına neden olur. Kilo almak isteyenler günlük 300-500 kalori fazlası almalı 
                ve kuvvet antrenmanı yaparak kas kazanmalıdır. Düzenli olarak (2-4 haftada bir) hesaplamalarınızı güncelleyin çünkü kilo 
                değiştikçe kalori ihtiyacınız da değişir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Sık Yapılan Hatalar
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Birçok insan aktivite seviyesini yanlış tahmin eder; "çok aktif" gerçekten günde 2 saat egzersiz yapmak anlamına gelir. 
                Çoğu insan "az aktif" veya "orta aktif" kategorisindedir. Başka bir hata, BMR ile TDEE'yi karıştırmaktır; asla BMR'nizin 
                altında kalori almamalısınız. Hesaplamalar bir başlangıç noktasıdır; vücudunuzu gözlemleyin ve gerektiğinde ayarlama yapın. 
                2-3 hafta aynı kalori alımıyla kilo değişimi görmüyorsanız, hesaplamalarınızı gözden geçirin. Metabolizma kişiden kişiye 
                %10-15 fark gösterebilir.
              </p>

              <div className="mt-12 text-center">
                <a 
                  href="/hesaplayicilar" 
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg hover:from-green-600 hover:to-emerald-700 shadow-2xl shadow-green-500/50 border border-green-400/30 hover:scale-105 transition-all duration-300"
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
