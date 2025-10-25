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
      className="w-full"
      data-testid="form-search"
    >
      <div className="flex flex-wrap gap-2">
        <Input
          type="search"
          name="q"
          defaultValue={initialQuery}
          placeholder="Gıda ara... (ör: domates, tavuk, elma)"
          className="text-base border-2 rounded-xl flex-1"
          data-testid="input-search"
          autoComplete="off"
        />
        <Button
          type="submit"
          size="lg"
          data-testid="button-search"
          aria-label="Gıda ara"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Ara</span>
        </Button>
      </div>
    </form>
  );
}
