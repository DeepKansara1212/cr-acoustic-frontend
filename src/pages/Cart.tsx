import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { ProductVisual } from "@/components/ProductVisual";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ensureCatalogLoaded, useCatalogStore } from "@/store/catalogStore";

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const products = useCatalogStore((s) => s.products);
  const navigate = useNavigate();

  useEffect(() => {
    void ensureCatalogLoaded();
  }, []);

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((l): l is { product: (typeof products)[number]; quantity: number } => l !== null);

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated text-muted">
          <ShoppingBag className="h-7 w-7" strokeWidth={1.5} />
        </span>
        <h1 className="mt-6 font-heading text-2xl font-bold text-foreground">Your cart is empty</h1>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Looks like you haven't added anything yet. Browse our gear and find your next piece of
          equipment.
        </p>
        <Button asChild className="mt-6" size="lg">
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-3xl font-bold text-foreground">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {lines.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-lg border border-border bg-surface p-4"
            >
              <Link to={`/products/${product.slug}`} className="shrink-0">
                <ProductVisual category={product.category} className="h-24 w-24 rounded-md" />
              </Link>
              <div className="flex flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {product.brand}
                  </span>
                  <Link
                    to={`/products/${product.slug}`}
                    className="block font-heading text-sm font-semibold text-foreground hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 font-mono text-sm text-foreground">{formatPrice(product.price)}</p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="flex items-center rounded-md border border-border">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center text-muted hover:text-foreground"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-mono text-sm">{quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(product.id, Math.min(product.stock, quantity + 1))
                      }
                      className="flex h-9 w-9 items-center justify-center text-muted hover:text-foreground"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="flex items-center gap-1.5 text-xs text-muted hover:text-error"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-lg border border-border bg-surface p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Order Summary</h2>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span className="font-mono text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Tax (18% GST)</span>
              <span className="font-mono text-foreground">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Shipping</span>
              <span className="text-accent">Free</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4">
            <span className="font-heading text-base font-semibold text-foreground">Total</span>
            <span className="font-mono text-lg font-bold text-foreground">{formatPrice(total)}</span>
          </div>
          <Button size="lg" className="mt-6 w-full" onClick={() => navigate("/checkout")}>
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </Button>
          <Link
            to="/products"
            className="mt-3 block text-center text-xs text-muted hover:text-foreground"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
