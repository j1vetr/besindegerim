import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
  initialQuery?: string;
}

export function SearchForm({ initialQuery = "" }: SearchFormProps) {
  return (
    <form
      method="GET"
      action="/ara"
      className="w-full max-w-2xl mx-auto"
      data-testid="form-search"
    >
      <div className="flex gap-2">
        <Input
          type="search"
          name="q"
          defaultValue={initialQuery}
          placeholder="Gıda ara... (ör: domates, tavuk, elma)"
          className="h-12 md:h-14 text-base flex-1"
          data-testid="input-search"
          autoComplete="off"
        />
        <Button
          type="submit"
          size="lg"
          className="h-12 md:h-14 px-6"
          data-testid="button-search"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Ara</span>
        </Button>
      </div>
    </form>
  );
}
