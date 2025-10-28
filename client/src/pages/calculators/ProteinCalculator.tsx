import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Beef, TrendingUp, Sparkles } from "lucide-react";
import type { CategoryGroup, Food } from "@shared/schema";

interface ProteinCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface ProteinResult {
  min: number;
  max: number;
  recommended: number;
  meals: number;
  perMeal: number;
}

export default function ProteinCalculator({ categoryGroups, currentPath }: ProteinCalculatorProps) {
  const [weight, setWeight] = useState<string>("");
  const [goal, setGoal] = useState<string>("maintain");
  const [activity, setActivity] = useState<string>("moderate");
  const [result, setResult] = useState<ProteinResult | null>(null);

  const { data: highProteinFoods } = useQuery<{ foods: Food[] }>({
    queryKey: ["/api/foods/search", { q: "tavuk", limit: 6 }],
    enabled: !!result
  });

  const calculateProtein = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    
    let multiplier = 1.6;
    if (goal === "weight-loss" && activity === "high") multiplier = 2.2;
    else if (goal === "weight-loss") multiplier = 2.0;
    else if (goal === "muscle-gain") multiplier = 2.4;
    else if (activity === "high") multiplier = 2.0;
    else if (activity === "low") multiplier = 1.2;

    const recommended = w * multiplier;
    const min = w * 1.2;
    const max = w * 2.6;

    setResult({
      min: Math.round(min),
      max: Math.round(max),
      recommended: Math.round(recommended),
      meals: 4,
      perMeal: Math.round(recommended / 4)
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-white to-orange-50">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-red-600 hover:text-red-700 font-medium text-sm">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-full px-6 py-2 mb-6 shadow-lg">
              <Beef className="w-5 h-5" />
              <span className="font-semibold">Hedef Bazlı Hesaplama</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Günlük Protein Gereksinimi Hesaplayıcı
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Hedefinize ve aktivite seviyenize göre günlük protein ihtiyacınızı öğrenin
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <Card className="shadow-2xl border-2 border-red-100">
              <CardHeader className="bg-gradient-to-r from-red-500 to-orange-600 text-white">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Beef className="w-6 h-6" />
                  Bilgilerinizi Girin
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={calculateProtein} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="weight" className="text-base font-semibold">Kilo (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Örn: 70"
                      required
                      min="30"
                      max="200"
                      step="0.1"
                      className="h-12 text-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="goal" className="text-base font-semibold">Hedefiniz</Label>
                    <Select value={goal} onValueChange={setGoal}>
                      <SelectTrigger className="h-12 text-base" id="goal">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight-loss">Kilo Vermek</SelectItem>
                        <SelectItem value="maintain">Kilonu Korumak</SelectItem>
                        <SelectItem value="muscle-gain">Kas Yapmak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="activity" className="text-base font-semibold">Aktivite Seviyesi</Label>
                    <Select value={activity} onValueChange={setActivity}>
                      <SelectTrigger className="h-12 text-base" id="activity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Düşük (hareketsiz yaşam)</SelectItem>
                        <SelectItem value="moderate">Orta (haftada 2-4 gün spor)</SelectItem>
                        <SelectItem value="high">Yüksek (haftada 5+ gün spor)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full h-14 text-lg font-bold bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 shadow-lg">
                    <Beef className="w-5 h-5 mr-2" />
                    Protein İhtiyacını Hesapla
                  </Button>
                </form>
              </CardContent>
            </Card>

            {result && (
              <div className="space-y-6">
                <Card className="shadow-2xl border-2 border-red-100">
                  <CardHeader className="bg-gradient-to-r from-red-500 to-orange-600 text-white">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <TrendingUp className="w-6 h-6" />
                      Günlük Protein İhtiyacınız
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="bg-gradient-to-br from-red-50 to-orange-100 rounded-xl p-6 border-2 border-red-200">
                      <h3 className="font-bold text-lg mb-4 text-gray-900">Önerilen Protein</h3>
                      <p className="text-5xl font-black text-red-600">{result.recommended}g</p>
                      <p className="text-sm text-gray-600 mt-2">Günlük protein hedefi</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-6 border-2 border-orange-200">
                      <h3 className="font-bold text-lg mb-4 text-gray-900">Öğün Başı Protein</h3>
                      <p className="text-3xl font-black text-orange-600">{result.perMeal}g</p>
                      <p className="text-sm text-gray-600 mt-2">{result.meals} öğüne bölündüğünde</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-3">Protein Aralığı</h3>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Minimum</p>
                          <p className="text-2xl font-bold text-gray-900">{result.min}g</p>
                        </div>
                        <div className="text-gray-400">—</div>
                        <div>
                          <p className="text-sm text-gray-600">Maksimum</p>
                          <p className="text-2xl font-bold text-gray-900">{result.max}g</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* High Protein Foods from DB */}
          {result && highProteinFoods?.foods && highProteinFoods.foods.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-red-600" />
                <h2 className="text-3xl font-bold text-gray-900">Yüksek Proteinli Gıdalar</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {highProteinFoods.foods.slice(0, 6).map((food) => (
                  <a 
                    key={food.id}
                    href={`/${food.slug}`}
                    className="group block bg-white rounded-lg border-2 border-gray-200 hover:border-red-500 p-4 transition-all hover:shadow-lg"
                  >
                    {food.imageUrl && (
                      <img 
                        src={food.imageUrl} 
                        alt={food.name}
                        className="w-full h-24 object-cover rounded-md mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-sm text-gray-900 group-hover:text-red-600 mb-1">{food.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{food.servingLabel}</p>
                    <p className="text-lg font-bold text-red-600">{food.protein ? Math.round(parseFloat(food.protein)) : 0}g</p>
                    <p className="text-xs text-gray-500">protein</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* SEO Content */}
          <div className="max-w-4xl mx-auto prose prose-lg">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Protein Neden Bu Kadar Önemli?</h2>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  Protein, vücudumuzun yapı taşıdır ve kaslar, organlar, cilt, saç, tırnaklar dahil hemen hemen her dokunun temel bileşenidir. 
                  Ayrıca enzimler, hormonlar ve antikor üretiminde kritik rol oynar. Yeterli protein alımı, kas kütlesini korur, tokluk hissi 
                  sağlayarak aşırı yemeyi önler, metabolizmayı hızlandırır ve egzersiz sonrası kas onarımını destekler. Protein eksikliği 
                  kas kaybı, bağışıklık sistemi zayıflığı, yara iyileşmesinde gecikme ve saç dökülmesine yol açabilir.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Günlük Ne Kadar Protein Almalıyız?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Genel sağlık için minimum protein ihtiyacı vücut ağırlığının kilogram başına 0.8 gram olarak önerilir. Ancak bu miktar 
                  hareketsiz bir yaşam için yeterli olsa da, aktif bireyler ve özel hedefleri olanlar için yetersizdir. Kilo vermek isteyenler 
                  günde kilogram başına 1.8-2.2 gram protein almalıdır çünkü yüksek protein, tokluk hissi verir ve kas kaybını önler. 
                  Kas yapmak isteyenler 2.2-2.6 gram protein hedeflemelidir. Yaşlılar (65+) sarkopeniden (kas kaybı) korunmak için 1.6-2.0 gram 
                  protein tüketmelidir. Hamile ve emziren kadınlar da protein ihtiyaçlarını artırmalıdır.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Protein Kaynakları: Hayvansal vs Bitkisel</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Hayvansal proteinler (tavuk, balık, et, yumurta, süt ürünleri) "tam protein" olarak adlandırılır çünkü tüm esansiyel amino 
                  asitleri içerir. Tavuk göğsü, ton balığı, yumurta ve peynir mükemmel protein kaynaklarıdır. Bitkisel proteinler (fasulye, 
                  mercimek, nohut, kinoa, tofu, tempeh) genellikle bir veya daha fazla esansiyel amino asit açısından eksiktir bu nedenle 
                  vegan beslenenler çeşitli kaynaklardan protein almalıdır. Örneğin pirinç + fasulye kombinasyonu tam protein profili sağlar. 
                  Kinoa nadir bitkisel tam proteinlerdendir. Protein tozu (whey, kazein, soya, bezelye proteini) takviyesi pratik ve etkilidir 
                  ancak tam besinlerden protein almayı önceliklendirin.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Protein Zamanlaması ve Dağılımı</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sadece ne kadar protein aldığınız değil, ne zaman aldığınız da önemlidir. Kas protein sentezi (MPS) öğün başı yaklaşık 
                  20-40 gram proteinle optimize edilir. Bu nedenle günlük protein ihtiyacınızı 3-5 öğüne eşit şekilde dağıtın. Sabah kahvaltıda 
                  protein almak metabolizmayı harekete geçirir ve gün boyu tokluk hissi sağlar. Egzersiz sonrası "anabolik pencere" 
                  (30-60 dakika içinde) protein tüketmek kas onarımını ve büyümesini hızlandırır. Uyumadan önce kazein gibi yavaş sindirilen 
                  protein almak gece boyunca kas sentezini destekler ve katabolizmayı (kas kaybını) önler.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Çok Fazla Protein Zararlı Mı?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sağlıklı böbrekleri olan bireyler için günde vücut ağırlığının kilogram başına 2.5-3 gram protein güvenlidir. Ancak 
                  böbrek hastalığı olanlar protein alımlarını sınırlamalıdır. Aşırı protein tüketimi (günde 400+ gram) sindirim problemleri, 
                  dehidrasyon ve kalsiyum kaybına yol açabilir. Protein sindirimi enerji gerektirir; bu "termik etki" proteinlerin kalorisinin 
                  yaklaşık %20-30'unun sindirim sırasında yakıldığı anlamına gelir. Dengeli bir makro besin dağılımı (protein %30, 
                  karbonhidrat %40, yağ %30) çoğu insan için idealdir.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Yüksek Proteinli Beslenme İpuçları</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Protein hedeflerinize ulaşmak için pratik stratejiler: Her öğüne protein kaynağı ekleyin (kahvaltıda yumurta, öğle yemeğinde 
                  tavuk salata, akşam yemeğinde balık). Atıştırmalıkları protein odaklı yapın (Yunan yoğurdu, fındık, peynir, protein barları). 
                  Smoothie'lere protein tozu veya Yunan yoğurdu ekleyin. Yemek hazırlarken protein ölçümü yapın; bir avuç kadar et yaklaşık 
                  30 gram protein sağlar. Restoranda yemek yerken ekstra protein isteyin. Besin etiketlerini okuyun ve 100 gram başına en az 
                  15 gram protein içeren ürünleri seçin.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sık Sorulan Sorular</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Protein tozu kullanmak zorunda mıyım?</h4>
                    <p className="text-gray-700">
                      Hayır, tam besinlerden yeterli protein almak mümkündür. Protein tozu kolaylık sağlar ve özellikle egzersiz sonrası 
                      hızlı protein alımı için idealdir ama zorunlu değildir.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Vejetaryen/vegan olarak yeterli protein alabilir miyim?</h4>
                    <p className="text-gray-700">
                      Evet, ancak çeşitli bitkisel kaynaklardan protein almalısınız. Mercimek, nohut, tofu, tempeh, kinoa, fındık ve 
                      tohumları kombinleyin. Protein tozu (soya, bezelye) da yardımcı olabilir.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Her öğünde kaç gram protein idealdir?</h4>
                    <p className="text-gray-700">
                      Kas protein sentezini optimize etmek için öğün başı 20-40 gram protein hedefleyin. Daha fazlası zarar vermez ama 
                      ek fayda sağlamaz; fazla protein enerji olarak kullanılır veya depolanır.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
