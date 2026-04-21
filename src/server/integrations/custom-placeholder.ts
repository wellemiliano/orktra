import type { ERPConnector, IntegrationEvent, SyncJobResult } from "@/server/integrations/contracts";

export class CustomPlaceholderConnector implements ERPConnector {
  connectorCode = "CUSTOM_PLACEHOLDER";

  async sendEvent(event: IntegrationEvent): Promise<SyncJobResult> {
    return {
      status: "FAILED",
      errorMessage: `Conector ${this.connectorCode} não configurado para ${event.eventType}.`,
    };
  }
}

