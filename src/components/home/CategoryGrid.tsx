import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AudioWaveform,
  Mic2,
  Speaker,
  SlidersHorizontal,
  Radio,
  GitBranch,
  Megaphone,
  Users,
  AlignVerticalJustifyCenter,
  MoveVertical,
  type LucideIcon,
} from "lucide-react";
import { ensureCatalogLoaded, useCatalogStore } from "@/store/catalogStore";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ICONS: Record<string, LucideIcon> = {
  AudioWaveform,
  Mic2,
  Speaker,
  SlidersHorizontal,
  Radio,
  GitBranch,
  Megaphone,
  Users,
  AlignVerticalJustifyCenter,
  MoveVertical,
};

export function CategoryGrid() {
  const scope = useScrollReveal<HTMLDivElement>();
  const categories = useCatalogStore((s) => s.categories);

  useEffect(() => {
    void ensureCatalogLoaded();
  }, []);

  return (
    <section ref={scope} className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="reveal mb-10 flex items-end justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            Categories
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground">Shop by category</h2>
        </div>
        <Link to="/products" className="hidden text-sm font-medium text-muted hover:text-foreground sm:block">
          View all &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat) => {
          const Icon = ICONS[cat.icon];
          return (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="reveal group flex flex-col items-center gap-3 rounded-lg border border-border bg-surface px-4 py-7 text-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-primary/30"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-elevated text-primary transition-colors group-hover:bg-primary/15">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span className="text-sm font-medium text-foreground">{cat.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
