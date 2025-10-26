// Open Food Facts API client for fetching product images
// Documentation: https://openfoodfacts.github.io/openfoodfacts-server/api/

const OPEN_FOOD_FACTS_API = 'https://world.openfoodfacts.org/api/v2';

interface OFFProduct {
  code: string;
  product_name?: string;
  brands?: string;
  selected_images?: {
    front?: {
      display?: Record<string, string>;
      small?: Record<string, string>;
    };
  };
  image_url?: string;
}

interface OFFSearchResponse {
  count: number;
  page: number;
  page_size: number;
  products: OFFProduct[];
}

/**
 * Turkish to English food name mapping for better search results
 */
const turkishToEnglish: Record<string, string> = {
  'domates': 'tomato',
  'salatalık': 'cucumber',
  'elma': 'apple',
  'armut': 'pear',
  'muz': 'banana',
  'portakal': 'orange',
  'mandalina': 'mandarin',
  'limon': 'lemon',
  'üzüm': 'grape',
  'çilek': 'strawberry',
  'kiraz': 'cherry',
  'şeftali': 'peach',
  'kayısı': 'apricot',
  'karpuz': 'watermelon',
  'kavun': 'melon',
  'havuç': 'carrot',
  'patates': 'potato',
  'soğan': 'onion',
  'sarımsak': 'garlic',
  'biber': 'pepper',
  'patlıcan': 'eggplant',
  'kabak': 'zucchini',
  'brokoli': 'broccoli',
  'karnabahar': 'cauliflower',
  'lahana': 'cabbage',
  'ıspanak': 'spinach',
  'marul': 'lettuce',
  'roka': 'arugula',
  'maydanoz': 'parsley',
  'kekik': 'thyme',
  'fesleğen': 'basil',
  'nane': 'mint',
  'kırmızı lahana': 'red cabbage',
  'beyaz lahana': 'white cabbage',
  'brüksel lahanası': 'brussels sprouts',
  'kale': 'kale',
  'tavuk': 'chicken',
  'tavuk göğsü': 'chicken breast',
  'tavuk but': 'chicken thigh',
  'sığır eti': 'beef',
  'dana eti': 'veal',
  'kuzu eti': 'lamb',
  'hindi': 'turkey',
  'balık': 'fish',
  'somon': 'salmon',
  'ton balığı': 'tuna',
  'levrek': 'sea bass',
  'çupra': 'sea bream',
  'hamsi': 'anchovy',
  'sardalya': 'sardine',
  'karides': 'shrimp',
  'yumurta': 'egg',
  'süt': 'milk',
  'yoğurt': 'yogurt',
  'peynir': 'cheese',
  'beyaz peynir': 'feta cheese',
  'kaşar': 'cheddar',
  'tereyağı': 'butter',
  'krema': 'cream',
  'ekmek': 'bread',
  'beyaz ekmek': 'white bread',
  'tam buğday ekmeği': 'whole wheat bread',
  'kepekli ekmek': 'whole grain bread',
  'çavdar ekmeği': 'rye bread',
  'pirinç': 'rice',
  'makarna': 'pasta',
  'bulgur': 'bulgur',
  'yulaf': 'oats',
  'yulaf ezmesi': 'oatmeal',
  'mısır': 'corn',
  'nohut': 'chickpea',
  'mercimek': 'lentil',
  'fasulye': 'beans',
  'kuru fasulye': 'dry beans',
  'barbunya': 'kidney beans',
  'bezelye': 'peas',
  'soya fasulyesi': 'soybean',
  'badem': 'almond',
  'ceviz': 'walnut',
  'fındık': 'hazelnut',
  'fıstık': 'peanut',
  'kaju': 'cashew',
  'antep fıstığı': 'pistachio',
  'bal': 'honey',
  'reçel': 'jam',
  'çikolata': 'chocolate',
  'kakao': 'cocoa',
  'şeker': 'sugar',
  'tuz': 'salt',
  'zeytinyağı': 'olive oil',
  'ayçiçek yağı': 'sunflower oil',
  'mısır yağı': 'corn oil',
  'zeytin': 'olive',
  'siyah zeytin': 'black olive',
  'yeşil zeytin': 'green olive',
  'ketçap': 'ketchup',
  'mayonez': 'mayonnaise',
  'hardal': 'mustard',
  'sirke': 'vinegar',
  'soya sosu': 'soy sauce',
  'su': 'water',
  'çay': 'tea',
  'kahve': 'coffee',
  'kola': 'cola',
  'portakal suyu': 'orange juice',
  'elma suyu': 'apple juice',
  'ayran': 'ayran',
  'simit': 'simit',
  'poğaça': 'pogaca',
  'börek': 'borek',
  'pide': 'pide',
  'lahmacun': 'lahmacun',
  'pizza': 'pizza',
  'hamburger': 'hamburger',
  'sandviç': 'sandwich',
  'tost': 'toast',
  'kruvasan': 'croissant',
  'kurabiye': 'cookie',
  'kek': 'cake',
  'pasta': 'pastry',
  'dondurma': 'ice cream',
  'puding': 'pudding',
  'sütlaç': 'rice pudding',
  'baklava': 'baklava',
  'lokum': 'turkish delight',
  'helva': 'halva',
  'mısır gevreği': 'corn flakes',
  'granola': 'granola',
  'müsli': 'muesli',
  'zerdeçal': 'turmeric',
  'zencefil': 'ginger',
  'tarçın': 'cinnamon',
  'karabiber': 'black pepper',
  'kırmızı biber': 'red pepper',
  'pul biber': 'chili flakes',
  'kimyon': 'cumin',
  'kişniş': 'coriander',
  'sumak': 'sumac',
  'bambu filizi': 'bamboo shoots',
  'çin lahanası': 'chinese cabbage',
  'deniz yosunu - wakame': 'wakame seaweed',
  'deniz yosunu - nori': 'nori seaweed',
  'deniz yosunu': 'seaweed',
  'wakame': 'wakame',
  'nori': 'nori',
  'su teresi': 'watercress',
};

/**
 * Translate Turkish food name to English
 */
function translateToEnglish(turkishName: string): string {
  const lowerName = turkishName.toLowerCase().trim();
  
  // Direct match
  if (turkishToEnglish[lowerName]) {
    return turkishToEnglish[lowerName];
  }
  
  // Try word boundary matches (e.g., "Domates Suyu" -> "tomato juice")
  // Split into words and match whole words only
  const words = lowerName.split(/[\s-]+/);
  const translatedWords: string[] = [];
  
  for (const word of words) {
    if (turkishToEnglish[word]) {
      translatedWords.push(turkishToEnglish[word]);
    } else {
      translatedWords.push(word);
    }
  }
  
  // If we found any translations, return the combined result
  if (translatedWords.some((w, i) => w !== words[i])) {
    return translatedWords.join(' ');
  }
  
  // Return original if no translation found
  return turkishName;
}

/**
 * Check if product is relevant (not a beverage or supplement)
 */
function isProductRelevant(product: OFFProduct, searchTerm: string): boolean {
  const productName = (product.product_name || '').toLowerCase();
  const brands = (product.brands || '').toLowerCase();
  const combined = `${productName} ${brands}`;
  
  // Strict blacklist: Only exclude obvious non-food items
  const blacklist = ['water', 'soda', 'cola', 'supplement', 'vitamin', 'pill', 'medicine'];
  for (const word of blacklist) {
    if (combined.includes(word)) {
      return false;
    }
  }
  
  // No strict whitelist - accept any product (Open Food Facts mostly has food anyway)
  return true;
}

/**
 * Search Open Food Facts for products and get the best image
 */
export async function searchOpenFoodFactsImage(foodName: string): Promise<string | null> {
  try {
    // Translate to English for better results
    const englishName = translateToEnglish(foodName);
    
    console.log(`🔍 Open Food Facts: searching for "${englishName}" (from: ${foodName})`);
    
    const response = await fetch(
      `${OPEN_FOOD_FACTS_API}/search?` + new URLSearchParams({
        search_terms: englishName,
        fields: 'code,product_name,brands,selected_images,image_url',
        page_size: '20',
        sort_by: 'unique_scans_n'  // Use unique scans instead of popularity
      }),
      {
        headers: {
          'User-Agent': 'BesinDegerim/1.0 (Turkish Nutrition Platform)',
        },
      }
    );

    if (!response.ok) {
      console.error(`Open Food Facts API error: ${response.status}`);
      return null;
    }

    const data = await response.json() as OFFSearchResponse;

    if (!data.products || data.products.length === 0) {
      console.log(`⚠️  No products found for: ${englishName}`);
      return null;
    }

    // Filter relevant products first
    const relevantProducts = data.products.filter(p => isProductRelevant(p, englishName));
    
    if (relevantProducts.length === 0) {
      console.log(`⚠️  No relevant products found for: ${englishName}`);
      return null;
    }

    // Try to get the best image from relevant products
    for (const product of relevantProducts.slice(0, 3)) {
      // Priority 1: Selected front image (display size, English)
      const frontImage = product.selected_images?.front?.display?.en 
        || product.selected_images?.front?.display?.['']
        || Object.values(product.selected_images?.front?.display || {})[0];
      
      if (frontImage) {
        console.log(`✅ Open Food Facts: found image for "${englishName}": ${product.product_name || 'Unknown'}`);
        return frontImage;
      }
      
      // Priority 2: Generic image_url field
      if (product.image_url) {
        console.log(`✅ Open Food Facts: found generic image for "${englishName}": ${product.product_name || 'Unknown'}`);
        return product.image_url;
      }
    }

    console.log(`⚠️  Open Food Facts: products found but no images for: ${englishName}`);
    return null;
  } catch (error) {
    console.error('Error fetching Open Food Facts image:', error);
    return null;
  }
}
