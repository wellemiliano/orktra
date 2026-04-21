"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, AlertTriangle, BarChart4, Clock3, DollarSign, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardBarChart } from "@/components/charts/dashboard-bar-chart";
import { formatCurrency } from "@/lib/utils/format";

type DashboardType = "executive" | "financial" | "contracts" | "stock" | "approvals";

type DashboardPayload = {
  type: DashboardType;
  cards: { id: string; label: string; value: number }[];
  charts: { id: string; values: { name: string; value: number }[] }[];
};

const iconMap: Record<string, JSX.Element> = {
  "open-payables": <DollarSign className="h-4 w-4" />,
  "open-amount": <DollarSign className="h-4 w-4" />,
  overdue: <AlertTriangle className="h-4 w-4" />,
  approvals: <Clock3 className="h-4 w-4" />,
  contracts: <BarChart4 className="h-4 w-4" />,
  "stock-alert": <AlertTriangle className="h-4 w-4" />,
  "fiscal-backlog": <Activity className="h-4 w-4" />,
};

export function DashboardPage({ type }: { type: DashboardType }): JSX.Element {
  const pathname = usePathname();
  const query = useQuery({
    queryKey: ["dashboard", type],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard?type=${type}`);
      const json = (await response.json()) as DashboardPayload;

      if (!response.ok) {
        throw new Error("Falha ao carregar dashboard.");
      }

      return json;
    },
  });

  if (query.isLoading) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-[var(--muted-foreground)]">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Carregando dashboard...
      </div>
    );
  }

  if (query.error || !query.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Falha no carregamento</CardTitle>
        </CardHeader>
        <CardContent>Não foi possível carregar os indicadores.</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[
          { href: "/dashboard/executive", label: "Executivo" },
          { href: "/dashboard/financial", label: "Financeiro" },
          { href: "/dashboard/contracts", label: "Contratos" },
          { href: "/dashboard/stock", label: "Estoque" },
          { href: "/dashboard/approvals", label: "Aprovações" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              pathname === item.href
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {query.data.cards.map((card) => (
          <Card key={card.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
              <span className="text-[var(--muted-foreground)]">{iconMap[card.id]}</span>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {card.id.includes("amount") ? formatCurrency(card.value) : card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Indicadores comparativos</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardBarChart data={query.data.charts[0]?.values ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
