/**
 * Wikipedia/Wikimedia Commons Client
 * Fetches images from Wikimedia Commons for food items
 */

const WIKIPEDIA_API = 'https://en.wikipedia.org/w/api.php';
const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';

interface WikipediaSearchResult {
  query?: {
    pages?: Record<string, {
      pageid: number;
      title: string;
      thumbnail?: {
        source: string;
        width: number;
        height: number;
      };
      original?: {
        source: string;
        width: number;
        height: number;
      };
    }>;
  };
}

interface CommonsSearchResult {
  query?: {
    search?: Array<{
      title: string;
    }>;
  };
}

interface CommonsImageInfo {
  query?: {
    pages?: Record<string, {
      imageinfo?: Array<{
        url: string;
        thumburl?: string;
        descriptionurl: string;
      }>;
    }>;
  };
}

/**
 * Turkish to English food name translations
 */
const FOOD_TRANSLATIONS: Record<string, string> = {
  // Fruits
  'elma': 'apple',
  'armut': 'pear',
  'muz': 'banana',
  'portakal': 'orange',
  'mandalina': 'mandarin',
  'greyfurt': 'grapefruit',
  'limon': 'lemon',
  'çilek': 'strawberry',
  'kiraz': 'cherry',
  'vişne': 'sour cherry',
  'şeftali': 'peach',
  'kayısı': 'apricot',
  'erik': 'plum',
  'karpuz': 'watermelon',
  'kavun': 'melon',
  'üzüm': 'grape',
  'kivi': 'kiwi',
  'ananas': 'pineapple',
  'mango': 'mango',
  'avokado': 'avocado',
  'incir': 'fig',
  'nar': 'pomegranate',
  'böğürtlen': 'blackberry',
  'ahududu': 'raspberry',
  'yaban mersini': 'blueberry',
  
  // Vegetables
  'domates': 'tomato',
  'salatalık': 'cucumber',
  'biber': 'pepper',
  'patlıcan': 'eggplant',
  'kabak': 'zucchini',
  'havuç': 'carrot',
  'patates': 'potato',
  'soğan': 'onion',
  'sarımsak': 'garlic',
  'marul': 'lettuce',
  'ıspanak': 'spinach',
  'brokoli': 'broccoli',
  'karnabahar': 'cauliflower',
  'lahana': 'cabbage',
  'kereviz': 'celery',
  'pırasa': 'leek',
  'bezelye': 'pea',
  'fasulye': 'bean',
  'nohut': 'chickpea',
  'mercimek': 'lentil',
  'mantar': 'mushroom',
  'roka': 'arugula',
  'maydanoz': 'parsley',
  'dereotu': 'dill',
  'fesleğen': 'basil',
  'nane': 'mint',
  'kekik': 'thyme',
  'biberiye': 'rosemary',
  
  // Meat & Protein
  'tavuk': 'chicken',
  'tavuk göğsü': 'chicken breast',
  'tavuk but': 'chicken thigh',
  'hindi': 'turkey',
  'dana eti': 'beef',
  'kuzu eti': 'lamb',
  'balık': 'fish',
  'somon': 'salmon',
  'ton balığı': 'tuna',
  'levrek': 'sea bass',
  'hamsi': 'anchovy',
  'yumurta': 'egg',
  'peynir': 'cheese',
  'beyaz peynir': 'white cheese',
  'kaşar': 'cheddar',
  'süt': 'milk',
  'yoğurt': 'yogurt',
  
  // Nuts & Seeds
  'badem': 'almond',
  'ceviz': 'walnut',
  'fındık': 'hazelnut',
  'fıstık': 'peanut',
  'antep fıstığı': 'pistachio',
  'kaju': 'cashew',
  'ayçiçeği çekirdeği': 'sunflower seed',
  'kabak çekirdeği': 'pumpkin seed',
  'susam': 'sesame',
  'chia tohumu': 'chia seed',
  'keten tohumu': 'flax seed',
  
  // Grains
  'buğday': 'wheat',
  'pirinç': 'rice',
  'yulaf': 'oat',
  'arpa': 'barley',
  'mısır': 'corn',
  'quinoa': 'quinoa',
  'bulgur': 'bulgur',
  
  // Other
  'bal': 'honey',
  'zeytin': 'olive',
  'zeytinyağı': 'olive oil',
  'tereyağı': 'butter',
  'çikolata': 'chocolate',
  'kahve': 'coffee',
  'çay': 'tea',
};

/**
 * Translate Turkish food name to English
 */
function translateToEnglish(turkishName: string): string {
  const normalized = turkishName.toLowerCase().trim();
  return FOOD_TRANSLATIONS[normalized] || turkishName;
}

/**
 * Search Wikipedia for an image
 */
export async function searchWikipediaImage(foodName: string): Promise<string | null> {
  try {
    const englishName = translateToEnglish(foodName);
    console.log(`🔍 Wikipedia: searching for "${englishName}" (from: ${foodName})`);

    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      prop: 'pageimages|pageterms',
      piprop: 'original|thumbnail',
      pithumbsize: '800',
      titles: englishName,
      origin: '*',
    });

    const response = await fetch(`${WIKIPEDIA_API}?${params}`, {
      headers: {
        'User-Agent': 'BesinDegerim/1.0 (Turkish Nutrition Platform)',
      },
    });

    if (!response.ok) {
      console.error(`Wikipedia API error: ${response.status}`);
      return null;
    }

    const data = await response.json() as WikipediaSearchResult;
    const pages = data.query?.pages;

    if (!pages) {
      console.log(`⚠️  No Wikipedia page found for: ${englishName}`);
      return null;
    }

    const page = Object.values(pages)[0];
    const imageUrl = page.original?.source || page.thumbnail?.source;

    if (imageUrl) {
      console.log(`✅ Wikipedia: found image for "${englishName}"`);
      return imageUrl;
    }

    console.log(`⚠️  Wikipedia page found but no image for: ${englishName}`);
    return null;
  } catch (error) {
    console.error('Error fetching Wikipedia image:', error);
    return null;
  }
}

/**
 * Search Wikimedia Commons for an image
 */
export async function searchCommonsImage(foodName: string): Promise<string | null> {
  try {
    const englishName = translateToEnglish(foodName);
    console.log(`🔍 Commons: searching for "${englishName}" (from: ${foodName})`);

    // Step 1: Search for files
    const searchParams = new URLSearchParams({
      action: 'query',
      format: 'json',
      list: 'search',
      srsearch: englishName,
      srnamespace: '6',
      srlimit: '5',
      origin: '*',
    });

    const searchResponse = await fetch(`${COMMONS_API}?${searchParams}`, {
      headers: {
        'User-Agent': 'BesinDegerim/1.0 (Turkish Nutrition Platform)',
      },
    });

    if (!searchResponse.ok) {
      console.error(`Commons search error: ${searchResponse.status}`);
      return null;
    }

    const searchData = await searchResponse.json() as CommonsSearchResult;
    const results = searchData.query?.search;

    if (!results || results.length === 0) {
      console.log(`⚠️  No Commons files found for: ${englishName}`);
      return null;
    }

    // Step 2: Get image info for the first result
    const firstResult = results[0].title;
    const imageParams = new URLSearchParams({
      action: 'query',
      format: 'json',
      prop: 'imageinfo',
      iiprop: 'url',
      iiurlwidth: '800',
      titles: firstResult,
      origin: '*',
    });

    const imageResponse = await fetch(`${COMMONS_API}?${imageParams}`, {
      headers: {
        'User-Agent': 'BesinDegerim/1.0 (Turkish Nutrition Platform)',
      },
    });

    if (!imageResponse.ok) {
      console.error(`Commons image info error: ${imageResponse.status}`);
      return null;
    }

    const imageData = await imageResponse.json() as CommonsImageInfo;
    const pages = imageData.query?.pages;

    if (!pages) {
      return null;
    }

    const page = Object.values(pages)[0];
    const imageUrl = page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url;

    if (imageUrl) {
      console.log(`✅ Commons: found image for "${englishName}"`);
      return imageUrl;
    }

    console.log(`⚠️  Commons: no image URL for: ${englishName}`);
    return null;
  } catch (error) {
    console.error('Error fetching Commons image:', error);
    return null;
  }
}

/**
 * Get food image from Wikipedia or Commons (try both)
 */
export async function getWikimediaImage(foodName: string): Promise<string | null> {
  // Try Wikipedia first (faster, better curated)
  let imageUrl = await searchWikipediaImage(foodName);
  
  // If Wikipedia doesn't have it, try Commons
  if (!imageUrl) {
    imageUrl = await searchCommonsImage(foodName);
  }
  
  return imageUrl;
}
