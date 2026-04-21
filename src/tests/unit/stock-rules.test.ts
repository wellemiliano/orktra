import { computeStockBalance, isStockBalanceValid } from "@/modules/shared/server/stock-rules";

describe("stock movement balance rules", () => {
  it("increments balance for IN", () => {
    const next = computeStockBalance({
      current: 100,
      movementType: "IN",
      quantity: 20,
    });

    expect(next).toBe(120);
    expect(isStockBalanceValid(next)).toBe(true);
  });

  it("invalidates negative balance", () => {
    const next = computeStockBalance({
      current: 10,
      movementType: "OUT",
      quantity: 25,
    });

    expect(isStockBalanceValid(next)).toBe(false);
  });
});

