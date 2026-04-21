import { cookies } from "next/headers";

const COOKIE_NAME = "orktra_ctx";

type ContextCookie = {
  companyId: string | null;
  unitId: string | null;
};

export async function getContextFromCookie(): Promise<ContextCookie> {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(COOKIE_NAME)?.value;

  if (!rawValue) {
    return {
      companyId: null,
      unitId: null,
    };
  }

  try {
    const parsed = JSON.parse(rawValue) as ContextCookie;

    return {
      companyId: parsed.companyId ?? null,
      unitId: parsed.unitId ?? null,
    };
  } catch {
    return {
      companyId: null,
      unitId: null,
    };
  }
}

export async function setContextCookie(payload: ContextCookie): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_NAME,
    value: JSON.stringify(payload),
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
}

