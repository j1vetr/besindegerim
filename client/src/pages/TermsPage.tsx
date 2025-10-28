import { useQuery } from "@tanstack/react-query";
import type { CategoryGroup } from "@shared/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileCheck, AlertCircle, Copyright, Ban, RefreshCw, Scale } from "lucide-react";

interface TermsPageProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

export function TermsPage(props?: TermsPageProps) {
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({
    queryKey: ["/api/category-groups"],
    enabled: !props?.categoryGroups,
  });

  const groups = props?.categoryGroups || categoryGroups;
  const currentPath = props?.currentPath || "/kullanim-kosullari";

  return (
    <div className="min-h-screen flex flex-col">
      <Header categoryGroups={groups} currentPath={currentPath} />
      
      <main className="flex-1 bg-gradient-to-br from-white via-green-50/30 to-white">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-6">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" data-testid="text-page-title">
              Kullanım Koşulları
            </h1>
            <p className="text-lg text-slate-600">
              Son güncelleme: 15 Ekim 2025
            </p>
          </div>

          {/* Introduction */}
          <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-3xl p-8 mb-8 shadow-lg shadow-green-500/10">
            <p className="text-slate-700 leading-relaxed mb-4">
              besindegerim.com web sitesine hoş geldiniz. Bu Kullanım Koşulları, sitemizi kullanımınızı düzenleyen yasal 
              bir sözleşmedir. Sitemize erişerek veya kullanarak, bu koşulları okuduğunuzu, anladığınızı ve kabul ettiğinizi 
              beyan edersiniz.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Bu koşulları kabul etmiyorsanız, lütfen sitemizi kullanmayınız. Bu sayfa üzerinden sunulan besin değeri bilgileri, 
              hesaplayıcılar ve diğer tüm hizmetler bu koşullara tabidir.
            </p>
          </div>

          {/* Section 1: Kabul ve Onay */}
          <section className="mb-10" data-testid="section-acceptance">
            <div className="flex items-center gap-3 mb-6">
              <FileCheck className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                1. Koşulların Kabulü
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed">
                besindegerim.com'u ziyaret ettiğinizde, aşağıdaki hususları kabul etmiş sayılırsınız:
              </p>
              <ul className="space-y-3 text-slate-700">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">•</span>
                  <span>Bu Kullanım Koşulları'nı ve Gizlilik Politikamızı okuduğunuzu ve kabul ettiğinizi</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">•</span>
                  <span>Yasal olarak bu koşullara uymayı taahhüt edebilecek yaşta ve yetkinlikte olduğunuzu</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">•</span>
                  <span>Türkiye Cumhuriyeti yasalarına ve bulunduğunuz ülkenin yasalarına uygun hareket edeceğinizi</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">•</span>
                  <span>Web sitesini yalnızca yasal ve meşru amaçlarla kullanacağınızı</span>
                </li>
              </ul>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                <p className="text-sm text-slate-700">
                  <strong>Önemli:</strong> 18 yaşından küçükseniz, bu siteyi ebeveyn veya vasi gözetiminiz altında kullanmalısınız.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Hizmet Tanımı */}
          <section className="mb-10" data-testid="section-service">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                2. Hizmet Tanımı ve Kullanım Amacı
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed">
                besindegerim.com, kullanıcılarına aşağıdaki hizmetleri sunar:
              </p>
              <div className="space-y-3">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">📊 Besin Değeri Bilgileri</h3>
                  <p className="text-sm text-slate-700">
                    Çeşitli gıda maddelerinin kalori, protein, karbonhidrat, yağ ve diğer besin değerlerini içeren bilgiler. 
                    Veriler USDA FoodData Central ve diğer güvenilir kaynaklardan alınmıştır.
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                  <h3 className="font-semibold text-emerald-900 mb-2">🧮 Sağlık Hesaplayıcıları</h3>
                  <p className="text-sm text-slate-700">
                    BMI hesaplama, günlük kalori ihtiyacı, protein gereksinimi, su ihtiyacı ve benzeri hesaplama araçları. 
                    Bu araçlar genel bilgilendirme amaçlıdır.
                  </p>
                </div>
                <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                  <h3 className="font-semibold text-teal-900 mb-2">🔍 Arama ve Karşılaştırma</h3>
                  <p className="text-sm text-slate-700">
                    Besin değerlerini arama, kategorilere göre listeleme ve karşılaştırma özellikleri.
                  </p>
                </div>
              </div>
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5 mt-6">
                <p className="text-sm font-bold text-red-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  SORUMLULUK REDDİ - MÜTHİŞ ÖNEMLİ
                </p>
                <p className="text-sm text-red-800 leading-relaxed">
                  Bu web sitesinde sunulan tüm bilgiler <strong>sadece genel bilgilendirme amaçlıdır</strong> ve 
                  hiçbir şekilde tıbbi tavsiye, teşhis veya tedavi yerine geçmez. Sağlık durumunuz, diyet planınız 
                  veya beslenme alışkanlıklarınız hakkında karar vermeden önce <strong>mutlaka bir diyetisyen, 
                  beslenme uzmanı veya sağlık profesyoneline danışınız</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Kullanıcı Sorumlulukları */}
          <section className="mb-10" data-testid="section-responsibilities">
            <div className="flex items-center gap-3 mb-6">
              <Ban className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                3. Kullanıcı Sorumlulukları ve Yasaklar
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed mb-4">
                Web sitemizi kullanırken aşağıdaki faaliyetleri <strong>kesinlikle yapmamanız</strong> gerekmektedir:
              </p>
              <div className="space-y-3">
                <div className="pl-4 border-l-4 border-red-500 py-2">
                  <h3 className="font-semibold text-slate-900 mb-2">❌ Yasal İhlaller:</h3>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Herhangi bir yasayı, yönetmeliği veya üçüncü taraf haklarını ihlal eden kullanım</li>
                    <li>• Yasa dışı, zararlı, tehdit edici, taciz edici, kötüye kullanan içerik paylaşmak</li>
                    <li>• Yanıltıcı veya sahte kimlik bilgileriyle erişim sağlamak</li>
                  </ul>
                </div>
                <div className="pl-4 border-l-4 border-red-500 py-2">
                  <h3 className="font-semibold text-slate-900 mb-2">❌ Teknik İhlaller:</h3>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Siteye zarar verebilecek virüs, truva atı, solucan veya zararlı kod yüklemek</li>
                    <li>• Otomatik sistemler (bot, scraper, crawler) kullanarak veri toplamak</li>
                    <li>• Güvenlik önlemlerini aşmaya veya bypass etmeye çalışmak</li>
                    <li>• Aşırı yük oluşturacak şekilde site kaynaklarını tüketmek (DDoS vb.)</li>
                  </ul>
                </div>
                <div className="pl-4 border-l-4 border-red-500 py-2">
                  <h3 className="font-semibold text-slate-900 mb-2">❌ İçerik İhlalleri:</h3>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Site içeriğini izinsiz kopyalamak, çoğaltmak veya dağıtmak</li>
                    <li>• Ticari amaçlarla izinsiz kullanım (içerik satışı vb.)</li>
                    <li>• Telif haklarını ihlal edecek şekilde içeriği değiştirmek veya türev eserler oluşturmak</li>
                  </ul>
                </div>
              </div>
              <div className="bg-slate-900 text-white rounded-xl p-5 mt-6">
                <p className="text-sm font-semibold mb-2">⚠️ İhlal Durumunda:</p>
                <p className="text-sm leading-relaxed">
                  Bu kuralları ihlal etmeniz durumunda, hesabınızın askıya alınması, site erişiminizin engellenmesi 
                  ve yasal işlem başlatılması dahil olmak üzere her türlü önlemi alma hakkımız saklıdır.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Fikri Mülkiyet */}
          <section className="mb-10" data-testid="section-intellectual-property">
            <div className="flex items-center gap-3 mb-6">
              <Copyright className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                4. Fikri Mülkiyet Hakları
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed">
                besindegerim.com web sitesindeki tüm içerik, materyal ve fikri mülkiyet hakları korunmaktadır:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">© Telif Hakları</h3>
                  <p className="text-sm text-slate-700">
                    Site tasarımı, logo, grafikler, metin içerikleri, yazılım kodu ve veritabanı yapısı telif hakları ile korunmaktadır.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-2">™ Marka Hakları</h3>
                  <p className="text-sm text-slate-700">
                    "besindegerim.com" markası ve logosu, yasal olarak korunmakta olup izinsiz kullanımı yasaktır.
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-5 mt-4">
                <h3 className="font-semibold text-slate-900 mb-3">İzin Verilen Kullanım:</h3>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li className="flex gap-2">
                    <span className="text-green-600 flex-shrink-0">✓</span>
                    <span>Kişisel, ticari olmayan amaçlarla içeriği görüntüleyebilir ve kullanabilirsiniz</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 flex-shrink-0">✓</span>
                    <span>Kaynak göstererek sınırlı alıntılar yapabilirsiniz</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 flex-shrink-0">✓</span>
                    <span>Sosyal medyada siteye link paylaşabilirsiniz</span>
                  </li>
                </ul>
                <h3 className="font-semibold text-slate-900 mb-3 mt-4">İzin Gerektirenler:</h3>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li className="flex gap-2">
                    <span className="text-red-600 flex-shrink-0">✗</span>
                    <span>Ticari amaçlı kullanım için yazılı izin almanız gerekmektedir</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 flex-shrink-0">✗</span>
                    <span>İçeriği değiştirerek veya türev eserler oluşturarak yayınlamak yasaktır</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5: Sorumluluk Reddi */}
          <section className="mb-10" data-testid="section-disclaimer">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                5. Sorumluluk Sınırlaması ve Garanti Reddi
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5">
                <p className="text-sm font-bold text-amber-900 mb-3">LÜTFEN DİKKATLE OKUYUNUZ:</p>
                <p className="text-sm text-slate-800 leading-relaxed mb-3">
                  Web sitemiz ve içeriği <strong>"OLDUĞU GİBİ" (AS IS)</strong> ve <strong>"MEVCUT OLDUĞU ŞEKİLDE" (AS AVAILABLE)</strong> sunulmaktadır. 
                  Hiçbir açık veya zımni garanti verilmemektedir.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900 mb-2">Garanti Vermediğimiz Hususlar:</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex gap-2">
                    <span className="text-slate-400">○</span>
                    <span><strong>Doğruluk:</strong> Besin değeri bilgilerinin %100 doğru veya güncel olduğunu garanti etmiyoruz</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-slate-400">○</span>
                    <span><strong>Kesintisizlik:</strong> Sitenin 7/24 kesintisiz çalışacağını garanti etmiyoruz</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-slate-400">○</span>
                    <span><strong>Hatasızlık:</strong> Teknik hataların veya yazılım buglarının olmayacağını garanti etmiyoruz</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-slate-400">○</span>
                    <span><strong>Uygunluk:</strong> Bilgilerin özel ihtiyaçlarınıza uygun olacağını garanti etmiyoruz</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-slate-400">○</span>
                    <span><strong>Güvenlik:</strong> Üçüncü taraf saldırılarına karşı mutlak güvenlik sağlayamayız</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5 mt-6">
                <p className="text-sm font-bold text-red-900 mb-2">SORUMLULUK SINIRI:</p>
                <p className="text-sm text-red-800 leading-relaxed">
                  besindegerim.com, site kullanımından kaynaklanan doğrudan, dolaylı, arızi, özel veya cezai zararlardan 
                  (veri kaybı, gelir kaybı, sağlık sorunları dahil) sorumlu tutulamaz. Sağlık kararlarınızı yalnızca 
                  profesyonel tıbbi danışmanlık alarak vermelisiniz.
                </p>
              </div>

              <div className="bg-slate-100 rounded-xl p-4 mt-4">
                <h3 className="font-semibold text-slate-900 mb-2">Üçüncü Taraf Bağlantılar:</h3>
                <p className="text-sm text-slate-700">
                  Sitemizde yer alan üçüncü taraf web sitelerine olan bağlantılar sadece kolaylık sağlamak içindir. 
                  Bu sitelerin içeriğinden ve gizlilik politikalarından sorumlu değiliz.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Değişiklikler */}
          <section className="mb-10" data-testid="section-changes">
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                6. Koşullarda Değişiklik Yapma Hakkı
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed">
                besindegerim.com, bu Kullanım Koşulları'nı herhangi bir zamanda, önceden haber vermeksizin değiştirme, 
                güncelleme veya düzenleme hakkını saklı tutar.
              </p>
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">Değişiklikler Nasıl Yürürlüğe Girer?</h3>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li className="flex gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span>Güncellenmiş koşullar bu sayfada yayınlanır</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span>"Son Güncelleme" tarihi değiştirilir</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span>Yayınlanma anından itibaren yürürlüğe girer</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600 font-bold">4.</span>
                    <span>Değişiklikten sonra siteyi kullanmaya devam etmeniz, yeni koşulları kabul ettiğiniz anlamına gelir</span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-4">
                <strong>Tavsiye:</strong> Bu sayfayı düzenli olarak ziyaret ederek güncel koşulları gözden geçirmeniz önerilir.
              </p>
            </div>
          </section>

          {/* Section 7: Geçerli Hukuk */}
          <section className="mb-10" data-testid="section-law">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                7. Geçerli Hukuk ve Uyuşmazlık Çözümü
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed">
                Bu Kullanım Koşulları, <strong>Türkiye Cumhuriyeti yasalarına</strong> tabi olup bu yasalara göre yorumlanır.
              </p>
              <div className="bg-slate-50 rounded-xl p-5">
                <h3 className="font-semibold text-slate-900 mb-3">Uyuşmazlık Çözümü:</h3>
                <p className="text-sm text-slate-700 mb-3">
                  Bu koşullardan veya site kullanımından kaynaklanan herhangi bir uyuşmazlık durumunda:
                </p>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li className="flex gap-2">
                    <span className="text-green-600">•</span>
                    <span>Öncelikle dostane çözüm yolları denenir</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">•</span>
                    <span>Çözüm sağlanamazsa, <strong>İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri</strong> yetkilidir</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">•</span>
                    <span>Tüketici uyuşmazlıkları için Tüketici Hakem Heyetleri'ne başvuru hakkınız saklıdır</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer Info */}
          <div className="mt-12 bg-slate-100 rounded-2xl p-6 border-2 border-slate-200">
            <p className="text-sm text-slate-600 mb-4">
              <strong>Son Güncelleme:</strong> 15 Ekim 2025
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              Bu Kullanım Koşulları'nı okuduğunuz ve kabul ettiğiniz için teşekkür ederiz. Sorularınız için 
              bizimle iletişime geçmekten çekinmeyin: <a href="mailto:info@besindegerim.com" className="text-green-600 hover:text-green-700 font-semibold">info@besindegerim.com</a>
            </p>
            <div className="text-xs text-slate-500">
              © 2025 besindegerim.com - Tüm hakları saklıdır.
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
