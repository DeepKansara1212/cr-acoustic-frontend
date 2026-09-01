import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";
import { ensureCatalogLoaded, useCatalogStore } from "@/store/catalogStore";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const MAX_PRICE = 500000;

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");
  const searchQuery = searchParams.get("search") ?? "";
  const products = useCatalogStore((s) => s.products);
  const categories = useCatalogStore((s) => s.categories);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(products.length ? Math.max(...products.map((p) => p.price)) : 0);
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    void ensureCatalogLoaded();
  }, []);

  useEffect(() => {
    if (products.length) {
      setMaxPrice((current) => (current > 0 ? current : Math.max(...products.map((p) => p.price))));
    }
  }, [products]);

  useEffect(() => setSearchInput(searchQuery), [searchQuery]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory) {
      list = list.filter(
        (p) => p.category.toLowerCase().replace(/\s+/g, "-") === activeCategory
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }
    if (selectedBrands.length) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }
    list = list.filter((p) => p.price <= maxPrice);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [activeCategory, searchQuery, selectedBrands, maxPrice, sort]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearAll = () => {
    setSelectedBrands([]);
    setMaxPrice(Math.max(...products.map((p) => p.price), MAX_PRICE));
    setSearchParams({});
  };

  const hasActiveFilters =
    activeCategory || searchQuery || selectedBrands.length > 0 || maxPrice < Math.max(...products.map((p) => p.price), MAX_PRICE);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) next.set("search", searchInput.trim());
    else next.delete("search");
    setSearchParams(next);
  };

  const FilterPanel = (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">Category</h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setSearchParams(searchQuery ? { search: searchQuery } : {})}
            className={cn(
              "rounded-md px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-surface hover:text-foreground",
              !activeCategory && "bg-surface text-foreground"
            )}
          >
            All Products
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() =>
                setSearchParams(
                  searchQuery ? { category: c.slug, search: searchQuery } : { category: c.slug }
                )
              }
              className={cn(
                "rounded-md px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-surface hover:text-foreground",
                activeCategory === c.slug && "bg-surface text-foreground"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">Brand</h3>
        <div className="flex flex-col gap-2.5">
          {[...new Set(products.map((p) => p.brand))].map((brand) => (
            <label key={brand} className="flex cursor-pointer items-center gap-2.5 text-sm text-muted">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="h-4 w-4 rounded border-border bg-surface accent-primary"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-foreground">Max Price</h3>
          <span className="font-mono text-xs text-muted">{formatPrice(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={MAX_PRICE}
          step={1000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearAll}>
          Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {searchQuery
            ? `Results for "${searchQuery}"`
            : activeCategory
            ? categories.find((c) => c.slug === activeCategory)?.name ?? "Products"
            : "All Products"}
        </h1>
        <p className="mt-1 text-sm text-muted">{filtered.length} products</p>
      </div>

      <form onSubmit={submitSearch} className="mb-8 flex max-w-md items-center gap-2 lg:hidden">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>
        <Button type="submit" size="md">
          Search
        </Button>
      </form>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{FilterPanel}</aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-sm text-muted sm:inline">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 rounded-md border border-border bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary/60"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border py-24 text-center">
              <p className="text-sm text-muted">No products match these filters.</p>
              {hasActiveFilters && (
                <Button variant="link" className="mt-3" onClick={clearAll}>
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X className="h-5 w-5 text-muted" />
              </button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </div>
  );
}
