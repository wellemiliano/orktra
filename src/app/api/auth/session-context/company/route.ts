import { z } from "zod";
import { getRequestContext } from "@/server/tenant/context";
import { handleApiError } from "@/server/tenant/http";
import { setContextCookie } from "@/server/auth/context-cookie";

const schema = z.object({
  companyId: z.string().cuid(),
});

export async function POST(request: Request): Promise<Response> {
  try {
    const context = await getRequestContext();
    const payload = schema.parse(await request.json());
    const foundMembership = context.memberships.find(
      (membership) => membership.companyId === payload.companyId,
    );

    if (!foundMembership) {
      return Response.json(
        { error: "Empresa não disponível para este usuário." },
        { status: 403 },
      );
    }

    await setContextCookie({
      companyId: payload.companyId,
      unitId: foundMembership.unitId,
    });

    return Response.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}

