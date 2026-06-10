export default function OfflinePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <h1 className="text-2xl font-bold">Você está offline</h1>
      <p className="text-ink-muted text-sm">
        Conecte-se à internet para ver as últimas notícias.
      </p>
    </main>
  );
}
