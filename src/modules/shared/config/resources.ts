import type { ModuleKey } from "@prisma/client";
import { z } from "zod";

export type ResourceConfig = {
  key: string;
  label: string;
  module: ModuleKey;
  model: string;
  companyScoped: boolean;
  unitScoped: boolean;
  superAdminOnly?: boolean;
  createSchema: z.ZodTypeAny;
  updateSchema: z.ZodTypeAny;
  listSelect?: Record<string, boolean | Record<string, unknown>>;
};

const baseCompanySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  cnpj: z.string().optional(),
  plan: z.string().optional(),
  licenseMetadata: z.record(z.string(), z.any()).optional(),
  isActive: z.boolean().optional(),
});

const unitSchema = z.object({
  companyId: z.string().cuid().optional(),
  code: z.string().min(2),
  name: z.string().min(2),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

const supplierSchema = z.object({
  name: z.string().min(2),
  document: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});

const productSchema = z.object({
  sku: z.string().min(2),
  name: z.string().min(2),
  unitMeasure: z.string().min(2),
  minStock: z.coerce.number().nonnegative(),
  isActive: z.boolean().optional(),
});

const warehouseSchema = z.object({
  unitId: z.string().cuid(),
  code: z.string().min(2),
  name: z.string().min(2),
  isActive: z.boolean().optional(),
});

const operationalContractSchema = z.object({
  unitId: z.string().cuid(),
  supplierId: z.string().cuid().optional(),
  costCenterId: z.string().cuid().optional(),
  code: z.string().min(2),
  title: z.string().min(2),
  description: z.string().optional(),
  status: z
    .enum(["DRAFT", "ACTIVE", "SUSPENDED", "EXPIRED", "TERMINATED"])
    .optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  baseAmount: z.coerce.number().nonnegative(),
  recurrence: z.enum(["MONTHLY", "QUARTERLY", "YEARLY", "CUSTOM"]),
  adjustmentIndex: z.string().optional(),
});

const patrimonialContractSchema = operationalContractSchema.extend({
  anniversaryDate: z.coerce.date().optional(),
});

const payableSchema = z.object({
  unitId: z.string().cuid(),
  supplierId: z.string().cuid().optional(),
  code: z.string().min(2),
  description: z.string().min(2),
  amount: z.coerce.number().positive(),
  dueDate: z.coerce.date(),
  forecastPaymentDate: z.coerce.date().optional(),
  paymentDate: z.coerce.date().optional(),
  status: z
    .enum(["DRAFT", "OPEN", "DUE_SOON", "OVERDUE", "PAID", "CANCELED"])
    .optional(),
  originType: z.enum([
    "OPERATIONAL_CONTRACT",
    "PATRIMONIAL_CONTRACT",
    "FISCAL_DOCUMENT",
    "MEASUREMENT",
    "MANUAL",
  ]),
  originReference: z.string().optional(),
  operationalContractId: z.string().cuid().optional(),
  patrimonialContractId: z.string().cuid().optional(),
  fiscalDocumentId: z.string().cuid().optional(),
  measurementId: z.string().cuid().optional(),
});

const fiscalDocumentSchema = z.object({
  unitId: z.string().cuid(),
  supplierId: z.string().cuid().optional(),
  operationalContractId: z.string().cuid().optional(),
  patrimonialContractId: z.string().cuid().optional(),
  documentNumber: z.string().min(2),
  series: z.string().optional(),
  issueDate: z.coerce.date(),
  totalAmount: z.coerce.number().positive(),
  status: z.enum(["DRAFT", "RECEIVED", "CLASSIFIED", "APPROVED", "REJECTED"]).optional(),
  notes: z.string().optional(),
  fileUrl: z.string().optional(),
});

const stockSchema = z.object({
  unitId: z.string().cuid(),
  productId: z.string().cuid(),
  movementType: z.enum(["IN", "OUT", "TRANSFER", "ADJUSTMENT"]),
  quantity: z.coerce.number().positive(),
  sourceWarehouseId: z.string().cuid().optional(),
  targetWarehouseId: z.string().cuid().optional(),
  fiscalDocumentId: z.string().cuid().optional(),
  reference: z.string().optional(),
});

const measurementSchema = z.object({
  unitId: z.string().cuid(),
  supplierId: z.string().cuid().optional(),
  operationalContractId: z.string().cuid().optional(),
  fiscalDocumentId: z.string().cuid().optional(),
  code: z.string().min(2),
  description: z.string().optional(),
  measuredAmount: z.coerce.number().nonnegative(),
  billedAmount: z.coerce.number().nonnegative().default(0),
  paidAmount: z.coerce.number().nonnegative().default(0),
  status: z.enum(["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "RETURNED"]).optional(),
  referenceDate: z.coerce.date(),
});

const approvalSchema = z.object({
  unitId: z.string().cuid().optional(),
  sourceModule: z.enum([
    "PAYABLES",
    "OPERATIONAL_CONTRACTS",
    "PATRIMONIAL_CONTRACTS",
    "FISCAL_DOCUMENTS",
    "MEASUREMENTS",
    "STOCK",
  ]),
  sourceEntityId: z.string().min(1),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "RETURNED"]).optional(),
  requestedById: z.string().cuid(),
});

const customFieldSchema = z.object({
  scope: z.enum(["GLOBAL", "TENANT"]),
  companyId: z.string().cuid().optional(),
  module: z.enum([
    "OPERATIONAL_CONTRACTS",
    "PATRIMONIAL_CONTRACTS",
    "PAYABLES",
    "SUPPLIERS",
    "FISCAL_DOCUMENTS",
    "PRODUCTS",
    "MEASUREMENTS",
    "UNITS",
  ]),
  key: z.string().min(2),
  label: z.string().min(2),
  type: z.enum([
    "TEXT",
    "TEXTAREA",
    "NUMBER",
    "CURRENCY",
    "DATE",
    "SELECT",
    "MULTISELECT",
    "BOOLEAN",
    "EMAIL",
    "PHONE",
    "DOCUMENT_ID",
    "FILE",
  ]),
  options: z.array(z.string()).optional(),
  isRequired: z.boolean().optional(),
  isHidden: z.boolean().optional(),
  isReadOnly: z.boolean().optional(),
  isFilterable: z.boolean().optional(),
  isListable: z.boolean().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

const brandingSchema = z.object({
  scope: z.enum(["GLOBAL", "TENANT"]),
  companyId: z.string().cuid().optional(),
  companyName: z.string().optional(),
  logoUrl: z.string().optional(),
  primaryColor: z.string().min(4),
  secondaryColor: z.string().min(4),
  darkColor: z.string().min(4),
  neutralColor: z.string().min(4),
  lightBgColor: z.string().min(4),
  isDarkModeEnabled: z.boolean().optional(),
});

const moduleConfigSchema = z.object({
  scope: z.enum(["GLOBAL", "TENANT"]),
  companyId: z.string().cuid().optional(),
  module: z.enum([
    "COMPANIES",
    "UNITS",
    "USERS",
    "SUPPLIERS",
    "COST_CENTERS",
    "PRODUCTS",
    "WAREHOUSES",
    "OPERATIONAL_CONTRACTS",
    "PATRIMONIAL_CONTRACTS",
    "PAYABLES",
    "FISCAL_DOCUMENTS",
    "STOCK",
    "MEASUREMENTS",
    "APPROVALS",
    "AUDIT_LOGS",
    "INTEGRATIONS",
    "CUSTOM_FIELDS",
    "BRANDING",
    "MODULE_CONFIGURATIONS",
    "STATUS_CONFIGURATIONS",
    "FORM_LAYOUTS",
    "DASHBOARDS",
  ]),
  featureKey: z.string().min(1),
  enabled: z.boolean(),
  settings: z.record(z.string(), z.any()).optional(),
});

const statusConfigSchema = z.object({
  scope: z.enum(["GLOBAL", "TENANT"]),
  companyId: z.string().cuid().optional(),
  module: z.enum([
    "PAYABLES",
    "APPROVALS",
    "OPERATIONAL_CONTRACTS",
    "PATRIMONIAL_CONTRACTS",
    "FISCAL_DOCUMENTS",
    "STOCK",
    "MEASUREMENTS",
  ]),
  key: z.string().min(1),
  label: z.string().min(1),
  color: z.string().optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
});

const formLayoutSchema = z.object({
  scope: z.enum(["GLOBAL", "TENANT"]),
  companyId: z.string().cuid().optional(),
  module: z.enum([
    "OPERATIONAL_CONTRACTS",
    "PATRIMONIAL_CONTRACTS",
    "PAYABLES",
    "FISCAL_DOCUMENTS",
    "SUPPLIERS",
    "PRODUCTS",
    "MEASUREMENTS",
    "UNITS",
  ]),
  name: z.string().min(1),
  isDefault: z.boolean().optional(),
  config: z.record(z.string(), z.any()),
});

const integrationSchema = z.object({
  connectionId: z.string().cuid(),
  eventType: z.string().min(2),
  payload: z.record(z.string(), z.any()),
  status: z.enum(["PENDING", "PROCESSING", "SUCCESS", "FAILED"]).optional(),
  retryCount: z.number().int().nonnegative().optional(),
  maxRetries: z.number().int().positive().optional(),
  lastError: z.string().optional(),
  scheduledAt: z.coerce.date().optional(),
});

const auditSchema = z.object({
  unitId: z.string().cuid().optional(),
  module: z.enum([
    "PAYABLES",
    "FISCAL_DOCUMENTS",
    "STOCK",
    "MEASUREMENTS",
    "APPROVALS",
    "INTEGRATIONS",
    "BRANDING",
    "MODULE_CONFIGURATIONS",
    "STATUS_CONFIGURATIONS",
    "FORM_LAYOUTS",
    "CUSTOM_FIELDS",
  ]),
  entity: z.string().min(1),
  entityId: z.string().min(1),
  action: z.enum([
    "CREATE",
    "UPDATE",
    "DELETE",
    "APPROVE",
    "REJECT",
    "RETURN",
    "SYNC",
    "CONFIG_CHANGE",
  ]),
  fieldChanged: z.string().optional(),
  oldValues: z.record(z.string(), z.any()).optional(),
  newValues: z.record(z.string(), z.any()).optional(),
  observation: z.string().optional(),
  correlationId: z.string().optional(),
  origin: z.string().optional(),
});

export const RESOURCE_CONFIGS: Record<string, ResourceConfig> = {
  companies: {
    key: "companies",
    label: "Empresas",
    module: "COMPANIES",
    model: "company",
    companyScoped: false,
    unitScoped: false,
    createSchema: baseCompanySchema,
    updateSchema: baseCompanySchema.partial(),
  },
  units: {
    key: "units",
    label: "Unidades",
    module: "UNITS",
    model: "unit",
    companyScoped: true,
    unitScoped: false,
    createSchema: unitSchema,
    updateSchema: unitSchema.partial(),
  },
  suppliers: {
    key: "suppliers",
    label: "Fornecedores",
    module: "SUPPLIERS",
    model: "supplier",
    companyScoped: true,
    unitScoped: false,
    createSchema: supplierSchema,
    updateSchema: supplierSchema.partial(),
  },
  products: {
    key: "products",
    label: "Produtos",
    module: "PRODUCTS",
    model: "product",
    companyScoped: true,
    unitScoped: false,
    createSchema: productSchema,
    updateSchema: productSchema.partial(),
  },
  warehouses: {
    key: "warehouses",
    label: "Almoxarifados",
    module: "WAREHOUSES",
    model: "warehouse",
    companyScoped: true,
    unitScoped: true,
    createSchema: warehouseSchema,
    updateSchema: warehouseSchema.partial(),
  },
  "operational-contracts": {
    key: "operational-contracts",
    label: "Contratos Operacionais",
    module: "OPERATIONAL_CONTRACTS",
    model: "operationalContract",
    companyScoped: true,
    unitScoped: true,
    createSchema: operationalContractSchema,
    updateSchema: operationalContractSchema.partial(),
  },
  "patrimonial-contracts": {
    key: "patrimonial-contracts",
    label: "Contratos Patrimoniais",
    module: "PATRIMONIAL_CONTRACTS",
    model: "patrimonialContract",
    companyScoped: true,
    unitScoped: true,
    createSchema: patrimonialContractSchema,
    updateSchema: patrimonialContractSchema.partial(),
  },
  payables: {
    key: "payables",
    label: "Pagamentos",
    module: "PAYABLES",
    model: "payable",
    companyScoped: true,
    unitScoped: true,
    createSchema: payableSchema,
    updateSchema: payableSchema.partial(),
  },
  "fiscal-documents": {
    key: "fiscal-documents",
    label: "Documentos Fiscais",
    module: "FISCAL_DOCUMENTS",
    model: "fiscalDocument",
    companyScoped: true,
    unitScoped: true,
    createSchema: fiscalDocumentSchema,
    updateSchema: fiscalDocumentSchema.partial(),
  },
  stock: {
    key: "stock",
    label: "Movimentações de Estoque",
    module: "STOCK",
    model: "stockMovement",
    companyScoped: true,
    unitScoped: true,
    createSchema: stockSchema,
    updateSchema: stockSchema.partial(),
  },
  measurements: {
    key: "measurements",
    label: "Medições",
    module: "MEASUREMENTS",
    model: "measurement",
    companyScoped: true,
    unitScoped: true,
    createSchema: measurementSchema,
    updateSchema: measurementSchema.partial(),
  },
  approvals: {
    key: "approvals",
    label: "Aprovações",
    module: "APPROVALS",
    model: "approvalFlow",
    companyScoped: true,
    unitScoped: false,
    createSchema: approvalSchema,
    updateSchema: approvalSchema.partial(),
  },
  "audit-logs": {
    key: "audit-logs",
    label: "Auditoria",
    module: "AUDIT_LOGS",
    model: "auditLog",
    companyScoped: true,
    unitScoped: false,
    createSchema: auditSchema,
    updateSchema: auditSchema.partial(),
  },
  integrations: {
    key: "integrations",
    label: "Integrações",
    module: "INTEGRATIONS",
    model: "syncQueue",
    companyScoped: true,
    unitScoped: false,
    createSchema: integrationSchema,
    updateSchema: integrationSchema.partial(),
  },
  "custom-fields": {
    key: "custom-fields",
    label: "Campos Customizados",
    module: "CUSTOM_FIELDS",
    model: "customFieldDefinition",
    companyScoped: false,
    unitScoped: false,
    createSchema: customFieldSchema,
    updateSchema: customFieldSchema.partial(),
  },
  branding: {
    key: "branding",
    label: "Branding",
    module: "BRANDING",
    model: "tenantBranding",
    companyScoped: false,
    unitScoped: false,
    createSchema: brandingSchema,
    updateSchema: brandingSchema.partial(),
  },
  "module-configurations": {
    key: "module-configurations",
    label: "Configuração de Módulos",
    module: "MODULE_CONFIGURATIONS",
    model: "moduleConfiguration",
    companyScoped: false,
    unitScoped: false,
    createSchema: moduleConfigSchema,
    updateSchema: moduleConfigSchema.partial(),
  },
  "status-configurations": {
    key: "status-configurations",
    label: "Configuração de Status",
    module: "STATUS_CONFIGURATIONS",
    model: "statusConfiguration",
    companyScoped: false,
    unitScoped: false,
    createSchema: statusConfigSchema,
    updateSchema: statusConfigSchema.partial(),
  },
  "form-layouts": {
    key: "form-layouts",
    label: "Form Layouts",
    module: "FORM_LAYOUTS",
    model: "formLayout",
    companyScoped: false,
    unitScoped: false,
    createSchema: formLayoutSchema,
    updateSchema: formLayoutSchema.partial(),
  },
};

export const RESOURCE_KEYS = Object.keys(RESOURCE_CONFIGS);
