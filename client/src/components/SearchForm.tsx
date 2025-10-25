import React from "react";
import { Search, Sparkles } from "lucide-react";

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
      <div className="flex gap-2">
        {/* Futuristic Search Input */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Search className="w-5 h-5 text-emerald-400" />
          </div>
          <input
            type="search"
            name="q"
            defaultValue={initialQuery}
            placeholder="Gıda ara... (ör: domates, tavuk, elma)"
            className="w-full h-14 pl-12 pr-4 bg-white/10 backdrop-blur-md border-2 border-white/20 focus:border-emerald-500/50 rounded-2xl text-base text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-300 focus:shadow-lg focus:shadow-emerald-500/20"
            data-testid="input-search"
            autoComplete="off"
          />
        </div>

        {/* Futuristic Search Button */}
        <button
          type="submit"
          className="h-14 px-8 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-2xl font-bold text-white flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/40 border border-emerald-400/50"
          data-testid="button-search"
          aria-label="Gıda ara"
        >
          <Sparkles className="h-5 w-5" />
          <span className="hidden sm:inline">Ara</span>
        </button>
      </div>
    </form>
  );
}
