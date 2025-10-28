import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scale, TrendingUp, Heart, AlertCircle } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";

interface BMICalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  healthyMin: number;
  healthyMax: number;
  recommendation: string;
}

export default function BMICalculator({ categoryGroups, currentPath }: BMICalculatorProps) {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [result, setResult] = useState<BMIResult | null>(null);

  const getBMICategory = (bmi: number): { category: string; color: string; recommendation: string } => {
    if (bmi < 18.5) {
      return {
        category: "Zayıf",
        color: "from-blue-400 to-blue-600",
        recommendation: "Sağlıklı kilo almak için kalori açığınızı kapatın ve dengeli beslenin. Protein, karbonhidrat ve sağlıklı yağları dengeli tüketin."
      };
    } else if (bmi < 25) {
      return {
        category: "Normal Kilolu (Sağlıklı)",
        color: "from-green-400 to-green-600",
        recommendation: "Harika! Sağlıklı kilo aralığındasınız. Mevcut beslenme ve egzersiz rutininizi sürdürün."
      };
    } else if (bmi < 30) {
      return {
        category: "Fazla Kilolu",
        color: "from-yellow-400 to-orange-500",
        recommendation: "Sağlıklı kilo vermek için günlük 300-500 kalori açığı oluşturun. Düzenli egzersiz ve dengeli beslenme önemlidir."
      };
    } else if (bmi < 35) {
      return {
        category: "Obezite (1. Derece)",
        color: "from-orange-500 to-red-500",
        recommendation: "Sağlık riskleri artmaktadır. Bir diyetisyen ve doktor gözetiminde kilo verme programı başlatın."
      };
    } else if (bmi < 40) {
      return {
        category: "Obezite (2. Derece)",
        color: "from-red-500 to-red-700",
        recommendation: "Ciddi sağlık riskleri var. Mutlaka uzman gözetiminde kapsamlı bir program gereklidir."
      };
    } else {
      return {
        category: "Obezite (3. Derece / Morbid)",
        color: "from-red-700 to-red-900",
        recommendation: "Acil tıbbi değerlendirme gereklidir. Bir endokrinolog ve diyetisyen ile çalışmanız önerilir."
      };
    }
  };

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    const bmi = w / (h * h);
    const { category, color, recommendation } = getBMICategory(bmi);
    
    const healthyMin = 18.5 * (h * h);
    const healthyMax = 24.9 * (h * h);

    setResult({
      bmi: parseFloat(bmi.toFixed(1)),
      category,
      color,
      healthyMin: parseFloat(healthyMin.toFixed(1)),
      healthyMax: parseFloat(healthyMax.toFixed(1)),
      recommendation
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full px-6 py-2 mb-6 shadow-lg">
              <Scale className="w-5 h-5" />
              <span className="font-semibold">WHO Standartları</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              BMI (Vücut Kitle İndeksi) Hesaplayıcı
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Dünya Sağlık Örgütü standartlarına göre BMI değerinizi ve sağlıklı kilo aralığınızı öğrenin
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <Card className="shadow-2xl border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Scale className="w-6 h-6" />
                  BMI Hesapla
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={calculateBMI} className="space-y-6">
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
                      max="300"
                      step="0.1"
                      className="h-12 text-lg"
                    />
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
                      min="120"
                      max="250"
                      className="h-12 text-lg"
                    />
                  </div>

                  <Button type="submit" className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-lg">
                    <Scale className="w-5 h-5 mr-2" />
                    BMI Hesapla
                  </Button>
                </form>
              </CardContent>
            </Card>

            {result && (
              <div className="space-y-6">
                <Card className="shadow-2xl border-2 border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <TrendingUp className="w-6 h-6" />
                      Sonuçlarınız
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className={`bg-gradient-to-br ${result.color} rounded-xl p-6 text-white`}>
                      <h3 className="font-bold text-lg mb-2">BMI Değeriniz</h3>
                      <p className="text-5xl font-black">{result.bmi}</p>
                      <p className="text-xl font-semibold mt-3">{result.category}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border-2 border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-5 h-5 text-green-600" />
                        <h3 className="font-bold text-lg text-gray-900">Sağlıklı Kilo Aralığınız</h3>
                      </div>
                      <p className="text-3xl font-black text-green-600">{result.healthyMin} - {result.healthyMax} kg</p>
                      <p className="text-sm text-gray-600 mt-2">Boyunuza göre ideal kilo aralığı</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2">Öneri</h3>
                          <p className="text-gray-700">{result.recommendation}</p>
                        </div>
                      </div>
                    </div>

                    {/* BMI Chart */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-4">BMI Kategorileri (WHO)</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Zayıf</span><span className="font-medium">{"<"} 18.5</span></div>
                        <div className="flex justify-between"><span>Normal</span><span className="font-medium">18.5 - 24.9</span></div>
                        <div className="flex justify-between"><span>Fazla Kilolu</span><span className="font-medium">25 - 29.9</span></div>
                        <div className="flex justify-between"><span>Obezite (1. Derece)</span><span className="font-medium">30 - 34.9</span></div>
                        <div className="flex justify-between"><span>Obezite (2. Derece)</span><span className="font-medium">35 - 39.9</span></div>
                        <div className="flex justify-between"><span>Obezite (3. Derece)</span><span className="font-medium">≥ 40</span></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* SEO Content - 700+ words */}
          <div className="max-w-4xl mx-auto prose prose-lg">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">BMI (Vücut Kitle İndeksi) Nedir ve Neden Önemlidir?</h2>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vücut Kitle İndeksi (Body Mass Index - BMI), kilo ve boy arasındaki oranı kullanarak vücut yağ oranını tahmin eden, 
                  dünya genelinde kabul görmüş bir sağlık göstergesidir. 19. yüzyılda Belçikalı matematikçi Adolphe Quetelet tarafından 
                  geliştirilen bu formül, Dünya Sağlık Örgütü (WHO) tarafından obezite ve kilo problemlerini tespit etmek için standart 
                  bir ölçüm yöntemi olarak kullanılmaktadır. BMI = Kilo (kg) / Boy² (m²) formülüyle hesaplanır ve 18.5 ile 24.9 arası 
                  değerler normal kabul edilir.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">BMI Kategorileri ve Sağlık Riskleri</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  WHO'ya göre BMI değerleri altı ana kategoriye ayrılır. 18.5'in altındaki değerler "zayıf" kategorisinde yer alır ve 
                  yetersiz beslenme, kemik erimesi, bağışıklık sistemi zayıflığı gibi riskler taşır. 18.5-24.9 arası "normal" kabul edilir 
                  ve bu aralıkta olmak kronik hastalık risklerini minimize eder. 25-29.9 arası "fazla kilolu" kategorisindedir; kalp hastalığı, 
                  diyabet ve yüksek tansiyon riski artar. 30-34.9 arası 1. derece obezite, 35-39.9 arası 2. derece obezite, 40 ve üzeri ise 
                  morbid obezite olarak sınıflandırılır ve ciddi sağlık problemlerine yol açar.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">BMI'nın Sınırlamaları: Tek Başına Yeterli Değil</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  BMI pratikte kullanışlı olsa da bazı önemli sınırlamaları vardır. Kas kütlesi yüksek olan sporcuların BMI'si yüksek 
                  çıkabilir çünkü kas dokusu yağ dokusundan daha ağırdır. Örneğin profesyonel bir vücut geliştirici "obez" kategorisinde 
                  görünebilir ama aslında vücut yağ oranı çok düşüktür. Ayrıca BMI yaş, cinsiyet ve etnik köken farklılıklarını hesaba katmaz. 
                  Kadınlar erkeklere göre doğal olarak daha yüksek vücut yağ oranına sahiptir ama aynı BMI standardı kullanılır. 
                  Asya kökenli insanlarda daha düşük BMI değerlerinde bile sağlık riskleri görülebilir. Bu nedenle BMI'yı bel çevresi ölçümü, 
                  vücut yağ oranı analizi ve kan testleriyle birlikte değerlendirmek gerekir.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sağlıklı Kilo Aralığına Ulaşmak İçin İpuçları</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Eğer BMI değeriniz normal aralığın dışındaysa, panik yapmayın. Küçük değişikliklerle büyük farklar yaratabilirsiniz. 
                  Kilo vermek istiyorsanız, günlük kalori ihtiyacınızdan 300-500 kcal eksik alın; bu haftada 0.25-0.5 kg sağlıklı kilo 
                  kaybı sağlar. Hızlı kilo verme diyetleri genellikle sürdürülemez ve yoyo etkisi yaratır. Bunun yerine dengeli beslenme, 
                  düzenli egzersiz ve yeterli uyku alışkanlıkları edinin. Proteinden zengin gıdalar (tavuk, balık, yumurta, baklagiller) 
                  tokluk hissi verir ve kas kaybını önler. Tam tahıllar (yulaf, esmer pirinç, tam buğday ekmeği) kan şekerini dengeleyerek 
                  aşırı yeme isteğini azaltır. Sebze ve meyveleri bol tüketin; lif içeriği sayesinde hem tokluk hissi verir hem de 
                  sindirim sistemini düzenler.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Egzersiz ve Aktivite Seviyesini Artırma</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  BMI'nizi düşürmek için diyet kadar egzersiz de önemlidir. Haftada en az 150 dakika orta yoğunlukta (hızlı yürüyüş, 
                  bisiklet, yüzme) veya 75 dakika yoğun (koşu, HIIT) kardiyovasküler egzersiz yapın. Ayrıca haftada 2-3 kez direnç 
                  antrenmanı (ağırlık kaldırma, vücut ağırlığı egzersizleri) ekleyin. Kas kütlesi arttıkça bazal metabolizma hızınız 
                  yükselir ve dinlenirken bile daha fazla kalori yakarsınız. Günlük yaşamınızda da aktif olmaya çalışın: asansör yerine 
                  merdiven kullanın, araba yerine yürüyerek gidin, masa başında çalışıyorsanız her saatte kalkıp kısa bir yürüyüş yapın.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sık Sorulan Sorular</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">BMI hesaplamak için hangi formül kullanılır?</h4>
                    <p className="text-gray-700">
                      BMI = Kilo (kg) / Boy² (m²). Örneğin 70 kg ve 1.75 m boyundaki bir kişinin BMI'si: 70 / (1.75 × 1.75) = 22.9'dur.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">İdeal BMI değeri kaç olmalı?</h4>
                    <p className="text-gray-700">
                      Genel olarak 18.5-24.9 arası sağlıklı kabul edilir. Ancak kas kütleniz yüksekse veya yaşlıysanız bu aralık 
                      farklılık gösterebilir. Bir sağlık profesyoneli ile değerlendirme yapın.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">BMI yüksekse ne yapmalıyım?</h4>
                    <p className="text-gray-700">
                      Panik yapmayın. Bir diyetisyen veya doktorla görüşerek kişiselleştirilmiş bir plan oluşturun. Dengeli beslenme, 
                      düzenli egzersiz ve yeterli uyku en etkili yöntemlerdir.
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
