import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CheckCircle2, ShieldCheck, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

type Props = {
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
};

export function PaymentModal({ amount, onSuccess, onClose }: Props) {
  const [stage, setStage] = useState<"processing" | "success">("processing");
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setStage("success"), 1600);
    const t2 = setTimeout(() => onSuccess(), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(
    () => {
      if (stage === "success") {
        gsap.fromTo(
          ".payment-check",
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }
        );
      }
    },
    { scope, dependencies: [stage] }
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        ref={scope}
        className="relative w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-[0_24px_64px_rgba(20,22,26,0.2)]"
      >
        {stage === "processing" && (
          <button
            onClick={onClose}
            aria-label="Cancel payment"
            className="absolute right-4 top-4 text-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="flex flex-col items-center py-6 text-center">
          {stage === "processing" ? (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
              <p className="mt-5 font-heading text-base font-semibold text-foreground">
                Processing payment...
              </p>
              <p className="mt-1 text-xs text-muted">Do not close this window</p>
            </>
          ) : (
            <>
              <div className="payment-check flex h-14 w-14 items-center justify-center rounded-full bg-accent/15">
                <CheckCircle2 className="h-8 w-8 text-accent" strokeWidth={1.5} />
              </div>
              <p className="mt-5 font-heading text-base font-semibold text-foreground">
                Payment Successful
              </p>
              <p className="mt-1 font-mono text-sm text-muted">{formatPrice(amount)}</p>
            </>
          )}

          <div className="mt-6 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            Simulated Razorpay checkout — no real charge is made
          </div>
        </div>
      </div>
    </div>
  );
}
