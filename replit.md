# besindegerim.com - Türkçe Besin Değerleri Platformu

## Proje Özeti

besindegerim.com, gerçek porsiyon bazlı kalori ve besin değerleri sunan, tamamen SSR (Server-Side Rendering) tabanlı bir Türkçe besin değerleri platformudur. USDA FoodData Central API'sinden veri çeker, Pexels API'den profesyonel görseller alır ve JavaScript kapalıyken bile çalışacak şekilde tasarlanmıştır.

## Temel Özellikler

### Tamamlanan MVP Özellikleri

1. **SSR (Server-Side Rendering)**
   - Tüm sayfalar server-side render edilir
   - JavaScript kapalıyken bile tam işlevsellik
   - SEO dostu HTML çıktısı

2. **USDA FoodData Central API Entegrasyonu**
   - Gerçek porsiyon/serving bazlı kalori hesaplama (100g bazlı DEĞİL)
   - Örnek: "1 orta domates = 22 kcal" (123g porsiyon)
   - Otomatik besin değeri normalizasyonu

3. **PostgreSQL Veritabanı**
   - Gıda verisi depolama
   - serving_size, serving_label, calories, macros, micronutrients
   - Slug-based routing (/domates, /elma, vb.)
   - Hiyerarşik kategori sistemi (category, subcategory)

4. **In-Memory Cache**
   - API çağrılarını azaltma
   - Hızlı yanıt süreleri
   - TTL-based cache yönetimi

5. **SEO Optimizasyonu**
   - Benzersiz meta tags (title, description, keywords)
   - Canonical URLs
   - Open Graph ve Twitter Cards
   - JSON-LD structured data:
     - NutritionInformation
     - BreadcrumbList
     - Organization

6. **Hiyerarşik Kategori Sistemi**
   - 6 ana kategori (Hayvansal Ürünler, Bitkisel Ürünler, Tahıllar ve Baklagiller, vb.)
   - 2-4 alt kategori per ana kategori
   - Dropdown menü navigasyonu
   - SSR route'ları: /kategori/:category ve /kategori/:category/:subcategory
   - Otomatik kategorilendirme (251/266 gıda)
   - CategoryGroup type shared/schema.ts'den export ediliyor

7. **Modern, Göze Çarpan Tasarım**
   - Yeni hero section: "Besin Değeri Anında" kısa başlık
   - Gradient hero arka plan + CSS-only animasyonlar
   - Glassmorphic arama çubuğu
   - Stats pills (14+ Gıda, Gerçek Porsiyon, USDA Verisi)
   - Shadcn Card components ile modern value props
   - Alternating layout "Neden Besin Değerim?" bölümü
   - Mobil öncelikli, responsive tasarım
   - Yeşil gradient tema (from-[#22c55e] to-[#16a34a])
   - Touch-friendly controls
   - Kategorize dropdown menü (horizontal scroll)

8. **AI-Generated Görseller & Optimizasyon**
   - **326 AI-generated profesyonel ürün fotoğrafları (DALL-E 3)**
   - **266/266 ürün görsel coverage (%100)** 🎉
   - Akıllı görsel eşleştirme sistemi (fix-image-mapping.ts)
   - Manuel mapping tablosu: 289 slug eşleştirmesi (slug varyasyonları dahil)
   - Toplu görsel optimizasyonu: PNG → WebP dönüşümü
   - Ortalama %94-98 boyut azalması (Sharp library)
   - 800x800px boyut, quality 85, effort 6
   - Express.static ile /attached_assets serving
   - Cache headers: public, max-age=1y, immutable
   
   - **Birinci Batch (Ekim 2025):**
     - 213 AI görsel (initial coverage: 65.4%)
     
   - **İkinci Batch (Ekim 2025):**
     - 60 yeni AI görsel (4 grup x 15)
     - Sebze/Meyveler: brokoli, havuç, ıspanak, karnabahar, marul, roka, patates, soğan, sarımsak, limon, armut, mandalina, pancar, kabak
     - Tahıllar/Baklagiller: buğday, arpa, kinoa, darı, pirinç, beyaz fasulye, siyah fasulye, kırmızı fasulye, soya fasulyesi, edamame
     - Fırın/İçecekler: kruvasan, kuskus, mısır tortilla, limonata, bamya, kuşkonmaz, donut, köfte, bal, hardal, bitter çikolata
     - Diğer: kale, brüksel lahanası, tatlı patates, kuru üzüm, yer fıstığı, yeşil zeytin, siyah zeytin, turşu, yulaf ezmesi, çavdar, pırasa
     - Toplam optimizasyon: 49.85 MB tasarruf (%95.3 azalma)
     
   - **Üçüncü Batch (Ocak 2025):**
     - 92 yeni AI görsel (6 grup)
     - Grup 1 - Sebzeler & Baharatlar (15): enginar, bambu filizi, fesleğen, çin lahanası, kereviz sapı, tere, kişniş, dereotu, zencefil, yeşil fasulye, yeşil soğan, bezelye taze, nane, maydanoz, biberiye
     - Grup 2 - Meyveler & Tatlılar (15): ahududu, turp, ayva, trabzon hurması, papaya, nektarin, kekik, zerdeçal, şalgam, kuru erik, marshmallow, meyve jellisi, pekmez, pizza, donut sade
     - Grup 3 - Tahıllar & Baklagiller (16): nohut kuru, bezelye kuru, yeşil mercimek, basmati pirinç, irmik, tef, darı, lima fasulyesi, mung fasulyesi, lupin fasulyesi, naan ekmeği, pide ekmeği, tam tahıllı ekmek, kereviz kökü, mısır koçanı, kırmızı lahana
     - Grup 4 - Et & Süt Ürünleri (15): dana eti (genç), tavuk but, ördek eti, hindi göğsü, hindi kıyma, krema, az yağlı yoğurt, ekşi krema, beyaz lahana, beyaz şeker, beyaz çikolata, esmer şeker, nori, wakame, tempeh
     - Grup 5 - Yağlar & Tohumlar (16): ayçiçek yağı, kanola yağı, mısır yağı, zeytinyağı, sızma zeytinyağı, susam yağı, keten tohumu, ayçiçek çekirdeği, kabak çekirdeği, tahin, pekan cevizi, makadamya, mayonez, balzamik sirke, haşhaş, akçaağaç şurubu
     - Grup 6 - İçecekler & Diğer (15): kahve, yeşil çay, siyah çay, enerji içeceği, protein tozu, ketçap, acı sos, fındık kreması, mantar portobello, jalapeno biber, kuru domates, cips, kuru oregan
     - Toplam optimizasyon: 92 görsel (%92-98 azalma)
     - Final coverage: %100 (266/266 ürün)

## Proje Yapısı

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CalorieCard.tsx        # Ana kalori kartı (border-l-4 yeşil)
│   │   │   ├── FoodCard.tsx           # Gıda kartı (liste/grid için)
│   │   │   ├── NutritionTable.tsx     # Besin değerleri tablosu
│   │   │   └── SearchForm.tsx         # Arama formu
│   │   └── pages/
│   │       ├── HomePage.tsx           # Ana sayfa (arama + popüler gıdalar)
│   │       ├── FoodDetailPage.tsx     # Gıda detay sayfası
│   │       └── NotFoundPage.tsx       # 404 sayfası
│   └── index.html                     # HTML template (lang="tr")
├── server/
│   ├── seo/
│   │   └── meta-inject.ts             # SEO meta tag yönetimi
│   ├── cache.ts                       # In-memory cache
│   ├── db.ts                          # PostgreSQL bağlantısı
│   ├── render.ts                      # SSR rendering logic
│   ├── routes.ts                      # API routes
│   ├── ssr.ts                         # SSR routes (/, /:slug, /robots.txt, /sitemap.xml)
│   ├── storage.ts                     # Database storage layer
│   ├── usda-client.ts                 # USDA API client
│   ├── seed.ts                        # Database seed script
│   ├── bulk-optimize.ts               # Toplu görsel optimizasyon script'i
│   ├── smart-image-mapping.ts         # Eski görsel eşleştirme script'i (deprecated)
│   └── fix-image-mapping.ts           # Yeni akıllı görsel eşleştirme sistemi (manuel mapping)
├── attached_assets/
│   └── generated_images/              # AI-generated ve optimize edilmiş görseller (WebP)
└── shared/
    └── schema.ts                      # Database schema (Drizzle ORM)
```

## Teknoloji Yığını

- **Frontend**: React (SSR), Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **API**: USDA FoodData Central, Pexels API
- **Cache**: In-memory cache (process-based)
- **Image Processing**: Sharp (PNG → WebP optimizasyon)
- **AI Images**: OpenAI DALL-E 3 (generate_image_tool)

## Ortam Değişkenleri

```
DATABASE_URL          # PostgreSQL bağlantı URL'i (otomatik)
FOODDATA_API_KEY      # USDA FoodData Central API anahtarı
BASE_URL              # Site base URL'i (varsayılan: https://kacgram.net)
```

## Veritabanı Şeması

### foods Tablosu

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| id | varchar (UUID) | Birincil anahtar |
| fdcId | integer | USDA FDC ID |
| slug | text | URL-friendly slug (ör: "domates") |
| name | text | Türkçe gıda adı |
| nameEn | text | İngilizce adı (USDA referansı) |
| category | text | Ana kategori (ör: "Bitkisel Ürünler") |
| subcategory | text | Alt kategori (ör: "Sebzeler") |
| servingSize | decimal | Porsiyon büyüklüğü (gram) |
| servingLabel | text | Porsiyon etiketi (ör: "1 orta domates") |
| calories | decimal | Kalori (porsiyon bazında) |
| protein | decimal | Protein (g, porsiyon bazında) |
| fat | decimal | Yağ (g, porsiyon bazında) |
| carbs | decimal | Karbonhidrat (g, porsiyon bazında) |
| fiber | decimal | Lif (g, porsiyon bazında) |
| sugar | decimal | Şeker (g, porsiyon bazında) |
| micronutrients | jsonb | Mikrobesinler (JSON) |
| imageUrl | text | Gıda görseli URL |
| cachedAt | timestamp | Cache zamanı |
| updatedAt | timestamp | Güncellenme zamanı |

## API Endpoints

### SSR Routes

- `GET /` - Ana sayfa (arama + popüler gıdalar)
- `GET /kategori/:category` - Ana kategori sayfası (ör: /kategori/Hayvansal%20Ürünler)
- `GET /kategori/:category/:subcategory` - Alt kategori sayfası (ör: /kategori/Hayvansal%20Ürünler/Et%20Ürünleri)
- `GET /ara?q=query` - Arama sonuçları sayfası
- `GET /:slug` - Gıda detay sayfası (ör: /domates)
- `GET /robots.txt` - robots.txt
- `GET /sitemap.xml` - Dinamik sitemap
- Legal pages: /gizlilik-politikasi, /kullanim-kosullari, /kvkk, /cerez-politikasi, /hakkimizda, /iletisim

### API Routes

- `GET /api/search?q=query` - USDA'da gıda ara
- `POST /api/import` - USDA'dan gıda import et
  - Body: `{ fdcId: number, turkishName?: string }`
- `GET /api/random?count=6&exclude=id` - Rastgele gıdalar getir

## Önemli Özellikler

### Serving-Based Calculations

USDA API'si verileri genellikle 100g başına verir. Bu proje, gerçek porsiyon/serving bazında hesaplama yapar:

```typescript
// Örnek: Domates
// USDA: 18 kcal per 100g
// Porsiyon: 123g (1 orta domates)
// Hesaplama: (18 * 123) / 100 = 22.14 kcal
```

### Cache Stratejisi

```typescript
// In-memory cache kullanımı
cache.set(key, value, ttlMs);  // Set with TTL
cache.get(key);                 // Get (undefined if expired)
cache.delete(key);              // Invalidate

// Cache keys
popular_foods          // 10 dakika
food_{slug}           // 1 saat
alternatives_{foodId} // 10 dakika
usda_search_{query}   // 1 saat
sitemap_foods         // 1 saat
all_categories        // 1 saat (CategoryGroup[])
category_{category}   // 1 saat
subcategory_{subcategory} // 1 saat
```

### SEO Meta Tag Injection

```typescript
// buildMetaForFood örneği
const meta = buildMetaForFood({
  name: "Domates",
  servingLabel: "1 orta domates",
  kcalPerServing: 22,
  slug: "domates"
});

// Sonuç: 
// Title: "Domates Besin Değerleri - 22 kcal | kacgram.net"
// Description: "Domates gıdasının gerçek porsiyon bazlı besin değerleri..."
```

## Geliştirme

### Komutlar

```bash
# Development server başlat
npm run dev

# Database schema push
npm run db:push

# Veritabanını seed et
npx tsx server/seed.ts

# USDA API yapısını debug et
npx tsx server/debug-usda.ts
```

### Yeni Gıda Ekleme

1. USDA'da FDC ID bulun: https://fdc.nal.usda.gov/
2. `server/seed.ts` dosyasına ekleyin:
   ```typescript
   { query: "food name", turkishName: "Türkçe Ad", fdcId: 12345 }
   ```
3. Seed script'i çalıştırın: `npx tsx server/seed.ts`

## Tasarım Sistemi

- **Renkler**: 
  - Primary gradient: from-[#22c55e] to-[#16a34a] (yeşil)
  - Secondary: Teal-500 to Cyan-500
  - Background: White to emerald-50/30
  - Text: Gray-900 (headings), Gray-600 (body)
- **Tipografi**: Inter font (400 body, 600 semibold, 700 bold, 900 black for hero)
- **Spacing**: 4, 6, 8, 12, 16, 20 units (modern rhythm)
- **Components**: Shadcn Card, CardContent with hover-elevate
- **Responsive**: Mobile-first, grid 1-2-3-4 columns
- **Effects**: Glassmorphism, CSS animations, gradient overlays

## Deployment

- Platform: Replit
- Frontend Port: 5000
- Database: PostgreSQL (Neon)
- SSR: Express.js server

## İletişim

- Site: besindegerim.com
- Dil: Türkçe
- API: USDA FoodData Central, Pexels API
