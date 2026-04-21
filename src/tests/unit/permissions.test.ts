import { hasPermission } from "@/server/auth/permissions";

describe("RBAC permission matrix", () => {
  it("allows super admin in any module/action", () => {
    const allowed = hasPermission({
      platformRole: "SUPER_ADMIN_PLATFORM",
      roleCode: null,
      module: "PAYABLES",
      action: "delete",
    });

    expect(allowed).toBe(true);
  });

  it("blocks financeiro from deleting suppliers", () => {
    const allowed = hasPermission({
      platformRole: "USER",
      roleCode: "FINANCEIRO",
      module: "SUPPLIERS",
      action: "delete",
    });

    expect(allowed).toBe(false);
  });

  it("allows admin empresa to configure module settings", () => {
    const allowed = hasPermission({
      platformRole: "USER",
      roleCode: "ADMIN_EMPRESA",
      module: "MODULE_CONFIGURATIONS",
      action: "configure",
    });

    expect(allowed).toBe(true);
  });
});

