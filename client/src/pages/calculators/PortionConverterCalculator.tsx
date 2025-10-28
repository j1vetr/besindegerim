import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Coffee, Utensils } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";

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
  const [grams, setGrams] = useState<string>("");
  const [result, setResult] = useState<ConversionResult | null>(null);

  const convert = (e: React.FormEvent) => {
    e.preventDefault();
    const g = parseFloat(grams);
    
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-purple-600 hover:text-purple-700 font-medium text-sm">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full px-6 py-2 mb-6 shadow-lg">
              <Activity className="w-5 h-5" />
              <span className="font-semibold">Benzersiz Araç</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Porsiyon Çevirici
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Gramajı porsiyona, kaşığa ve bardağa çevirin - mutfakta pratik ölçüm aracı
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <Card className="shadow-2xl border-2 border-purple-100">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Utensils className="w-6 h-6" />
                  Bilgileri Girin
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={convert} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="foodType" className="text-base font-semibold">Gıda Türü</Label>
                    <Select value={foodType} onValueChange={setFoodType}>
                      <SelectTrigger className="h-12 text-base" id="foodType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Katı Gıda (genel)</SelectItem>
                        <SelectItem value="liquid">Sıvı (su, süt, meyve suyu)</SelectItem>
                        <SelectItem value="flour">Un, Nişasta</SelectItem>
                        <SelectItem value="sugar">Şeker, Tuz</SelectItem>
                        <SelectItem value="rice">Pirinç, Tahıllar</SelectItem>
                        <SelectItem value="oil">Yağ, Sıvı Yağlar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="grams" className="text-base font-semibold">Miktar (gram)</Label>
                    <Input
                      id="grams"
                      type="number"
                      value={grams}
                      onChange={(e) => setGrams(e.target.value)}
                      placeholder="Örn: 100"
                      required
                      min="1"
                      max="10000"
                      step="0.1"
                      className="h-12 text-lg"
                    />
                  </div>

                  <Button type="submit" className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg">
                    <Activity className="w-5 h-5 mr-2" />
                    Çevir
                  </Button>
                </form>
              </CardContent>
            </Card>

            {result && (
              <div className="space-y-6">
                <Card className="shadow-2xl border-2 border-purple-100">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Coffee className="w-6 h-6" />
                      Dönüşüm Sonuçları
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 border-2 border-purple-200">
                      <h3 className="font-bold text-lg mb-4 text-gray-900">Yemek Kaşığı</h3>
                      <p className="text-5xl font-black text-purple-600">{result.tablespoons}</p>
                      <p className="text-sm text-gray-600 mt-2">kaşık (yaklaşık)</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl p-6 border-2 border-pink-200">
                        <Coffee className="w-8 h-8 text-pink-600 mb-3" />
                        <p className="text-2xl font-black text-pink-600">{result.teaspoons}</p>
                        <p className="text-sm text-gray-600 mt-1">Çay Kaşığı</p>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl p-6 border-2 border-indigo-200">
                        <Utensils className="w-8 h-8 text-indigo-600 mb-3" />
                        <p className="text-2xl font-black text-indigo-600">{result.cups}</p>
                        <p className="text-sm text-gray-600 mt-1">Bardak</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border-2 border-green-200">
                      <h3 className="font-bold text-lg mb-4 text-gray-900">Porsiyon</h3>
                      <p className="text-4xl font-black text-green-600">{result.servings}</p>
                      <p className="text-sm text-gray-600 mt-2">standart porsiyon</p>
                    </div>

                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                      <h3 className="font-bold text-base text-gray-900 mb-2">💡 Not</h3>
                      <p className="text-sm text-gray-700">
                        Değerler yaklaşık olup gıdanın yoğunluğuna göre değişiklik gösterebilir. Hassas ölçüm için mutfak terazisi kullanın.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* SEO Content */}
          <div className="max-w-4xl mx-auto prose prose-lg">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Mutfakta Doğru Ölçüm: Neden Bu Kadar Önemli?</h2>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sağlıklı beslenmenin ve kalori kontrolünün en temel unsuru, porsiyonları doğru ölçmektir. Çoğu insan "göz kararı" ölçüm 
                  yaparak günlük kalori alımlarını %20-50 oranında yanlış tahmin eder. Özellikle kilo vermeye çalışıyorsanız veya makro 
                  besin dengesini takip ediyorsanız, gram bazında kesin ölçüm yapmak kritik önem taşır. Bu porsiyon çevirici araç, mutfak 
                  teraziniz yokken veya tarifler kaşık/bardak ölçüsü verirken size rehberlik eder.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Mutfak Ölçü Birimleri: Standartlar ve Dönüşümler</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Türk mutfağında yaygın kullanılan ölçü birimleri arasında yemek kaşığı (yaklaşık 15 ml), çay kaşığı (5 ml), su bardağı 
                  (200-250 ml) ve çay bardağı (100-125 ml) bulunur. Ancak bu ölçüler gıdanın yoğunluğuna göre değişir. Örneğin 1 yemek 
                  kaşığı su 15 gram iken, 1 yemek kaşığı un yaklaşık 8 gram, şeker ise 12.5 gramdır. Bu nedenle tariflerde "1 bardak un" 
                  dendiğinde 125 gram, "1 bardak şeker" dendiğinde 200 gram kastedilir. Amerikan tariflerinde kullanılan "cup" ölçüsü ise 
                  240 ml'dir ve Türk su bardağından biraz daha büyüktür.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Porsiyon Kontrol: Kilo Yönetiminde Altın Kural</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Araştırmalar, porsiyon boyutlarının son 30 yılda ortalama %50 arttığını göstermektedir. Restoranlarda sunulan porsiyonlar 
                  genellikle 2-3 standart porsiyona denktir. Evde de büyük tabaklar kullanmak ve "gözle" porsiyon ayarlamak aşırı yemeye 
                  yol açar. İdeal porsiyon kontrol stratejisi: Daha küçük tabaklar kullanın (23 cm yerine 20 cm), yemek servis ederken 
                  mutfak terazisi veya ölçü kaşıkları kullanın, paketli gıdalarda etiket bilgilerini okuyun ve "porsiyon başı" kaloriyi 
                  hesaplayın. Protein porsiyonu avuç içi büyüklüğünde (100-120 gram), karbonhidrat yumruk büyüklüğünde (150-200 gram pişmiş) 
                  olmalıdır.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Yaygın Gıdalar İçin Pratik Dönüşüm Tablosu</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  İşte mutfakta sık kullanılan gıdalar için pratik dönüşüm bilgileri: Un - 1 yemek kaşığı = 8 gram, 1 su bardağı = 125 gram. 
                  Şeker - 1 yemek kaşığı = 12.5 gram, 1 su bardağı = 200 gram. Pirinç (çiğ) - 1 yemek kaşığı = 12 gram, 1 su bardağı = 
                  190 gram. Zeytinyağı - 1 yemek kaşığı = 13.5 gram, 1 su bardağı = 216 gram. Süt - 1 yemek kaşığı = 15 ml, 1 su bardağı = 
                  250 ml. Yoğurt - 1 yemek kaşığı = 20 gram, 1 su bardağı = 250 gram. Bal - 1 yemek kaşığı = 21 gram. Bu değerler yaklaşık 
                  olup gıdanın sıkıştırılma derecesine göre değişebilir.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Mutfak Terazisi: En Güvenilir Ölçüm Aracı</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Kalori sayımı ve makro takibi yapıyorsanız, mutfak terazisi en iyi yatırımınız olacaktır. Dijital mutfak terazileri 
                  1 gram hassasiyetle ölçüm yapar ve sıfırlama (tare) özelliği sayesinde kab ağırlığını çıkarmanızı sağlar. Kaliteli bir 
                  terazi 100-300 TL arasında bulunur ve yıllarca kullanılabilir. Terazi kullanırken ipuçları: Daima düz bir yüzeyde 
                  kullanın, tartmadan önce sıfırlayın, gıdayı eklerken yavaş yavaş ekleyin çünkü terazi gecikmeyle tepki verebilir. 
                  Özellikle fındık, fındık ezmesi, peynir, yağ gibi kalori yoğun gıdaları mutlaka tartın çünkü birkaç gram fark yüzlerce 
                  kalori anlamına gelebilir.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Dışarıda Yemek ve Porsiyon Tahmini</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Restoranlarda veya sosyal etkinliklerde mutfak terazisi kullanamayacağınız için "el ölçüsü" yöntemi kullanabilirsiniz. 
                  Avuç içi büyüklüğü yaklaşık 100 gram et/tavuk/balığa denktir. Yumruk büyüklüğü 1 porsiyon (150-200 gram) pirinç, makarna 
                  veya patates demektir. Başparmak ucu 1 yemek kaşığı (15 gram) yağ veya fındık ezmesine eşittir. İki avuç birleştirildiğinde 
                  1 porsiyon sebze/salata ölçüsü olur. Bu yöntemler kesin olmasa da, terazi olmadan makul bir tahmin yapmanızı sağlar. 
                  Ayrıca restoran menülerinde genellikle porsiyon büyüklükleri (gram) belirtilir; buna dikkat edin.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sık Sorulan Sorular</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Yemek kaşığı ile çay kaşığı arasındaki fark nedir?</h4>
                    <p className="text-gray-700">
                      Yemek kaşığı (tablespoon) yaklaşık 15 ml, çay kaşığı (teaspoon) ise 5 ml'dir. Yani 1 yemek kaşığı = 3 çay kaşığı.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Tariflerde "bir bardak" dendiğinde hangi bardak kastediliyor?</h4>
                    <p className="text-gray-700">
                      Türk tariflerinde genellikle 200-250 ml su bardağı kastedilir. Amerikan tariflerinde "cup" ölçüsü 240 ml'dir. 
                      Net olmadığı durumlarda tarifte belirtilir.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Ölçü kaşıkları doldururken ne kadar dolu olmalı?</h4>
                    <p className="text-gray-700">
                      Standart ölçümlerde kaşık "düz dolu" olmalıdır, yani üst kısmı bıçakla düzeltilmiş gibi düz. "Tepeleme dolu" 
                      yaklaşık %30-50 daha fazla miktar anlamına gelir ve tarifler bunu belirtmedikçe kullanılmamalıdır.
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
