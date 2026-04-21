import type { ERPConnector, IntegrationEvent, SyncJobResult } from "@/server/integrations/contracts";

export class SapPlaceholderConnector implements ERPConnector {
  connectorCode = "SAP_PLACEHOLDER";

  async sendEvent(event: IntegrationEvent): Promise<SyncJobResult> {
    return {
      status: "FAILED",
      errorMessage: `Conector ${this.connectorCode} ainda não implementado para o evento ${event.eventType}.`,
    };
  }
}

