import type { QueueStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { ProtheusMockConnector } from "@/server/integrations/protheus-mock";
import type { SyncJob, SyncJobResult } from "@/server/integrations/contracts";
import { logAudit } from "@/server/audit/audit-service";

export class QueueSyncService implements SyncJob {
  private connector = new ProtheusMockConnector();

  async process(queueId: string): Promise<SyncJobResult> {
    const queue = await prisma.syncQueue.findUnique({
      where: { id: queueId },
      include: {
        connection: true,
      },
    });

    if (!queue) {
      throw new Error("Evento de sincronização não encontrado.");
    }

    const result = await this.connector.sendEvent({
      queueId: queue.id,
      companyId: queue.companyId,
      eventType: queue.eventType,
      payload: (queue.payload as Record<string, unknown>) ?? {},
      retryCount: queue.retryCount,
    });

    const status = result.status as QueueStatus;
    const nextRetryCount = status === "FAILED" ? queue.retryCount + 1 : queue.retryCount;

    await prisma.syncQueue.update({
      where: { id: queue.id },
      data: {
        status,
        retryCount: nextRetryCount,
        lastError: result.errorMessage ?? null,
        processedAt: status === "SUCCESS" ? new Date() : null,
      },
    });

    await prisma.integrationLog.create({
      data: {
        companyId: queue.companyId,
        connectionId: queue.connectionId,
        syncQueueId: queue.id,
        status,
        requestPayload: queue.payload as object,
        responsePayload: result.responsePayload as object,
        errorMessage: result.errorMessage ?? null,
        attempt: nextRetryCount + 1,
      },
    });

    await logAudit({
      companyId: queue.companyId,
      module: "INTEGRATIONS",
      entity: "SyncQueue",
      entityId: queue.id,
      action: "SYNC",
      oldValues: { status: queue.status, retryCount: queue.retryCount },
      newValues: { status, retryCount: nextRetryCount },
      origin: "integration/mock-sync",
    });

    return result;
  }
}

