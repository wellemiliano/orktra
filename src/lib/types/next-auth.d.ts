import type { PlatformRole, TenantRoleCode } from "@prisma/client";
import type { DefaultSession } from "next-auth";

type MembershipContext = {
  companyId: string;
  companyName: string;
  unitId: string | null;
  unitName: string | null;
  roleCode: TenantRoleCode;
};

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      platformRole: PlatformRole;
      currentCompanyId: string | null;
      currentUnitId: string | null;
      roleContext: TenantRoleCode | null;
      memberships: MembershipContext[];
    };
  }

  interface User {
    id: string;
    platformRole: PlatformRole;
    currentCompanyId: string | null;
    currentUnitId: string | null;
    roleContext: TenantRoleCode | null;
    memberships: MembershipContext[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    platformRole?: PlatformRole;
    currentCompanyId?: string | null;
    currentUnitId?: string | null;
    roleContext?: TenantRoleCode | null;
    memberships?: MembershipContext[];
  }
}

