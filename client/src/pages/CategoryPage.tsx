import type { Food } from "@shared/schema";
import { FoodCard } from "@/components/FoodCard";

interface CategoryPageProps {
  category: string;
  foods: Food[];
}

export function CategoryPage(props?: CategoryPageProps) {
  // Default props for SSR
  const category = props?.category || "Kategori";
  const foods = props?.foods || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground" data-testid="text-category-title">
          {category}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground" data-testid="text-category-count">
          {foods.length} gıda bulundu
        </p>
      </div>

      {foods.length === 0 ? (
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-12 text-center">
          <p className="text-lg text-muted-foreground" data-testid="text-no-foods">
            Bu kategoride henüz gıda bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
}
