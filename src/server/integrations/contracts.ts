import type { QueueStatus } from "@prisma/client";

export type IntegrationEvent = {
  queueId: string;
  companyId: string;
  eventType: string;
  payload: Record<string, unknown>;
  retryCount: number;
};

export type SyncJobResult = {
  status: QueueStatus;
  responsePayload?: Record<string, unknown>;
  errorMessage?: string;
};

export type RetryAction = {
  queueId: string;
  requestedBy: string;
};

export interface ERPConnector {
  connectorCode: string;
  sendEvent(event: IntegrationEvent): Promise<SyncJobResult>;
}

export interface SyncJob {
  process(queueId: string): Promise<SyncJobResult>;
}

