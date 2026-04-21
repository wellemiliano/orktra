import { canApplyApprovalAction } from "@/modules/shared/server/approval-rules";

describe("approval transition rules", () => {
  it("allows approve/reject/return from pending", () => {
    expect(canApplyApprovalAction("PENDING", "APPROVE")).toBe(true);
    expect(canApplyApprovalAction("PENDING", "REJECT")).toBe(true);
    expect(canApplyApprovalAction("PENDING", "RETURN")).toBe(true);
  });

  it("blocks transitions from approved", () => {
    expect(canApplyApprovalAction("APPROVED", "APPROVE")).toBe(false);
    expect(canApplyApprovalAction("APPROVED", "RETURN")).toBe(false);
  });
});

