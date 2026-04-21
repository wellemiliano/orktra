import type { StockMovementType } from "@prisma/client";

export function computeStockBalance(params: {
  current: number;
  movementType: StockMovementType;
  quantity: number;
}): number {
  if (params.movementType === "IN" || params.movementType === "ADJUSTMENT") {
    return params.current + params.quantity;
  }

  if (params.movementType === "TRANSFER" || params.movementType === "OUT") {
    return params.current - params.quantity;
  }

  return params.current;
}

export function isStockBalanceValid(nextBalance: number): boolean {
  return nextBalance >= 0;
}

