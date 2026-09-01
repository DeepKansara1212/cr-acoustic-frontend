import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ensureCatalogLoaded, useCatalogStore } from "@/store/catalogStore";

export function FeaturedProducts() {
  const scope = useScrollReveal<HTMLDivElement>();
  const products = useCatalogStore((s) => s.products);

  useEffect(() => {
    void ensureCatalogLoaded();
  }, []);

  return (
    <section ref={scope} className="border-t border-border bg-surface/30">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="reveal mb-10 flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              Handpicked
            </span>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground">
              Featured products
            </h2>
          </div>
          <Link to="/products" className="hidden text-sm font-medium text-muted hover:text-foreground sm:block">
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((p) => (
            <div key={p.id} className="reveal">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
