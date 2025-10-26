import { SearchAutocomplete } from "./SearchAutocomplete";

interface SearchFormProps {
  initialQuery?: string;
}

export function SearchForm({ initialQuery = "" }: SearchFormProps) {
  return <SearchAutocomplete placeholder="Gıda ara... (ör: domates, tavuk, elma)" />;
}
