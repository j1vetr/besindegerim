import React from "react";
import { useQuery } from "@tanstack/react-query";
import { type Food, type CategoryGroup } from "@shared/schema";
import { FoodCard } from "@/components/FoodCard";
import { SearchForm } from "@/components/SearchForm";
import { SearchAutocomplete } from "@/components/SearchAutocomplete";
import { ClientOnly } from "@/components/ClientOnly";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Database, TrendingUp, Sparkles, Zap, HelpCircle, ChevronDown, Apple, Cookie, Beef, Fish, Milk, Carrot, Salad, Pizza } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface HomePageProps {
  categoryGroups?: CategoryGroup[];
  popularFoods?: Food[];
  currentPath?: string;
}

const faqData = [
  {
    id: "1",
    question: "besindegerim.com nedir?",
    answer: "besindegerim.com, Türkiye'nin en kapsamlı besin değerleri platformudur. 266+ gıdanın gerçek porsiyon bazlı kalori, protein, karbonhidrat, yağ ve vitamin/mineral değerlerini sunar. Bilimsel kaynaklardan alınan güvenilir verilerle desteklenir. Ücretsiz hesaplayıcılar (BMI, kalori, protein, makro dağılımı) ve detaylı besin analizleri sağlar."
  },
  {
    id: "2",
    question: "Besin değerleri doğru mu?",
    answer: "Evet, tüm besin değerleri uluslararası kabul görmüş bilimsel veritabanlarından alınır. Laboratuvar analizleri ve bilimsel çalışmalarla doğrulanmış, dünya çapında güvenilir kaynaklardır. Veriler düzenli olarak güncellenir ve 20+ vitamin/mineral içerir. Platform üzerindeki her besin için detaylı makro ve mikro besin öğesi bilgisi bulunur."
  },
  {
    id: "3",
    question: "Platformu nasıl kullanırım?",
    answer: "Ana sayfadaki arama kutusuna gıda adını yazın (örn: elma, tavuk). Arama sonuçlarından istediğiniz gıdayı seçin. Detay sayfasında porsiyon başına kalori, protein, karbonhidrat, yağ ve 20+ vitamin/mineral değerlerini görürsünüz. Hesaplayıcılar menüsünden BMI, kalori, protein gibi hesaplamalar yapabilirsiniz."
  },
  {
    id: "4",
    question: "Hesaplayıcılar ücretsiz mi?",
    answer: "Evet, tüm hesaplayıcılar tamamen ücretsizdir. BMI hesaplayıcı, günlük kalori ihtiyacı (BMR/TDEE), protein gereksinimi, su ihtiyacı, ideal kilo, porsiyon çevirici ve kilo verme süresi hesaplayıcılarını ücretsiz kullanabilirsiniz. Kayıt veya ödeme gerektirmez."
  },
  {
    id: "5",
    question: "BMI nedir, nasıl hesaplanır?",
    answer: "BMI (Vücut Kitle İndeksi), kilo ve boy oranınızı değerlendirir. Formül: Kilo (kg) / Boy (m)². Örnek: 70 kg, 1.75 m → BMI = 70/(1.75²) = 22.9. Değerlendirme: Zayıf <18.5, Normal 18.5-24.9, Fazla Kilolu 25-29.9, Obez ≥30. WHO standartlarına göre sağlık riskini gösterir."
  },
  {
    id: "6",
    question: "Günlük kalori ihtiyacım nedir?",
    answer: "Günlük kalori ihtiyacınız TDEE (Toplam Günlük Enerji Harcaması) ile hesaplanır. Önce BMR (Bazal Metabolizma Hızı) bulunur: erkekler için (10×kilo) + (6.25×boy cm) - (5×yaş) + 5, kadınlar için -161. BMR × aktivite faktörü (hareketsiz 1.2, orta aktif 1.55, çok aktif 1.9) = TDEE. Örnek: BMR 1650, orta aktif → 1650×1.55 = 2558 kcal."
  }
];

export default function HomePage({ 
  categoryGroups = [], 
  popularFoods = [],
  currentPath = "/"
}: HomePageProps) {
  const { data: foodsData, isLoading: isFetching } = useQuery<{ items: Food[] }>({
    queryKey: ['/api/foods'],
    enabled: popularFoods.length === 0,
  });

  const displayFoods = popularFoods.length > 0 ? popularFoods : (foodsData?.items || []).slice(0, 8);
  const isLoading = popularFoods.length === 0 && isFetching;

  return (
    <div className="min-h-screen bg-white">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      <main>
        {/* Hero Section - Floating Food Icons Background */}
        <section className="relative py-8 md:py-12 flex items-center justify-center overflow-hidden bg-white">
          {/* Floating Food Icons - Animated */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Apple - Top Left */}
            <div className="absolute top-20 left-[10%] animate-float-slow">
              <Apple className="w-16 h-16 md:w-24 md:h-24 text-red-400/30" strokeWidth={1.5} />
            </div>
            
            {/* Carrot - Top Right */}
            <div className="absolute top-32 right-[15%] animate-float-slower">
              <Carrot className="w-12 h-12 md:w-20 md:h-20 text-orange-400/30" strokeWidth={1.5} />
            </div>
            
            {/* Pizza - Middle Left */}
            <div className="absolute top-[40%] left-[5%] animate-float-medium">
              <Pizza className="w-14 h-14 md:w-22 md:h-22 text-yellow-500/30" strokeWidth={1.5} />
            </div>
            
            {/* Fish - Middle Right */}
            <div className="absolute top-[45%] right-[8%] animate-float-slow">
              <Fish className="w-16 h-16 md:w-24 md:h-24 text-blue-400/30" strokeWidth={1.5} />
            </div>
            
            {/* Milk - Bottom Left */}
            <div className="absolute bottom-24 left-[12%] animate-float-slower">
              <Milk className="w-12 h-12 md:w-18 md:h-18 text-slate-400/30" strokeWidth={1.5} />
            </div>
            
            {/* Cookie - Bottom Right */}
            <div className="absolute bottom-32 right-[20%] animate-float-medium">
              <Cookie className="w-14 h-14 md:w-20 md:h-20 text-amber-500/30" strokeWidth={1.5} />
            </div>
            
            {/* Beef - Top Center */}
            <div className="absolute top-16 left-[50%] -translate-x-1/2 animate-float-slow">
              <Beef className="w-10 h-10 md:w-16 md:h-16 text-red-500/30" strokeWidth={1.5} />
            </div>
            
            {/* Salad - Bottom Center */}
            <div className="absolute bottom-20 left-[45%] animate-float-slower">
              <Salad className="w-12 h-12 md:w-20 md:h-20 text-green-500/30" strokeWidth={1.5} />
            </div>

            {/* Green Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 via-transparent to-emerald-50/40 pointer-events-none"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8 text-center">
            {/* Floating Badge */}
            <div className="inline-flex items-center gap-2 backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-full px-6 py-3 mb-8 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-500">
              <Sparkles className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Türkiye'nin Gelecekteki Beslenme Platformu
              </span>
            </div>

            {/* Main Heading with Green Gradient */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 py-4 leading-[1.2] tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Besin Değerleri
            </h1>

            <p className="text-lg md:text-2xl text-slate-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              Gerçek porsiyon bazlı kalori ve besin değerleri. 
              <span className="text-green-600 font-semibold"> Bilimsel verilerle</span> desteklenen, 
              <span className="text-emerald-600 font-semibold"> vitamin ve minerallerle</span> zenginleştirilmiş platform.
            </p>

            {/* Glassmorphic Search Form with AJAX Autocomplete */}
            <div className="relative z-[100] max-w-2xl mx-auto mb-16">
              <div className="backdrop-blur-2xl bg-white/70 rounded-3xl p-2 border-2 border-green-200/50 shadow-2xl shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-500">
                <ClientOnly fallback={<SearchForm />}>
                  <SearchAutocomplete />
                </ClientOnly>
              </div>
            </div>

            {/* Stats Grid - Futuristic Glass Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
              <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-2xl p-6 hover:bg-white/90 hover:border-green-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-green-500/10 group" data-testid="stat-pill-0">
                <Database className="w-10 h-10 mx-auto mb-3 text-green-500 group-hover:scale-110 transition-transform" />
                <p className="text-base md:text-lg font-bold text-slate-900">266 Gıda</p>
              </div>
              
              <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-2xl p-6 hover:bg-white/90 hover:border-green-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-green-500/10 group" data-testid="stat-pill-1">
                <TrendingUp className="w-10 h-10 mx-auto mb-3 text-emerald-500 group-hover:scale-110 transition-transform" />
                <p className="text-base md:text-lg font-bold text-slate-900">Gerçek Porsiyon</p>
              </div>
              
              <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-2xl p-6 hover:bg-white/90 hover:border-green-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-green-500/10 group" data-testid="stat-pill-2">
                <Zap className="w-10 h-10 mx-auto mb-3 text-green-600 group-hover:scale-110 transition-transform" />
                <p className="text-base md:text-lg font-bold text-slate-900">16 Hesaplayıcı</p>
              </div>
              
              <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-2xl p-6 hover:bg-white/90 hover:border-green-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-green-500/10 group" data-testid="stat-pill-3">
                <Sparkles className="w-10 h-10 mx-auto mb-3 text-emerald-600 group-hover:scale-110 transition-transform" />
                <p className="text-base md:text-lg font-bold text-slate-900">Vitamin & Mineral</p>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative Divider */}
        <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"></div>

        {/* Popular Foods Section - Medium Green Tone */}
        <section className="relative py-12 md:py-16 bg-gradient-to-b from-green-200 via-emerald-100 to-green-100 overflow-hidden border-t-4 border-green-400">
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-gradient-to-r from-transparent to-green-500 rounded-full"></div>
                <Sparkles className="w-6 h-6 text-green-500" />
                <div className="h-1 w-12 bg-gradient-to-l from-transparent to-green-500 rounded-full"></div>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Popüler Gıdalar
              </h2>
              
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                En çok aranan besin değerlerini keşfedin
              </p>

              {/* Green Accent Line */}
              <div className="mt-6 mx-auto w-24 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full shadow-lg shadow-green-500/50"></div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border-2 border-green-200/50 rounded-3xl h-96 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <>
                {/* Food Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayFoods.map((food) => (
                    <FoodCard key={food.id} food={food} />
                  ))}
                </div>

                {/* View All CTA */}
                <div className="text-center mt-16">
                  <a
                    href="/tum-gidalar"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-500 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 hover:scale-105"
                    data-testid="link-view-all"
                  >
                    <span>Tüm Gıdaları Keşfet</span>
                    <TrendingUp className="w-5 h-5" />
                  </a>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Decorative Divider */}
        <div className="h-2 bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600"></div>

        {/* Calculators Section - Futuristic Glass Design */}
        <section className="relative py-12 md:py-16 bg-gradient-to-b from-emerald-100 via-teal-50 to-cyan-50 overflow-hidden border-t-4 border-emerald-400">
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-gradient-to-r from-transparent to-emerald-500 rounded-full"></div>
                <Zap className="w-6 h-6 text-emerald-500" />
                <div className="h-1 w-12 bg-gradient-to-l from-transparent to-emerald-500 rounded-full"></div>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Ücretsiz Hesaplayıcılar
              </h2>
              
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                16 bilimsel hesaplayıcı ile beslenme ve fitness hedeflerinize ulaşın
              </p>

              {/* Emerald Accent Line */}
              <div className="mt-6 mx-auto w-24 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-full shadow-lg shadow-emerald-500/50"></div>
            </div>

            {/* Calculators Grid - 8 Featured */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Daily Calorie Calculator */}
              <a
                href="/hesaplayici/gunluk-kalori-ihtiyaci"
                className="group backdrop-blur-xl bg-white/80 border-2 border-emerald-200/50 rounded-3xl p-6 hover:bg-white/95 hover:border-emerald-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/30"
                data-testid="calc-card-gunluk-kalori"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Günlük Kalori İhtiyacı</h3>
                  <p className="text-sm text-slate-600">BMR, TDEE ve makro hesaplama</p>
                </div>
              </a>

              {/* BMI Calculator */}
              <a
                href="/hesaplayici/bmi"
                className="group backdrop-blur-xl bg-white/80 border-2 border-blue-200/50 rounded-3xl p-6 hover:bg-white/95 hover:border-blue-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/30"
                data-testid="calc-card-bmi"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">BMI Hesaplayıcı</h3>
                  <p className="text-sm text-slate-600">Sağlıklı kilo aralığınız</p>
                </div>
              </a>

              {/* Protein Calculator */}
              <a
                href="/hesaplayici/protein-gereksinimi"
                className="group backdrop-blur-xl bg-white/80 border-2 border-red-200/50 rounded-3xl p-6 hover:bg-white/95 hover:border-red-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-red-500/10 hover:shadow-xl hover:shadow-red-500/30"
                data-testid="calc-card-protein"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Beef className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Protein Gereksinimi</h3>
                  <p className="text-sm text-slate-600">Günlük protein hedefi</p>
                </div>
              </a>

              {/* Water Intake Calculator */}
              <a
                href="/hesaplayici/gunluk-su-ihtiyaci"
                className="group backdrop-blur-xl bg-white/80 border-2 border-sky-200/50 rounded-3xl p-6 hover:bg-white/95 hover:border-sky-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-sky-500/10 hover:shadow-xl hover:shadow-sky-500/30"
                data-testid="calc-card-water"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <HelpCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Su İhtiyacı</h3>
                  <p className="text-sm text-slate-600">Günlük su tüketimi</p>
                </div>
              </a>

              {/* Body Fat Calculator */}
              <a
                href="/hesaplayici/vucut-yag-yuzde"
                className="group backdrop-blur-xl bg-white/80 border-2 border-purple-200/50 rounded-3xl p-6 hover:bg-white/95 hover:border-purple-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/30"
                data-testid="calc-card-bodyfat"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Vücut Yağ Yüzdesi</h3>
                  <p className="text-sm text-slate-600">Navy Method ile hesaplama</p>
                </div>
              </a>

              {/* Macro Calculator */}
              <a
                href="/hesaplayici/makro-hesaplayici"
                className="group backdrop-blur-xl bg-white/80 border-2 border-teal-200/50 rounded-3xl p-6 hover:bg-white/95 hover:border-teal-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-teal-500/10 hover:shadow-xl hover:shadow-teal-500/30"
                data-testid="calc-card-macro"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Pizza className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Makro Dağılımı</h3>
                  <p className="text-sm text-slate-600">Optimal protein/karb/yağ</p>
                </div>
              </a>

              {/* Calorie Burn Calculator */}
              <a
                href="/hesaplayici/kalori-yakma"
                className="group backdrop-blur-xl bg-white/80 border-2 border-amber-200/50 rounded-3xl p-6 hover:bg-white/95 hover:border-amber-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-amber-500/10 hover:shadow-xl hover:shadow-amber-500/30"
                data-testid="calc-card-burn"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Kalori Yakma</h3>
                  <p className="text-sm text-slate-600">25+ egzersiz türü</p>
                </div>
              </a>

              {/* Food Comparison */}
              <a
                href="/hesaplayici/gida-karsilastirma"
                className="group backdrop-blur-xl bg-white/80 border-2 border-lime-200/50 rounded-3xl p-6 hover:bg-white/95 hover:border-lime-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-lime-500/10 hover:shadow-xl hover:shadow-lime-500/30"
                data-testid="calc-card-compare"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lime-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Salad className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Gıda Karşılaştırma</h3>
                  <p className="text-sm text-slate-600">İki gıdayı yan yana incele</p>
                </div>
              </a>
            </div>

            {/* View All Calculators CTA */}
            <div className="text-center mt-16">
              <a
                href="/hesaplayicilar"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-500 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50 hover:scale-105"
                data-testid="link-all-calculators"
              >
                <span>Tüm Hesaplayıcıları Gör (16 Araç)</span>
                <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
              </a>
            </div>
          </div>
        </section>

        {/* Decorative Divider */}
        <div className="h-2 bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-600"></div>

        {/* FAQ Section - SEO Optimized */}
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-white via-green-50/30 to-emerald-50/30 overflow-hidden border-t-4 border-emerald-500">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            {/* Section Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-gradient-to-r from-transparent to-green-500 rounded-full"></div>
                <HelpCircle className="w-8 h-8 text-green-500" />
                <div className="h-1 w-12 bg-gradient-to-l from-transparent to-green-500 rounded-full"></div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Sıkça Sorulan Sorular
              </h2>
              
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Besin değerleri, kalori hesaplama ve platform kullanımı hakkında merak ettikleriniz
              </p>

              {/* Green Accent Line */}
              <div className="mt-6 mx-auto w-24 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full shadow-lg shadow-green-500/50"></div>
            </div>

            {/* FAQ Accordion */}
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((faq, index) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id}
                  className="backdrop-blur-xl bg-white/80 border-2 border-green-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:border-green-500/50 transition-all duration-300"
                  data-testid={`faq-item-${index + 1}`}
                >
                  <AccordionTrigger className="px-6 py-5 hover:bg-green-50/50 transition-colors text-left hover:no-underline">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3 pr-4">
                      <ChevronDown className="w-5 h-5 text-green-500 shrink-0" />
                      {faq.question}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 text-slate-700 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* CTA Section */}
            <div className="text-center mt-16">
              <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-3xl p-8 shadow-2xl shadow-green-500/20">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Başka sorunuz mu var?
                </h3>
                <p className="text-slate-600 mb-6">
                  Bizimle iletişime geçmekten çekinmeyin
                </p>
                <a
                  href="/iletisim"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-500 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 hover:scale-105"
                  data-testid="link-contact"
                >
                  <span>İletişime Geç</span>
                  <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                </a>
              </div>
            </div>
          </div>

          {/* FAQ Schema for SEO */}
          <script 
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqData.map(faq => ({
                  "@type": "Question",
                  "name": faq.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                  }
                }))
              })
            }}
          />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
