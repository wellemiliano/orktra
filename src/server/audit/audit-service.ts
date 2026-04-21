import type { AuditAction, ModuleKey } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

type AuditPayload = {
  companyId: string;
  unitId?: string | null;
  userId?: string | null;
  module: ModuleKey;
  entity: string;
  entityId: string;
  action: AuditAction;
  fieldChanged?: string | null;
  oldValues?: unknown;
  newValues?: unknown;
  observation?: string | null;
  correlationId?: string | null;
  origin?: string | null;
};

function toJsonSafe(value: unknown): object | undefined {
  if (value === undefined) {
    return undefined;
  }

  return JSON.parse(JSON.stringify(value)) as object;
}

export async function logAudit(payload: AuditPayload): Promise<void> {
  await prisma.auditLog.create({
    data: {
      companyId: payload.companyId,
      unitId: payload.unitId ?? null,
      userId: payload.userId ?? null,
      module: payload.module,
      entity: payload.entity,
      entityId: payload.entityId,
      action: payload.action,
      fieldChanged: payload.fieldChanged ?? null,
      oldValues: toJsonSafe(payload.oldValues),
      newValues: toJsonSafe(payload.newValues),
      observation: payload.observation ?? null,
      correlationId: payload.correlationId ?? null,
      origin: payload.origin ?? null,
    },
  });
}
