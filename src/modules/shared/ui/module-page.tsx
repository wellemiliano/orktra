"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCcw, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RESOURCE_META } from "@/modules/shared/config/resource-meta";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ModulePageProps = {
  resource: string;
};

type ApiResponse<T> = {
  data: T;
};

type GenericRecord = Record<string, unknown> & { id: string };

function parseFormValue(fieldKey: string, rawValue: string): unknown {
  if (!rawValue) {
    return undefined;
  }

  if (
    fieldKey.toLowerCase().includes("amount") ||
    fieldKey.toLowerCase().includes("quantity") ||
    fieldKey.toLowerCase().includes("stock")
  ) {
    return Number(rawValue);
  }

  if (fieldKey.toLowerCase().includes("date")) {
    return rawValue;
  }

  if (fieldKey === "enabled") {
    return rawValue === "true";
  }

  if (fieldKey === "payload" || fieldKey === "config" || fieldKey === "settings") {
    try {
      return JSON.parse(rawValue);
    } catch {
      return { raw: rawValue };
    }
  }

  return rawValue;
}

function renderCell(value: unknown, key: string): string {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "number") {
    if (key.toLowerCase().includes("amount") || key.toLowerCase().includes("total")) {
      return formatCurrency(value);
    }

    return String(value);
  }

  if (typeof value === "string") {
    if (key.toLowerCase().includes("date") || key === "createdAt" || key === "updatedAt") {
      return formatDate(value);
    }

    return value;
  }

  return JSON.stringify(value);
}

export function ModulePage({ resource }: ModulePageProps): JSX.Element {
  const meta = RESOURCE_META[resource];
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [selectedRecord, setSelectedRecord] = useState<GenericRecord | null>(null);
  const queryKey = useMemo(() => ["resource", resource], [resource]);

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(`/api/${resource}`);
      const data = (await response.json()) as ApiResponse<GenericRecord[]>;

      if (!response.ok) {
        throw new Error((data as unknown as { error?: string }).error ?? "Erro ao carregar.");
      }

      return data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await fetch(`/api/${resource}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? "Erro ao criar registro.");
      }
    },
    onSuccess: async () => {
      setFormState({});
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/${resource}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? "Erro ao remover.");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  const retryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/integrations/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "retry" }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? "Erro ao reprocessar.");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  if (!meta) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Módulo não encontrado</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{meta.title}</CardTitle>
          <CardDescription>{meta.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"
            onSubmit={(event) => {
              event.preventDefault();

              const payload = Object.fromEntries(
                meta.fields
                  .map((field) => [field.key, parseFormValue(field.key, formState[field.key] ?? "")])
                  .filter((entry) => entry[1] !== undefined),
              );

              createMutation.mutate(payload);
            }}
          >
            {meta.fields.map((field) => (
              <div key={field.key} className="space-y-1">
                <Label htmlFor={`${resource}-${field.key}`}>
                  {field.label}
                  {field.required ? " *" : ""}
                </Label>
                {field.type === "select" ? (
                  <Select
                    id={`${resource}-${field.key}`}
                    value={formState[field.key] ?? ""}
                    onChange={(event) =>
                      setFormState((previous) => ({ ...previous, [field.key]: event.target.value }))
                    }
                  >
                    <option value="">Selecione</option>
                    {(field.options ?? []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    id={`${resource}-${field.key}`}
                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    value={formState[field.key] ?? ""}
                    onChange={(event) =>
                      setFormState((previous) => ({ ...previous, [field.key]: event.target.value }))
                    }
                    required={field.required}
                  />
                )}
              </div>
            ))}
            <div className="flex items-end gap-2">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Criar Registro
              </Button>
            </div>
          </form>
          {createMutation.error ? (
            <p className="text-sm text-[#C0392B]">{(createMutation.error as Error).message}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Registros</CardTitle>
            <CardDescription>Listagem limitada a 100 itens por consulta.</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => query.refetch()}
            disabled={query.isFetching}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <div className="flex h-32 items-center justify-center text-sm text-[var(--muted-foreground)]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando...
            </div>
          ) : query.error ? (
            <p className="text-sm text-[#C0392B]">{(query.error as Error).message}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {meta.columns.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(query.data ?? []).map((item) => (
                  <TableRow key={item.id} onClick={() => setSelectedRecord(item)} className="cursor-pointer">
                    {meta.columns.map((column) => (
                      <TableCell key={`${item.id}-${column}`}>
                        {renderCell(item[column], column)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {resource === "integrations" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={retryMutation.isPending}
                            onClick={() => retryMutation.mutate(item.id)}
                          >
                            Retry
                          </Button>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deleteMutation.isPending}
                          onClick={() => deleteMutation.mutate(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-[#C0392B]" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedRecord ? (
        <Card>
          <CardHeader>
            <CardTitle>Detalhe do Registro</CardTitle>
            <CardDescription>ID: {selectedRecord.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="resumo">
              <TabsList>
                <TabsTrigger value="resumo">Resumo</TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
                <TabsTrigger value="anexos">Anexos</TabsTrigger>
                <TabsTrigger value="auditoria">Auditoria</TabsTrigger>
                <TabsTrigger value="vinculos">Vínculos</TabsTrigger>
              </TabsList>

              <TabsContent value="resumo" className="mt-4">
                <div className="grid gap-2 md:grid-cols-2">
                  {Object.entries(selectedRecord).map(([key, value]) => (
                    <div key={key} className="rounded-md border border-[var(--border)] p-3">
                      <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                        {key}
                      </p>
                      <p className="text-sm">{renderCell(value, key)}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="historico" className="mt-4 text-sm text-[var(--muted-foreground)]">
                Trilha de histórico disponível via módulo de auditoria e fluxo de aprovação.
              </TabsContent>

              <TabsContent value="anexos" className="mt-4 text-sm text-[var(--muted-foreground)]">
                Upload e gestão de anexos estão prontos para o fluxo operacional deste módulo.
              </TabsContent>

              <TabsContent value="auditoria" className="mt-4 text-sm text-[var(--muted-foreground)]">
                Consulte logs completos em Auditoria para alterações CREATE, UPDATE, DELETE e CONFIG_CHANGE.
              </TabsContent>

              <TabsContent value="vinculos" className="mt-4 text-sm text-[var(--muted-foreground)]">
                Vínculos com contratos, documentos, pagamentos e medições seguem regras tenant-aware.
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
