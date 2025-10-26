// Wikipedia/Wikimedia Commons image fetcher
// Fallback when Pexels doesn't have relevant images

const COMMONS_API_URL = 'https://commons.wikimedia.org/w/api.php';
const WIKIDATA_API_URL = 'https://www.wikidata.org/w/api.php';

interface WikimediaImage {
  url: string;
  width: number;
  height: number;
}

/**
 * Search for food images on Wikimedia Commons
 */
export async function searchWikimediaImage(query: string): Promise<string | null> {
  try {
    // Build URL manually to avoid Turkish character encoding issues
    const params = new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: query,
      gsrnamespace: '6', // File namespace
      prop: 'imageinfo',
      iiprop: 'url|dimensions',
      iiurlwidth: '800',
      format: 'json',
      gsrlimit: '5'
    }).toString();
    
    const response = await fetch(
      `${COMMONS_API_URL}?${params}`,
      {
        headers: {
          'User-Agent': 'BesinDegerim/1.0 (Turkish Nutrition Platform)',
        },
      }
    );

    if (!response.ok) {
      console.error(`Wikimedia API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.query && data.query.pages) {
      const pages = Object.values(data.query.pages) as any[];
      
      // Filter for quality images
      for (const page of pages) {
        if (page.imageinfo && page.imageinfo.length > 0) {
          const imageInfo = page.imageinfo[0];
          
          // Skip small images (likely icons or logos)
          if (imageInfo.width < 400 || imageInfo.height < 300) {
            continue;
          }
          
          // Skip very wide/tall images (likely banners)
          const aspectRatio = imageInfo.width / imageInfo.height;
          if (aspectRatio > 3 || aspectRatio < 0.3) {
            continue;
          }
          
          // Return thumbnail URL if available, otherwise full URL
          return imageInfo.thumburl || imageInfo.url;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching Wikimedia image:', error);
    return null;
  }
}

/**
 * Search Wikidata for food entity and get its image
 */
export async function searchWikidataImage(foodName: string): Promise<string | null> {
  try {
    // Step 1: Search for the food entity
    const searchParams = new URLSearchParams({
      action: 'wbsearchentities',
      search: foodName,
      language: 'en',
      format: 'json',
      limit: '1',
      type: 'item'
    }).toString();
    
    const searchResponse = await fetch(
      `${WIKIDATA_API_URL}?${searchParams}`,
      {
        headers: {
          'User-Agent': 'BesinDegerim/1.0 (Turkish Nutrition Platform)',
        },
      }
    );

    if (!searchResponse.ok) {
      return null;
    }

    const searchData = await searchResponse.json();

    if (!searchData.search || searchData.search.length === 0) {
      return null;
    }

    const entityId = searchData.search[0].id;

    // Step 2: Get entity claims (including P18 - image property)
    const entityParams = new URLSearchParams({
      action: 'wbgetentities',
      ids: entityId,
      format: 'json',
      props: 'claims'
    }).toString();
    
    const entityResponse = await fetch(
      `${WIKIDATA_API_URL}?${entityParams}`,
      {
        headers: {
          'User-Agent': 'BesinDegerim/1.0 (Turkish Nutrition Platform)',
        },
      }
    );

    if (!entityResponse.ok) {
      return null;
    }

    const entityData = await entityResponse.json();

    if (entityData.entities && entityData.entities[entityId]) {
      const claims = entityData.entities[entityId].claims;
      
      // P18 is the property for "image"
      if (claims && claims.P18 && claims.P18.length > 0) {
        const imageFilename = claims.P18[0].mainsnak.datavalue.value;
        
        // Build Commons URL with resizing
        const imageUrl = `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(imageFilename)}&width=800`;
        
        return imageUrl;
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching Wikidata image:', error);
    return null;
  }
}

/**
 * Try multiple sources for food images (cascade fallback)
 * @param foodName - English name preferred (Turkish names cause encoding issues)
 */
export async function getWikipediaImage(foodName: string | null): Promise<string | null> {
  // Skip if no food name provided or contains Turkish characters (which cause encoding issues)
  if (!foodName || /[çğıöşüÇĞİÖŞÜ]/.test(foodName)) {
    return null;
  }
  
  // Try Wikidata first (more structured, often has curated images)
  const wikidataImage = await searchWikidataImage(foodName);
  if (wikidataImage) {
    console.log(`✅ Found Wikidata image for: ${foodName}`);
    return wikidataImage;
  }

  // Fallback to Wikimedia Commons search
  const commonsImage = await searchWikimediaImage(foodName);
  if (commonsImage) {
    console.log(`✅ Found Wikimedia Commons image for: ${foodName}`);
    return commonsImage;
  }

  return null;
}
