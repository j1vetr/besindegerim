import { Link, useLocation } from "wouter";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Food } from "@shared/schema";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();

  // Fetch categories
  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ["/api/categories"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/?q=${encodeURIComponent(searchQuery)}`);
    } else {
      setLocation("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-lg px-3 py-2 transition-all">
              <img 
                src="/logo.png" 
                alt="Besin Değerim Logo" 
                className="h-10 w-auto"
                data-testid="img-logo"
              />
              <span className="hidden text-xl font-bold text-foreground sm:inline">
                Besin Değerim
              </span>
            </div>
          </Link>

          {/* Search */}
          <form 
            onSubmit={handleSearch} 
            className="flex flex-1 max-w-md items-center gap-2"
            data-testid="form-search"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Gıda ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                data-testid="input-search"
              />
            </div>
          </form>
        </div>

        {/* Categories bar */}
        <div className="flex h-12 items-center gap-2 overflow-x-auto border-t pb-1 pt-1 scrollbar-hide">
          <Link href="/" data-testid="link-category-all">
            <button
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all hover-elevate active-elevate-2 ${
                location === "/" || location.startsWith("/?")
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Tümü
            </button>
          </Link>
          {categories.map((category) => (
            <Link 
              key={category} 
              href={`/kategori/${encodeURIComponent(category)}`}
              data-testid={`link-category-${category}`}
            >
              <button
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all hover-elevate active-elevate-2 ${
                  location === `/kategori/${encodeURIComponent(category)}`
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {category}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
