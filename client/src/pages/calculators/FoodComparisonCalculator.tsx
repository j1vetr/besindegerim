import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight, Trophy, TrendingUp, Zap, Search, Loader2, X, Scale, Award } from "lucide-react";
import type { CategoryGroup, Food } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";

interface FoodComparisonCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface FoodSelectorProps {
  label: string;
  selectedFood: Food | null;
  onSelect: (food: Food) => void;
  excludeFoodId?: string;
}

function FoodSelector({ label, selectedFood, onSelect, excludeFoodId }: FoodSelectorProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/foods/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        const filtered = (data.foods || []).filter((f: Food) => f.id !== excludeFoodId);
        setResults(filtered);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, excludeFoodId]);

  const handleSelect = (food: Food) => {
    onSelect(food);
    setQuery("");
    setShowResults(false);
  };

  const handleClear = () => {
    onSelect(null as any);
    setQuery("");
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-lg font-bold text-white mb-3">{label}</label>
      
      {selectedFood ? (
        <div className="backdrop-blur-xl bg-white/10 border-2 border-lime-500/50 rounded-2xl p-4 flex items-center gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-lime-500/20 to-green-500/20 rounded-xl overflow-hidden">
            <img
              src={selectedFood.imageUrl?.startsWith('/') ? selectedFood.imageUrl : `/${selectedFood.imageUrl}` || "https://via.placeholder.com/64"}
              alt={selectedFood.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-white">{selectedFood.name}</h4>
            <p className="text-sm text-gray-300">{selectedFood.servingLabel}</p>
          </div>
          <button
            onClick={handleClear}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            data-testid="button-clear-food"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      ) : (
        <>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-lime-400 animate-spin" />
              ) : (
                <Search className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Gıda ara... (domates, tavuk, elma)"
              className="w-full h-14 pl-12 pr-4 backdrop-blur-xl bg-white/10 border-2 border-lime-500/30 focus:border-lime-500 rounded-2xl text-white placeholder:text-gray-400 outline-none transition-all duration-300"
              data-testid="input-food-search"
            />
          </div>

          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-slate-800/95 border-2 border-lime-500/50 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[300px] overflow-y-auto">
              {results.map((food) => (
                <button
                  key={food.id}
                  onClick={() => handleSelect(food)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-lime-500/20 transition-colors border-b border-lime-500/20 last:border-0 text-left"
                  data-testid={`button-select-${food.slug}`}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-lime-500/20 to-green-500/20 rounded-lg overflow-hidden">
                    <img
                      src={food.imageUrl?.startsWith('/') ? food.imageUrl : `/${food.imageUrl}` || "https://via.placeholder.com/48"}
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">{food.name}</h4>
                    <p className="text-xs text-gray-300">{Number(food.calories).toFixed(0)} kcal</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function FoodComparisonCalculator({ categoryGroups, currentPath }: FoodComparisonCalculatorProps) {
  const [food1, setFood1] = useState<Food | null>(null);
  const [food2, setFood2] = useState<Food | null>(null);
  const [per100g, setPer100g] = useState(false);

  const getNutrientValue = (food: Food, nutrient: keyof Food): number => {
    const value = Number(food[nutrient]) || 0;
    if (!per100g) return value;
    
    const servingSize = Number(food.servingSize) || 100;
    return (value / servingSize) * 100;
  };

  const calculateDifference = (value1: number, value2: number): number => {
    if (value2 === 0) return 100;
    return ((value1 - value2) / value2) * 100;
  };

  const calculateNutritionDensity = (food: Food): number => {
    const protein = Number(food.protein) || 0;
    const fiber = Number(food.fiber) || 0;
    const calories = Number(food.calories) || 1;
    const sugar = Number(food.sugar) || 0;
    const fat = Number(food.fat) || 0;
    
    const score = ((protein * 4 + fiber * 2) / calories) * 100 - (sugar + fat * 0.5);
    return Math.max(0, Math.min(100, score));
  };

  const getRadarData = () => {
    if (!food1 || !food2) return [];
    
    return [
      {
        nutrient: 'Kalori',
        [food1.name]: getNutrientValue(food1, 'calories'),
        [food2.name]: getNutrientValue(food2, 'calories'),
      },
      {
        nutrient: 'Protein',
        [food1.name]: getNutrientValue(food1, 'protein'),
        [food2.name]: getNutrientValue(food2, 'protein'),
      },
      {
        nutrient: 'Karb.',
        [food1.name]: getNutrientValue(food1, 'carbs'),
        [food2.name]: getNutrientValue(food2, 'carbs'),
      },
      {
        nutrient: 'Yağ',
        [food1.name]: getNutrientValue(food1, 'fat'),
        [food2.name]: getNutrientValue(food2, 'fat'),
      },
      {
        nutrient: 'Lif',
        [food1.name]: getNutrientValue(food1, 'fiber'),
        [food2.name]: getNutrientValue(food2, 'fiber'),
      },
      {
        nutrient: 'Şeker',
        [food1.name]: getNutrientValue(food1, 'sugar'),
        [food2.name]: getNutrientValue(food2, 'sugar'),
      },
    ];
  };

  const ComparisonRow = ({ label, nutrient, higherIsBetter = false }: { label: string; nutrient: keyof Food; higherIsBetter?: boolean }) => {
    if (!food1 || !food2) return null;

    const value1 = getNutrientValue(food1, nutrient);
    const value2 = getNutrientValue(food2, nutrient);
    const diff = calculateDifference(value1, value2);
    const winner = higherIsBetter ? (value1 > value2 ? 1 : 2) : (value1 < value2 ? 1 : 2);

    return (
      <div className="grid grid-cols-7 gap-4 items-center py-4 border-b border-lime-500/20">
        <div className="col-span-2 flex items-center gap-2">
          {winner === 1 && <Trophy className="w-5 h-5 text-yellow-400" />}
          <span className={`text-lg font-bold ${winner === 1 ? 'text-yellow-400' : 'text-white'}`}>
            {value1.toFixed(1)}
          </span>
        </div>
        <div className="col-span-3 text-center">
          <p className="text-sm font-bold text-lime-400 mb-1">{label}</p>
          {diff !== 0 && (
            <p className={`text-xs ${diff > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {diff > 0 ? '+' : ''}{diff.toFixed(0)}%
            </p>
          )}
        </div>
        <div className="col-span-2 flex items-center justify-end gap-2">
          <span className={`text-lg font-bold ${winner === 2 ? 'text-yellow-400' : 'text-white'}`}>
            {value2.toFixed(1)}
          </span>
          {winner === 2 && <Trophy className="w-5 h-5 text-yellow-400" />}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-lime-900 to-slate-900">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-lime-400 to-green-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400 to-lime-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-lime-400 hover:text-lime-300 font-medium text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full inline-block border border-lime-500/30">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-lime-500 to-green-600 text-white rounded-full px-6 py-3 mb-6 shadow-2xl shadow-lime-500/50 border border-lime-400/30">
              <Scale className="w-6 h-6 animate-pulse" />
              <span className="font-bold">Besin Karşılaştırma Aracı</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-lime-400 via-green-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-2xl">
              Gıda Besin Değeri Karşılaştırıcı
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              İki gıdayı yan yana karşılaştırın, besin değerlerini görün ve daha sağlıklı seçimler yapın
            </p>
          </div>

          {/* Food Selection */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <FoodSelector
              label="Birinci Gıda"
              selectedFood={food1}
              onSelect={setFood1}
              excludeFoodId={food2?.id}
            />
            <FoodSelector
              label="İkinci Gıda"
              selectedFood={food2}
              onSelect={setFood2}
              excludeFoodId={food1?.id}
            />
          </div>

          {/* Comparison Results */}
          {food1 && food2 && (
            <div className="space-y-8">
              {/* Per 100g Toggle */}
              <div className="flex justify-center">
                <button
                  onClick={() => setPer100g(!per100g)}
                  className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                    per100g
                      ? 'bg-gradient-to-r from-lime-500 to-green-600 text-white shadow-lg shadow-lime-500/50'
                      : 'backdrop-blur-xl bg-white/10 text-gray-300 border-2 border-lime-500/30'
                  }`}
                  data-testid="button-toggle-per100g"
                >
                  {per100g ? '100g Başına Değerler' : 'Porsiyon Başına Değerler'}
                </button>
              </div>

              {/* Nutrition Density Scores */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="backdrop-blur-xl bg-white/10 border-2 border-lime-500/50 rounded-3xl p-6 text-center">
                  <Award className="w-12 h-12 text-lime-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-black text-white mb-2">{food1.name}</h3>
                  <p className="text-sm text-gray-300 mb-3">Besin Yoğunluğu Skoru</p>
                  <div className="text-5xl font-black bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent">
                    {calculateNutritionDensity(food1).toFixed(0)}/100
                  </div>
                </div>
                <div className="backdrop-blur-xl bg-white/10 border-2 border-lime-500/50 rounded-3xl p-6 text-center">
                  <Award className="w-12 h-12 text-lime-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-black text-white mb-2">{food2.name}</h3>
                  <p className="text-sm text-gray-300 mb-3">Besin Yoğunluğu Skoru</p>
                  <div className="text-5xl font-black bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent">
                    {calculateNutritionDensity(food2).toFixed(0)}/100
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="backdrop-blur-xl bg-white/10 border-2 border-lime-500/50 rounded-3xl p-8">
                <h2 className="text-3xl font-black text-white mb-6 text-center">Besin Değerleri Karşılaştırması</h2>
                
                {/* Headers */}
                <div className="grid grid-cols-7 gap-4 mb-4 pb-4 border-b-2 border-lime-500/50">
                  <div className="col-span-2 text-center">
                    <p className="text-lg font-bold text-lime-400">{food1.name}</p>
                    <p className="text-xs text-gray-300">{per100g ? '100g' : food1.servingLabel}</p>
                  </div>
                  <div className="col-span-3"></div>
                  <div className="col-span-2 text-center">
                    <p className="text-lg font-bold text-lime-400">{food2.name}</p>
                    <p className="text-xs text-gray-300">{per100g ? '100g' : food2.servingLabel}</p>
                  </div>
                </div>

                <ComparisonRow label="Kalori (kcal)" nutrient="calories" higherIsBetter={false} />
                <ComparisonRow label="Protein (g)" nutrient="protein" higherIsBetter={true} />
                <ComparisonRow label="Karbonhidrat (g)" nutrient="carbs" higherIsBetter={false} />
                <ComparisonRow label="Yağ (g)" nutrient="fat" higherIsBetter={false} />
                <ComparisonRow label="Lif (g)" nutrient="fiber" higherIsBetter={true} />
                <ComparisonRow label="Şeker (g)" nutrient="sugar" higherIsBetter={false} />
              </div>

              {/* Radar Chart */}
              <div className="backdrop-blur-xl bg-white/10 border-2 border-lime-500/50 rounded-3xl p-8">
                <h2 className="text-3xl font-black text-white mb-6 text-center">Besin Değerleri Radar Grafiği</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={getRadarData()}>
                    <PolarGrid stroke="#84cc16" strokeOpacity={0.3} />
                    <PolarAngleAxis dataKey="nutrient" tick={{ fill: '#a3e635', fontSize: 14, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 'auto']} tick={{ fill: '#a3e635' }} />
                    <Radar name={food1.name} dataKey={food1.name} stroke="#84cc16" fill="#84cc16" fillOpacity={0.6} />
                    <Radar name={food2.name} dataKey={food2.name} stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                    <Legend wrapperStyle={{ color: '#fff', fontWeight: 'bold' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* SEO Content */}
          <div className="mt-16 backdrop-blur-xl bg-white/5 border-2 border-lime-500/30 rounded-3xl p-8 md:p-12">
            <article className="prose prose-invert prose-lime max-w-none">
              <h2 className="text-4xl font-black text-lime-400 mb-6">Gıdaları Neden Karşılaştırmalıyız?</h2>
              
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Sağlıklı beslenme yolculuğunda en önemli adımlardan biri, tükettiğimiz gıdaların besin değerlerini anlamak ve bilinçli seçimler yapmaktır. Gıda karşılaştırma aracımız, iki farklı gıdanın besin içeriklerini yan yana görerek hangisinin ihtiyaçlarınıza daha uygun olduğunu belirlemenize yardımcı olur. Örneğin, kahvaltıda yumurta mı yoksa peynir mi tüketmeniz gerektiğine karar verirken, her ikisinin de protein değerlerini, kalori içeriklerini ve sağlık faydalarını karşılaştırarak en doğru tercihi yapabilirsiniz.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Modern yaşamda sağlıklı beslenme, sadece kalori saymaktan ibaret değildir. Protein, karbonhidrat, yağ, lif ve şeker gibi makro besinlerin dengesi, vücudumuzun optimal performans göstermesi için kritik önem taşır. Gıda karşılaştırma sayesinde, benzer gıdalar arasından besin yoğunluğu daha yüksek olanı seçerek hem daha az kalori alır hem de daha fazla vitamin, mineral ve lif ile beslenebilirsiniz.
              </p>

              <h2 className="text-4xl font-black text-lime-400 mb-6 mt-12">Besin Yoğunluğu Kavramı: Kalite mi, Miktar mı?</h2>
              
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Besin yoğunluğu (nutrient density), bir gıdanın içerdiği kalori miktarına oranla ne kadar vitamin, mineral, protein ve lif sağladığını gösteren bir kavramdır. Yüksek besin yoğunluğuna sahip gıdalar, düşük kalori ile yüksek besin değeri sunar. Örneğin, 100 gram brokoli sadece 34 kalori içerirken bol miktarda C vitamini, K vitamini, lif ve antioksidan sağlar. Buna karşılık, 100 gram patates cipsi yaklaşık 500 kalori içerir ancak besin değeri oldukça düşüktür.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Besin yoğunluğu skoru hesaplarken, proteinin ve lifin pozitif katkısını, şeker ve aşırı yağın negatif etkisini değerlendiriyoruz. Bu skor, 0 ile 100 arasında değişir ve yüksek skor, daha sağlıklı ve besin açısından zengin bir gıdayı işaret eder. Örneğin, yeşil yapraklı sebzeler, yağsız et, balık, tam tahıllar ve baklagiller yüksek besin yoğunluğuna sahipken, işlenmiş gıdalar, şekerli atıştırmalıklar ve gazlı içecekler düşük skora sahiptir.
              </p>

              <h2 className="text-4xl font-black text-lime-400 mb-6 mt-12">Besin Değeri Etiketlerini Okuma Rehberi</h2>
              
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Süpermarket raflarında doğru tercihi yapmak için besin değeri etiketlerini okumayı bilmek şarttır. Her etiket, porsiyon başına veya 100 gram başına kalori, protein, karbonhidrat, yağ, lif, şeker ve çeşitli vitamin-minerallerin miktarını gösterir. Ancak dikkat edilmesi gereken en önemli nokta, etiketin hangi porsiyon büyüklüğüne göre hazırlandığıdır. Bazı üreticiler, ürünlerini daha düşük kalorili göstermek için porsiyon boyutunu gerçekçi olmayan şekilde küçük tutabilir.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Etiket okurken, toplam şeker miktarına ve eklenmiş şeker (added sugar) miktarına özellikle dikkat edin. Meyveler doğal şeker içerir ve bu sağlıklıdır, ancak eklenmiş şeker vücutta hızlı kan şekeri artışına neden olur ve obezite, diyabet gibi sağlık sorunlarına yol açabilir. Ayrıca, protein ve lif oranı yüksek gıdalar, tokluk hissini artırır ve metabolizmayı hızlandırır. Trans yağ ve doymuş yağ oranı düşük, doymamış yağ oranı yüksek gıdalar kalp sağlığı için daha uygundur.
              </p>

              <h2 className="text-4xl font-black text-lime-400 mb-6 mt-12">Sağlıklı Gıda Takasları: Akıllı Değişiklikler Yapın</h2>
              
              <h3 className="text-3xl font-bold text-green-400 mb-4 mt-8">Yüksek Proteinli Alternatifler</h3>
              
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Protein, kas gelişimi, doku onarımı ve metabolik sağlık için vazgeçilmezdir. Ancak tüm protein kaynakları eşit değildir. Örneğin, kırmızı et protein açısından zengin olsa da, yüksek doymuş yağ içeriği nedeniyle aşırı tüketimi kalp sağlığına zarar verebilir. Bunun yerine, tavuk göğsü, hindi, balık (somon, ton balığı), yumurta, Greek yoğurt, tofu, tempeh ve baklagiller (mercimek, nohut, barbunya) gibi yağsız protein kaynaklarını tercih edebilirsiniz.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Örneğin, 100 gram dana kıyma yerine 100 gram tavuk göğsü tercih ederseniz, benzer protein miktarı (yaklaşık 25-30g) alırken yağ alımınızı yarıya indirebilirsiniz. Benzer şekilde, peynir yerine cottage cheese veya Greek yoğurt seçmek, protein alımını artırırken kalori ve yağ alımını düşürür. Bitkisel protein kaynakları olan mercimek, kinoa ve chia tohumu da lif açısından oldukça zengindir ve sindirim sağlığını destekler.
              </p>

              <h3 className="text-3xl font-bold text-green-400 mb-4 mt-8">Düşük Kalorili Değişimler</h3>
              
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Kilo vermek veya sağlıklı kilonuzu korumak istiyorsanız, günlük kalori alımınızı kontrol altında tutmak önemlidir. Ancak bu, açlık hissi çekmek veya lezzetten vazgeçmek anlamına gelmez. Akıllı gıda takasları yaparak, aynı doygunluğu daha az kalori ile sağlayabilirsiniz. Örneğin, tam yağlı süt yerine yağsız süt veya badem sütü, beyaz ekmek yerine tam buğday ekmeği, patates cipsi yerine fırında pişmiş sebze cipsi, dondurma yerine frozen yoğurt veya meyve sorbe tercih edebilirsiniz.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Özellikle içeceklerde yapılacak değişiklikler büyük fark yaratır. Gazlı şekerli içecekler yerine sparkling su + limon, meyve suları yerine taze meyve, karamelli latte yerine sade Americano gibi tercihler, günlük 200-500 kalori tasarrufu sağlayabilir. Atıştırmalıklarda da akıllı seçimler yapın: çikolata yerine bitter çikolata veya kuruyemiş, bisküvi yerine yulaf ezmesi (oats) ile yapılan energy ball, kurabiye yerine pirinç waferi + fındık ezmesi gibi alternatifler hem daha sağlıklı hem de daha doyurucudur.
              </p>

              <h2 className="text-4xl font-black text-lime-400 mb-6 mt-12">Süper Gıdalar Arasında Karşılaştırma</h2>
              
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                "Süper gıda" terimi, yüksek besin yoğunluğu ve antioksidan içeriği ile bilinen gıdaları ifade eder. Ancak piyasada birçok gıda "süper gıda" olarak pazarlanırken, gerçekte hangisinin en yüksek sağlık faydalarını sunduğunu anlamak için karşılaştırma yapmak gerekir. Örneğin, chia tohumu, keten tohumu ve kenevir tohumu gibi tohumlar hepsi omega-3 yağ asitleri, lif ve protein açısından zengindir, ancak her birinin besin profili farklıdır.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Chia tohumu, 100 gramda 486 kalori, 17g protein ve 34g lif içerirken, keten tohumu 534 kalori, 18g protein ve 27g lif içerir. Keten tohumu ayrıca lignanlarda (kanser önleyici bileşikler) daha zengindir. Benzer şekilde, quinoa ve amaranth gibi tahıllar proteinli glutensiz alternatiflerdir, ancak quinoa daha yüksek protein içeriğine sahipken amaranth daha fazla demir ve kalsiyum sağlar. Goji berry, acai berry ve blueberry gibi meyveler antioksidan açısından zenginken, her birinin vitamin ve mineral profili farklılık gösterir.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Yeşil yapraklı sebzeler arasında da karşılaştırma yapmak faydalıdır. Ispanak, kale (karalahana) ve Swiss chard (pazı) hepsi A, C, K vitamini ve demir açısından zengindir. Ancak kale, kalsiyum ve antioksidan açısından daha zenginken, ıspanak demir içeriğinde öne çıkar. Bu nedenle, süper gıdalar arasında seçim yaparken sadece tek bir gıdaya odaklanmak yerine, çeşitliliği artırmak ve farklı besin kaynaklarından faydalanmak en sağlıklı yaklaşımdır.
              </p>

              <h2 className="text-4xl font-black text-lime-400 mb-6 mt-12">Sonuç: Bilinçli Seçimlerle Sağlıklı Yaşam</h2>
              
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Gıda karşılaştırma aracımız, beslenme kararlarınızı veriye dayalı ve bilinçli şekilde almanıza yardımcı olur. Sadece kalori saymak yerine, besin yoğunluğu, protein kalitesi, lif içeriği, şeker miktarı ve sağlıklı yağ oranlarını değerlendirerek daha dengeli ve sürdürülebilir bir beslenme planı oluşturabilirsiniz. Unutmayın, sağlıklı beslenme bir maraton gibidir, kısa süreli diyet trendleri yerine uzun vadeli, sürdürülebilir alışkanlıklar geliştirmek başarının anahtarıdır.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed">
                Her gün yaptığınız küçük değişiklikler, yıllar içinde büyük sağlık kazanımlarına dönüşür. Gıdaları karşılaştırarak, hangi seçimlerin size en fazla faydayı sağladığını öğrenin, besin değeri etiketlerini okumayı alışkanlık haline getirin ve akıllı gıda takasları ile hem lezzetli hem sağlıklı bir yaşam sürdürün. Sağlığınız, en değerli varlığınızdır ve doğru beslenme seçimleri, bu varlığınızı korumanın en güçlü yoludur.
              </p>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
