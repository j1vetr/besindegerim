import { useQuery } from "@tanstack/react-query";
import type { CategoryGroup } from "@shared/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, UserCheck, FileText, Mail } from "lucide-react";

interface PrivacyPageProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

export function PrivacyPage(props?: PrivacyPageProps) {
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({
    queryKey: ["/api/category-groups"],
    enabled: !props?.categoryGroups,
  });

  const groups = props?.categoryGroups || categoryGroups;
  const currentPath = props?.currentPath || "/gizlilik-politikasi";

  return (
    <div className="min-h-screen flex flex-col">
      <Header categoryGroups={groups} currentPath={currentPath} />
      
      <main className="flex-1 bg-gradient-to-br from-white via-green-50/30 to-white">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" data-testid="text-page-title">
              Gizlilik Politikası
            </h1>
            <p className="text-lg text-slate-600">
              Son güncelleme: 15 Ekim 2025
            </p>
          </div>

          {/* Introduction */}
          <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-3xl p-8 mb-8 shadow-lg shadow-green-500/10">
            <p className="text-slate-700 leading-relaxed mb-4">
              besindegerim.com olarak, kullanıcılarımızın gizliliğine saygı duyuyor ve kişisel verilerinin korunmasına azami önem veriyoruz. 
              Bu Gizlilik Politikası, web sitemizi kullanırken toplanan kişisel verilerin nasıl işlendiğini, saklandığını ve korunduğunu 
              açıklamaktadır. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili mevzuat çerçevesinde hareket ediyoruz.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Web sitemizi kullanarak, bu Gizlilik Politikası'nda belirtilen uygulamaları kabul etmiş sayılırsınız. Kişisel verilerinizin 
              güvenliği bizim için öncelikli bir konudur ve bu politika ile tam şeffaflık sağlamayı hedefliyoruz.
            </p>
          </div>

          {/* Section 1: Veri Toplama */}
          <section className="mb-10" data-testid="section-data-collection">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                1. Toplanan Kişisel Veriler
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed">
                Web sitemizi ziyaret ettiğinizde ve kullandığınızda, aşağıdaki kategorilerde kişisel veriler toplanabilir:
              </p>
              <div className="space-y-3">
                <div className="pl-4 border-l-4 border-green-500 py-2">
                  <h3 className="font-semibold text-slate-900 mb-2">Otomatik Toplanan Veriler:</h3>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    <li>IP adresi ve coğrafi konum bilgisi</li>
                    <li>Tarayıcı türü, sürümü ve dil tercihleri</li>
                    <li>İşletim sistemi bilgileri</li>
                    <li>Cihaz tanımlayıcıları ve özelliklerİ</li>
                    <li>Ziyaret edilen sayfalar ve sayfa görüntüleme süreleri</li>
                    <li>Erişim tarihi ve saati</li>
                    <li>Yönlendiren web sitesi (referrer URL)</li>
                  </ul>
                </div>
                <div className="pl-4 border-l-4 border-emerald-500 py-2">
                  <h3 className="font-semibold text-slate-900 mb-2">Kullanım Verileri:</h3>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    <li>Arama sorguları ve tercihler</li>
                    <li>Besin değeri aramaları</li>
                    <li>Hesaplayıcı kullanım verileri</li>
                    <li>Favorilere eklenen içerikler</li>
                    <li>Site içi navigasyon davranışları</li>
                  </ul>
                </div>
                <div className="pl-4 border-l-4 border-teal-500 py-2">
                  <h3 className="font-semibold text-slate-900 mb-2">İletişim Bilgileri (İsteğe Bağlı):</h3>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    <li>E-posta adresi (iletişim formu kullanımında)</li>
                    <li>Ad ve soyad (talep edilirse)</li>
                    <li>Mesaj içeriği ve geri bildirimler</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Kullanım Amaçları */}
          <section className="mb-10" data-testid="section-data-usage">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                2. Verilerin İşlenme Amaçları
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed">
                Toplanan kişisel veriler, yalnızca aşağıdaki meşru amaçlar doğrultusunda işlenmektedir:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">1</span>
                  <span className="text-slate-700"><strong>Hizmet Sunumu:</strong> Web sitesinin işlevselliğini sağlamak, besin değeri bilgilerini ve hesaplayıcıları sunmak</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">2</span>
                  <span className="text-slate-700"><strong>Kullanıcı Deneyimi:</strong> Site performansını optimize etmek ve kişiselleştirilmiş deneyim sunmak</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">3</span>
                  <span className="text-slate-700"><strong>Analiz ve İyileştirme:</strong> Kullanım istatistiklerini analiz ederek hizmet kalitesini artırmak</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">4</span>
                  <span className="text-slate-700"><strong>Teknik Destek:</strong> Kullanıcı sorunlarını çözmek ve teknik destek sağlamak</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">5</span>
                  <span className="text-slate-700"><strong>Güvenlik:</strong> Kötüye kullanımı önlemek ve siber güvenlik tehditlerine karşı koruma sağlamak</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">6</span>
                  <span className="text-slate-700"><strong>Yasal Yükümlülükler:</strong> Yasal gereklilikleri yerine getirmek ve hukuki süreçlere uyum sağlamak</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Çerezler */}
          <section className="mb-10" data-testid="section-cookies">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                3. Çerezler ve İzleme Teknolojileri
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed">
                Web sitemiz, kullanıcı deneyimini iyileştirmek ve site performansını optimize etmek için çerezler (cookies) kullanmaktadır. 
                Çerezler, ziyaret ettiğiniz web sitesi tarafından cihazınıza kaydedilen küçük metin dosyalarıdır.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Detaylı bilgi için <a href="/cerez-politikasi" className="text-green-600 hover:text-green-700 font-semibold underline">Çerez Politikamızı</a> inceleyebilirsiniz.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-slate-700">
                  <strong>Not:</strong> Tarayıcı ayarlarınızdan çerezleri yönetebilir veya tamamen devre dışı bırakabilirsiniz. 
                  Ancak bu durumda, web sitesinin bazı özellikleri düzgün çalışmayabilir.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Üçüncü Taraf Hizmetler */}
          <section className="mb-10" data-testid="section-third-party">
            <div className="flex items-center gap-3 mb-6">
              <UserCheck className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                4. Üçüncü Taraf Hizmetler ve Veri Aktarımı
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed">
                Web sitemizde kullanılan üçüncü taraf hizmetler ve veri paylaşım koşulları:
              </p>
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Analitik Hizmetler:</h3>
                  <p className="text-sm text-slate-700">
                    Google Analytics gibi analitik araçlar, anonim kullanım istatistikleri toplamak için kullanılabilir. 
                    Bu hizmetler kendi gizlilik politikalarına tabidir.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Hosting ve Altyapı:</h3>
                  <p className="text-sm text-slate-700">
                    Web sitemiz, güvenilir hosting sağlayıcıları üzerinde barındırılmaktadır. 
                    Teknik altyapı hizmetleri için gerekli minimum veri paylaşımı yapılmaktadır.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">İçerik Dağıtım Ağları (CDN):</h3>
                  <p className="text-sm text-slate-700">
                    Hızlı içerik sunumu için CDN hizmetleri kullanılabilir. Bu hizmetler IP adresi gibi teknik verilere erişebilir.
                  </p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed font-semibold">
                Kişisel verileriniz, açık rızanız olmadan üçüncü taraflarla pazarlama amaçlı paylaşılmamaktadır.
              </p>
            </div>
          </section>

          {/* Section 5: Kullanıcı Hakları */}
          <section className="mb-10" data-testid="section-user-rights">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                5. Kullanıcı Hakları
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed">
                KVKK kapsamında, kişisel verilerinizle ilgili aşağıdaki haklara sahipsiniz:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">✓ Bilgi Alma Hakkı</h3>
                  <p className="text-sm text-slate-700">Kişisel verilerinizin işlenip işlenmediğini öğrenme</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">✓ Erişim Hakkı</h3>
                  <p className="text-sm text-slate-700">İşlenen verileriniz hakkında bilgi talep etme</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">✓ Düzeltme Hakkı</h3>
                  <p className="text-sm text-slate-700">Eksik veya yanlış verilerin düzeltilmesini isteme</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">✓ Silme Hakkı</h3>
                  <p className="text-sm text-slate-700">Yasal şartlar dahilinde verilerin silinmesini talep etme</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">✓ İtiraz Hakkı</h3>
                  <p className="text-sm text-slate-700">Otomatik sistemlerle veri işlemeye itiraz etme</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">✓ Şikayet Hakkı</h3>
                  <p className="text-sm text-slate-700">Kişisel Verileri Koruma Kurumu'na başvurma</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: KVKK Uyumu */}
          <section className="mb-10" data-testid="section-kvkk">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                6. KVKK Uyumu ve Veri Güvenliği
              </h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed">
                6698 sayılı Kişisel Verilerin Korunması Kanunu'na tam uyum sağlamak için aşağıdaki önlemler alınmıştır:
              </p>
              <ul className="space-y-3 text-slate-700">
                <li className="flex gap-2"><span className="text-green-600 font-bold">•</span> <span>SSL/TLS şifreleme ile güvenli veri iletimi</span></li>
                <li className="flex gap-2"><span className="text-green-600 font-bold">•</span> <span>Düzenli güvenlik güncellemeleri ve sistem testleri</span></li>
                <li className="flex gap-2"><span className="text-green-600 font-bold">•</span> <span>Yetkisiz erişime karşı güvenlik duvarı koruması</span></li>
                <li className="flex gap-2"><span className="text-green-600 font-bold">•</span> <span>Veri minimizasyonu prensibi: Sadece gerekli veriler toplanır</span></li>
                <li className="flex gap-2"><span className="text-green-600 font-bold">•</span> <span>Sınırlı erişim: Veriler sadece yetkili personel tarafından işlenir</span></li>
                <li className="flex gap-2"><span className="text-green-600 font-bold">•</span> <span>Veri saklama süresi sınırı: Yasal gereklilik olmadıkça veriler silinir</span></li>
              </ul>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                <p className="text-sm text-slate-700">
                  <strong>Önemli:</strong> İnternet üzerinden yapılan hiçbir veri iletiminin %100 güvenli olduğu garanti edilemez. 
                  Güvenlik önlemleri alınsa da, mutlak güvenlik sağlanamayacağını kabul edersiniz.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: İletişim */}
          <section className="mb-10" data-testid="section-contact">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                7. İletişim ve Başvuru
              </h2>
            </div>
            <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-300/50 rounded-3xl p-8">
              <p className="text-slate-700 leading-relaxed mb-4">
                Kişisel verilerinizle ilgili sorularınız, talepleriniz veya şikayetleriniz için bizimle iletişime geçebilirsiniz:
              </p>
              <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                <p className="text-lg font-semibold text-slate-900 mb-2">E-posta:</p>
                <a href="mailto:info@besindegerim.com" className="text-green-600 hover:text-green-700 font-bold text-xl">
                  info@besindegerim.com
                </a>
                <p className="text-sm text-slate-600 mt-4">
                  Başvurularınız en geç 30 gün içinde değerlendirilip yanıtlanacaktır.
                </p>
              </div>
            </div>
          </section>

          {/* Footer Info */}
          <div className="mt-12 bg-slate-100 rounded-2xl p-6 border-2 border-slate-200">
            <p className="text-sm text-slate-600 mb-2">
              <strong>Son Güncelleme:</strong> 15 Ekim 2025
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Bu Gizlilik Politikası, gerektiğinde önceden haber verilmeksizin güncellenebilir. 
              Güncellemeler bu sayfada yayınlandığı anda yürürlüğe girer. Düzenli olarak kontrol etmenizi öneririz.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
