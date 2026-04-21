import type { ApprovalActionType, ApprovalStatus } from "@prisma/client";

const transitions: Record<ApprovalStatus, ApprovalActionType[]> = {
  PENDING: ["APPROVE", "REJECT", "RETURN"],
  APPROVED: [],
  REJECTED: [],
  RETURNED: ["APPROVE", "REJECT"],
};

export function canApplyApprovalAction(
  status: ApprovalStatus,
  action: ApprovalActionType,
): boolean {
  return transitions[status].includes(action);
}

