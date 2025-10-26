import React from "react";
import { Search } from "lucide-react";

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
      <div className="flex gap-3">
        {/* Clean Search Input */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search className="w-5 h-5 text-white/40" />
          </div>
          <input
            type="search"
            name="q"
            defaultValue={initialQuery}
            placeholder="Gıda ara... (ör: domates, tavuk, elma)"
            className="w-full h-12 pl-12 pr-4 bg-black/50 border border-white/20 focus:border-[#1f8a4d] rounded-md text-base text-white placeholder:text-white/50 outline-none transition-colors"
            data-testid="input-search"
            autoComplete="off"
          />
        </div>

        {/* Clean Search Button */}
        <button
          type="submit"
          className="h-12 px-8 bg-[#1f8a4d] hover:bg-[#27a35f] rounded-md font-medium text-white flex items-center gap-2 transition-colors"
          data-testid="button-search"
          aria-label="Gıda ara"
        >
          <span className="hidden sm:inline">Ara</span>
          <Search className="h-5 w-5 sm:hidden" />
        </button>
      </div>
    </form>
  );
}
