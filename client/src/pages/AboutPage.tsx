import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Target, Users, Award, TrendingUp, Database, Calculator } from "lucide-react";
import type { CategoryGroup } from "@shared/schema";

interface AboutPageProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

export function AboutPage({ categoryGroups = [], currentPath = "/hakkimizda" }: AboutPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-white via-green-50 to-emerald-50 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-5xl sm:text-6xl font-black mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent" data-testid="text-about-title">
              Hakkımızda
            </h1>
            <p className="text-xl sm:text-2xl text-slate-700 leading-relaxed" data-testid="text-about-subtitle">
              Türkiye'nin en kapsamlı besin değerleri platformu
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-3xl p-8 sm:p-12 shadow-xl shadow-green-500/10">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-10 h-10 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">Misyonumuz</h2>
            </div>
            
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed" data-testid="text-mission-content">
              <p>
                <strong className="text-green-600">besindegerim.com</strong>, sağlıklı beslenme yolculuğunuzda 
                size rehberlik etmek için tasarlanmış, Türkiye'nin en kapsamlı besin değerleri platformudur. 
                Amacımız, herkesin kolayca erişebileceği, güvenilir ve bilimsel verilere dayanan bir kaynak sunmaktır.
              </p>
              
              <p>
                Günümüzde sağlıklı yaşam ve dengeli beslenme her zamankinden daha önemli. Ancak doğru besin değeri 
                bilgisine ulaşmak, özellikle Türkçe kaynaklarda, oldukça zor olabilir. İşte tam bu noktada devreye giriyoruz. 
                Platform olarak, <strong className="text-green-600">gerçek porsiyon bazlı</strong> besin değerleri sunarak, 
                günlük hayatınızda pratik ve anlaşılır bir deneyim yaşatmayı hedefliyoruz.
              </p>

              <p>
                <strong className="text-green-600">266+ gıdanın</strong> detaylı besin değerleri ve 
                <strong className="text-green-600"> 16 farklı hesaplayıcı</strong> aracımızla, 
                kalori takibinden makro hesaplamaya, BMI'dan ideal kilo hesaplamaya kadar geniş bir yelpazede 
                ihtiyaçlarınıza cevap veriyoruz.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stat 1 */}
              <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300 shadow-lg shadow-green-500/10" data-testid="card-stat-foods">
                <Database className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-4xl font-black text-green-600 mb-2">266+</p>
                <p className="text-slate-700 font-semibold">Gıda Verisi</p>
                <p className="text-sm text-slate-600 mt-2">USDA kaynaklı, doğrulanmış besin değerleri</p>
              </div>

              {/* Stat 2 */}
              <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300 shadow-lg shadow-green-500/10" data-testid="card-stat-calculators">
                <Calculator className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-4xl font-black text-green-600 mb-2">16</p>
                <p className="text-slate-700 font-semibold">Hesaplayıcı Araç</p>
                <p className="text-sm text-slate-600 mt-2">BMI, kalori, protein ve daha fazlası</p>
              </div>

              {/* Stat 3 */}
              <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300 shadow-lg shadow-green-500/10" data-testid="card-stat-accuracy">
                <Award className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-4xl font-black text-green-600 mb-2">100%</p>
                <p className="text-slate-700 font-semibold">Doğruluk</p>
                <p className="text-sm text-slate-600 mt-2">Bilimsel kaynaklara dayalı veriler</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">Değerlerimiz</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Value 1 */}
            <div className="bg-white border-2 border-green-200/50 rounded-2xl p-6 hover:border-green-500/50 transition-colors" data-testid="card-value-accuracy">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-xl p-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Doğruluk ve Güvenilirlik</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Tüm verilerimiz USDA FoodData Central gibi güvenilir kaynaklardan alınır ve 
                    düzenli olarak güncellenir. Kullanıcılarımıza yalnızca doğrulanmış bilgiler sunarız.
                  </p>
                </div>
              </div>
            </div>

            {/* Value 2 */}
            <div className="bg-white border-2 border-green-200/50 rounded-2xl p-6 hover:border-green-500/50 transition-colors" data-testid="card-value-science">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-xl p-3">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Bilimsel Yaklaşım</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Beslenme bilimi ve diyetetik prensiplerine bağlı kalarak, güncel araştırmalar 
                    ışığında hesaplayıcılarımızı ve içeriklerimizi geliştiririz.
                  </p>
                </div>
              </div>
            </div>

            {/* Value 3 */}
            <div className="bg-white border-2 border-green-200/50 rounded-2xl p-6 hover:border-green-500/50 transition-colors" data-testid="card-value-userfriendly">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-xl p-3">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Kullanıcı Dostu Deneyim</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Karmaşık besin değeri verilerini anlaşılır, pratik ve kullanımı kolay bir şekilde sunarak, 
                    herkesin faydalanabileceği bir platform oluşturuyoruz.
                  </p>
                </div>
              </div>
            </div>

            {/* Value 4 */}
            <div className="bg-white border-2 border-green-200/50 rounded-2xl p-6 hover:border-green-500/50 transition-colors" data-testid="card-value-transparency">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-xl p-3">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Şeffaflık</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Verilerimizin kaynağını açıkça belirtir, hesaplama yöntemlerimizi paylaşır ve 
                    kullanıcılarımıza tam şeffaflık sağlarız.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why We Built This */}
        <section className="py-16 bg-gradient-to-br from-white via-green-50 to-emerald-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-3xl p-8 sm:p-12 shadow-xl shadow-green-500/10">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Neden Bu Platformu Kurduk?</h2>
              
              <div className="space-y-4 text-lg text-slate-700 leading-relaxed" data-testid="text-why-content">
                <p>
                  Sağlıklı beslenme konusunda bilinçli kararlar almak isteyen birçok kişi, güvenilir ve 
                  Türkçe besin değeri bilgisine ulaşmakta zorlanıyordu. Çoğu kaynak, ya yabancı dilde 
                  ya da yeterince detaylı değildi.
                </p>
                
                <p>
                  Biz de bu eksikliği gidermek ve herkes için <strong className="text-green-600">ücretsiz</strong>, 
                  <strong className="text-green-600"> doğru</strong> ve 
                  <strong className="text-green-600"> kullanışlı</strong> bir besin değerleri platformu 
                  oluşturmak istedik. Özellikle gerçek porsiyon ölçülerini (1 adet domates, 1 yumurta gibi) 
                  baz alarak, günlük hayatta pratik kullanım sağlamayı hedefledik.
                </p>

                <p>
                  <strong className="text-green-600">besindegerim.com</strong>, sadece bir veri tabanı değil; 
                  aynı zamanda sağlıklı yaşam yolculuğunuzda yanınızda olan, size rehberlik eden bir yardımcıdır. 
                  Her gün daha fazla gıda ekleyerek, yeni hesaplayıcılar geliştirerek ve kullanıcı geri bildirimlerini 
                  dikkate alarak platformumuzu sürekli geliştiriyoruz.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Hadi Başlayalım!</h2>
          <p className="text-lg text-slate-700 mb-8">
            Besin değerlerini keşfedin, hesaplayıcılarımızı kullanın ve sağlıklı yaşam yolculuğunuza bugün başlayın.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/tum-gidalar" 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300"
              data-testid="button-explore-foods"
            >
              Gıdaları Keşfet
            </a>
            
            <a 
              href="/hesaplayicilar" 
              className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300"
              data-testid="button-explore-calculators"
            >
              Hesaplayıcılar
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default AboutPage;
