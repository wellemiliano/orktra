import { derivePayableOriginType } from "@/modules/shared/server/payable-rules";

describe("payable origin derivation", () => {
  it("prioritizes fiscal document origin", () => {
    expect(
      derivePayableOriginType({
        fiscalDocumentId: "doc",
        measurementId: "med",
      }),
    ).toBe("FISCAL_DOCUMENT");
  });

  it("falls back to manual origin when nothing is linked", () => {
    expect(derivePayableOriginType({})).toBe("MANUAL");
  });
});

