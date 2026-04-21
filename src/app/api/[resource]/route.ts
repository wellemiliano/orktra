import { RESOURCE_KEYS } from "@/modules/shared/config/resources";
import { createResource, listResource } from "@/modules/shared/server/crud";
import { handleApiError } from "@/server/tenant/http";
import { QueueSyncService } from "@/server/integrations/sync-service";

type Params = {
  params: Promise<{ resource: string }>;
};

export async function GET(_: Request, { params }: Params): Promise<Response> {
  try {
    const { resource } = await params;

    if (!RESOURCE_KEYS.includes(resource)) {
      return Response.json({ error: "Recurso inválido." }, { status: 404 });
    }

    const data = await listResource(resource);
    return Response.json({ data });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, { params }: Params): Promise<Response> {
  try {
    const { resource } = await params;

    if (!RESOURCE_KEYS.includes(resource)) {
      return Response.json({ error: "Recurso inválido." }, { status: 404 });
    }

    const body = await request.json();
    const created = await createResource(resource, body);

    if (resource === "integrations" && body.autoProcess) {
      const service = new QueueSyncService();
      await service.process((created as { id: string }).id);
    }

    return Response.json({ data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

