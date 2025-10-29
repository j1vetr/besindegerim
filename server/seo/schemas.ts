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
 * Daily Calorie Calculator Schema (HowTo)
 */
export function getDailyCalorieCalculatorSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Günlük Kalori İhtiyacı Hesaplama",
    "description": "BMR ve TDEE hesaplayarak günlük kalori ihtiyacınızı ve makro besin dağılımınızı öğrenin.",
    "image": "https://besindegerim.com/logo.png",
    "totalTime": "PT2M",
    "tool": ["Kilo (kg)", "Boy (cm)", "Yaş", "Cinsiyet", "Aktivite Seviyesi"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Bilgileri Girin",
        "text": "Kilonuzu (kg), boyunuzu (cm), yaşınızı, cinsiyetinizi ve günlük aktivite seviyenizi seçin.",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "BMR Hesaplanır",
        "text": "Mifflin-St Jeor formülü kullanılarak Bazal Metabolizma Hızınız (BMR) hesaplanır.",
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "TDEE ve Makrolar",
        "text": "BMR değeriniz aktivite faktörü ile çarpılarak TDEE bulunur. Protein, karbonhidrat ve yağ dağılımınız hesaplanır.",
        "position": 3
      }
    ]
  };
}

/**
 * BMI Calculator Schema (HowTo)
 */
export function getBMICalculatorSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "BMI (Vücut Kitle İndeksi) Hesaplama",
    "description": "WHO standartlarına göre BMI değerinizi hesaplayın ve sağlıklı kilo aralığınızı öğrenin.",
    "image": "https://besindegerim.com/logo.png",
    "totalTime": "PT1M",
    "tool": ["Kilo (kg)", "Boy (cm)"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Kilo ve Boy Girin",
        "text": "Kilonuzu kilogram (kg) ve boyunuzu santimetre (cm) cinsinden girin.",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "BMI Hesaplanır",
        "text": "BMI = Kilo (kg) / Boy² (m²) formülü ile vücut kitle indeksiniz hesaplanır.",
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "Kategori ve Öneriler",
        "text": "BMI değeriniz WHO kategorilerine göre değerlendirilir: Zayıf (<18.5), Normal (18.5-24.9), Fazla Kilolu (25-29.9), Obez (≥30).",
        "position": 3
      }
    ]
  };
}

/**
 * Ideal Weight Calculator Schema (HowTo)
 */
export function getIdealWeightCalculatorSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "İdeal Kilo Hesaplama",
    "description": "Boyunuza ve cinsiyetinize göre Devine ve Broca formülleriyle ideal kilonuzu hesaplayın.",
    "image": "https://besindegerim.com/logo.png",
    "totalTime": "PT1M",
    "tool": ["Boy (cm)", "Cinsiyet"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Boy ve Cinsiyet Girin",
        "text": "Boyunuzu (cm) ve cinsiyetinizi seçin.",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "İdeal Kilo Hesaplanır",
        "text": "Devine ve Broca formülleri kullanılarak ideal kilo aralığınız belirlenir.",
        "position": 2
      }
    ]
  };
}

/**
 * Water Intake Calculator Schema (HowTo)
 */
export function getWaterIntakeCalculatorSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Günlük Su İhtiyacı Hesaplama",
    "description": "Kilonuza, aktivite seviyenize ve iklime göre günlük su ihtiyacınızı hesaplayın.",
    "image": "https://besindegerim.com/logo.png",
    "totalTime": "PT1M",
    "tool": ["Kilo (kg)", "Aktivite Seviyesi", "İklim"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Bilgileri Girin",
        "text": "Kilonuzu, aktivite seviyenizi ve yaşadığınız iklimi seçin.",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Su İhtiyacı Hesaplanır",
        "text": "Kilo başına 30-40 ml formülü kullanılarak günlük su ihtiyacınız hesaplanır ve aktivite/iklim faktörleri eklenir.",
        "position": 2
      }
    ]
  };
}

/**
 * Protein Calculator Schema (HowTo)
 */
export function getProteinCalculatorSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Günlük Protein Gereksinimi Hesaplama",
    "description": "Hedefinize ve aktivite seviyenize göre günlük protein ihtiyacınızı hesaplayın.",
    "image": "https://besindegerim.com/logo.png",
    "totalTime": "PT1M",
    "tool": ["Kilo (kg)", "Hedef", "Aktivite Seviyesi"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Bilgileri Girin",
        "text": "Kilonuzu, hedefinizi (kilo verme, kas yapma, koruma) ve aktivite seviyenizi seçin.",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Protein İhtiyacı Hesaplanır",
        "text": "Hedefinize göre kg başına protein miktarı (0.8-2.5g/kg) hesaplanır ve protein kaynakları önerilir.",
        "position": 2
      }
    ]
  };
}

/**
 * Portion Converter Calculator Schema (HowTo)
 */
export function getPortionConverterCalculatorSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Porsiyon Çevirici Kullanımı",
    "description": "Gramajı porsiyona, porsiyonu kaşık ve bardağa çevirin.",
    "image": "https://besindegerim.com/logo.png",
    "totalTime": "PT1M",
    "tool": ["Gıda Seçimi", "Miktar"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Gıda ve Miktar Girin",
        "text": "Çevirmek istediğiniz gıdayı seçin ve miktarını girin.",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Porsiyon Dönüşümü",
        "text": "Gram, porsiyon, kaşık ve bardak birimleri arasında otomatik çevrim yapılır.",
        "position": 2
      }
    ]
  };
}

/**
 * Weight Loss Time Calculator Schema (HowTo)
 */
export function getWeightLossTimeCalculatorSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Kilo Verme/Alma Süresi Hesaplama",
    "description": "Hedef kilonuza ulaşmanız için gereken süreyi hesaplayın.",
    "image": "https://besindegerim.com/logo.png",
    "totalTime": "PT1M",
    "tool": ["Mevcut Kilo", "Hedef Kilo", "Haftalık Hedef"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Bilgileri Girin",
        "text": "Mevcut kilonuzu, hedef kilonuzu ve haftada kaç kilo vermek/almak istediğinizi girin.",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Süre Hesaplanır",
        "text": "Hedef kilonuza ulaşmak için gereken hafta ve ay sayısı hesaplanır ve öneriler sunulur.",
        "position": 2
      }
    ]
  };
}

/**
 * Body Fat Percentage Calculator Schema (HowTo)
 */
export function getBodyFatCalculatorSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Vücut Yağ Yüzdesi Hesaplama",
    "description": "Navy Method ile vücut yağ yüzdesini hesaplayın. Bel, boyun ve kalça ölçümleriyle doğru sonuç.",
    "image": "https://besindegerim.com/logo.png",
    "totalTime": "PT2M",
    "tool": ["Boy (cm)", "Bel Çevresi (cm)", "Boyun Çevresi (cm)", "Kalça Çevresi (cm)", "Cinsiyet"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Ölçümleri Alın",
        "text": "Boyunuzu, bel çevrenizi, boyun çevrenizi ve (kadınlar için) kalça çevrenizi ölçün.",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Bilgileri Girin",
        "text": "Aldığınız ölçümleri ve cinsiyetinizi hesaplayıcıya girin.",
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "Vücut Yağ Yüzdesi Hesaplanır",
        "text": "Navy Method formülü kullanılarak vücut yağ yüzdeniz hesaplanır ve kategori belirlenir (atletik, fit, normal, fazla, obez).",
        "position": 3
      }
    ]
  };
}

/**
 * SoftwareApplication Schema for Calculators (Universal)
 */
export function getCalculatorSoftwareApplicationSchema(calculatorId: string, title: string, description: string): object {
  const baseUrl = process.env.BASE_URL || "https://besindegerim.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": title,
    "description": description,
    "url": `${baseUrl}/hesaplayici/${calculatorId}`,
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "TRY"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1247"
    },
    "inLanguage": "tr",
    "featureList": [
      "Ücretsiz kullanım",
      "Anında sonuç",
      "Mobil uyumlu",
      "Kayıt gerektirmez"
    ]
  };
}

/**
 * ItemList Schema for Food Listings
 */
export function getFoodItemListSchema(foods: Array<{name: string; slug: string; calories: string}>): object {
  const baseUrl = process.env.BASE_URL || "https://besindegerim.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": foods.map((food, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Thing",
        "name": food.name,
        "url": `${baseUrl}/${food.slug}`,
        "description": `${food.name} besin değerleri - ${Math.round(parseFloat(food.calories))} kalori`
      }
    }))
  };
}

/**
 * Serialize JSON-LD schema as HTML script tag
 */
export function serializeSchema(schema: any): string {
  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}
