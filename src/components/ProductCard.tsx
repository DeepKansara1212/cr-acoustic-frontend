import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import type { CatalogProduct } from "@/store/catalogStore";
import { ProductVisual } from "@/components/ProductVisual";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlistStore";
import { useToastStore } from "@/store/toastStore";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const badgeVariant =
    product.badge === "Sale" ? "error" : product.badge === "New" ? "success" : "warning";
  const inWishlist = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const push = useToastStore((s) => s.push);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    const added = toggleWishlist(product.id);
    push(added ? `Added "${product.name}" to wishlist` : "Removed from wishlist", "success");
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-surface transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_40px_rgba(20,22,26,0.12)]"
    >
      <div className="relative aspect-[4/3]">
        <ProductVisual
          category={product.category}
          className="h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
        {product.badge && (
          <Badge variant={badgeVariant} className="absolute left-3 top-3">
            {product.badge}
          </Badge>
        )}
        <button
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleWishlist}
          className={cn(
            "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/60 backdrop-blur-sm transition-colors hover:bg-background/90 hover:text-primary",
            inWishlist ? "text-primary" : "text-foreground"
          )}
        >
          <Heart className={cn("h-4 w-4", inWishlist && "fill-primary")} />
        </button>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </span>
        <h3 className="line-clamp-1 font-heading text-sm font-semibold text-foreground">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3.5 w-3.5",
                  i < Math.round(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted">({product.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-mono text-base font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="font-mono text-xs text-muted-foreground line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
