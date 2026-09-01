import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroScene } from "@/components/three/HeroScene";

export function Hero() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(".hero-word");
      gsap.fromTo(
        words,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "cubic-bezier(0.16,1,0.3,1)", stagger: 0.04, delay: 0.1 }
      );

      gsap.fromTo(
        ".hero-fade",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: "cubic-bezier(0.16,1,0.3,1)", stagger: 0.08, delay: 0.5 }
      );

      const path = scope.current?.querySelector<SVGPathElement>(".hero-wave-path");
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, { strokeDashoffset: 0, duration: 1.6, ease: "power2.out", delay: 0.3 });
      }
    },
    { scope }
  );

  const headline = "Sound engineered for the stage.".split(" ");

  return (
    <section ref={scope} className="relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute inset-0 hero-glow"
        style={{
          background:
            "radial-gradient(60% 50% at 25% 30%, rgba(242,169,59,0.24), transparent 60%), radial-gradient(50% 50% at 85% 70%, rgba(13,148,136,0.14), transparent 60%)",
        }}
      />
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full opacity-40"
        viewBox="0 0 600 60"
        preserveAspectRatio="none"
      >
        <path
          className="hero-wave-path"
          d="M0,30 Q15,5 30,30 T60,30 T90,30 T120,30 Q135,55 150,30 T180,30 T210,30 T240,30 Q255,5 270,30 T300,30 T330,30 T360,30 Q375,55 390,30 T420,30 T450,30 T480,30 Q495,5 510,30 T540,30 T570,30 T600,30"
          fill="none"
          stroke="#b45309"
          strokeWidth="1.5"
        />
      </svg>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-8 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="relative z-10">
          <span className="hero-fade mb-5 inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Trusted by 2,000+ studios &amp; venues across India
          </span>

          <h1 className="font-heading text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-[4.25rem]">
            {headline.map((word, i) => (
              <span key={i} className="hero-word mr-3 inline-block">
                {word}
              </span>
            ))}
          </h1>

          <p className="hero-fade mt-6 max-w-md text-balance text-base leading-relaxed text-muted">
            Amplifiers, speakers, mixers and microphones built for professionals who can't afford
            a bad take. Explore gear trusted by studios and live venues nationwide.
          </p>

          <div className="hero-fade mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link to="/products">
                Shop All Gear <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/products?category=amplifier">Browse Amplifiers</Link>
            </Button>
          </div>

          <div className="hero-fade mt-10 flex flex-wrap items-center gap-6 text-sm text-muted">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              2-year warranty
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-accent" />
              Pan-India delivery
            </div>
          </div>
        </div>

        <div className="relative hidden h-[420px] lg:block">
          <HeroScene className="h-full w-full" />
        </div>
      </div>
    </section>
  );
}
