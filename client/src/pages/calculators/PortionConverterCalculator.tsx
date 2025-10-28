import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Activity, Coffee, Utensils, Zap } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface PortionConverterCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface ConversionResult {
  grams: number;
  tablespoons: number;
  teaspoons: number;
  cups: number;
  servings: number;
}

export default function PortionConverterCalculator({ categoryGroups, currentPath }: PortionConverterCalculatorProps) {
  const [foodType, setFoodType] = useState<string>("solid");
  const [grams, setGrams] = useState<number>(100);
  const [result, setResult] = useState<ConversionResult | null>(null);

  const convert = (e: React.FormEvent) => {
    e.preventDefault();
    const g = grams;
    
    let tablespoonGrams = 15;
    let servingSize = 100;
    
    if (foodType === "liquid") {
      tablespoonGrams = 15;
      servingSize = 250;
    } else if (foodType === "flour") {
      tablespoonGrams = 8;
      servingSize = 125;
    } else if (foodType === "sugar") {
      tablespoonGrams = 12.5;
      servingSize = 200;
    } else if (foodType === "rice") {
      tablespoonGrams = 12;
      servingSize = 150;
    } else if (foodType === "oil") {
      tablespoonGrams = 13.5;
      servingSize = 15;
    }

    setResult({
      grams: g,
      tablespoons: parseFloat((g / tablespoonGrams).toFixed(1)),
      teaspoons: parseFloat((g / (tablespoonGrams / 3)).toFixed(1)),
      cups: parseFloat((g / (tablespoonGrams * 16)).toFixed(2)),
      servings: parseFloat((g / servingSize).toFixed(2))
    });
  };

  const foodTypes = [
    { value: "solid", label: "Katı Gıda", desc: "Genel", icon: "🍎" },
    { value: "liquid", label: "Sıvı", desc: "Su, süt, meyve suyu", icon: "💧" },
    { value: "flour", label: "Un, Nişasta", desc: "Hafif tozu", icon: "🌾" },
    { value: "sugar", label: "Şeker, Tuz", desc: "Kristal yapılı", icon: "🧂" },
    { value: "rice", label: "Pirinç, Tahıllar", desc: "Taneli", icon: "🌾" },
    { value: "oil", label: "Yağ", desc: "Sıvı yağlar", icon: "🫒" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400 to-rose-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-purple-400 hover:text-purple-300 font-medium text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full inline-block border border-purple-500/30">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full px-6 py-3 mb-6 shadow-2xl shadow-purple-500/50 border border-purple-400/30">
              <Activity className="w-6 h-6 animate-pulse" />
              <span className="font-bold">Benzersiz Araç</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400 bg-clip-text text-transparent drop-shadow-2xl">
              Porsiyon Çevirici
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Gramajı porsiyona, kaşığa ve bardağa çevirin - mutfakta pratik ölçüm aracı
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Calculator Form */}
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/50">
                  <Utensils className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Bilgileri Girin</h2>
              </div>

              <form onSubmit={convert} className="space-y-8">
                {/* Food Type */}
                <div className="space-y-4">
                  <label className="text-lg font-bold text-white">Gıda Türü</label>
                  <div className="grid grid-cols-2 gap-3">
                    {foodTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFoodType(type.value)}
                        className={`p-4 rounded-xl text-left transition-all duration-300 ${
                          foodType === type.value
                            ? "bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl shadow-purple-500/50 scale-105"
                            : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <div className="font-bold text-sm">{type.label}</div>
                        <div className="text-xs opacity-75 mt-1">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grams */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Miktar (gram)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                      {grams}g
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="1000"
                    value={grams}
                    onChange={(e) => setGrams(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-green-400 [&::-webkit-slider-thumb]:to-emerald-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-green-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                  />
                  <div className="flex justify-between text-xs text-gray-400 px-1">
                    <span>1g</span>
                    <span>1000g</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-16 text-xl font-black bg-gradient-to-r from-purple-500 via-pink-600 to-rose-500 hover:from-purple-600 hover:via-pink-700 hover:to-rose-600 shadow-2xl shadow-purple-500/50 rounded-2xl border-2 border-purple-400/50 hover:scale-105 transition-all duration-300"
                >
                  <Zap className="w-6 h-6 mr-2 animate-pulse" />
                  Çevir
                </Button>
              </form>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {/* Tablespoons */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-3xl border border-purple-400/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <Utensils className="w-8 h-8 text-purple-400 animate-pulse" />
                    <h3 className="text-2xl font-black text-white">Yemek Kaşığı</h3>
                  </div>
                  <div className="text-7xl font-black bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent mb-2">
                    {result.tablespoons}
                  </div>
                  <p className="text-gray-300 text-sm">kaşık (yaklaşık)</p>
                </div>

                {/* Teaspoons & Cups */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="backdrop-blur-2xl bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-3xl border border-pink-400/30 p-6 shadow-2xl">
                    <Coffee className="w-8 h-8 text-pink-400 mb-3" />
                    <div className="text-4xl font-black bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent mb-2">
                      {result.teaspoons}
                    </div>
                    <p className="text-gray-300 text-sm">Çay Kaşığı</p>
                  </div>

                  <div className="backdrop-blur-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-3xl border border-indigo-400/30 p-6 shadow-2xl">
                    <Utensils className="w-8 h-8 text-indigo-400 mb-3" />
                    <div className="text-4xl font-black bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent mb-2">
                      {result.cups}
                    </div>
                    <p className="text-gray-300 text-sm">Bardak</p>
                  </div>
                </div>

                {/* Servings */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-3xl border border-green-400/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300">
                  <h3 className="text-2xl font-black text-white mb-4">Standart Porsiyon</h3>
                  <div className="text-6xl font-black bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent mb-2">
                    {result.servings}
                  </div>
                  <p className="text-gray-300 text-sm">standart porsiyon</p>
                </div>
              </div>
            )}
          </div>

          {/* SEO Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-12">
              <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Porsiyon Çevirici Nedir ve Nasıl Kullanılır?
              </h2>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Mutfakta en yaygın sorunlardan biri ölçüm birimleri arasında dönüşüm yapmaktır. Bir tarif 150g un istiyorsa kaç yemek kaşığı 
                demektir? 100g şeker kaç bardak eder? Porsiyon çevirici bu soruları yanıtlamak için tasarlanmıştır. Gıda türlerine göre yoğunluk 
                farklılıklarını hesaba katarak gram, yemek kaşığı, çay kaşığı, bardak ve standart porsiyon arasında dönüşüm yapar. Örneğin, 
                1 yemek kaşığı su 15g iken, 1 yemek kaşığı un sadece 8g'dır çünkü un daha hafif ve havadar bir yapıya sahiptir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Gıda Türlerine Göre Dönüşüm Katsayıları
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Her gıda türünün farklı yoğunluğu vardır ve bu dönüşüm oranlarını etkiler. Sıvılar (su, süt, meyve suyu) için 1 yemek kaşığı 
                = 15ml = 15g'dır. Un ve nişasta gibi hafif tozlar için 1 yemek kaşığı = 8g'dır. Şeker ve tuz gibi kristal yapılar için 1 yemek 
                kaşığı = 12.5g'dır. Pirinç ve tahıllar için 1 yemek kaşığı = 12g'dır. Sıvı yağlar için 1 yemek kaşığı = 13.5g'dır. Bu farklılıklar 
                önemlidir çünkü yanlış dönüşüm tariflerin başarısız olmasına neden olabilir. Örneğin, 100g unu ölçerken şeker katsayısını 
                kullanırsanız fazla un kullanmış olursunuz.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Standart Porsiyon Boyutları
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Standart porsiyon boyutları besin değerleri hesaplamalarında referans olarak kullanılır. Katı gıdalar için genellikle 100g 
                standart porsiyondur. Sıvılar için 250ml (1 su bardağı) yaygındır. Un için 125g, şeker için 200g, pirinç için 150g standart 
                porsiyon kabul edilir. Yağlar için ise 15g (1 yemek kaşığı) referans alınır. Bu standartlar beslenme etiketlerinde ve kalori 
                hesaplamalarında kullanılır. Örneğin, bir besin etiketi "100g başına 350 kcal" diyorsa ve siz 200g tüketiyseniz, 700 kcal almış 
                olursunuz.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Mutfakta Doğru Ölçüm İpuçları
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Doğru ölçüm yapmak için bir mutfak terazisi kullanmak en hassas yöntemdir. Kaşıklar ve bardaklar yaklaşık değerler verir; 
                profesyonel aşçılar daima terazi kullanır. Tozlu malzemeleri (un, şeker) ölçerken kaşığa doldurup düzleştirin; tepeleme ölçmeyin. 
                Sıvıları ölçerken bardağı düz bir yüzeye koyun ve göz hizasında okuyun. Kompakt olmayan malzemeleri (yulaf, irmik) hafifçe 
                doldurun; sıkıştırmayın. Tarif metrik sistem (gram, ml) kullanıyorsa imperial (bardak, kaşık) kullanmayın; dönüşüm hataları olabilir. 
                Daima aynı ölçüm sisteminde kalın. Özellikle fırıncılıkta hassas ölçüm kritiktir çünkü hamur kıvamı oranlarla doğrudan ilgilidir.
              </p>

              <div className="mt-12 text-center">
                <a 
                  href="/hesaplayicilar" 
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-lg hover:from-purple-600 hover:to-pink-700 shadow-2xl shadow-purple-500/50 border border-purple-400/30 hover:scale-105 transition-all duration-300"
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
