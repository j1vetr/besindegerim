import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { type Food, type CategoryGroup } from "@shared/schema";
import { FoodCard } from "@/components/FoodCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AllFoodsPageProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
  initialFoods?: Food[];
  initialPage?: number;
  initialTotalPages?: number;
  initialTotal?: number;
}

interface PaginatedFoodsResponse {
  items: Food[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AllFoodsPage({ 
  categoryGroups = [], 
  currentPath = "/tum-gidalar",
  initialFoods = [],
  initialPage = 1,
  initialTotalPages = 1,
  initialTotal = 0
}: AllFoodsPageProps) {
  const [, setLocation] = useLocation();
  const search = useSearch();
  
  // Read page from URL query params
  const urlPage = parseInt(new URLSearchParams(search).get("page") || "1");
  const [currentPage, setCurrentPage] = useState(urlPage);

  // Sync state with URL changes
  useEffect(() => {
    setCurrentPage(urlPage);
  }, [urlPage]);

  // Client-side data fetching for pagination
  // Always fetch in development mode (when initialFoods is empty)
  // In SSR mode, only fetch when page changes
  const shouldFetch = initialFoods.length === 0 || currentPage !== initialPage;
  
  const { data, isLoading } = useQuery<PaginatedFoodsResponse>({
    queryKey: [`/api/foods?page=${currentPage}&limit=30`],
    enabled: shouldFetch,
  });

  // Use SSR data or API data
  const foods = (currentPage === initialPage && initialFoods.length > 0) 
    ? initialFoods 
    : (data?.items || []);
  
  // Prefer API data over initial props (fixes development mode showing 0 total)
  const totalPages = data?.totalPages || initialTotalPages || 1;
  const total = data?.total || initialTotal || 0;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      // Update URL with new page number
      const newUrl = newPage === 1 
        ? '/tum-gidalar' 
        : `/tum-gidalar?page=${newPage}`;
      setLocation(newUrl);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Show max 7 page buttons

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show current page and neighbors
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      <main className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Tüm Gıdalar
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              {total} gıdanın tamamı • Gerçek porsiyon bazlı besin değerleri
            </p>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border-2 border-green-200/50 rounded-3xl h-96 animate-pulse"
                  data-testid={`skeleton-${i}`}
                ></div>
              ))}
            </div>
          ) : (
            <>
              {/* Food Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {foods.map((food) => (
                  <FoodCard key={food.id} food={food} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                      currentPage === 1
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 active:bg-green-300'
                    }`}
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Önceki</span>
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span 
                        key={`ellipsis-${index}`} 
                        className="px-3 py-2 text-slate-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page as number)}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                            : 'bg-green-100 text-green-700 hover:bg-green-200 active:bg-green-300'
                        }`}
                        data-testid={`button-page-${page}`}
                      >
                        {page}
                      </button>
                    )
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                      currentPage === totalPages
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 active:bg-green-300'
                    }`}
                    data-testid="button-next-page"
                  >
                    <span className="hidden sm:inline">Sonraki</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
