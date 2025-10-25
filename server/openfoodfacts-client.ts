/**
 * OpenFoodFacts API Client
 * Fetches product images and nutrition data from Open Food Facts database
 */

interface OpenFoodFactsProduct {
  product?: {
    image_url?: string;
    image_front_url?: string;
    image_nutrition_url?: string;
    product_name?: string;
    product_name_tr?: string;
  };
}

/**
 * Search for a food product on OpenFoodFacts and return image URL
 */
export async function searchOpenFoodFactsImage(
  foodName: string
): Promise<string | null> {
  try {
    // Search by product name
    const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      foodName
    )}&search_simple=1&action=process&json=1&page_size=1`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.products && searchData.products.length > 0) {
      const product = searchData.products[0];
      // Try different image fields in order of preference
      return (
        product.image_url ||
        product.image_front_url ||
        product.image_nutrition_url ||
        null
      );
    }

    return null;
  } catch (error) {
    console.error("OpenFoodFacts search error:", error);
    return null;
  }
}

/**
 * Get product by barcode from OpenFoodFacts
 */
export async function getOpenFoodFactsProductByBarcode(
  barcode: string
): Promise<string | null> {
  try {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    const response = await fetch(url);
    const data: OpenFoodFactsProduct = await response.json();

    if (data.product) {
      return (
        data.product.image_url ||
        data.product.image_front_url ||
        data.product.image_nutrition_url ||
        null
      );
    }

    return null;
  } catch (error) {
    console.error("OpenFoodFacts barcode lookup error:", error);
    return null;
  }
}

/**
 * Search Wikimedia Commons for food images (fallback)
 */
export async function searchWikimediaImage(
  foodName: string
): Promise<string | null> {
  try {
    // Use Wikimedia Commons API
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      foodName + " food"
    )}&srnamespace=6&format=json&srlimit=1`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (
      searchData.query &&
      searchData.query.search &&
      searchData.query.search.length > 0
    ) {
      const firstResult = searchData.query.search[0];
      const fileName = firstResult.title.replace("File:", "");

      // Get image info
      const imageUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(
        fileName
      )}&prop=imageinfo&iiprop=url&format=json`;

      const imageResponse = await fetch(imageUrl);
      const imageData = await imageResponse.json();

      const pages = imageData.query?.pages;
      if (pages) {
        const pageId = Object.keys(pages)[0];
        const imageUrl = pages[pageId]?.imageinfo?.[0]?.url;
        return imageUrl || null;
      }
    }

    return null;
  } catch (error) {
    console.error("Wikimedia search error:", error);
    return null;
  }
}

/**
 * Get food image from OpenFoodFacts or Wikimedia Commons
 * Tries OpenFoodFacts first, then falls back to Wikimedia
 */
export async function getFoodImage(
  foodName: string,
  turkishName?: string
): Promise<string | null> {
  // Try Turkish name first if provided
  if (turkishName) {
    const offImage = await searchOpenFoodFactsImage(turkishName);
    if (offImage) return offImage;
  }

  // Try English name
  const offImage = await searchOpenFoodFactsImage(foodName);
  if (offImage) return offImage;

  // Fallback to Wikimedia Commons
  if (turkishName) {
    const wikiImage = await searchWikimediaImage(turkishName);
    if (wikiImage) return wikiImage;
  }

  const wikiImage = await searchWikimediaImage(foodName);
  return wikiImage;
}
