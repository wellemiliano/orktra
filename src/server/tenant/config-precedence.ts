type ScopedConfig<T> = {
  scope: "GLOBAL" | "TENANT";
  companyId?: string | null;
  payload: T;
};

export function resolveConfigPrecedence<T>(params: {
  companyId: string | null;
  globalConfig: T | null;
  tenantConfig: T | null;
}): T | null {
  const { tenantConfig, globalConfig } = params;

  if (tenantConfig) {
    return tenantConfig;
  }

  return globalConfig;
}

export function getScopedConfigPayload<T>(params: {
  companyId: string | null;
  configs: ScopedConfig<T>[];
}): T | null {
  const tenant = params.configs.find(
    (config) => config.scope === "TENANT" && config.companyId === params.companyId,
  );
  const global = params.configs.find((config) => config.scope === "GLOBAL");

  return resolveConfigPrecedence({
    companyId: params.companyId,
    tenantConfig: tenant?.payload ?? null,
    globalConfig: global?.payload ?? null,
  });
}

