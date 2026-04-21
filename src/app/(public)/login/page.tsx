"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { OrktraLogo } from "@/components/layout/orktra-logo";

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const callbackUrl = "/dashboard/executive";

  const [email, setEmail] = useState("superadmin@orktra.local");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setError("Credenciais inválidas. Verifique e tente novamente.");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[var(--background)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <section className="relative hidden overflow-hidden border-r border-[var(--border)] bg-[var(--brand-primary)] p-12 text-white lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#2f8ba1_0%,transparent_42%),radial-gradient(circle_at_80%_0%,#114a5e_0%,transparent_50%)] opacity-90" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <OrktraLogo className="text-white [&_span]:text-white" />
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/80">Premium Enterprise SaaS</p>
            <h1 className="mt-3 max-w-lg text-4xl font-semibold leading-tight">
              Gestão multiempresa com controle operacional, financeiro e fiscal em uma única visão.
            </h1>
            <ul className="mt-8 space-y-3 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Multi-tenant, multi-unidade e pronto para mercado
              </li>
              <li className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Auditoria completa e integrações ERP mock-ready
              </li>
              <li className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Dashboard executivo com visão de risco e performance
              </li>
            </ul>
          </div>
          <p className="text-xs text-white/70">Referências de UX: Notion, Stripe, SAP.</p>
        </div>
      </section>

      <section className="flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acessar ORKTRA</CardTitle>
            <CardDescription>Use as credenciais de demonstração para entrar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
              <div className="space-y-1">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              {error ? <p className="text-sm text-[#C0392B]">{error}</p> : null}

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <div className="mt-4 rounded-md border border-[var(--border)] bg-[var(--muted)] p-3 text-xs text-[var(--muted-foreground)]">
              <p>Usuário demo: superadmin@orktra.local</p>
              <p>Senha demo: 123456</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
