import { useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ensureCatalogLoaded, useCatalogStore } from "@/store/catalogStore";

export function BestSellers() {
  const scope = useScrollReveal<HTMLDivElement>();
  const products = useCatalogStore((s) => s.products);

  useEffect(() => {
    void ensureCatalogLoaded();
  }, []);

  const bestSellers = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <section ref={scope} className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="reveal mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
          Top rated
        </span>
        <h2 className="mt-2 font-heading text-3xl font-bold text-foreground">Best sellers</h2>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {bestSellers.map((p) => (
          <div key={p.id} className="reveal">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
