import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Flame, Zap, TrendingUp, Activity, Clock, Weight, Pizza, Apple, Coffee, Sandwich, ChevronRight } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CalorieBurnCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface Activity {
  id: string;
  name: string;
  met: number;
  category: string;
  icon: string;
  color: string;
}

interface CalorieResult {
  calories: number;
  met: number;
  activityName: string;
  foodEquivalents: { name: string; amount: string; icon: any }[];
  intensityLevel: string;
  intensityColor: string;
}

const ACTIVITIES: Activity[] = [
  { id: "walk-slow", name: "Yavaş Yürüyüş", met: 3.0, category: "Yürüyüş", icon: "🚶", color: "from-green-400 to-emerald-500" },
  { id: "walk-moderate", name: "Orta Tempoda Yürüyüş", met: 3.5, category: "Yürüyüş", icon: "🚶‍♂️", color: "from-green-500 to-emerald-600" },
  { id: "walk-fast", name: "Hızlı Yürüyüş", met: 5.0, category: "Yürüyüş", icon: "🏃", color: "from-lime-500 to-green-600" },
  
  { id: "run-light", name: "Hafif Koşu (8 km/s)", met: 8.0, category: "Koşu", icon: "🏃‍♀️", color: "from-orange-400 to-red-500" },
  { id: "run-moderate", name: "Orta Hızda Koşu (10 km/s)", met: 10.0, category: "Koşu", icon: "🏃‍♂️", color: "from-orange-500 to-red-600" },
  { id: "run-fast", name: "Hızlı Koşu (12 km/s)", met: 12.0, category: "Koşu", icon: "💨", color: "from-red-500 to-rose-600" },
  
  { id: "cycle-light", name: "Bisiklet (Hafif, <16 km/s)", met: 4.0, category: "Bisiklet", icon: "🚴", color: "from-cyan-400 to-blue-500" },
  { id: "cycle-moderate", name: "Bisiklet (Orta, 16-19 km/s)", met: 8.0, category: "Bisiklet", icon: "🚴‍♀️", color: "from-blue-500 to-indigo-600" },
  { id: "cycle-vigorous", name: "Bisiklet (Yoğun, 19-22 km/s)", met: 10.0, category: "Bisiklet", icon: "🚴‍♂️", color: "from-indigo-500 to-purple-600" },
  { id: "cycle-racing", name: "Bisiklet (Yarış, >22 km/s)", met: 16.0, category: "Bisiklet", icon: "🏁", color: "from-purple-500 to-pink-600" },
  
  { id: "swim-light", name: "Yüzme (Hafif)", met: 6.0, category: "Yüzme", icon: "🏊", color: "from-cyan-400 to-teal-500" },
  { id: "swim-moderate", name: "Yüzme (Orta)", met: 8.0, category: "Yüzme", icon: "🏊‍♀️", color: "from-teal-500 to-cyan-600" },
  { id: "swim-vigorous", name: "Yüzme (Yoğun)", met: 11.0, category: "Yüzme", icon: "🏊‍♂️", color: "from-cyan-600 to-blue-700" },
  
  { id: "weightlifting", name: "Ağırlık Antrenmanı", met: 6.0, category: "Spor Salonu", icon: "🏋️", color: "from-amber-400 to-orange-500" },
  { id: "hiit", name: "HIIT Antrenmanı", met: 12.0, category: "Spor Salonu", icon: "⚡", color: "from-red-500 to-orange-600" },
  { id: "yoga", name: "Yoga", met: 3.0, category: "Spor Salonu", icon: "🧘", color: "from-purple-400 to-pink-500" },
  { id: "pilates", name: "Pilates", met: 4.0, category: "Spor Salonu", icon: "🤸", color: "from-pink-400 to-rose-500" },
  { id: "crossfit", name: "CrossFit", met: 10.0, category: "Spor Salonu", icon: "💪", color: "from-orange-500 to-red-600" },
  { id: "bodyweight", name: "Vücut Ağırlığı Egzersizleri", met: 5.0, category: "Spor Salonu", icon: "🤾", color: "from-yellow-500 to-amber-600" },
  
  { id: "football", name: "Futbol", met: 10.0, category: "Takım Sporları", icon: "⚽", color: "from-green-500 to-emerald-600" },
  { id: "basketball", name: "Basketbol", met: 8.0, category: "Takım Sporları", icon: "🏀", color: "from-orange-400 to-amber-500" },
  { id: "tennis", name: "Tenis", met: 8.0, category: "Takım Sporları", icon: "🎾", color: "from-lime-500 to-green-600" },
  { id: "volleyball", name: "Voleybol", met: 4.0, category: "Takım Sporları", icon: "🏐", color: "from-blue-400 to-cyan-500" },
  { id: "badminton", name: "Badminton", met: 5.5, category: "Takım Sporları", icon: "🏸", color: "from-teal-400 to-cyan-500" },
  
  { id: "dancing", name: "Dans", met: 5.0, category: "Diğer", icon: "💃", color: "from-pink-400 to-rose-500" },
  { id: "boxing", name: "Boks", met: 12.0, category: "Diğer", icon: "🥊", color: "from-red-600 to-rose-700" },
  { id: "climbing", name: "Dağcılık/Tırmanış", met: 7.5, category: "Diğer", icon: "🧗", color: "from-stone-500 to-slate-600" },
  { id: "rowing", name: "Kürek Çekme", met: 9.0, category: "Diğer", icon: "🚣", color: "from-blue-500 to-indigo-600" },
];

export default function CalorieBurnCalculator({ categoryGroups, currentPath }: CalorieBurnCalculatorProps) {
  const [weight, setWeight] = useState<number>(75);
  const [duration, setDuration] = useState<number>(30);
  const [selectedActivity, setSelectedActivity] = useState<Activity>(ACTIVITIES[0]);
  const [result, setResult] = useState<CalorieResult | null>(null);

  const calculateCalories = () => {
    const hours = duration / 60;
    const calories = selectedActivity.met * weight * hours;
    
    let intensityLevel = "";
    let intensityColor = "";
    
    if (selectedActivity.met < 4) {
      intensityLevel = "Düşük Yoğunluk";
      intensityColor = "from-green-500 to-emerald-600";
    } else if (selectedActivity.met < 7) {
      intensityLevel = "Orta Yoğunluk";
      intensityColor = "from-yellow-500 to-orange-600";
    } else if (selectedActivity.met < 10) {
      intensityLevel = "Yüksek Yoğunluk";
      intensityColor = "from-orange-500 to-red-600";
    } else {
      intensityLevel = "Çok Yüksek Yoğunluk";
      intensityColor = "from-red-500 to-rose-700";
    }

    const foodEquivalents = [
      { name: "Pizza Dilimi", amount: `${(calories / 285).toFixed(1)} dilim`, icon: Pizza },
      { name: "Orta Boy Elma", amount: `${(calories / 95).toFixed(1)} adet`, icon: Apple },
      { name: "Kahve (Şekerli)", amount: `${(calories / 150).toFixed(1)} fincan`, icon: Coffee },
      { name: "Sandviç", amount: `${(calories / 350).toFixed(1)} adet`, icon: Sandwich },
    ];

    setResult({
      calories: Math.round(calories),
      met: selectedActivity.met,
      activityName: selectedActivity.name,
      foodEquivalents,
      intensityLevel,
      intensityColor
    });
  };

  const groupedActivities = ACTIVITIES.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400 to-orange-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-400 to-red-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-amber-400 hover:text-amber-300 font-medium text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full inline-block border border-amber-500/30" data-testid="link-calculators">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full px-6 py-3 mb-6 shadow-2xl shadow-amber-500/50 border border-amber-400/30">
              <Flame className="w-6 h-6 animate-pulse" />
              <span className="font-bold">Bilimsel MET Değerleri</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-amber-400 via-orange-500 to-red-400 bg-clip-text text-transparent drop-shadow-2xl" data-testid="text-heading">
              Kalori Yakma Hesaplayıcı
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Aktivitenize göre yaktığınız kaloriyi hesaplayın ve yaktığınız kalorilerin hangi besinlere eşit olduğunu görün!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <div className="space-y-8">
              <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-amber-500/50">
                    <Weight className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-white">Parametreleriniz</h2>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-lg font-bold text-white">Kilonuz (kg)</label>
                      <span className="text-4xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent" data-testid="text-weight">
                        {weight}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="150"
                      value={weight}
                      onChange={(e) => setWeight(parseInt(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-amber-500/20 to-orange-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-orange-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-amber-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                      data-testid="slider-weight"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-lg font-bold text-white">Süre (dakika)</label>
                      <span className="text-4xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent" data-testid="text-duration">
                        {duration}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="180"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-orange-400 [&::-webkit-slider-thumb]:to-red-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-orange-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                      data-testid="slider-duration"
                    />
                  </div>
                </div>

                <Button
                  onClick={calculateCalories}
                  className="w-full h-16 text-xl font-black bg-gradient-to-r from-amber-500 via-orange-600 to-red-500 hover:from-amber-600 hover:via-orange-700 hover:to-red-600 shadow-2xl shadow-amber-500/50 rounded-2xl border-2 border-amber-400/50 hover:scale-105 transition-all duration-300 mt-8"
                  data-testid="button-calculate"
                >
                  <Zap className="w-6 h-6 mr-2 animate-pulse" />
                  Kalori Yakımını Hesapla
                </Button>
              </div>

              <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg shadow-orange-500/50">
                    <Activity className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-white">Seçili Aktivite</h2>
                </div>
                
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/10 rounded-2xl p-6 border-2 border-amber-400/30">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{selectedActivity.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-white mb-2" data-testid="text-activity-name">{selectedActivity.name}</h3>
                      <div className="flex items-center gap-2 text-amber-300">
                        <Flame className="w-5 h-5" />
                        <span className="font-bold">MET Değeri: {selectedActivity.met}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {result && (
              <div className="space-y-6">
                <div className={`backdrop-blur-2xl bg-gradient-to-br ${result.intensityColor}/20 rounded-3xl border border-amber-400/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Flame className="w-8 h-8 text-amber-400 animate-pulse" />
                    <h3 className="text-2xl font-black text-white">Yaktığınız Kalori</h3>
                  </div>
                  <div className="text-8xl font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent mb-4" data-testid="text-calories">
                    {result.calories}
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-white">kcal</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-amber-400" />
                      <p className="text-lg text-gray-200">{result.intensityLevel}</p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
                  <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                    <Pizza className="w-6 h-6 text-amber-400" />
                    Besin Eşdeğeri
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {result.foodEquivalents.map((food, index) => {
                      const IconComponent = food.icon;
                      return (
                        <div key={index} className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all" data-testid={`card-food-${index}`}>
                          <IconComponent className="w-8 h-8 text-amber-400 mb-2" />
                          <p className="text-sm text-gray-300 mb-1">{food.name}</p>
                          <p className="text-lg font-bold text-white">{food.amount}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
                  <h3 className="text-xl font-black text-white mb-6">Yoğunluk Seviyesi</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-32 text-sm text-gray-300">Düşük</div>
                      <Progress value={result.met < 4 ? 100 : 0} className="h-3" />
                      <div className="text-sm text-gray-400">3 MET</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 text-sm text-gray-300">Orta</div>
                      <Progress value={result.met >= 4 && result.met < 7 ? 100 : 0} className="h-3" />
                      <div className="text-sm text-gray-400">4-6 MET</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 text-sm text-gray-300">Yüksek</div>
                      <Progress value={result.met >= 7 && result.met < 10 ? 100 : 0} className="h-3" />
                      <div className="text-sm text-gray-400">7-9 MET</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 text-sm text-gray-300">Çok Yüksek</div>
                      <Progress value={result.met >= 10 ? 100 : 0} className="h-3" />
                      <div className="text-sm text-gray-400">10+ MET</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 mb-16">
            <h2 className="text-4xl font-black text-white mb-8 flex items-center gap-3">
              <Activity className="w-10 h-10 text-amber-400" />
              Aktivite Seçin
            </h2>
            
            {Object.entries(groupedActivities).map(([category, activities]) => (
              <div key={category} className="mb-8 last:mb-0">
                <h3 className="text-2xl font-bold text-amber-300 mb-4 flex items-center gap-2">
                  <ChevronRight className="w-6 h-6" />
                  {category}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {activities.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => setSelectedActivity(activity)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                        selectedActivity.id === activity.id
                          ? `bg-gradient-to-br ${activity.color}/30 border-amber-400 shadow-lg shadow-amber-500/30 scale-105`
                          : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30"
                      }`}
                      data-testid={`button-activity-${activity.id}`}
                    >
                      <div className="text-4xl mb-2">{activity.icon}</div>
                      <p className="text-sm font-bold text-white mb-1">{activity.name}</p>
                      <div className="flex items-center justify-center gap-1 text-xs text-amber-300">
                        <Flame className="w-3 h-3" />
                        <span>{activity.met} MET</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <article className="prose prose-lg prose-invert max-w-none">
            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-12">
              <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                MET Değerleri Nedir? Kalori Yakımı Nasıl Hesaplanır?
              </h2>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                MET (Metabolic Equivalent of Task - Metabolik Eşdeğer), fiziksel aktivite sırasında harcanan enerjiyi ölçmek için kullanılan standart bir birimdir. 1 MET, dinlenme halinde vücudunuzun harcadığı enerji miktarına eşittir ve kilogram başına saatte yaklaşık 1 kilokaloridir (kcal/kg/saat). Örneğin, 8 MET değerine sahip bir aktivite, dinlenme durumuna göre 8 kat daha fazla enerji harcar. Kalori yakımı hesaplama formülü oldukça basittir: Yakılan Kalori = MET Değeri × Vücut Ağırlığı (kg) × Süre (saat). Yani 75 kg ağırlığında bir kişi 30 dakika (0.5 saat) boyunca 8 MET değerinde koşu yaparsa: 8 × 75 × 0.5 = 300 kalori yakar. MET sisteminin en büyük avantajı, farklı aktiviteleri ve farklı vücut ağırlıklarını karşılaştırabilmenizi sağlamasıdır. Kompendiyum of Physical Activities adlı bilimsel kaynak, 800'den fazla aktivitenin MET değerlerini içerir ve düzenli olarak güncellenir. Düşük yoğunluklu aktiviteler (3 MET altı) minimal kalori yakar; yoga, yavaş yürüyüş gibi. Orta yoğunluklu aktiviteler (3-6 MET) günlük egzersizler için idealdir; hızlı yürüyüş, hafif bisiklet, dans. Yüksek yoğunluklu aktiviteler (6-9 MET) ciddi kalori yakımı sağlar; koşu, yüzme, tenis. Çok yüksek yoğunluklu aktiviteler (9+ MET) maksimum kalori yakımı sunar; HIIT, yarış temposu koşu, boks. MET değerlerini kullanarak haftalık enerji harcamanızı planlayabilir, kilo verme veya kilo alma hedeflerinize göre aktivite seçebilirsiniz.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Yağ Yakımı İçin En İyi Egzersizler: MET Değerlerine Göre Sıralama
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Yağ yakmak için en etkili egzersizler yüksek MET değerine sahip olanlardır ancak sürdürülebilirlik de önemlidir. İşte bilimsel olarak kanıtlanmış en etkili yağ yakıcı egzersizler: (1) HIIT (High-Intensity Interval Training) - 12-15 MET: Kısa süreli maksimal efort ile dinlenme periyotlarını birleştirir. 20-30 dakikalık bir HIIT seansı, 45-60 dakikalık orta tempolu koşu kadar kalori yakar. Ek olarak, egzersiz sonrası oksijen tüketimi (EPOC) sayesinde antrenman bittikten sonra bile 24-48 saat boyunca kalori yakmaya devam edersiniz. (2) Koşu (Yüksek Tempo) - 10-12 MET: 10 km/saat ve üzeri hızlarda koşu, dakikada 10-15 kalori yakar. İsabet tempoda koşu (threshold running) hem aerobik kapasiteyi artırır hem maksimum yağ yakımı sağlar. Eğimli koşu (treadmill incline) MET değerini %15-25 artırır. (3) Bisiklet (Yarış Temposu) - 12-16 MET: Yüksek dirençli spinning veya outdoor cycling, bacak kaslarını yoğun şekilde çalıştırarak büyük miktarda kalori yakar. Interval cycling (aralıklı bisiklet) steady-state bisikletten %30 daha fazla kalori yakar. (4) Yüzme (Yoğun) - 10-11 MET: Tüm vücudu çalıştırır, eklemlere minimum stres yapar, kardiyovasküler dayanıklılığı artırır. Kelebek yüzüşü en yüksek MET değerine (13.8) sahiptir. (5) Boks/Kickboks - 12-13 MET: Hem kardiyoyu hem kas gücünü geliştirir. Heavy bag work (kum torbası çalışması) özellikle etkilidir. (6) CrossFit/Fonksiyonel Antrenman - 10-12 MET: Ağırlık kaldırma, gymnastics ve kardiyoyu birleştirir. Yüksek kalori yakımı + kas gelişimi. (7) Kürek Çekme (Rowing) - 9-12 MET: Tüm vücudu çalıştırır, özellikle sırt, core ve bacaklar. Düşük impact, yüksek kalori. Unutmayın: en iyi egzersiz, düzenli yapabildiğiniz egzersizdir. Haftada 3-5 gün, 30-60 dakika orta-yüksek yoğunluklu egzersiz hedefleyin.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                HIIT vs Steady-State Cardio: Hangisi Daha Fazla Yağ Yakar?
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                HIIT (High-Intensity Interval Training) ve steady-state cardio (sürekli tempoda kardiyovasküler egzersiz) arasındaki tartışma fitness dünyasının en büyük konularından biridir. Her ikisinin de avantajları vardır ancak kalori yakımı açısından farklılıklar gösterirler. HIIT, kısa süreli (20-45 saniye) maksimal veya maksimale yakın eforu, aktif dinlenme veya düşük yoğunluklu periyotlarla (10-60 saniye) değiştirir. Tipik bir HIIT seansı 15-30 dakika sürer. HIIT'nin avantajları: (1) Yüksek kalori yakımı kısa sürede: 30 dakikalık HIIT, 60 dakikalık steady cardio ile aynı veya daha fazla kalori yakabilir. (2) EPOC (Excess Post-Exercise Oxygen Consumption): Antrenman sonrası 24-48 saat boyunca metabolizma yükselir ve ek 6-15% kalori yakarsınız. (3) Zaman verimliliği: Meşgul insanlar için ideal. (4) Kas kaybını minimize eder: Yüksek yoğunluk, kasları korur ve hatta geliştirir. (5) İnsülin duyarlılığını artırır. Dezavantajları: (1) Yüksek eklem stresi: Sakatlık riski artar. (2) Merkezi sinir sistemi yorgunluğu: Her gün yapılamaz, haftada 2-4 kez idealdir. (3) Deneyim gerektirir: Başlangıç seviyesinde olanlar için zor olabilir. Steady-State Cardio ise orta yoğunlukta (maksimum kalp hızının %60-75'i), uzun süre (30-90 dakika) yapılan kardiyodur; koşu, bisiklet, yüzme gibi. Avantajları: (1) Eklemlere düşük stres: Sakatlık riski minimal. (2) Aerobik kapasite gelişimi: Kalp ve akciğer sağlığını iyileştirir. (3) Yağ yakımı bölgesinde kalır: Uzun süreli egzersizde enerji kaynağı olarak yağlar kullanılır. (4) Recovery (toparlanma) egzersizi olarak kullanılabilir. (5) Mental sağlık: Uzun koşular endorfin salgılar, stresi azaltır. Dezavantajları: (1) Zaman alıcı: 60-90 dakika ayırmak gerekebilir. (2) Kas kaybı riski: Uzun süreli kardiyoda vücut kas dokusunu yakabilir. (3) Adaptasyon: Zamanla vücut alışır ve daha az kalori yakar (metabolik adaptasyon). Hangisi daha iyi? Araştırmalar gösteriyor ki: Kısa sürede maksimum kalori için: HIIT kazanır. Uzun vadeli yağ yakımı (EPOC dahil) için: HIIT kazanır. Aerobik kapasite ve dayanıklılık için: Steady-state daha etkili. Kas koruma için: HIIT daha iyi. En ideal yaklaşım her ikisini de kombine etmektir: Haftada 2-3 gün HIIT + 2-3 gün steady-state cardio.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                Kardiyovasküler Egzersiz vs Kuvvet Antrenmanı: Kalori Yakımı Karşılaştırması
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Kardiyovasküler egzersiz (kardio) ve kuvvet antrenmanı (ağırlık kaldırma) kalori yakımı ve vücut kompozisyonu açısından farklı mekanizmalarla çalışır. Kardiyonun anında kalori yakımı daha yüksektir; 60 dakikalık orta tempolu koşu 400-600 kalori yakarken, 60 dakikalık ağırlık antrenmanı 200-400 kalori yakar. Ancak kuvvet antrenmanının uzun vadeli faydaları çok büyüktür. Kas dokusu metabolik olarak aktiftir; 1 kg kas günde 13-15 ekstra kalori yakar, 1 kg yağ ise sadece 4-5 kalori. Yani kas kütlenizi artırarak bazal metabolik hızınızı (BMR) kalıcı olarak yükseltirsiniz. Ağırlık antrenmanından sonra EPOC etkisi kardiyoya göre daha uzun sürer; 48-72 saat boyunca metabolizma yüksek kalır. Compound hareketler (squat, deadlift, bench press) en fazla kalori yakar çünkü birden fazla kas grubunu aynı anda çalıştırır. Circuit training (devre antrenmanı) kardiyonun kalori yakıcı etkisini ağırlık antrenmanının kas geliştirici etkisiyle birleştirir; minimal dinlenme ile ağırlık egzersizlerini arka arkaya yaparsınız. Bu yöntem 60 dakikada 400-600 kalori yakabilir. Araştırmalar gösteriyor ki: Sadece kardyo yapanlar kilo verirken hem yağ hem kas kaybeder. Sadece ağırlık antrenmanı yapanlar kas kazanır ama yağ kaybı yavaş olabilir. Kardio + ağırlık antrenmanı kombinasyonu yapanlar maksimum yağ kaybı + kas koruma/kazanımı görür. Optimal yaklaşım: Haftada 3-4 gün ağırlık antrenmanı (compound hareketler odaklı) + 2-3 gün kardio (HIIT veya steady-state). Ağırlık antrenmanını önceliklendirin çünkü kas kütlesi uzun vadede kalori yakımının temelidir. Kardiyoyu ek kalori açığı yaratmak ve kardiyovasküler sağlığı iyileştirmek için kullanın.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Kalori Yakımını Maksimize Etmenin 10 Bilimsel Yöntemi
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                (1) Yüksek Yoğunluklu Egzersizleri Tercih Edin: 8+ MET değerine sahip aktiviteler seçin. HIIT, koşu, bisiklet, yüzme gibi. (2) Interval Training Kullanın: Sabit tempoda egzersiz yerine yüksek-düşük yoğunluk değişimini tercih edin. Örneğin: 1 dakika sprint + 2 dakika yavaş koşu, 8 kez tekrar. Bu yöntem %25-50 daha fazla kalori yakar. (3) Compound Hareketlerle Ağırlık Çalışın: Squat, deadlift, bench press, overhead press gibi birden fazla kas grubunu çalıştıran hareketler isolation hareketlerden çok daha fazla kalori yakar. (4) Kas Kütlesini Artırın: Her 1 kg kas günde 13-15 ekstra kalori yakar. 5 kg kas kazanırsanız, hiçbir şey yapmadan günde 65-75 ekstra kalori yakarsınız, yılda 23,000-27,000 kalori! (5) NEAT'i Artırın (Non-Exercise Activity Thermogenesis): Günlük aktivite seviyenizi yükseltin. Merdiven çıkın, yürüyün, ayakta çalışın. NEAT günde 200-800 ekstra kalori yakabilir. (6) Protein Alımını Artırın: Protein termojenik etkiye sahiptir; sindirim sırasında protein kalori değerinin %20-30'unu yakar. Günde kilogram başına 1.6-2.2g protein tüketin. (7) Kahvaltıyı Atlayın veya Aralıklı Oruç Yapın (Intermittent Fasting): Açlık durumunda vücut yağ yakımına geçer. 16:8 protokolü (16 saat oruç, 8 saat beslenme) popülerdir. (8) Sabah Aç Karnına Kardio Yapın (Fasted Cardio): Glikojen depoları düşükken yapılan kardio direkt yağları yakar. Ancak kas kaybını önlemek için öncesinde BCAA tüketebilirsiniz. (9) Çeşitlilik Sağlayın: Vücut aynı egzersize alışır ve daha az kalori yakar (metabolik adaptasyon). Her 4-6 haftada egzersiz programınızı değiştirin. (10) Yeterli Uyuyun: Uyku eksikliği metabolizmayı %5-20 yavaşlatır, açlık hormonlarını artırır, tokluk hormonlarını azaltır. Günde 7-9 saat kaliteli uyku hedefleyin. Bonus İpucu: Soğukta Egzersiz Yapın: Soğuk ortam vücudun kalori yakımını artırır (termogenez). Soğuk duş veya soğuk ortamda egzersiz metabolizmayı hızlandırır.
              </p>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
