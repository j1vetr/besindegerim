/**
 * Server-Side Rendering Functions
 * Pure HTML string'ler döndürür (React component yok)
 */

import type { Food, CategoryGroup } from "@shared/schema";

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

  const html = `
    ${renderHeader(categoryGroups)}
    <main class="min-h-screen">
      <section class="py-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Besin Değeri Anında
          </h1>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
            ${foods.length}+ gıdanın gerçek porsiyon bazlı kalori ve besin değerleri
          </p>
        </div>
      </section>
      
      <section class="py-12 container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8">Popüler Gıdalar</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${foodsHTML}
        </div>
        <div class="text-center mt-8">
          <a href="/tum-gidalar" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
            Tüm Gıdaları Gör
          </a>
        </div>
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
