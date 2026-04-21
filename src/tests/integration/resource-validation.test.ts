import { RESOURCE_CONFIGS } from "@/modules/shared/config/resources";

describe("resource zod validation", () => {
  it("rejects payable payload without required fields", () => {
    const schema = RESOURCE_CONFIGS["payables"].createSchema;
    const parsed = schema.safeParse({
      code: "PAG-1",
      amount: 1000,
    });

    expect(parsed.success).toBe(false);
  });

  it("accepts minimum valid supplier payload", () => {
    const schema = RESOURCE_CONFIGS["suppliers"].createSchema;
    const parsed = schema.safeParse({
      name: "Fornecedor XPTO",
      document: "12.345.678/0001-00",
    });

    expect(parsed.success).toBe(true);
  });
});

