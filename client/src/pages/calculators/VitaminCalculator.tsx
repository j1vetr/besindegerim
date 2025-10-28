import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Pill, Activity, Heart, AlertCircle, Apple, Fish, Beef, Milk, Wheat, Leaf, Sun } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface VitaminCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface Nutrient {
  name: string;
  unit: string;
  rda: number;
  function: string;
  foodSources: string[];
  icon: React.ReactNode;
  color: string;
}

export default function VitaminCalculator({ categoryGroups, currentPath }: VitaminCalculatorProps) {
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "moderate" | "active">("moderate");
  const [isPregnant, setIsPregnant] = useState<boolean>(false);
  const [isLactating, setIsLactating] = useState<boolean>(false);
  const [nutrients, setNutrients] = useState<Nutrient[]>([]);

  const calculateRDA = (e: React.FormEvent) => {
    e.preventDefault();

    // Base RDA values will be adjusted based on inputs
    const baseNutrients: Nutrient[] = [
      {
        name: "Vitamin A",
        unit: "mcg",
        rda: 0,
        function: "Görme sağlığı, bağışıklık sistemi",
        foodSources: ["Havuç", "Tatlı patates", "Karaciğer", "Ispanak"],
        icon: <Sun className="w-5 h-5" />,
        color: "from-orange-500 to-amber-600"
      },
      {
        name: "Vitamin C",
        unit: "mg",
        rda: 0,
        function: "Antioksidan, kolajen üretimi",
        foodSources: ["Portakal", "Çilek", "Biber", "Brokoli"],
        icon: <Apple className="w-5 h-5" />,
        color: "from-yellow-500 to-orange-600"
      },
      {
        name: "Vitamin D",
        unit: "mcg",
        rda: 0,
        function: "Kemik sağlığı, kalsiyum emilimi",
        foodSources: ["Somon", "Yumurta", "Süt", "Güneş ışığı"],
        icon: <Sun className="w-5 h-5" />,
        color: "from-amber-500 to-yellow-600"
      },
      {
        name: "Vitamin E",
        unit: "mg",
        rda: 0,
        function: "Hücre koruma, antioksidan",
        foodSources: ["Badem", "Ayçiçek yağı", "Avokado", "Fındık"],
        icon: <Leaf className="w-5 h-5" />,
        color: "from-green-500 to-emerald-600"
      },
      {
        name: "Vitamin K",
        unit: "mcg",
        rda: 0,
        function: "Kan pıhtılaşması, kemik sağlığı",
        foodSources: ["Ispanak", "Brokoli", "Lahana", "Yeşil fasulye"],
        icon: <Leaf className="w-5 h-5" />,
        color: "from-emerald-500 to-green-700"
      },
      {
        name: "Vitamin B1 (Tiamin)",
        unit: "mg",
        rda: 0,
        function: "Enerji metabolizması",
        foodSources: ["Tam tahıllar", "Domuz eti", "Kuruyemişler"],
        icon: <Wheat className="w-5 h-5" />,
        color: "from-blue-500 to-cyan-600"
      },
      {
        name: "Vitamin B2 (Riboflavin)",
        unit: "mg",
        rda: 0,
        function: "Enerji üretimi, hücre büyümesi",
        foodSources: ["Süt", "Yumurta", "Karaciğer", "Yeşil sebzeler"],
        icon: <Milk className="w-5 h-5" />,
        color: "from-cyan-500 to-blue-600"
      },
      {
        name: "Vitamin B3 (Niasin)",
        unit: "mg",
        rda: 0,
        function: "DNA onarımı, enerji üretimi",
        foodSources: ["Tavuk", "Ton balığı", "Mantar", "Fıstık"],
        icon: <Beef className="w-5 h-5" />,
        color: "from-indigo-500 to-purple-600"
      },
      {
        name: "Vitamin B6",
        unit: "mg",
        rda: 0,
        function: "Protein metabolizması, beyin gelişimi",
        foodSources: ["Tavuk", "Balık", "Patates", "Nohut"],
        icon: <Fish className="w-5 h-5" />,
        color: "from-purple-500 to-pink-600"
      },
      {
        name: "Vitamin B12",
        unit: "mcg",
        rda: 0,
        function: "Sinir sistemi, kırmızı kan hücreleri",
        foodSources: ["Et", "Balık", "Süt", "Yumurta"],
        icon: <Beef className="w-5 h-5" />,
        color: "from-pink-500 to-rose-600"
      },
      {
        name: "Folat (B9)",
        unit: "mcg",
        rda: 0,
        function: "DNA sentezi, hücre bölünmesi",
        foodSources: ["Yeşil yapraklı sebzeler", "Kuru fasulye", "Portakal"],
        icon: <Leaf className="w-5 h-5" />,
        color: "from-lime-500 to-green-600"
      },
      {
        name: "Kalsiyum",
        unit: "mg",
        rda: 0,
        function: "Kemik ve diş sağlığı",
        foodSources: ["Süt", "Peynir", "Yoğurt", "Brokoli"],
        icon: <Milk className="w-5 h-5" />,
        color: "from-slate-400 to-gray-600"
      },
      {
        name: "Demir",
        unit: "mg",
        rda: 0,
        function: "Oksijen taşıma, enerji üretimi",
        foodSources: ["Kırmızı et", "Ispanak", "Kuru fasulye", "Karaciğer"],
        icon: <Beef className="w-5 h-5" />,
        color: "from-red-500 to-rose-700"
      },
      {
        name: "Magnezyum",
        unit: "mg",
        rda: 0,
        function: "Kas ve sinir fonksiyonu, enerji",
        foodSources: ["Badem", "Ispanak", "Avokado", "Tam tahıllar"],
        icon: <Leaf className="w-5 h-5" />,
        color: "from-teal-500 to-cyan-600"
      },
      {
        name: "Çinko",
        unit: "mg",
        rda: 0,
        function: "Bağışıklık sistemi, yara iyileşmesi",
        foodSources: ["İstiridye", "Et", "Baklagiller", "Kuruyemişler"],
        icon: <Fish className="w-5 h-5" />,
        color: "from-sky-500 to-blue-600"
      },
      {
        name: "Potasyum",
        unit: "mg",
        rda: 0,
        function: "Kalp sağlığı, kas fonksiyonu",
        foodSources: ["Muz", "Patates", "Ispanak", "Fasulye"],
        icon: <Apple className="w-5 h-5" />,
        color: "from-yellow-400 to-amber-600"
      },
      {
        name: "Selenyum",
        unit: "mcg",
        rda: 0,
        function: "Antioksidan, tiroid fonksiyonu",
        foodSources: ["Brezilya fındığı", "Balık", "Et", "Yumurta"],
        icon: <Fish className="w-5 h-5" />,
        color: "from-orange-400 to-red-600"
      },
      {
        name: "Fosfor",
        unit: "mg",
        rda: 0,
        function: "Kemik sağlığı, enerji üretimi",
        foodSources: ["Süt", "Et", "Balık", "Kuruyemişler"],
        icon: <Milk className="w-5 h-5" />,
        color: "from-violet-500 to-purple-600"
      }
    ];

    // Calculate RDA based on gender, age, activity, pregnancy, lactation
    const calculated = baseNutrients.map(nutrient => {
      let rda = 0;

      // Vitamin A (mcg RAE)
      if (nutrient.name === "Vitamin A") {
        rda = gender === "male" ? 900 : 700;
        if (isPregnant) rda = 770;
        if (isLactating) rda = 1300;
      }

      // Vitamin C (mg)
      if (nutrient.name === "Vitamin C") {
        rda = gender === "male" ? 90 : 75;
        if (isPregnant) rda = 85;
        if (isLactating) rda = 120;
        if (activityLevel === "active") rda += 10;
      }

      // Vitamin D (mcg)
      if (nutrient.name === "Vitamin D") {
        rda = age > 70 ? 20 : 15;
        if (isPregnant || isLactating) rda = 15;
      }

      // Vitamin E (mg)
      if (nutrient.name === "Vitamin E") {
        rda = 15;
        if (isPregnant) rda = 15;
        if (isLactating) rda = 19;
      }

      // Vitamin K (mcg)
      if (nutrient.name === "Vitamin K") {
        rda = gender === "male" ? 120 : 90;
        if (isPregnant || isLactating) rda = 90;
      }

      // Vitamin B1 (mg)
      if (nutrient.name === "Vitamin B1 (Tiamin)") {
        rda = gender === "male" ? 1.2 : 1.1;
        if (isPregnant) rda = 1.4;
        if (isLactating) rda = 1.4;
      }

      // Vitamin B2 (mg)
      if (nutrient.name === "Vitamin B2 (Riboflavin)") {
        rda = gender === "male" ? 1.3 : 1.1;
        if (isPregnant) rda = 1.4;
        if (isLactating) rda = 1.6;
      }

      // Vitamin B3 (mg)
      if (nutrient.name === "Vitamin B3 (Niasin)") {
        rda = gender === "male" ? 16 : 14;
        if (isPregnant) rda = 18;
        if (isLactating) rda = 17;
      }

      // Vitamin B6 (mg)
      if (nutrient.name === "Vitamin B6") {
        rda = age > 50 ? (gender === "male" ? 1.7 : 1.5) : 1.3;
        if (isPregnant) rda = 1.9;
        if (isLactating) rda = 2.0;
      }

      // Vitamin B12 (mcg)
      if (nutrient.name === "Vitamin B12") {
        rda = 2.4;
        if (isPregnant) rda = 2.6;
        if (isLactating) rda = 2.8;
      }

      // Folat (mcg)
      if (nutrient.name === "Folat (B9)") {
        rda = 400;
        if (isPregnant) rda = 600;
        if (isLactating) rda = 500;
      }

      // Calcium (mg)
      if (nutrient.name === "Kalsiyum") {
        rda = age > 50 ? 1200 : 1000;
        if (isPregnant || isLactating) rda = 1000;
        if (age > 50 && gender === "female") rda = 1200;
      }

      // Iron (mg)
      if (nutrient.name === "Demir") {
        rda = gender === "male" ? 8 : 18;
        if (isPregnant) rda = 27;
        if (isLactating) rda = 9;
        if (age > 50 && gender === "female") rda = 8;
      }

      // Magnesium (mg)
      if (nutrient.name === "Magnezyum") {
        rda = gender === "male" ? (age > 30 ? 420 : 400) : (age > 30 ? 320 : 310);
        if (isPregnant) rda = age > 30 ? 360 : 350;
        if (isLactating) rda = age > 30 ? 320 : 310;
      }

      // Zinc (mg)
      if (nutrient.name === "Çinko") {
        rda = gender === "male" ? 11 : 8;
        if (isPregnant) rda = 11;
        if (isLactating) rda = 12;
      }

      // Potassium (mg)
      if (nutrient.name === "Potasyum") {
        rda = gender === "male" ? 3400 : 2600;
        if (isPregnant) rda = 2900;
        if (isLactating) rda = 2800;
        if (activityLevel === "active") rda += 200;
      }

      // Selenium (mcg)
      if (nutrient.name === "Selenyum") {
        rda = 55;
        if (isPregnant) rda = 60;
        if (isLactating) rda = 70;
      }

      // Phosphorus (mg)
      if (nutrient.name === "Fosfor") {
        rda = age > 70 ? 700 : 700;
        if (isPregnant || isLactating) rda = 700;
      }

      return { ...nutrient, rda: parseFloat(rda.toFixed(1)) };
    });

    setNutrients(calculated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-purple-400 hover:text-purple-300 font-medium text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full inline-block border border-purple-500/30" data-testid="link-calculators">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full px-6 py-3 mb-6 shadow-2xl shadow-purple-500/50 border border-purple-400/30">
              <Pill className="w-6 h-6 animate-pulse" />
              <span className="font-bold">18 Temel Vitamin ve Mineral</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-violet-400 bg-clip-text text-transparent drop-shadow-2xl">
              Günlük Vitamin & Mineral Hesaplayıcı
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Yaş, cinsiyet ve yaşam tarzınıza göre kişiselleştirilmiş günlük besin öğesi ihtiyacınızı öğrenin
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Calculator Form */}
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/50">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Bilgilerinizi Girin</h2>
              </div>

              <form onSubmit={calculateRDA} className="space-y-8">
                {/* Gender */}
                <div className="space-y-4">
                  <label className="text-lg font-bold text-white">Cinsiyet</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      data-testid="button-gender-male"
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
                      data-testid="button-gender-female"
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
                    <span className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent" data-testid="text-age-value">
                      {age}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    data-testid="input-age-slider"
                    className="w-full h-3 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-400 [&::-webkit-slider-thumb]:to-pink-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-purple-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                  />
                </div>

                {/* Activity Level */}
                <div className="space-y-4">
                  <label className="text-lg font-bold text-white">Aktivite Seviyesi</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setActivityLevel("sedentary")}
                      data-testid="button-activity-sedentary"
                      className={`p-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                        activityLevel === "sedentary"
                          ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl shadow-orange-500/50 scale-105"
                          : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      Hareketsiz
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivityLevel("moderate")}
                      data-testid="button-activity-moderate"
                      className={`p-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                        activityLevel === "moderate"
                          ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-xl shadow-yellow-500/50 scale-105"
                          : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      Orta
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivityLevel("active")}
                      data-testid="button-activity-active"
                      className={`p-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                        activityLevel === "active"
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/50 scale-105"
                          : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      Aktif
                    </button>
                  </div>
                </div>

                {/* Pregnancy/Lactation (Female only) */}
                {gender === "female" && (
                  <div className="space-y-4">
                    <label className="text-lg font-bold text-white">Özel Durum</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsPregnant(!isPregnant);
                          if (!isPregnant) setIsLactating(false);
                        }}
                        data-testid="button-pregnancy"
                        className={`p-4 rounded-2xl font-bold transition-all duration-300 ${
                          isPregnant
                            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl shadow-pink-500/50 scale-105"
                            : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                        }`}
                      >
                        🤰 Hamile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsLactating(!isLactating);
                          if (!isLactating) setIsPregnant(false);
                        }}
                        data-testid="button-lactation"
                        className={`p-4 rounded-2xl font-bold transition-all duration-300 ${
                          isLactating
                            ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-xl shadow-blue-500/50 scale-105"
                            : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                        }`}
                      >
                        🤱 Emziren
                      </button>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  data-testid="button-calculate"
                  className="w-full h-16 text-xl font-black bg-gradient-to-r from-purple-500 via-pink-600 to-violet-500 hover:from-purple-600 hover:via-pink-700 hover:to-violet-600 shadow-2xl shadow-purple-500/50 rounded-2xl border-2 border-purple-400/50 hover:scale-105 transition-all duration-300"
                >
                  <Heart className="w-6 h-6 mr-2 animate-pulse" />
                  Vitamin İhtiyacımı Hesapla
                </Button>
              </form>
            </div>

            {/* Info Card */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-3xl border border-purple-400/30 p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-8 h-8 text-purple-400 animate-pulse" />
                <h3 className="text-2xl font-black text-white">RDA Nedir?</h3>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p className="text-lg leading-relaxed">
                  <strong className="text-white">RDA (Recommended Dietary Allowance)</strong> - Önerilen Günlük Alım Miktarı, sağlıklı bireylerin %97-98'inin ihtiyacını karşılayacak besin öğesi miktarıdır.
                </p>
                
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-purple-400/20">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-purple-400" />
                    Önemli Bilgiler:
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>RDA değerleri yaş, cinsiyet ve özel durumlara göre değişir</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Hamilelik ve emzirme döneminde ihtiyaçlar artar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Aktif yaşam tarzı bazı vitaminlerin ihtiyacını artırır</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Üst limit değerlerini aşmamaya dikkat edin</span>
                    </li>
                  </ul>
                </div>

                <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-500/20 to-amber-600/20 rounded-2xl p-6 border border-yellow-400/30">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    Uyarı:
                  </h4>
                  <p className="text-sm">
                    Bu hesaplama aracı genel bir rehberdir. Sağlık sorunlarınız varsa veya takviye kullanmayı düşünüyorsanız mutlaka bir sağlık profesyoneline danışın.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results - Nutrient Cards */}
          {nutrients.length > 0 && (
            <div className="mb-16">
              <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Günlük Vitamin ve Mineral İhtiyaçlarınız
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nutrients.map((nutrient, index) => (
                  <div
                    key={index}
                    data-testid={`card-nutrient-${index}`}
                    className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/30"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 bg-gradient-to-r ${nutrient.color} rounded-2xl shadow-lg`}>
                          {nutrient.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{nutrient.name}</h3>
                          <p className="text-sm text-gray-400">{nutrient.function}</p>
                        </div>
                      </div>
                    </div>

                    {/* RDA Value */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent" data-testid={`text-rda-${index}`}>
                          {nutrient.rda}
                        </span>
                        <span className="text-xl text-gray-400 font-medium">{nutrient.unit}</span>
                      </div>
                      <p className="text-xs text-gray-400">Önerilen Günlük Alım</p>
                    </div>

                    {/* Progress Bar (Visual representation) */}
                    <div className="mb-4">
                      <Progress value={100} className="h-2" />
                      <p className="text-xs text-gray-400 mt-1">Günlük hedef</p>
                    </div>

                    {/* Food Sources */}
                    <div>
                      <p className="text-xs font-semibold text-purple-400 mb-2">Besin Kaynakları:</p>
                      <div className="flex flex-wrap gap-2">
                        {nutrient.foodSources.map((source, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-400/30 rounded-full text-xs text-gray-300 font-medium"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-12">
              <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Vitaminler ve Mineraller: Sağlıklı Yaşamın Temeli
              </h2>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Vitaminler ve mineraller, vücudumuzun düzgün çalışması için gerekli olan temel mikro besin öğeleridir. Vücut bu besin öğelerinin çoğunu kendisi üretemediği için, bunları yiyecekler ve içecekler yoluyla düzenli olarak almamız gerekir. Her vitamin ve mineralin kendine özgü işlevleri vardır; bazıları enerji üretiminde rol oynar, bazıları bağışıklık sistemini güçlendirir, bazıları kemikleri ve dişleri sağlamlaştırır, bazıları ise hücreleri hasardan korur. Yetersiz alım, uzun vadede ciddi sağlık sorunlarına yol açabilir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Yağda Çözünen Vitaminler: A, D, E, K
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-white">Vitamin A (Retinol):</strong> Görme sağlığı için hayati öneme sahiptir. Özellikle gece görüşü ve renk algısında kritik rol oynar. Bağışıklık sistemini güçlendirir, cilt sağlığını korur ve hücre büyümesini düzenler. Havuç, tatlı patates, ıspanak, karaciğer ve yumurta sarısı zengin kaynaklardır. Yetersizliği gece körlüğüne, kuru cilde ve enfeksiyonlara karşı hassasiyete neden olur. Aşırı alımı ise toksik olabilir, bu nedenle üst limit değerleri aşılmamalıdır.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-white">Vitamin D (Kalsiferol):</strong> "Güneş vitamini" olarak bilinir çünkü cildiniz güneş ışığına maruz kaldığında vücudunuz D vitamini üretir. Kalsiyum ve fosfor emilimini düzenleyerek kemik ve diş sağlığını korur. Bağışıklık sistemi fonksiyonlarını destekler, kas sağlığı için gereklidir ve bazı araştırmalar depresyon ve kalp hastalıklarıyla ilişkisini gösterir. Yağlı balıklar (somon, uskumru), yumurta sarısı, takviyeli süt ve mantar D vitamini kaynakları arasındadır. Yetersizliği çocuklarda raşitizme, yetişkinlerde osteomalazi ve osteoporoz riskine yol açar.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-white">Vitamin E (Tokoferol):</strong> Güçlü bir antioksidandır; hücreleri serbest radikallerin neden olduğu hasardan korur. Bağışıklık sistemini destekler, kan damarlarını genişletir ve kan pıhtılaşmasını önlemeye yardımcı olur. Cilt sağlığı ve yaşlanma karşıtı etkileriyle bilinir. Badem, fındık, ayçiçek yağı, avokado ve ıspanak iyi kaynaklardır. E vitamini eksikliği nadirdir ancak uzun vadede sinir ve kas hasarına neden olabilir.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-white">Vitamin K:</strong> Kan pıhtılaşması için vazgeçilmezdir; yaralanma durumunda kanın durmasını sağlar. Ayrıca kemik sağlığında önemli rol oynar ve kalsiyumun kemiklerde tutulmasına yardımcı olur. Yeşil yapraklı sebzeler (ıspanak, lahana, brokoli), yeşil fasulye ve soya fasulyesi zengin kaynaklardır. Yetersizliği kolay morarma, aşırı kanama ve kemik zayıflığına yol açabilir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                Suda Çözünen Vitaminler: B Kompleks ve C
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-white">B Vitamini Kompleksi:</strong> Sekiz farklı B vitamini vardır (B1, B2, B3, B5, B6, B7, B9, B12) ve her biri enerji metabolizmasında kritik rol oynar. Besinleri enerjiye dönüştürür, sinir sistemini destekler, kırmızı kan hücrelerinin oluşumuna yardımcı olur ve DNA sentezinde görev alır. B1 (tiamin) kalp ve sinir sağlığı için, B2 (riboflavin) enerji üretimi için, B3 (niasin) kolesterol yönetimi ve cilt sağlığı için, B6 protein metabolizması ve beyin gelişimi için, B12 sinir sistemi ve kırmızı kan hücresi üretimi için, folat (B9) ise DNA sentezi ve hamilelikte fetal gelişim için hayati öneme sahiptir.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Tam tahıllar, et, balık, yumurta, süt, baklagiller, yeşil yapraklı sebzeler ve kuruyemişler B vitaminlerinin zengin kaynaklarıdır. B12 vitamini özellikle hayvansal kaynaklarda bulunur, bu nedenle veganlar takviye almalıdır. B vitamini eksiklikleri yorgunluk, anemi, sinir hasarı, cilt problemleri ve hamilelik komplikasyonlarına neden olabilir. Özellikle hamile kadınlar folat eksikliğinden kaçınmak için yeterli alım sağlamalıdır.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-white">Vitamin C (Askorbik Asit):</strong> Güçlü bir antioksidan olan C vitamini, bağışıklık sistemini destekler, enfeksiyonlarla mücadele eder ve kolajen üretiminde kritik rol oynar. Kolajen, cildin, kemiklerin, kıkırdakların ve kan damarlarının yapı taşıdır. Ayrıca demir emilimini artırır ve yara iyileşmesini hızlandırır. Portakal, limon, çilek, kivi, biber, brokoli ve domates C vitamini açısından zengindir. Eksikliği skorbüt hastalığına yol açar; semptomları yorgunluk, diş eti kanaması, yavaş yara iyileşmesi ve eklem ağrılarıdır.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Temel Mineraller: Makro ve Mikro Elementler
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-white">Kalsiyum:</strong> Vücuttaki en bol mineraldir ve kemik ile diş yapısının %99'unu oluşturur. Ayrıca kas kasılması, sinir iletimi, kan pıhtılaşması ve kalp ritminin düzenlenmesinde rol oynar. Süt, peynir, yoğurt, brokoli, badem ve tahini iyi kaynaklardır. Yetersiz kalsiyum alımı osteoporoza, kemik kırılmalarına ve diş problemlerine yol açar. Özellikle çocukluk, ergenlik, hamilelik ve yaşlılık dönemlerinde ihtiyaç artar.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-white">Demir:</strong> Hemoglobin ve miyoglobinin bileşenidir; oksijen taşınmasını sağlar. Enerji üretiminde, bağışıklık fonksiyonlarında ve bilişsel gelişimde kritik rol oynar. Kırmızı et, karaciğer, ıspanak, mercimek, kuru fasulye ve tahıllar demir içerir. Demir iki formda bulunur: hem demiri (hayvansal) daha kolay emilir, hem olmayan demir (bitkisel) C vitaminiyle birlikte alındığında emilimi artar. Demir eksikliği anemiye, yorgunluğa, zayıf bağışıklığa ve bilişsel bozukluklara neden olur. Kadınlarda menstrüasyon nedeniyle ihtiyaç daha yüksektir; hamilelik ve emzirme dönemlerinde önemle dikkat edilmelidir.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-white">Magnezyum:</strong> 300'den fazla enzimatik reaksiyonda yer alan magnezyum, enerji üretimi, protein sentezi, kas ve sinir fonksiyonu, kan şekeri kontrolü ve kan basıncı düzenlemesi için gereklidir. Badem, ıspanak, siyah fasulye, avokado, tam tahıllar ve koyu çikolata magnezyum bakımından zengindir. Eksikliği kas kramplarına, yorgunluğa, kalp ritim bozukluklarına ve migren ataklarına yol açabilir. Stresin magnezyum seviyelerini düşürdüğü bilinmektedir.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-white">Çinko:</strong> Bağışıklık sistemi fonksiyonları, yara iyileşmesi, DNA sentezi, hücre bölünmesi ve protein yapımı için gereklidir. Tat ve koku alma duyularını destekler. İstiridye, kırmızı et, kümes hayvanları, baklagiller, kuruyemişler ve tam tahıllar çinko kaynaklarıdır. Çinko eksikliği büyüme geriliği, saç dökülmesi, bağışıklık zayıflığı, yara iyileşmesinde gecikme ve tat kaybına neden olur.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-white">Potasyum:</strong> Sıvı dengesi, sinir iletimi, kas kasılması ve kalp ritmi düzenlemesi için hayati öneme sahiptir. Tansiyonu dengelemeye yardımcı olur. Muz, patates, ıspanak, fasulye, avokado ve balık potasyum bakımından zengindir. Yetersiz potasyum alımı yüksek tansiyon, kalp ritim bozuklukları, kas zayıflığı ve yorgunluğa yol açar.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                <strong className="text-white">Selenyum:</strong> Güçlü antioksidan özelliklere sahip bir mineraldir. Tiroid fonksiyonlarını düzenler, DNA sentezine katılır ve üreme sağlığını destekler. Brezilya fındığı (en zengin kaynak), balık, et, yumurta ve tam tahıllar selenyum içerir. Eksikliği bağışıklık zayıflığı, tiroid problemleri ve üreme sorunlarına yol açabilir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Eksiklik Belirtileri ve Riskli Gruplar
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Vitamin ve mineral eksiklikleri genellikle kademeli gelişir ve başlangıçta belirsiz semptomlar gösterir. Genel yorgunluk, halsizlik, baş ağrısı, kas krampları, ciltte kuruluk ve tahriş, saç dökülmesi, tırnaklarda kırılma, bağışıklığın zayıflaması ve sık enfeksiyon geçirme eksikliğin ilk işaretleri olabilir. İlerleyen durumlarda daha ciddi sağlık sorunları ortaya çıkar: anemi (demir, B12, folat eksikliği), osteoporoz (kalsiyum, D vitamini eksikliği), gece körlüğü (A vitamini eksikliği), sinir hasarı (B12 eksikliği) ve kan pıhtılaşma problemleri (K vitamini eksikliği).
              </p>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Bazı gruplar vitamin ve mineral eksikliği açısından daha yüksek risk altındadır: Hamile ve emziren kadınlar (artan besin ihtiyacı), yaşlılar (emilim azalması ve ilaç etkileşimleri), veganlar ve vejetaryenler (B12, demir, çinko, D vitamini riski), kronik hastalığı olanlar (malabsorpsiyon, ilaç etkileşimleri), sık diyet yapanlar veya yeme bozukluğu olanlar (yetersiz besin alımı), ve aşırı alkol tüketenler (B vitaminleri eksikliği). Bu gruplardaki bireyler düzenli kan testleriyle vitamin ve mineral seviyelerini kontrol ettirmeli ve gerekirse takviye almalıdır.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Doğal Besin Kaynaklarından Alım: En İyi Yaklaşım
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Vitamin ve mineralleri doğal besin kaynaklarından almak her zaman en iyisidir. Tam gıdalar yalnızca vitaminler ve mineraller içermez, aynı zamanda lif, antioksidanlar, fitonutrientler ve diğer faydalı bileşikler de sağlar. Bu besin öğeleri sinerjik şekilde çalışır; örneğin, C vitamini demir emilimini artırır, D vitamini kalsiyum emilimini destekler. Çeşitli ve dengeli bir diyet, tüm besin ihtiyaçlarınızı karşılamanın en güvenli ve etkili yoludur.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Tabağınızı renklerle doldurun: Farklı renkler farklı besin öğeleri sağlar. Yeşil yapraklı sebzeler (ıspanak, lahana, roka) K vitamini, folat, magnezyum ve demir; turuncu ve sarı sebzeler (havuç, balkabağı, tatlı patates) A vitamini ve beta-karoten; kırmızı meyveler (çilek, kiraz, karpuz) C vitamini ve antioksidanlar; mor ve mavi gıdalar (yaban mersini, patlıcan) anthocyaninler; tam tahıllar B vitaminleri, magnezyum ve demir; süt ürünleri kalsiyum, D vitamini ve B12; et, balık ve yumurta demir, çinko, B12 ve protein; kuruyemişler ve tohumlar E vitamini, magnezyum, çinko ve sağlıklı yağlar sağlar.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
                Takviye Kullanımı: Ne Zaman ve Nasıl?
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Vitamin ve mineral takviyeleri, dengeli bir beslenme programının yerini tutamaz ancak belirli durumlarda faydalı olabilir. Takviye kullanmadan önce mutlaka bir sağlık profesyoneline danışın. Kan testleri ile eksiklik tespit edildiyse, hamilelik ve emzirme döneminde (prenatal vitaminler), yaşlılıkta (D vitamini, B12, kalsiyum), vejetaryen/vegan diyetlerde (B12, demir, çinko, D vitamini), kronik hastalıklarda malabsorpsiyon varsa, ve güneş ışığına maruz kalma yetersizse (D vitamini) takviye gerekebilir.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                Takviye alırken üst limit (UL - tolerable upper intake level) değerlerini aşmamaya dikkat edin. Aşırı vitamin A karaciğer hasarına, D vitamini hiperkalsemiye, E vitamini kanama riskine, yüksek demir dozları oksidatif strese, aşırı çinko bakır emilimini engellemeye neden olabilir. Multivitaminler genel destek sağlar ancak özel ihtiyaçlar için tek besin öğesi takviyeleri daha etkili olabilir. Takviyeler tercihen yemeklerle birlikte alınmalıdır (özellikle yağda çözünenler). İlaç etkileşimlerine dikkat edin; bazı vitaminler ve mineraller ilaçların etkinliğini değiştirebilir.
              </p>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
