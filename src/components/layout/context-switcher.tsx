"use client";

import { useMemo, useState } from "react";
import { Select } from "@/components/ui/select";

type Membership = {
  companyId: string;
  companyName: string;
  unitId: string | null;
  unitName: string | null;
  roleCode: string;
};

type ContextSwitcherProps = {
  memberships: Membership[];
  currentCompanyId: string | null;
  currentUnitId: string | null;
};

export function ContextSwitcher({
  memberships,
  currentCompanyId,
  currentUnitId,
}: ContextSwitcherProps): JSX.Element {
  const [selectedCompanyId, setSelectedCompanyId] = useState(currentCompanyId ?? "");
  const [selectedUnitId, setSelectedUnitId] = useState(currentUnitId ?? "");
  const [loading, setLoading] = useState(false);

  const companyOptions = useMemo(() => {
    const map = new Map<string, string>();

    memberships.forEach((membership) => {
      map.set(membership.companyId, membership.companyName);
    });

    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [memberships]);

  const unitOptions = useMemo(
    () =>
      memberships
        .filter((membership) => membership.companyId === selectedCompanyId)
        .map((membership) => ({
          id: membership.unitId ?? "none",
          name: membership.unitName ?? "Todas as unidades",
        })),
    [memberships, selectedCompanyId],
  );

  async function handleCompanyChange(companyId: string): Promise<void> {
    setLoading(true);
    setSelectedCompanyId(companyId);

    await fetch("/api/auth/session-context/company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId }),
    });

    window.location.reload();
  }

  async function handleUnitChange(unitId: string): Promise<void> {
    setLoading(true);
    setSelectedUnitId(unitId);

    await fetch("/api/auth/session-context/unit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unitId: unitId === "none" ? null : unitId }),
    });

    window.location.reload();
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <Select
        disabled={loading}
        value={selectedCompanyId}
        onChange={(event) => {
          void handleCompanyChange(event.target.value);
        }}
      >
        {companyOptions.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </Select>

      <Select
        disabled={loading}
        value={selectedUnitId || "none"}
        onChange={(event) => {
          void handleUnitChange(event.target.value);
        }}
      >
        <option value="none">Todas as unidades</option>
        {unitOptions.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.name}
          </option>
        ))}
      </Select>
    </div>
  );
}

