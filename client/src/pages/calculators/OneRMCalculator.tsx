import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Dumbbell, Zap, TrendingUp, AlertCircle, Target, Trophy } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface OneRMCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface FormulaResult {
  name: string;
  value: number;
  description: string;
}

interface OneRMResult {
  average: number;
  formulas: FormulaResult[];
  strengthLevel: string;
  strengthCategory: string;
  color: string;
  trainingPercentages: {
    percentage: number;
    weight: number;
    reps: string;
    purpose: string;
  }[];
}

export default function OneRMCalculator({ categoryGroups, currentPath }: OneRMCalculatorProps) {
  const [weight, setWeight] = useState<number>(100);
  const [reps, setReps] = useState<number>(5);
  const [bodyweight, setBodyweight] = useState<number>(75);
  const [result, setResult] = useState<OneRMResult | null>(null);

  const calculateOneRM = (e: React.FormEvent) => {
    e.preventDefault();
    
    const epley = weight * (1 + 0.0333 * reps);
    const brzycki = weight * (36 / (37 - reps));
    const lander = (100 * weight) / (101.3 - 2.67123 * reps);
    const lombardi = weight * Math.pow(reps, 0.10);
    const mayhew = (100 * weight) / (52.2 + 41.9 * Math.exp(-0.055 * reps));
    
    const formulas: FormulaResult[] = [
      { name: "Epley", value: epley, description: "En yaygın kullanılan formül" },
      { name: "Brzycki", value: brzycki, description: "Düşük tekrarlarda doğru" },
      { name: "Lander", value: lander, description: "Orta tekrar aralığı" },
      { name: "Lombardi", value: lombardi, description: "Yüksek ağırlıklar için" },
      { name: "Mayhew", value: mayhew, description: "Bilimsel araştırmalara dayalı" }
    ];

    const average = formulas.reduce((sum, f) => sum + f.value, 0) / formulas.length;
    const ratio = average / bodyweight;

    let strengthLevel = "";
    let strengthCategory = "";
    let color = "";

    if (ratio < 0.5) {
      strengthLevel = "Başlangıç";
      strengthCategory = "Yeni başlayan - Temel kuvvet geliştirme fazı";
      color = "from-gray-500 to-slate-600";
    } else if (ratio < 1.0) {
      strengthLevel = "Orta Seviye";
      strengthCategory = "Gelişen sporcu - Düzenli antrenman yapıyor";
      color = "from-blue-500 to-cyan-600";
    } else if (ratio < 1.5) {
      strengthLevel = "İleri Seviye";
      strengthCategory = "Deneyimli atlet - Yüksek performans";
      color = "from-orange-500 to-amber-600";
    } else if (ratio < 2.0) {
      strengthLevel = "Elit";
      strengthCategory = "Profesyonel seviye - Üstün kuvvet";
      color = "from-red-500 to-rose-600";
    } else {
      strengthLevel = "Dünya Klasmanı";
      strengthCategory = "Olağanüstü performans - Şampiyon seviyesi";
      color = "from-purple-500 to-pink-600";
    }

    const trainingPercentages = [
      { percentage: 50, weight: average * 0.50, reps: "15-20", purpose: "Isınma, Dayanıklılık" },
      { percentage: 60, weight: average * 0.60, reps: "12-15", purpose: "Kas Dayanıklılığı" },
      { percentage: 70, weight: average * 0.70, reps: "10-12", purpose: "Hipertrofi (Kas Gelişimi)" },
      { percentage: 80, weight: average * 0.80, reps: "6-8", purpose: "Kuvvet Gelişimi" },
      { percentage: 90, weight: average * 0.90, reps: "3-5", purpose: "Maksimal Kuvvet" },
      { percentage: 95, weight: average * 0.95, reps: "1-3", purpose: "Pik Kuvvet, Test" }
    ];

    setResult({
      average: parseFloat(average.toFixed(1)),
      formulas: formulas.map(f => ({ ...f, value: parseFloat(f.value.toFixed(1)) })),
      strengthLevel,
      strengthCategory,
      color,
      trainingPercentages: trainingPercentages.map(p => ({ ...p, weight: parseFloat(p.weight.toFixed(1)) }))
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-400 to-orange-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-400 to-red-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-red-400 hover:text-red-300 font-medium text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full inline-block border border-red-500/30" data-testid="link-calculators">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-full px-6 py-3 mb-6 shadow-2xl shadow-red-500/50 border border-red-400/30">
              <Dumbbell className="w-6 h-6 animate-pulse" />
              <span className="font-bold">5 Farklı Formül - En Doğru Sonuç</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-red-400 via-orange-500 to-red-400 bg-clip-text text-transparent drop-shadow-2xl">
              1RM Hesaplayıcı
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Maksimal kaldırma kapasitelerinizi hesaplayın ve antrenman ağırlıklarınızı belirleyin
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl shadow-lg shadow-red-500/50">
                  <Dumbbell className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Bilgilerinizi Girin</h2>
              </div>

              <form onSubmit={calculateOneRM} className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Kaldırılan Ağırlık (kg)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                      {weight}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-red-500/20 to-orange-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-red-400 [&::-webkit-slider-thumb]:to-orange-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-red-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                    data-testid="slider-weight"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Tekrar Sayısı</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                      {reps}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={reps}
                    onChange={(e) => setReps(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-orange-400 [&::-webkit-slider-thumb]:to-red-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-orange-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                    data-testid="slider-reps"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold text-white">Vücut Ağırlığı (kg)</label>
                    <span className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                      {bodyweight}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="150"
                    value={bodyweight}
                    onChange={(e) => setBodyweight(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-yellow-400 [&::-webkit-slider-thumb]:to-amber-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:shadow-yellow-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                    data-testid="slider-bodyweight"
                  />
                  <p className="text-sm text-gray-400">Kuvvet seviyenizi belirlemek için</p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-16 text-xl font-black bg-gradient-to-r from-red-500 via-orange-600 to-red-500 hover:from-red-600 hover:via-orange-700 hover:to-red-600 shadow-2xl shadow-red-500/50 rounded-2xl border-2 border-red-400/50 hover:scale-105 transition-all duration-300"
                  data-testid="button-calculate"
                >
                  <Zap className="w-6 h-6 mr-2 animate-pulse" />
                  1RM'i Hesapla
                </Button>
              </form>
            </div>

            {result && (
              <div className="space-y-6">
                <div className={`backdrop-blur-2xl bg-gradient-to-br ${result.color}/20 rounded-3xl border border-white/30 p-8 shadow-2xl hover:scale-105 transition-all duration-300`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy className="w-8 h-8 text-white animate-pulse" />
                    <h3 className="text-2xl font-black text-white">Ortalama 1RM</h3>
                  </div>
                  <div className="text-8xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4" data-testid="text-average-1rm">
                    {result.average} kg
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-white">{result.strengthLevel}</p>
                    <p className="text-lg text-gray-200">{result.strengthCategory}</p>
                    <p className="text-sm text-gray-300">Vücut ağırlığı oranı: {(result.average / bodyweight).toFixed(2)}x</p>
                  </div>
                </div>

                <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-6 h-6 text-red-400" />
                    <h3 className="text-xl font-black text-white">Formül Karşılaştırması</h3>
                  </div>
                  <div className="space-y-3">
                    {result.formulas.map((formula) => (
                      <div key={formula.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                        <div>
                          <p className="font-bold text-white">{formula.name}</p>
                          <p className="text-xs text-gray-400">{formula.description}</p>
                        </div>
                        <p className="text-2xl font-black text-red-400" data-testid={`text-formula-${formula.name.toLowerCase()}`}>{formula.value} kg</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {result && (
            <div className="mb-16">
              <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <TrendingUp className="w-8 h-8 text-orange-400" />
                  <h2 className="text-3xl font-black text-white">Antrenman Ağırlıkları</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.trainingPercentages.map((tp) => (
                    <div key={tp.percentage} className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/20 p-6 hover:scale-105 transition-all duration-300 shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-4xl font-black bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent" data-testid={`text-percentage-${tp.percentage}`}>
                          {tp.percentage}%
                        </span>
                        <span className="text-2xl font-black text-white" data-testid={`text-weight-${tp.percentage}`}>{tp.weight} kg</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-300">{tp.reps} tekrar</p>
                        <p className="text-xs text-gray-400">{tp.purpose}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <article className="prose prose-lg prose-invert max-w-none">
            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-12">
              <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                1RM (One Rep Max) Nedir?
              </h2>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                1RM (One Repetition Maximum), bir egzersizde tek bir tekrarda kaldırabileceğiniz maksimum ağırlığı ifade eder. Bu değer, kuvvet antrenmanının temel taşıdır ve antrenman programınızı planlamanın bilimsel yoludur. Örneğin, bench press'te 1RM'iniz 100 kg ise, bu ağırlığı sadece bir kez kaldırabilirsiniz demektir. 1RM'inizi bilmek, antrenman ağırlıklarınızı doğru belirlemek için kritik önem taşır. Hedeflerinize göre 1RM'inizin belirli yüzdelerini kullanarak çalışırsınız: kas gelişimi için %70-85, maksimal kuvvet için %85-95, kuvvet dayanıklılığı için %50-70 aralığında çalışmak idealdir. 1RM'inizi belirlemek için iki yöntem vardır: doğrudan test (riskli, deneyimli sporcular için) veya hesaplama formülleri (güvenli, herkes için uygun). Bu hesaplayıcı, 5 farklı bilimsel formül kullanarak en doğru tahminleri sağlar: Epley formülü en yaygın olanıdır ve 1-10 tekrar aralığında çok doğrudur. Brzycki formülü düşük tekrar sayılarında (1-5) daha hassastır. Lander formülü orta tekrar aralığında (4-10) güvenilirdir. Lombardi formülü ağır yükler için optimize edilmiştir. Mayhew formülü bilimsel araştırmalara dayanır ve geniş tekrar aralığında kullanılabilir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                1RM Testini Güvenli Şekilde Yapma
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Doğrudan 1RM testi yapmak risklidir ve sadece deneyimli sporcular için önerilir. Güvenli bir test için mutlaka ısınma yapın: 5-10 dakika hafif kardio, ardından dinamik germe hareketleri. Başlamadan önce uygun teknikle birkaç set hafif ağırlıkla pratik yapın. Kademeli yüklenme protokolünü izleyin: önce beklenen 1RM'inizin %50'si ile 8-10 tekrar yapın, 2 dakika dinlenin. Sonra %70 ile 4-6 tekrar yapın, 3 dakika dinlenin. Ardından %85 ile 2-3 tekrar yapın, 3-5 dakika dinlenin. Son olarak %95 ile 1 tekrar deneme yapın, 3-5 dakika dinlenin. Eğer başarılı olursanız, ağırlığı 2.5-5 kg artırıp tekrar deneyin. Başarısızsa, bir önceki başarılı deneme 1RM'inizdir. Güvenlik önlemleri kritiktir: mutlaka bir spotter (yardımcı) bulundurun, özellikle squat ve bench press gibi hareketlerde. Güvenlik barlarını doğru yüksekliğe ayarlayın. Tekniğinizden asla ödün vermeyin; kötü teknikle kaldırılan ağırlık gerçek 1RM değildir. Yorgun veya sakatken test yapmayın. Yeni başlayanlar için: ilk 6-12 ay boyunca doğrudan 1RM testi yapmayın. Bunun yerine bu hesaplayıcıyı kullanın. Deneyim kazandıkça ve tekniğiniz oturdukça test yapabilirsiniz.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                Periodizasyon: Sistematik Kuvvet Artışı
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Periodizasyon, antrenman programınızı döngülere ayırarak sistematik olarak ilerlemek demektir. Bu yaklaşım, plato yapmayı önler ve uzun vadeli kazanımlar sağlar. Klasik lineer periodizasyon en basit modeldir: 4 hafta hipertrofi fazı (%70-75, 8-12 tekrar), ardından 3 hafta kuvvet fazı (%80-85, 5-8 tekrar), son olarak 2 hafta maksimal kuvvet fazı (%90-95, 1-5 tekrar), sonra 1 hafta deload (yükün düşürülmesi). Dalgalı periodizasyon (undulating) daha gelişmiş sporcular içindir: aynı hafta içinde farklı yoğunluklar kullanılır. Örneğin Pazartesi %75 ile 8 tekrar, Çarşamba %85 ile 5 tekrar, Cuma %90 ile 3 tekrar. Blok periodizasyon profesyoneller içindir: her blok bir yeteneği (dayanıklılık, hipertrofi, kuvvet, güç) hedefler ve 2-4 hafta sürer. Deload haftaları (boşaltma) kritiktir: her 3-4 haftada bir, volümü %40-50 azaltın ama yoğunluğu koruyun. Bu, kas ve sinir sisteminin toparlanmasını sağlar. Periodizasyon prensipleri: hacim ve yoğunluk ters orantılıdır (biri arttığında diğeri azalır). Zaman içinde toplam iş yükünü artırın (progressive overload). Farklı rep aralıkları farklı adaptasyonlar sağlar: 1-5 tekrar nöral adaptasyon (sinir-kas bağlantısı), 6-12 tekrar kas hipertrofisi, 12+ tekrar kas dayanıklılığı geliştirir.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Progressive Overload: Sürekli İlerleme Prensibi
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Progressive overload (aşamalı yüklenme), vücudunuza zamanla daha fazla stres uygulayarak adaptasyonu zorlamak demektir. Bu, kuvvet artışının altın kuralıdır. Uygulamanın dört temel yolu vardır: ağırlık artışı en doğrudan yöntemdir. Her hafta veya iki haftada bir, aynı tekrar sayısında ağırlığı 2.5-5 kg artırın. Küçük artışlar (2.5 kg) üst vücut için, büyük artışlar (5 kg) alt vücut için uygundur. Tekrar artışı: aynı ağırlıkla daha fazla tekrar yapın. Örneğin bu hafta 100 kg ile 5 tekrar yaptıysanız, gelecek hafta 100 kg ile 6 tekrar hedefleyin. Hedef tekrara ulaştığınızda ağırlığı artırın. Set artışı: aynı ağırlık ve tekrarla daha fazla set yapın. Örneğin 3 set yerine 4 set yapmak. Tempo değişimi: hareketleri daha yavaş veya kontrollü yapın. Örneğin 3 saniye inme, 2 saniye durma, 1 saniye kalkma. Dinlenme süresini azaltmak da bir yüklenme yoludur ama bu daha çok dayanıklılık geliştirir. Overload uygularken dikkat edilmesi gerekenler: çok hızlı ilerlemeyin, vücut adaptasyon için zamana ihtiyaç duyar. Haftalık ağırlık artışı %2.5-5 arası olmalı. Tekniğiniz bozuluyorsa ağırlık çok fazladır, geri alın. Her antrenmanı kaydedin: ağırlık, set, tekrar sayılarını not edin. Böylece ilerlemenizi takip edersiniz. Plato yaptığınızda (2-3 hafta ilerleme yok) deload yapın veya program değiştirin.
              </p>

              <h3 className="text-3xl font-bold text-white mt-10 mb-4 bg-gradient-to-r from-purple-400 to-red-500 bg-clip-text text-transparent">
                Kuvvet Standartları ve Hedef Belirleme
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Kuvvet standartları, 1RM'inizin vücut ağırlığınıza oranına göre belirlenir. Squat için başlangıç seviyesi: erkekler 1.0x, kadınlar 0.75x vücut ağırlığı. Orta seviye: erkekler 1.5x, kadınlar 1.25x. İleri seviye: erkekler 2.0x, kadınlar 1.5x. Elit seviye: erkekler 2.5x+, kadınlar 2.0x+. Bench press standartları: başlangıç erkekler 0.75x, kadınlar 0.5x. Orta erkekler 1.25x, kadınlar 0.75x. İleri erkekler 1.5x, kadınlar 1.0x. Elit erkekler 2.0x+, kadınlar 1.25x+. Deadlift standartları: başlangıç erkekler 1.25x, kadınlar 0.75x. Orta erkekler 1.75x, kadınlar 1.25x. İleri erkekler 2.25x, kadınlar 1.5x. Elit erkekler 2.75x+, kadınlar 2.0x+. Overhead press standartları: başlangıç erkekler 0.5x, kadınlar 0.3x. Orta erkekler 0.75x, kadınlar 0.5x. İleri erkekler 1.0x, kadınlar 0.65x. Elit erkekler 1.25x+, kadınlar 0.9x+. Gerçekçi hedefler belirleyin: yeni başlayanlar ilk yıl vücut ağırlığı başına %50-100 artış bekleyebilir. Ara seviye sporcular yılda %10-25 artış görür. İleri seviye sporcular yılda %5-10 artış hedeflemeli. Uzun vadeli hedefler koyun: 1 yıllık, 3 yıllık, 5 yıllık hedefler belirleyin. Örnek hedef: "1 yıl içinde squat'ta 1.5x vücut ağırlığına ulaşmak". Unutmayın, genetik, yaş, cinsiyet, antrenman geçmişi kuvvet gelişimini etkiler. Kendinizi başkalarıyla değil, geçmiş halinizle karşılaştırın. Sürekli ilerleme en önemli göstergedir.
              </p>

              <div className="mt-12 text-center">
                <a 
                  href="/hesaplayicilar" 
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold text-lg hover:from-red-600 hover:to-orange-700 shadow-2xl shadow-red-500/50 border border-red-400/30 hover:scale-105 transition-all duration-300"
                  data-testid="link-all-calculators"
                >
                  <Dumbbell className="w-6 h-6" />
                  Tüm Hesaplayıcıları Görüntüle
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
