export interface DocumentExtractionProvider {
  extract(payload: {
    fileUrl: string;
    documentType: string;
  }): Promise<{
    summary: string;
    confidence: number;
    extractedFields: Record<string, unknown>;
  }>;
}

export interface ContractAnalysisProvider {
  analyze(payload: {
    contractText: string;
    contractType: "operational" | "patrimonial";
  }): Promise<{
    summary: string;
    flaggedClauses: string[];
    confidence: number;
  }>;
}

export interface DivergenceSuggestionProvider {
  suggest(payload: {
    measuredAmount: number;
    billedAmount: number;
    paidAmount: number;
  }): Promise<{
    hasDivergence: boolean;
    message: string;
    confidence: number;
  }>;
}

