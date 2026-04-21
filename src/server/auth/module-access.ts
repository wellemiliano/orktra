import type { PlatformRole, TenantRoleCode } from "@prisma/client";
import { SIDEBAR_MODULES } from "@/lib/constants/modules";
import { hasPermission } from "@/server/auth/permissions";

export function getSidebarModulesForUser(params: {
  platformRole: PlatformRole;
  roleCode: TenantRoleCode | null;
}) {
  return SIDEBAR_MODULES.filter((module) => {
    if (module.adminOnly && params.platformRole !== "SUPER_ADMIN_PLATFORM") {
      return false;
    }

    return hasPermission({
      platformRole: params.platformRole,
      roleCode: params.roleCode,
      module: module.key,
      action: "view",
    });
  });
}
