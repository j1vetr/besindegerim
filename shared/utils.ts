/**
 * Convert category name to SEO-friendly URL slug
 * Handles Turkish characters and normalizes to clean ASCII
 * 
 * @param text - Category name (e.g., "Hayvansal Ürünler")
 * @returns URL-safe slug (e.g., "hayvansal-urunler")
 */
export function categoryToSlug(text: string): string {
  return text
    .replace(/İ/g, "I") // Turkish capital İ → I (will become 'i' in toLowerCase)
    .toLowerCase()
    .normalize("NFD") // Unicode normalization (MUST come early)
    .replace(/[\u0300-\u036f]/g, "") // Remove combining diacritics (like dot above i)
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/\s+ve\s+/g, "-") // "ve" kelimesini "-" ile değiştir
    .replace(/&/g, "") // "&" karakterini kaldır
    .replace(/\s+/g, "-") // Boşlukları "-" ile değiştir
    .replace(/-+/g, "-") // Çift tire varsa tek tire yap
    .replace(/^-|-$/g, ""); // Başta ve sonda tire varsa kaldır
}

/**
 * Find original main category name from slug
 * 
 * @param slug - URL slug (e.g., "hayvansal-urunler")
 * @param categoryGroups - Array of category groups
 * @returns Original main category name or null
 */
export function findMainCategoryBySlug(slug: string, categoryGroups: any[]): string | null {
  for (const group of categoryGroups) {
    if (categoryToSlug(group.mainCategory) === slug) {
      return group.mainCategory;
    }
  }
  return null;
}

/**
 * Find original subcategory name from slug
 * 
 * @param slug - URL slug (e.g., "sebzeler")
 * @param categoryGroups - Array of category groups
 * @returns Original subcategory name or null
 */
export function findSubcategoryBySlug(slug: string, categoryGroups: any[]): string | null {
  for (const group of categoryGroups) {
    for (const subcategory of group.subcategories) {
      if (categoryToSlug(subcategory) === slug) {
        return subcategory;
      }
    }
  }
  return null;
}

/**
 * Find original category name from slug (checks both main and sub)
 * 
 * @param slug - URL slug (e.g., "hayvansal-urunler")
 * @param categoryGroups - Array of category groups
 * @returns Original category name or null
 */
export function findCategoryBySlug(slug: string, categoryGroups: any[]): string | null {
  return findMainCategoryBySlug(slug, categoryGroups) || findSubcategoryBySlug(slug, categoryGroups);
}
