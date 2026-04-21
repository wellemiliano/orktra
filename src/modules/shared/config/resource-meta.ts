export type FieldMeta = {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  required?: boolean;
  options?: string[];
};

export type ResourceMeta = {
  title: string;
  description: string;
  fields: FieldMeta[];
  columns: string[];
};

export const RESOURCE_META: Record<string, ResourceMeta> = {
  companies: {
    title: "Empresas",
    description: "Gestão multi-tenant da plataforma.",
    fields: [
      { key: "name", label: "Nome", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", required: true },
      { key: "plan", label: "Plano", type: "text" },
    ],
    columns: ["name", "slug", "plan", "isActive", "createdAt"],
  },
  units: {
    title: "Unidades",
    description: "Unidade é o conceito central operacional do ORKTRA.",
    fields: [
      { key: "code", label: "Código", type: "text", required: true },
      { key: "name", label: "Nome", type: "text", required: true },
      { key: "description", label: "Descrição", type: "text" },
    ],
    columns: ["code", "name", "isActive", "createdAt"],
  },
  suppliers: {
    title: "Fornecedores",
    description: "Cadastro de parceiros e fornecedores por tenant.",
    fields: [
      { key: "name", label: "Nome", type: "text", required: true },
      { key: "document", label: "Documento", type: "text" },
      { key: "email", label: "E-mail", type: "text" },
    ],
    columns: ["name", "document", "email", "isActive", "createdAt"],
  },
  products: {
    title: "Produtos",
    description: "Catálogo de produtos e insumos operacionais.",
    fields: [
      { key: "sku", label: "SKU", type: "text", required: true },
      { key: "name", label: "Nome", type: "text", required: true },
      { key: "unitMeasure", label: "Unidade de medida", type: "text", required: true },
      { key: "minStock", label: "Estoque mínimo", type: "number", required: true },
    ],
    columns: ["sku", "name", "unitMeasure", "minStock", "createdAt"],
  },
  warehouses: {
    title: "Almoxarifados",
    description: "Estrutura de estoque vinculada a unidade.",
    fields: [
      { key: "unitId", label: "Unit ID", type: "text", required: true },
      { key: "code", label: "Código", type: "text", required: true },
      { key: "name", label: "Nome", type: "text", required: true },
    ],
    columns: ["code", "name", "unitId", "createdAt"],
  },
  "operational-contracts": {
    title: "Contratos Operacionais",
    description: "Contratos recorrentes operacionais.",
    fields: [
      { key: "unitId", label: "Unit ID", type: "text", required: true },
      { key: "code", label: "Código", type: "text", required: true },
      { key: "title", label: "Título", type: "text", required: true },
      { key: "baseAmount", label: "Valor base", type: "number", required: true },
      {
        key: "recurrence",
        label: "Recorrência",
        type: "select",
        options: ["MONTHLY", "QUARTERLY", "YEARLY", "CUSTOM"],
        required: true,
      },
      { key: "startDate", label: "Início", type: "date", required: true },
    ],
    columns: ["code", "title", "status", "baseAmount", "recurrence"],
  },
  "patrimonial-contracts": {
    title: "Contratos Patrimoniais",
    description: "Contratos patrimoniais e de longo prazo.",
    fields: [
      { key: "unitId", label: "Unit ID", type: "text", required: true },
      { key: "code", label: "Código", type: "text", required: true },
      { key: "title", label: "Título", type: "text", required: true },
      { key: "baseAmount", label: "Valor base", type: "number", required: true },
      {
        key: "recurrence",
        label: "Recorrência",
        type: "select",
        options: ["MONTHLY", "QUARTERLY", "YEARLY", "CUSTOM"],
        required: true,
      },
      { key: "startDate", label: "Início", type: "date", required: true },
    ],
    columns: ["code", "title", "status", "baseAmount", "recurrence"],
  },
  payables: {
    title: "Pagáveis",
    description: "Obrigações financeiras e fluxo de pagamento.",
    fields: [
      { key: "unitId", label: "Unit ID", type: "text", required: true },
      { key: "code", label: "Código", type: "text", required: true },
      { key: "description", label: "Descrição", type: "text", required: true },
      { key: "amount", label: "Valor", type: "number", required: true },
      { key: "dueDate", label: "Vencimento", type: "date", required: true },
      {
        key: "originType",
        label: "Origem",
        type: "select",
        options: [
          "OPERATIONAL_CONTRACT",
          "PATRIMONIAL_CONTRACT",
          "FISCAL_DOCUMENT",
          "MEASUREMENT",
          "MANUAL",
        ],
        required: true,
      },
    ],
    columns: ["code", "description", "amount", "status", "dueDate"],
  },
  "fiscal-documents": {
    title: "Documentos Fiscais",
    description: "Registro fiscal com vínculos de negócio.",
    fields: [
      { key: "unitId", label: "Unit ID", type: "text", required: true },
      { key: "documentNumber", label: "Número", type: "text", required: true },
      { key: "issueDate", label: "Data emissão", type: "date", required: true },
      { key: "totalAmount", label: "Valor total", type: "number", required: true },
    ],
    columns: ["documentNumber", "status", "totalAmount", "issueDate", "createdAt"],
  },
  stock: {
    title: "Movimentações de Estoque",
    description: "Entradas, saídas e transferências por unidade.",
    fields: [
      { key: "unitId", label: "Unit ID", type: "text", required: true },
      { key: "productId", label: "Produto ID", type: "text", required: true },
      {
        key: "movementType",
        label: "Movimento",
        type: "select",
        options: ["IN", "OUT", "TRANSFER", "ADJUSTMENT"],
        required: true,
      },
      { key: "quantity", label: "Quantidade", type: "number", required: true },
    ],
    columns: ["movementType", "quantity", "reference", "createdAt"],
  },
  measurements: {
    title: "Medições",
    description: "Medições de serviço/execução com vínculo financeiro.",
    fields: [
      { key: "unitId", label: "Unit ID", type: "text", required: true },
      { key: "code", label: "Código", type: "text", required: true },
      { key: "measuredAmount", label: "Valor medido", type: "number", required: true },
      { key: "referenceDate", label: "Data referência", type: "date", required: true },
    ],
    columns: ["code", "status", "measuredAmount", "billedAmount", "paidAmount"],
  },
  approvals: {
    title: "Aprovações",
    description: "Fluxo de aprovação de 1 etapa com trilha completa.",
    fields: [
      {
        key: "sourceModule",
        label: "Módulo origem",
        type: "select",
        options: [
          "PAYABLES",
          "OPERATIONAL_CONTRACTS",
          "PATRIMONIAL_CONTRACTS",
          "FISCAL_DOCUMENTS",
          "MEASUREMENTS",
          "STOCK",
        ],
        required: true,
      },
      { key: "sourceEntityId", label: "ID origem", type: "text", required: true },
      { key: "requestedById", label: "Solicitante ID", type: "text", required: true },
    ],
    columns: ["sourceModule", "status", "requestedAt", "decidedAt"],
  },
  "audit-logs": {
    title: "Auditoria",
    description: "Trilha completa de negócio e configuração.",
    fields: [
      {
        key: "module",
        label: "Módulo",
        type: "select",
        options: [
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
        ],
        required: true,
      },
      { key: "entity", label: "Entidade", type: "text", required: true },
      { key: "entityId", label: "ID entidade", type: "text", required: true },
      {
        key: "action",
        label: "Ação",
        type: "select",
        options: [
          "CREATE",
          "UPDATE",
          "DELETE",
          "APPROVE",
          "REJECT",
          "RETURN",
          "SYNC",
          "CONFIG_CHANGE",
        ],
        required: true,
      },
    ],
    columns: ["module", "entity", "action", "createdAt", "origin"],
  },
  integrations: {
    title: "Integrações",
    description: "Fila e monitoramento de sincronização Protheus mock.",
    fields: [
      { key: "connectionId", label: "Connection ID", type: "text", required: true },
      { key: "eventType", label: "Evento", type: "text", required: true },
      { key: "payload", label: "Payload JSON", type: "text", required: true },
    ],
    columns: ["eventType", "status", "retryCount", "scheduledAt", "processedAt"],
  },
  "custom-fields": {
    title: "Campos Customizados",
    description: "No-code light para metadados de formulário.",
    fields: [
      { key: "scope", label: "Escopo", type: "select", options: ["GLOBAL", "TENANT"], required: true },
      {
        key: "module",
        label: "Módulo",
        type: "select",
        options: [
          "OPERATIONAL_CONTRACTS",
          "PATRIMONIAL_CONTRACTS",
          "PAYABLES",
          "SUPPLIERS",
          "FISCAL_DOCUMENTS",
          "PRODUCTS",
          "MEASUREMENTS",
          "UNITS",
        ],
        required: true,
      },
      { key: "key", label: "Chave", type: "text", required: true },
      { key: "label", label: "Rótulo", type: "text", required: true },
      {
        key: "type",
        label: "Tipo",
        type: "select",
        options: [
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
        ],
        required: true,
      },
    ],
    columns: ["scope", "module", "key", "label", "type", "isActive"],
  },
  branding: {
    title: "Branding por Tenant",
    description: "Configuração visual com guardrails de consistência.",
    fields: [
      { key: "scope", label: "Escopo", type: "select", options: ["GLOBAL", "TENANT"], required: true },
      { key: "primaryColor", label: "Cor primária", type: "text", required: true },
      { key: "secondaryColor", label: "Cor secundária", type: "text", required: true },
      { key: "darkColor", label: "Cor escura", type: "text", required: true },
      { key: "neutralColor", label: "Cor neutra", type: "text", required: true },
      { key: "lightBgColor", label: "Cor de fundo", type: "text", required: true },
    ],
    columns: ["scope", "companyId", "primaryColor", "secondaryColor", "updatedAt"],
  },
  "module-configurations": {
    title: "Configuração de Módulos",
    description: "Ativação/desativação por tenant.",
    fields: [
      { key: "scope", label: "Escopo", type: "select", options: ["GLOBAL", "TENANT"], required: true },
      { key: "module", label: "Módulo", type: "text", required: true },
      { key: "featureKey", label: "Feature Key", type: "text", required: true },
      { key: "enabled", label: "Habilitado (true/false)", type: "text", required: true },
    ],
    columns: ["scope", "module", "featureKey", "enabled", "updatedAt"],
  },
  "status-configurations": {
    title: "Configuração de Status",
    description: "Status customizáveis por módulo e tenant.",
    fields: [
      { key: "scope", label: "Escopo", type: "select", options: ["GLOBAL", "TENANT"], required: true },
      { key: "module", label: "Módulo", type: "text", required: true },
      { key: "key", label: "Chave", type: "text", required: true },
      { key: "label", label: "Label", type: "text", required: true },
      { key: "color", label: "Cor", type: "text" },
    ],
    columns: ["scope", "module", "key", "label", "isActive", "updatedAt"],
  },
  "form-layouts": {
    title: "Form Layouts",
    description: "Layout simples por módulo com precedência tenant > global.",
    fields: [
      { key: "scope", label: "Escopo", type: "select", options: ["GLOBAL", "TENANT"], required: true },
      { key: "module", label: "Módulo", type: "text", required: true },
      { key: "name", label: "Nome", type: "text", required: true },
      { key: "config", label: "Config JSON", type: "text", required: true },
    ],
    columns: ["scope", "module", "name", "isDefault", "updatedAt"],
  },
};

