import { prisma } from "@/server/db/prisma";
import { requirePermission } from "@/server/tenant/context";
import { handleApiError } from "@/server/tenant/http";

type DashboardType = "executive" | "financial" | "contracts" | "stock" | "approvals";

function getType(search: URLSearchParams): DashboardType {
  const type = search.get("type");

  if (
    type === "financial" ||
    type === "contracts" ||
    type === "stock" ||
    type === "approvals"
  ) {
    return type;
  }

  return "executive";
}

export async function GET(request: Request): Promise<Response> {
  try {
    const context = await requirePermission("DASHBOARDS", "view");
    const type = getType(new URL(request.url).searchParams);

    if (!context.currentCompanyId) {
      return Response.json({
        type,
        cards: [],
        charts: [],
      });
    }

    const companyId = context.currentCompanyId;
    const unitClause = context.currentUnitId ? { unitId: context.currentUnitId } : {};

    const [openPayables, overduePayables, pendingApprovals, activeContracts, lowStock, fiscalBacklog] =
      await Promise.all([
        prisma.payable.count({
          where: {
            companyId,
            ...unitClause,
            status: { in: ["OPEN", "DUE_SOON"] },
          },
        }),
        prisma.payable.count({
          where: {
            companyId,
            ...unitClause,
            status: "OVERDUE",
          },
        }),
        prisma.approvalFlow.count({
          where: {
            companyId,
            status: "PENDING",
          },
        }),
        prisma.operationalContract.count({
          where: {
            companyId,
            ...unitClause,
            status: "ACTIVE",
          },
        }),
        prisma.stockBalance.count({
          where: {
            companyId,
            ...unitClause,
            quantity: {
              lte: 20,
            },
          },
        }),
        prisma.fiscalDocument.count({
          where: {
            companyId,
            ...unitClause,
            status: {
              in: ["DRAFT", "RECEIVED"],
            },
          },
        }),
      ]);

    const totalOpenAmountAggregate = await prisma.payable.aggregate({
      where: {
        companyId,
        ...unitClause,
        status: { in: ["OPEN", "DUE_SOON", "OVERDUE"] },
      },
      _sum: {
        amount: true,
      },
    });

    const totalOpenAmount = Number(totalOpenAmountAggregate._sum.amount ?? 0);

    const payload = {
      type,
      cards: [
        { id: "open-payables", label: "Pagáveis em Aberto", value: openPayables },
        { id: "open-amount", label: "Valor em Aberto", value: totalOpenAmount },
        { id: "overdue", label: "Atrasados", value: overduePayables },
        { id: "contracts", label: "Contratos Ativos", value: activeContracts },
        { id: "approvals", label: "Aprovações Pendentes", value: pendingApprovals },
        { id: "stock-alert", label: "Alertas de Estoque", value: lowStock },
        { id: "fiscal-backlog", label: "Fiscal em Backlog", value: fiscalBacklog },
      ],
      charts: [
        {
          id: "approvalStatus",
          values: [
            { name: "Pendentes", value: pendingApprovals },
            { name: "Atrasados", value: overduePayables },
            { name: "Alertas Estoque", value: lowStock },
          ],
        },
      ],
    };

    return Response.json(payload);
  } catch (error) {
    return handleApiError(error);
  }
}

