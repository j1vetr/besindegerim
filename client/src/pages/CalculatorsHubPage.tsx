import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Heart, Activity, Droplets, Beef, Scale, TrendingUp, ArrowLeftRight } from "lucide-react";
import { Link } from "wouter";
import type { CategoryGroup } from "@shared/schema";

interface CalculatorsHubPageProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

const calculators = [
  {
    id: "gunluk-kalori-ihtiyaci",
    title: "Günlük Kalori ve Makro Hesaplayıcı",
    description: "BMR, TDEE ve günlük kalori ihtiyacınızı hesaplayın. Protein, karbonhidrat ve yağ dağılımınızı öğrenin.",
    icon: Calculator,
    color: "from-green-500 to-emerald-600",
    popular: true
  },
  {
    id: "bmi",
    title: "Vücut Kitle İndeksi (BMI)",
    description: "Sağlıklı kilo aralığınızı öğrenin. WHO standartlarına göre BMI hesaplama.",
    icon: Scale,
    color: "from-blue-500 to-cyan-600",
    popular: true
  },
  {
    id: "ideal-kilo",
    title: "İdeal Kilo Hesaplayıcı",
    description: "Boyunuza göre ideal kilonuzu hesaplayın. Devine ve Broca formülleriyle.",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    popular: false
  },
  {
    id: "gunluk-su-ihtiyaci",
    title: "Günlük Su İhtiyacı",
    description: "Kilonuza ve aktivite seviyenize göre günlük su ihtiyacınızı hesaplayın.",
    icon: Droplets,
    color: "from-sky-500 to-blue-600",
    popular: false
  },
  {
    id: "protein-gereksinimi",
    title: "Protein Gereksinimi",
    description: "Hedef ve aktivite seviyenize göre günlük protein ihtiyacınızı öğrenin.",
    icon: Beef,
    color: "from-red-500 to-orange-600",
    popular: true
  },
  {
    id: "porsiyon-cevirici",
    title: "Porsiyon Çevirici",
    description: "Gramajı porsiyona, porsiyonu kaşık ve bardağa çevirin. Benzersiz araç!",
    icon: Activity,
    color: "from-purple-500 to-pink-600",
    popular: true
  },
  {
    id: "gida-karsilastirma",
    title: "Gıda Karşılaştırma",
    description: "İki gıdayı yan yana karşılaştırın. Besin değerlerini, radar grafiği ve besin yoğunluğunu görün.",
    icon: ArrowLeftRight,
    color: "from-lime-500 to-green-600",
    popular: true
  },
  {
    id: "kilo-verme-suresi",
    title: "Kilo Verme/Alma Süresi",
    description: "Hedef kilonuza ulaşmanız için gereken süreyi hesaplayın.",
    icon: TrendingUp,
    color: "from-amber-500 to-orange-600",
    popular: false
  }
];

export default function CalculatorsHubPage({ categoryGroups, currentPath }: CalculatorsHubPageProps) {
  const popularCalculators = calculators.filter(c => c.popular);
  const otherCalculators = calculators.filter(c => !c.popular);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 bg-gradient-to-br from-green-50 via-white to-emerald-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white border-2 border-green-200 rounded-full px-4 py-2 mb-6 shadow-sm">
                <Calculator className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-600">8 Ücretsiz Hesaplayıcı</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
                Beslenme Hesaplayıcıları
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Bilimsel formüllerle desteklenen, <span className="text-green-600 font-semibold">gerçek porsiyon bazlı</span> hesaplama araçları. 
                Kalori, makro, su, protein ihtiyacınızı anında öğrenin.
              </p>
            </div>
          </div>
        </section>

        {/* Popular Calculators */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <span className="text-green-600">⭐</span> Popüler Hesaplayıcılar
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularCalculators.map((calc) => (
                <Link key={calc.id} href={`/hesaplayicilar/${calc.id}`}>
                  <Card className="group h-full hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-500/30">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 bg-gradient-to-br ${calc.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                        <calc.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                        {calc.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {calc.description}
                      </p>
                      
                      <div className="mt-6 flex items-center text-green-600 font-semibold group-hover:gap-2 transition-all">
                        <span>Hesapla</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Other Calculators */}
        <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
              Diğer Hesaplayıcılar
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherCalculators.map((calc) => (
                <Link key={calc.id} href={`/hesaplayicilar/${calc.id}`}>
                  <Card className="group h-full hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${calc.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <calc.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                          {calc.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {calc.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-3xl font-black text-gray-900 mb-6">
              Beslenme Hesaplayıcıları Neden Önemli?
            </h2>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Sağlıklı yaşam yolculuğunuzda <strong>doğru bilgi</strong> en önemli silahınızdır. BesinDeğerim.com'un 
              bilimsel hesaplayıcıları, vücut kompozisyonunuzu ve beslenme ihtiyaçlarınızı anlamanıza yardımcı olur.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Hesaplayıcılarımızın Özellikleri</h3>
            
            <ul className="space-y-3 text-gray-700 mb-6">
              <li>✅ <strong>Bilimsel Formüller:</strong> Mifflin-St Jeor, WHO standartları, Devine formülü</li>
              <li>✅ <strong>Gerçek Porsiyon Bazlı:</strong> 266 gıda verimizle entegre</li>
              <li>✅ <strong>Türkçe ve Metrik:</strong> Kilogram, santimetre, Türk mutfağı ölçüleri</li>
              <li>✅ <strong>Detaylı Sonuçlar:</strong> Sadece sayı değil, öneriler ve açıklamalar</li>
              <li>✅ <strong>Gıda Önerileri:</strong> İhtiyaçlarınıza uygun besinler</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Hangi Hesaplayıcıyı Kullanmalıyım?</h3>
            
            <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-6">
              <p className="text-gray-800 font-semibold mb-3">🎯 Yeni Başlıyorsanız:</p>
              <p className="text-gray-700">
                <strong>Günlük Kalori İhtiyacı</strong> hesaplayıcısı ile başlayın. TDEE'nizi öğrenin, 
                ardından <strong>Protein Gereksinimi</strong> ile makrolarınızı optimize edin.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
              <p className="text-gray-800 font-semibold mb-3">💪 Kilo Veriyorsanız:</p>
              <p className="text-gray-700">
                <strong>Kilo Verme Süresi</strong> hesaplayıcısı gerçekçi hedefler koymanızı sağlar. 
                <strong>Porsiyon Çevirici</strong> ile öğünlerinizi kontrol edin.
              </p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-6">
              <p className="text-gray-800 font-semibold mb-3">🏋️ Kas Kazanıyorsanız:</p>
              <p className="text-gray-700">
                <strong>Protein Gereksinimi</strong> (1.8-2.2 g/kg) ve <strong>Günlük Kalori</strong> 
                (fazla) hesaplayıcılarını birlikte kullanın.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
