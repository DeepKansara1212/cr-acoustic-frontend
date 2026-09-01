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
import { cn } from "@/lib/utils";

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

function iconForCategory(category: string): LucideIcon {
  const map: Record<string, string> = {
    Amplifier: "AudioWaveform",
    Microphone: "Mic2",
    Speaker: "Speaker",
    Mixer: "SlidersHorizontal",
    Horn: "Radio",
    Crossover: "GitBranch",
    Megaphone: "Megaphone",
    "Conference System": "Users",
    "Line Array Loudspeaker": "AlignVerticalJustifyCenter",
    Stands: "MoveVertical",
  };
  return ICONS[map[category] ?? "AudioWaveform"];
}

export function ProductVisual({ category, className }: { category: string; className?: string }) {
  const Icon = iconForCategory(category);
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-surface-elevated",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(120% 120% at 30% 20%, rgba(242,169,59,0.18), transparent 55%), radial-gradient(120% 120% at 80% 80%, rgba(77,230,200,0.12), transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,22,26,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(20,22,26,0.6) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <Icon className="relative h-12 w-12 text-primary/70" strokeWidth={1.25} />
    </div>
  );
}
