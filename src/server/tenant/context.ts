import type { ModuleKey, TenantRoleCode } from "@prisma/client";
import { auth } from "@/auth";
import { hasPermission, type PermissionAction } from "@/server/auth/permissions";
import { getContextFromCookie } from "@/server/auth/context-cookie";

export class UnauthorizedError extends Error {
  constructor(message = "Não autenticado.") {
    super(message);
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Acesso negado.") {
    super(message);
  }
}

export type RequestContext = {
  userId: string;
  platformRole: "USER" | "SUPER_ADMIN_PLATFORM";
  currentCompanyId: string | null;
  currentUnitId: string | null;
  roleContext: TenantRoleCode | null;
  memberships: {
    companyId: string;
    companyName: string;
    unitId: string | null;
    unitName: string | null;
    roleCode: TenantRoleCode;
  }[];
};

export async function getRequestContext(): Promise<RequestContext> {
  const session = await auth();

  if (!session?.user) {
    throw new UnauthorizedError();
  }

  const memberships = (session.user.memberships ?? []) as RequestContext["memberships"];
  const cookieContext = await getContextFromCookie();

  const requestedCompanyId = cookieContext.companyId ?? session.user.currentCompanyId;
  const companyMemberships = memberships.filter(
    (membership) => membership.companyId === requestedCompanyId,
  );
  const fallbackMembership = memberships[0] ?? null;
  const resolvedMembership =
    companyMemberships.find((membership) => membership.unitId === cookieContext.unitId) ??
    companyMemberships[0] ??
    fallbackMembership;

  return {
    userId: session.user.id,
    platformRole: session.user.platformRole,
    currentCompanyId: resolvedMembership?.companyId ?? null,
    currentUnitId: resolvedMembership?.unitId ?? null,
    roleContext: resolvedMembership?.roleCode ?? null,
    memberships,
  };
}

export async function requirePermission(
  module: ModuleKey,
  action: PermissionAction,
): Promise<RequestContext> {
  const context = await getRequestContext();
  const allowed = hasPermission({
    platformRole: context.platformRole,
    roleCode: context.roleContext,
    module,
    action,
  });

  if (!allowed) {
    throw new ForbiddenError(
      `Sem permissão para ${action.toUpperCase()} em ${module}.`,
    );
  }

  return context;
}

export function resolveTenantOverrides<T extends { companyId?: string | null; unitId?: string | null }>(
  input: T,
  context: RequestContext,
): T {
  return {
    ...input,
    companyId: context.currentCompanyId ?? input.companyId ?? null,
    unitId: context.currentUnitId ?? input.unitId ?? null,
  };
}
