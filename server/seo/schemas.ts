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
 * HomePage FAQ Schema (FAQPage)
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
          "text": "besindegerim.com, Türkiye'nin en kapsamlı besin değerleri platformudur. 266+ gıdanın gerçek porsiyon bazlı kalori, protein, karbonhidrat, yağ ve vitamin/mineral değerlerini sunar. USDA FoodData Central veritabanı ile desteklenen bilimsel veriler içerir. Ücretsiz hesaplayıcılar (BMI, kalori, protein) ve detaylı besin analizleri sağlar."
        }
      },
      {
        "@type": "Question",
        "name": "Besin değerleri doğru mu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Evet, tüm besin değerleri Amerika Tarım Bakanlığı'nın (USDA) FoodData Central veritabanından alınır. Bu, laboratuvar analizleri ve bilimsel çalışmalarla doğrulanmış, dünya çapında kabul görmüş en güvenilir kaynaktır. Veriler düzenli olarak güncellenir ve 20+ vitamin/mineral içerir."
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
        "name": "Hangi gıdaları bulabilirim?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Platformda 266+ gıda bulunur: Meyveler (elma, muz, çilek), sebzeler (domates, brokoli), tahıllar (pirinç, bulgur), et ve tavuk, balık ve deniz ürünleri, süt ürünleri (yoğurt, peynir), kuruyemişler, bakliyatler. Türkiye'de yaygın tüketilen tüm gıdalar kategorilere ayrılmıştır."
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
        "name": "Protein ihtiyacım ne kadar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Protein ihtiyacı hedefinize göre değişir. Sedanter: 0.8-1.0 g/kg, hafif aktif: 1.2-1.4 g/kg, spor yapan: 1.6-2.2 g/kg, kas yapmak isteyen: 2.0-2.5 g/kg vücut ağırlığı başına. 70 kg sporcu için: 70×1.8 = 126 g protein/gün. Yüksek protein diyeti kilo vermede kas korumasına yardımcı olur."
        }
      },
      {
        "@type": "Question",
        "name": "Porsiyon ölçüleri nedir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Porsiyon ölçüleri, gıdaların gerçek tüketim miktarlarıdır. Örnekler: 1 orta elma (182g) = 95 kcal, 1 dilim ekmek (28g) = 74 kcal, 1 su bardağı süt (244g) = 149 kcal, 1 yemek kaşığı zeytinyağı (14g) = 119 kcal. 100g yerine gerçek porsiyon kullanmak günlük kalori takibini kolaylaştırır."
        }
      },
      {
        "@type": "Question",
        "name": "Makro nedir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Makro besinler (makrolar), vücudun büyük miktarlarda ihtiyaç duyduğu besinlerdir: Protein (4 kcal/g) - kas yapımı ve onarımı, Karbonhidrat (4 kcal/g) - enerji kaynağı, Yağ (9 kcal/g) - hormon üretimi ve vitamin emilimi. Dengeli dağılım: protein %25-35, karbonhidrat %40-50, yağ %25-35. Hedef ve aktiviteye göre ayarlanır."
        }
      },
      {
        "@type": "Question",
        "name": "Kilo vermek için kaç kalori yemeliyim?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Kilo vermek için kalori açığı gerekir. Sağlıklı kilo kaybı haftada 0.5-1 kg'dır, bu günlük 500-1000 kalori açığı demektir. TDEE'nizi hesaplayın (örn: 2500 kcal), hedef: 2000-2500 kcal arası. Aşırı kısıtlama (1200 kcal altı) metabolizmayı yavaşlatır. Yüksek protein (%30-35) ve orta karbonhidrat (%35-40) tercih edin."
        }
      },
      {
        "@type": "Question",
        "name": "Vücut yağ yüzdesi nasıl hesaplanır?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vücut yağ yüzdesi Navy Method ile hesaplanır. Erkekler için: boyun, bel ve boy ölçüleri kullanılır. Kadınlar için: boyun, bel, kalça ve boy. Sağlıklı aralıklar: Erkek 10-20%, Kadın 18-28%. Atletik yapı: Erkek 6-13%, Kadın 14-20%. Yüksek yağ oranı (Erkek >25%, Kadın >32%) sağlık riskleri oluşturur."
        }
      },
      {
        "@type": "Question",
        "name": "Günlük su ihtiyacım ne kadar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Günlük su ihtiyacı kilo ve aktiviteye göre değişir. Temel formül: Kilo (kg) × 30-40 ml. 70 kg için: 2.1-2.8 litre/gün. Aktif sporcular: +500-1000 ml ekstra. Sıcak havalarda: +20-40% artış. Belirtiler: açık sarı idrar = yeterli, koyu sarı = daha fazla su için. Günde 8-10 bardak (2-2.5 litre) ortalama hedeftir."
        }
      },
      {
        "@type": "Question",
        "name": "Vitamin ve mineral ihtiyaçlarım nedir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RDA (Günlük Önerilen Alım) değerleri: Vitamin C 75-90 mg, Vitamin D 600-800 IU, Vitamin A 700-900 mcg, Demir 8-18 mg, Kalsiyum 1000-1200 mg, Magnezyum 310-420 mg. Besindegerim.com her gıda için 20+ vitamin/mineral değeri gösterir. Çeşitli beslenme en iyisidir: meyve, sebze, tahıl, protein dengesi."
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
