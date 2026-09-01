import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, X } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { ProductVisual } from "@/components/ProductVisual";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ensureCatalogLoaded, useCatalogStore } from "@/store/catalogStore";

export default function Wishlist() {
  const productIds = useWishlistStore((s) => s.productIds);
  const removeFromWishlist = useWishlistStore((s) => s.remove);
  const addToCart = useCartStore((s) => s.addItem);
  const products = useCatalogStore((s) => s.products);
  const push = useToastStore((s) => s.push);

  useEffect(() => {
    void ensureCatalogLoaded();
  }, []);

  const items = productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  const moveToCart = (id: string, name: string) => {
    addToCart(id, 1);
    removeFromWishlist(id);
    push(`Moved "${name}" to cart`, "success");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated text-muted">
          <Heart className="h-7 w-7" strokeWidth={1.5} />
        </span>
        <h1 className="mt-6 font-heading text-2xl font-bold text-foreground">
          Your wishlist is empty
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Save products you're interested in and find them here anytime.
        </p>
        <Button asChild className="mt-6" size="lg">
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-1 font-heading text-3xl font-bold text-foreground">My Wishlist</h1>
      <p className="mb-8 text-sm text-muted">{items.length} saved products</p>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-lg border border-border bg-surface"
          >
            <button
              onClick={() => removeFromWishlist(product.id)}
              aria-label="Remove from wishlist"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur-sm hover:bg-background/90 hover:text-error"
            >
              <X className="h-4 w-4" />
            </button>
            <Link to={`/products/${product.slug}`} className="block aspect-[4/3]">
              <ProductVisual category={product.category} className="h-full w-full" />
            </Link>
            <div className="flex flex-col gap-2 p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {product.brand}
              </span>
              <Link
                to={`/products/${product.slug}`}
                className="line-clamp-1 font-heading text-sm font-semibold text-foreground hover:text-primary"
              >
                {product.name}
              </Link>
              <span className="font-mono text-sm font-semibold text-foreground">
                {formatPrice(product.price)}
              </span>
              <Button
                size="sm"
                className="mt-1"
                disabled={product.stock === 0}
                onClick={() => moveToCart(product.id, product.name)}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                {product.stock === 0 ? "Out of Stock" : "Move to Cart"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
