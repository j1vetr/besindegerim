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
