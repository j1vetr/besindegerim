// SEO Meta Tag Generation and Injection

export interface MetaTags {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export interface FoodMetaData {
  name: string;
  servingLabel: string;
  kcalPerServing: number;
  slug: string;
}

/**
 * Build meta tags for a food detail page
 */
export function buildMetaForFood(data: FoodMetaData): MetaTags {
  const { name, servingLabel, kcalPerServing, slug } = data;
  const baseUrl = process.env.BASE_URL || "https://besindegerim.com";
  const canonical = `${baseUrl}/${slug}`;

  // Long-tail keyword optimized title
  const title = `${name} Kaç Kalori? ${name} Besin Değerleri (Porsiyon Bazlı) | besindegerim.com`;
  const description = `${name} kaç kalori? ${servingLabel} başına ${kcalPerServing} kalori içerir. ✓ ${name} besin değerleri: protein, karbonhidrat, yağ, vitamin ve mineral bilgileri. ✓ Gerçek porsiyon bazlı USDA verisi.`;
  const keywords = `${name} kaç kalori, ${name} besin değerleri, ${name} kalorisi, ${name} protein, ${name} karbonhidrat, ${name} sağlıklı mı, besin tablosu, kalori hesaplama, diyet`;

  return {
    title,
    description,
    keywords,
    canonical,
    // Open Graph
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonical,
    ogImage: `${baseUrl}/og-image.png`, // Default OG image
    // Twitter
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: `${baseUrl}/og-image.png`,
  };
}

/**
 * Build meta tags for the homepage
 */
export function buildMetaForHome(): MetaTags {
  const baseUrl = process.env.BASE_URL || "https://besindegerim.com";
  const title = "Besin Değerleri - Gerçek Porsiyon Bazlı Kalori | besindegerim.com";
  const description =
    "Türkiye'nin en kapsamlı gıda besin değerleri platformu. Gerçek porsiyon bazlı kalori, protein, karbonhidrat ve vitamin bilgileri. Pexels görselleriyle profesyonel besin analizi.";
  const keywords =
    "besin değerleri, kalori hesaplama, porsiyon kalorisi, besin tablosu, sağlıklı beslenme, diyet, protein, karbonhidrat, vitamin";

  return {
    title,
    description,
    keywords,
    canonical: baseUrl,
    ogTitle: title,
    ogDescription: description,
    ogUrl: baseUrl,
    ogImage: `${baseUrl}/og-image.png`,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: `${baseUrl}/og-image.png`,
  };
}

/**
 * Generate JSON-LD structured data for a food item
 */
export function buildFoodJsonLd(data: {
  name: string;
  slug: string;
  servingLabel: string;
  servingSize: number;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
}): object {
  const baseUrl = process.env.BASE_URL || "https://besindegerim.com";

  return {
    "@context": "https://schema.org",
    "@type": "NutritionInformation",
    name: data.name,
    url: `${baseUrl}/${data.slug}`,
    servingSize: `${data.servingSize}g`,
    calories: `${data.calories} kcal`,
    proteinContent: data.protein ? `${data.protein}g` : undefined,
    carbohydrateContent: data.carbs ? `${data.carbs}g` : undefined,
    fatContent: data.fat ? `${data.fat}g` : undefined,
    fiberContent: data.fiber ? `${data.fiber}g` : undefined,
    sugarContent: data.sugar ? `${data.sugar}g` : undefined,
  };
}

/**
 * Generate BreadcrumbList JSON-LD for a food page
 */
export function buildBreadcrumbJsonLd(foodName: string, slug: string): object {
  const baseUrl = process.env.BASE_URL || "https://besindegerim.com";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: foodName,
        item: `${baseUrl}/${slug}`,
      },
    ],
  };
}

/**
 * Generate Organization JSON-LD
 */
export function buildOrganizationJsonLd(): object {
  const baseUrl = process.env.BASE_URL || "https://besindegerim.com";

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Besin Değerim",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "Türkiye'nin en kapsamlı besin değerleri platformu - Gerçek porsiyon bazlı kalori ve besin bilgileri",
  };
}

/**
 * Generate FAQ JSON-LD for Google Featured Snippets
 */
export function buildFAQJsonLd(data: {
  name: string;
  servingLabel: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}): object {
  const proteinText = data.protein ? `${data.protein.toFixed(1)}g protein` : "protein bilgisi mevcut";
  const carbsText = data.carbs ? `${data.carbs.toFixed(1)}g karbonhidrat` : "karbonhidrat bilgisi mevcut";
  const fatText = data.fat ? `${data.fat.toFixed(1)}g yağ` : "yağ bilgisi mevcut";
  const fiberText = data.fiber ? ` ${data.fiber.toFixed(1)}g lif,` : "";

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${data.name} kaç kalori?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${data.name}, ${data.servingLabel} başına ${data.calories} kalori içerir. Bu değer gerçek porsiyon bazlı USDA verilerine göre hesaplanmıştır.`,
        },
      },
      {
        "@type": "Question",
        name: `${data.name} besin değerleri nedir?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${data.name} besin değerleri (${data.servingLabel} başına): ${data.calories} kalori, ${proteinText}, ${carbsText}, ${fatText}${fiberText} içerir.`,
        },
      },
      {
        "@type": "Question",
        name: `${data.name} sağlıklı mı?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${data.name}, dengeli beslenme programının bir parçası olarak tüketilebilir. ${data.servingLabel} başına ${data.calories} kalori içerir ve besin değerleri açısından ${proteinText}, ${carbsText} ve ${fatText} sağlar.`,
        },
      },
      {
        "@type": "Question",
        name: `${data.name} porsiyon miktarı ne kadar?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${data.name} için standart porsiyon miktarı ${data.servingLabel} olarak tanımlanmıştır. Bu porsiyon ${data.calories} kalori içerir.`,
        },
      },
    ],
  };
}

/**
 * Generate Article JSON-LD for better content recognition
 */
export function buildArticleJsonLd(data: {
  name: string;
  slug: string;
  calories: number;
  servingLabel: string;
}): object {
  const baseUrl = process.env.BASE_URL || "https://besindegerim.com";
  const currentDate = new Date().toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${data.name} Kaç Kalori? ${data.name} Besin Değerleri`,
    description: `${data.name} ${data.servingLabel} başına ${data.calories} kalori içerir. Detaylı besin değerleri, protein, karbonhidrat, yağ, vitamin ve mineral bilgileri.`,
    author: {
      "@type": "Organization",
      name: "Besin Değerim",
    },
    publisher: {
      "@type": "Organization",
      name: "Besin Değerim",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    datePublished: currentDate,
    dateModified: currentDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${data.slug}`,
    },
    image: `${baseUrl}/og-image.png`,
    url: `${baseUrl}/${data.slug}`,
  };
}

/**
 * Inject meta tags into HTML template using REPLACE strategy
 * Bu duplicate meta tag'leri önler - Örnek projedeki gibi
 * @param htmlTemplate - HTML template (client/index.html)
 * @param meta - Meta tags object
 * @param jsonLdArray - Array of JSON-LD objects
 * @returns HTML with replaced meta tags
 */
export function injectHead(
  htmlTemplate: string,
  meta: MetaTags,
  jsonLdArray: object[] = []
): string {
  let result = htmlTemplate;

  // ✅ REPLACE strategy - Duplicate önler
  // Title
  result = result.replace(/<title>.*?<\/title>/s, `<title>${meta.title}</title>`);
  
  // Primary Meta Tags
  result = result.replace(
    /<meta name="title"[^>]*>/,
    `<meta name="title" content="${meta.title}" />`
  );
  result = result.replace(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${meta.description}" />`
  );
  result = result.replace(
    /<meta name="keywords"[^>]*>/,
    `<meta name="keywords" content="${meta.keywords}" />`
  );
  result = result.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${meta.canonical}" />`
  );

  // Open Graph
  result = result.replace(
    /<meta property="og:url"[^>]*>/,
    `<meta property="og:url" content="${meta.ogUrl || meta.canonical}" />`
  );
  result = result.replace(
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${meta.ogTitle || meta.title}" />`
  );
  result = result.replace(
    /<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${meta.ogDescription || meta.description}" />`
  );
  result = result.replace(
    /<meta property="og:image"[^>]*>/,
    `<meta property="og:image" content="${meta.ogImage || ""}" />`
  );

  // Twitter
  result = result.replace(
    /<meta property="twitter:card"[^>]*>/,
    `<meta property="twitter:card" content="${meta.twitterCard || "summary_large_image"}" />`
  );
  result = result.replace(
    /<meta property="twitter:url"[^>]*>/,
    `<meta property="twitter:url" content="${meta.ogUrl || meta.canonical}" />`
  );
  result = result.replace(
    /<meta property="twitter:title"[^>]*>/,
    `<meta property="twitter:title" content="${meta.twitterTitle || meta.title}" />`
  );
  result = result.replace(
    /<meta property="twitter:description"[^>]*>/,
    `<meta property="twitter:description" content="${meta.twitterDescription || meta.description}" />`
  );
  result = result.replace(
    /<meta property="twitter:image"[^>]*>/,
    `<meta property="twitter:image" content="${meta.twitterImage || meta.ogImage || ""}" />`
  );

  // JSON-LD Structured Data (</head> tag'inden önce ekle)
  if (jsonLdArray.length > 0) {
    const jsonLdScripts = jsonLdArray
      .map(
        (jsonLd) =>
          `    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
      )
      .join("\n");
    
    result = result.replace(
      /<\/head>/,
      `\n${jsonLdScripts}\n  </head>`
    );
  }

  return result;
}
