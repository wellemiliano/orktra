import { getRequestContext } from "@/server/tenant/context";
import { handleApiError } from "@/server/tenant/http";

export async function GET(): Promise<Response> {
  try {
    const context = await getRequestContext();

    return Response.json({
      userId: context.userId,
      platformRole: context.platformRole,
      currentCompanyId: context.currentCompanyId,
      currentUnitId: context.currentUnitId,
      roleContext: context.roleContext,
      memberships: context.memberships,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

