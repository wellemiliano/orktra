import type {
  ContractAnalysisProvider,
  DivergenceSuggestionProvider,
  DocumentExtractionProvider,
} from "@/server/ai/contracts";

export class MockDocumentExtractionProvider implements DocumentExtractionProvider {
  async extract(): Promise<{
    summary: string;
    confidence: number;
    extractedFields: Record<string, unknown>;
  }> {
    return {
      summary: "Mock: documento fiscal lido para demonstração.",
      confidence: 0.74,
      extractedFields: {
        documentNumber: "MOCK-001",
        supplierName: "Fornecedor Exemplo",
        totalAmount: 12345.67,
      },
    };
  }
}

export class MockContractAnalysisProvider implements ContractAnalysisProvider {
  async analyze(): Promise<{
    summary: string;
    flaggedClauses: string[];
    confidence: number;
  }> {
    return {
      summary: "Mock: análise contratual inicial pronta para futura IA real.",
      flaggedClauses: ["Reajuste sem índice definido", "Prazo de aviso não especificado"],
      confidence: 0.68,
    };
  }
}

export class MockDivergenceSuggestionProvider implements DivergenceSuggestionProvider {
  async suggest(payload: {
    measuredAmount: number;
    billedAmount: number;
    paidAmount: number;
  }): Promise<{
    hasDivergence: boolean;
    message: string;
    confidence: number;
  }> {
    const tolerance = 0.01;
    const hasDivergence =
      Math.abs(payload.measuredAmount - payload.billedAmount) > tolerance ||
      Math.abs(payload.billedAmount - payload.paidAmount) > tolerance;

    return {
      hasDivergence,
      message: hasDivergence
        ? "Mock: diferença detectada entre medido, faturado e pago."
        : "Mock: sem divergência relevante.",
      confidence: 0.71,
    };
  }
}

