import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AudioWaveform } from "lucide-react";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <AudioWaveform className="h-4.5 w-4.5" strokeWidth={2.25} />
          </span>
          <span className="font-heading text-lg font-bold tracking-tight">CR Acoustic</span>
        </Link>

        <div className="rounded-lg border border-border bg-surface p-8">
          <h1 className="font-heading text-xl font-bold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
      </div>
    </div>
  );
}
