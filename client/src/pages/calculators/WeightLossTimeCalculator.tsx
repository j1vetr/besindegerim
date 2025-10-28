import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TrendingUp, Calendar, Target, AlertCircle } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";

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
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [targetWeight, setTargetWeight] = useState<string>("");
  const [weeklyRate, setWeeklyRate] = useState<string>("0.5");
  const [result, setResult] = useState<TimeResult | null>(null);

  const calculateTime = (e: React.FormEvent) => {
    e.preventDefault();
    const current = parseFloat(currentWeight);
    const target = parseFloat(targetWeight);
    const rate = parseFloat(weeklyRate);
    
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-amber-600 hover:text-amber-700 font-medium text-sm">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full px-6 py-2 mb-6 shadow-lg">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Gerçekçi Hedefler</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Kilo Verme/Alma Süresi Hesaplayıcı
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Hedef kilonuza ulaşmak için gereken süreyi ve günlük kalori ihtiyacınızı hesaplayın
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <Card className="shadow-2xl border-2 border-amber-100">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Target className="w-6 h-6" />
                  Hedef Bilgileriniz
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={calculateTime} className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Hedefiniz</Label>
                    <RadioGroup value={goal} onValueChange={(v) => setGoal(v as "lose" | "gain")} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lose" id="lose" />
                        <Label htmlFor="lose" className="cursor-pointer">Kilo Vermek</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gain" id="gain" />
                        <Label htmlFor="gain" className="cursor-pointer">Kilo Almak</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="current" className="text-base font-semibold">Mevcut Kilonuz (kg)</Label>
                    <Input
                      id="current"
                      type="number"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      placeholder="Örn: 80"
                      required
                      min="30"
                      max="300"
                      step="0.1"
                      className="h-12 text-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="target" className="text-base font-semibold">Hedef Kilonuz (kg)</Label>
                    <Input
                      id="target"
                      type="number"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                      placeholder="Örn: 70"
                      required
                      min="30"
                      max="300"
                      step="0.1"
                      className="h-12 text-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="rate" className="text-base font-semibold">Haftalık {goal === "lose" ? "Kayıp" : "Kazanç"} Hızı (kg/hafta)</Label>
                    <Input
                      id="rate"
                      type="number"
                      value={weeklyRate}
                      onChange={(e) => setWeeklyRate(e.target.value)}
                      placeholder="Örn: 0.5"
                      required
                      min="0.1"
                      max="2"
                      step="0.1"
                      className="h-12 text-lg"
                    />
                    <p className="text-sm text-gray-600">Önerilen: 0.5 kg/hafta (sağlıklı ve sürdürülebilir)</p>
                  </div>

                  <Button type="submit" className="w-full h-14 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Süreyi Hesapla
                  </Button>
                </form>
              </CardContent>
            </Card>

            {result && (
              <div className="space-y-6">
                <Card className="shadow-2xl border-2 border-amber-100">
                  <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Calendar className="w-6 h-6" />
                      Hedef Süreniz
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-6 border-2 border-amber-200">
                      <h3 className="font-bold text-lg mb-4 text-gray-900">Tahmini Süre</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-4xl font-black text-amber-600">{result.weeks}</p>
                          <p className="text-sm text-gray-600">Hafta</p>
                        </div>
                        <div>
                          <p className="text-4xl font-black text-orange-600">{result.months}</p>
                          <p className="text-sm text-gray-600">Ay</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border-2 border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-green-600" />
                        <h3 className="font-bold text-lg text-gray-900">Hedef Tarih</h3>
                      </div>
                      <p className="text-2xl font-black text-green-600">{result.targetDate}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-6 border-2 border-blue-200">
                      <h3 className="font-bold text-lg mb-4 text-gray-900">Günlük Kalori {goal === "lose" ? "Açığı" : "Fazlası"}</h3>
                      <p className="text-4xl font-black text-blue-600">{result.dailyDeficit} kcal</p>
                      <p className="text-sm text-gray-600 mt-2">Haftada {result.weeklyDeficit} kcal</p>
                    </div>

                    <div className={`bg-gradient-to-br ${result.warning ? 'from-red-50 to-orange-100 border-red-200' : 'from-green-50 to-emerald-100 border-green-200'} rounded-xl p-6 border-2`}>
                      <div className="flex items-start gap-2">
                        {result.warning ? (
                          <AlertCircle className="w-5 h-5 text-red-600 mt-1" />
                        ) : (
                          <Target className="w-5 h-5 text-green-600 mt-1" />
                        )}
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2">Hız: {result.pace}</h3>
                          {result.warning && (
                            <p className="text-sm text-gray-700">{result.warning}</p>
                          )}
                        </div>
                      </div>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Kilo Verme/Alma Süresi: Gerçekçi Hedefler Belirlemek</h2>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  Kilo yönetimi bir maraton, sprint değildir. Birçok insan hızlı sonuç almak isterken sürdürülemez yöntemler kullanır 
                  ve nihayetinde başarısız olur. Bilimsel araştırmalar, yavaş ve istikrarlı kilo kaybının uzun vadede çok daha etkili 
                  olduğunu göstermektedir. Haftada 0.5-1 kg kilo vermek ideal hızdır; bu hem metabolizmayı korur hem de yoyo etkisini 
                  önler. Bu hesaplayıcı, hedef kilonuza ulaşmanız için gereken süreyi gerçekçi bir şekilde tahmin eder ve günlük 
                  kalori ihtiyacınızı hesaplar.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1 Kilogram Yağ = 7700 Kalori</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vücut yağının 1 kilogramı yaklaşık 7700 kalori enerji içerir. Bu, 1 kg yağ kaybetmek için toplam 7700 kalori açığı 
                  oluşturmanız gerektiği anlamına gelir. Haftada 0.5 kg kilo vermek istiyorsanız, haftalık 3850 kalori (günlük ~550 kalori) 
                  açığı gerekir. Bu açık, daha az yiyerek, daha fazla egzersiz yaparak veya her ikisinin kombinasyonuyla sağlanabilir. 
                  Örneğin, günlük 300 kalori daha az yiyip 250 kalori egzersiz yaparsanız toplam 550 kalori açığı oluşturursunuz. 
                  Kilo almak için ise tam tersi geçerlidir; fazla kalori almanız gerekir.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hızlı Kilo Kaybı Neden Zararlıdır?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Haftada 1 kg'dan fazla kilo vermek birçok sağlık riski taşır. Öncelikle, aşırı kalori kısıtlaması metabolizmanızı 
                  yavaşlatır; vücut "açlık modu"na girer ve enerji tasarrufu yapmaya başlar. Bu, kilo kaybını zorlaştırır ve diyet 
                  bittiğinde yoyo etkisine (hızlı kilo alma) yol açar. Ayrıca hızlı kilo kaybı kas kütlesi kaybına neden olur; kaybedilen 
                  kilonun %25-30'u kas olabilir. Kas kaybı metabolizmayı daha da yavaşlatır çünkü kas dokusu yağ dokusundan daha fazla 
                  kalori yakar. Diğer riskler arasında besin eksiklikleri, yorgunluk, saç dökülmesi, bağışıklık sistemi zayıflaması ve 
                  safra taşları yer alır.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sürdürülebilir Kilo Kaybı Stratejileri</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Başarılı ve kalıcı kilo kaybı için şu stratejileri uygulayın: 1) Gerçekçi hedefler koyun - ayda 2-4 kg hedeflemek 
                  idealdir. 2) Kalori sayımı yapın ama obsesif olmayın; MyFitnessPal gibi uygulamalar kullanışlıdır. 3) Protein alımınızı 
                  artırın; protein tokluk hissi verir ve kas kaybını önler. 4) Direnç antrenmanı yapın; kas kütlesini korumak için haftada 
                  2-3 gün ağırlık çalışın. 5) Uyku ve stres yönetimine dikkat edin; yetersiz uyku ve yüksek stres kilo kaybını zorlaştırır. 
                  6) Su için; genellikle susuzluk açlıkla karıştırılır. 7) İşlenmiş gıdalardan kaçının; tam, doğal besinlere odaklanın. 
                  8) Sabırlı olun; kilo verme doğrusal değildir, bazı haftalar plato yaşayabilirsiniz.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Kilo Almak İsteyenler İçin İpuçları</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Kilo almak kilo vermek kadar zor olabilir, özellikle hızlı metabolizmaya sahipseniz. Sağlıklı kilo almak için: 
                  1) Kalori fazlası yaratın ama aşırıya kaçmayın; günde 300-500 kalori fazla alın. 2) Sık sık yiyin; günde 5-6 küçük öğün 
                  iştahsızlık problemini çözebilir. 3) Kalori yoğun gıdalar seçin; fındık, fındık ezmesi, avokado, zeytinyağı, kuru meyve 
                  az hacimde çok kalori sağlar. 4) Sıvı kalori ekleyin; smoothie'ler, protein shake'leri ve süt ürünleri yardımcı olabilir. 
                  5) Kuvvet antrenmanı yapın; fazla kalorilerin kas olarak depolanmasını sağlar. 6) Kardiyoyu sınırlayın; aşırı kardiyovasküler 
                  egzersiz kalori açığı yaratır. 7) Uyumadan önce yiyin; gece boyunca enerji sağlar ve katabolizmayı önler.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Plato Dönemleri ve Nasıl Aşılır?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Kilo kaybı/kazanımı sırasında "plato" dönemleri yaygındır; birkaç hafta boyunca kilo değişmez. Bu normaldir çünkü 
                  vücudunuz yeni kiloya adapte olur ve metabolizma ayarlanır. Platoyu aşmak için: 1) Kalori alımınızı yeniden hesaplayın; 
                  kilo verdikçe daha az kalori yakmaya başlarsınız. 2) Egzersiz rutininizi değiştirin; vücut aynı egzersize alışır, yeni 
                  hareketler ekleyin. 3) Refeed günleri uygulayın; haftada bir gün karbonhidrat alımını artırarak metabolizmayı canlandırın. 
                  4) Stresi azaltın; yüksek kortizol (stres hormonu) kilo kaybını engeller. 5) Uyku kalitenizi artırın; yetersiz uyku grelin 
                  (açlık hormonu) seviyesini yükseltir. 6) Sabırlı olun; bazen plato gerçek değildir, su tutulması kilo gibi görünebilir.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sık Sorulan Sorular</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Haftada kaç kilo vermek güvenlidir?</h4>
                    <p className="text-gray-700">
                      Genel olarak haftada 0.5-1 kg güvenli ve sürdürülebilir kabul edilir. Daha hızlı kilo kaybı kas kaybı, metabolizma 
                      yavaşlaması ve besin eksikliklerine yol açabilir.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Kilo kaybı neden yavaşlıyor?</h4>
                    <p className="text-gray-700">
                      Kilo verdikçe vücudunuz daha az enerji harcar (daha hafifsiniz) ve metabolizmanız yavaşlar (adaptif termogenez). 
                      Kalori açığınızı düzenli olarak yeniden hesaplayın ve egzersiz rutininizi değiştirin.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Sadece diyet mi, sadece egzersiz mi, yoksa ikisi birden mi?</h4>
                    <p className="text-gray-700">
                      Araştırmalar, diyet + egzersiz kombinasyonunun en etkili olduğunu gösterir. Diyet kalori açığı sağlar, egzersiz 
                      kas kütlesini korur ve metabolizmayı yüksek tutar. Her ikisini de uygulamak ideal sonuçları verir.
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
