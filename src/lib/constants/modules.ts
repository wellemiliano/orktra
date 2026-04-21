import type { ModuleKey } from "@prisma/client";
import {
  Building2,
  CircuitBoard,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Package,
  ReceiptText,
  Scale,
  Settings2,
  ShieldCheck,
  ShoppingBasket,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type SidebarModule = {
  key: ModuleKey;
  label: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

export const SIDEBAR_MODULES: SidebarModule[] = [
  { key: "DASHBOARDS", label: "Executivo", href: "/dashboard/executive", icon: LayoutDashboard },
  { key: "COMPANIES", label: "Empresas", href: "/companies", icon: Building2 },
  { key: "UNITS", label: "Unidades", href: "/units", icon: Building2 },
  { key: "SUPPLIERS", label: "Fornecedores", href: "/suppliers", icon: ShoppingBasket },
  { key: "PRODUCTS", label: "Produtos", href: "/products", icon: Package },
  { key: "WAREHOUSES", label: "Estoques", href: "/warehouses", icon: Package },
  {
    key: "OPERATIONAL_CONTRACTS",
    label: "Contratos Operacionais",
    href: "/operational-contracts",
    icon: ClipboardList,
  },
  {
    key: "PATRIMONIAL_CONTRACTS",
    label: "Contratos Patrimoniais",
    href: "/patrimonial-contracts",
    icon: Scale,
  },
  { key: "PAYABLES", label: "Pagamentos", href: "/payables", icon: ReceiptText },
  { key: "FISCAL_DOCUMENTS", label: "Documentos Fiscais", href: "/fiscal-documents", icon: FileText },
  { key: "STOCK", label: "Movimentações", href: "/stock", icon: Package },
  { key: "MEASUREMENTS", label: "Medições", href: "/measurements", icon: ClipboardList },
  { key: "APPROVALS", label: "Aprovações", href: "/approvals", icon: Workflow },
  { key: "AUDIT_LOGS", label: "Auditoria", href: "/audit-logs", icon: ShieldCheck },
  { key: "INTEGRATIONS", label: "Integrações", href: "/integrations", icon: CircuitBoard },
  { key: "CUSTOM_FIELDS", label: "Campos Customizados", href: "/custom-fields", icon: Settings2 },
  { key: "BRANDING", label: "Branding", href: "/branding", icon: Settings2 },
  { key: "MODULE_CONFIGURATIONS", label: "Módulos", href: "/module-configurations", icon: Settings2 },
  { key: "STATUS_CONFIGURATIONS", label: "Status", href: "/status-configurations", icon: Settings2 },
  { key: "FORM_LAYOUTS", label: "Form Layout", href: "/form-layouts", icon: Settings2 },
  {
    key: "COMPANIES",
    label: "Super Admin",
    href: "/platform",
    icon: CircuitBoard,
    adminOnly: true,
  },
];
