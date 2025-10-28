import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, Target, TrendingUp } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";

interface IdealWeightCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface WeightResult {
  divine: number;
  broca: number;
  current: number;
  difference: number;
}

export default function IdealWeightCalculator({ categoryGroups, currentPath }: IdealWeightCalculatorProps) {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState<string>("");
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [result, setResult] = useState<WeightResult | null>(null);

  const calculateIdealWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height);
    const current = parseFloat(currentWeight);
    
    let divine = 0;
    if (gender === "male") {
      divine = 50 + 2.3 * ((h - 152.4) / 2.54);
    } else {
      divine = 45.5 + 2.3 * ((h - 152.4) / 2.54);
    }

    const broca = gender === "male" ? (h - 100) * 0.9 : (h - 100) * 0.85;

    setResult({
      divine: parseFloat(divine.toFixed(1)),
      broca: parseFloat(broca.toFixed(1)),
      current,
      difference: parseFloat((current - divine).toFixed(1))
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-pink-600 hover:text-pink-700 font-medium text-sm">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full px-6 py-2 mb-6 shadow-lg">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Devine & Broca Formülleri</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              İdeal Kilo Hesaplayıcı
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Boyunuza ve cinsiyetinize göre bilimsel formüllerle ideal kilonuzu hesaplayın
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <Card className="shadow-2xl border-2 border-pink-100">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Target className="w-6 h-6" />
                  Bilgilerinizi Girin
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={calculateIdealWeight} className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Cinsiyet</Label>
                    <RadioGroup value={gender} onValueChange={(v) => setGender(v as "male" | "female")} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="cursor-pointer">Erkek</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="cursor-pointer">Kadın</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="height" className="text-base font-semibold">Boy (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Örn: 170"
                      required
                      min="140"
                      max="220"
                      className="h-12 text-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="current-weight" className="text-base font-semibold">Mevcut Kilonuz (kg) - İsteğe Bağlı</Label>
                    <Input
                      id="current-weight"
                      type="number"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      placeholder="Örn: 75"
                      min="30"
                      max="300"
                      step="0.1"
                      className="h-12 text-lg"
                    />
                  </div>

                  <Button type="submit" className="w-full h-14 text-lg font-bold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-lg">
                    <Heart className="w-5 h-5 mr-2" />
                    İdeal Kilo Hesapla
                  </Button>
                </form>
              </CardContent>
            </Card>

            {result && (
              <div className="space-y-6">
                <Card className="shadow-2xl border-2 border-pink-100">
                  <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <TrendingUp className="w-6 h-6" />
                      İdeal Kilo Sonuçları
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl p-6 border-2 border-pink-200">
                      <h3 className="font-bold text-lg mb-4 text-gray-900">Devine Formülü</h3>
                      <p className="text-4xl font-black text-pink-600">{result.divine} kg</p>
                      <p className="text-sm text-gray-600 mt-2">En yaygın kullanılan formül</p>
                    </div>

                    <div className="bg-gradient-to-br from-rose-50 to-red-100 rounded-xl p-6 border-2 border-rose-200">
                      <h3 className="font-bold text-lg mb-4 text-gray-900">Broca Formülü</h3>
                      <p className="text-4xl font-black text-rose-600">{result.broca} kg</p>
                      <p className="text-sm text-gray-600 mt-2">Alternatif hesaplama yöntemi</p>
                    </div>

                    {currentWeight && (
                      <div className={`bg-gradient-to-br ${result.difference > 0 ? 'from-orange-50 to-amber-100 border-orange-200' : 'from-green-50 to-emerald-100 border-green-200'} rounded-xl p-6 border-2`}>
                        <h3 className="font-bold text-lg mb-4 text-gray-900">Mevcut Durum</h3>
                        <p className="text-2xl font-bold text-gray-900 mb-2">
                          {result.difference > 0 ? `+${result.difference} kg fazla` : `${Math.abs(result.difference)} kg eksik`}
                        </p>
                        <p className="text-sm text-gray-600">
                          İdeal kilonuza ulaşmak için {result.difference > 0 ? 'vermeniz' : 'almanız'} gereken kilo
                        </p>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-3">💡 Not</h3>
                      <p className="text-sm text-gray-700">
                        İdeal kilo kişiden kişiye değişir. Kas kütleniz, kemik yapınız ve yaşam tarzınız bu değeri etkileyebilir. 
                        Bu sonuçlar genel bir rehberdir; kişiselleştirilmiş öneri için bir uzmana danışın.
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
                <h2 className="text-3xl font-bold text-gray-900 mb-6">İdeal Kilo Nedir ve Nasıl Hesaplanır?</h2>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  İdeal vücut ağırlığı, kişinin sağlığını optimize edecek ve kronik hastalık risklerini minimize edecek kilo aralığıdır. 
                  Bu kavram, yalnızca estetik kaygılardan değil, kalp sağlığı, metabolik fonksiyonlar ve yaşam kalitesi gibi faktörlerden 
                  etkilenir. İdeal kilo hesaplamak için birçok formül geliştirilmiştir ve en popüler ikisi Devine ve Broca formülleridir.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Devine Formülü: Altın Standart</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1974 yılında Dr. Ben J. Devine tarafından geliştirilen bu formül, ilaç dozajı hesaplamak için tasarlanmış olsa da 
                  bugün ideal kilo hesaplamada en yaygın kullanılan yöntemdir. Erkekler için: 50 kg + 2.3 kg × (boy - 152.4 cm) / 2.54, 
                  kadınlar için: 45.5 kg + 2.3 kg × (boy - 152.4 cm) / 2.54 formülü kullanılır. Bu formül özellikle Batı toplumları için 
                  optimize edilmiştir ve orta yapılı bireyler için oldukça doğru sonuçlar verir.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Broca Formülü: Basit ve Pratik</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  19. yüzyılda Fransız cerrah Paul Broca tarafından geliştirilen bu formül daha basittir: Erkekler için (boy - 100) × 0.9, 
                  kadınlar için (boy - 100) × 0.85. Örneğin 170 cm boyundaki bir erkek için ideal kilo (170 - 100) × 0.9 = 63 kg'dır. 
                  Bu formül Avrupa'da hala yaygın kullanılır ve pratik olması nedeniyle tercih edilir. Ancak çok uzun veya çok kısa bireyler 
                  için Devine formülü kadar hassas değildir.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">İdeal Kilo ile BMI Arasındaki Fark</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  İdeal kilo formülleri mutlak bir sayı verirken, BMI bir aralık sunar (18.5-24.9). İdeal kilo hesaplamaları genellikle 
                  daha kişiselleştirilmiş sonuçlar verir çünkü cinsiyet farkını dikkate alır. Ancak her iki yöntem de kas kütlesi, 
                  kemik yoğunluğu ve vücut kompozisyonunu göz ardı eder. Örneğin bir sporcu, ideal kilosunun üstünde olabilir ama 
                  vücut yağ oranı düşüktür. Bu nedenle bu hesaplamaları bir başlangıç noktası olarak görün ve vücut kompozisyon analizi, 
                  bel çevresi ölçümü gibi ek yöntemlerle destekleyin.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">İdeal Kiloya Ulaşmak İçin Stratejiler</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  İdeal kilonuzun üzerindeyseniz, hızlı sonuç vaat eden sert diyetlerden kaçının. Yavaş ve sürdürülebilir kilo kaybı 
                  her zaman daha sağlıklıdır. Haftada 0.5-1 kg vermek ideal hızdır; bu günlük 500-1000 kalori açığı gerektirir. 
                  Dengeli beslenme planı oluşturun: sebze ve meyveleri bol tüketin, tam tahılları tercih edin, işlenmiş gıdalardan 
                  uzak durun. Düzenli egzersiz yapın; haftada 150 dakika kardiyovasküler aktivite ve 2-3 gün kuvvet antrenmanı idealdir. 
                  Kas kütlenizi korumak için protein alımına dikkat edin; vücut ağırlığınızın her kilosu için 1.6-2.2 gram protein hedefleyin.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Kilo Almak İsteyenler İçin Öneriler</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  İdeal kilonuzun altındaysanız, sağlıklı bir şekilde kilo almak da önemlidir. Günlük kalori ihtiyacınızın 300-500 kcal 
                  üzerinde beslenin ancak bu fazla kalorilerin kaliteli kaynaklardan geldiğinden emin olun. Fındık, ceviz, badem gibi 
                  yağlı tohumlar; avokado, zeytinyağı gibi sağlıklı yağlar; tam tahıllı ekmek, esmer pirinç, yulaf gibi kompleks 
                  karbonhidratlar tüketin. Günde 5-6 küçük öğün halinde beslenmek, iştah problemleri yaşıyorsanız yardımcı olabilir. 
                  Kuvvet antrenmanı yaparak kas kütlesi kazanın; sadece yağ değil kas kazanmak sağlıklı kilo alma stratejisidir.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sık Sorulan Sorular</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Devine ve Broca formülleri arasında hangisi daha doğru?</h4>
                    <p className="text-gray-700">
                      Devine formülü modern tıpta daha yaygın kullanılır ve özellikle ilaç dozajı hesaplamalarında tercih edilir. 
                      Ancak her iki formül de genel bir rehberdir ve kişisel vücut yapınız sonucu etkileyebilir.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">İdeal kilom ile mevcut kilom arasında büyük fark var, ne yapmalıyım?</h4>
                    <p className="text-gray-700">
                      10 kg'dan fazla fark varsa, bir diyetisyen veya doktorla görüşün. Kademeli ve sürdürülebilir bir plan oluşturun. 
                      Hızlı kilo kaybı/kazanımı sağlığınıza zarar verebilir.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Yaşım ilerledikçe ideal kilom değişir mi?</h4>
                    <p className="text-gray-700">
                      Evet, yaş ilerledikçe kas kütlesi azalır ve metabolizma yavaşlar. 40 yaş üstü bireyler için ideal kilo 
                      aralığı biraz daha yüksek olabilir. Ancak obeziteden kaçınmak her yaşta önemlidir.
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
