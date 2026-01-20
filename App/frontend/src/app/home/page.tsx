export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-rose-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 pb-12 pt-4 sm:pt-8 lg:pt-12">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            Vasvani App
          </p>
          <h1 className="text-4xl font-semibold text-slate-900">
            Panel principal
          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            Esta vista esta en construccion. Pronto veras un resumen con los
            pedidos recientes y accesos rapidos.
          </p>
        </header>
        <div className="rounded-3xl border border-dashed border-amber-200 bg-white/80 p-10 text-center shadow-[0_24px_80px_-60px_rgba(15,23,42,0.4)]">
          <p className="text-lg font-semibold text-slate-800">
            Vista en desarrollo
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Aqui mostraremos el resumen de pedidos, accesos rapidos y
            notificaciones clave.
          </p>
        </div>
      </div>
      <a
        className="fixed bottom-6 right-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-2xl font-semibold text-white shadow-[0_18px_45px_-20px_rgba(15,23,42,0.9)] transition hover:-translate-y-0.5 hover:bg-slate-800"
        href="/orders"
        aria-label="Agregar pedido"
        title="Agregar pedido"
      >
        +
      </a>
    </div>
  );
}
