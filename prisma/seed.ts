import { PrismaClient, PlatformRole, TenantRoleCode, ModuleKey, ConfigScope, CustomFieldType, ContractStatus, RecurrencePeriod, PayableOriginType, PayableStatus, FiscalDocumentStatus, StockMovementType, MeasurementStatus, ApprovalStatus, ApprovalActionType, AuditAction, IntegrationConnector, IntegrationStatus, QueueStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const demoPassword = process.env.ORKTRA_DEMO_PASSWORD ?? "123456";
  const passwordHash = await bcrypt.hash(demoPassword, 10);

  await prisma.approvalAction.deleteMany();
  await prisma.approvalFlow.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.syncQueue.deleteMany();
  await prisma.integrationLog.deleteMany();
  await prisma.integrationConnection.deleteMany();
  await prisma.customFieldValue.deleteMany();
  await prisma.customFieldDefinition.deleteMany();
  await prisma.moduleConfiguration.deleteMany();
  await prisma.statusConfiguration.deleteMany();
  await prisma.formLayout.deleteMany();
  await prisma.tenantBranding.deleteMany();
  await prisma.payable.deleteMany();
  await prisma.measurement.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.stockBalance.deleteMany();
  await prisma.fiscalDocumentItem.deleteMany();
  await prisma.fiscalDocument.deleteMany();
  await prisma.operationalContract.deleteMany();
  await prisma.patrimonialContract.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.product.deleteMany();
  await prisma.costCenter.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.role.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  const roles = await Promise.all(
    Object.values(TenantRoleCode).map((code) =>
      prisma.role.create({
        data: {
          code,
          label: code,
          description: `Perfil ${code}`,
        },
      }),
    ),
  );

  const roleByCode = Object.fromEntries(roles.map((role) => [role.code, role]));

  const [companyA, companyB] = await Promise.all([
    prisma.company.create({
      data: {
        name: "Orktra Energia S.A.",
        slug: "orktra-energia",
        cnpj: "12.345.678/0001-90",
        plan: "enterprise",
        licenseMetadata: { users: 120, modules: "full" },
      },
    }),
    prisma.company.create({
      data: {
        name: "Nova Malha Logística Ltda",
        slug: "nova-malha",
        cnpj: "98.765.432/0001-11",
        plan: "business",
        licenseMetadata: { users: 60, modules: "core" },
      },
    }),
  ]);

  const [unitA1, unitA2, unitB1] = await Promise.all([
    prisma.unit.create({
      data: {
        companyId: companyA.id,
        code: "U-BHZ",
        name: "Unidade Belo Horizonte",
      },
    }),
    prisma.unit.create({
      data: {
        companyId: companyA.id,
        code: "U-VIX",
        name: "Unidade Vitória",
      },
    }),
    prisma.unit.create({
      data: {
        companyId: companyB.id,
        code: "U-CWB",
        name: "Unidade Curitiba",
      },
    }),
  ]);

  await prisma.unit.create({
    data: {
      companyId: companyB.id,
      code: "U-POA",
      name: "Unidade Porto Alegre",
    },
  });

  const [superAdmin, adminA, financeA, opsA, auditorA, adminB] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Super Admin",
        email: "superadmin@orktra.local",
        passwordHash,
        platformRole: PlatformRole.SUPER_ADMIN_PLATFORM,
      },
    }),
    prisma.user.create({
      data: {
        name: "Admin Empresa A",
        email: "admin.a@orktra.local",
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        name: "Financeiro A",
        email: "financeiro.a@orktra.local",
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        name: "Operações A",
        email: "operacoes.a@orktra.local",
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        name: "Auditor A",
        email: "auditor.a@orktra.local",
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        name: "Admin Empresa B",
        email: "admin.b@orktra.local",
        passwordHash,
      },
    }),
  ]);

  await prisma.userRole.createMany({
    data: [
      {
        userId: superAdmin.id,
        companyId: companyA.id,
        unitId: unitA1.id,
        roleId: roleByCode.ADMIN_EMPRESA.id,
        isDefault: true,
      },
      {
        userId: superAdmin.id,
        companyId: companyB.id,
        unitId: unitB1.id,
        roleId: roleByCode.ADMIN_EMPRESA.id,
      },
      {
        userId: adminA.id,
        companyId: companyA.id,
        unitId: unitA1.id,
        roleId: roleByCode.ADMIN_EMPRESA.id,
        isDefault: true,
      },
      {
        userId: financeA.id,
        companyId: companyA.id,
        unitId: unitA1.id,
        roleId: roleByCode.FINANCEIRO.id,
        isDefault: true,
      },
      {
        userId: opsA.id,
        companyId: companyA.id,
        unitId: unitA1.id,
        roleId: roleByCode.OPERACOES.id,
        isDefault: true,
      },
      {
        userId: auditorA.id,
        companyId: companyA.id,
        unitId: unitA2.id,
        roleId: roleByCode.AUDITOR.id,
        isDefault: true,
      },
      {
        userId: adminB.id,
        companyId: companyB.id,
        unitId: unitB1.id,
        roleId: roleByCode.ADMIN_EMPRESA.id,
        isDefault: true,
      },
    ],
  });

  const supplierEnergy = await prisma.supplier.create({
    data: {
      companyId: companyA.id,
      name: "Energiza Serviços Integrados",
      document: "44.555.666/0001-22",
      email: "contato@energiza.com.br",
      phone: "+55 31 3333-9999",
    },
  });

  await prisma.supplier.create({
    data: {
      companyId: companyB.id,
      name: "LogPrime Transportes",
      document: "11.222.333/0001-55",
      email: "financeiro@logprime.com.br",
      phone: "+55 41 4000-2200",
    },
  });

  const [costCenterOps, costCenterInfra] = await Promise.all([
    prisma.costCenter.create({
      data: {
        companyId: companyA.id,
        code: "CC-OPS",
        name: "Centro de Custo Operações",
      },
    }),
    prisma.costCenter.create({
      data: {
        companyId: companyA.id,
        code: "CC-INFRA",
        name: "Centro de Custo Infraestrutura",
      },
    }),
  ]);

  const [productCable, productFilter, productFuel] = await Promise.all([
    prisma.product.create({
      data: {
        companyId: companyA.id,
        sku: "CAB-001",
        name: "Cabo de Energia 10mm",
        unitMeasure: "metro",
        minStock: 100,
      },
    }),
    prisma.product.create({
      data: {
        companyId: companyA.id,
        sku: "FLT-010",
        name: "Filtro Industrial",
        unitMeasure: "unidade",
        minStock: 30,
      },
    }),
    prisma.product.create({
      data: {
        companyId: companyB.id,
        sku: "COMB-001",
        name: "Combustível Diesel S10",
        unitMeasure: "litro",
        minStock: 500,
      },
    }),
  ]);

  const [warehouseA1, warehouseB1] = await Promise.all([
    prisma.warehouse.create({
      data: {
        companyId: companyA.id,
        unitId: unitA1.id,
        code: "WH-BHZ-01",
        name: "Almoxarifado BHZ",
      },
    }),
    prisma.warehouse.create({
      data: {
        companyId: companyB.id,
        unitId: unitB1.id,
        code: "WH-CWB-01",
        name: "Armazém Curitiba",
      },
    }),
  ]);

  await prisma.warehouse.create({
    data: {
      companyId: companyA.id,
      unitId: unitA2.id,
      code: "WH-VIX-01",
      name: "Almoxarifado Vitória",
    },
  });

  await prisma.stockBalance.createMany({
    data: [
      {
        companyId: companyA.id,
        unitId: unitA1.id,
        warehouseId: warehouseA1.id,
        productId: productCable.id,
        quantity: 280,
      },
      {
        companyId: companyA.id,
        unitId: unitA1.id,
        warehouseId: warehouseA1.id,
        productId: productFilter.id,
        quantity: 18,
      },
      {
        companyId: companyB.id,
        unitId: unitB1.id,
        warehouseId: warehouseB1.id,
        productId: productFuel.id,
        quantity: 1100,
      },
    ],
  });

  const operationalContract = await prisma.operationalContract.create({
    data: {
      companyId: companyA.id,
      unitId: unitA1.id,
      supplierId: supplierEnergy.id,
      costCenterId: costCenterOps.id,
      code: "OP-2026-001",
      title: "Contrato de Manutenção Elétrica",
      description: "Serviço recorrente de manutenção preventiva e corretiva.",
      status: ContractStatus.ACTIVE,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      baseAmount: 18500,
      recurrence: RecurrencePeriod.MONTHLY,
      adjustmentIndex: "IPCA",
    },
  });

  await prisma.patrimonialContract.create({
    data: {
      companyId: companyA.id,
      unitId: unitA2.id,
      supplierId: supplierEnergy.id,
      costCenterId: costCenterInfra.id,
      code: "PT-2026-002",
      title: "Arrendamento de Área Técnica",
      description: "Contrato patrimonial de longo prazo para instalação técnica.",
      status: ContractStatus.ACTIVE,
      startDate: new Date("2026-01-15"),
      endDate: new Date("2031-01-14"),
      baseAmount: 54000,
      recurrence: RecurrencePeriod.YEARLY,
      anniversaryDate: new Date("2026-01-15"),
    },
  });

  const fiscalDocument = await prisma.fiscalDocument.create({
    data: {
      companyId: companyA.id,
      unitId: unitA1.id,
      supplierId: supplierEnergy.id,
      operationalContractId: operationalContract.id,
      documentNumber: "NF-100245",
      series: "1",
      issueDate: new Date("2026-03-10"),
      totalAmount: 19500,
      status: FiscalDocumentStatus.CLASSIFIED,
      notes: "Nota fiscal vinculada ao contrato operacional.",
      fileUrl: "/uploads/fiscal/nf-100245.pdf",
      items: {
        create: [
          {
            productId: productCable.id,
            description: "Cabo de Energia 10mm",
            quantity: 150,
            unitPrice: 22,
            total: 3300,
          },
          {
            description: "Serviço de manutenção elétrica",
            quantity: 1,
            unitPrice: 16200,
            total: 16200,
          },
        ],
      },
    },
  });

  await prisma.stockMovement.create({
    data: {
      companyId: companyA.id,
      unitId: unitA1.id,
      productId: productCable.id,
      movementType: StockMovementType.IN,
      quantity: 150,
      targetWarehouseId: warehouseA1.id,
      fiscalDocumentId: fiscalDocument.id,
      reference: "Entrada NF-100245",
    },
  });

  const measurement = await prisma.measurement.create({
    data: {
      companyId: companyA.id,
      unitId: unitA1.id,
      supplierId: supplierEnergy.id,
      operationalContractId: operationalContract.id,
      fiscalDocumentId: fiscalDocument.id,
      code: "MED-2026-011",
      description: "Medição mensal de manutenção elétrica - Março",
      measuredAmount: 19000,
      billedAmount: 19500,
      paidAmount: 0,
      status: MeasurementStatus.SUBMITTED,
      referenceDate: new Date("2026-03-31"),
    },
  });

  const payable = await prisma.payable.create({
    data: {
      companyId: companyA.id,
      unitId: unitA1.id,
      supplierId: supplierEnergy.id,
      code: "PAG-2026-033",
      description: "Pagamento manutenção elétrica março",
      amount: 19500,
      dueDate: new Date("2026-04-20"),
      forecastPaymentDate: new Date("2026-04-19"),
      status: PayableStatus.OPEN,
      originType: PayableOriginType.FISCAL_DOCUMENT,
      originReference: "NF-100245",
      operationalContractId: operationalContract.id,
      fiscalDocumentId: fiscalDocument.id,
      measurementId: measurement.id,
    },
  });

  const approvalFlow = await prisma.approvalFlow.create({
    data: {
      companyId: companyA.id,
      unitId: unitA1.id,
      sourceModule: ModuleKey.PAYABLES,
      sourceEntityId: payable.id,
      status: ApprovalStatus.PENDING,
      requestedById: financeA.id,
    },
  });

  await prisma.approvalAction.create({
    data: {
      approvalFlowId: approvalFlow.id,
      userId: adminA.id,
      action: ApprovalActionType.APPROVE,
      comment: "Aprovado para pagamento na próxima janela financeira.",
    },
  });

  await prisma.approvalFlow.update({
    where: { id: approvalFlow.id },
    data: {
      status: ApprovalStatus.APPROVED,
      decidedAt: new Date(),
    },
  });

  const connection = await prisma.integrationConnection.create({
    data: {
      companyId: companyA.id,
      name: "Protheus Mock Primário",
      connector: IntegrationConnector.PROTHEUS_MOCK,
      status: IntegrationStatus.ACTIVE,
      settings: {
        endpoint: "mock://protheus",
        tenant: "orktra-energia",
      },
    },
  });

  const queue = await prisma.syncQueue.create({
    data: {
      companyId: companyA.id,
      connectionId: connection.id,
      eventType: "PAYABLE_CREATED",
      payload: {
        payableId: payable.id,
        amount: payable.amount,
      },
      status: QueueStatus.FAILED,
      retryCount: 1,
      maxRetries: 3,
      lastError: "Timeout no mock connector",
    },
  });

  await prisma.integrationLog.createMany({
    data: [
      {
        companyId: companyA.id,
        connectionId: connection.id,
        syncQueueId: queue.id,
        status: QueueStatus.FAILED,
        requestPayload: { event: "PAYABLE_CREATED" },
        responsePayload: { status: "timeout" },
        errorMessage: "Timeout no mock connector",
        attempt: 1,
      },
      {
        companyId: companyA.id,
        connectionId: connection.id,
        syncQueueId: queue.id,
        status: QueueStatus.SUCCESS,
        requestPayload: { event: "PAYABLE_CREATED" },
        responsePayload: { status: "ok", externalId: "ERP-7781" },
        attempt: 2,
      },
    ],
  });

  await prisma.syncQueue.update({
    where: { id: queue.id },
    data: {
      status: QueueStatus.SUCCESS,
      retryCount: 2,
      processedAt: new Date(),
      lastError: null,
    },
  });

  await prisma.tenantBranding.createMany({
    data: [
      {
        scope: ConfigScope.GLOBAL,
        primaryColor: "#0E4759",
        secondaryColor: "#26788C",
        darkColor: "#202932",
        neutralColor: "#5A6672",
        lightBgColor: "#F0F6F8",
      },
      {
        scope: ConfigScope.TENANT,
        companyId: companyA.id,
        companyName: companyA.name,
        logoUrl: "/branding/orktra-energia.svg",
        primaryColor: "#0E4759",
        secondaryColor: "#26788C",
        darkColor: "#202932",
        neutralColor: "#5A6672",
        lightBgColor: "#F0F6F8",
      },
      {
        scope: ConfigScope.TENANT,
        companyId: companyB.id,
        companyName: companyB.name,
        logoUrl: "/branding/nova-malha.svg",
        primaryColor: "#12384A",
        secondaryColor: "#2E8AA1",
        darkColor: "#202932",
        neutralColor: "#5A6672",
        lightBgColor: "#F0F6F8",
      },
    ],
  });

  await prisma.moduleConfiguration.createMany({
    data: [
      {
        scope: ConfigScope.GLOBAL,
        module: ModuleKey.INTEGRATIONS,
        featureKey: "mock_sync_enabled",
        enabled: true,
        settings: { mode: "mock-only" },
      },
      {
        scope: ConfigScope.TENANT,
        companyId: companyA.id,
        module: ModuleKey.PAYABLES,
        featureKey: "approval_required",
        enabled: true,
      },
      {
        scope: ConfigScope.TENANT,
        companyId: companyB.id,
        module: ModuleKey.MEASUREMENTS,
        featureKey: "module_enabled",
        enabled: false,
      },
    ],
  });

  await prisma.statusConfiguration.createMany({
    data: [
      {
        scope: ConfigScope.GLOBAL,
        module: ModuleKey.PAYABLES,
        key: "UNDER_ANALYSIS",
        label: "Em análise",
        color: "#26788C",
      },
      {
        scope: ConfigScope.TENANT,
        companyId: companyA.id,
        module: ModuleKey.APPROVALS,
        key: "ON_HOLD",
        label: "Em espera",
        color: "#E2A03F",
      },
    ],
  });

  await prisma.formLayout.createMany({
    data: [
      {
        scope: ConfigScope.GLOBAL,
        module: ModuleKey.OPERATIONAL_CONTRACTS,
        name: "default",
        isDefault: true,
        config: {
          sections: [
            { title: "Resumo", fields: ["code", "title", "status"] },
            { title: "Financeiro", fields: ["baseAmount", "recurrence"] },
          ],
          listColumns: ["code", "title", "status", "baseAmount"],
          filters: ["status", "unitId", "supplierId"],
        },
      },
      {
        scope: ConfigScope.TENANT,
        companyId: companyA.id,
        module: ModuleKey.PAYABLES,
        name: "finance-default",
        isDefault: true,
        config: {
          sections: [
            { title: "Dados", fields: ["code", "description", "amount"] },
            { title: "Prazo", fields: ["dueDate", "forecastPaymentDate"] },
          ],
          listColumns: ["code", "amount", "status", "dueDate"],
          filters: ["status", "supplierId", "unitId"],
        },
      },
    ],
  });

  const [customFieldGlobal, customFieldTenant] = await Promise.all([
    prisma.customFieldDefinition.create({
      data: {
        scope: ConfigScope.GLOBAL,
        module: ModuleKey.SUPPLIERS,
        key: "supplier_segment",
        label: "Segmento do Fornecedor",
        type: CustomFieldType.SELECT,
        options: ["Energia", "Logística", "Facilities", "TI"],
        isFilterable: true,
        isListable: true,
      },
    }),
    prisma.customFieldDefinition.create({
      data: {
        scope: ConfigScope.TENANT,
        companyId: companyA.id,
        module: ModuleKey.PAYABLES,
        key: "criticality_level",
        label: "Nível de Criticidade",
        type: CustomFieldType.SELECT,
        options: ["Baixa", "Média", "Alta", "Crítica"],
        isRequired: true,
        isFilterable: true,
        isListable: true,
      },
    }),
  ]);

  await prisma.customFieldValue.createMany({
    data: [
      {
        companyId: companyA.id,
        customFieldDefinitionId: customFieldGlobal.id,
        entityModule: ModuleKey.SUPPLIERS,
        entityId: supplierEnergy.id,
        value: "Energia",
      },
      {
        companyId: companyA.id,
        unitId: unitA1.id,
        customFieldDefinitionId: customFieldTenant.id,
        entityModule: ModuleKey.PAYABLES,
        entityId: payable.id,
        value: "Alta",
      },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      {
        companyId: companyA.id,
        unitId: unitA1.id,
        userId: financeA.id,
        module: ModuleKey.PAYABLES,
        entity: "Payable",
        entityId: payable.id,
        action: AuditAction.CREATE,
        newValues: {
          code: payable.code,
          amount: payable.amount,
          status: payable.status,
        },
        origin: "api/payables",
      },
      {
        companyId: companyA.id,
        unitId: unitA1.id,
        userId: adminA.id,
        module: ModuleKey.APPROVALS,
        entity: "ApprovalFlow",
        entityId: approvalFlow.id,
        action: AuditAction.APPROVE,
        oldValues: { status: ApprovalStatus.PENDING },
        newValues: { status: ApprovalStatus.APPROVED },
        origin: "api/approvals",
      },
      {
        companyId: companyA.id,
        userId: superAdmin.id,
        module: ModuleKey.BRANDING,
        entity: "TenantBranding",
        entityId: companyA.id,
        action: AuditAction.CONFIG_CHANGE,
        oldValues: { primaryColor: "#0E4759" },
        newValues: { primaryColor: "#0E4759", secondaryColor: "#26788C" },
        origin: "platform/branding",
      },
      {
        companyId: companyA.id,
        userId: superAdmin.id,
        module: ModuleKey.INTEGRATIONS,
        entity: "SyncQueue",
        entityId: queue.id,
        action: AuditAction.SYNC,
        oldValues: { status: QueueStatus.FAILED, retryCount: 1 },
        newValues: { status: QueueStatus.SUCCESS, retryCount: 2 },
        origin: "integrations/mock",
      },
    ],
  });

  console.log("Seed concluído com sucesso.");
  console.log("Usuários de acesso:");
  console.log("superadmin@orktra.local");
  console.log("admin.a@orktra.local");
  console.log("financeiro.a@orktra.local");
  console.log("Senha padrão:", demoPassword);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

