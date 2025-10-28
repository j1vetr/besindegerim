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
 * Render Calculator Page (Placeholder for all calculator pages)
 */
export async function renderCalculatorPage(calculatorId: string, categoryGroups: CategoryGroup[]): Promise<RenderResult> {
  const calculators: Record<string, any> = {
    "gunluk-kalori-ihtiyaci": { title: "Günlük Kalori ve Makro Hesaplayıcı", icon: "🔥" },
    "bmi": { title: "Vücut Kitle İndeksi (BMI)", icon: "⚖️" },
    "ideal-kilo": { title: "İdeal Kilo Hesaplayıcı", icon: "💚" },
    "gunluk-su-ihtiyaci": { title: "Günlük Su İhtiyacı", icon: "💧" },
    "protein-gereksinimi": { title: "Protein Gereksinimi", icon: "🥩" },
    "porsiyon-cevirici": { title: "Porsiyon Çevirici", icon: "📊" },
    "kilo-verme-suresi": { title: "Kilo Verme/Alma Süresi", icon: "📈" }
  };

  const calculator = calculators[calculatorId];
  if (!calculator) {
    return await render404Page(categoryGroups);
  }

  const html = `
    ${renderHeader(categoryGroups)}
    <main class="flex-1 py-12">
      <div class="max-w-7xl mx-auto px-4">
        <div class="mb-8">
          <a href="/hesaplayicilar" class="text-green-600 hover:text-green-700 font-medium">← Tüm Hesaplayıcılar</a>
        </div>
        <div class="text-center mb-12">
          <span class="text-6xl mb-6 block">${calculator.icon}</span>
          <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">${calculator.title}</h1>
          <p class="text-lg text-gray-600">JavaScript devre dışı olduğu için bu hesaplayıcı çalışmıyor. Lütfen JavaScript'i etkinleştirin.</p>
        </div>
        <div class="text-center">
          <a href="/hesaplayicilar" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
            Diğer Hesaplayıcıları Gör
          </a>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  return { html, statusCode: 200 };
}
