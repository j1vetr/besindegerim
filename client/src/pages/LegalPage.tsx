import React from "react";
import type { CategoryGroup } from "@shared/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface LegalPageProps {
  slug: string;
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

interface LegalContent {
  title: string;
  sections: {
    heading: string;
    content: string[];
  }[];
}

const legalPages: Record<string, LegalContent> = {
  "gizlilik-politikasi": {
    title: "Gizlilik Politikası",
    sections: [
      {
        heading: "Giriş",
        content: [
          "Besin Değerim olarak gizliliğinize saygı duyuyoruz ve kişisel verilerinizi korumaya önem veriyoruz.",
          "Bu Gizlilik Politikası, web sitemizi ziyaret ettiğinizde toplanan bilgilerin nasıl kullanıldığını açıklar."
        ]
      },
      {
        heading: "Toplanan Bilgiler",
        content: [
          "Web sitemizi ziyaret ettiğinizde, tarayıcınız ve cihazınız hakkında otomatik olarak bazı bilgiler toplanır (IP adresi, tarayıcı türü, ziyaret edilen sayfalar).",
          "Arama sorgularınız ve tercihleriniz gibi kullanım verileri.",
          "Çerezler aracılığıyla toplanan bilgiler."
        ]
      },
      {
        heading: "Bilgilerin Kullanımı",
        content: [
          "Toplanan bilgiler sadece hizmet kalitesini artırmak için kullanılır.",
          "Kişisel bilgileriniz üçüncü taraflarla paylaşılmaz.",
          "İstatistiksel analizler için anonim veriler kullanılabilir."
        ]
      },
      {
        heading: "Çerezler",
        content: [
          "Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanır.",
          "Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.",
          "Daha fazla bilgi için Çerez Politikamıza bakınız."
        ]
      },
      {
        heading: "Güvenlik",
        content: [
          "Verilerinizin güvenliğini sağlamak için endüstri standardı önlemler alınmaktadır.",
          "Ancak, internet üzerinden veri iletiminin %100 güvenli olduğu garanti edilemez."
        ]
      },
      {
        heading: "Haklarınız",
        content: [
          "Kişisel verilerinize erişim talep edebilirsiniz.",
          "Verilerinizin düzeltilmesini veya silinmesini isteyebilirsiniz.",
          "Veri işleme faaliyetlerine itiraz edebilirsiniz."
        ]
      }
    ]
  },
  "kullanim-kosullari": {
    title: "Kullanım Koşulları",
    sections: [
      {
        heading: "Hizmet Koşulları",
        content: [
          "Besin Değerim web sitesini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.",
          "Web sitesi içeriği sadece bilgilendirme amaçlıdır ve tıbbi tavsiye yerine geçmez."
        ]
      },
      {
        heading: "Kullanıcı Sorumlulukları",
        content: [
          "Web sitesini yasa dışı amaçlarla kullanamazsınız.",
          "İçeriği izinsiz kopyalayamaz veya çoğaltamazsınız.",
          "Sistemlere zarar verecek yazılımlar kullanamazsınız."
        ]
      },
      {
        heading: "İçerik Hakkında",
        content: [
          "Besin değerleri bilgileri güvenilir kaynaklardan alınmıştır.",
          "Bilgiler değişiklik gösterebilir ve güncellik garantisi verilmez.",
          "Herhangi bir hata veya eksiklikten dolayı sorumluluk kabul edilmez."
        ]
      },
      {
        heading: "Sorumluluk Reddi",
        content: [
          "Web sitesi 'olduğu gibi' sunulmaktadır.",
          "Hizmetin kesintisiz veya hatasız olacağı garanti edilmez.",
          "Üçüncü taraf bağlantılardan sorumlu değiliz."
        ]
      },
      {
        heading: "Fikri Mülkiyet",
        content: [
          "Web sitesindeki tüm içerik, logo ve tasarım telif hakları ile korunmaktadır.",
          "İzinsiz kullanım yasal işlem gerektirebilir."
        ]
      },
      {
        heading: "Değişiklikler",
        content: [
          "Bu koşullar önceden haber verilmeksizin değiştirilebilir.",
          "Değişiklikler web sitesinde yayınlandığında yürürlüğe girer."
        ]
      }
    ]
  },
  "kvkk": {
    title: "KVKK Aydınlatma Metni",
    sections: [
      {
        heading: "Veri Sorumlusu",
        content: [
          "6698 sayılı Kişisel Verilerin Korunması Kanunu ('KVKK') uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla Besin Değerim tarafından işlenmektedir."
        ]
      },
      {
        heading: "İşlenen Kişisel Veriler",
        content: [
          "Kimlik bilgileri (ad, soyad)",
          "İletişim bilgileri (e-posta, telefon)",
          "İşlem güvenliği bilgileri (IP adresi, çerez kayıtları)",
          "Kullanım verileri (arama sorguları, ziyaret edilen sayfalar)"
        ]
      },
      {
        heading: "Kişisel Verilerin İşlenme Amacı",
        content: [
          "Hizmet kalitesini artırmak",
          "Kullanıcı deneyimini iyileştirmek",
          "İstatistiksel analizler yapmak",
          "Yasal yükümlülükleri yerine getirmek"
        ]
      },
      {
        heading: "Kişisel Verilerin Aktarımı",
        content: [
          "Kişisel verileriniz, KVKK'da öngörülen hallerde ve hukuka uygun olarak üçüncü kişilere aktarılabilir.",
          "Veri işleyen hizmet sağlayıcılarla paylaşılabilir."
        ]
      },
      {
        heading: "Haklarınız",
        content: [
          "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
          "İşlenmişse bilgi talep etme",
          "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
          "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
          "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
          "Kanunda öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme",
          "Aktarıldığı üçüncü kişilere bildirilmesini isteme",
          "Münhasıran otomatik sistemler ile analiz edilmesi nedeniyle aleyhinize bir sonuç doğmasına itiraz etme",
          "Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme"
        ]
      },
      {
        heading: "Başvuru Yöntemi",
        content: [
          "KVKK'dan doğan haklarınızı kullanmak için web sitemizdeki iletişim formunu kullanabilir veya yazılı olarak başvurabilirsiniz.",
          "Başvurularınız en kısa sürede ve en geç 30 gün içinde yanıtlanacaktır."
        ]
      }
    ]
  },
  "cerez-politikasi": {
    title: "Çerez Politikası",
    sections: [
      {
        heading: "Çerez Nedir?",
        content: [
          "Çerezler, web sitelerini ziyaret ettiğinizde cihazınızda saklanan küçük metin dosyalarıdır.",
          "Çerezler, web sitesinin düzgün çalışmasını sağlar ve kullanıcı deneyimini iyileştirir."
        ]
      },
      {
        heading: "Kullanılan Çerez Türleri",
        content: [
          "Zorunlu Çerezler: Web sitesinin temel işlevleri için gereklidir.",
          "İşlevsel Çerezler: Tercihlerinizi hatırlamak için kullanılır.",
          "Performans Çerezleri: Web sitesi performansını ölçmek için kullanılır.",
          "Analitik Çerezler: Ziyaretçi davranışlarını anlamak için kullanılır."
        ]
      },
      {
        heading: "Çerezlerin Yönetimi",
        content: [
          "Tarayıcı ayarlarınızdan çerezleri kabul etmeyi veya reddetmeyi seçebilirsiniz.",
          "Çerezleri devre dışı bırakmak, web sitesinin bazı özelliklerinin çalışmamasına neden olabilir."
        ]
      },
      {
        heading: "Üçüncü Taraf Çerezleri",
        content: [
          "Web sitemizde Google Analytics gibi üçüncü taraf hizmetler kullanılabilir.",
          "Bu hizmetler kendi çerez politikalarına sahiptir."
        ]
      }
    ]
  },
  "hakkimizda": {
    title: "Hakkımızda",
    sections: [
      {
        heading: "Misyonumuz",
        content: [
          "Besin Değerim, Türkiye'nin en kapsamlı ve güvenilir besin değerleri platformu olmayı hedefler.",
          "Sağlıklı yaşam ve bilinçli beslenme için doğru bilgiye erişimi kolaylaştırıyoruz."
        ]
      },
      {
        heading: "Vizyonumuz",
        content: [
          "Herkesin besin değerlerine kolayca ulaşabileceği, kullanıcı dostu bir platform sunmak.",
          "Bilimsel ve güncel verilerle desteklenen güvenilir bir kaynak olmak.",
          "Sağlık bilincini artırmaya katkıda bulunmak."
        ]
      },
      {
        heading: "Verilerimiz",
        content: [
          "Besin değerleri bilgileri USDA FoodData Central ve diğer güvenilir kaynaklardan alınmaktadır.",
          "Verilerimiz düzenli olarak güncellenmektedir.",
          "Tüm değerler gram bazlı ve gerçek porsiyon büyüklüklerine göre hesaplanmaktadır."
        ]
      },
      {
        heading: "Önemli Not",
        content: [
          "Bu platform sadece bilgilendirme amaçlıdır.",
          "Tıbbi tavsiye, teşhis veya tedavi yerine geçmez.",
          "Sağlık durumunuz hakkında kararlar almadan önce mutlaka bir sağlık profesyoneline danışınız."
        ]
      }
    ]
  },
  "iletisim": {
    title: "İletişim",
    sections: [
      {
        heading: "Bize Ulaşın",
        content: [
          "Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçebilirsiniz."
        ]
      },
      {
        heading: "E-posta",
        content: [
          "info@besindegerim.com"
        ]
      },
      {
        heading: "Sosyal Medya",
        content: [
          "Bizi sosyal medya hesaplarımızdan takip edebilirsiniz."
        ]
      },
      {
        heading: "Geri Bildirim",
        content: [
          "Platformumuzu geliştirmek için geri bildirimleriniz bizim için çok değerlidir.",
          "Herhangi bir hata veya eksiklik fark ederseniz lütfen bize bildirin."
        ]
      }
    ]
  }
};

export function LegalPage(props?: LegalPageProps) {
  const slug = props?.slug || "";
  const categoryGroups = props?.categoryGroups;
  const currentPath = props?.currentPath;
  const content = legalPages[slug];

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header categoryGroups={categoryGroups} currentPath={currentPath} />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold">Sayfa Bulunamadı</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      <main className="flex-1 bg-gradient-to-br from-white via-green-50/20 to-white">
        <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold text-foreground" data-testid="text-page-title">
        {content.title}
      </h1>
      
      <div className="space-y-8">
        {content.sections.map((section, index) => (
          <section key={index} className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground" data-testid={`text-section-${index}`}>
              {section.heading}
            </h2>
            <div className="space-y-3">
              {section.content.map((paragraph, pIndex) => (
                <p 
                  key={pIndex} 
                  className="text-muted-foreground leading-relaxed"
                  data-testid={`text-content-${index}-${pIndex}`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-lg bg-muted p-6">
        <p className="text-sm text-muted-foreground">
          Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
