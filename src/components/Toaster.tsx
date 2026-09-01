import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToastStore } from "@/store/toastStore";
import { cn } from "@/lib/utils";

const ICONS = { success: CheckCircle2, error: XCircle, info: Info };

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6">
      {toasts.map((t) => {
        const Icon = ICONS[t.variant];
        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 shadow-[0_16px_40px_rgba(20,22,26,0.14)] animate-toast-in"
            )}
          >
            <Icon
              className={cn(
                "h-4.5 w-4.5 shrink-0",
                t.variant === "success" && "text-accent",
                t.variant === "error" && "text-error",
                t.variant === "info" && "text-info"
              )}
            />
            <p className="flex-1 text-sm text-foreground">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
