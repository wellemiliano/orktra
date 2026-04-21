import { cn } from "@/lib/utils/cn";

type OrktraLogoProps = {
  className?: string;
  compact?: boolean;
};

export function OrktraLogo({ className, compact = false }: OrktraLogoProps): JSX.Element {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-8 w-8 rounded-md bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] shadow-sm" />
      {!compact ? (
        <span className="font-semibold tracking-[0.16em] text-[var(--brand-primary)] dark:text-white">
          ORKTRA
        </span>
      ) : null}
    </div>
  );
}

