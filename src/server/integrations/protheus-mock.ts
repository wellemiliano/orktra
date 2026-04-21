import type { ERPConnector, IntegrationEvent, SyncJobResult } from "@/server/integrations/contracts";

export class ProtheusMockConnector implements ERPConnector {
  connectorCode = "PROTHEUS_MOCK";

  async sendEvent(event: IntegrationEvent): Promise<SyncJobResult> {
    const shouldFail = event.retryCount < 1 && event.eventType.includes("PAYABLE");

    if (shouldFail) {
      return {
        status: "FAILED",
        errorMessage: "Timeout no adapter mock Protheus",
        responsePayload: {
          code: "MOCK_TIMEOUT",
          detail: "Falha simulada para validar retry.",
        },
      };
    }

    return {
      status: "SUCCESS",
      responsePayload: {
        externalId: `ERP-${event.queueId.slice(0, 8).toUpperCase()}`,
        connector: this.connectorCode,
        processedAt: new Date().toISOString(),
      },
    };
  }
}

