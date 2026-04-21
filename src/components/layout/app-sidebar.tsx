"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarModule } from "@/lib/constants/modules";
import { cn } from "@/lib/utils/cn";
import { OrktraLogo } from "@/components/layout/orktra-logo";

type AppSidebarProps = {
  modules: SidebarModule[];
};

export function AppSidebar({ modules }: AppSidebarProps): JSX.Element {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-[var(--border)] bg-[var(--card)] p-5 lg:flex lg:flex-col">
      <OrktraLogo className="mb-8" />
      <nav className="flex flex-1 flex-col gap-1">
        {modules.map((module) => {
          const active = pathname === module.href || pathname.startsWith(`${module.href}/`);
          const Icon = module.icon;

          return (
            <Link
              key={module.key}
              href={module.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--brand-primary)] text-white shadow-sm"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{module.label}</span>
            </Link>
          );
        })}
      </nav>
      <p className="mt-4 text-xs text-[var(--muted-foreground)]">
        ORKTRA SaaS enterprise v1
      </p>
    </aside>
  );
}

