import React from "react";
import { type Food } from "@shared/schema";
import { FoodCard } from "@/components/FoodCard";
import { SearchForm } from "@/components/SearchForm";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Database, TrendingUp, Sparkles, Zap, HelpCircle, ChevronRight } from "lucide-react";

interface HomePageProps {
  categories?: string[];
  popularFoods?: Food[];
  currentPath?: string;
}

export default function HomePage({ 
  categories = [], 
  popularFoods = [],
  currentPath = "/"
}: HomePageProps = {}) {
  const isLoading = false;

  return (
    <div className="min-h-screen bg-white">
      <Header categories={categories} currentPath={currentPath} />
      
      <main>
        {/* Hero Section - Light Futuristic with Green */}
        <section className="relative py-20 md:py-32 flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-green-50 to-emerald-50">
          {/* Animated Background Orbs */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-300/10 rounded-full blur-3xl"></div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-20 text-center">
            {/* Floating Badge */}
            <div className="inline-flex items-center gap-2 backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-full px-6 py-3 mb-8 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-500">
              <Sparkles className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Türkiye'nin Gelecekteki Beslenme Platformu
              </span>
            </div>

            {/* Main Heading with Green Gradient */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-2xl">
              Besin Değerleri
            </h1>

            <p className="text-lg md:text-2xl text-slate-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              Gerçek porsiyon bazlı kalori ve besin değerleri. 
              <span className="text-green-600 font-semibold"> USDA verisiyle</span> desteklenen, 
              <span className="text-emerald-600 font-semibold"> vitamin ve minerallerle</span> zenginleştirilmiş platform.
            </p>

            {/* Glassmorphic Search Form */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="backdrop-blur-2xl bg-white/70 rounded-3xl p-2 border-2 border-green-200/50 shadow-2xl shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-500">
                <SearchForm />
              </div>
            </div>

            {/* Stats Grid - Futuristic Glass Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
              <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-2xl p-6 hover:bg-white/90 hover:border-green-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-green-500/10 group" data-testid="stat-pill-0">
                <Database className="w-10 h-10 mx-auto mb-3 text-green-500 group-hover:scale-110 transition-transform" />
                <p className="text-base md:text-lg font-bold text-slate-900">98+ Gıda</p>
              </div>
              
              <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-2xl p-6 hover:bg-white/90 hover:border-green-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-green-500/10 group" data-testid="stat-pill-1">
                <TrendingUp className="w-10 h-10 mx-auto mb-3 text-emerald-500 group-hover:scale-110 transition-transform" />
                <p className="text-base md:text-lg font-bold text-slate-900">Gerçek Porsiyon</p>
              </div>
              
              <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-2xl p-6 hover:bg-white/90 hover:border-green-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-green-500/10 group" data-testid="stat-pill-2">
                <Zap className="w-10 h-10 mx-auto mb-3 text-green-600 group-hover:scale-110 transition-transform" />
                <p className="text-base md:text-lg font-bold text-slate-900">USDA Verisi</p>
              </div>
              
              <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-2xl p-6 hover:bg-white/90 hover:border-green-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-green-500/10 group" data-testid="stat-pill-3">
                <Sparkles className="w-10 h-10 mx-auto mb-3 text-emerald-600 group-hover:scale-110 transition-transform" />
                <p className="text-base md:text-lg font-bold text-slate-900">Vitamin & Mineral</p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Foods Section - Light with Green Accents */}
        <section className="relative py-12 md:py-16 bg-gradient-to-b from-green-50 to-white overflow-hidden">
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
                  {popularFoods.map((food) => (
                    <FoodCard key={food.id} food={food} />
                  ))}
                </div>

                {/* View All CTA */}
                <div className="text-center mt-16">
                  <a
                    href="/kategori/sebzeler"
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

        {/* FAQ Section - SEO Optimized */}
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-white to-green-50 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            {/* Section Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <HelpCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Sıkça Sorulan Sorular
              </h2>
              <p className="text-lg text-slate-600">
                Besin değerleri hakkında merak ettikleriniz
              </p>
            </div>

            {/* FAQ Items - Accordion Style */}
            <div className="space-y-4">
              {/* FAQ 1 */}
              <details className="group backdrop-blur-xl bg-white/80 border-2 border-green-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300" data-testid="faq-item-1">
                <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-green-50/50 transition-colors">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                    <ChevronRight className="w-5 h-5 text-green-500 group-open:rotate-90 transition-transform" />
                    Besin değerleri nereden geliyor?
                  </h3>
                </summary>
                <div className="px-6 pb-6 text-slate-700 leading-relaxed">
                  Tüm besin değerleri, Amerika Tarım Bakanlığı'nın (USDA) FoodData Central veritabanından alınmaktadır. 
                  Bu, dünyanın en kapsamlı ve bilimsel olarak doğrulanmış besin değerleri kaynağıdır. 
                  Veriler düzenli olarak güncellenir ve vitamin, mineral gibi mikrobesinleri de içerir.
                </div>
              </details>

              {/* FAQ 2 */}
              <details className="group backdrop-blur-xl bg-white/80 border-2 border-green-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300" data-testid="faq-item-2">
                <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-green-50/50 transition-colors">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                    <ChevronRight className="w-5 h-5 text-green-500 group-open:rotate-90 transition-transform" />
                    Gerçek porsiyon ne demek?
                  </h3>
                </summary>
                <div className="px-6 pb-6 text-slate-700 leading-relaxed">
                  Diğer sitelerden farklı olarak, 100g bazlı değil gerçek porsiyon bazlı kalori gösteriyoruz. 
                  Örneğin "1 orta domates = 22 kcal" veya "1 dilim ekmek = 66 kcal" şeklinde. 
                  Bu sayede günlük hayatta daha kolay hesaplama yapabilirsiniz.
                </div>
              </details>

              {/* FAQ 3 */}
              <details className="group backdrop-blur-xl bg-white/80 border-2 border-green-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300" data-testid="faq-item-3">
                <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-green-50/50 transition-colors">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                    <ChevronRight className="w-5 h-5 text-green-500 group-open:rotate-90 transition-transform" />
                    Hangi besin değerleri gösteriliyor?
                  </h3>
                </summary>
                <div className="px-6 pb-6 text-slate-700 leading-relaxed">
                  Her gıda için kalori, protein, karbonhidrat, yağ, lif ve şeker gibi makro besinleri gösteriyoruz. 
                  Ayrıca A vitamini, C vitamini, demir, kalsiyum gibi 20+ vitamin ve mineral değerlerini de sunuyoruz. 
                  Tüm değerler porsiyon başına hesaplanmıştır.
                </div>
              </details>

              {/* FAQ 4 */}
              <details className="group backdrop-blur-xl bg-white/80 border-2 border-green-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300" data-testid="faq-item-4">
                <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-green-50/50 transition-colors">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                    <ChevronRight className="w-5 h-5 text-green-500 group-open:rotate-90 transition-transform" />
                    Veriler güvenilir mi?
                  </h3>
                </summary>
                <div className="px-6 pb-6 text-slate-700 leading-relaxed">
                  Evet, tüm veriler USDA FoodData Central'dan alındığı için %100 güvenilirdir. 
                  Bu veritabanı, laboratuvar analizleri ve bilimsel çalışmalarla desteklenen, 
                  dünya çapında kabul görmüş bir kaynaktır. Ancak, bireysel sağlık kararları için 
                  mutlaka bir sağlık profesyoneline danışmanız önerilir.
                </div>
              </details>

              {/* FAQ 5 */}
              <details className="group backdrop-blur-xl bg-white/80 border-2 border-green-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300" data-testid="faq-item-5">
                <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-green-50/50 transition-colors">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                    <ChevronRight className="w-5 h-5 text-green-500 group-open:rotate-90 transition-transform" />
                    Yeni gıdalar nasıl ekleniyor?
                  </h3>
                </summary>
                <div className="px-6 pb-6 text-slate-700 leading-relaxed">
                  Platformumuz sürekli genişlemektedir. Türkiye'de yaygın tüketilen gıdaları önceliklendirerek, 
                  USDA veritabanından Türkçe karşılıklarını bulup ekliyoruz. Pexels'ten profesyonel görseller 
                  kullanarak her gıdayı görsel olarak da zenginleştiriyoruz. Öneri için bizimle iletişime geçebilirsiniz.
                </div>
              </details>
            </div>

            {/* FAQ Schema for SEO */}
            <script 
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "Besin değerleri nereden geliyor?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Tüm besin değerleri, Amerika Tarım Bakanlığı'nın (USDA) FoodData Central veritabanından alınmaktadır. Bu, dünyanın en kapsamlı ve bilimsel olarak doğrulanmış besin değerleri kaynağıdır."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Gerçek porsiyon ne demek?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Diğer sitelerden farklı olarak, 100g bazlı değil gerçek porsiyon bazlı kalori gösteriyoruz. Örneğin '1 orta domates = 22 kcal' veya '1 dilim ekmek = 66 kcal' şeklinde."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Hangi besin değerleri gösteriliyor?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Her gıda için kalori, protein, karbonhidrat, yağ, lif ve şeker gibi makro besinleri gösteriyoruz. Ayrıca A vitamini, C vitamini, demir, kalsiyum gibi 20+ vitamin ve mineral değerlerini de sunuyoruz."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Veriler güvenilir mi?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Evet, tüm veriler USDA FoodData Central'dan alındığı için %100 güvenilirdir. Bu veritabanı, laboratuvar analizleri ve bilimsel çalışmalarla desteklenen, dünya çapında kabul görmüş bir kaynaktır."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Yeni gıdalar nasıl ekleniyor?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Platformumuz sürekli genişlemektedir. Türkiye'de yaygın tüketilen gıdaları önceliklendirerek, USDA veritabanından Türkçe karşılıklarını bulup ekliyoruz."
                      }
                    }
                  ]
                })
              }}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
