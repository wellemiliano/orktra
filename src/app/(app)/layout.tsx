import { redirect } from "next/navigation";
import type { TenantRoleCode } from "@prisma/client";
import { auth } from "@/auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { GlobalHeader } from "@/components/layout/global-header";
import { getSidebarModulesForUser } from "@/server/auth/module-access";
import { getRequestContext } from "@/server/tenant/context";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const requestContext = await getRequestContext();

  const modules = getSidebarModulesForUser({
    platformRole: requestContext.platformRole,
    roleCode: (requestContext.roleContext as TenantRoleCode | null) ?? null,
  });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1920px]">
      <AppSidebar modules={modules} />
      <div className="flex min-h-screen flex-1 flex-col">
        <GlobalHeader
          userName={session.user.name ?? "Usuário"}
          roleLabel={requestContext.roleContext}
          memberships={requestContext.memberships}
          currentCompanyId={requestContext.currentCompanyId}
          currentUnitId={requestContext.currentUnitId}
        />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
