import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrendingUp, Calendar, Target, AlertCircle, Zap } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface WeightLossTimeCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface TimeResult {
  weeks: number;
  months: number;
  days: number;
  weeklyDeficit: number;
  dailyDeficit: number;
  targetDate: string;
  pace: string;
  warning?: string;
}

export default function WeightLossTimeCalculator({ categoryGroups, currentPath }: WeightLossTimeCalculatorProps) {
  const [goal, setGoal] = useState<"lose" | "gain">("lose");
  const [currentWeight, setCurrentWeight] = useState<number>(80);
  const [targetWeight, setTargetWeight] = useState<number>(70);
  const [weeklyRate, setWeeklyRate] = useState<number>(0.5);
  const [result, setResult] = useState<TimeResult | null>(null);

  const calculateTime = (e: React.FormEvent) => {
    e.preventDefault();
    const current = currentWeight;
    const target = targetWeight;
    const rate = weeklyRate;
    
    const diff = goal === "lose" ? current - target : target - current;
    const weeks = diff / rate;
    const days = weeks * 7;
    const months = weeks / 4.33;

    const dailyCalories = (rate * 7700) / 7;
    const weeklyCalories = rate * 7700;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    let pace = "Sağlıklı ve sürdürülebilir";
    let warning = undefined;

    if (rate > 1) {
      pace = "Hızlı (riskli olabilir)";
      warning = "Haftada 1 kg'dan fazla kilo vermek/almak sağlık riskleri taşıyabilir. Bir uzmanla görüşmeniz önerilir.";
    } else if (rate > 0.75) {
      pace = "Hızlı ama kabul edilebilir";
    } else if (rate >= 0.5) {
      pace = "Sağlıklı ve sürdürülebilir";
    } else {
      pace = "Yavaş ama emin";
    }

    setResult({
      weeks: Math.round(weeks),
      months: parseFloat(months.toFixed(1)),
      days: Math.round(days),
      weeklyDeficit: Math.round(weeklyCalories),
      dailyDeficit: Math.round(dailyCalories),
      targetDate: targetDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
      pace,
      warning
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400 to-orange-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-400 to-yellow-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-amber-400 hover:text-amber-300 font-medium text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full inline-block border border-amber-500/30">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full px-6 py-3 mb-6 shadow-2xl shadow-amber-500/50 border border-amber-400/30">
              <TrendingUp className="w-6 h-6 animate-pulse" />
              <span className="font-bold">Gerçekçi Hedefler</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl">
              Kilo Verme/Alma Süresi Hesaplayıcı
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hedef kilonuza ulaşmak için gereken süreyi ve günlük kalori ihtiyacınızı hesaplayın
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Calculator Form */}
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-amber-500/50">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Hedef Bilgileriniz</h2>
              </div>

              <form onSubmit={calculateTime} className="space-y-8">
                {/* Goal */}
                <div className="space-y-4">
                  <label className="text-lg font-bold text-white">Hedefiniz</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setGoal("lose")}
                      className={`p-4 rounded-2xl font-bold transition-all duration-300 ${
                        goal === "lose"
                          ? "bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-2xl shadow-red-500/50 scale-105"
                          : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      📉 Kilo Vermek
                    </button>
                    <button
                      type="button"
                      onClick={() => setGoal("gain")}
                      className={`p-4 rounded-2xl font-bold transition-all duration-300 ${
                        goal === "gain"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-2xl shadow-blue-500/50 scale-105"
                          : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      📈 Kilo Almak
                    </button>
                  </div>
                </div>

                {/* Current Weight */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Mevcut Kilonuz (kg)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                      {currentWeight}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="200"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-orange-400 [&::-webkit-slider-thumb]:to-red-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-orange-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                  />
                  <div className="flex justify-between text-xs text-gray-400 px-1">
                    <span>30 kg</span>
                    <span>200 kg</span>
                  </div>
                </div>

                {/* Target Weight */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Hedef Kilonuz (kg)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                      {targetWeight}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="200"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-green-400 [&::-webkit-slider-thumb]:to-emerald-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-green-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                  />
                  <div className="flex justify-between text-xs text-gray-400 px-1">
                    <span>30 kg</span>
                    <span>200 kg</span>
                  </div>
                </div>

                {/* Weekly Rate */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Haftalık Hız (kg/hafta)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                      {weeklyRate.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={weeklyRate}
                    onChange={(e) => setWeeklyRate(parseFloat(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-400 [&::-webkit-slider-thumb]:to-cyan-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-blue-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                  />
                  <div className="flex justify-between text-xs text-gray-400 px-1">
                    <span>0.1 kg/hafta</span>
                    <span>2.0 kg/hafta</span>
                  </div>
                  <p className="text-sm text-gray-300">Önerilen: 0.5 kg/hafta (sağlıklı ve sürdürülebilir)</p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-16 text-xl font-black bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 hover:from-amber-600 hover:via-orange-700 hover:to-yellow-600 shadow-2xl shadow-amber-500/50 rounded-2xl border-2 border-amber-400/50 hover:scale-105 transition-all duration-300"
                >
                  <Zap className="w-6 h-6 mr-2 animate-pulse" />
                  Süreyi Hesapla
                </Button>
              </form>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {/* Timeline */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-3xl border border-amber-400/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-8 h-8 text-amber-400 animate-pulse" />
                    <h3 className="text-2xl font-black text-white">Hedefe Ulaşma Süresi</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                        {result.days}
                      </div>
                      <div className="text-gray-300 text-sm mt-1">Gün</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black bg-gradient-to-r from-orange-300 to-yellow-400 bg-clip-text text-transparent">
                        {result.weeks}
                      </div>
                      <div className="text-gray-300 text-sm mt-1">Hafta</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
                        {result.months}
                      </div>
                      <div className="text-gray-300 text-sm mt-1">Ay</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300 text-sm mb-2">Hedef Tarih</p>
                    <p className="text-2xl font-bold text-white">{result.targetDate}</p>
                  </div>
                </div>

                {/* Calorie Deficit */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-red-500/20 to-pink-600/20 rounded-3xl border border-red-400/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-8 h-8 text-red-400 animate-pulse" />
                    <h3 className="text-2xl font-black text-white">Kalori {goal === "lose" ? "Açığı" : "Fazlası"}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-300 text-sm mb-2">Günlük</p>
                      <p className="text-4xl font-black bg-gradient-to-r from-red-300 to-pink-400 bg-clip-text text-transparent">
                        {result.dailyDeficit}
                      </p>
                      <p className="text-gray-300 text-sm mt-1">kcal/gün</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm mb-2">Haftalık</p>
                      <p className="text-4xl font-black bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent">
                        {result.weeklyDeficit}
                      </p>
                      <p className="text-gray-300 text-sm mt-1">kcal/hafta</p>
                    </div>
                  </div>
                </div>

                {/* Pace & Warning */}
                <div className={`backdrop-blur-2xl rounded-3xl border p-8 shadow-2xl ${
                  result.warning 
                    ? 'bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-400/30' 
                    : 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-400/30'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    {result.warning ? (
                      <AlertCircle className="w-8 h-8 text-orange-400 animate-pulse" />
                    ) : (
                      <Target className="w-8 h-8 text-green-400 animate-pulse" />
                    )}
                    <h3 className="text-2xl font-black text-white">Hızınız</h3>
                  </div>
                  <p className={`text-3xl font-bold mb-4 ${result.warning ? 'text-orange-300' : 'text-green-300'}`}>
                    {result.pace}
                  </p>
                  {result.warning && (
                    <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4">
                      <p className="text-gray-200 text-sm leading-relaxed">{result.warning}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SEO Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-12">
              <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Kilo Verme ve Alma Sürecinde Gerçekçi Hedefler
              </h2>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Kilo yönetimi sabır ve tutarlılık gerektiren bir süreçtir. Haftada 0.5-1 kg kilo kaybı/kazancı sağlıklı ve sürdürülebilir kabul 
                edilir. 1 kg yağ yaklaşık 7700 kalori demektir; bu yüzden haftada 0.5 kg kilo vermek için günlük 550 kalori açığı (7700 ÷ 2 ÷ 7) 
                oluşturmanız gerekir. Örneğin, 80 kg'dan 70 kg'a düşmek isteyen biri haftada 0.5 kg kaybetmeyi hedeflerse, bu 10 kg ÷ 0.5 = 20 hafta 
                (yaklaşık 5 ay) sürer. Hızlı kilo kaybı genellikle su ve kas kaybıdır, yağ değil. Ayrıca, hızlı diyetler metabolizmayı yavaşlatır ve 
                yoyo etkisi yaratır.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Kalori Açığı ve Fazlası Stratejileri
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Kilo vermek için kalori açığı oluşturmalısınız: yediğinizden daha fazla yakmalısınız. Haftada 0.5 kg kaybetmek için günlük 
                500-550 kalori açığı ideal. Bunu hem beslenme hem egzersizle sağlayabilirsiniz: 300 kalori daha az yemek + 200 kalori daha fazla 
                yakma. Kilo almak için kalori fazlası gereklidir. Haftada 0.5 kg kas yapmak için günlük 300-500 kalori fazlası almalısınız ve 
                kuvvet antrenmanı yapmalısınız. Aşırı kalori açığı (günde 1000+ kalori) metabolizmayı yavaşlatır, kas kaybına neden olur ve 
                yorgunluk, saç dökülmesi, hormonal dengesizliklere yol açar. Asla BMR'nizin altında kalori almayın.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Hedef Belirleme ve İlerleme Takibi
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                SMART hedefler belirleyin: Specific (belirli), Measurable (ölçülebilir), Achievable (ulaşılabilir), Relevant (ilgili), Time-bound 
                (zamana bağlı). "Kilo vermek istiyorum" yerine "3 ayda 6 kg vereceğim" daha etkilidir. Haftalık aynı gün, aynı saat, aynı koşullarda 
                (sabah, tuvaletten sonra, aç karnına) tartılın. Günlük tartılmayın; su dengesi dalgalanmaları sizi yanıltabilir. Kilo kaybı doğrusal 
                değildir; bazı haftalar 0.5 kg, bazıları 0.2 kg, bazıları 0 kg olabilir. Trend önemlidir. Fotoğraf çekin ve ölçümler alın (bel, kalça, 
                kol çevresi) çünkü bazen kilo sabit kalır ama vücut kompozisyonu değişir. Platolar normaldir; 2-3 hafta kilo vermezseniz kalori 
                alımını hafifçe azaltın veya aktiviteyi artırın.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Yaygın Hatalar ve Çözümleri
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Çok hızlı kilo vermeye çalışmak en yaygın hatadır; bu sürdürülemez ve sağlıksızdır. Gizli kalori alımı (soslar, atıştırmalıklar, 
                içecekler) insanları yanıltır; her şeyi kaydedin. Kas kaybı önlenmezse metabolizma yavaşlar; proteini yüksek tutun ve direnç 
                antrenmanı yapın. Sadece tartıya odaklanmak yanıltıcıdır; vücut kompozisyonuna da bakın. Cheat meal yerine cheat day yapmak kalori 
                açığını ortadan kaldırır. Uyku yetersizliği grelin (açlık hormonu) artırır ve leptin (tokluk hormonu) azaltır; günde 7-9 saat uyuyun. 
                Stres kortizol seviyesini yükseltir ve kilo kaybını engeller; meditasyon ve egzersiz stresi azaltır. Sabırlı olun; sağlıklı kilo kaybı 
                yavaş ama kalıcıdır.
              </p>

              <div className="mt-12 text-center">
                <a 
                  href="/hesaplayicilar" 
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg hover:from-amber-600 hover:to-orange-700 shadow-2xl shadow-amber-500/50 border border-amber-400/30 hover:scale-105 transition-all duration-300"
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
