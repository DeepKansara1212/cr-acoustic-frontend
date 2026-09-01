import { useRef } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CheckCircle2, Package, Truck, MapPin } from "lucide-react";
import { useOrderStore } from "@/store/orderStore";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const order = useOrderStore((s) => (orderId ? s.getOrder(orderId) : undefined));
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".confirm-check",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" }
      );
      gsap.fromTo(
        ".confirm-fade",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "cubic-bezier(0.16,1,0.3,1)", stagger: 0.08, delay: 0.2 }
      );
    },
    { scope }
  );

  if (!order) return <Navigate to="/" replace />;

  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div ref={scope} className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <div className="confirm-check flex h-16 w-16 items-center justify-center rounded-full bg-accent/15">
          <CheckCircle2 className="h-9 w-9 text-accent" strokeWidth={1.5} />
        </div>
        <h1 className="confirm-fade mt-6 font-heading text-3xl font-bold text-foreground">
          Order Confirmed
        </h1>
        <p className="confirm-fade mt-2 text-sm text-muted">
          Thank you for your order. A confirmation has been noted against your account.
        </p>
      </div>

      <div className="confirm-fade mt-10 rounded-lg border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <p className="text-xs text-muted">Order Number</p>
            <p className="font-mono text-sm font-semibold text-foreground">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Order Date</p>
            <p className="text-sm text-foreground">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Total</p>
            <p className="font-mono text-sm font-semibold text-foreground">
              {formatPrice(order.total)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-border py-4">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-muted">
                {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
              </span>
              <span className="font-mono text-foreground">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2">
          <div className="flex gap-3">
            <MapPin className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
            <div className="text-sm">
              <p className="font-medium text-foreground">Shipping to</p>
              <p className="mt-0.5 text-muted">
                {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Truck className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
            <div className="text-sm">
              <p className="font-medium text-foreground">Estimated delivery</p>
              <p className="mt-0.5 text-muted">
                {estimatedDelivery.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="confirm-fade mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="flex-1">
          <Link to="/account">
            <Package className="h-4 w-4" /> Track My Orders
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1">
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
