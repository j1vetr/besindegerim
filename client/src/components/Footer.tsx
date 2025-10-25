import { Link } from "wouter";
import { Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About */}
          <div className="space-y-3">
            <img 
              src="/logo.png" 
              alt="Besin Değerim Logo" 
              className="h-10 w-auto"
              data-testid="img-footer-logo"
            />
            <p className="text-sm text-muted-foreground">
              Türkiye'nin en kapsamlı besin değerleri platformu. 
              Sağlıklı yaşam için güvenilir bilgi kaynağınız.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Kurumsal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/hakkimizda" data-testid="link-about">
                  <span className="text-muted-foreground hover:text-foreground transition-colors hover-elevate rounded px-1">
                    Hakkımızda
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/iletisim" data-testid="link-contact">
                  <span className="text-muted-foreground hover:text-foreground transition-colors hover-elevate rounded px-1">
                    İletişim
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Yasal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gizlilik-politikasi" data-testid="link-privacy">
                  <span className="text-muted-foreground hover:text-foreground transition-colors hover-elevate rounded px-1">
                    Gizlilik Politikası
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari" data-testid="link-terms">
                  <span className="text-muted-foreground hover:text-foreground transition-colors hover-elevate rounded px-1">
                    Kullanım Koşulları
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/kvkk" data-testid="link-kvkk">
                  <span className="text-muted-foreground hover:text-foreground transition-colors hover-elevate rounded px-1">
                    KVKK
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/cerez-politikasi" data-testid="link-cookie">
                  <span className="text-muted-foreground hover:text-foreground transition-colors hover-elevate rounded px-1">
                    Çerez Politikası
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Sosyal Medya</h3>
            <p className="text-sm text-muted-foreground">
              Bizi sosyal medyada takip edin.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground md:flex-row">
          <p data-testid="text-copyright">
            © {currentYear} Besin Değerim. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-1">
            <span>Sağlıklı yaşam için</span>
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <span>ile yapıldı</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-lg bg-muted p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground mb-2" data-testid="text-disclaimer-title">
            ⚠️ Önemli Uyarı - Sadece Bilgilendirme Amaçlıdır
          </p>
          <p data-testid="text-disclaimer">
            Bu sitede yer alan besin değerleri bilgileri sadece bilgilendirme amaçlıdır. 
            Tıbbi tavsiye, teşhis veya tedavi yerine geçmez. Sağlık durumunuz hakkında 
            karar vermeden önce mutlaka bir sağlık profesyoneline danışınız. Besin değerleri 
            kaynaklardan alınmıştır ve yaklaşık değerler içerebilir. Herhangi bir diyet veya 
            beslenme programına başlamadan önce doktorunuza danışmanız önerilir.
          </p>
        </div>
      </div>
    </footer>
  );
}
