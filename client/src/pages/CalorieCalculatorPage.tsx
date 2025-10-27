import { useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { ResultCard } from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Flame, Activity, TrendingUp, Zap, Apple } from "lucide-react";
import { Link } from "wouter";
import type { CategoryGroup } from "@shared/schema";

interface CalorieCalculatorPageProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface CalorieCalculatorResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  calorieChange: number;
  protein: number;
  carbs: number;
  fat: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
}

export default function CalorieCalculatorPage({ categoryGroups, currentPath }: CalorieCalculatorPageProps) {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("");
  const [goal, setGoal] = useState("");
  const [results, setResults] = useState<CalorieCalculatorResult | null>(null);

  const calculateCalories = () => {
    if (!age || !gender || !height || !weight || !activity || !goal) return;

    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    // Mifflin-St Jeor Formula for BMR
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    // Activity multipliers
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const tdee = bmr * activityMultipliers[activity];

    // Goal adjustments
    let targetCalories: number;
    let calorieChange: number;
    if (goal === "loss") {
      targetCalories = tdee - 500; // 0.5kg/week loss
      calorieChange = -500;
    } else if (goal === "gain") {
      targetCalories = tdee + 500; // 0.5kg/week gain
      calorieChange = 500;
    } else {
      targetCalories = tdee;
      calorieChange = 0;
    }

    // Macro calculations (40/30/30 for loss, 30/40/30 for maintenance, 30/25/45 for gain)
    let proteinPercent: number, carbsPercent: number, fatPercent: number;
    if (goal === "loss") {
      proteinPercent = 40;
      carbsPercent = 30;
      fatPercent = 30;
    } else if (goal === "gain") {
      proteinPercent = 30;
      carbsPercent = 45;
      fatPercent = 25;
    } else {
      proteinPercent = 30;
      carbsPercent = 40;
      fatPercent = 30;
    }

    const proteinGrams = (targetCalories * (proteinPercent / 100)) / 4;
    const carbsGrams = (targetCalories * (carbsPercent / 100)) / 4;
    const fatGrams = (targetCalories * (fatPercent / 100)) / 9;

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      calorieChange,
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbsGrams),
      fat: Math.round(fatGrams),
      proteinPercent,
      carbsPercent,
      fatPercent
    });
  };

  const article = (
    <>
      <h2>Günlük Kalori İhtiyacınızı Doğru Hesaplayın</h2>
      <p>
        <strong>Günlük kalori ihtiyacı</strong>, vücudunuzun hayati fonksiyonlarını sürdürmek ve günlük aktivitelerinizi 
        gerçekleştirmek için gereken enerji miktarıdır. Bu hesaplama, sağlıklı kilo verme, kilo alma veya kiloyu koruma 
        hedeflerinize ulaşmanın temelidir.
      </p>

      <h3>BMR (Bazal Metabolik Hız) Nedir?</h3>
      <p>
        <strong>BMR (Basal Metabolic Rate)</strong>, vücudunuzun dinlenme halindeyken yaklaşık 24 saatte yaktığı kalori 
        miktarıdır. Nefes almak, kan pompalaması, hücre üretimi gibi temel yaşam fonksiyonları için gerekli enerjidir.
      </p>
      
      <p>
        Bu hesaplayıcıda <strong>Mifflin-St Jeor formülü</strong> kullanılmaktadır. Bu formül, günümüzde en doğru kabul 
        edilen BMR hesaplama yöntemidir:
      </p>

      <div className="bg-gray-100 p-4 rounded-lg my-4 font-mono text-sm">
        <p className="mb-2"><strong>Erkekler için:</strong></p>
        <p className="mb-4">BMR = 10 × kilo(kg) + 6.25 × boy(cm) - 5 × yaş + 5</p>
        
        <p className="mb-2"><strong>Kadınlar için:</strong></p>
        <p>BMR = 10 × kilo(kg) + 6.25 × boy(cm) - 5 × yaş - 161</p>
      </div>

      <h3>TDEE (Total Daily Energy Expenditure) Nedir?</h3>
      <p>
        <strong>TDEE</strong>, toplam günlük enerji harcamanızdır. BMR'inizi aktivite seviyenizle çarparak bulursunuz. 
        Aktivite çarpanları şöyledir:
      </p>

      <ul>
        <li><strong>Hareketsiz (x1.2):</strong> Masa başı iş, çok az veya hiç egzersiz yok</li>
        <li><strong>Az Aktif (x1.375):</strong> Hafif egzersiz, haftada 1-3 gün</li>
        <li><strong>Orta Aktif (x1.55):</strong> Orta düzey egzersiz, haftada 3-5 gün</li>
        <li><strong>Çok Aktif (x1.725):</strong> Yoğun egzersiz, haftada 6-7 gün</li>
        <li><strong>Aşırı Aktif (x1.9):</strong> Günde 2 kez antrenman veya fiziksel ağır iş</li>
      </ul>

      <h3>Hedef Bazlı Kalori Ayarlaması</h3>
      <p>
        TDEE'nizi öğrendikten sonra hedefinize göre kalori alımınızı ayarlayabilirsiniz:
      </p>

      <div className="space-y-4 my-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="font-semibold text-gray-900 mb-2">🔥 Kilo Vermek İçin</p>
          <p className="text-gray-700">
            TDEE - 500 kalori = <strong>Haftada 0.5 kg kayıp</strong><br />
            TDEE - 750 kalori = <strong>Haftada 0.75 kg kayıp</strong><br />
            <em className="text-sm">Not: Günde 1200 kalorinin altına düşmeyin!</em>
          </p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <p className="font-semibold text-gray-900 mb-2">⚖️ Kiloyu Korumak İçin</p>
          <p className="text-gray-700">
            TDEE = <strong>Mevcut kilonuzu korursunuz</strong><br />
            <em className="text-sm">Vücut kompozisyonu için makro dengesine dikkat edin</em>
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="font-semibold text-gray-900 mb-2">💪 Kas Kütlesi Kazanmak İçin</p>
          <p className="text-gray-700">
            TDEE + 300-500 kalori = <strong>Temiz bulk (yavaş kas kazanımı)</strong><br />
            <em className="text-sm">Yüksek protein (2g/kg) ve düzenli direnç antrenmanı şarttır</em>
          </p>
        </div>
      </div>

      <h3>Makro Besin Dağılımı Nasıl Olmalı?</h3>
      <p>
        Makro besinler (protein, karbonhidrat, yağ) doğru oranda tüketilmelidir. Hedefinize göre önerilen dağılımlar:
      </p>

      <div className="overflow-x-auto my-6">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Hedef</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Protein</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Karbonhidrat</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Yağ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Kilo Verme</td>
              <td className="border border-gray-300 px-4 py-2 font-semibold">40%</td>
              <td className="border border-gray-300 px-4 py-2">30%</td>
              <td className="border border-gray-300 px-4 py-2">30%</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">Kilo Koruma</td>
              <td className="border border-gray-300 px-4 py-2">30%</td>
              <td className="border border-gray-300 px-4 py-2 font-semibold">40%</td>
              <td className="border border-gray-300 px-4 py-2">30%</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Kas Kazanımı</td>
              <td className="border border-gray-300 px-4 py-2">30%</td>
              <td className="border border-gray-300 px-4 py-2 font-semibold">45%</td>
              <td className="border border-gray-300 px-4 py-2">25%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Protein İhtiyacınızı Karşılayacak Besinler</h3>
      <p>
        Günlük protein hedefinize ulaşmak için BesinDeğerim.com'daki <strong>gerçek porsiyon bazlı</strong> protein 
        kaynaklarını kullanabilirsiniz:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <Link href="/tavuk-gogsu">
          <a className="block p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-green-500 transition-colors">
            <p className="font-bold text-gray-900">🍗 Tavuk Göğsü</p>
            <p className="text-sm text-gray-600">100g = 31g protein</p>
          </a>
        </Link>

        <Link href="/yumurta">
          <a className="block p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-green-500 transition-colors">
            <p className="font-bold text-gray-900">🥚 Yumurta</p>
            <p className="text-sm text-gray-600">1 büyük = 6g protein</p>
          </a>
        </Link>

        <Link href="/yaglik-yogurt">
          <a className="block p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-green-500 transition-colors">
            <p className="font-bold text-gray-900">🥛 Yağlık Yoğurt</p>
            <p className="text-sm text-gray-600">1 kase = 10g protein</p>
          </a>
        </Link>

        <Link href="/mercimek">
          <a className="block p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-green-500 transition-colors">
            <p className="font-bold text-gray-900">🌱 Mercimek</p>
            <p className="text-sm text-gray-600">1 kase = 18g protein</p>
          </a>
        </Link>
      </div>

      <h3>Sıkça Sorulan Sorular</h3>
      
      <div className="space-y-4 my-6">
        <div>
          <h4 className="font-bold text-gray-900 mb-2">❓ Günde kaç kalori almalıyım?</h4>
          <p className="text-gray-700">
            TDEE hesaplama ile başlayın. Kilo vermek için 300-750 kalori açık, kas kazanmak için 300-500 kalori fazla verin. 
            Kadınlar minimum 1200, erkekler minimum 1500 kalori tüketmelidir.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-2">❓ Makro oranlarım sabit mi kalmalı?</h4>
          <p className="text-gray-700">
            Hayır. Hedefleriniz, aktivite düzeyiniz ve vücut kompozisyonunuz değiştikçe makro dağılımınızı ayarlayabilirsiniz. 
            Protein genellikle sabit kalır (1.6-2.2 g/kg), karbonhidrat ve yağı ayarlarsınız.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-2">❓ TDEE'mi nasıl doğrularım?</h4>
          <p className="text-gray-700">
            2-3 hafta hesaplanan kaloriler ile beslenin ve kilonuzu takip edin. Kilo değişmiyorsa TDEE'niz doğrudur. 
            Haftalık kilo değişimine göre +/- 200 kalori ayarlama yapabilirsiniz.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-2">❓ Cheat meal TDEE'mi etkiler mi?</h4>
          <p className="text-gray-700">
            Tek bir öğün değil, <strong>haftalık ortalama</strong> önemlidir. Haftada bir cheat meal TDEE'nizi çok etkilemez. 
            Ancak sürekli olursa haftalık kalori dengeniz bozulur.
          </p>
        </div>
      </div>

      <h3>Sonuç</h3>
      <p>
        Günlük kalori ve makro ihtiyacınızı bilmek, sağlıklı beslenmenin temelidir. Bu hesaplayıcı ile <strong>BMR</strong>, 
        <strong>TDEE</strong> ve <strong>hedef bazlı kalori</strong> ihtiyacınızı öğrendiniz. Şimdi BesinDeğerim.com'daki 
        266 gıda veritabanımızı kullanarak <Link href="/"><a>gerçek porsiyon bazlı</a></Link> öğünlerinizi planlayabilirsiniz.
      </p>

      <p>
        Diğer hesaplayıcılarımıza göz atın: <Link href="/hesaplayicilar/protein-gereksinimi"><a>Protein Gereksinimi</a></Link>, 
        <Link href="/hesaplayicilar/porsiyon-cevirici"><a>Porsiyon Çevirici</a></Link>, 
        <Link href="/hesaplayicilar/gunluk-su-ihtiyaci"><a>Su İhtiyacı</a></Link>.
      </p>
    </>
  );

  return (
    <CalculatorLayout
      categoryGroups={categoryGroups}
      currentPath={currentPath}
      title="Günlük Kalori ve Makro Hesaplayıcı"
      description="BMR, TDEE ve günlük kalori ihtiyacınızı hesaplayın. Hedeflerinize uygun protein, karbonhidrat ve yağ dağılımını öğrenin."
      icon={<Calculator className="w-10 h-10 text-white" />}
      color="from-green-500 to-emerald-600"
      article={article}
    >
      {/* Form */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Yaş</Label>
            <Input
              id="age"
              type="number"
              placeholder="25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="15"
              max="100"
              data-testid="input-age"
            />
          </div>

          <div>
            <Label htmlFor="gender">Cinsiyet</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger data-testid="select-gender">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Erkek</SelectItem>
                <SelectItem value="female">Kadın</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="height">Boy (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="170"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min="100"
              max="250"
              data-testid="input-height"
            />
          </div>

          <div>
            <Label htmlFor="weight">Kilo (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="30"
              max="300"
              data-testid="input-weight"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="activity">Aktivite Seviyesi</Label>
          <Select value={activity} onValueChange={setActivity}>
            <SelectTrigger data-testid="select-activity">
              <SelectValue placeholder="Seçiniz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Hareketsiz (ofis işi, egzersiz yok)</SelectItem>
              <SelectItem value="light">Az Aktif (haftada 1-3 gün hafif egzersiz)</SelectItem>
              <SelectItem value="moderate">Orta Aktif (haftada 3-5 gün orta egzersiz)</SelectItem>
              <SelectItem value="active">Çok Aktif (haftada 6-7 gün yoğun egzersiz)</SelectItem>
              <SelectItem value="veryActive">Aşırı Aktif (günde 2 kez antrenman)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="goal">Hedefiniz</Label>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger data-testid="select-goal">
              <SelectValue placeholder="Seçiniz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="loss">Kilo Verme (-500 kcal/gün)</SelectItem>
              <SelectItem value="maintain">Kilo Koruma (TDEE)</SelectItem>
              <SelectItem value="gain">Kas Kazanımı (+500 kcal/gün)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={calculateCalories}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          size="lg"
          data-testid="button-calculate"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Hesapla
        </Button>
      </div>

      {/* Results */}
      {results && (
        <div className="mt-8 space-y-6 border-t pt-8">
          <h3 className="text-2xl font-black text-gray-900 mb-4">Sonuçlarınız</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              title="BMR (Bazal Metabolik Hız)"
              value={results.bmr}
              unit="kcal/gün"
              description="Dinlenme halinde yaktığınız kalori"
              icon={<Flame className="w-5 h-5 text-white" />}
              color="from-orange-500 to-red-600"
            />

            <ResultCard
              title="TDEE (Günlük Harcama)"
              value={results.tdee}
              unit="kcal/gün"
              description="Aktivitelerinizle toplam harcama"
              icon={<Activity className="w-5 h-5 text-white" />}
              color="from-blue-500 to-cyan-600"
            />

            <ResultCard
              title="Hedef Kalori"
              value={results.targetCalories}
              unit="kcal/gün"
              description={
                results.calorieChange > 0
                  ? `Günde +${results.calorieChange} kalori fazla`
                  : results.calorieChange < 0
                  ? `Günde ${results.calorieChange} kalori açık`
                  : "Mevcut kilonuzu koruyun"
              }
              icon={<TrendingUp className="w-5 h-5 text-white" />}
              color="from-green-500 to-emerald-600"
            />

            <ResultCard
              title="Günlük Protein"
              value={results.protein}
              unit="gram"
              description={`Toplam kalorinin %${results.proteinPercent}'i`}
              icon={<Zap className="w-5 h-5 text-white" />}
              color="from-teal-500 to-cyan-600"
            />

            <ResultCard
              title="Günlük Karbonhidrat"
              value={results.carbs}
              unit="gram"
              description={`Toplam kalorinin %${results.carbsPercent}'i`}
              icon={<Apple className="w-5 h-5 text-white" />}
              color="from-amber-500 to-orange-600"
            />

            <ResultCard
              title="Günlük Yağ"
              value={results.fat}
              unit="gram"
              description={`Toplam kalorinin %${results.fatPercent}'i`}
              icon={<Flame className="w-5 h-5 text-white" />}
              color="from-yellow-500 to-amber-600"
            />
          </div>

          {/* Macro Visualization */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-4">Makro Dağılımınız</h4>
            <div className="flex h-8 rounded-full overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-teal-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold"
                style={{ width: `${results.proteinPercent}%` }}
              >
                {results.proteinPercent}%
              </div>
              <div
                className="bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold"
                style={{ width: `${results.carbsPercent}%` }}
              >
                {results.carbsPercent}%
              </div>
              <div
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center text-white text-sm font-bold"
                style={{ width: `${results.fatPercent}%` }}
              >
                {results.fatPercent}%
              </div>
            </div>
            <div className="flex justify-between mt-3 text-sm">
              <span className="text-teal-600 font-semibold">Protein</span>
              <span className="text-orange-600 font-semibold">Karbonhidrat</span>
              <span className="text-yellow-600 font-semibold">Yağ</span>
            </div>
          </div>

          {/* Food Recommendations */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-4">💡 Protein İçin Önerilen Besinler</h4>
            <p className="text-sm text-gray-700 mb-4">
              Günlük {results.protein}g protein hedefinize ulaşmak için:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/tavuk-gogsu">
                <a className="text-sm text-green-600 hover:text-green-700 font-semibold">→ Tavuk Göğsü</a>
              </Link>
              <Link href="/yumurta">
                <a className="text-sm text-green-600 hover:text-green-700 font-semibold">→ Yumurta</a>
              </Link>
              <Link href="/yaglik-yogurt">
                <a className="text-sm text-green-600 hover:text-green-700 font-semibold">→ Yoğurt</a>
              </Link>
              <Link href="/mercimek">
                <a className="text-sm text-green-600 hover:text-green-700 font-semibold">→ Mercimek</a>
              </Link>
            </div>
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
