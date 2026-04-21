import type { PayableOriginType } from "@prisma/client";

type PayableOriginInput = {
  operationalContractId?: string | null;
  patrimonialContractId?: string | null;
  fiscalDocumentId?: string | null;
  measurementId?: string | null;
};

export function derivePayableOriginType(input: PayableOriginInput): PayableOriginType {
  if (input.fiscalDocumentId) {
    return "FISCAL_DOCUMENT";
  }

  if (input.measurementId) {
    return "MEASUREMENT";
  }

  if (input.operationalContractId) {
    return "OPERATIONAL_CONTRACT";
  }

  if (input.patrimonialContractId) {
    return "PATRIMONIAL_CONTRACT";
  }

  return "MANUAL";
}

