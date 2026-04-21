import type { ModuleKey, PlatformRole, TenantRoleCode } from "@prisma/client";

export type PermissionAction =
  | "view"
  | "create"
  | "update"
  | "delete"
  | "approve"
  | "configure";

type RolePermissionMatrix = Record<
  TenantRoleCode,
  Partial<Record<ModuleKey, PermissionAction[]>>
>;

const matrix: RolePermissionMatrix = {
  ADMIN_EMPRESA: {
    COMPANIES: ["view", "update", "configure"],
    UNITS: ["view", "create", "update", "delete"],
    USERS: ["view", "create", "update", "delete"],
    SUPPLIERS: ["view", "create", "update", "delete"],
    COST_CENTERS: ["view", "create", "update", "delete"],
    PRODUCTS: ["view", "create", "update", "delete"],
    WAREHOUSES: ["view", "create", "update", "delete"],
    OPERATIONAL_CONTRACTS: ["view", "create", "update", "delete", "approve"],
    PATRIMONIAL_CONTRACTS: ["view", "create", "update", "delete", "approve"],
    PAYABLES: ["view", "create", "update", "delete", "approve"],
    FISCAL_DOCUMENTS: ["view", "create", "update", "delete", "approve"],
    STOCK: ["view", "create", "update", "delete"],
    MEASUREMENTS: ["view", "create", "update", "delete", "approve"],
    APPROVALS: ["view", "approve"],
    AUDIT_LOGS: ["view"],
    INTEGRATIONS: ["view", "configure"],
    CUSTOM_FIELDS: ["view", "create", "update", "delete", "configure"],
    BRANDING: ["view", "update", "configure"],
    MODULE_CONFIGURATIONS: ["view", "configure"],
    STATUS_CONFIGURATIONS: ["view", "create", "update", "delete", "configure"],
    FORM_LAYOUTS: ["view", "create", "update", "delete", "configure"],
    DASHBOARDS: ["view"],
  },
  GESTOR_UNIDADE: {
    UNITS: ["view", "update"],
    SUPPLIERS: ["view"],
    PRODUCTS: ["view"],
    WAREHOUSES: ["view", "create", "update"],
    OPERATIONAL_CONTRACTS: ["view", "create", "update"],
    PATRIMONIAL_CONTRACTS: ["view"],
    PAYABLES: ["view"],
    FISCAL_DOCUMENTS: ["view", "create", "update"],
    STOCK: ["view", "create", "update"],
    MEASUREMENTS: ["view", "create", "update"],
    APPROVALS: ["view", "approve"],
    AUDIT_LOGS: ["view"],
    DASHBOARDS: ["view"],
  },
  FINANCEIRO: {
    PAYABLES: ["view", "create", "update", "approve"],
    FISCAL_DOCUMENTS: ["view"],
    OPERATIONAL_CONTRACTS: ["view"],
    PATRIMONIAL_CONTRACTS: ["view"],
    MEASUREMENTS: ["view"],
    APPROVALS: ["view", "approve"],
    AUDIT_LOGS: ["view"],
    DASHBOARDS: ["view"],
  },
  FISCAL: {
    FISCAL_DOCUMENTS: ["view", "create", "update", "delete", "approve"],
    PAYABLES: ["view"],
    STOCK: ["view"],
    APPROVALS: ["view"],
    AUDIT_LOGS: ["view"],
    DASHBOARDS: ["view"],
  },
  OPERACOES: {
    STOCK: ["view", "create", "update"],
    MEASUREMENTS: ["view", "create", "update"],
    OPERATIONAL_CONTRACTS: ["view"],
    WAREHOUSES: ["view"],
    PRODUCTS: ["view"],
    APPROVALS: ["view"],
    DASHBOARDS: ["view"],
  },
  AUDITOR: {
    AUDIT_LOGS: ["view"],
    APPROVALS: ["view"],
    PAYABLES: ["view"],
    FISCAL_DOCUMENTS: ["view"],
    STOCK: ["view"],
    MEASUREMENTS: ["view"],
    DASHBOARDS: ["view"],
  },
};

export function hasPermission(params: {
  platformRole: PlatformRole;
  roleCode: TenantRoleCode | null;
  module: ModuleKey;
  action: PermissionAction;
}): boolean {
  const { platformRole, roleCode, module, action } = params;

  if (platformRole === "SUPER_ADMIN_PLATFORM") {
    return true;
  }

  if (!roleCode) {
    return false;
  }

  const rolePermissions = matrix[roleCode][module] ?? [];
  return rolePermissions.includes(action);
}

