import { Route, Switch, useParams, useSearch, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import HomePage from "@/pages/HomePage";
import AllFoodsPage from "@/pages/AllFoodsPage";
import { FoodDetailPage } from "@/pages/FoodDetailPage";
import { CategoryPage } from "@/pages/CategoryPage";
import { SearchResultsPage } from "@/pages/SearchResultsPage";
import { LegalPage } from "@/pages/LegalPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import CalculatorsHubPage from "@/pages/CalculatorsHubPage";
import DailyCalorieCalculator from "@/pages/calculators/DailyCalorieCalculator";
import type { CategoryGroup, Food } from "@shared/schema";

// Wrapper components that fetch data

function HomePageWrapper() {
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  const { data: popularResponse } = useQuery<{ foods: Food[] }>({ queryKey: ["/api/random", { count: 8 }] });
  
  return <HomePage 
    categoryGroups={categoryGroups} 
    popularFoods={popularResponse?.foods || []} 
    currentPath="/"
  />;
}

function FoodDetailWrapper() {
  const { slug } = useParams<{ slug: string }>();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  const { data: foodData, isLoading } = useQuery<{ food: Food; alternatives: Food[] }>({ 
    queryKey: [`/api/foods/${slug}`],
    enabled: !!slug
  });
  
  if (isLoading) return <div className="p-8">Yükleniyor...</div>;
  if (!foodData?.food) return <NotFoundPage categoryGroups={categoryGroups} />;
  
  return <FoodDetailPage 
    food={foodData.food}
    alternatives={foodData.alternatives || []}
    categoryGroups={categoryGroups}
    currentPath={`/${slug}`}
  />;
}

function CategoryPageWrapper() {
  const { category, subcategory } = useParams<{ category?: string; subcategory?: string }>();
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  const { data: foodsData, isLoading } = useQuery<{ foods: Food[] }>({ 
    queryKey: subcategory 
      ? [`/api/foods/subcategory/${subcategory}`]
      : [`/api/foods/category/${category}`],
    enabled: !!(category || subcategory)
  });
  
  if (isLoading) return <div className="p-8">Yükleniyor...</div>;
  
  const displayCategory = subcategory || category || "";
  const foods = foodsData?.foods || [];
  
  return <CategoryPage 
    category={displayCategory}
    foods={foods}
    categoryGroups={categoryGroups}
    currentPath={location}
  />;
}

function SearchResultsWrapper() {
  const search = useSearch();
  const query = new URLSearchParams(search).get("q") || "";
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  const { data: searchData, isLoading } = useQuery<{ foods: Food[] }>({ 
    queryKey: ["/api/foods/search", { q: query }],
    enabled: query.length >= 2
  });
  
  if (isLoading && query) return <div className="p-8">Aranıyor...</div>;
  
  const results = searchData?.foods || [];
  
  return <SearchResultsPage 
    query={query}
    results={results}
    categoryGroups={categoryGroups}
    currentPath={`/ara?q=${query}`}
  />;
}

function AllFoodsPageWrapper() {
  const search = useSearch();
  const page = parseInt(new URLSearchParams(search).get("page") || "1");
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  const { data: foodsData } = useQuery<{ items: Food[]; page: number; totalPages: number; total: number }>({ 
    queryKey: [`/api/foods?page=${page}&limit=30`]
  });
  
  return <AllFoodsPage 
    categoryGroups={categoryGroups}
    currentPath={location}
    initialFoods={foodsData?.items}
    initialPage={foodsData?.page}
    initialTotalPages={foodsData?.totalPages}
    initialTotal={foodsData?.total}
  />;
}

function CalculatorsHubWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <CalculatorsHubPage categoryGroups={categoryGroups} currentPath={location} />;
}

function DailyCalorieWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <DailyCalorieCalculator categoryGroups={categoryGroups} currentPath={location} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        {/* Homepage */}
        <Route path="/" component={HomePageWrapper} />
        
        {/* All Foods Page */}
        <Route path="/tum-gidalar" component={AllFoodsPageWrapper} />
        
        {/* Search */}
        <Route path="/ara" component={SearchResultsWrapper} />
        
        {/* Category pages */}
        <Route path="/kategori/:category/:subcategory?" component={CategoryPageWrapper} />
        
        {/* Calculators */}
        <Route path="/hesaplayicilar" component={CalculatorsHubWrapper} />
        <Route path="/hesaplayicilar/gunluk-kalori-ihtiyaci" component={DailyCalorieWrapper} />
        
        {/* Legal pages */}
        <Route path="/gizlilik-politikasi">
          {() => <LegalPage pageType="privacy" />}
        </Route>
        <Route path="/kullanim-kosullari">
          {() => <LegalPage pageType="terms" />}
        </Route>
        <Route path="/kvkk">
          {() => <LegalPage pageType="kvkk" />}
        </Route>
        <Route path="/cerez-politikasi">
          {() => <LegalPage pageType="cookies" />}
        </Route>
        <Route path="/hakkimizda">
          {() => <LegalPage pageType="about" />}
        </Route>
        <Route path="/iletisim">
          {() => <LegalPage pageType="contact" />}
        </Route>
        
        {/* Food detail pages - catch-all for slugs */}
        <Route path="/:slug" component={FoodDetailWrapper} />
        
        {/* 404 */}
        <Route component={() => <NotFoundPage />} />
      </Switch>
    </QueryClientProvider>
  );
}

export default App;
