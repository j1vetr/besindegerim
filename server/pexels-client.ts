// Using Node.js native fetch (available in Node 18+)

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page?: string;
}

export async function searchPexelsImage(query: string): Promise<string | null> {
  if (!PEXELS_API_KEY) {
    console.warn('⚠️  PEXELS_API_KEY not found, cannot fetch images');
    return null;
  }

  try {
    // Turkish to English food name mapping for better Pexels results
    const turkishToEnglish: Record<string, string> = {
      'domates': 'tomato',
      'salatalık': 'cucumber',
      'elma': 'apple',
      'armut': 'pear',
      'muz': 'banana',
      'portakal': 'orange',
      'limon': 'lemon',
      'havuç': 'carrot',
      'patates': 'potato',
      'soğan': 'onion',
      'sarımsak': 'garlic',
      'biber': 'pepper',
      'patlıcan': 'eggplant',
      'kabak': 'zucchini',
      'ıspanak': 'spinach',
      'marul': 'lettuce',
      'maydanoz': 'parsley',
      'karpuz': 'watermelon',
      'kavun': 'melon',
      'çilek': 'strawberry',
      'kiraz': 'cherry',
      'üzüm': 'grape',
      'şeftali': 'peach',
      'kayısı': 'apricot',
      'erik': 'plum',
      'kivi': 'kiwi',
      'ananas': 'pineapple',
      'avokado': 'avocado',
      'brokoli': 'broccoli',
      'karnabahar': 'cauliflower',
      'lahana': 'cabbage',
      'enginar': 'artichoke',
      'mantar': 'mushroom',
      'roka': 'arugula',
      'ekmek': 'bread',
      'beyaz ekmek': 'white bread',
      'kepekli ekmek': 'whole wheat bread',
      'pirinç': 'rice',
      'makarna': 'pasta',
      'tavuk': 'chicken',
      'tavuk göğsü': 'chicken breast',
      'kızarmış tavuk': 'fried chicken',
      'hindi': 'turkey',
      'dana eti': 'beef',
      'kuzu eti': 'lamb',
      'kıyma': 'ground meat',
      'sosis': 'sausage',
      'sucuk': 'turkish sausage',
      'balık': 'fish',
      'somon': 'salmon',
      'ton balığı': 'tuna',
      'karides': 'shrimp',
      'yumurta': 'egg',
      'sahanda yumurta': 'fried egg',
      'haşlanmış yumurta': 'boiled egg',
      'süt': 'milk',
      'yoğurt': 'yogurt',
      'ayran': 'ayran',
      'peynir': 'cheese',
      'beyaz peynir': 'white cheese',
      'kaşar peyniri': 'cheddar cheese',
      'mozzarella': 'mozzarella',
      'lor peyniri': 'cottage cheese',
      'tereyağı': 'butter',
      'krema': 'cream',
      'dondurma': 'ice cream',
      'bal': 'honey',
      'reçel': 'jam',
      'zeytin': 'olive',
      'zeytinyağı': 'olive oil',
      'fıstık ezmesi': 'peanut butter',
      'çay': 'tea',
      'kahve': 'coffee',
      'su': 'water',
      'portakal suyu': 'orange juice',
      'elma suyu': 'apple juice',
      'kola': 'cola',
      'hamburger': 'hamburger',
      'cheeseburger': 'cheeseburger',
      'pizza': 'pizza',
      'patates kızartması': 'french fries',
      'nugget': 'chicken nuggets',
      'hot dog': 'hot dog',
      'mercimek': 'lentil',
      'nohut': 'chickpea',
      'kuru fasulye': 'white beans',
      'mısır': 'corn',
      'kraker': 'cracker',
      'gevrek': 'cornflakes',
      'yulaf': 'oats',
      'fındık': 'hazelnut',
      'ceviz': 'walnut',
      'badem': 'almond',
      'fıstık': 'peanut',
    };

    // Convert Turkish query to English for better Pexels results
    const searchQuery = turkishToEnglish[query.toLowerCase()] || query;

    const response = await fetch(
      `${PEXELS_API_URL}?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      console.error(`Pexels API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json() as PexelsResponse;

    if (data.photos && data.photos.length > 0) {
      // Use large size for better quality
      return data.photos[0].src.large;
    }

    return null;
  } catch (error) {
    console.error('Error fetching Pexels image:', error);
    return null;
  }
}
