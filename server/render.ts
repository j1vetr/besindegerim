/**
 * Server-Side Rendering Functions
 * Pure HTML string'ler döndürür (React component yok)
 */

import type { Food, CategoryGroup } from "@shared/schema";
import { 
  getFAQPageSchema, 
  serializeSchema,
  getDailyCalorieCalculatorSchema,
  getBMICalculatorSchema,
  getIdealWeightCalculatorSchema,
  getWaterIntakeCalculatorSchema,
  getProteinCalculatorSchema,
  getPortionConverterCalculatorSchema,
  getWeightLossTimeCalculatorSchema,
  getBodyFatCalculatorSchema
} from "./seo/schemas";
import { getCalculatorRecommendations } from "@shared/calculatorRecommendations";

interface RenderResult {
  html: string;
  statusCode: number;
}

/**
 * Header HTML (tüm sayfalarda ortak)
 * SSR için detaylı HTML - JavaScript gerektirmeyen navigasyon
 */
function renderHeader(categoryGroups: CategoryGroup[]): string {
  return `
    <header class="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 border-b-2 border-green-200/50 shadow-lg shadow-green-500/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        <!-- Top bar - Logo, Search & Navigation -->
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Logo -->
          <a href="/" class="flex-shrink-0 hover:scale-105 transition-transform">
            <img 
              src="/logo.png" 
              alt="Besin Değerim" 
              class="h-14 sm:h-16 lg:h-20 w-auto"
            />
          </a>

          <!-- Search Form (No JavaScript required) -->
          <div class="flex-1 min-w-0">
            <form action="/ara" method="GET">
              <div class="relative">
                <svg class="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input
                  type="text"
                  name="q"
                  placeholder="Ara..."
                  class="h-10 sm:h-11 w-full rounded-2xl border-2 border-green-200/50 bg-white pl-10 sm:pl-12 pr-4 sm:pr-6 text-sm text-slate-900 placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-green-500"
                />
              </div>
            </form>
          </div>

          <!-- Mobile Navigation -->
          <nav class="flex lg:hidden items-center gap-1">
            <a href="/hesaplayicilar" class="px-3 py-2 text-xs font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-md whitespace-nowrap">16 Hesap</a>
          </nav>
        </div>

        <!-- Desktop Categories Navigation -->
        <div class="hidden lg:flex items-center gap-2 mt-3 overflow-x-auto pb-2">
          <a 
            href="/hesaplayicilar" 
            class="inline-block whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg border-2 border-green-500"
          >
            Hesaplayıcılar (16)
          </a>
          <a 
            href="/tum-gidalar" 
            class="whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-200/50"
          >
            Tümü
          </a>
          ${categoryGroups.slice(0, 8).map(group => `
            <a 
              href="/kategori/${group.mainCategory.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/İ/g, 'i').replace(/[^a-z0-9]+/g, '-')}" 
              class="whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-200/50"
            >
              ${group.mainCategory}
            </a>
          `).join('')}
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
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="font-semibold mb-4">besindegerim.com</h3>
            <p class="text-sm text-muted-foreground">
              Türkiye'nin en kapsamlı besin değerleri platformu. Gerçek porsiyon bazlı kalori ve makro hesaplama.
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Kurumsal</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="/hakkimizda" class="text-muted-foreground hover:text-foreground">Hakkımızda</a></li>
              <li><a href="/iletisim" class="text-muted-foreground hover:text-foreground">İletişim</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Yasal</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="/gizlilik-politikasi" class="text-muted-foreground hover:text-foreground">Gizlilik Politikası</a></li>
              <li><a href="/kullanim-kosullari" class="text-muted-foreground hover:text-foreground">Kullanım Koşulları</a></li>
              <li><a href="/kvkk" class="text-muted-foreground hover:text-foreground">KVKK Aydınlatma Metni</a></li>
              <li><a href="/cerez-politikasi" class="text-muted-foreground hover:text-foreground">Çerez Politikası</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">İletişim</h4>
            <p class="text-sm text-muted-foreground mb-2">Soru, öneri ve işbirliği için:</p>
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
          <svg class="w-16 h-16 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      `}
      <h3 class="font-semibold text-lg mb-2">${food.name}</h3>
      <p class="text-sm text-muted-foreground">${food.servingLabel || `${food.servingSize}g`}</p>
      <p class="text-2xl font-bold text-green-600 mt-2">${Math.round(parseFloat(food.calories))} kcal</p>
    </a>
  `).join('');

  // FAQ data for SSR - 6 Essential Questions
  const faqData = [
    {
      question: "besindegerim.com nedir?",
      answer: "besindegerim.com, Türkiye'nin en kapsamlı besin değerleri platformudur. 266+ gıdanın gerçek porsiyon bazlı kalori, protein, karbonhidrat, yağ ve vitamin/mineral değerlerini sunar. Bilimsel kaynaklardan alınan güvenilir verilerle desteklenir. Ücretsiz hesaplayıcılar (BMI, kalori, protein, makro dağılımı) ve detaylı besin analizleri sağlar."
    },
    {
      question: "Besin değerleri doğru mu?",
      answer: "Evet, tüm besin değerleri uluslararası kabul görmüş bilimsel veritabanlarından alınır. Laboratuvar analizleri ve bilimsel çalışmalarla doğrulanmış, dünya çapında güvenilir kaynaklardır. Veriler düzenli olarak güncellenir ve 20+ vitamin/mineral içerir. Platform üzerindeki her besin için detaylı makro ve mikro besin öğesi bilgisi bulunur."
    },
    {
      question: "Platformu nasıl kullanırım?",
      answer: "Ana sayfadaki arama kutusuna gıda adını yazın (örn: elma, tavuk). Arama sonuçlarından istediğiniz gıdayı seçin. Detay sayfasında porsiyon başına kalori, protein, karbonhidrat, yağ ve 20+ vitamin/mineral değerlerini görürsünüz. Hesaplayıcılar menüsünden BMI, kalori, protein gibi hesaplamalar yapabilirsiniz."
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

  // Build comprehensive nutrition table
  const nutritionRows: {name: string, amount: string, unit: string}[] = [];
  
  // Macronutrients
  if (food.protein) nutritionRows.push({name: 'Protein', amount: parseFloat(food.protein).toFixed(1), unit: 'g'});
  if (food.carbs) nutritionRows.push({name: 'Karbonhidrat', amount: parseFloat(food.carbs).toFixed(1), unit: 'g'});
  if (food.fiber) nutritionRows.push({name: 'Lif', amount: parseFloat(food.fiber).toFixed(1), unit: 'g'});
  if (food.sugar) nutritionRows.push({name: 'Şeker', amount: parseFloat(food.sugar).toFixed(1), unit: 'g'});
  if (food.addedSugar && parseFloat(food.addedSugar) > 0) nutritionRows.push({name: 'Eklenmiş Şeker', amount: parseFloat(food.addedSugar).toFixed(1), unit: 'g'});
  if (food.fat) nutritionRows.push({name: 'Yağ (Toplam)', amount: parseFloat(food.fat).toFixed(1), unit: 'g'});
  if (food.saturatedFat && parseFloat(food.saturatedFat) > 0) nutritionRows.push({name: 'Doymuş Yağ', amount: parseFloat(food.saturatedFat).toFixed(1), unit: 'g'});
  if (food.transFat && parseFloat(food.transFat) > 0) nutritionRows.push({name: 'Trans Yağ', amount: parseFloat(food.transFat).toFixed(1), unit: 'g'});
  if (food.cholesterol && parseFloat(food.cholesterol) > 0) nutritionRows.push({name: 'Kolesterol', amount: parseFloat(food.cholesterol).toFixed(0), unit: 'mg'});
  
  // Minerals & Vitamins from micronutrients
  if (food.micronutrients) {
    const micronutrients = food.micronutrients as any;
    Object.keys(micronutrients).forEach(key => {
      const nutrient = micronutrients[key];
      if (nutrient && nutrient.amount && parseFloat(nutrient.amount) > 0) {
        const formattedName = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        nutritionRows.push({name: formattedName, amount: parseFloat(nutrient.amount).toFixed(1), unit: nutrient.unit || ''});
      }
    });
  }

  const nutritionTableHTML = nutritionRows.length > 0 ? `
    <div class="bg-white rounded-lg border-2 border-border p-6 mb-8">
      <h2 class="text-2xl font-bold mb-4">Besin Değerleri Tablosu</h2>
      <p class="text-sm text-muted-foreground mb-4">Porsiyon başına: ${food.servingLabel || `${food.servingSize}g`}</p>
      <table class="w-full">
        <thead>
          <tr class="border-b border-border">
            <th class="text-left py-2 font-semibold">Besin</th>
            <th class="text-right py-2 font-semibold">Miktar</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-border bg-green-50">
            <td class="py-3 font-semibold">Kalori</td>
            <td class="text-right py-3 font-semibold text-green-600">${Math.round(parseFloat(food.calories))} kcal</td>
          </tr>
          ${nutritionRows.map(row => `
            <tr class="border-b border-border hover:bg-muted/50">
              <td class="py-2">${row.name}</td>
              <td class="text-right py-2">${row.amount} ${row.unit}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : '';

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
          
          <h1 class="text-4xl font-bold mb-4">${food.name} Kaç Kalori?</h1>
          
          <div class="rounded-xl border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 p-6 mb-8">
            <div class="flex items-baseline gap-2 mb-2">
              <span class="text-5xl font-bold text-green-600">${Math.round(parseFloat(food.calories))}</span>
              <span class="text-xl text-muted-foreground">kalori</span>
            </div>
            <p class="text-base text-gray-700 font-medium">
              ${food.name}, ${food.servingLabel || `${food.servingSize}g`} başına ${Math.round(parseFloat(food.calories))} kalori içerir. 
              Bu değer gerçek porsiyon bazlı bilimsel verilerine göre hesaplanmıştır.
            </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            ${macrosHTML}
          </div>

          ${nutritionTableHTML}

          ${(() => {
            const recommendations = getCalculatorRecommendations(food);
            
            // Icon SVG mapper for SSR - simple inline SVGs
            const getIconSVG = (iconName: string): string => {
              const icons: Record<string, string> = {
                Beef: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />',
                Flame: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />',
                TrendingUp: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />',
                Scale: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />',
                Heart: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />',
                Droplets: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />',
                Utensils: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />',
                Pill: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />',
                Activity: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />'
              };
              return icons[iconName] || icons.Flame;
            };
            
            return `
              <div class="mb-12 max-w-6xl mx-auto">
                <div class="text-center mb-10">
                  <div class="inline-flex items-center gap-3 mb-4">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <h3 class="text-3xl font-bold text-gray-900">
                      ${food.name} İçin Önerilen Hesaplayıcılar
                    </h3>
                  </div>
                  <p class="text-gray-600 text-lg">
                    Beslenme hedefleriniz için size özel hesaplama araçları
                  </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  ${recommendations.map(calc => `
                    <a 
                      href="/hesaplayici/${calc.id}" 
                      class="group block border-2 border-transparent hover:border-green-500/30 rounded-lg p-8 bg-white shadow-md hover:shadow-2xl transition-all duration-300"
                    >
                      <div class="flex items-start gap-6">
                        <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-br ${calc.color} rounded-2xl flex items-center justify-center shadow-lg">
                          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            ${getIconSVG(calc.iconName)}
                          </svg>
                        </div>
                        
                        <div class="flex-1 min-w-0">
                          <h4 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                            ${calc.title}
                          </h4>
                          <p class="text-gray-600 mb-3 leading-relaxed">
                            ${calc.description}
                          </p>
                          <div class="flex items-center gap-2">
                            <div class="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                              <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              <span class="text-xs">${calc.reason}</span>
                            </div>
                          </div>
                        </div>

                        <svg class="flex-shrink-0 w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </a>
                  `).join('')}
                </div>

                <div class="text-center">
                  <a 
                    href="/hesaplayicilar"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Tüm Hesaplayıcılar</span>
                  </a>
                </div>
              </div>
            `;
          })()}

          ${food.category ? `
            <div class="text-sm text-muted-foreground mb-8">
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
          <svg class="w-16 h-16 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
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
    { id: "gunluk-kalori-ihtiyaci", title: "Günlük Kalori ve Makro Hesaplayıcı", description: "BMR, TDEE ve günlük kalori ihtiyacınızı hesaplayın. Protein, karbonhidrat ve yağ dağılımınızı öğrenin.", iconName: "Flame", color: "from-green-500 to-emerald-600", popular: true },
    { id: "bmi", title: "Vücut Kitle İndeksi (BMI)", description: "Sağlıklı kilo aralığınızı öğrenin. WHO standartlarına göre BMI hesaplama.", iconName: "Scale", color: "from-blue-500 to-cyan-600", popular: true },
    { id: "vucut-yag-yuzde", title: "Vücut Yağ Yüzdesi", description: "Navy Method ile vücut yağ yüzdesini hesaplayın. BMI'dan çok daha doğru sonuç!", iconName: "Activity", color: "from-indigo-500 to-purple-600", popular: true },
    { id: "ideal-kilo", title: "İdeal Kilo Hesaplayıcı", description: "Boyunuza göre ideal kilonuzu hesaplayın. Devine ve Broca formülleriyle.", iconName: "Heart", color: "from-pink-500 to-rose-600", popular: false },
    { id: "gunluk-su-ihtiyaci", title: "Günlük Su İhtiyacı", description: "Kilonuza ve aktivite seviyenize göre günlük su ihtiyacınızı hesaplayın.", iconName: "Droplets", color: "from-sky-500 to-blue-600", popular: false },
    { id: "protein-gereksinimi", title: "Protein Gereksinimi", description: "Hedef ve aktivite seviyenize göre günlük protein ihtiyacınızı öğrenin.", iconName: "Beef", color: "from-red-500 to-orange-600", popular: true },
    { id: "porsiyon-cevirici", title: "Porsiyon Çevirici", description: "Gramajı porsiyona, porsiyonu kaşık ve bardağa çevirin. Benzersiz araç!", iconName: "Utensils", color: "from-purple-500 to-pink-600", popular: true },
    { id: "kilo-verme-suresi", title: "Kilo Verme/Alma Süresi", description: "Hedef kilonuza ulaşmanız için gereken süreyi hesaplayın.", iconName: "TrendingUp", color: "from-amber-500 to-orange-600", popular: false }
  ];

  const popularCalculators = calculators.filter(c => c.popular);
  const otherCalculators = calculators.filter(c => !c.popular);

  // Icon SVG mapper
  const getIconSVG = (iconName: string): string => {
    const icons: Record<string, string> = {
      Flame: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />',
      Scale: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />',
      Activity: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />',
      Heart: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />',
      Droplets: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />',
      Beef: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />',
      Utensils: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />',
      TrendingUp: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />'
    };
    return icons[iconName] || icons.Flame;
  };

  const renderCalculatorCard = (calc: any) => `
    <a href="/hesaplayici/${calc.id}" class="group block border-2 border-transparent hover:border-green-500/30 rounded-lg p-8 bg-white hover:shadow-2xl transition-all duration-300">
      <div class="w-16 h-16 bg-gradient-to-br ${calc.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${getIconSVG(calc.iconName)}
        </svg>
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
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span class="text-sm font-semibold text-green-600">8 Ücretsiz Hesaplayıcı</span>
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
            <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Popüler Hesaplayıcılar
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
    case "vucut-yag-yuzde":
      return renderBodyFatCalculator(categoryGroups);
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
    ${serializeSchema(getDailyCalorieCalculatorSchema())}
    <main class="flex-1 py-12 bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div class="max-w-4xl mx-auto px-4">
        <div class="mb-6">
          <a href="/hesaplayicilar" class="text-red-600 hover:text-red-700 font-medium">← Tüm Hesaplayıcılar</a>
        </div>
        
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-full px-6 py-2 mb-6 shadow-lg">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
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
          <p class="text-center text-lg font-medium text-gray-900 flex items-center justify-center gap-2">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Bu hesaplayıcıyı kullanmak için JavaScript etkinleştirilmelidir. 
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
    ${serializeSchema(getBMICalculatorSchema())}
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
             Bu hesaplayıcıyı kullanmak için JavaScript etkinleştirilmelidir.
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
 * Body Fat Percentage Calculator SSR (700+ words SEO content)
 */
function renderBodyFatCalculator(categoryGroups: CategoryGroup[]): RenderResult {
  const html = `
    ${renderHeader(categoryGroups)}
    ${serializeSchema(getBodyFatCalculatorSchema())}
    <main class="flex-1 py-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div class="max-w-4xl mx-auto px-4">
        <div class="mb-6">
          <a href="/hesaplayicilar" class="text-indigo-600 hover:text-indigo-700 font-medium">← Tüm Hesaplayıcılar</a>
        </div>
        
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full px-6 py-2 mb-6 shadow-lg">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="font-semibold">Navy Method Formülü</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Vücut Yağ Yüzdesi Hesaplayıcı
          </h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Navy Method ile vücut yağ yüzdenizi hesaplayın. BMI'dan çok daha doğru sonuç!
          </p>
        </div>

        <div class="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-12">
          <p class="text-center text-lg font-medium text-gray-900">
             Bu hesaplayıcıyı kullanmak için JavaScript etkinleştirilmelidir.
          </p>
        </div>

        <article class="prose prose-lg max-w-none">
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Vücut Yağ Yüzdesi Nedir?</h2>
            
            <p class="text-gray-700 leading-relaxed mb-4">
              Vücut yağ yüzdesi, toplam vücut ağırlığınızın yüzde kaçının yağdan oluştuğunu gösteren bir ölçümdür. BMI'dan farklı olarak, 
              vücut kompozisyonunuzu daha doğru yansıtır çünkü kas kütlesi ile yağ kütlesini ayırt eder. Örneğin iki kişi aynı kilo ve 
              boyda olabilir (dolayısıyla aynı BMI), ancak biri kaslı ve düşük yağ yüzdesine sahipken diğeri yüksek yağ yüzdesine sahip 
              olabilir. Sağlıklı vücut yağ yüzdesi erkekler için %6-24, kadınlar için %14-31 arasındadır. Atletler genellikle daha düşük 
              değerlere sahiptir: erkek atletler %6-13, kadın atletler %14-20.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Navy Method (US Navy) Formülü</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Navy Method, Amerikan Donanması tarafından geliştirilen ve yaygın olarak kullanılan bir yöntemdir. Bu metot bel çevresi, 
              boyun çevresi ve (kadınlar için) kalça çevresi ölçümlerini kullanarak vücut yağ yüzdesini tahmin eder. Erkekler için formül: 
              495 / (1.0324 - 0.19077 × log10(bel - boyun) + 0.15456 × log10(boy)) - 450. Kadınlar için: 495 / (1.29579 - 0.35004 × 
              log10(bel + kalça - boyun) + 0.22100 × log10(boy)) - 450. Bu yöntem pratik, ucuz ve makul derecede doğrudur (%3-4 hata payı).
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Ölçüm Nasıl Yapılır?</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Doğru sonuçlar için ölçümleri sabah, aç karnına yapın. Bel çevresini göbek deliğinizin hizasından, en geniş noktadan ölçün; 
              nefes verirken ancak karnınızı içeri çekmeden. Boyun çevresini başınızın hemen altından, en ince noktadan ölçün. Kadınlar 
              kalça çevresini kalçanın en geniş noktasından ölçmelidir. Her ölçümü en az iki kez yapın ve ortalamasını alın. Ölçüm bandı 
              gergin ama cildi sıkmayacak şekilde olmalıdır. Aynı kişi tutarlı sonuçlar için hep aynı şekilde ölçüm yapmalıdır.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Vücut Yağ Yüzdesi Kategorileri</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              <strong>Erkekler:</strong> Atletik ≤13%, Fit 14-17%, Normal 18-24%, Fazla Kilolu 25-29%, Obez ≥30%. 
              <strong>Kadınlar:</strong> Atletik ≤20%, Fit 21-24%, Normal 25-31%, Fazla Kilolu 32-37%, Obez ≥38%. 
              Çok düşük yağ yüzdeleri (<6% erkek, <14% kadın) sağlık sorunlarına yol açabilir: hormon dengesizlikleri, kemik 
              kaybı, bağışıklık sistemi zayıflaması. Optimal sağlık için hedef aralıkta kalmaya çalışın.
            </p>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Vücut Yağını Azaltma Stratejileri</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Vücut yağını sağlıklı bir şekilde azaltmak için kalori açığı oluşturmalısınız ancak bu aşırı olmamalıdır. Günde 300-500 
              kalori açığı ideal hızda yağ kaybı sağlar (haftada 0.5-1 kg). Protein alımını artırın (kg başına 1.6-2.2g); protein kas 
              kaybını önler ve tokluk hissi verir. Kuvvet antrenmanı yapın (haftada 3-4 gün); bu kas kütlesini korurken metabolizmayı 
              hızlandırır. Kardio egzersizleri ekleyin (haftada 150-300 dakika orta tempo veya 75-150 dakika yüksek tempo). Yeterli 
              uyuyun (7-9 saat); uyku eksikliği hormonları bozar ve yağ depolanmasını artırır. İşlenmiş gıdalardan, şekerden ve trans 
              yağlardan kaçının.
            </p>

            <div class="mt-8 text-center">
              <a href="/hesaplayicilar" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors">
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
    ${serializeSchema(getIdealWeightCalculatorSchema())}
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
             JavaScript gereklidir.
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
    ${serializeSchema(getWaterIntakeCalculatorSchema())}
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
             JavaScript gereklidir.
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
    ${serializeSchema(getProteinCalculatorSchema())}
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
             JavaScript gereklidir.
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
    ${serializeSchema(getPortionConverterCalculatorSchema())}
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
             JavaScript gereklidir.
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
    ${serializeSchema(getWeightLossTimeCalculatorSchema())}
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
             JavaScript gereklidir.
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
              <p class="text-sm text-slate-600 mt-2">Bilimsel kaynaklı, doğrulanmış besin değerleri</p>
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
              Tüm verilerimiz uluslararası kabul görmüş güvenilir bilimsel kaynaklardan alınır ve 
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
                 İletişim formunu kullanmak için JavaScript etkinleştirilmelidir. 
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
                Besin değerleri <strong class="text-green-600">uluslararası kabul görmüş bilimsel</strong> 
                kaynaklardan alınır ve doğrulanmış verilere dayanır.
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
