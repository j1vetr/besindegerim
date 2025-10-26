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
        {/* Light Futuristic Search Input */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="search"
            name="q"
            defaultValue={initialQuery}
            placeholder="Gıda ara... (ör: domates, tavuk, elma)"
            className="w-full h-14 pl-12 pr-4 bg-white border-2 border-green-200/50 focus:border-green-500 rounded-2xl text-base text-slate-900 placeholder:text-slate-500 outline-none transition-all duration-300 shadow-sm focus:shadow-lg focus:shadow-green-500/20"
            data-testid="input-search"
            autoComplete="off"
          />
        </div>

        {/* Green Gradient Button */}
        <button
          type="submit"
          className="h-14 px-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-2xl font-bold text-white flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50"
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
