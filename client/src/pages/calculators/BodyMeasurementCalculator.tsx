import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Ruler, Activity, Heart, TrendingUp, AlertCircle, User, Scale } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface BodyMeasurementCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface MeasurementResult {
  whr: number;
  whtr: number;
  bodyShape: string;
  healthRisk: string;
  riskLevel: "low" | "moderate" | "high" | "very-high";
  color: string;
  recommendations: string[];
}

export default function BodyMeasurementCalculator({ categoryGroups, currentPath }: BodyMeasurementCalculatorProps) {
  const [gender, setGender] = useState<"male" | "female">("female");
  const [weight, setWeight] = useState<number>(65);
  const [height, setHeight] = useState<number>(165);
  const [waist, setWaist] = useState<number>(75);
  const [hip, setHip] = useState<number>(95);
  const [neck, setNeck] = useState<number>(32);
  const [chest, setChest] = useState<number>(90);
  const [arm, setArm] = useState<number>(28);
  const [thigh, setThigh] = useState<number>(55);
  const [result, setResult] = useState<MeasurementResult | null>(null);

  const calculateBodyShape = (whr: number, gender: "male" | "female"): string => {
    if (gender === "female") {
      // Women body shapes
      if (whr < 0.75) return "Pear (Armut)";
      if (whr >= 0.75 && whr < 0.80) return "Hourglass (Kum Saati)";
      if (whr >= 0.80 && whr < 0.85) return "Rectangle (Dikdörtgen)";
      return "Apple (Elma)";
    } else {
      // Men body shapes
      if (whr < 0.85) return "Athletic (Atletik)";
      if (whr >= 0.85 && whr < 0.95) return "Average (Ortalama)";
      return "Stocky (Güçlü Yapılı)";
    }
  };

  const getHealthRisk = (whr: number, whtr: number, gender: "male" | "female"): { risk: string; level: "low" | "moderate" | "high" | "very-high"; color: string } => {
    const whrThreshold = gender === "male" ? 0.9 : 0.85;
    const whtrHealthy = 0.5;

    let riskScore = 0;
    if (whr > whrThreshold) riskScore += 2;
    if (whtr > whtrHealthy) riskScore += 2;
    if (whtr > 0.6) riskScore += 1;

    if (riskScore === 0) {
      return { risk: "Düşük Risk - Sağlıklı", level: "low", color: "from-green-500 to-emerald-600" };
    } else if (riskScore <= 2) {
      return { risk: "Orta Risk - Dikkat", level: "moderate", color: "from-yellow-500 to-orange-600" };
    } else if (riskScore <= 3) {
      return { risk: "Yüksek Risk - Önlem Alın", level: "high", color: "from-orange-500 to-red-600" };
    } else {
      return { risk: "Çok Yüksek Risk - Acil Önlem", level: "very-high", color: "from-red-500 to-rose-700" };
    }
  };

  const getRecommendations = (whr: number, whtr: number, gender: "male" | "female", bodyShape: string): string[] => {
    const recommendations: string[] = [];
    const whrThreshold = gender === "male" ? 0.9 : 0.85;

    if (whr > whrThreshold) {
      recommendations.push("Bel çevrenizi azaltmak için kardiyovasküler egzersizlere odaklanın");
      recommendations.push("İşlenmiş gıdaları ve şekeri azaltın, visseral yağı azaltmaya yardımcı olur");
    }

    if (whtr > 0.5) {
      recommendations.push("Bel/boy oranınız yüksek - kalori açığı yaratarak kilo vermeye odaklanın");
      recommendations.push("Haftada en az 150 dakika orta yoğunlukta kardiyovasküler egzersiz yapın");
    }

    if (bodyShape.includes("Apple") || bodyShape.includes("Stocky")) {
      recommendations.push("Karın bölgesindeki yağ (visseral yağ) sağlık riskleri açısından en tehlikelidir");
      recommendations.push("HIIT (Yüksek Yoğunluklu İnterval) antrenmanları karın yağını azaltmada etkilidir");
    }

    if (recommendations.length === 0) {
      recommendations.push("Harika! Sağlıklı ölçümlere sahipsiniz");
      recommendations.push("Mevcut yaşam tarzınızı sürdürün ve düzenli egzersiz yapmaya devam edin");
      recommendations.push("Yılda bir kez kontrol ölçümü yapın");
    }

    return recommendations;
  };

  const calculateMeasurements = (e: React.FormEvent) => {
    e.preventDefault();

    const whr = waist / hip;
    const whtr = waist / height;
    const bodyShape = calculateBodyShape(whr, gender);
    const healthRiskData = getHealthRisk(whr, whtr, gender);
    const recommendations = getRecommendations(whr, whtr, gender, bodyShape);

    setResult({
      whr: parseFloat(whr.toFixed(2)),
      whtr: parseFloat(whtr.toFixed(3)),
      bodyShape,
      healthRisk: healthRiskData.risk,
      riskLevel: healthRiskData.level,
      color: healthRiskData.color,
      recommendations
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-fuchsia-900 to-slate-900">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-fuchsia-400 to-purple-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-fuchsia-400 hover:text-fuchsia-300 font-medium text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full inline-block border border-fuchsia-500/30" data-testid="link-calculators">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-full px-6 py-3 mb-6 shadow-2xl shadow-fuchsia-500/50 border border-fuchsia-400/30">
              <Ruler className="w-6 h-6 animate-pulse" />
              <span className="font-bold">Gelişmiş Vücut Ölçüm Analizi</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-fuchsia-400 via-purple-500 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              Vücut Ölçüm Hesaplayıcı
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Detaylı vücut ölçümlerinizle sağlık riskinizi değerlendirin ve vücut şeklinizi keşfedin
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Calculator Form */}
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-2xl shadow-lg shadow-fuchsia-500/50">
                  <User className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Ölçümlerinizi Girin</h2>
              </div>

              <form onSubmit={calculateMeasurements} className="space-y-8" data-testid="form-measurement">
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
                      data-testid="button-gender-male"
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
                      data-testid="button-gender-female"
                    >
                      👩 Kadın
                    </button>
                  </div>
                </div>

                {/* Weight */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Kilo (kg)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent" data-testid="text-weight-value">
                      {weight}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="150"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-fuchsia-500/20 to-pink-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-fuchsia-400 [&::-webkit-slider-thumb]:to-pink-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-fuchsia-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                    data-testid="input-weight"
                  />
                </div>

                {/* Height */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Boy (cm)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent" data-testid="text-height-value">
                      {height}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="140"
                    max="210"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-purple-500/20 to-violet-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-400 [&::-webkit-slider-thumb]:to-violet-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-purple-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                    data-testid="input-height"
                  />
                </div>

                {/* Waist */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Bel Çevresi (cm)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent" data-testid="text-waist-value">
                      {waist}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="140"
                    value={waist}
                    onChange={(e) => setWaist(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-orange-400 [&::-webkit-slider-thumb]:to-red-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-orange-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                    data-testid="input-waist"
                  />
                </div>

                {/* Hip */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Kalça Çevresi (cm)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent" data-testid="text-hip-value">
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
                    data-testid="input-hip"
                  />
                </div>

                {/* Neck */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Boyun Çevresi (cm)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent" data-testid="text-neck-value">
                      {neck}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="50"
                    value={neck}
                    onChange={(e) => setNeck(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-400 [&::-webkit-slider-thumb]:to-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-cyan-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                    data-testid="input-neck"
                  />
                </div>

                {/* Chest */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Göğüs Çevresi (cm)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent" data-testid="text-chest-value">
                      {chest}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="130"
                    value={chest}
                    onChange={(e) => setChest(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-green-400 [&::-webkit-slider-thumb]:to-emerald-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-green-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                    data-testid="input-chest"
                  />
                </div>

                {/* Arm */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Kol Çevresi (cm)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent" data-testid="text-arm-value">
                      {arm}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    value={arm}
                    onChange={(e) => setArm(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-yellow-400 [&::-webkit-slider-thumb]:to-amber-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-yellow-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                    data-testid="input-arm"
                  />
                </div>

                {/* Thigh */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Uyluk Çevresi (cm)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent" data-testid="text-thigh-value">
                      {thigh}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="80"
                    value={thigh}
                    onChange={(e) => setThigh(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-indigo-500/20 to-blue-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-indigo-400 [&::-webkit-slider-thumb]:to-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-indigo-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                    data-testid="input-thigh"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-16 text-xl font-black bg-gradient-to-r from-fuchsia-500 via-purple-600 to-pink-500 hover:from-fuchsia-600 hover:via-purple-700 hover:to-pink-600 shadow-2xl shadow-fuchsia-500/50 rounded-2xl border-2 border-fuchsia-400/50 hover:scale-105 transition-all duration-300"
                  data-testid="button-calculate"
                >
                  <Activity className="w-6 h-6 mr-2 animate-pulse" />
                  Analiz Et
                </Button>
              </form>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {/* WHR & WHtR */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="backdrop-blur-2xl bg-gradient-to-br from-fuchsia-500/20 to-purple-600/20 rounded-3xl border border-fuchsia-400/30 p-6 shadow-2xl">
                    <h3 className="text-lg font-black text-white mb-2">Bel/Kalça Oranı (WHR)</h3>
                    <div className="text-5xl font-black bg-gradient-to-r from-fuchsia-300 to-purple-400 bg-clip-text text-transparent" data-testid="text-whr-result">
                      {result.whr}
                    </div>
                    <p className="text-sm text-gray-300 mt-2">
                      {gender === "male" ? "Sağlıklı: <0.9" : "Sağlıklı: <0.85"}
                    </p>
                  </div>
                  <div className="backdrop-blur-2xl bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-3xl border border-pink-400/30 p-6 shadow-2xl">
                    <h3 className="text-lg font-black text-white mb-2">Bel/Boy Oranı (WHtR)</h3>
                    <div className="text-5xl font-black bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent" data-testid="text-whtr-result">
                      {result.whtr}
                    </div>
                    <p className="text-sm text-gray-300 mt-2">Sağlıklı: &lt;0.5</p>
                  </div>
                </div>

                {/* Body Shape & Health Risk */}
                <div className={`backdrop-blur-2xl bg-gradient-to-br ${result.color}/20 rounded-3xl border border-white/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Scale className="w-8 h-8 text-white animate-pulse" />
                    <h3 className="text-2xl font-black text-white">Vücut Şekli</h3>
                  </div>
                  <div className="text-6xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4" data-testid="text-body-shape">
                    {result.bodyShape}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Heart className="w-6 h-6 text-white" />
                      <p className="text-2xl font-bold text-white" data-testid="text-health-risk">{result.healthRisk}</p>
                    </div>
                  </div>
                </div>

                {/* Measurements Table */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-3xl border border-blue-400/30 p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Ruler className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-black text-white">Ölçüm Özeti</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-gray-300">Kilo</span>
                      <span className="font-bold text-white">{weight} kg</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-gray-300">Boy</span>
                      <span className="font-bold text-white">{height} cm</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-gray-300">Bel Çevresi</span>
                      <span className="font-bold text-white">{waist} cm</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-gray-300">Kalça Çevresi</span>
                      <span className="font-bold text-white">{hip} cm</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-gray-300">Boyun Çevresi</span>
                      <span className="font-bold text-white">{neck} cm</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-gray-300">Göğüs Çevresi</span>
                      <span className="font-bold text-white">{chest} cm</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-gray-300">Kol Çevresi</span>
                      <span className="font-bold text-white">{arm} cm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Uyluk Çevresi</span>
                      <span className="font-bold text-white">{thigh} cm</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-3xl border border-purple-400/30 p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-black text-white">Öneriler</h3>
                  </div>
                  <ul className="space-y-3 text-gray-300">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Measurement Guide */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-3xl border border-orange-400/30 p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-orange-400" />
                    <h3 className="text-xl font-black text-white">Nasıl Ölçülür?</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• <strong>Bel:</strong> Göbeğin en dar noktasından, nefes verirken ölçün</li>
                    <li>• <strong>Kalça:</strong> Kalçanın en geniş noktasından ölçün</li>
                    <li>• <strong>Boyun:</strong> Gırtlağın hemen altından ölçün</li>
                    <li>• <strong>Göğüs:</strong> Meme uçlarından geçecek şekilde ölçün</li>
                    <li>• <strong>Kol:</strong> Üst kolun en geniş noktasından ölçün</li>
                    <li>• <strong>Uyluk:</strong> Uyluğun en geniş noktasından ölçün</li>
                    <li>• Sabah aç karnına, ayakta ölçüm yapın</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* SEO Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-12">
              <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                Vücut Ölçümleri Neden BMI'dan Daha Önemlidir?
              </h2>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Vücut ölçümleri, özellikle bel çevresi ve kalça çevresi, BMI'ya (Vücut Kitle İndeksi) göre çok daha doğru sağlık göstergeleridir. BMI sadece kilo ve boyunuzu dikkate alır, ancak yağın vücudunuzda nerede depolandığını göstermez. İki kişi aynı BMI değerine sahip olabilir, ancak biri karın bölgesinde yağ biriktirirken diğeri kalça ve uylukta biriktiriyor olabilir. Bu fark, sağlık riskleri açısından kritik öneme sahiptir. Karın bölgesindeki yağ (visseral yağ) organları sarar ve metabolik hastalıklar, tip 2 diyabet, kalp hastalıkları ve bazı kanser türleri riskini önemli ölçüde artırır. Bel/Kalça Oranı (WHR) ve Bel/Boy Oranı (WHtR), bu yağ dağılımını değerlendirmek için kullanılan bilimsel olarak kanıtlanmış ölçümlerdir. Araştırmalar, WHR'nin kalp hastalığı riskini tahmin etmede BMI'dan çok daha etkili olduğunu göstermiştir. Dünya Sağlık Örgütü (WHO), WHR'yi metabolik sendrom ve kardiyovasküler hastalık riski için önemli bir belirteç olarak kabul etmektedir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                Bel/Kalça Oranı (WHR): Sağlığın Anahtar Göstergesi
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Bel/Kalça Oranı (Waist-to-Hip Ratio - WHR), bel çevrenizi kalça çevrenize bölerek hesaplanır. Bu basit hesaplama, vücudunuzda yağın nasıl dağıldığını anlamanıza yardımcı olur. Erkekler için sağlıklı WHR 0.9'un altında, kadınlar için 0.85'in altındadır. Bu eşik değerler, kapsamlı epidemiyolojik çalışmalarla belirlenmiştir ve kardiyometabolik riskin önemli ölçüde arttığı noktaları işaret eder. WHR değeriniz bu eşiklerin üzerindeyse, visseral yağınızın fazla olduğu ve sağlık risklerinizin arttığı anlamına gelir. Visseral yağ, karaciğer, pankreas ve bağırsaklar gibi hayati organların etrafında birikir. Bu yağ dokusu metabolik olarak aktiftir ve inflamatuar sitokinler salgılayarak insülin direnci, yüksek kolesterol, yüksek tansiyon ve kronik iltihaplanmaya neden olur. Öte yandan, kalça ve uyluklarda biriken yağ (subkutan yağ) metabolik açıdan daha az zararlıdır ve hatta koruyucu olabilir. Kadınlarda östrojen hormonu nedeniyle yağ genellikle alt vücutta (kalça, uyluk) birikir; bu "Pear" (armut) vücut şekli olarak bilinir ve daha düşük sağlık riski taşır. Erkeklerde testosteron hormonu karın bölgesinde yağ birikimine yol açar; bu da daha yüksek sağlık riski anlamına gelir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
                Bel/Boy Oranı (WHtR): Çocuklardan Yetişkinlere Evrensel Ölçüm
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Bel/Boy Oranı (Waist-to-Height Ratio - WHtR), bel çevrenizi boy uzunluğunuza bölerek hesaplanır. WHtR, yaş ve cinsiyetten bağımsız olarak kullanılabilen evrensel bir sağlık göstergesidir. Sağlıklı bir WHtR 0.5'in altındadır; bu, bel çevrenizin boyunuzun yarısından küçük olması gerektiği anlamına gelir. Basit bir kural: "Bel çevreniz, boyunuzun yarısından küçük olmalıdır." WHtR 0.5-0.6 arası artmış risk, 0.6'nın üzeri yüksek risk kategorisindedir. Bilimsel araştırmalar, WHtR'nin tip 2 diyabet, hipertansiyon ve kardiyovasküler hastalıkları öngörmede son derece etkili olduğunu göstermiştir. Özellikle çocuklarda ve farklı etnik gruplarda WHtR'nin BMI'dan daha iyi bir sağlık göstergesi olduğu kanıtlanmıştır. WHtR aynı zamanda visseral yağ miktarını tahmin etmede oldukça başarılıdır. Bir çalışma, WHtR 0.5'in üzerinde olan bireylerde kardiyovasküler hastalık riskinin 2-3 kat arttığını göstermiştir. WHtR'yi düzenli olarak takip etmek, kilo kaybı ve sağlıklı yaşam tarzı değişikliklerinin etkinliğini izlemek için mükemmel bir araçtır.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Vücut Şekilleri ve Sağlık Riskleri
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Vücut şekilleri, yağın vücutta nasıl dağıldığını görselleştirir ve sağlık risklerinizi anlamanıza yardımcı olur. Kadınlarda dört ana vücut şekli vardır: <strong>Pear (Armut):</strong> Kalça ve uyluklarda daha fazla yağ birikimi, bel ince. WHR genellikle 0.75'in altındadır. Bu şekil, sağlık riski açısından en düşük risk kategorisindedir çünkü yağ subkutan (deri altı) bölgede birikir. Ancak aşırı kilo almak her zaman sağlıksızdır. <strong>Hourglass (Kum Saati):</strong> Dengeli bir şekil; bel, göğüs ve kalça arasında belirgin bir oran vardır. WHR 0.75-0.80 arasındadır. Sağlıklı bir vücut şeklidir ancak genel vücut yağ yüzdesi kontrolde tutulmalıdır. <strong>Rectangle (Dikdörtgen):</strong> Bel, göğüs ve kalça çevreleri birbirine yakındır; belirgin bir bel hattı yoktur. WHR 0.80-0.85 arasında. Orta düzeyde sağlık riski taşır. Düzenli egzersiz ve sağlıklı beslenme ile visceral yağ azaltılabilir. <strong>Apple (Elma):</strong> Karın bölgesinde fazla yağ birikimi, bel kalın. WHR 0.85'in üzerinde. Bu vücut şekli, kadınlarda en yüksek sağlık riskini taşır çünkü visseral yağ fazladır. Tip 2 diyabet, kardiyovasküler hastalıklar, yüksek tansiyon ve metabolik sendrom riski önemli ölçüde artar. Erkeklerde üç ana vücut şekli vardır: <strong>Athletic (Atletik):</strong> Kaslı, düşük yağ oranı, belirgin kas tanımı. WHR 0.85'in altında. En sağlıklı vücut şekli; düzenli egzersiz ve sağlıklı beslenme ile sürdürülmelidir. <strong>Average (Ortalama):</strong> Orta düzeyde yağ oranı, belirgin olmayan kas tanımı. WHR 0.85-0.95 arası. Kabul edilebilir ancak sağlık riskleri artmaya başlar. Yaşam tarzı değişiklikleri ile visseral yağ azaltılmalıdır. <strong>Stocky (Güçlü Yapılı):</strong> Karın bölgesinde fazla yağ, bel geniş. WHR 0.95'in üzerinde. Yüksek sağlık riski taşır; acil önlem gerektirir. Kardiyovasküler hastalıklar, metabolik sendrom, tip 2 diyabet riski çok yüksektir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Doğru Ölçüm Teknikleri: Hassasiyet Kritiktir
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Vücut ölçümlerinin doğruluğu, sonuçların güvenilirliği için kritik öneme sahiptir. Hatalı ölçümler yanlış değerlendirmelere ve gereksiz endişeye neden olabilir. İşte profesyonel ölçüm teknikleri: <strong>Bel Çevresi:</strong> Kaburgalarınızın en alt noktası ile kalça kemiğinizin üst kısmı (iliak krest) arasındaki en dar noktadan ölçün. Genellikle göbek hizasındadır. Ayakta, rahat bir pozisyonda, nefes verdikten sonra ölçüm yapın. Mezurayı cildinize sıkı ama rahat tutun; cildi sıkıştırmayın. <strong>Kalça Çevresi:</strong> Ayakta, ayaklarınız bitişik, kalçanın en geniş noktasından ölçün. Genellikle kalça kemiklerinin arkasındaki en çıkıntılı noktadır. Mezurayı yere paralel tutun. <strong>Boyun Çevresi:</strong> Gırtlağın (larenks) hemen altından, yani adam elmasının altından ölçün. Başınızı dik tutun, çenenizi yukarı kaldırmayın veya aşağı indirmeyin. <strong>Göğüs Çevresi:</strong> Erkeklerde meme uçları hizasından, kadınlarda göğsün en geniş noktasından ölçün. Nefes aldıktan sonra, nefesi tutarken ölçüm yapın. <strong>Kol Çevresi:</strong> Üst kolun en geniş noktasından, genellikle biseps kasının tam ortasından ölçün. Kolunuzu yan tarafınızda rahat bırakın, kasınızı germeyin. <strong>Uyluk Çevresi:</strong> Ayakta, uyluğun en geniş noktasından, genellikle kalça altından 5-10 cm aşağıdan ölçün. Ağırlığınızı her iki bacağa eşit dağıtın. <strong>Genel İpuçları:</strong> Sabah, kahvaltıdan önce, tuvaletten sonra ölçüm yapın. Ölçümleri her zaman aynı saatte tekrarlayın. Esnek olmayan bir mezura kullanın (terzi mezurası ideal). Cilt düzeyinde ölçün; kıyafet üzerinden değil. Aynı noktayı iki kez ölçün ve ortalamasını alın.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                Visseral Yağ vs Subkutan Yağ: Tehlikeli Yağı Tanıyın
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Vücudunuzdaki tüm yağlar eşit derecede zararlı değildir. İki ana yağ türü vardır: visseral yağ ve subkutan yağ. <strong>Visseral Yağ (Karın İçi Yağ):</strong> Organlarınızın etrafında, karın boşluğunda biriken yağdır. Karaciğer, pankreas, bağırsaklar ve diğer vital organları sarar. Bu yağ metabolik olarak son derece aktiftir ve inflamatuar kimyasallar (sitokinler) salgılar. İnsülin direncine, tip 2 diyabete, yüksek kolesterole, yüksek tansiyona, kardiyovasküler hastalıklara ve bazı kanser türlerine (kolon, meme, pankreas) neden olur. Visseral yağ, hormon dengesi bozar ve leptin (tokluk hormonu) direncine yol açar. Bel çevresi ve WHR, visseral yağın dolaylı göstergeleridir. Visseral yağ, subkutan yağa göre daha hızlı birikir ancak diyet ve egzersizle daha hızlı azaltılabilir. <strong>Subkutan Yağ (Deri Altı Yağ):</strong> Deri ile kaslar arasında biriken yağdır. Vücuttaki toplam yağın yaklaşık %90'ı subkutan yağdır. Enerji depolaması, yalıtım ve organların korunması için gereklidir. Metabolik açıdan daha az zararlıdır ve hatta bazı koruyucu faydaları olabilir. Kadınlarda kalça, uyluk ve göğüste daha fazla bulunur. Erkeklerde karın, sırt ve göğüste daha fazla bulunur. Subkutan yağı azaltmak, visseral yağa göre daha zordur çünkü vücut bu yağı enerji rezervi olarak tutar. <strong>Yağ Dağılımını Değiştirmek Mümkün mü?</strong> Spot reduction (hedef bölgede yağ yakma) bilimsel olarak desteklenmemektedir. Ancak genel vücut yağını azaltarak hem visseral hem de subkutan yağı düşürebilirsiniz. Kardiyovasküler egzersizler (koşu, bisiklet, yüzme) visseral yağı azaltmada en etkilidir. Dirençli antrenman (ağırlık kaldırma) kas kütlesini artırır ve metabolizmayı hızlandırır. Yüksek protein, düşük rafine karbonhidrat diyetleri visseral yağı hızla azaltır. Stres yönetimi ve kaliteli uyku, kortizol seviyelerini düşürerek karın yağını azaltmaya yardımcı olur. İntermittent fasting (aralıklı oruç) visseral yağ kaybını hızlandırabilir. Unutmayın: Genetik, yağın nerede biriktiğini etkiler ancak yaşam tarzı değişiklikleri ile sağlıklı bir vücut kompozisyonu elde edebilirsiniz. Düzenli ölçümler yaparak ilerlemenizi takip edin ve motivasyonunuzu koruyun.
              </p>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
