"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function LogoutPage(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    void signOut({ redirect: false }).then(() => {
      router.replace("/login");
      router.refresh();
    });
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center text-sm text-[var(--muted-foreground)]">
      Encerrando sessão...
    </main>
  );
}
