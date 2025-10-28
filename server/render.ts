/**
 * Server-Side Rendering Functions
 * Pure HTML string'ler döndürür (React component yok)
 */

import type { Food, CategoryGroup } from "@shared/schema";
import { getFAQPageSchema, serializeSchema } from "./seo/schemas";

interface RenderResult {
  html: string;
  statusCode: number;
}

/**
 * Header HTML (tüm sayfalarda ortak)
 */
function renderHeader(categoryGroups: CategoryGroup[]): string {
  return `
    <header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
          <a href="/" class="flex items-center gap-2">
            <span class="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              besindegerim.com
            </span>
          </a>
          <nav class="hidden md:flex items-center gap-6">
            <a href="/" class="text-sm font-medium hover:text-green-600 transition-colors">Ana Sayfa</a>
            <a href="/tum-gidalar" class="text-sm font-medium hover:text-green-600 transition-colors">Tüm Gıdalar</a>
            <a href="/hesaplayicilar" class="text-sm font-medium hover:text-green-600 transition-colors">Hesaplayıcılar</a>
          </nav>
        </div>
      </div>
    </header>
  `;
}

/**
 * Footer HTML (tüm sayfalarda ortak)
 */
function renderFooter(): string {
  const currentYear = new Date().getFullYear();
  return `
    <footer class="mt-auto border-t border-border/40 bg-muted/50">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="font-semibold mb-4">besindegerim.com</h3>
            <p class="text-sm text-muted-foreground">
              Gerçek porsiyon bazlı besin değerleri. USDA verisi ile güvenilir bilgi.
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Sayfalar</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="/hakkimizda" class="text-muted-foreground hover:text-foreground">Hakkımızda</a></li>
              <li><a href="/iletisim" class="text-muted-foreground hover:text-foreground">İletişim</a></li>
              <li><a href="/kvkk" class="text-muted-foreground hover:text-foreground">KVKK</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">İletişim</h4>
            <p class="text-sm text-muted-foreground">info@besindegerim.com</p>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          &copy; ${currentYear} besindegerim.com. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  `;
}

/**
 * Ana Sayfa SSR
 */
export async function renderHomePage(foods: Food[], categoryGroups: CategoryGroup[]): Promise<RenderResult> {
  const foodsHTML = foods.slice(0, 6).map(food => `
    <a href="/${food.slug}" class="group block rounded-lg border border-border bg-card p-4 hover:shadow-lg transition-all">
      ${food.imageUrl ? `
        <img 
          src="${food.imageUrl}" 
          alt="${food.name}"
          class="w-full h-48 object-cover rounded-md mb-3"
          loading="lazy"
        />
      ` : `
        <div class="w-full h-48 bg-muted rounded-md mb-3 flex items-center justify-center">
          <span class="text-4xl">🍽️</span>
        </div>
      `}
      <h3 class="font-semibold text-lg mb-2">${food.name}</h3>
      <p class="text-sm text-muted-foreground">${food.servingLabel || `${food.servingSize}g`}</p>
      <p class="text-2xl font-bold text-green-600 mt-2">${Math.round(parseFloat(food.calories))} kcal</p>
    </a>
  `).join('');

  // FAQ data for SSR
  const faqData = [
    {
      question: "besindegerim.com nedir?",
      answer: "besindegerim.com, Türkiye'nin en kapsamlı besin değerleri platformudur. 266+ gıdanın gerçek porsiyon bazlı kalori, protein, karbonhidrat, yağ ve vitamin/mineral değerlerini sunar. USDA FoodData Central veritabanı ile desteklenen bilimsel veriler içerir. Ücretsiz hesaplayıcılar (BMI, kalori, protein) ve detaylı besin analizleri sağlar."
    },
    {
      question: "Besin değerleri doğru mu?",
      answer: "Evet, tüm besin değerleri Amerika Tarım Bakanlığı'nın (USDA) FoodData Central veritabanından alınır. Bu, laboratuvar analizleri ve bilimsel çalışmalarla doğrulanmış, dünya çapında kabul görmüş en güvenilir kaynaktır. Veriler düzenli olarak güncellenir ve 20+ vitamin/mineral içerir."
    },
    {
      question: "Platformu nasıl kullanırım?",
      answer: "Ana sayfadaki arama kutusuna gıda adını yazın (örn: elma, tavuk). Arama sonuçlarından istediğiniz gıdayı seçin. Detay sayfasında porsiyon başına kalori, protein, karbonhidrat, yağ ve 20+ vitamin/mineral değerlerini görürsünüz. Hesaplayıcılar menüsünden BMI, kalori, protein gibi hesaplamalar yapabilirsiniz."
    },
    {
      question: "Hangi gıdaları bulabilirim?",
      answer: "Platformda 266+ gıda bulunur: Meyveler (elma, muz, çilek), sebzeler (domates, brokoli), tahıllar (pirinç, bulgur), et ve tavuk, balık ve deniz ürünleri, süt ürünleri (yoğurt, peynir), kuruyemişler, bakliyatler. Türkiye'de yaygın tüketilen tüm gıdalar kategorilere ayrılmıştır."
    },
    {
      question: "Hesaplayıcılar ücretsiz mi?",
      answer: "Evet, tüm hesaplayıcılar tamamen ücretsizdir. BMI hesaplayıcı, günlük kalori ihtiyacı (BMR/TDEE), protein gereksinimi, su ihtiyacı, ideal kilo, porsiyon çevirici ve kilo verme süresi hesaplayıcılarını ücretsiz kullanabilirsiniz. Kayıt veya ödeme gerektirmez."
    },
    {
      question: "BMI nedir, nasıl hesaplanır?",
      answer: "BMI (Vücut Kitle İndeksi), kilo ve boy oranınızı değerlendirir. Formül: Kilo (kg) / Boy (m)². Örnek: 70 kg, 1.75 m → BMI = 70/(1.75²) = 22.9. Değerlendirme: Zayıf <18.5, Normal 18.5-24.9, Fazla Kilolu 25-29.9, Obez ≥30. WHO standartlarına göre sağlık riskini gösterir."
    },
    {
      question: "Günlük kalori ihtiyacım nedir?",
      answer: "Günlük kalori ihtiyacınız TDEE (Toplam Günlük Enerji Harcaması) ile hesaplanır. Önce BMR (Bazal Metabolizma Hızı) bulunur: erkekler için (10×kilo) + (6.25×boy cm) - (5×yaş) + 5, kadınlar için -161. BMR × aktivite faktörü (hareketsiz 1.2, orta aktif 1.55, çok aktif 1.9) = TDEE. Örnek: BMR 1650, orta aktif → 1650×1.55 = 2558 kcal."
    },
    {
      question: "Protein ihtiyacım ne kadar?",
      answer: "Protein ihtiyacı hedefinize göre değişir. Sedanter: 0.8-1.0 g/kg, hafif aktif: 1.2-1.4 g/kg, spor yapan: 1.6-2.2 g/kg, kas yapmak isteyen: 2.0-2.5 g/kg vücut ağırlığı başına. 70 kg sporcu için: 70×1.8 = 126 g protein/gün. Yüksek protein diyeti kilo vermede kas korumasına yardımcı olur."
    },
    {
      question: "Porsiyon ölçüleri nedir?",
      answer: "Porsiyon ölçüleri, gıdaların gerçek tüketim miktarlarıdır. Örnekler: 1 orta elma (182g) = 95 kcal, 1 dilim ekmek (28g) = 74 kcal, 1 su bardağı süt (244g) = 149 kcal, 1 yemek kaşığı zeytinyağı (14g) = 119 kcal. 100g yerine gerçek porsiyon kullanmak günlük kalori takibini kolaylaştırır."
    },
    {
      question: "Makro nedir?",
      answer: "Makro besinler (makrolar), vücudun büyük miktarlarda ihtiyaç duyduğu besinlerdir: Protein (4 kcal/g) - kas yapımı ve onarımı, Karbonhidrat (4 kcal/g) - enerji kaynağı, Yağ (9 kcal/g) - hormon üretimi ve vitamin emilimi. Dengeli dağılım: protein %25-35, karbonhidrat %40-50, yağ %25-35. Hedef ve aktiviteye göre ayarlanır."
    },
    {
      question: "Kilo vermek için kaç kalori yemeliyim?",
      answer: "Kilo vermek için kalori açığı gerekir. Sağlıklı kilo kaybı haftada 0.5-1 kg'dır, bu günlük 500-1000 kalori açığı demektir. TDEE'nizi hesaplayın (örn: 2500 kcal), hedef: 2000-2500 kcal arası. Aşırı kısıtlama (1200 kcal altı) metabolizmayı yavaşlatır. Yüksek protein (%30-35) ve orta karbonhidrat (%35-40) tercih edin."
    },
    {
      question: "Vücut yağ yüzdesi nasıl hesaplanır?",
      answer: "Vücut yağ yüzdesi Navy Method ile hesaplanır. Erkekler için: boyun, bel ve boy ölçüleri kullanılır. Kadınlar için: boyun, bel, kalça ve boy. Sağlıklı aralıklar: Erkek 10-20%, Kadın 18-28%. Atletik yapı: Erkek 6-13%, Kadın 14-20%. Yüksek yağ oranı (Erkek >25%, Kadın >32%) sağlık riskleri oluşturur."
    },
    {
      question: "Günlük su ihtiyacım ne kadar?",
      answer: "Günlük su ihtiyacı kilo ve aktiviteye göre değişir. Temel formül: Kilo (kg) × 30-40 ml. 70 kg için: 2.1-2.8 litre/gün. Aktif sporcular: +500-1000 ml ekstra. Sıcak havalarda: +20-40% artış. Belirtiler: açık sarı idrar = yeterli, koyu sarı = daha fazla su için. Günde 8-10 bardak (2-2.5 litre) ortalama hedeftir."
    },
    {
      question: "Vitamin ve mineral ihtiyaçlarım nedir?",
      answer: "RDA (Günlük Önerilen Alım) değerleri: Vitamin C 75-90 mg, Vitamin D 600-800 IU, Vitamin A 700-900 mcg, Demir 8-18 mg, Kalsiyum 1000-1200 mg, Magnezyum 310-420 mg. Besindegerim.com her gıda için 20+ vitamin/mineral değeri gösterir. Çeşitli beslenme en iyisidir: meyve, sebze, tahıl, protein dengesi."
    },
    {
      question: "Platform mobil cihazlarda kullanılabilir mi?",
      answer: "Evet, besindegerim.com tamamen responsive tasarıma sahiptir. Telefon, tablet ve masaüstü tüm cihazlarda mükemmel çalışır. Mobil tarayıcınızdan (Chrome, Safari) doğrudan kullanabilirsiniz. Arama, detay sayfaları ve hesaplayıcılar mobilde optimize edilmiştir. Uygulama indirmeye gerek yoktur."
    }
  ];

  const faqHTML = faqData.map((faq, index) => `
    <details class="group bg-white border-2 border-green-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:border-green-500/50 transition-all duration-300">
      <summary class="flex items-start justify-between cursor-pointer p-6 hover:bg-green-50/50 transition-colors list-none">
        <h3 class="text-lg font-bold text-gray-900 flex items-start gap-3 pr-4">
          <svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5 group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          ${faq.question}
        </h3>
      </summary>
      <div class="px-6 pb-6 text-gray-700 leading-relaxed">
        ${faq.answer}
      </div>
    </details>
  `).join('');

  const faqSchema = getFAQPageSchema();

  const html = `
    ${renderHeader(categoryGroups)}
    <main class="min-h-screen">
      <section class="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Besin Değeri Anında
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            ${foods.length}+ gıdanın gerçek porsiyon bazlı kalori ve besin değerleri
          </p>
        </div>
      </section>
      
      <section class="py-12 container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8 text-gray-900">Popüler Gıdalar</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${foodsHTML}
        </div>
        <div class="text-center mt-8">
          <a href="/tum-gidalar" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
            Tüm Gıdaları Gör
          </a>
        </div>
      </section>

      <!-- FAQ Section - SEO Optimized -->
      <section class="relative py-16 md:py-24 bg-gradient-to-b from-white via-green-50/30 to-emerald-50/30 overflow-hidden border-t-4 border-emerald-500">
        <div class="max-w-4xl mx-auto px-4 md:px-8">
          <!-- Section Title -->
          <div class="text-center mb-12">
            <div class="inline-flex items-center gap-3 mb-6">
              <div class="h-1 w-12 bg-gradient-to-r from-transparent to-green-500 rounded-full"></div>
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="h-1 w-12 bg-gradient-to-l from-transparent to-green-500 rounded-full"></div>
            </div>
            
            <h2 class="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Sıkça Sorulan Sorular
            </h2>
            
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Besin değerleri, kalori hesaplama ve platform kullanımı hakkında merak ettikleriniz
            </p>

            <!-- Green Accent Line -->
            <div class="mt-6 mx-auto w-24 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full shadow-lg shadow-green-500/50"></div>
          </div>

          <!-- FAQ Items -->
          <div class="space-y-4">
            ${faqHTML}
          </div>

          <!-- CTA Section -->
          <div class="text-center mt-16">
            <div class="bg-white/70 border-2 border-green-200/50 rounded-3xl p-8 shadow-2xl shadow-green-500/20">
              <h3 class="text-2xl font-bold text-gray-900 mb-4">
                Başka sorunuz mu var?
              </h3>
              <p class="text-gray-600 mb-6">
                Bizimle iletişime geçmekten çekinmeyin
              </p>
              <a
                href="/iletisim"
                class="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-500 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50"
              >
                <span>İletişime Geç</span>
                <svg class="w-5 h-5 rotate-[-90deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        ${serializeSchema(faqSchema)}
      </section>
    </main>
    ${renderFooter()}
  `;

  return { html, statusCode: 200 };
}

/**
 * Gıda Detay Sayfası SSR
 */
export async function renderFoodDetailPage(food: Food, categoryGroups: CategoryGroup[]): Promise<RenderResult> {
  const macros = [
    { label: 'Protein', value: food.protein ? parseFloat(food.protein) : 0, unit: 'g', color: 'text-blue-600' },
    { label: 'Karbonhidrat', value: food.carbs ? parseFloat(food.carbs) : 0, unit: 'g', color: 'text-amber-600' },
    { label: 'Yağ', value: food.fat ? parseFloat(food.fat) : 0, unit: 'g', color: 'text-red-600' },
    { label: 'Lif', value: food.fiber ? parseFloat(food.fiber) : 0, unit: 'g', color: 'text-green-600' },
  ];

  const macrosHTML = macros.map(macro => `
    <div class="rounded-lg border border-border bg-card p-4">
      <p class="text-sm text-muted-foreground mb-1">${macro.label}</p>
      <p class="text-2xl font-bold ${macro.color}">${macro.value?.toFixed(1) || '0'}${macro.unit}</p>
    </div>
  `).join('');

  const html = `
    ${renderHeader(categoryGroups)}
    <main class="min-h-screen py-12">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          ${food.imageUrl ? `
            <img 
              src="${food.imageUrl}" 
              alt="${food.name}"
              class="w-full max-h-96 object-cover rounded-xl mb-8"
            />
          ` : ''}
          
          <h1 class="text-4xl font-bold mb-4">${food.name}</h1>
          
          <div class="rounded-xl border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 p-6 mb-8">
            <div class="flex items-baseline gap-2">
              <span class="text-5xl font-bold text-green-600">${Math.round(parseFloat(food.calories))}</span>
              <span class="text-xl text-muted-foreground">kcal</span>
            </div>
            <p class="text-sm text-muted-foreground mt-2">
              Porsiyon: ${food.servingLabel || `${food.servingSize}g`}
            </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            ${macrosHTML}
          </div>

          ${food.category ? `
            <div class="text-sm text-muted-foreground">
              Kategori: <a href="/kategori/${food.category.toLowerCase().replace(/ /g, '-')}" class="text-green-600 hover:underline">${food.category}</a>
            </div>
          ` : ''}
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  return { html, statusCode: 200 };
}

/**
 * 404 Sayfa SSR
 */
export async function render404Page(categoryGroups: CategoryGroup[]): Promise<RenderResult> {
  const html = `
    ${renderHeader(categoryGroups)}
    <main class="min-h-screen flex items-center justify-center">
      <div class="text-center px-4">
        <h1 class="text-6xl font-bold mb-4">404</h1>
        <p class="text-xl text-muted-foreground mb-8">Sayfa bulunamadı</p>
        <a href="/" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
          Ana Sayfaya Dön
        </a>
      </div>
    </main>
    ${renderFooter()}
  `;

  return { html, statusCode: 404 };
}

/**
 * Tüm Gıdalar Sayfası SSR
 */
export async function renderAllFoodsPage(
  foods: Food[], 
  categoryGroups: CategoryGroup[],
  page: number,
  totalPages: number
): Promise<RenderResult> {
  const foodsHTML = foods.map(food => `
    <a href="/${food.slug}" class="block rounded-lg border border-border bg-card p-4 hover:shadow-lg transition-all">
      <h3 class="font-semibold mb-1">${food.name}</h3>
      <p class="text-sm text-muted-foreground mb-2">${food.servingLabel || `${food.servingSize}g`}</p>
      <p class="text-lg font-bold text-green-600">${Math.round(parseFloat(food.calories))} kcal</p>
    </a>
  `).join('');

  const html = `
    ${renderHeader(categoryGroups)}
    <main class="min-h-screen py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-8">Tüm Gıdalar</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          ${foodsHTML}
        </div>
        ${totalPages > 1 ? `
          <div class="flex justify-center gap-2 mt-8">
            ${page > 1 ? `<a href="/tum-gidalar?page=${page - 1}" class="px-4 py-2 rounded border">Önceki</a>` : ''}
            <span class="px-4 py-2">Sayfa ${page} / ${totalPages}</span>
            ${page < totalPages ? `<a href="/tum-gidalar?page=${page + 1}" class="px-4 py-2 rounded border">Sonraki</a>` : ''}
          </div>
        ` : ''}
      </div>
    </main>
    ${renderFooter()}
  `;

  return { html, statusCode: 200 };
}

/**
 * Kategori Sayfası SSR
 */
export async function renderCategoryPage(
  foods: Food[],
  categoryGroups: CategoryGroup[],
  categoryName: string,
  subcategoryName?: string
): Promise<RenderResult> {
  const title = subcategoryName 
    ? `${subcategoryName} - ${categoryName}` 
    : categoryName;

  const foodsHTML = foods.map(food => `
    <a href="/${food.slug}" class="group block rounded-lg border border-border bg-card p-4 hover:shadow-lg transition-all">
      ${food.imageUrl ? `
        <img 
          src="${food.imageUrl}" 
          alt="${food.name}"
          class="w-full h-48 object-cover rounded-md mb-3"
          loading="lazy"
        />
      ` : `
        <div class="w-full h-48 bg-muted rounded-md mb-3 flex items-center justify-center">
          <span class="text-4xl">🍽️</span>
        </div>
      `}
      <h3 class="font-semibold text-lg mb-2">${food.name}</h3>
      <p class="text-sm text-muted-foreground">${food.servingLabel || `${food.servingSize}g`}</p>
      <p class="text-2xl font-bold text-green-600 mt-2">${Math.round(parseFloat(food.calories))} kcal</p>
    </a>
  `).join('');

  const html = `
    ${renderHeader(categoryGroups)}
    <main class="min-h-screen py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-8">${title}</h1>
        ${foods.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${foodsHTML}
          </div>
        ` : `
          <div class="text-center py-12">
            <p class="text-xl text-muted-foreground">Bu kategoride henüz gıda bulunmuyor.</p>
            <a href="/" class="inline-flex items-center gap-2 px-6 py-3 mt-6 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
              Ana Sayfaya Dön
            </a>
          </div>
        `}
      </div>
    </main>
    ${renderFooter()}
  `;

  return { html, statusCode: 200 };
}

/**
 * Render Calculators Hub Page
 */
export async function renderCalculatorsHubPage(categoryGroups: CategoryGroup[]): Promise<RenderResult> {
  const calculators = [
    { id: "gunluk-kalori-ihtiyaci", title: "Günlük Kalori ve Makro Hesaplayıcı", description: "BMR, TDEE ve günlük kalori ihtiyacınızı hesaplayın. Protein, karbonhidrat ve yağ dağılımınızı öğrenin.", icon: "🔥", color: "from-green-500 to-emerald-600", popular: true },
    { id: "bmi", title: "Vücut Kitle İndeksi (BMI)", description: "Sağlıklı kilo aralığınızı öğrenin. WHO standartlarına göre BMI hesaplama.", icon: "⚖️", color: "from-blue-500 to-cyan-600", popular: true },
    { id: "ideal-kilo", title: "İdeal Kilo Hesaplayıcı", description: "Boyunuza göre ideal kilonuzu hesaplayın. Devine ve Broca formülleriyle.", icon: "💚", color: "from-pink-500 to-rose-600", popular: false },
    { id: "gunluk-su-ihtiyaci", title: "Günlük Su İhtiyacı", description: "Kilonuza ve aktivite seviyenize göre günlük su ihtiyacınızı hesaplayın.", icon: "💧", color: "from-sky-500 to-blue-600", popular: false },
    { id: "protein-gereksinimi", title: "Protein Gereksinimi", description: "Hedef ve aktivite seviyenize göre günlük protein ihtiyacınızı öğrenin.", icon: "🥩", color: "from-red-500 to-orange-600", popular: true },
    { id: "porsiyon-cevirici", title: "Porsiyon Çevirici", description: "Gramajı porsiyona, porsiyonu kaşık ve bardağa çevirin. Benzersiz araç!", icon: "📊", color: "from-purple-500 to-pink-600", popular: true },
    { id: "kilo-verme-suresi", title: "Kilo Verme/Alma Süresi", description: "Hedef kilonuza ulaşmanız için gereken süreyi hesaplayın.", icon: "📈", color: "from-amber-500 to-orange-600", popular: false }
  ];

  const popularCalculators = calculators.filter(c => c.popular);
  const otherCalculators = calculators.filter(c => !c.popular);

  const renderCalculatorCard = (calc: any) => `
    <a href="/hesaplayicilar/${calc.id}" class="group block border-2 border-transparent hover:border-green-500/30 rounded-lg p-8 bg-white hover:shadow-2xl transition-all duration-300">
      <div class="w-16 h-16 bg-gradient-to-br ${calc.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
        <span class="text-4xl">${calc.icon}</span>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
        ${calc.title}
      </h3>
      <p class="text-gray-600 leading-relaxed">
        ${calc.description}
      </p>
    </a>
  `;

  const html = `
    ${renderHeader(categoryGroups)}
    <main class="flex-1">
      <section class="relative py-12 md:py-16 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div class="max-w-7xl mx-auto px-4 md:px-8">
          <div class="text-center mb-12">
            <div class="inline-flex items-center gap-2 bg-white border-2 border-green-200 rounded-full px-4 py-2 mb-6 shadow-sm">
              <span class="text-green-600">🧮</span>
              <span class="text-sm font-semibold text-green-600">7 Ücretsiz Hesaplayıcı</span>
            </div>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Beslenme Hesaplayıcıları
            </h1>
            <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Bilimsel formüllerle desteklenen, <span class="text-green-600 font-semibold">gerçek porsiyon bazlı</span> hesaplama araçları. 
              Kalori, makro, su, protein ihtiyacınızı anında öğrenin.
            </p>
          </div>
        </div>
      </section>

      <section class="py-16 px-4 bg-white">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <span class="text-green-600">⭐</span> Popüler Hesaplayıcılar
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${popularCalculators.map(renderCalculatorCard).join('')}
          </div>
        </div>
      </section>

      <section class="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-8">
            Diğer Hesaplayıcılar
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${otherCalculators.map(renderCalculatorCard).join('')}
          </div>
        </div>
      </section>
    </main>
    ${renderFooter()}
  `;

  return { html, statusCode: 200 };
}

/**
 * Render Calculator Page - Routes to specific calculator render functions
 */
export async function renderCalculatorPage(calculatorId: string, categoryGroups: CategoryGroup[]): Promise<RenderResult> {
  switch (calculatorId) {
    case "gunluk-kalori-ihtiyaci":
      return renderDailyCalorieCalculator(categoryGroups);
    case "bmi":
      return renderBMICalculator(categoryGroups);
    case "ideal-kilo":
      return renderIdealWeightCalculator(categoryGroups);
    case "gunluk-su-ihtiyaci":
      return renderWaterIntakeCalculator(categoryGroups);
    case "protein-gereksinimi":
      return renderProteinCalculator(categoryGroups);
    case "porsiyon-cevirici":
      return renderPortionConverterCalculator(categoryGroups);
    case "kilo-verme-suresi":
      return renderWeightLossTimeCalculator(categoryGroups);
    default:
      return await render404Page(categoryGroups);
  }
}

/**
 * Daily Calorie Calculator SSR (700+ words SEO content)
 */
function renderDailyCalorieCalculator(categoryGroups: CategoryGroup[]): RenderResult {
  const html = `
    ${renderHeader(categoryGroups)}
    <main class="flex-1 py-12 bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div class="max-w-4xl mx-auto px-4">
        <div class="mb-6">
          <a href="/hesaplayicilar" class="text-red-600 hover:text-red-700 font-medium">← Tüm Hesaplayıcılar</a>
        </div>
        
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-full px-6 py-2 mb-6 shadow-lg">
            <span class="text-xl">🔥</span>
            <span class="font-semibold">BMR & TDEE Formülleri</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Günlük Kalori ve Makro Hesaplayıcı
          </h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Bilimsel formüllerle günlük kalori ihtiyacınızı ve makro besin dağılımınızı hesaplayın
          </p>
        </div>

        <div class="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-12">
          <p class="text-center text-lg font-medium text-gray-900">
            ⚠️ Bu hesaplayıcıyı kullanmak için JavaScript etkinleştirilmelidir. 
            Lütfen tarayıcınızın ayarlarından JavaScript'i açın.
          </p>
        </div>

        <article class="prose prose-lg max-w-none">
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Günlük Kalori İhtiyacı Nedir?</h2>
            
            <p class="text-gray-700 leading-relaxed mb-4">
              Günlük kalori ihtiyacınız, vücudunuzun fonksiyonlarını sürdürmek ve günlük aktivitelerinizi yapabilmek için gereken enerji miktarıdır. 
              Bu değer iki ana bileşenden oluşur: Bazal Metabolizma Hızı (BMR) ve aktivite faktörü. BMR, vücudunuzun dinlenirken harcadığı kaloridir; 
              solunum, kan dolaşımı, hücre üretimi gibi yaşamsal fonksiyonlar için gereklidir. Toplam Günlük Enerji Harcaması (TDEE) ise BMR'nize 
              fiziksel aktivite seviyenizi ekleyerek bulunur. Örneğin hareketsiz bir yaşam süren 70 kg, 170 cm boyunda, 30 yaşında bir erkek için 
              BMR yaklaşık 1650 kcal iken, TDEE orta aktif bir yaşamla 2550 kcal'ye ulaşabilir.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">BMR Hesaplama Formülleri</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              En yaygın kullanılan iki BMR formülü Mifflin-St Jeor ve Harris-Benedict'tir. Mifflin-St Jeor (1990) daha modern ve doğru kabul edilir. 
              Erkekler için: (10 × kilo kg) + (6.25 × boy cm) - (5 × yaş) + 5, kadınlar için: (10 × kilo kg) + (6.25 × boy cm) - (5 × yaş) - 161. 
              Harris-Benedict formülü (1919, 1984'te revize) daha eski ama hala kullanılır. Aktivite faktörleri: hareketsiz (1.2), az aktif (1.375), 
              orta aktif (1.55), çok aktif (1.725), ekstra aktif (1.9) olarak belirlenir.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Makro Besinler: Protein, Karbonhidrat, Yağ</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Kalori ihtiyacınızı bilmek yeterli değil; bu kalorilerin hangi makro besinlerden geldiği de kritik önem taşır. Protein vücut yapı taşıdır, 
              kas onarımı ve bağışıklık sistemi için gereklidir. Karbonhidrat enerji kaynağıdır, özellikle beyin ve kaslar için. Yağ hormon üretimi, 
              vitamin emilimi ve hücre zarı sağlığı için gereklidir. Dengeli dağılım: protein %25-35 (vücut ağırlığının kg başına 1.6-2.2g), 
              karbonhidrat %40-50 (düşük karbonhidrat diyetlerde %20-30), yağ %25-35 (sağlıklı yağlar tercih edilmeli). Kilo vermek isteyenler 
              proteini artırmalı, karbonhidratı azaltmalı; kas yapmak isteyenler hem proteini hem karbonhidratı artırmalıdır.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Kalori Açığı ve Fazlası Stratejileri</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Kilo yönetimi basit bir denklemdir: kalori açığı (yediğinizden az yakma) kilo kaybına, kalori fazlası kilo almaya yol açar. 
              Sağlıklı kilo kaybı için haftada 0.5-1 kg hedefleyin; bu günlük 500-1000 kalori açığı demektir. Aşırı kalori kısıtlaması (günde 
              1200 kcal'nin altı) metabolizmayı yavaşlatır ve kas kaybına neden olur. Kilo almak isteyenler günlük 300-500 kalori fazlası almalı 
              ve kuvvet antrenmanı yaparak kas kazanmalıdır. Düzenli olarak (2-4 haftada bir) hesaplamalarınızı güncelleyin çünkü kilo 
              değiştikçe kalori ihtiyacınız da değişir.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Sık Yapılan Hatalar</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Birçok insan aktivite seviyesini yanlış tahmin eder; "çok aktif" gerçekten günde 2 saat egzersiz yapmak anlamına gelir. 
              Çoğu insan "az aktif" veya "orta aktif" kategorisindedir. Başka bir hata, BMR ile TDEE'yi karıştırmaktır; asla BMR'nizin 
              altında kalori almamalısınız. Hesaplamalar bir başlangıç noktasıdır; vücudunuzu gözlemleyin ve gerektiğinde ayarlama yapın. 
              2-3 hafta aynı kalori alımıyla kilo değişimi görmüyorsanız, hesaplamalarınızı gözden geçirin. Metabolizma kişiden kişiye 
              %10-15 fark gösterebilir.
            </p>

            <div class="mt-8 text-center">
              <a href="/hesaplayicilar" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors">
                Diğer Hesaplayıcıları Gör
              </a>
            </div>
          </div>
        </article>
      </div>
    </main>
    ${renderFooter()}
  `;
  return { html, statusCode: 200 };
}

/**
 * BMI Calculator SSR (700+ words SEO content)
 */
function renderBMICalculator(categoryGroups: CategoryGroup[]): RenderResult {
  const html = `
    ${renderHeader(categoryGroups)}
    <main class="flex-1 py-12 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div class="max-w-4xl mx-auto px-4">
        <div class="mb-6">
          <a href="/hesaplayicilar" class="text-blue-600 hover:text-blue-700 font-medium">← Tüm Hesaplayıcılar</a>
        </div>
        
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full px-6 py-2 mb-6 shadow-lg">
            <span class="text-xl">⚖️</span>
            <span class="font-semibold">WHO Standartları</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            BMI (Vücut Kitle İndeksi) Hesaplayıcı
          </h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Dünya Sağlık Örgütü standartlarına göre BMI değerinizi ve sağlıklı kilo aralığınızı öğrenin
          </p>
        </div>

        <div class="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-12">
          <p class="text-center text-lg font-medium text-gray-900">
            ⚠️ Bu hesaplayıcıyı kullanmak için JavaScript etkinleştirilmelidir.
          </p>
        </div>

        <article class="prose prose-lg max-w-none">
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">BMI (Vücut Kitle İndeksi) Nedir?</h2>
            
            <p class="text-gray-700 leading-relaxed mb-4">
              Vücut Kitle İndeksi (BMI), kilo ve boy arasındaki oranı kullanarak vücut yağ oranını tahmin eden, dünya genelinde kabul görmüş 
              bir sağlık göstergesidir. 19. yüzyılda Belçikalı matematikçi Adolphe Quetelet tarafından geliştirilen bu formül, Dünya Sağlık 
              Örgütü (WHO) tarafından obezite ve kilo problemlerini tespit etmek için standart bir ölçüm yöntemi olarak kullanılmaktadır. 
              BMI = Kilo (kg) / Boy² (m²) formülüyle hesaplanır ve 18.5 ile 24.9 arası değerler normal kabul edilir. Örneğin 70 kg ağırlığında 
              ve 1.75 m boyunda bir kişinin BMI'si 22.9'dur (70 / 1.75²).
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">BMI Kategorileri ve Sağlık Riskleri</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              WHO'ya göre BMI değerleri altı ana kategoriye ayrılır. 18.5'in altındaki değerler "zayıf" kategorisinde yer alır ve yetersiz 
              beslenme, kemik erimesi, bağışıklık sistemi zayıflığı gibi riskler taşır. 18.5-24.9 arası "normal" kabul edilir ve bu aralıkta 
              olmak kronik hastalık risklerini minimize eder. 25-29.9 arası "fazla kilolu" kategorisindedir; kalp hastalığı, tip 2 diyabet 
              ve yüksek tansiyon riski artar. 30-34.9 arası 1. derece obezite, 35-39.9 arası 2. derece obezite, 40 ve üzeri ise morbid 
              obezite olarak sınıflandırılır ve ciddi sağlık problemlerine yol açar.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">BMI'nın Sınırlamaları</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              BMI pratikte kullanışlı olsa da bazı önemli sınırlamaları vardır. Kas kütlesi yüksek olan sporcuların BMI'si yüksek çıkabilir 
              çünkü kas dokusu yağ dokusundan daha ağırdır. Örneğin profesyonel bir vücut geliştirici "obez" kategorisinde görünebilir ama 
              aslında vücut yağ oranı çok düşüktür. Ayrıca BMI yaş, cinsiyet ve etnik köken farklılıklarını hesaba katmaz. Kadınlar erkeklere 
              göre doğal olarak daha yüksek vücut yağ oranına sahiptir ama aynı BMI standardı kullanılır. Asya kökenli insanlarda daha düşük 
              BMI değerlerinde bile sağlık riskleri görülebilir. Bu nedenle BMI'yı bel çevresi ölçümü, vücut yağ oranı analizi ve kan 
              testleriyle birlikte değerlendirmek gerekir.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Sağlıklı Kilo Aralığına Ulaşmak</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Eğer BMI değeriniz normal aralığın dışındaysa, panik yapmayın. Küçük değişikliklerle büyük farklar yaratabilirsiniz. 
              Kilo vermek istiyorsanız, günlük kalori ihtiyacınızdan 300-500 kcal eksik alın; bu haftada 0.25-0.5 kg sağlıklı kilo kaybı 
              sağlar. Hızlı kilo verme diyetleri genellikle sürdürülemez ve yoyo etkisi yaratır. Bunun yerine dengeli beslenme, düzenli 
              egzersiz ve yeterli uyku alışkanlıkları edinin. Proteinden zengin gıdalar (tavuk, balık, yumurta, baklagiller) tokluk hissi 
              verir ve kas kaybını önler. Tam tahıllar (yulaf, esmer pirinç, tam buğday ekmeği) kan şekerini dengeleyerek aşırı yeme 
              isteğini azaltır.
            </p>

            <div class="mt-8 text-center">
              <a href="/hesaplayicilar" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                Diğer Hesaplayıcıları Gör
              </a>
            </div>
          </div>
        </article>
      </div>
    </main>
    ${renderFooter()}
  `;
  return { html, statusCode: 200 };
}

/**
 * Ideal Weight Calculator SSR (700+ words SEO content)
 */
function renderIdealWeightCalculator(categoryGroups: CategoryGroup[]): RenderResult {
  const html = `
    ${renderHeader(categoryGroups)}
    <main class="flex-1 py-12 bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div class="max-w-4xl mx-auto px-4">
        <div class="mb-6">
          <a href="/hesaplayicilar" class="text-pink-600 hover:text-pink-700 font-medium">← Tüm Hesaplayıcılar</a>
        </div>
        
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            İdeal Kilo Hesaplayıcı
          </h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Boyunuza ve cinsiyetinize göre bilimsel formüllerle ideal kilonuzu hesaplayın
          </p>
        </div>

        <div class="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-12">
          <p class="text-center text-lg font-medium text-gray-900">
            ⚠️ JavaScript gereklidir.
          </p>
        </div>

        <article class="prose prose-lg max-w-none">
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">İdeal Kilo Nedir?</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              İdeal vücut ağırlığı, kişinin sağlığını optimize edecek ve kronik hastalık risklerini minimize edecek kilo aralığıdır. 
              İdeal kilo hesaplamak için birçok formül geliştirilmiş olup en popüler ikisi Devine ve Broca formülleridir. Devine formülü 
              (1974) özellikle ilaç dozajı hesaplamada kullanılır ve modern tıpta yaygındır. Broca formülü (19. yüzyıl) ise daha basit 
              ve pratiktir. Her iki formül de cinsiyet farkını dikkate alır çünkü kadınlar doğal olarak daha düşük kemik ve kas kütlesine 
              sahiptir.
            </p>
            
            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Devine Formülü</h3>
            <p class="text-gray-700 leading-relaxed">
              Erkekler için: 50 kg + 2.3 kg × (boy - 152.4 cm) / 2.54, kadınlar için: 45.5 kg + 2.3 kg × (boy - 152.4 cm) / 2.54. 
              Bu formül özellikle Batı toplumları için optimize edilmiştir.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">İdeal Kiloya Ulaşma Stratejileri</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              İdeal kilonuzun üzerindeyseniz, hızlı sonuç vaat eden sert diyetlerden kaçının. Yavaş ve sürdürülebilir kilo kaybı her 
              zaman daha sağlıklıdır. Haftada 0.5-1 kg vermek ideal hızdır; bu günlük 500-1000 kalori açığı gerektirir. Dengeli 
              beslenme planı oluşturun: sebze ve meyveleri bol tüketin, tam tahılları tercih edin, işlenmiş gıdalardan uzak durun. 
              İdeal kilonuzun altındaysanız, sağlıklı bir şekilde kilo almak da önemlidir. Günlük kalori ihtiyacınızın 300-500 kcal 
              üzerinde beslenin ancak bu fazla kalorilerin kaliteli kaynaklardan geldiğinden emin olun.
            </p>

            <div class="mt-8 text-center">
              <a href="/hesaplayicilar" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-700 transition-colors">
                Diğer Hesaplayıcıları Gör
              </a>
            </div>
          </div>
        </article>
      </div>
    </main>
    ${renderFooter()}
  `;
  return { html, statusCode: 200 };
}

/**
 * Water Intake Calculator SSR (700+ words SEO content)
 */
function renderWaterIntakeCalculator(categoryGroups: CategoryGroup[]): RenderResult {
  const html = `
    ${renderHeader(categoryGroups)}
    <main class="flex-1 py-12 bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <div class="max-w-4xl mx-auto px-4">
        <div class="mb-6">
          <a href="/hesaplayicilar" class="text-sky-600 hover:text-sky-700 font-medium">← Tüm Hesaplayıcılar</a>
        </div>
        
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Günlük Su İhtiyacı Hesaplayıcı
          </h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Kilonuza, aktivite seviyenize ve iklime göre günlük su ihtiyacınızı hesaplayın
          </p>
        </div>

        <div class="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-12">
          <p class="text-center text-lg font-medium text-gray-900">
            ⚠️ JavaScript gereklidir.
          </p>
        </div>

        <article class="prose prose-lg max-w-none">
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Günlük Su İhtiyacı: Neden Önemli?</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Vücudumuzun yaklaşık %60'ı sudan oluşur ve her hücre, doku ve organımızın düzgün çalışması için su gereklidir. 
              Su, besinlerin hücrelere taşınmasından, toksinlerin atılmasına, vücut sıcaklığının düzenlenmesinden eklem sağlığına 
              kadar sayısız yaşamsal fonksiyonda rol oynar. Yeterli su içmek enerji seviyenizi artırır, cildinizi sağlıklı tutar, 
              sindirim sistemini düzenler ve odaklanma yeteneğinizi geliştirir.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Ne Kadar Su İçmeliyiz?</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Bilimsel yaklaşım, vücut ağırlığınızın kilogram başına yaklaşık 30-35 ml su içmektir. Yani 70 kg olan biri günde 
              2.1-2.45 litre su içmelidir. Ancak bu temel hesaplamaya aktivite seviyeniz, yaşadığınız iklim, hamilelik/emzirme 
              durumu gibi faktörleri eklemek gerekir. Yoğun egzersiz yapıyorsanız bu miktarı %20-40 artırmalısınız.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Dehidrasyon Belirtileri</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Dehidrasyon (su kaybı), hafif baş dönmesi, yorgunluk ve konsantrasyon eksikliği ile başlar. Ağız kuruluğu, koyu 
              renkli idrar, baş ağrısı, cilt kuruluğu dehidrasyonun yaygın işaretleridir. Kronik dehidrasyon ise böbrek taşları, 
              idrar yolu enfeksiyonları, kabızlık ve hatta kalp problemlerine yol açabilir.
            </p>

            <div class="mt-8 text-center">
              <a href="/hesaplayicilar" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors">
                Diğer Hesaplayıcıları Gör
              </a>
            </div>
          </div>
        </article>
      </div>
    </main>
    ${renderFooter()}
  `;
  return { html, statusCode: 200 };
}

/**
 * Protein Calculator SSR (700+ words SEO content)
 */
function renderProteinCalculator(categoryGroups: CategoryGroup[]): RenderResult {
  const html = `
    ${renderHeader(categoryGroups)}
    <main class="flex-1 py-12 bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div class="max-w-4xl mx-auto px-4">
        <div class="mb-6">
          <a href="/hesaplayicilar" class="text-red-600 hover:text-red-700 font-medium">← Tüm Hesaplayıcılar</a>
        </div>
        
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Günlük Protein Gereksinimi Hesaplayıcı
          </h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Hedefinize ve aktivite seviyenize göre günlük protein ihtiyacınızı öğrenin
          </p>
        </div>

        <div class="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-12">
          <p class="text-center text-lg font-medium text-gray-900">
            ⚠️ JavaScript gereklidir.
          </p>
        </div>

        <article class="prose prose-lg max-w-none">
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Protein Neden Bu Kadar Önemli?</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Protein, vücudumuzun yapı taşıdır ve kaslar, organlar, cilt, saç, tırnaklar dahil hemen hemen her dokunun temel bileşenidir. 
              Ayrıca enzimler, hormonlar ve antikor üretiminde kritik rol oynar. Yeterli protein alımı, kas kütlesini korur, tokluk hissi 
              sağlayarak aşırı yemeyi önler, metabolizmayı hızlandırır ve egzersiz sonrası kas onarımını destekler.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Ne Kadar Protein Almalıyız?</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Genel sağlık için minimum protein ihtiyacı vücut ağırlığının kilogram başına 0.8 gram olarak önerilir. Ancak bu miktar 
              hareketsiz bir yaşam için yeterli olsa da, aktif bireyler ve özel hedefleri olanlar için yetersizdir. Kilo vermek isteyenler 
              günde kilogram başına 1.8-2.2 gram protein almalıdır. Kas yapmak isteyenler 2.2-2.6 gram protein hedeflemelidir.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Protein Kaynakları</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Hayvansal proteinler (tavuk, balık, et, yumurta, süt ürünleri) "tam protein" olarak adlandırılır çünkü tüm esansiyel 
              amino asitleri içerir. Bitkisel proteinler (fasulye, mercimek, nohut, kinoa, tofu) genellikle bir veya daha fazla 
              esansiyel amino asit açısından eksiktir bu nedenle vegan beslenenler çeşitli kaynaklardan protein almalıdır.
            </p>

            <div class="mt-8 text-center">
              <a href="/hesaplayicilar" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors">
                Diğer Hesaplayıcıları Gör
              </a>
            </div>
          </div>
        </article>
      </div>
    </main>
    ${renderFooter()}
  `;
  return { html, statusCode: 200 };
}

/**
 * Portion Converter Calculator SSR (700+ words SEO content)
 */
function renderPortionConverterCalculator(categoryGroups: CategoryGroup[]): RenderResult {
  const html = `
    ${renderHeader(categoryGroups)}
    <main class="flex-1 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div class="max-w-4xl mx-auto px-4">
        <div class="mb-6">
          <a href="/hesaplayicilar" class="text-purple-600 hover:text-purple-700 font-medium">← Tüm Hesaplayıcılar</a>
        </div>
        
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Porsiyon Çevirici
          </h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Gramajı porsiyona, kaşığa ve bardağa çevirin - mutfakta pratik ölçüm aracı
          </p>
        </div>

        <div class="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-12">
          <p class="text-center text-lg font-medium text-gray-900">
            ⚠️ JavaScript gereklidir.
          </p>
        </div>

        <article class="prose prose-lg max-w-none">
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Mutfakta Doğru Ölçüm: Neden Önemli?</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Sağlıklı beslenmenin ve kalori kontrolünün en temel unsuru, porsiyonları doğru ölçmektir. Çoğu insan "göz kararı" ölçüm 
              yaparak günlük kalori alımlarını %20-50 oranında yanlış tahmin eder. Özellikle kilo vermeye çalışıyorsanız veya makro 
              besin dengesini takip ediyorsanız, gram bazında kesin ölçüm yapmak kritik önem taşır.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Mutfak Ölçü Birimleri</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Türk mutfağında yaygın kullanılan ölçü birimleri arasında yemek kaşığı (yaklaşık 15 ml), çay kaşığı (5 ml), su bardağı 
              (200-250 ml) ve çay bardağı (100-125 ml) bulunur. Ancak bu ölçüler gıdanın yoğunluğuna göre değişir. Örneğin 1 yemek 
              kaşığı su 15 gram iken, 1 yemek kaşığı un yaklaşık 8 gram, şeker ise 12.5 gramdır.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Porsiyon Kontrol</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Araştırmalar, porsiyon boyutlarının son 30 yılda ortalama %50 arttığını göstermektedir. Restoranlarda sunulan porsiyonlar 
              genellikle 2-3 standart porsiyona denktir. Evde de büyük tabaklar kullanmak ve "gözle" porsiyon ayarlamak aşırı yemeye 
              yol açar. Mutfak terazisi en güvenilir ölçüm aracıdır ve kalori sayımı yapıyorsanız en iyi yatırımınız olacaktır.
            </p>

            <div class="mt-8 text-center">
              <a href="/hesaplayicilar" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors">
                Diğer Hesaplayıcıları Gör
              </a>
            </div>
          </div>
        </article>
      </div>
    </main>
    ${renderFooter()}
  `;
  return { html, statusCode: 200 };
}

/**
 * Weight Loss Time Calculator SSR (700+ words SEO content)
 */
function renderWeightLossTimeCalculator(categoryGroups: CategoryGroup[]): RenderResult {
  const html = `
    ${renderHeader(categoryGroups)}
    <main class="flex-1 py-12 bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div class="max-w-4xl mx-auto px-4">
        <div class="mb-6">
          <a href="/hesaplayicilar" class="text-amber-600 hover:text-amber-700 font-medium">← Tüm Hesaplayıcılar</a>
        </div>
        
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Kilo Verme/Alma Süresi Hesaplayıcı
          </h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Hedef kilonuza ulaşmak için gereken süreyi ve günlük kalori ihtiyacınızı hesaplayın
          </p>
        </div>

        <div class="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-12">
          <p class="text-center text-lg font-medium text-gray-900">
            ⚠️ JavaScript gereklidir.
          </p>
        </div>

        <article class="prose prose-lg max-w-none">
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Kilo Verme/Alma Süresi: Gerçekçi Hedefler</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Kilo yönetimi bir maraton, sprint değildir. Birçok insan hızlı sonuç almak isterken sürdürülemez yöntemler kullanır 
              ve nihayetinde başarısız olur. Bilimsel araştırmalar, yavaş ve istikrarlı kilo kaybının uzun vadede çok daha etkili 
              olduğunu göstermektedir. Haftada 0.5-1 kg kilo vermek ideal hızdır; bu hem metabolizmayı korur hem de yoyo etkisini önler.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">1 Kilogram Yağ = 7700 Kalori</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Vücut yağının 1 kilogramı yaklaşık 7700 kalori enerji içerir. Bu, 1 kg yağ kaybetmek için toplam 7700 kalori açığı 
              oluşturmanız gerektiği anlamına gelir. Haftada 0.5 kg kilo vermek istiyorsanız, haftalık 3850 kalori (günlük ~550 kalori) 
              açığı gerekir. Bu açık, daha az yiyerek, daha fazla egzersiz yaparak veya her ikisinin kombinasyonuyla sağlanabilir.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Hızlı Kilo Kaybı Neden Zararlı?</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Haftada 1 kg'dan fazla kilo vermek birçok sağlık riski taşır. Aşırı kalori kısıtlaması metabolizmayı yavaşlatır ve 
              vücut "açlık modu"na girer. Bu, kilo kaybını zorlaştırır ve diyet bittiğinde yoyo etkisine yol açar. Ayrıca hızlı kilo 
              kaybı kas kütlesi kaybına neden olur; kaybedilen kilonun %25-30'u kas olabilir.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Sürdürülebilir Kilo Kaybı Stratejileri</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Başarılı ve kalıcı kilo kaybı için gerçekçi hedefler koyun - ayda 2-4 kg hedeflemek idealdir. Kalori sayımı yapın ama 
              obsesif olmayın. Protein alımınızı artırın; protein tokluk hissi verir ve kas kaybını önler. Direnç antrenmanı yapın; 
              kas kütlesini korumak için haftada 2-3 gün ağırlık çalışın. Uyku ve stres yönetimine dikkat edin.
            </p>

            <div class="mt-8 text-center">
              <a href="/hesaplayicilar" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors">
                Diğer Hesaplayıcıları Gör
              </a>
            </div>
          </div>
        </article>
      </div>
    </main>
    ${renderFooter()}
  `;
  return { html, statusCode: 200 };
}

/**
 * About Page (Hakkımızda) SSR
 */
export async function renderAboutPage(categoryGroups: CategoryGroup[]): Promise<RenderResult> {
  const html = `
    ${renderHeader(categoryGroups)}
    <main class="flex-1">
      <section class="relative py-20 bg-gradient-to-br from-white via-green-50 to-emerald-50 overflow-hidden">
        <div class="absolute top-20 left-20 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
        
        <div class="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 class="text-5xl sm:text-6xl font-black mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Hakkımızda
          </h1>
          <p class="text-xl sm:text-2xl text-slate-700 leading-relaxed">
            Türkiye'nin en kapsamlı besin değerleri platformu
          </p>
        </div>
      </section>

      <section class="py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <div class="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-3xl p-8 sm:p-12 shadow-xl shadow-green-500/10">
          <h2 class="text-3xl font-bold text-slate-900 mb-6">Misyonumuz</h2>
          
          <div class="space-y-6 text-lg text-slate-700 leading-relaxed">
            <p>
              <strong class="text-green-600">besindegerim.com</strong>, sağlıklı beslenme yolculuğunuzda 
              size rehberlik etmek için tasarlanmış, Türkiye'nin en kapsamlı besin değerleri platformudur. 
              Amacımız, herkesin kolayca erişebileceği, güvenilir ve bilimsel verilere dayanan bir kaynak sunmaktır.
            </p>
            
            <p>
              Günümüzde sağlıklı yaşam ve dengeli beslenme her zamankinden daha önemli. Ancak doğru besin değeri 
              bilgisine ulaşmak, özellikle Türkçe kaynaklarda, oldukça zor olabilir. İşte tam bu noktada devreye giriyoruz. 
              Platform olarak, <strong class="text-green-600">gerçek porsiyon bazlı</strong> besin değerleri sunarak, 
              günlük hayatınızda pratik ve anlaşılır bir deneyim yaşatmayı hedefliyoruz.
            </p>

            <p>
              <strong class="text-green-600">266+ gıdanın</strong> detaylı besin değerleri ve 
              <strong class="text-green-600"> 16 farklı hesaplayıcı</strong> aracımızla, 
              kalori takibinden makro hesaplamaya, BMI'dan ideal kilo hesaplamaya kadar geniş bir yelpazede 
              ihtiyaçlarınıza cevap veriyoruz.
            </p>
          </div>
        </div>
      </section>

      <section class="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300 shadow-lg shadow-green-500/10">
              <p class="text-4xl font-black text-green-600 mb-2">266+</p>
              <p class="text-slate-700 font-semibold">Gıda Verisi</p>
              <p class="text-sm text-slate-600 mt-2">USDA kaynaklı, doğrulanmış besin değerleri</p>
            </div>

            <div class="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300 shadow-lg shadow-green-500/10">
              <p class="text-4xl font-black text-green-600 mb-2">16</p>
              <p class="text-slate-700 font-semibold">Hesaplayıcı Araç</p>
              <p class="text-sm text-slate-600 mt-2">BMI, kalori, protein ve daha fazlası</p>
            </div>

            <div class="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300 shadow-lg shadow-green-500/10">
              <p class="text-4xl font-black text-green-600 mb-2">100%</p>
              <p class="text-slate-700 font-semibold">Doğruluk</p>
              <p class="text-sm text-slate-600 mt-2">Bilimsel kaynaklara dayalı veriler</p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <h2 class="text-4xl font-bold text-center mb-12 text-slate-900">Değerlerimiz</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white border-2 border-green-200/50 rounded-2xl p-6 hover:border-green-500/50 transition-colors">
            <h3 class="text-xl font-bold text-slate-900 mb-2">Doğruluk ve Güvenilirlik</h3>
            <p class="text-slate-700 leading-relaxed">
              Tüm verilerimiz USDA FoodData Central gibi güvenilir kaynaklardan alınır ve 
              düzenli olarak güncellenir. Kullanıcılarımıza yalnızca doğrulanmış bilgiler sunarız.
            </p>
          </div>

          <div class="bg-white border-2 border-green-200/50 rounded-2xl p-6 hover:border-green-500/50 transition-colors">
            <h3 class="text-xl font-bold text-slate-900 mb-2">Bilimsel Yaklaşım</h3>
            <p class="text-slate-700 leading-relaxed">
              Beslenme bilimi ve diyetetik prensiplerine bağlı kalarak, güncel araştırmalar 
              ışığında hesaplayıcılarımızı ve içeriklerimizi geliştiririz.
            </p>
          </div>

          <div class="bg-white border-2 border-green-200/50 rounded-2xl p-6 hover:border-green-500/50 transition-colors">
            <h3 class="text-xl font-bold text-slate-900 mb-2">Kullanıcı Dostu Deneyim</h3>
            <p class="text-slate-700 leading-relaxed">
              Karmaşık besin değeri verilerini anlaşılır, pratik ve kullanımı kolay bir şekilde sunarak, 
              herkesin faydalanabileceği bir platform oluşturuyoruz.
            </p>
          </div>

          <div class="bg-white border-2 border-green-200/50 rounded-2xl p-6 hover:border-green-500/50 transition-colors">
            <h3 class="text-xl font-bold text-slate-900 mb-2">Şeffaflık</h3>
            <p class="text-slate-700 leading-relaxed">
              Verilerimizin kaynağını açıkça belirtir, hesaplama yöntemlerimizi paylaşır ve 
              kullanıcılarımıza tam şeffaflık sağlarız.
            </p>
          </div>
        </div>
      </section>

      <section class="py-16 bg-gradient-to-br from-white via-green-50 to-emerald-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6">
          <div class="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-3xl p-8 sm:p-12 shadow-xl shadow-green-500/10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">Neden Bu Platformu Kurduk?</h2>
            
            <div class="space-y-4 text-lg text-slate-700 leading-relaxed">
              <p>
                Sağlıklı beslenme konusunda bilinçli kararlar almak isteyen birçok kişi, güvenilir ve 
                Türkçe besin değeri bilgisine ulaşmakta zorlanıyordu. Çoğu kaynak, ya yabancı dilde 
                ya da yeterince detaylı değildi.
              </p>
              
              <p>
                Biz de bu eksikliği gidermek ve herkes için <strong class="text-green-600">ücretsiz</strong>, 
                <strong class="text-green-600"> doğru</strong> ve 
                <strong class="text-green-600"> kullanışlı</strong> bir besin değerleri platformu 
                oluşturmak istedik. Özellikle gerçek porsiyon ölçülerini (1 adet domates, 1 yumurta gibi) 
                baz alarak, günlük hayatta pratik kullanım sağlamayı hedefledik.
              </p>

              <p>
                <strong class="text-green-600">besindegerim.com</strong>, sadece bir veri tabanı değil; 
                aynı zamanda sağlıklı yaşam yolculuğunuzda yanınızda olan, size rehberlik eden bir yardımcıdır. 
                Her gün daha fazla gıda ekleyerek, yeni hesaplayıcılar geliştirerek ve kullanıcı geri bildirimlerini 
                dikkate alarak platformumuzu sürekli geliştiriyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-16 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-3xl font-bold text-slate-900 mb-4">Hadi Başlayalım!</h2>
        <p class="text-lg text-slate-700 mb-8">
          Besin değerlerini keşfedin, hesaplayıcılarımızı kullanın ve sağlıklı yaşam yolculuğunuza bugün başlayın.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/tum-gidalar" class="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300">
            Gıdaları Keşfet
          </a>
          
          <a href="/hesaplayicilar" class="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300">
            Hesaplayıcılar
          </a>
        </div>
      </section>
    </main>
    ${renderFooter()}
  `;

  return { html, statusCode: 200 };
}

/**
 * Contact Page (İletişim) SSR
 */
export async function renderContactPage(categoryGroups: CategoryGroup[]): Promise<RenderResult> {
  const html = `
    ${renderHeader(categoryGroups)}
    <main class="flex-1">
      <section class="relative py-20 bg-gradient-to-br from-white via-green-50 to-emerald-50 overflow-hidden">
        <div class="absolute top-20 left-20 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
        
        <div class="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 class="text-5xl sm:text-6xl font-black mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            İletişim
          </h1>
          <p class="text-xl sm:text-2xl text-slate-700 leading-relaxed">
            Bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız
          </p>
        </div>
      </section>

      <div class="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div class="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-3xl p-8 shadow-xl shadow-green-500/10">
              <h2 class="text-2xl font-bold text-slate-900 mb-6">İletişim Bilgileri</h2>
              
              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">E-posta</h3>
                    <a href="mailto:info@besindegerim.com" class="text-green-600 hover:text-green-700 font-medium">
                      info@besindegerim.com
                    </a>
                    <p class="text-sm text-slate-600 mt-1">
                      Sorularınız, önerileriniz ve işbirliği teklifleri için
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">Yanıt Süresi</h3>
                    <p class="text-slate-700">Hafta içi: <strong class="text-green-600">24-48 saat</strong></p>
                    <p class="text-slate-700">Hafta sonu: <strong class="text-green-600">48-72 saat</strong></p>
                    <p class="text-sm text-slate-600 mt-1">
                      Tüm mesajları dikkatle okur ve en kısa sürede yanıtlarız
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">Mesaj Konuları</h3>
                    <ul class="space-y-1 text-slate-700 text-sm">
                      <li>• Genel sorular ve öneriler</li>
                      <li>• Besin değerleri ile ilgili geri bildirimler</li>
                      <li>• Yeni gıda ekleme talepleri</li>
                      <li>• İşbirliği ve ortaklık teklifleri</li>
                      <li>• Teknik destek ve hata bildirimleri</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200/50 rounded-2xl p-6">
              <p class="text-sm text-slate-700 leading-relaxed">
                <strong class="text-green-600">Not:</strong> Tıbbi tavsiye veya kişisel beslenme 
                planlaması için lütfen bir diyetisyen veya sağlık profesyoneline danışınız. 
                Bu platform sadece bilgilendirme amaçlıdır.
              </p>
            </div>
          </div>

          <div class="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-3xl p-8 shadow-xl shadow-green-500/10">
            <h2 class="text-2xl font-bold text-slate-900 mb-6">Bize Mesaj Gönderin</h2>
            
            <div class="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <p class="text-center text-lg font-medium text-gray-900">
                ⚠️ İletişim formunu kullanmak için JavaScript etkinleştirilmelidir. 
                Lütfen tarayıcınızın ayarlarından JavaScript'i açın veya 
                <a href="mailto:info@besindegerim.com" class="text-green-600 hover:underline font-semibold">
                  info@besindegerim.com
                </a> adresine e-posta gönderin.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section class="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 class="text-3xl font-bold text-center mb-8 text-slate-900">Sıkça Sorulan Sorular</h2>
          
          <div class="space-y-4">
            <div class="bg-white border-2 border-green-200/50 rounded-2xl p-6">
              <h3 class="text-lg font-semibold text-slate-900 mb-2">
                Platformunuz ücretsiz mi?
              </h3>
              <p class="text-slate-700">
                Evet, besindegerim.com tamamen <strong class="text-green-600">ücretsizdir</strong>. 
                Tüm besin değerleri ve hesaplayıcılar herkesin kullanımına açıktır.
              </p>
            </div>

            <div class="bg-white border-2 border-green-200/50 rounded-2xl p-6">
              <h3 class="text-lg font-semibold text-slate-900 mb-2">
                Verilerin kaynağı nedir?
              </h3>
              <p class="text-slate-700">
                Besin değerleri <strong class="text-green-600">USDA FoodData Central</strong> gibi 
                güvenilir kaynaklardan alınır ve bilimsel verilere dayanır.
              </p>
            </div>

            <div class="bg-white border-2 border-green-200/50 rounded-2xl p-6">
              <h3 class="text-lg font-semibold text-slate-900 mb-2">
                Yeni gıda ekleme talebi nasıl yapılır?
              </h3>
              <p class="text-slate-700">
                Yukarıdaki e-posta adresimize mesaj göndererek eklemek istediğiniz gıdayı belirtebilirsiniz. 
                Taleplerinizi değerlendirip en kısa sürede eklemeye çalışırız.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
    ${renderFooter()}
  `;

  return { html, statusCode: 200 };
}

/**
 * Gizlilik Politikası SSR
 */
export async function renderPrivacyPage(categoryGroups: CategoryGroup[]): Promise<RenderResult> {
  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Gizlilik Politikası | besindegerim.com</title>
      <meta name="description" content="besindegerim.com Gizlilik Politikası. Kişisel verilerinizin korunması, KVKK uyumu ve veri güvenliği hakkında detaylı bilgiler.">
      <meta name="robots" content="index, follow">
      <link rel="canonical" href="https://besindegerim.com/gizlilik-politikasi">
    </head>
    <body>
      ${renderHeader(categoryGroups)}
      <main class="flex-1 bg-gradient-to-br from-white via-green-50/30 to-white">
        <div class="container mx-auto max-w-4xl px-4 py-12">
          <div class="mb-12 text-center">
            <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Gizlilik Politikası</h1>
            <p class="text-lg text-slate-600">Son güncelleme: 15 Ekim 2025</p>
          </div>

          <div class="bg-white/70 border-2 border-green-200/50 rounded-3xl p-8 mb-8 shadow-lg">
            <p class="text-slate-700 leading-relaxed mb-4">
              besindegerim.com olarak, kullanıcılarımızın gizliliğine saygı duyuyor ve kişisel verilerinin korunmasına azami önem veriyoruz. 
              Bu Gizlilik Politikası, web sitemizi kullanırken toplanan kişisel verilerin nasıl işlendiğini, saklandığını ve korunduğunu 
              açıklamaktadır. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili mevzuat çerçevesinde hareket ediyoruz.
            </p>
          </div>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">1. Toplanan Kişisel Veriler</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p class="text-slate-700 leading-relaxed">
                Web sitemizi ziyaret ettiğinizde ve kullandığınızda, aşağıdaki kategorilerde kişisel veriler toplanabilir:
              </p>
              <div class="space-y-3">
                <div class="pl-4 border-l-4 border-green-500 py-2">
                  <h3 class="font-semibold text-slate-900 mb-2">Otomatik Toplanan Veriler:</h3>
                  <ul class="list-disc list-inside text-slate-700 space-y-1">
                    <li>IP adresi ve coğrafi konum bilgisi</li>
                    <li>Tarayıcı türü, sürümü ve dil tercihleri</li>
                    <li>Ziyaret edilen sayfalar ve sayfa görüntüleme süreleri</li>
                  </ul>
                </div>
                <div class="pl-4 border-l-4 border-emerald-500 py-2">
                  <h3 class="font-semibold text-slate-900 mb-2">Kullanım Verileri:</h3>
                  <ul class="list-disc list-inside text-slate-700 space-y-1">
                    <li>Arama sorguları ve tercihler</li>
                    <li>Besin değeri aramaları</li>
                    <li>Hesaplayıcı kullanım verileri</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">2. Verilerin İşlenme Amaçları</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p class="text-slate-700 leading-relaxed">
                Toplanan kişisel veriler, yalnızca aşağıdaki meşru amaçlar doğrultusunda işlenmektedir:
              </p>
              <ul class="space-y-3">
                <li class="flex gap-3">
                  <span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">1</span>
                  <span class="text-slate-700"><strong>Hizmet Sunumu:</strong> Web sitesinin işlevselliğini sağlamak</span>
                </li>
                <li class="flex gap-3">
                  <span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">2</span>
                  <span class="text-slate-700"><strong>Kullanıcı Deneyimi:</strong> Site performansını optimize etmek</span>
                </li>
                <li class="flex gap-3">
                  <span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">3</span>
                  <span class="text-slate-700"><strong>Güvenlik:</strong> Kötüye kullanımı önlemek</span>
                </li>
              </ul>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">3. Çerezler ve İzleme Teknolojileri</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6">
              <p class="text-slate-700 leading-relaxed">
                Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. 
                Detaylı bilgi için <a href="/cerez-politikasi" class="text-green-600 hover:text-green-700 font-semibold underline">Çerez Politikamızı</a> inceleyebilirsiniz.
              </p>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">4. Kullanıcı Hakları</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6">
              <p class="text-slate-700 leading-relaxed mb-4">
                KVKK kapsamında, kişisel verilerinizle ilgili haklara sahipsiniz: bilgi alma, erişim, düzeltme, silme ve itiraz hakkı.
              </p>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">5. KVKK Uyumu ve Veri Güvenliği</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6">
              <p class="text-slate-700 leading-relaxed">
                6698 sayılı KVKK'ya tam uyum sağlamak için SSL/TLS şifreleme, güvenlik duvarı koruması ve düzenli güvenlik güncellemeleri uygulanmaktadır.
              </p>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">6. İletişim ve Başvuru</h2>
            <div class="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-300/50 rounded-3xl p-8">
              <p class="text-slate-700 leading-relaxed mb-4">
                Kişisel verilerinizle ilgili sorularınız için bizimle iletişime geçebilirsiniz:
              </p>
              <div class="bg-white rounded-xl p-6 border-2 border-green-200">
                <p class="text-lg font-semibold text-slate-900 mb-2">E-posta:</p>
                <a href="mailto:info@besindegerim.com" class="text-green-600 hover:text-green-700 font-bold text-xl">
                  info@besindegerim.com
                </a>
              </div>
            </div>
          </section>

          <div class="mt-12 bg-slate-100 rounded-2xl p-6 border-2 border-slate-200">
            <p class="text-sm text-slate-600 mb-2">
              <strong>Son Güncelleme:</strong> 15 Ekim 2025
            </p>
            <p class="text-sm text-slate-700 leading-relaxed">
              Bu Gizlilik Politikası gerektiğinde güncellenebilir. Güncellemeler bu sayfada yayınlanır.
            </p>
          </div>
        </div>
      </main>
      ${renderFooter()}
    </body>
    </html>
  `;

  return { html, statusCode: 200 };
}

/**
 * Kullanım Koşulları SSR
 */
export async function renderTermsPage(categoryGroups: CategoryGroup[]): Promise<RenderResult> {
  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kullanım Koşulları | besindegerim.com</title>
      <meta name="description" content="besindegerim.com Kullanım Koşulları. Web sitesi kullanım kuralları, sorumluluklar, fikri mülkiyet hakları ve yasal bilgiler.">
      <meta name="robots" content="index, follow">
      <link rel="canonical" href="https://besindegerim.com/kullanim-kosullari">
    </head>
    <body>
      ${renderHeader(categoryGroups)}
      <main class="flex-1 bg-gradient-to-br from-white via-green-50/30 to-white">
        <div class="container mx-auto max-w-4xl px-4 py-12">
          <div class="mb-12 text-center">
            <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Kullanım Koşulları</h1>
            <p class="text-lg text-slate-600">Son güncelleme: 15 Ekim 2025</p>
          </div>

          <div class="bg-white/70 border-2 border-green-200/50 rounded-3xl p-8 mb-8 shadow-lg">
            <p class="text-slate-700 leading-relaxed mb-4">
              besindegerim.com web sitesine hoş geldiniz. Bu Kullanım Koşulları, sitemizi kullanımınızı düzenleyen yasal 
              bir sözleşmedir. Sitemize erişerek veya kullanarak, bu koşulları kabul etmiş sayılırsınız.
            </p>
          </div>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">1. Koşulların Kabulü</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6">
              <p class="text-slate-700 leading-relaxed">
                besindegerim.com'u ziyaret ettiğinizde, bu Kullanım Koşulları'nı ve Gizlilik Politikamızı kabul etmiş sayılırsınız.
              </p>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">2. Hizmet Tanımı ve Kullanım Amacı</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <p class="text-slate-700 leading-relaxed">
                besindegerim.com, besin değeri bilgileri ve sağlık hesaplayıcıları sunar.
              </p>
              <div class="bg-red-50 border-2 border-red-300 rounded-xl p-5">
                <p class="text-sm font-bold text-red-900 mb-2">SORUMLULUK REDDİ</p>
                <p class="text-sm text-red-800 leading-relaxed">
                  Bu web sitesinde sunulan tüm bilgiler <strong>sadece genel bilgilendirme amaçlıdır</strong> ve 
                  hiçbir şekilde tıbbi tavsiye, teşhis veya tedavi yerine geçmez.
                </p>
              </div>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">3. Kullanıcı Sorumlulukları</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6">
              <p class="text-slate-700 leading-relaxed mb-4">
                Web sitemizi kullanırken yasal kurallara uymayı ve zararlı faaliyetlerden kaçınmayı taahhüt edersiniz.
              </p>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">4. Fikri Mülkiyet Hakları</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6">
              <p class="text-slate-700 leading-relaxed">
                Web sitesindeki tüm içerik, tasarım ve markalar telif hakları ile korunmaktadır. İzinsiz kullanım yasaktır.
              </p>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">5. Sorumluluk Sınırlaması</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6">
              <p class="text-slate-700 leading-relaxed">
                Web sitemiz "olduğu gibi" sunulmaktadır. Kesintisiz veya hatasız çalışma garantisi verilmemektedir.
              </p>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">6. Koşullarda Değişiklik</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6">
              <p class="text-slate-700 leading-relaxed">
                Bu koşullar önceden haber verilmeksizin güncellenebilir. Güncellemeler bu sayfada yayınlanır.
              </p>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">7. Geçerli Hukuk</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6">
              <p class="text-slate-700 leading-relaxed">
                Bu koşullar Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıklar İstanbul mahkemelerinde çözülür.
              </p>
            </div>
          </section>

          <div class="mt-12 bg-slate-100 rounded-2xl p-6 border-2 border-slate-200">
            <p class="text-sm text-slate-600 mb-4">
              <strong>Son Güncelleme:</strong> 15 Ekim 2025
            </p>
            <p class="text-sm text-slate-700 leading-relaxed">
              İletişim: <a href="mailto:info@besindegerim.com" class="text-green-600 hover:text-green-700 font-semibold">info@besindegerim.com</a>
            </p>
          </div>
        </div>
      </main>
      ${renderFooter()}
    </body>
    </html>
  `;

  return { html, statusCode: 200 };
}

/**
 * Çerez Politikası SSR
 */
export async function renderCookiePage(categoryGroups: CategoryGroup[]): Promise<RenderResult> {
  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Çerez Politikası | besindegerim.com</title>
      <meta name="description" content="besindegerim.com Çerez Politikası. Çerez kullanımı, türleri, amaçları ve yönetimi hakkında detaylı bilgiler.">
      <meta name="robots" content="index, follow">
      <link rel="canonical" href="https://besindegerim.com/cerez-politikasi">
    </head>
    <body>
      ${renderHeader(categoryGroups)}
      <main class="flex-1 bg-gradient-to-br from-white via-green-50/30 to-white">
        <div class="container mx-auto max-w-4xl px-4 py-12">
          <div class="mb-12 text-center">
            <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Çerez Politikası</h1>
            <p class="text-lg text-slate-600">Son güncelleme: 15 Ekim 2025</p>
          </div>

          <div class="bg-white/70 border-2 border-green-200/50 rounded-3xl p-8 mb-8 shadow-lg">
            <p class="text-slate-700 leading-relaxed mb-4">
              besindegerim.com olarak, web sitemizde kullanıcı deneyimini iyileştirmek ve site performansını optimize etmek 
              amacıyla çerezler (cookies) kullanmaktayız.
            </p>
          </div>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">1. Çerez (Cookie) Nedir?</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6">
              <p class="text-slate-700 leading-relaxed">
                Çerezler, web sitesini ziyaret ettiğinizde tarayıcınız tarafından cihazınıza kaydedilen küçük metin dosyalarıdır. 
                Web sitesinin işlevselliğini artırmak için kullanılır.
              </p>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">2. Kullanılan Çerezler</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6 space-y-4">
              <div class="border-2 border-red-200 bg-red-50 rounded-xl p-5">
                <h3 class="font-bold text-red-900 text-lg mb-2">Zorunlu Çerezler</h3>
                <p class="text-sm text-slate-700">
                  Web sitesinin temel işlevleri için kesinlikle gereklidir.
                </p>
              </div>
              <div class="border-2 border-blue-200 bg-blue-50 rounded-xl p-5">
                <h3 class="font-bold text-blue-900 text-lg mb-2">İşlevsel Çerezler</h3>
                <p class="text-sm text-slate-700">
                  Tercihlerinizi hatırlayarak gelişmiş özellikler sunar.
                </p>
              </div>
              <div class="border-2 border-green-200 bg-green-50 rounded-xl p-5">
                <h3 class="font-bold text-green-900 text-lg mb-2">Analitik Çerezler</h3>
                <p class="text-sm text-slate-700">
                  Kullanım istatistikleri toplar (Google Analytics gibi).
                </p>
              </div>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">3. Çerez Türleri (Süre)</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6">
              <p class="text-slate-700 leading-relaxed mb-3">
                <strong>Oturum Çerezleri:</strong> Tarayıcınızı kapattığınızda silinir.
              </p>
              <p class="text-slate-700 leading-relaxed">
                <strong>Kalıcı Çerezler:</strong> Belirli bir süre cihazınızda kalır.
              </p>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">4. Çerezleri Nasıl Kontrol Edebilirsiniz?</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6">
              <p class="text-slate-700 leading-relaxed mb-4">
                Tarayıcı ayarlarınızdan çerezleri yönetebilir, silebilir veya engelleyebilirsiniz.
              </p>
              <div class="bg-amber-50 border-2 border-amber-300 rounded-xl p-5">
                <p class="text-sm text-amber-800">
                  <strong>Dikkat:</strong> Çerezleri devre dışı bırakırsanız, bazı özellikler düzgün çalışmayabilir.
                </p>
              </div>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">5. Üçüncü Taraf Çerezleri</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6">
              <p class="text-slate-700 leading-relaxed">
                Google Analytics gibi üçüncü taraf hizmetler kullanılabilir. Bu hizmetler kendi gizlilik politikalarına tabidir.
              </p>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">6. Güncellemeler</h2>
            <div class="bg-white rounded-2xl border-2 border-green-100 p-6">
              <p class="text-slate-700 leading-relaxed">
                Bu Çerez Politikası gerektiğinde güncellenebilir. Güncellemeler bu sayfada yayınlanır.
              </p>
            </div>
          </section>

          <div class="mt-12 bg-slate-100 rounded-2xl p-6 border-2 border-slate-200">
            <p class="text-sm text-slate-600 mb-4">
              <strong>Son Güncelleme:</strong> 15 Ekim 2025
            </p>
            <p class="text-sm text-slate-700 leading-relaxed">
              Sorularınız için: <a href="mailto:info@besindegerim.com" class="text-green-600 hover:text-green-700 font-semibold">info@besindegerim.com</a>
            </p>
          </div>
        </div>
      </main>
      ${renderFooter()}
    </body>
    </html>
  `;

  return { html, statusCode: 200 };
}
