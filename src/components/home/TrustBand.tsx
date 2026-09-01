import { Truck, ShieldCheck, Headphones, RotateCcw } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const items = [
  { icon: Truck, title: "Pan-India Delivery", desc: "Shipped within 48 hours" },
  { icon: ShieldCheck, title: "2-Year Warranty", desc: "On every product, no fine print" },
  { icon: Headphones, title: "Expert Support", desc: "Talk to a real audio technician" },
  { icon: RotateCcw, title: "Easy Returns", desc: "7-day hassle-free returns" },
];

export function TrustBand() {
  const scope = useScrollReveal<HTMLDivElement>();

  return (
    <section ref={scope} className="border-y border-border bg-surface/30">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-6 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="reveal flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-elevated text-primary">
              <Icon className="h-4.5 w-4.5" strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
