import { RESOURCE_KEYS } from "@/modules/shared/config/resources";
import { deleteResource, parseId, updateResource } from "@/modules/shared/server/crud";
import { handleApiError } from "@/server/tenant/http";
import { QueueSyncService } from "@/server/integrations/sync-service";
import { requirePermission } from "@/server/tenant/context";

type Params = {
  params: Promise<{ resource: string; id: string }>;
};

export async function PATCH(request: Request, { params }: Params): Promise<Response> {
  try {
    const { resource, id } = await params;
    const parsedId = parseId(id);

    if (!RESOURCE_KEYS.includes(resource)) {
      return Response.json({ error: "Recurso inválido." }, { status: 404 });
    }

    const body = await request.json();
    const updated = await updateResource(resource, parsedId, body);
    return Response.json({ data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: Request, { params }: Params): Promise<Response> {
  try {
    const { resource, id } = await params;
    const parsedId = parseId(id);

    if (!RESOURCE_KEYS.includes(resource)) {
      return Response.json({ error: "Recurso inválido." }, { status: 404 });
    }

    await deleteResource(resource, parsedId);
    return Response.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, { params }: Params): Promise<Response> {
  try {
    const { resource, id } = await params;
    const parsedId = parseId(id);

    if (resource !== "integrations") {
      return Response.json({ error: "Ação não suportada." }, { status: 405 });
    }

    const body = (await request.json()) as { action?: string };

    if (body.action !== "retry") {
      return Response.json({ error: "Ação inválida." }, { status: 400 });
    }

    await requirePermission("INTEGRATIONS", "update");

    const service = new QueueSyncService();
    const result = await service.process(parsedId);
    return Response.json({ data: result });
  } catch (error) {
    return handleApiError(error);
  }
}
