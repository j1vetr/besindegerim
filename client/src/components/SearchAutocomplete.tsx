import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { type Food } from "@shared/schema";

interface SearchAutocompleteProps {
  placeholder?: string;
  inputClassName?: string;
  buttonClassName?: string;
  compact?: boolean;
}

export function SearchAutocomplete({ 
  placeholder = "Gıda ara... (ör: domates, tavuk, elma)",
  inputClassName = "",
  buttonClassName = "",
  compact = false
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch results when query changes (min 3 chars)
  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 3) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/foods/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.foods || []);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    if (query.trim()) {
      window.location.href = `/ara?q=${encodeURIComponent(query)}`;
    }
    e.preventDefault();
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full" data-testid="form-search">
        <div className="flex gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-green-500 animate-spin" />
              ) : (
                <Search className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className={inputClassName || (compact 
                ? "w-full h-12 pl-12 pr-4 bg-white border-2 border-green-200/50 focus:border-green-500 rounded-2xl text-sm text-slate-900 placeholder:text-slate-500 outline-none transition-all duration-300"
                : "w-full h-14 pl-12 pr-4 bg-white border-2 border-green-200/50 focus:border-green-500 rounded-2xl text-base text-slate-900 placeholder:text-slate-500 outline-none transition-all duration-300 shadow-sm focus:shadow-lg focus:shadow-green-500/20"
              )}
              data-testid="input-search-autocomplete"
              autoComplete="off"
            />
          </div>

          {/* Search Button */}
          {!compact && (
            <button
              type="submit"
              className={buttonClassName || "h-14 px-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-2xl font-bold text-white flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50"}
              data-testid="button-search"
              aria-label="Gıda ara"
            >
              <span className="hidden sm:inline">Ara</span>
              <Search className="h-5 w-5 sm:hidden" />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete Results - Resimli Liste */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-green-200/50 rounded-2xl shadow-2xl shadow-green-500/20 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
          {results.map((food) => (
            <a
              key={food.id}
              href={`/${food.slug}`}
              className="flex items-center gap-4 p-3 hover:bg-green-50 transition-colors border-b border-green-100 last:border-0"
              data-testid={`autocomplete-result-${food.slug}`}
              onClick={() => setShowResults(false)}
            >
              {/* Food Image */}
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl overflow-hidden">
                <img
                  src={food.imageUrl || "https://via.placeholder.com/64"}
                  alt={food.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Food Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {food.name}
                </h4>
                <p className="text-xs text-slate-600 truncate">
                  {food.servingLabel}
                </p>
                <p className="text-xs text-green-600 font-semibold">
                  {Number(food.calories).toFixed(0)} kcal
                </p>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showResults && results.length === 0 && query.length >= 3 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-green-200/50 rounded-2xl shadow-2xl shadow-green-500/20 p-6 text-center z-50">
          <p className="text-sm text-slate-600">
            "{query}" için sonuç bulunamadı.
          </p>
        </div>
      )}
    </div>
  );
}
