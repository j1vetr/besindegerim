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

// Wrapper components that fetch data

function HomePageWrapper() {
  const { data: categoryGroups = [] } = useQuery({ queryKey: ["/api/category-groups"] });
  const { data: popularResponse } = useQuery({ queryKey: ["/api/random", { count: 8 }] });
  
  return <HomePage 
    categoryGroups={categoryGroups} 
    popularFoods={popularResponse?.foods || []} 
    currentPath="/"
  />;
}

function FoodDetailWrapper() {
  const { slug } = useParams<{ slug: string }>();
  const { data: categoryGroups = [] } = useQuery({ queryKey: ["/api/category-groups"] });
  const { data: foodData, isLoading } = useQuery({ 
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
  const { data: categoryGroups = [] } = useQuery({ queryKey: ["/api/category-groups"] });
  const { data: foodsData, isLoading } = useQuery({ 
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
  const { data: categoryGroups = [] } = useQuery({ queryKey: ["/api/category-groups"] });
  const { data: searchData, isLoading } = useQuery({ 
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
  const { data: categoryGroups = [] } = useQuery({ queryKey: ["/api/category-groups"] });
  
  return <AllFoodsPage 
    categoryGroups={categoryGroups}
    currentPath={location}
  />;
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
