import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplets, Activity, Sun, Coffee } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";

interface WaterIntakeCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface WaterResult {
  liters: number;
  glasses: number;
  bottles: number;
}

export default function WaterIntakeCalculator({ categoryGroups, currentPath }: WaterIntakeCalculatorProps) {
  const [weight, setWeight] = useState<string>("");
  const [activity, setActivity] = useState<string>("1.0");
  const [climate, setClimate] = useState<string>("1.0");
  const [result, setResult] = useState<WaterResult | null>(null);

  const calculateWater = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const activityFactor = parseFloat(activity);
    const climateFactor = parseFloat(climate);
    
    const baseWater = w * 0.033;
    const totalWater = baseWater * activityFactor * climateFactor;
    
    setResult({
      liters: parseFloat(totalWater.toFixed(2)),
      glasses: Math.round(totalWater / 0.25),
      bottles: Math.round(totalWater / 0.5)
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-sky-600 hover:text-sky-700 font-medium text-sm">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full px-6 py-2 mb-6 shadow-lg">
              <Droplets className="w-5 h-5" />
              <span className="font-semibold">Kişiselleştirilmiş Hidrasyon</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Günlük Su İhtiyacı Hesaplayıcı
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Kilonuza, aktivite seviyenize ve iklime göre günlük su ihtiyacınızı hesaplayın
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <Card className="shadow-2xl border-2 border-sky-100">
              <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Droplets className="w-6 h-6" />
                  Bilgilerinizi Girin
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={calculateWater} className="space-y-6">
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
                    <Label htmlFor="activity" className="text-base font-semibold">Aktivite Seviyesi</Label>
                    <Select value={activity} onValueChange={setActivity}>
                      <SelectTrigger className="h-12 text-base" id="activity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.0">Hareketsiz (hiç egzersiz yok)</SelectItem>
                        <SelectItem value="1.2">Az Aktif (haftada 1-2 gün)</SelectItem>
                        <SelectItem value="1.4">Orta Aktif (haftada 3-4 gün)</SelectItem>
                        <SelectItem value="1.6">Çok Aktif (haftada 5-6 gün)</SelectItem>
                        <SelectItem value="1.8">Ekstra Aktif (günde 2x egzersiz)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="climate" className="text-base font-semibold">İklim</Label>
                    <Select value={climate} onValueChange={setClimate}>
                      <SelectTrigger className="h-12 text-base" id="climate">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.9">Soğuk İklim (kış, serin hava)</SelectItem>
                        <SelectItem value="1.0">Ilıman İklim (normal sıcaklık)</SelectItem>
                        <SelectItem value="1.2">Sıcak İklim (yaz, sıcak hava)</SelectItem>
                        <SelectItem value="1.4">Çok Sıcak (tropik, kavurucu sıcak)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full h-14 text-lg font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg">
                    <Droplets className="w-5 h-5 mr-2" />
                    Su İhtiyacını Hesapla
                  </Button>
                </form>
              </CardContent>
            </Card>

            {result && (
              <div className="space-y-6">
                <Card className="shadow-2xl border-2 border-sky-100">
                  <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-600 text-white">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Droplets className="w-6 h-6" />
                      Günlük Su İhtiyacınız
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-xl p-6 border-2 border-sky-200">
                      <h3 className="font-bold text-lg mb-4 text-gray-900">Toplam Su</h3>
                      <p className="text-5xl font-black text-sky-600">{result.liters} L</p>
                      <p className="text-sm text-gray-600 mt-2">Günlük toplam su ihtiyacınız</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-6 border-2 border-blue-200">
                        <Coffee className="w-8 h-8 text-blue-600 mb-3" />
                        <p className="text-3xl font-black text-blue-600">{result.glasses}</p>
                        <p className="text-sm text-gray-600 mt-1">Bardak (250ml)</p>
                      </div>
                      <div className="bg-gradient-to-br from-cyan-50 to-teal-100 rounded-xl p-6 border-2 border-cyan-200">
                        <Droplets className="w-8 h-8 text-cyan-600 mb-3" />
                        <p className="text-3xl font-black text-cyan-600">{result.bottles}</p>
                        <p className="text-sm text-gray-600 mt-1">Şişe (500ml)</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                        <Sun className="w-5 h-5 text-yellow-600" />
                        İpuçları
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Egzersiz öncesi, sırası ve sonrasında ekstra su için</li>
                        <li>• Sabah kalktığınızda 1-2 bardak su için</li>
                        <li>• Yemeklerden 30 dk önce su içmeyi alışkanlık haline getirin</li>
                        <li>• Idrarınızın rengi açık sarı ise yeterli su içiyorsunuz demektir</li>
                      </ul>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Günlük Su İhtiyacı: Neden Bu Kadar Önemli?</h2>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vücudumuzun yaklaşık %60'ı sudan oluşur ve her hücre, doku ve organımızın düzgün çalışması için su gereklidir. 
                  Su, besinlerin hücrelere taşınmasından, toksinlerin atılmasına, vücut sıcaklığının düzenlenmesinden eklem 
                  sağlığına kadar sayısız yaşamsal fonksiyonda rol oynar. Yeterli su içmek enerji seviyenizi artırır, cildinizi 
                  sağlıklı tutar, sindirim sistemini düzenler ve odaklanma yeteneğinizi geliştirir. Araştırmalar, vücudun 
                  sadece %2 su kaybetmesinin bile bilişsel performansı olumsuz etkilediğini göstermektedir.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Günlük Ne Kadar Su İçmeliyiz?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Klasik "günde 8 bardak su" önerisi genel bir kuraldır ama herkes için geçerli değildir. Bilimsel yaklaşım, 
                  vücut ağırlığınızın kilogram başına yaklaşık 30-35 ml su içmektir. Yani 70 kg olan biri günde 2.1-2.45 litre su 
                  içmelidir. Ancak bu temel hesaplamaya aktivite seviyeniz, yaşadığınız iklim, hamilelik/emzirme durumu, sağlık 
                  koşullarınız gibi faktörleri eklemek gerekir. Yoğun egzersiz yapıyorsanız bu miktarı %20-40 artırmalısınız. 
                  Sıcak iklimde yaşıyorsanız terleme yoluyla daha fazla su kaybedersiniz ve günlük ihtiyacınız %20-30 artar.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Dehidrasyon Belirtileri ve Riskleri</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Dehidrasyon (su kaybı), hafif baş dönmesi, yorgunluk ve konsantrasyon eksikliği gibi belirtilerle başlar. 
                  Ağız kuruluğu, koyu renkli idrar, baş ağrısı, cilt kuruluk ve seyrek idrara çıkma dehidrasyonun yaygın 
                  işaretleridir. Kronik dehidrasyon ise böbrek taşları, idrar yolu enfeksiyonları, kabızlık ve hatta kalp 
                  problemlerine yol açabilir. Özellikle yaşlılar ve çocuklar dehidrasyon riskine daha açıktır çünkü susuzluk 
                  hissiyatları daha az gelişmiştir. Diyabetli bireylerde yüksek kan şekeri fazla su kaybına neden olabilir ve 
                  bu da su ihtiyacını artırır.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Su İçme Alışkanlığını Geliştirme İpuçları</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Çoğu insan yeterli su içmekte zorlanır. İşte günlük su ihtiyacınızı karşılamanıza yardımcı olacak pratik ipuçları: 
                  Sabah kalktığınızda ilk iş olarak 1-2 bardak su için; bu metabolizmanızı harekete geçirir ve toksin atılımını 
                  hızlandırır. Yanınızda her zaman bir su şişesi bulundurun; göz önünde olan şeyi içme olasılığınız daha yüksektir. 
                  Akıllı telefon uygulamaları veya alarm kurarak saatlik su içme hatırlatıcıları yapın. Yemeklerden 30 dakika önce 
                  bir bardak su içmek hem hidrasyonu sağlar hem de aşırı yeme isteğini azaltır. Suyunuza limon, salatalık, nane 
                  gibi doğal aromalar ekleyerek tadını zenginleştirin.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Egzersiz ve Su Tüketimi</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Egzersiz sırasında terleme yoluyla önemli miktarda su ve elektrolit kaybederiz. Spor öncesi 2-3 saat içinde 
                  400-600 ml su için. Egzersiz sırasında her 15-20 dakikada 150-250 ml su tüketin. Yoğun ve uzun süreli 
                  aktivitelerde (1 saatten uzun) elektrolit içecekleri veya meyve suları tercih edin çünkü sadece su içmek 
                  hiponatremi (kan sodyu düşüklüğü) riskine yol açabilir. Egzersiz sonrası kaybettiğiniz her kilo için 1.5 litre 
                  su için. Ağırlık sporcuları, maratoncu ve dayanıklılık sporcuları özellikle su dengelerine dikkat etmelidir.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Su Dışında Hidrasyon Kaynakları</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Günlük su ihtiyacınızın %20-30'u besinlerden gelir. Su oranı yüksek meyve ve sebzeler mükemmel hidrasyon 
                  kaynaklarıdır: salatalık (%96 su), karpuz (%92 su), domates (%94 su), ıspanak (%91 su), kavun (%90 su). 
                  Çorba, yoğurt, süt gibi sıvı besinler de günlük su alımınıza katkıda bulunur. Ancak kafein ve alkol içeren 
                  içecekler (kahve, çay, enerji içecekleri, bira) diüretik etkilidir yani idrar üretimini artırır ve su kaybına 
                  yol açar. Bu tür içecekler tüketiyorsanız her bardak için ekstra bir bardak su için.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sık Sorulan Sorular</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Çok fazla su içmek zararlı mı?</h4>
                    <p className="text-gray-700">
                      Evet, aşırı su tüketimi (günde 5-6 litreden fazla) hiponatremi (su zehirlenmesi) riskine yol açabilir. 
                      Ancak bu durum nadir görülür ve genellikle ekstrem dayanıklılık sporlarında ortaya çıkar.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">İdrarımın rengi su ihtiyacım hakkında ne söyler?</h4>
                    <p className="text-gray-700">
                      Açık sarı veya neredeyse renksiz idrar yeterli hidrasyonu gösterir. Koyu sarı veya amber renk dehidrasyon 
                      işaretidir. Ancak B vitamini takviyeleri idrarı parlak sarı yapabilir.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Hamilelik ve emzirme döneminde su ihtiyacı artar mı?</h4>
                    <p className="text-gray-700">
                      Evet, hamile kadınlar günlük 2.3-2.5 litre, emziren anneler ise 3-3.5 litre su içmelidir. 
                      Anne sütünün %87'si sudan oluşur bu nedenle emzirme döneminde hidrasyon kritik önem taşır.
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
