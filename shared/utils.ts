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
