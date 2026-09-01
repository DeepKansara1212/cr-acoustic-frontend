import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useAddressStore, type Address } from "@/store/addressStore";
import { useOrderStore } from "@/store/orderStore";
import { useToastStore } from "@/store/toastStore";
import { ensureCatalogLoaded, useCatalogStore } from "@/store/catalogStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import { cn, formatPrice } from "@/lib/utils";

const emptyForm = { label: "Home", street: "", city: "", state: "", postalCode: "", country: "India" };

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const user = useAuthStore((s) => s.user);
  const allAddresses = useAddressStore((s) => s.addresses);
  const savedAddresses = useMemo(
    () => (user ? allAddresses.filter((a) => a.userId === user.id) : []),
    [allAddresses, user]
  );
  const addAddress = useAddressStore((s) => s.addAddress);
  const placeOrder = useOrderStore((s) => s.placeOrder);
  const products = useCatalogStore((s) => s.products);
  const push = useToastStore((s) => s.push);
  const navigate = useNavigate();

  useEffect(() => {
    void ensureCatalogLoaded();
  }, []);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    savedAddresses.find((a) => a.isDefault)?.id ?? savedAddresses[0]?.id ?? null
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(savedAddresses.length === 0);
  const [form, setForm] = useState(emptyForm);
  const [saveAddress, setSaveAddress] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPayment, setShowPayment] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState<Omit<
    Address,
    "id" | "userId" | "isDefault"
  > | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((l): l is { product: (typeof products)[number]; quantity: number } => l !== null);

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0),
    [lines]
  );
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  if (!user) return <Navigate to="/login" state={{ from: "/checkout" }} replace />;
  if (lines.length === 0 && !orderPlaced) return <Navigate to="/cart" replace />;

  const resolveShippingAddress = (): Omit<Address, "id" | "userId" | "isDefault"> | null => {
    if (!showNewAddressForm && selectedAddressId) {
      const saved = savedAddresses.find((a) => a.id === selectedAddressId);
      if (saved) return saved;
    }

    const required: Array<keyof typeof form> = ["street", "city", "state", "postalCode", "country"];
    const nextErrors: Record<string, string> = {};
    required.forEach((field) => {
      if (!form[field].trim()) nextErrors[field] = "Required";
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return null;
    }
    setErrors({});

    if (saveAddress) {
      const created = addAddress(user.id, form);
      return created;
    }
    return form;
  };

  const handlePayNow = () => {
    const address = resolveShippingAddress();
    if (!address) {
      push("Please fill in all required address fields", "error");
      return;
    }
    setResolvedAddress(address);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    if (!resolvedAddress) return;

    const order = placeOrder({
      userId: user.id,
      items: lines.map((l) => ({
        productId: l.product.id,
        name: l.product.name,
        price: l.product.price,
        quantity: l.quantity,
      })),
      shippingAddress: resolvedAddress,
      subtotal,
      tax,
      total,
    });
    setOrderPlaced(true);
    clearCart();
    setShowPayment(false);
    push("Order placed successfully!", "success");
    navigate(`/order-confirmation/${order.id}`, { replace: true });
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-3xl font-bold text-foreground">Checkout</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">Shipping Address</h2>

            {savedAddresses.length > 0 && (
              <div className="mt-4 flex flex-col gap-2.5">
                {savedAddresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm transition-colors",
                      !showNewAddressForm && selectedAddressId === addr.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-border-strong"
                    )}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="mt-1 accent-primary"
                      checked={!showNewAddressForm && selectedAddressId === addr.id}
                      onChange={() => {
                        setSelectedAddressId(addr.id);
                        setShowNewAddressForm(false);
                      }}
                    />
                    <div>
                      <p className="font-medium text-foreground">{addr.label}</p>
                      <p className="text-muted">
                        {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                      </p>
                    </div>
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(true)}
                  className={cn(
                    "rounded-md border p-3 text-left text-sm transition-colors",
                    showNewAddressForm
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-dashed border-border text-muted hover:border-border-strong"
                  )}
                >
                  + Use a new address
                </button>
              </div>
            )}

            {showNewAddressForm && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-muted">Address Label</label>
                  <Input
                    value={form.label}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                    placeholder="Home, Office, Studio..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-muted">Street Address</label>
                  <Input
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    placeholder="123 MG Road"
                  />
                  {errors.street && <p className="mt-1 text-xs text-error">{errors.street}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">City</label>
                  <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  {errors.city && <p className="mt-1 text-xs text-error">{errors.city}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">State</label>
                  <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                  {errors.state && <p className="mt-1 text-xs text-error">{errors.state}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Postal Code</label>
                  <Input
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  />
                  {errors.postalCode && <p className="mt-1 text-xs text-error">{errors.postalCode}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Country</label>
                  <Input
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                  />
                </div>
                <label className="flex items-center gap-2 text-xs text-muted sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  Save this address to my account
                </label>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">Payment Method</h2>
            <div className="mt-4 flex items-center gap-3 rounded-md border border-primary bg-primary/5 p-3 text-sm">
              <input type="radio" checked readOnly className="accent-primary" />
              <span className="font-medium text-foreground">Razorpay</span>
              <span className="text-xs text-muted">Cards, UPI, Netbanking &amp; Wallets</span>
            </div>
          </div>
        </div>

        <div className="h-fit rounded-lg border border-border bg-surface p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Order Summary</h2>
          <div className="mt-4 flex flex-col gap-3 border-b border-border pb-4">
            {lines.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="text-muted">
                  {product.name} <span className="text-muted-foreground">× {quantity}</span>
                </span>
                <span className="shrink-0 font-mono text-foreground">
                  {formatPrice(product.price * quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span className="font-mono text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Tax (18% GST)</span>
              <span className="font-mono text-foreground">{formatPrice(tax)}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4">
            <span className="font-heading text-base font-semibold text-foreground">Total</span>
            <span className="font-mono text-lg font-bold text-foreground">{formatPrice(total)}</span>
          </div>
          <Button size="lg" className="mt-6 w-full" onClick={handlePayNow}>
            Pay {formatPrice(total)}
          </Button>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Secure checkout, 2-year warranty included
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          amount={total}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
