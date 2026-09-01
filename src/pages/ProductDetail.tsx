import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Star, Heart, ShieldCheck, Truck, Minus, Plus, ChevronRight } from "lucide-react";
import { ProductVisual } from "@/components/ProductVisual";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useToastStore } from "@/store/toastStore";
import { ensureCatalogLoaded, useCatalogStore } from "@/store/catalogStore";

export default function ProductDetail() {
  const { slug } = useParams();
  const products = useCatalogStore((s) => s.products);
  const product = products.find((p) => p.slug === slug);
  const [activeShot, setActiveShot] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    void ensureCatalogLoaded();
  }, []);
  const addItem = useCartStore((s) => s.addItem);
  const inWishlist = useWishlistStore((s) => (product ? s.has(product.id) : false));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const push = useToastStore((s) => s.push);

  if (!product) return <Navigate to="/products" replace />;

  const handleAddToCart = () => {
    addItem(product.id, qty);
    push(`Added ${qty} × "${product.name}" to cart`, "success");
  };

  const handleWishlist = () => {
    const added = toggleWishlist(product.id);
    push(added ? "Added to wishlist" : "Removed from wishlist", "success");
  };

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const shots = [0, 1, 2, 3];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/products" className="hover:text-foreground">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg border border-border">
            <ProductVisual category={product.category} className="h-full w-full" />
            {product.badge && (
              <Badge
                variant={product.badge === "Sale" ? "error" : product.badge === "New" ? "success" : "warning"}
                className="absolute left-4 top-4"
              >
                {product.badge}
              </Badge>
            )}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {shots.map((i) => (
              <button
                key={i}
                onClick={() => setActiveShot(i)}
                className={cn(
                  "aspect-square overflow-hidden rounded-md border transition-colors",
                  activeShot === i ? "border-primary" : "border-border hover:border-border-strong"
                )}
              >
                <ProductVisual category={product.category} className="h-full w-full" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {product.brand}
          </span>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.round(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-mono text-3xl font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="font-mono text-lg text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted">
            {product.shortDescription}. Engineered for professional use with premium components,
            reliable performance under load, and a build quality that holds up to daily touring
            and studio work.
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                product.stock > 10 ? "bg-accent" : product.stock > 0 ? "bg-primary" : "bg-error"
              )}
            />
            <span className="text-muted">
              {product.stock > 10
                ? "In stock"
                : product.stock > 0
                ? `Only ${product.stock} left in stock`
                : "Out of stock"}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-md border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center text-muted hover:text-foreground"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center font-mono text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="flex h-11 w-11 items-center justify-center text-muted hover:text-foreground"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1 sm:flex-none"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button size="lg" variant="outline" onClick={handleWishlist} aria-label="Toggle wishlist">
              <Heart className={cn("h-4 w-4", inWishlist && "fill-primary text-primary")} />
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 text-sm text-muted">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" /> 2-year warranty included
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-accent" /> Ships within 48 hours
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-border pt-12">
          <h2 className="mb-8 font-heading text-2xl font-bold text-foreground">
            You may also like
          </h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
