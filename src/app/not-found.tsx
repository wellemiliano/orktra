export default function NotFoundPage(): JSX.Element {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <h1 className="text-2xl font-semibold">Página não encontrada</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          O recurso solicitado não existe no contexto atual.
        </p>
      </div>
    </main>
  );
}
