import { z } from "zod";
import { getRequestContext } from "@/server/tenant/context";
import { handleApiError } from "@/server/tenant/http";
import { setContextCookie } from "@/server/auth/context-cookie";

const schema = z.object({
  unitId: z.string().cuid().nullable(),
});

export async function POST(request: Request): Promise<Response> {
  try {
    const context = await getRequestContext();
    const payload = schema.parse(await request.json());

    if (!context.currentCompanyId) {
      return Response.json(
        { error: "Selecione uma empresa antes de trocar de unidade." },
        { status: 400 },
      );
    }

    const isAllowed = context.memberships.some(
      (membership) =>
        membership.companyId === context.currentCompanyId &&
        membership.unitId === payload.unitId,
    );

    if (!isAllowed && payload.unitId) {
      return Response.json(
        { error: "Unidade não disponível para este contexto." },
        { status: 403 },
      );
    }

    await setContextCookie({
      companyId: context.currentCompanyId,
      unitId: payload.unitId,
    });

    return Response.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}

