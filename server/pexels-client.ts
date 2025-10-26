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
    // Using descriptive terms like "fruit", "vegetable", "meat" for better image quality
    const turkishToEnglish: Record<string, string> = {
      'domates': 'fresh tomato vegetable',
      'salatalık': 'fresh cucumber vegetable',
      'elma': 'fresh apple fruit',
      'armut': 'fresh pear fruit',
      'muz': 'fresh banana fruit',
      'portakal': 'fresh orange fruit',
      'limon': 'fresh lemon fruit',
      'havuç': 'fresh carrot vegetable',
      'patates': 'fresh potato vegetable',
      'soğan': 'fresh onion vegetable',
      'sarımsak': 'fresh garlic vegetable',
      'biber': 'fresh bell pepper vegetable',
      'patlıcan': 'fresh eggplant vegetable',
      'kabak': 'fresh zucchini vegetable',
      'ıspanak': 'fresh spinach vegetable',
      'marul': 'fresh lettuce vegetable',
      'maydanoz': 'fresh parsley herb',
      'karpuz': 'fresh watermelon fruit',
      'kavun': 'fresh melon fruit',
      'çilek': 'fresh strawberry fruit',
      'kiraz': 'fresh cherry fruit',
      'üzüm': 'fresh grape fruit',
      'şeftali': 'fresh peach fruit',
      'kayısı': 'fresh apricot fruit',
      'erik': 'fresh plum fruit',
      'kivi': 'fresh kiwi fruit',
      'ananas': 'fresh pineapple fruit',
      'avokado': 'fresh avocado fruit',
      'brokoli': 'fresh broccoli vegetable',
      'karnabahar': 'fresh cauliflower vegetable',
      'lahana': 'fresh cabbage vegetable',
      'enginar': 'fresh artichoke vegetable',
      'mantar': 'fresh mushroom vegetable',
      'roka': 'fresh arugula vegetable',
      'ekmek': 'fresh bread loaf',
      'beyaz ekmek': 'fresh white bread',
      'kepekli ekmek': 'whole wheat bread loaf',
      'pirinç': 'white rice grain',
      'makarna': 'fresh pasta noodles',
      'tavuk': 'raw chicken meat',
      'tavuk göğsü': 'raw chicken breast meat',
      'kızarmış tavuk': 'fried chicken crispy',
      'hindi': 'raw turkey meat',
      'dana eti': 'raw beef meat',
      'kuzu eti': 'raw lamb meat',
      'kıyma': 'raw ground beef meat',
      'sosis': 'fresh sausage meat',
      'sucuk': 'turkish sausage sucuk',
      'balık': 'fresh raw fish',
      'somon': 'fresh raw salmon fish',
      'ton balığı': 'fresh tuna fish',
      'karides': 'fresh raw shrimp',
      'yumurta': 'fresh chicken eggs',
      'sahanda yumurta': 'fried egg sunny side',
      'haşlanmış yumurta': 'boiled eggs',
      'süt': 'fresh milk glass',
      'yoğurt': 'fresh yogurt bowl',
      'ayran': 'turkish ayran drink',
      'peynir': 'fresh cheese block',
      'beyaz peynir': 'fresh white cheese feta',
      'kaşar peyniri': 'fresh cheddar cheese',
      'mozzarella': 'fresh mozzarella cheese',
      'lor peyniri': 'fresh cottage cheese',
      'tereyağı': 'fresh butter block',
      'krema': 'fresh cream dairy',
      'dondurma': 'fresh ice cream scoop',
      'bal': 'natural honey jar',
      'reçel': 'fruit jam jar',
      'zeytin': 'fresh green olives',
      'zeytinyağı': 'olive oil bottle',
      'fıstık ezmesi': 'peanut butter jar',
      'çay': 'hot tea cup',
      'kahve': 'hot coffee cup',
      'su': 'fresh water glass',
      'portakal suyu': 'fresh orange juice',
      'elma suyu': 'fresh apple juice',
      'kola': 'cola drink glass',
      'hamburger': 'fresh hamburger burger',
      'cheeseburger': 'fresh cheeseburger',
      'pizza': 'fresh pizza slice',
      'patates kızartması': 'golden french fries',
      'nugget': 'crispy chicken nuggets',
      'hot dog': 'fresh hot dog',
      'mercimek': 'red lentils grain',
      'nohut': 'chickpeas grain',
      'kuru fasulye': 'white beans grain',
      'mısır': 'fresh corn vegetable',
      'kraker': 'crispy crackers',
      'gevrek': 'corn flakes cereal',
      'yulaf': 'oats grain cereal',
      'fındık': 'fresh hazelnuts',
      'ceviz': 'fresh walnuts',
      'badem': 'fresh almonds',
      'fıstık': 'fresh peanuts',
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
