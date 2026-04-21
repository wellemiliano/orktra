import {
  MockContractAnalysisProvider,
  MockDivergenceSuggestionProvider,
  MockDocumentExtractionProvider,
} from "@/server/ai/mock-providers";

export const aiProviders = {
  documentExtraction: new MockDocumentExtractionProvider(),
  contractAnalysis: new MockContractAnalysisProvider(),
  divergenceSuggestion: new MockDivergenceSuggestionProvider(),
};

