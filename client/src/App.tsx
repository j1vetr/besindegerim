import { Route, Switch, useParams, useSearch, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useEffect } from "react";
import HomePage from "@/pages/HomePage";
import AllFoodsPage from "@/pages/AllFoodsPage";
import { FoodDetailPage } from "@/pages/FoodDetailPage";
import { CategoryPage } from "@/pages/CategoryPage";
import { SearchResultsPage } from "@/pages/SearchResultsPage";
import { LegalPage } from "@/pages/LegalPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { TermsPage } from "@/pages/TermsPage";
import { CookiePage } from "@/pages/CookiePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import CalculatorsHubPage from "@/pages/CalculatorsHubPage";
import DailyCalorieCalculator from "@/pages/calculators/DailyCalorieCalculator";
import BMICalculator from "@/pages/calculators/BMICalculator";
import IdealWeightCalculator from "@/pages/calculators/IdealWeightCalculator";
import WaterIntakeCalculator from "@/pages/calculators/WaterIntakeCalculator";
import ProteinCalculator from "@/pages/calculators/ProteinCalculator";
import PortionConverterCalculator from "@/pages/calculators/PortionConverterCalculator";
import WeightLossTimeCalculator from "@/pages/calculators/WeightLossTimeCalculator";
import BMRCalculator from "@/pages/calculators/BMRCalculator";
import BodyFatCalculator from "@/pages/calculators/BodyFatCalculator";
import MacroCalculator from "@/pages/calculators/MacroCalculator";
import MealPlanCalculator from "@/pages/calculators/MealPlanCalculator";
import VitaminCalculator from "@/pages/calculators/VitaminCalculator";
import OneRMCalculator from "@/pages/calculators/OneRMCalculator";
import CalorieBurnCalculator from "@/pages/calculators/CalorieBurnCalculator";
import BodyMeasurementCalculator from "@/pages/calculators/BodyMeasurementCalculator";
import FoodComparisonCalculator from "@/pages/calculators/FoodComparisonCalculator";
import type { CategoryGroup, Food } from "@shared/schema";

// Wrapper components that fetch data

function HomePageWrapper() {
  // HomePage handles its own data fetching with SSR fallbacks
  return <HomePage />;
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

function BMIWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <BMICalculator categoryGroups={categoryGroups} currentPath={location} />;
}

function IdealWeightWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <IdealWeightCalculator categoryGroups={categoryGroups} currentPath={location} />;
}

function WaterIntakeWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <WaterIntakeCalculator categoryGroups={categoryGroups} currentPath={location} />;
}

function ProteinWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <ProteinCalculator categoryGroups={categoryGroups} currentPath={location} />;
}

function PortionConverterWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <PortionConverterCalculator categoryGroups={categoryGroups} currentPath={location} />;
}

function WeightLossTimeWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <WeightLossTimeCalculator categoryGroups={categoryGroups} currentPath={location} />;
}

function BMRWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <BMRCalculator categoryGroups={categoryGroups} currentPath={location} />;
}

function BodyFatWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <BodyFatCalculator categoryGroups={categoryGroups} currentPath={location} />;
}

function MacroWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <MacroCalculator categoryGroups={categoryGroups} currentPath={location} />;
}

function MealPlanWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <MealPlanCalculator categoryGroups={categoryGroups} currentPath={location} />;
}

function VitaminWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <VitaminCalculator categoryGroups={categoryGroups} currentPath={location} />;
}

function OneRMWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <OneRMCalculator categoryGroups={categoryGroups} currentPath={location} />;
}

function CalorieBurnWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <CalorieBurnCalculator categoryGroups={categoryGroups} currentPath={location} />;
}

function BodyMeasurementWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <BodyMeasurementCalculator categoryGroups={categoryGroups} currentPath={location} />;
}

function FoodComparisonWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <FoodComparisonCalculator categoryGroups={categoryGroups} currentPath={location} />;
}

function AboutPageWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <AboutPage categoryGroups={categoryGroups} currentPath={location} />;
}

function ContactPageWrapper() {
  const [location] = useLocation();
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <ContactPage categoryGroups={categoryGroups} currentPath={location} />;
}

function PrivacyPageWrapper() {
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <PrivacyPage categoryGroups={categoryGroups} />;
}

function TermsPageWrapper() {
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <TermsPage categoryGroups={categoryGroups} />;
}

function CookiePageWrapper() {
  const { data: categoryGroups = [] } = useQuery<CategoryGroup[]>({ queryKey: ["/api/category-groups"] });
  return <CookiePage categoryGroups={categoryGroups} />;
}

// Scroll to top component - handles route changes
function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScrollToTop />
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
        <Route path="/hesaplayici/gunluk-kalori-ihtiyaci" component={DailyCalorieWrapper} />
        <Route path="/hesaplayici/bmi" component={BMIWrapper} />
        <Route path="/hesaplayici/vucut-yag-yuzde" component={BodyFatWrapper} />
        <Route path="/hesaplayici/ideal-kilo" component={IdealWeightWrapper} />
        <Route path="/hesaplayici/gunluk-su-ihtiyaci" component={WaterIntakeWrapper} />
        <Route path="/hesaplayici/protein-gereksinimi" component={ProteinWrapper} />
        <Route path="/hesaplayici/porsiyon-cevirici" component={PortionConverterWrapper} />
        <Route path="/hesaplayici/kilo-verme-suresi" component={WeightLossTimeWrapper} />
        <Route path="/hesaplayici/bmr" component={BMRWrapper} />
        <Route path="/hesaplayici/makro-hesaplayici" component={MacroWrapper} />
        <Route path="/hesaplayici/ogun-plani" component={MealPlanWrapper} />
        <Route path="/hesaplayici/vitamin-mineral" component={VitaminWrapper} />
        <Route path="/hesaplayici/1rm" component={OneRMWrapper} />
        <Route path="/hesaplayici/kalori-yakma" component={CalorieBurnWrapper} />
        <Route path="/hesaplayici/vucut-olcumleri" component={BodyMeasurementWrapper} />
        <Route path="/hesaplayici/gida-karsilastirma" component={FoodComparisonWrapper} />
        
        {/* Legal pages - New dedicated components */}
        <Route path="/gizlilik-politikasi" component={PrivacyPageWrapper} />
        <Route path="/kullanim-kosullari" component={TermsPageWrapper} />
        <Route path="/cerez-politikasi" component={CookiePageWrapper} />
        
        {/* KVKK still uses LegalPage */}
        <Route path="/kvkk">
          {() => <LegalPage pageType="kvkk" />}
        </Route>
        <Route path="/hakkimizda" component={AboutPageWrapper} />
        <Route path="/iletisim" component={ContactPageWrapper} />
        
        {/* Food detail pages - catch-all for slugs */}
        <Route path="/:slug" component={FoodDetailWrapper} />
        
        {/* 404 */}
        <Route component={() => <NotFoundPage />} />
      </Switch>
    </QueryClientProvider>
  );
}

export default App;
