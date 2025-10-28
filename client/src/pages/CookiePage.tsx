import { useQuery } from "@tanstack/react-query";
import type { CategoryGroup } from "@shared/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Cookie, Settings, BarChart, Shield, RefreshCw } from "lucide-react";

interface CookiePageProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

export function CookiePage(props?: CookiePageProps) {
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({
    queryKey: ["/api/category-groups"],
    enabled: !props?.categoryGroups,
  });

  const groups = props?.categoryGroups || categoryGroups;
  const currentPath = props?.currentPath || "/cerez-politikasi";

  return (
    <div className="min-h-screen flex flex-col">
      <Header categoryGroups={groups} currentPath={currentPath} />
      
      <main className="flex-1 bg-gradient-to-br from-white via-green-50/30 to-white">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-6">
              <Cookie className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" data-testid="text-page-title">
              Çerez Politikası
            </h1>
            <p className="text-lg text-slate-600">
              Son güncelleme: 15 Ekim 2025
            </p>
          </div>

          {/* Introduction */}
          <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-3xl p-8 mb-8 shadow-lg shadow-green-500/10">
            <p className="text-slate-700 leading-relaxed mb-4">
              besindegerim.com olarak, web sitemizde kullanıcı deneyimini iyileştirmek ve site performansını optimize etmek 
              amacıyla çerezler (cookies) kullanmaktayız. Bu Çerez Politikası, web sitemizde hangi çerezlerin kullanıldığını, 
              bu çerezlerin amacını ve çerezleri nasıl kontrol edebileceğinizi açıklamaktadır.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Sitemizi kullanmaya devam ederek, bu Çerez Politikası'nda belirtilen şekilde çerez kullanımını kabul etmiş olursunuz.
            </p>
          </div>

          {/* Section 1: Çerez Nedir? */}
          <section className="mb-10" data-testid="section-what-is-cookie">
            <div className="flex items-center gap-3 mb-6">
              <Cookie className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                1. Çerez (Cookie) Nedir?
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed">
                Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız tarafından bilgisayarınıza veya mobil cihazınıza 
                kaydedilen küçük metin dosyalarıdır. Çerezler, web sitesinin işlevselliğini artırmak ve size daha iyi bir 
                kullanıcı deneyimi sunmak için yaygın olarak kullanılır.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📁</span>
                    Çerezler Ne İçerir?
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li className="flex gap-2"><span className="text-blue-600">•</span> <span>Web sitesi adı</span></li>
                    <li className="flex gap-2"><span className="text-blue-600">•</span> <span>Benzersiz tanımlayıcı</span></li>
                    <li className="flex gap-2"><span className="text-blue-600">•</span> <span>Geçerlilik süresi</span></li>
                    <li className="flex gap-2"><span className="text-blue-600">•</span> <span>Tercihleriniz ve ayarlarınız</span></li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    Çerezlerin Faydaları
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li className="flex gap-2"><span className="text-green-600">•</span> <span>Tercihlerinizi hatırlar</span></li>
                    <li className="flex gap-2"><span className="text-green-600">•</span> <span>Gezinmeyi kolaylaştırır</span></li>
                    <li className="flex gap-2"><span className="text-green-600">•</span> <span>Siteyi hızlandırır</span></li>
                    <li className="flex gap-2"><span className="text-green-600">•</span> <span>Kişiselleştirilmiş deneyim sunar</span></li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 mt-4">
                <p className="text-sm text-slate-700 leading-relaxed">
                  <strong>Önemli Not:</strong> Çerezler virüs içermez ve zararlı değildir. Kişisel bilgilerinizi (ad, e-posta, şifre gibi) 
                  doğrudan saklamazlar, sadece anonim tanımlayıcılar kullanırlar.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Kullanılan Çerezler */}
          <section className="mb-10" data-testid="section-cookies-used">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                2. Web Sitemizde Kullanılan Çerezler
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed mb-4">
                besindegerim.com'da aşağıdaki çerez türlerini kullanmaktayız:
              </p>
              
              <div className="space-y-4">
                {/* Zorunlu Çerezler */}
                <div className="border-2 border-red-200 bg-red-50 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">🔴</span>
                    <div>
                      <h3 className="font-bold text-red-900 text-lg">Zorunlu Çerezler (Strictly Necessary)</h3>
                      <p className="text-sm text-red-800 mt-1">Bu çerezler devre dışı bırakılamaz</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                    Web sitesinin temel işlevlerinin çalışması için kesinlikle gereklidir. Bu çerezler olmadan 
                    site düzgün çalışmaz.
                  </p>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs font-semibold text-slate-900 mb-2">Kullanım Alanları:</p>
                    <ul className="text-xs text-slate-700 space-y-1">
                      <li>• Güvenli sayfalar arası geçiş (session yönetimi)</li>
                      <li>• Güvenlik ve kimlik doğrulama</li>
                      <li>• Dil ve bölge tercihleri</li>
                      <li>• Çerez tercihleri (kabul/ret bilgisi)</li>
                    </ul>
                  </div>
                </div>

                {/* İşlevsel Çerezler */}
                <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">🔵</span>
                    <div>
                      <h3 className="font-bold text-blue-900 text-lg">İşlevsel Çerezler (Functional)</h3>
                      <p className="text-sm text-blue-800 mt-1">Kullanıcı deneyimini iyileştirir</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                    Tercihlerinizi hatırlayarak size gelişmiş ve kişiselleştirilmiş özellikler sunar.
                  </p>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs font-semibold text-slate-900 mb-2">Kullanım Alanları:</p>
                    <ul className="text-xs text-slate-700 space-y-1">
                      <li>• Arama geçmişi ve tercihleri</li>
                      <li>• Favori besin değerleri</li>
                      <li>• Hesaplayıcı ayarları (boy, kilo, cinsiyet vb.)</li>
                      <li>• Tema tercihi (açık/koyu mod)</li>
                    </ul>
                  </div>
                </div>

                {/* Performans Çerezleri */}
                <div className="border-2 border-purple-200 bg-purple-50 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">🟣</span>
                    <div>
                      <h3 className="font-bold text-purple-900 text-lg">Performans Çerezleri (Performance)</h3>
                      <p className="text-sm text-purple-800 mt-1">Site performansını optimize eder</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                    Web sitesinin performansını ölçer ve iyileştirmeler yapmamıza yardımcı olur.
                  </p>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs font-semibold text-slate-900 mb-2">Kullanım Alanları:</p>
                    <ul className="text-xs text-slate-700 space-y-1">
                      <li>• Sayfa yüklenme süreleri</li>
                      <li>• Hata ayıklama ve sorun tespiti</li>
                      <li>• Sunucu yük dengeleme</li>
                      <li>• Site hızı optimizasyonu</li>
                    </ul>
                  </div>
                </div>

                {/* Analitik Çerezler */}
                <div className="border-2 border-green-200 bg-green-50 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">🟢</span>
                    <div>
                      <h3 className="font-bold text-green-900 text-lg">Analitik Çerezler (Analytics)</h3>
                      <p className="text-sm text-green-800 mt-1">Kullanım istatistikleri toplar</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                    Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olur (Google Analytics gibi).
                  </p>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs font-semibold text-slate-900 mb-2">Kullanım Alanları:</p>
                    <ul className="text-xs text-slate-700 space-y-1">
                      <li>• Ziyaretçi sayısı ve demografik bilgiler (anonim)</li>
                      <li>• En çok ziyaret edilen sayfalar</li>
                      <li>• Kullanıcı davranış analizi</li>
                      <li>• Trafik kaynakları (Google, sosyal medya vb.)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Çerez Türleri (Süre) */}
          <section className="mb-10" data-testid="section-cookie-types">
            <div className="flex items-center gap-3 mb-6">
              <BarChart className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                3. Çerez Türleri (Süre Bakımından)
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">⏱️</span>
                    <h3 className="font-bold text-orange-900 text-xl">Oturum Çerezleri</h3>
                  </div>
                  <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                    <strong>(Session Cookies)</strong>
                  </p>
                  <p className="text-sm text-slate-700 mb-3">
                    Tarayıcınızı kapattığınızda otomatik olarak silinir. Sadece mevcut oturumunuz boyunca aktiftir.
                  </p>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs font-semibold text-slate-800 mb-2">Örnekler:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• Sepet içeriği (alışveriş sitelerinde)</li>
                      <li>• Sayfa geçişleri</li>
                      <li>• Form verileri</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">📅</span>
                    <h3 className="font-bold text-indigo-900 text-xl">Kalıcı Çerezler</h3>
                  </div>
                  <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                    <strong>(Persistent Cookies)</strong>
                  </p>
                  <p className="text-sm text-slate-700 mb-3">
                    Belirli bir süre boyunca (gün, ay, yıl) cihazınızda kalır. Tercihleri ve ayarları hatırlar.
                  </p>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs font-semibold text-slate-800 mb-2">Örnekler:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• "Beni hatırla" seçeneği</li>
                      <li>• Dil tercihi</li>
                      <li>• Tema ayarları</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Çerez Kontrolü */}
          <section className="mb-10" data-testid="section-cookie-control">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                4. Çerezleri Nasıl Kontrol Edebilirsiniz?
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed mb-4">
                Çerezleri kabul etmek veya reddetmek tamamen sizin kontrolünüzdedir. Tarayıcı ayarlarınızdan 
                çerezleri yönetebilir, silebilir veya engelleyebilirsiniz.
              </p>

              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-6">
                <h3 className="font-bold text-cyan-900 text-lg mb-4 flex items-center gap-2">
                  <span className="text-2xl">🌐</span>
                  Tarayıcı Ayarlarından Çerez Yönetimi
                </h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-slate-900 mb-2">Google Chrome:</p>
                    <p className="text-sm text-slate-700">Ayarlar → Gizlilik ve güvenlik → Çerezler ve diğer site verileri</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-slate-900 mb-2">Mozilla Firefox:</p>
                    <p className="text-sm text-slate-700">Ayarlar → Gizlilik ve Güvenlik → Çerezler ve Site Verileri</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-slate-900 mb-2">Safari:</p>
                    <p className="text-sm text-slate-700">Tercihler → Gizlilik → Çerezleri ve web sitesi verilerini yönet</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-slate-900 mb-2">Microsoft Edge:</p>
                    <p className="text-sm text-slate-700">Ayarlar → Çerezler ve site izinleri → Çerezleri yönet ve sil</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 mt-6">
                <p className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                  ⚠️ Dikkat
                </p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Çerezleri tamamen devre dışı bırakırsanız, web sitemizin bazı özellikleri düzgün çalışmayabilir. 
                  Örneğin, tercihleriniz kaydedilmez ve bazı sayfalar yüklenmeyebilir.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Üçüncü Taraf Çerezleri */}
          <section className="mb-10" data-testid="section-third-party">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                5. Üçüncü Taraf Çerezleri
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed">
                Web sitemizde, üçüncü taraf hizmet sağlayıcıların çerezleri de kullanılabilir. 
                Bu çerezler, kendi gizlilik politikalarına tabidir.
              </p>
              
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">Google Analytics</h3>
                  <p className="text-sm text-slate-700 mb-2">
                    Anonim kullanım istatistikleri toplamak için Google Analytics kullanılabilir.
                  </p>
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:text-green-700 underline">
                    Google Gizlilik Politikası →
                  </a>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">CDN Hizmetleri</h3>
                  <p className="text-sm text-slate-700">
                    Hızlı içerik dağıtımı için CDN (Content Delivery Network) servisleri kullanılabilir. 
                    Bu servisler teknik çerezler kullanabilir.
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <strong>Not:</strong> Üçüncü taraf çerezlerini reddetmek için ilgili hizmet sağlayıcının politikalarını 
                kontrol edebilir veya tarayıcı ayarlarınızı kullanabilirsiniz.
              </p>
            </div>
          </section>

          {/* Section 6: Güncellemeler */}
          <section className="mb-10" data-testid="section-updates">
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                6. Çerez Politikası Güncellemeleri
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed">
                Bu Çerez Politikası, gerektiğinde güncellenebilir. Güncellemeler bu sayfada yayınlanır ve 
                "Son Güncelleme" tarihi değiştirilir.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <p className="text-sm text-slate-700 leading-relaxed">
                  <strong>Tavsiye:</strong> Çerez kullanımı ile ilgili en güncel bilgilere sahip olmak için 
                  bu sayfayı düzenli olarak ziyaret etmenizi öneririz.
                </p>
              </div>
            </div>
          </section>

          {/* Footer Info */}
          <div className="mt-12 bg-slate-100 rounded-2xl p-6 border-2 border-slate-200">
            <p className="text-sm text-slate-600 mb-4">
              <strong>Son Güncelleme:</strong> 15 Ekim 2025
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              Çerezler ve gizlilik ile ilgili sorularınız için bizimle iletişime geçebilirsiniz: 
              <a href="mailto:info@besindegerim.com" className="text-green-600 hover:text-green-700 font-semibold ml-1">
                info@besindegerim.com
              </a>
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Ayrıca <a href="/gizlilik-politikasi" className="text-green-600 hover:text-green-700 font-semibold underline">Gizlilik Politikamızı</a> inceleyebilirsiniz.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
