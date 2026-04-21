import type { AuditAction, ModuleKey } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { RESOURCE_CONFIGS } from "@/modules/shared/config/resources";
import { logAudit } from "@/server/audit/audit-service";
import {
  ForbiddenError,
  getRequestContext,
  requirePermission,
} from "@/server/tenant/context";

type CrudAction = "view" | "create" | "update" | "delete";
type CrudRecord = Record<string, unknown> & {
  id: string;
  companyId?: string | null;
  unitId?: string | null;
};

type CrudDelegate = {
  findMany: (args: { where: Record<string, unknown>; orderBy: { createdAt: "desc" }; take: number }) => Promise<CrudRecord[]>;
  create: (args: { data: Record<string, unknown> }) => Promise<CrudRecord>;
  findUnique: (args: { where: { id: string } }) => Promise<CrudRecord | null>;
  update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<CrudRecord>;
  delete: (args: { where: { id: string } }) => Promise<CrudRecord>;
};

function getConfig(resource: string) {
  const config = RESOURCE_CONFIGS[resource];

  if (!config) {
    throw new Error(`Recurso '${resource}' nao suportado.`);
  }

  return config;
}

function buildTenantWhere(
  resource: string,
  context: Awaited<ReturnType<typeof getRequestContext>>,
): Record<string, unknown> {
  const config = getConfig(resource);
  const where: Record<string, unknown> = {};

  if (
    config.companyScoped &&
    context.platformRole !== "SUPER_ADMIN_PLATFORM" &&
    context.currentCompanyId
  ) {
    where.companyId = context.currentCompanyId;
  }

  if (
    resource === "companies" &&
    context.platformRole !== "SUPER_ADMIN_PLATFORM" &&
    context.currentCompanyId
  ) {
    where.id = context.currentCompanyId;
  }

  if (config.unitScoped && context.currentUnitId) {
    where.unitId = context.currentUnitId;
  }

  if (
    context.platformRole !== "SUPER_ADMIN_PLATFORM" &&
    [
      "customFieldDefinition",
      "moduleConfiguration",
      "tenantBranding",
      "statusConfiguration",
      "formLayout",
    ].includes(config.model)
  ) {
    where.OR = [
      { scope: "GLOBAL" },
      { scope: "TENANT", companyId: context.currentCompanyId },
    ];
  }

  return where;
}

function normalizeData(resource: string, input: Record<string, unknown>, context: Awaited<ReturnType<typeof getRequestContext>>) {
  const config = getConfig(resource);
  const data = { ...input };

  if (config.companyScoped && context.currentCompanyId) {
    data.companyId = data.companyId ?? context.currentCompanyId;
  }

  if (config.unitScoped && context.currentUnitId) {
    data.unitId = data.unitId ?? context.currentUnitId;
  }

  if ("scope" in data && data.scope === "TENANT" && context.currentCompanyId) {
    data.companyId = data.companyId ?? context.currentCompanyId;
  }

  if ("scope" in data && data.scope === "TENANT" && !data.companyId) {
    throw new Error("Configuracao TENANT exige companyId valido.");
  }

  if (
    "scope" in data &&
    data.scope === "GLOBAL" &&
    context.platformRole !== "SUPER_ADMIN_PLATFORM"
  ) {
    throw new ForbiddenError("Somente SUPER_ADMIN_PLATFORM pode alterar escopo global.");
  }

  return data;
}

function auditActionByCrud(action: CrudAction, module: ModuleKey): AuditAction {
  if (action === "create") {
    return module === "BRANDING" ||
      module === "MODULE_CONFIGURATIONS" ||
      module === "STATUS_CONFIGURATIONS" ||
      module === "FORM_LAYOUTS" ||
      module === "CUSTOM_FIELDS"
      ? "CONFIG_CHANGE"
      : "CREATE";
  }

  if (action === "update") {
    return module === "BRANDING" ||
      module === "MODULE_CONFIGURATIONS" ||
      module === "STATUS_CONFIGURATIONS" ||
      module === "FORM_LAYOUTS" ||
      module === "CUSTOM_FIELDS"
      ? "CONFIG_CHANGE"
      : "UPDATE";
  }

  return "DELETE";
}

function getDelegate(model: string): CrudDelegate {
  const delegate = Reflect.get(prisma, model) as CrudDelegate | undefined;

  if (!delegate) {
    throw new Error(`Delegate Prisma nao encontrado para ${model}.`);
  }

  return delegate;
}

export async function listResource(resource: string): Promise<unknown> {
  const config = getConfig(resource);
  const context = await requirePermission(config.module, "view");
  const where = buildTenantWhere(resource, context);

  const delegate = getDelegate(config.model);
  return delegate.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function createResource(resource: string, payload: unknown): Promise<unknown> {
  const config = getConfig(resource);
  const context = await requirePermission(config.module, "create");
  const parsed = config.createSchema.parse(payload) as Record<string, unknown>;
  const normalized = normalizeData(resource, parsed, context);

  const delegate = getDelegate(config.model);
  const created = await delegate.create({
    data: normalized,
  });

  if (context.currentCompanyId) {
    await logAudit({
      companyId: context.currentCompanyId,
      unitId: (created.unitId as string | null) ?? context.currentUnitId,
      userId: context.userId,
      module: config.module,
      entity: config.model,
      entityId: created.id as string,
      action: auditActionByCrud("create", config.module),
      newValues: created,
      origin: `api/${resource}`,
    });
  }

  return created;
}

export async function updateResource(
  resource: string,
  id: string,
  payload: unknown,
): Promise<unknown> {
  const config = getConfig(resource);
  const context = await requirePermission(config.module, "update");
  const parsed = config.updateSchema.parse(payload) as Record<string, unknown>;
  const delegate = getDelegate(config.model);

  const previous = await delegate.findUnique({
    where: { id },
  });

  if (!previous) {
    throw new Error("Registro nao encontrado.");
  }

  if (
    config.companyScoped &&
    context.platformRole !== "SUPER_ADMIN_PLATFORM" &&
    previous.companyId !== context.currentCompanyId
  ) {
    throw new ForbiddenError();
  }

  if (
    resource === "companies" &&
    context.platformRole !== "SUPER_ADMIN_PLATFORM" &&
    previous.id !== context.currentCompanyId
  ) {
    throw new ForbiddenError();
  }

  const normalized = normalizeData(resource, parsed, context);
  const updated = await delegate.update({
    where: { id },
    data: normalized,
  });

  if (context.currentCompanyId || previous.companyId) {
    await logAudit({
      companyId: (previous.companyId as string) ?? context.currentCompanyId ?? "",
      unitId: (updated.unitId as string | null) ?? context.currentUnitId,
      userId: context.userId,
      module: config.module,
      entity: config.model,
      entityId: id,
      action: auditActionByCrud("update", config.module),
      oldValues: previous,
      newValues: updated,
      origin: `api/${resource}/${id}`,
    });
  }

  return updated;
}

export async function deleteResource(resource: string, id: string): Promise<unknown> {
  const config = getConfig(resource);
  const context = await requirePermission(config.module, "delete");
  const delegate = getDelegate(config.model);

  const previous = await delegate.findUnique({
    where: { id },
  });

  if (!previous) {
    throw new Error("Registro nao encontrado.");
  }

  if (
    config.companyScoped &&
    context.platformRole !== "SUPER_ADMIN_PLATFORM" &&
    previous.companyId !== context.currentCompanyId
  ) {
    throw new ForbiddenError();
  }

  if (
    resource === "companies" &&
    context.platformRole !== "SUPER_ADMIN_PLATFORM" &&
    previous.id !== context.currentCompanyId
  ) {
    throw new ForbiddenError();
  }

  const deleted = await delegate.delete({
    where: { id },
  });

  if (context.currentCompanyId || previous.companyId) {
    await logAudit({
      companyId: (previous.companyId as string) ?? context.currentCompanyId ?? "",
      unitId: (previous.unitId as string | null) ?? context.currentUnitId,
      userId: context.userId,
      module: config.module,
      entity: config.model,
      entityId: id,
      action: auditActionByCrud("delete", config.module),
      oldValues: previous,
      newValues: deleted,
      origin: `api/${resource}/${id}`,
    });
  }

  return deleted;
}

export function parseId(id: string): string {
  return z.string().cuid().parse(id);
}

