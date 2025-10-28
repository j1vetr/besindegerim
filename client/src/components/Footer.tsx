import React from "react";
import { Mail, Shield, FileText } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-green-50 to-emerald-50 border-t-2 border-green-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <a href="/" className="inline-block mb-4 hover:scale-105 transition-transform">
              <img 
                src="/logo.png" 
                alt="Besin Değerim" 
                className="h-16 w-auto"
                data-testid="img-footer-logo"
              />
            </a>
            <p className="text-sm text-slate-700 leading-relaxed">
              Türkiye'nin en kapsamlı besin değerleri platformu. 
              Gerçek porsiyon bazlı kalori ve makro hesaplama.
            </p>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-600" />
              Kurumsal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="/hakkimizda" 
                  className="text-slate-700 hover:text-green-600 transition-colors hover-elevate rounded px-1"
                  data-testid="link-about"
                >
                  Hakkımızda
                </a>
              </li>
              <li>
                <a 
                  href="/iletisim" 
                  className="text-slate-700 hover:text-green-600 transition-colors hover-elevate rounded px-1"
                  data-testid="link-contact"
                >
                  İletişim
                </a>
              </li>
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              Yasal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="/gizlilik-politikasi" 
                  className="text-slate-700 hover:text-green-600 transition-colors hover-elevate rounded px-1"
                  data-testid="link-privacy"
                >
                  Gizlilik Politikası
                </a>
              </li>
              <li>
                <a 
                  href="/kullanim-kosullari" 
                  className="text-slate-700 hover:text-green-600 transition-colors hover-elevate rounded px-1"
                  data-testid="link-terms"
                >
                  Kullanım Koşulları
                </a>
              </li>
              <li>
                <a 
                  href="/kvkk" 
                  className="text-slate-700 hover:text-green-600 transition-colors hover-elevate rounded px-1"
                  data-testid="link-kvkk"
                >
                  KVKK Aydınlatma Metni
                </a>
              </li>
              <li>
                <a 
                  href="/cerez-politikasi" 
                  className="text-slate-700 hover:text-green-600 transition-colors hover-elevate rounded px-1"
                  data-testid="link-cookie"
                >
                  Çerez Politikası
                </a>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-600" />
              İletişim
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              Soru, öneri ve işbirliği için bizimle iletişime geçin.
            </p>
            <a 
              href="mailto:info@besindegerim.com"
              className="inline-block text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
              data-testid="link-email"
            >
              info@besindegerim.com
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mb-8 rounded-2xl bg-white/60 backdrop-blur-md border-2 border-green-200/50 p-5">
          <p className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-600" />
            Önemli Uyarı - Sadece Bilgilendirme Amaçlıdır
          </p>
          <p className="text-xs text-slate-700 leading-relaxed" data-testid="text-disclaimer">
            Bu sitede yer alan besin değerleri ve hesaplayıcılar sadece bilgilendirme amaçlıdır. 
            Tıbbi tavsiye, teşhis veya tedavi yerine geçmez. Sağlık durumunuz, diyet planınız 
            veya beslenme alışkanlıklarınız hakkında karar vermeden önce mutlaka bir diyetisyen 
            veya sağlık profesyoneline danışınız. Veriler bilimsel kaynaklardan alınmıştır.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t-2 border-green-200/50 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm text-slate-600" data-testid="text-copyright">
            © {currentYear} besindegerim.com - Tüm Hakları Saklıdır.
          </p>
          
          {/* Made by TOOV */}
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <span>Sağlıklı Yaşam için ❤️</span>
            <a 
              href="https://toov.com.tr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hover:from-green-700 hover:to-emerald-700 transition-all"
              data-testid="link-toov"
            >
              TOOV
            </a>
            <span>tarafından yapıldı.</span>
          </div>
        </div>

        {/* Green Accent Line */}
        <div className="mt-6 mx-auto w-32 h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full shadow-lg shadow-green-500/30"></div>
      </div>
    </footer>
  );
}
