import { ZodError } from "zod";
import { ForbiddenError, UnauthorizedError } from "@/server/tenant/context";

export function handleApiError(error: unknown): Response {
  if (error instanceof UnauthorizedError) {
    return Response.json({ error: error.message }, { status: 401 });
  }

  if (error instanceof ForbiddenError) {
    return Response.json({ error: error.message }, { status: 403 });
  }

  if (error instanceof ZodError) {
    return Response.json(
      {
        error: "Payload inválido.",
        issues: error.flatten(),
      },
      { status: 422 },
    );
  }

  if (error instanceof Error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ error: "Erro inesperado." }, { status: 500 });
}

