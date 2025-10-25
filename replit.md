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

6. **Mobil Öncelikli Tasarım**
   - Açık ton + yeşil vurgu
   - Profesyonel, "AI kokusu" olmayan tasarım
   - Responsive grid layout
   - Touch-friendly controls

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
│   └── seed.ts                        # Database seed script
└── shared/
    └── schema.ts                      # Database schema (Drizzle ORM)
```

## Teknoloji Yığını

- **Frontend**: React (SSR), Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **API**: USDA FoodData Central
- **Cache**: In-memory cache (process-based)

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
- `GET /:slug` - Gıda detay sayfası (ör: /domates)
- `GET /robots.txt` - robots.txt
- `GET /sitemap.xml` - Dinamik sitemap

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

- **Renkler**: Açık ton arka plan + yeşil vurgu (primary)
- **Tipografi**: Inter font (400, 500, 600, 700)
- **Spacing**: 4, 6, 8, 12, 16 units
- **Responsive**: Mobile-first, grid 2-3-4 columns
- **Cards**: shadow-sm, rounded-lg, hover-elevate

## Deployment

- Platform: Replit
- Frontend Port: 5000
- Database: PostgreSQL (Neon)
- SSR: Express.js server

## İletişim

- Site: besindegerim.com
- Dil: Türkçe
- API: USDA FoodData Central, Pexels API
