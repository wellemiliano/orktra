import Link from "next/link";
import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const platformLinks = [
  {
    href: "/companies",
    title: "Gestão de Tenants",
    description: "Criar e manter empresas clientes, planos e licenças.",
  },
  {
    href: "/module-configurations",
    title: "Módulos por Tenant",
    description: "Ativar/desativar capacidades por cliente.",
  },
  {
    href: "/branding",
    title: "Branding Global e Tenant",
    description: "Tema, paleta e ativos visuais com guardrails.",
  },
  {
    href: "/custom-fields",
    title: "Templates de Campos",
    description: "Estrutura global de custom fields para no-code light.",
  },
  {
    href: "/integrations",
    title: "Monitor de Integrações",
    description: "Acompanhar filas, retries e logs do mock Protheus.",
  },
];

export default async function PlatformPage(): Promise<JSX.Element> {
  const session = await auth();
  const isPlatformAdmin = session?.user.platformRole === "SUPER_ADMIN_PLATFORM";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SUPER_ADMIN PLATFORM</CardTitle>
          <CardDescription>
            Administração global do ORKTRA: tenants, módulos, templates e governança da plataforma.
          </CardDescription>
        </CardHeader>
      </Card>

      {!isPlatformAdmin ? (
        <Card>
          <CardHeader>
            <CardTitle>Acesso restrito</CardTitle>
            <CardDescription>
              Somente usuários com perfil SUPER_ADMIN_PLATFORM podem alterar configurações globais.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {platformLinks.map((link) => (
            <Card key={link.href}>
              <CardHeader>
                <CardTitle>{link.title}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href={link.href}>Abrir</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
