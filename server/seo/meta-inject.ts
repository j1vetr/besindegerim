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
  const baseUrl = process.env.BASE_URL || "https://kacgram.net";
  const canonical = `${baseUrl}/${slug}`;

  const title = `${name} Besin Değerleri - ${kcalPerServing} kcal | kacgram.net`;
  const description = `${name} gıdasının gerçek porsiyon bazlı besin değerleri: ${servingLabel} başına ${kcalPerServing} kalori. Protein, karbonhidrat, yağ ve vitamin bilgileri.`;
  const keywords = `${name}, kalori, besin değeri, ${name} kalorisi, gıda, beslenme, sağlıklı yaşam, diyet`;

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
  const baseUrl = process.env.BASE_URL || "https://kacgram.net";
  const title = "Gıda Besin Değerleri - Gerçek Porsiyon Bazlı Kalori | kacgram.net";
  const description =
    "Türkiye'nin en kapsamlı gıda besin değerleri veritabanı. Gerçek porsiyon bazlı kalori, protein, karbonhidrat ve vitamin bilgileri. USDA verilerine dayalı doğru besin analizi.";
  const keywords =
    "gıda besin değerleri, kalori hesaplama, porsiyon kalorisi, besin tablosu, sağlıklı beslenme, diyet, protein, karbonhidrat, vitamin";

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
  const baseUrl = process.env.BASE_URL || "https://kacgram.net";

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
  const baseUrl = process.env.BASE_URL || "https://kacgram.net";

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
  const baseUrl = process.env.BASE_URL || "https://kacgram.net";

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "kacgram.net",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "Gerçek porsiyon bazlı gıda besin değerleri ve kalori bilgileri",
  };
}

/**
 * Inject meta tags and JSON-LD into HTML head
 * @param htmlBody - The rendered HTML body content
 * @param meta - Meta tags object
 * @param jsonLdArray - Array of JSON-LD objects
 * @returns Complete HTML document with head and body
 */
export function injectHead(
  htmlBody: string,
  meta: MetaTags,
  jsonLdArray: object[] = []
): string {
  const jsonLdScripts = jsonLdArray
    .map(
      (jsonLd) =>
        `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
    )
    .join("\n    ");

  const html = `<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    
    <!-- Primary Meta Tags -->
    <title>${meta.title}</title>
    <meta name="title" content="${meta.title}" />
    <meta name="description" content="${meta.description}" />
    <meta name="keywords" content="${meta.keywords}" />
    <link rel="canonical" href="${meta.canonical}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${meta.ogUrl || meta.canonical}" />
    <meta property="og:title" content="${meta.ogTitle || meta.title}" />
    <meta property="og:description" content="${meta.ogDescription || meta.description}" />
    <meta property="og:image" content="${meta.ogImage || ""}" />
    <meta property="og:locale" content="tr_TR" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="${meta.twitterCard || "summary_large_image"}" />
    <meta property="twitter:url" content="${meta.ogUrl || meta.canonical}" />
    <meta property="twitter:title" content="${meta.twitterTitle || meta.title}" />
    <meta property="twitter:description" content="${meta.twitterDescription || meta.description}" />
    <meta property="twitter:image" content="${meta.twitterImage || meta.ogImage || ""}" />
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Structured Data -->
    ${jsonLdScripts}
  </head>
  <body>
    ${htmlBody}
  </body>
</html>`;

  return html;
}
