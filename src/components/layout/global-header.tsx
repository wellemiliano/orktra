import Link from "next/link";
import { LogOut } from "lucide-react";
import { ContextSwitcher } from "@/components/layout/context-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

type GlobalHeaderProps = {
  userName: string;
  roleLabel: string | null;
  memberships: {
    companyId: string;
    companyName: string;
    unitId: string | null;
    unitName: string | null;
    roleCode: string;
  }[];
  currentCompanyId: string | null;
  currentUnitId: string | null;
};

export function GlobalHeader({
  userName,
  roleLabel,
  memberships,
  currentCompanyId,
  currentUnitId,
}: GlobalHeaderProps): JSX.Element {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--card)]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-3 px-4 py-3 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-sm font-semibold text-[var(--foreground)]">{userName}</h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              {roleLabel ?? "Sem perfil definido"} • Ambiente corporativo ORKTRA
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link href="/logout" className="gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Link>
            </Button>
          </div>
        </div>
        <ContextSwitcher
          memberships={memberships}
          currentCompanyId={currentCompanyId}
          currentUnitId={currentUnitId}
        />
      </div>
    </header>
  );
}

