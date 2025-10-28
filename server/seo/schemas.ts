/**
 * JSON-LD Schemas for SEO
 * Structured data for rich results in search engines
 */

/**
 * About Page Schema (Organization)
 */
export function getAboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "besindegerim.com",
    "url": "https://besindegerim.com",
    "logo": "https://besindegerim.com/logo.png",
    "description": "Türkiye'nin en kapsamlı besin değerleri platformu. Gerçek porsiyon bazlı kalori ve besin değerleri.",
    "foundingDate": "2024",
    "email": "info@besindegerim.com",
    "sameAs": [],
    "areaServed": "TR",
    "knowsAbout": [
      "Besin Değerleri",
      "Kalori Hesaplama",
      "Makro Besinler",
      "Beslenme Bilimi"
    ]
  };
}

/**
 * Contact Page Schema (ContactPage)
 */
export function getContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "İletişim - besindegerim.com",
    "description": "besindegerim.com ile iletişime geçin. Sorularınız, önerileriniz ve işbirliği teklifleri için bize ulaşın.",
    "url": "https://besindegerim.com/iletisim",
    "mainEntity": {
      "@type": "Organization",
      "name": "besindegerim.com",
      "email": "info@besindegerim.com",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "email": "info@besindegerim.com",
        "availableLanguage": "Turkish",
        "areaServed": "TR"
      }
    }
  };
}

/**
 * HomePage FAQ Schema (FAQPage) - 6 Essential Questions
 */
export function getFAQPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "besindegerim.com nedir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "besindegerim.com, Türkiye'nin en kapsamlı besin değerleri platformudur. 266+ gıdanın gerçek porsiyon bazlı kalori, protein, karbonhidrat, yağ ve vitamin/mineral değerlerini sunar. Bilimsel kaynaklardan alınan güvenilir verilerle desteklenir. Ücretsiz hesaplayıcılar (BMI, kalori, protein, makro dağılımı) ve detaylı besin analizleri sağlar."
        }
      },
      {
        "@type": "Question",
        "name": "Besin değerleri doğru mu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Evet, tüm besin değerleri uluslararası kabul görmüş bilimsel veritabanlarından alınır. Laboratuvar analizleri ve bilimsel çalışmalarla doğrulanmış, dünya çapında güvenilir kaynaklardır. Veriler düzenli olarak güncellenir ve 20+ vitamin/mineral içerir. Platform üzerindeki her besin için detaylı makro ve mikro besin öğesi bilgisi bulunur."
        }
      },
      {
        "@type": "Question",
        "name": "Platformu nasıl kullanırım?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ana sayfadaki arama kutusuna gıda adını yazın (örn: elma, tavuk). Arama sonuçlarından istediğiniz gıdayı seçin. Detay sayfasında porsiyon başına kalori, protein, karbonhidrat, yağ ve 20+ vitamin/mineral değerlerini görürsünüz. Hesaplayıcılar menüsünden BMI, kalori, protein gibi hesaplamalar yapabilirsiniz."
        }
      },
      {
        "@type": "Question",
        "name": "Hesaplayıcılar ücretsiz mi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Evet, tüm hesaplayıcılar tamamen ücretsizdir. BMI hesaplayıcı, günlük kalori ihtiyacı (BMR/TDEE), protein gereksinimi, su ihtiyacı, ideal kilo, porsiyon çevirici ve kilo verme süresi hesaplayıcılarını ücretsiz kullanabilirsiniz. Kayıt veya ödeme gerektirmez."
        }
      },
      {
        "@type": "Question",
        "name": "BMI nedir, nasıl hesaplanır?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "BMI (Vücut Kitle İndeksi), kilo ve boy oranınızı değerlendirir. Formül: Kilo (kg) / Boy (m)². Örnek: 70 kg, 1.75 m → BMI = 70/(1.75²) = 22.9. Değerlendirme: Zayıf <18.5, Normal 18.5-24.9, Fazla Kilolu 25-29.9, Obez ≥30. WHO standartlarına göre sağlık riskini gösterir."
        }
      },
      {
        "@type": "Question",
        "name": "Günlük kalori ihtiyacım nedir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Günlük kalori ihtiyacınız TDEE (Toplam Günlük Enerji Harcaması) ile hesaplanır. Önce BMR (Bazal Metabolizma Hızı) bulunur: erkekler için (10×kilo) + (6.25×boy cm) - (5×yaş) + 5, kadınlar için -161. BMR × aktivite faktörü (hareketsiz 1.2, orta aktif 1.55, çok aktif 1.9) = TDEE. Örnek: BMR 1650, orta aktif → 1650×1.55 = 2558 kcal."
        }
      },
      {
        "@type": "Question",
        "name": "Platform mobil cihazlarda kullanılabilir mi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Evet, besindegerim.com tamamen responsive tasarıma sahiptir. Telefon, tablet ve masaüstü tüm cihazlarda mükemmel çalışır. Mobil tarayıcınızdan (Chrome, Safari) doğrudan kullanabilirsiniz. Arama, detay sayfaları ve hesaplayıcılar mobilde optimize edilmiştir. Uygulama indirmeye gerek yoktur."
        }
      }
    ]
  };
}

/**
 * Serialize JSON-LD schema as HTML script tag
 */
export function serializeSchema(schema: any): string {
  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}
