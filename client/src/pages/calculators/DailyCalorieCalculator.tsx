import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Flame, TrendingUp, Activity } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";

interface DailyCalorieCalculatorProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface CalorieResults {
  bmr: number;
  tdee: number;
  maintain: number;
  mildWeightLoss: number;
  weightLoss: number;
  extremeWeightLoss: number;
  mildWeightGain: number;
  weightGain: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function DailyCalorieCalculator({ categoryGroups, currentPath }: DailyCalorieCalculatorProps) {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("1.2");
  const [goal, setGoal] = useState<string>("maintain");
  const [results, setResults] = useState<CalorieResults | null>(null);

  const calculateBMR = (): number => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (gender === "male") {
      return 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      return 10 * w + 6.25 * h - 5 * a - 161;
    }
  };

  const calculateCalories = (e: React.FormEvent) => {
    e.preventDefault();

    const bmr = calculateBMR();
    const tdee = bmr * parseFloat(activityLevel);
    const w = parseFloat(weight);

    let targetCalories = tdee;
    if (goal === "weight-loss") targetCalories = tdee - 500;
    else if (goal === "mild-weight-loss") targetCalories = tdee - 250;
    else if (goal === "extreme-weight-loss") targetCalories = tdee - 1000;
    else if (goal === "weight-gain") targetCalories = tdee + 500;
    else if (goal === "mild-weight-gain") targetCalories = tdee + 250;

    const protein = w * 2.2;
    const fat = (targetCalories * 0.25) / 9;
    const carbs = (targetCalories - (protein * 4 + fat * 9)) / 4;

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      maintain: Math.round(tdee),
      mildWeightLoss: Math.round(tdee - 250),
      weightLoss: Math.round(tdee - 500),
      extremeWeightLoss: Math.round(tdee - 1000),
      mildWeightGain: Math.round(tdee + 250),
      weightGain: Math.round(tdee + 500),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <a href="/hesaplayicilar" className="text-green-600 hover:text-green-700 font-medium text-sm">
              ← Tüm Hesaplayıcılar
            </a>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full px-6 py-2 mb-6 shadow-lg">
              <Flame className="w-5 h-5" />
              <span className="font-semibold">En Popüler Hesaplayıcı</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Günlük Kalori ve Makro Hesaplayıcı
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              BMR, TDEE ve kişiselleştirilmiş makro besin dağılımınızı bilimsel formüllerle hesaplayın
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Calculator Form */}
            <Card className="shadow-2xl border-2 border-green-100">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calculator className="w-6 h-6" />
                  Bilgilerinizi Girin
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={calculateCalories} className="space-y-6">
                  {/* Gender */}
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

                  {/* Age */}
                  <div className="space-y-3">
                    <Label htmlFor="age" className="text-base font-semibold">Yaş</Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Örn: 30"
                      required
                      min="15"
                      max="100"
                      className="h-12 text-lg"
                    />
                  </div>

                  {/* Weight */}
                  <div className="space-y-3">
                    <Label htmlFor="weight" className="text-base font-semibold">Kilo (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Örn: 75"
                      required
                      min="30"
                      max="300"
                      step="0.1"
                      className="h-12 text-lg"
                    />
                  </div>

                  {/* Height */}
                  <div className="space-y-3">
                    <Label htmlFor="height" className="text-base font-semibold">Boy (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Örn: 175"
                      required
                      min="120"
                      max="250"
                      className="h-12 text-lg"
                    />
                  </div>

                  {/* Activity Level */}
                  <div className="space-y-3">
                    <Label htmlFor="activity" className="text-base font-semibold">Aktivite Seviyesi</Label>
                    <Select value={activityLevel} onValueChange={setActivityLevel}>
                      <SelectTrigger className="h-12 text-base" id="activity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.2">Hareketsiz (hiç egzersiz yok)</SelectItem>
                        <SelectItem value="1.375">Az Aktif (haftada 1-3 gün)</SelectItem>
                        <SelectItem value="1.55">Orta Aktif (haftada 3-5 gün)</SelectItem>
                        <SelectItem value="1.725">Çok Aktif (haftada 6-7 gün)</SelectItem>
                        <SelectItem value="1.9">Ekstra Aktif (günde 2x egzersiz)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Goal */}
                  <div className="space-y-3">
                    <Label htmlFor="goal" className="text-base font-semibold">Hedefiniz</Label>
                    <Select value={goal} onValueChange={setGoal}>
                      <SelectTrigger className="h-12 text-base" id="goal">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="extreme-weight-loss">Hızlı Kilo Ver (haftada 1 kg)</SelectItem>
                        <SelectItem value="weight-loss">Kilo Ver (haftada 0.5 kg)</SelectItem>
                        <SelectItem value="mild-weight-loss">Yavaş Kilo Ver (haftada 0.25 kg)</SelectItem>
                        <SelectItem value="maintain">Kilonu Koru</SelectItem>
                        <SelectItem value="mild-weight-gain">Yavaş Kilo Al (haftada 0.25 kg)</SelectItem>
                        <SelectItem value="weight-gain">Kilo Al (haftada 0.5 kg)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Hesapla
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Results */}
            {results && (
              <div className="space-y-6">
                <Card className="shadow-2xl border-2 border-green-100">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Flame className="w-6 h-6" />
                      Sonuçlarınız
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    {/* BMR */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-lg text-gray-900">Bazal Metabolizma (BMR)</h3>
                      </div>
                      <p className="text-4xl font-black text-blue-600">{results.bmr} kcal</p>
                      <p className="text-sm text-gray-600 mt-2">Hiçbir aktivite yapmadan yaktığınız kalori</p>
                    </div>

                    {/* TDEE */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border-2 border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <h3 className="font-bold text-lg text-gray-900">Günlük Kalori İhtiyacı (TDEE)</h3>
                      </div>
                      <p className="text-4xl font-black text-green-600">{results.tdee} kcal</p>
                      <p className="text-sm text-gray-600 mt-2">Aktivite seviyenize göre toplam kalori ihtiyacı</p>
                    </div>

                    {/* Macro Distribution */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 border-2 border-purple-200">
                      <h3 className="font-bold text-lg text-gray-900 mb-4">Makro Besin Dağılımı</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-black text-red-600">{results.protein}g</p>
                          <p className="text-sm text-gray-600 font-medium">Protein</p>
                          <p className="text-xs text-gray-500">{Math.round((results.protein * 4 / results.tdee) * 100)}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-black text-amber-600">{results.carbs}g</p>
                          <p className="text-sm text-gray-600 font-medium">Karbonhidrat</p>
                          <p className="text-xs text-gray-500">{Math.round((results.carbs * 4 / results.tdee) * 100)}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-black text-yellow-600">{results.fat}g</p>
                          <p className="text-sm text-gray-600 font-medium">Yağ</p>
                          <p className="text-xs text-gray-500">{Math.round((results.fat * 9 / results.tdee) * 100)}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Goal Options */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
                      <h3 className="font-bold text-lg text-gray-900 mb-4">Hedef Bazlı Kalori Seçenekleri</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Hızlı Kilo Ver (-1 kg/hafta)</span>
                          <span className="font-bold text-red-600">{results.extremeWeightLoss} kcal</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Kilo Ver (-0.5 kg/hafta)</span>
                          <span className="font-bold text-orange-600">{results.weightLoss} kcal</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Yavaş Kilo Ver (-0.25 kg/hafta)</span>
                          <span className="font-bold text-amber-600">{results.mildWeightLoss} kcal</span>
                        </div>
                        <div className="flex justify-between items-center bg-green-100 px-3 py-2 rounded-lg">
                          <span className="text-sm font-medium">Kilonu Koru</span>
                          <span className="font-bold text-green-600">{results.maintain} kcal</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Yavaş Kilo Al (+0.25 kg/hafta)</span>
                          <span className="font-bold text-blue-600">{results.mildWeightGain} kcal</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Kilo Al (+0.5 kg/hafta)</span>
                          <span className="font-bold text-indigo-600">{results.weightGain} kcal</span>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Günlük Kalori İhtiyacını Doğru Hesaplamanın Önemi</h2>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sağlıklı bir yaşam için en temel adımlardan biri, vücudunuzun günlük kalori ihtiyacını doğru bir şekilde hesaplamaktır. 
                  Kilo vermek, kas yapmak veya mevcut kilonuzu korumak istiyorsanız, kalori dengesini anlamak kritik önem taşır. 
                  Bu hesaplayıcı, bilimsel olarak kanıtlanmış <strong>Mifflin-St Jeor formülü</strong> kullanarak size özel BMR (Bazal Metabolizma Hızı) 
                  ve TDEE (Toplam Günlük Enerji Harcaması) değerlerini hesaplar.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">BMR (Bazal Metabolizma Hızı) Nedir?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  BMR, vücudunuzun yaşamsal fonksiyonlarını sürdürmek için ihtiyaç duyduğu minimum kalori miktarıdır. 
                  Yani hiçbir fiziksel aktivite yapmadan, sadece nefes almak, kalp atışları, hücre yenilenmesi ve beyin fonksiyonları 
                  için harcadığınız enerjidir. BMR, yaş, cinsiyet, kilo ve boy gibi faktörlere bağlı olarak kişiden kişiye değişir. 
                  Erkeklerde genellikle daha yüksektir çünkü erkekler kadınlara göre daha fazla kas kütlesine sahiptir.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">TDEE (Toplam Günlük Enerji Harcaması) Nasıl Hesaplanır?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  TDEE, BMR değerinize aktivite seviyenizi ekleyerek hesaplanan toplam kalori ihtiyacınızdır. 
                  Hareketsiz bir yaşam sürüyorsanız TDEE değeriniz BMR'nizin yaklaşık 1.2 katı, günde iki kez yoğun egzersiz 
                  yapıyorsanız 1.9 katı olabilir. Bu nedenle aktivite seviyenizi doğru seçmek çok önemlidir. 
                  Ofiste çalışan ve düzenli spor yapmayan biri için "Hareketsiz" seçeneği, haftada 3-5 gün spor yapan biri için 
                  "Orta Aktif" seçeneği idealdir.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Makro Besin Dağılımı: Protein, Karbonhidrat ve Yağ</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Kalori hesaplamak tek başına yeterli değildir. Bu kalorileri hangi makro besinlerden alacağınız da en az o kadar önemlidir. 
                  Protein kas gelişimi ve onarımı için kritiktir; vücut ağırlığınızın her kilosu için günde yaklaşık 2.2 gram protein almanız önerilir. 
                  Karbonhidratlar enerji kaynağınızdır ve özellikle aktif bir yaşam sürüyorsanız günlük kalorinizin %40-50'sini karbonhidrattan almalısınız. 
                  Yağlar ise hormon üretimi, hücre zarı sağlığı ve vitamin emilimi için vazgeçilmezdir. Sağlıklı yağlar (zeytinyağı, avokado, fındık) 
                  günlük kalorinizin %20-30'unu oluşturmalıdır.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Kilo Verme ve Kilo Alma Stratejileri</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sağlıklı bir şekilde kilo vermek için günlük kalori ihtiyacınızdan 500 kcal eksik almanız, haftada yaklaşık 0.5 kg vermenizi sağlar. 
                  Bu, sürdürülebilir ve sağlıklı bir hızdır. Daha hızlı kilo vermek isterseniz 1000 kcal açık verebilirsiniz ancak bu yöntem 
                  sadece kısa süreli uygulanmalı ve mutlaka uzman gözetiminde olmalıdır. Kilo almak isteyenler ise günlük kalori ihtiyaçlarının 
                  üzerinde 300-500 kcal fazla alarak temiz kas kütlesi kazanabilirler. Ancak bu fazla kalorilerin kaliteli kaynaklardan 
                  (tam tahıllar, yağsız proteinler, sağlıklı yağlar) gelmesi önemlidir.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Neden Bu Hesaplayıcıyı Kullanmalısınız?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  İnternette birçok kalori hesaplayıcı bulunsa da, çoğu genel formüller kullanır ve kişiselleştirilmiş sonuçlar vermez. 
                  Bizim hesaplayıcımız, bilimsel olarak en güvenilir formül olan <strong>Mifflin-St Jeor denklemini</strong> kullanır ve 
                  size aktivite seviyenize, hedefinize göre detaylı makro besin dağılımı sunar. Üstelik tamamen ücretsizdir ve 
                  kişisel verileriniz saklanmaz. Sonuçlarınızı not alın ve beslenme planınızı buna göre düzenleyin.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sık Sorulan Sorular</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">BMR ve TDEE arasındaki fark nedir?</h4>
                    <p className="text-gray-700">
                      BMR vücudunuzun hiç hareket etmeden harcadığı kaloridir. TDEE ise günlük aktivitelerinizi de hesaba katarak 
                      toplam kalori harcamanızı gösterir. TDEE = BMR × Aktivite Faktörü şeklinde hesaplanır.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Her gün aynı kaloriyi mi almalıyım?</h4>
                    <p className="text-gray-700">
                      Genel olarak evet, tutarlılık önemlidir. Ancak hafta içi daha aktifseniz ve hafta sonu dinlendiyseniz, 
                      kalori alımınızı buna göre ayarlayabilirsiniz. Önemli olan haftalık ortalama kalorinizdir.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Kilo veremiyorum, ne yapmalıyım?</h4>
                    <p className="text-gray-700">
                      Eğer hesaplanan kalori açığına rağmen kilo veremiyorsanız, aktivite seviyenizi yanlış seçmiş olabilirsiniz. 
                      Bir seviye daha düşük seçerek tekrar deneyin. Ayrıca kalori sayımında hata yapıyor olabilirsiniz; 
                      porsiyon kontrolüne dikkat edin.
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
