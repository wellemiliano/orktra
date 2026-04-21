import {
  getScopedConfigPayload,
  resolveConfigPrecedence,
} from "@/server/tenant/config-precedence";

describe("configuration precedence", () => {
  it("prefers tenant config when available", () => {
    const effective = resolveConfigPrecedence({
      companyId: "company-a",
      globalConfig: { theme: "global" },
      tenantConfig: { theme: "tenant" },
    });

    expect(effective).toEqual({ theme: "tenant" });
  });

  it("falls back to global when tenant config is missing", () => {
    const effective = getScopedConfigPayload({
      companyId: "company-a",
      configs: [
        { scope: "GLOBAL", payload: { featureEnabled: true } },
        { scope: "TENANT", companyId: "company-b", payload: { featureEnabled: false } },
      ],
    });

    expect(effective).toEqual({ featureEnabled: true });
  });
});

