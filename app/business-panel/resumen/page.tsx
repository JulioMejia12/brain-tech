import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const monthlyStats = [
  { label: "Pedidos completados", value: "84", note: "Promedio de 12 por dia" },
  { label: "Ticket promedio", value: "$217", note: "Se mantiene estable" },
  { label: "Horas pico", value: "7:00 PM - 9:00 PM", note: "Hora con mas pedidos" },
];

const monthlyWeeks = [
  { day: "Sem 1", orders: 19 },
  { day: "Sem 2", orders: 24 },
  { day: "Sem 3", orders: 27 },
  { day: "Sem 4", orders: 31 },
  { day: "Sem 5", orders: 29 },
];

const revenueTrend = [42, 46, 51, 58, 64, 71, 79];

export default function BusinessPanelSummaryPage() {
  const highestOrders = Math.max(...monthlyWeeks.map((item) => item.orders));
  const chartPoints = revenueTrend
    .map((value, index) => {
      const x = 20 + index * 69;
      const y = 110 - ((value - 42) / (79 - 42)) * 70;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#111827] transition-colors duration-300 dark:bg-[#0F172A] dark:text-[#FFFFFF]">
      <div className="sticky top-0 z-40 border-b border-[#111827]/10 bg-[#F9FAFB] dark:border-[#FFFFFF]/10 dark:bg-[#1E293B]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div>
            <h1 className="mt-1 text-xl font-bold sm:text-3xl">Rendimiento mensual</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/business-panel"
              className="inline-flex items-center gap-2 rounded-md border border-[#111827]/15 bg-[#F9FAFB] px-3 py-2 text-xs font-semibold text-[#111827] shadow-sm transition hover:bg-[#111827]/5 dark:border-[#FFFFFF]/20 dark:bg-[#1E293B] dark:text-[#FFFFFF] dark:hover:bg-[#FFFFFF]/5 sm:text-sm"
            >
              Volver al panel
            </Link>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <section className="mb-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">Resumen del mes</h2>
              <p className="mt-2 text-sm text-[#111827]/65 dark:text-[#FFFFFF]/65 sm:text-base">
                Vista rapida del rendimiento comercial de los ultimos 30 dias.
              </p>
            </div>
            <span className="inline-flex items-center rounded-md bg-[#16A34A]/10 px-3 py-1.5 text-xs font-semibold text-[#166534] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D] sm:text-sm">
              Ultima actualizacion: hoy
            </span>
          </div>

          <article className="mb-4 rounded-xl border border-[#111827]/10 bg-[#F9FAFB] p-5 shadow-sm dark:border-[#FFFFFF]/10 dark:bg-[#1E293B] sm:p-6">
            <p className="text-[12px] font-bold leading-none text-[#111827] dark:text-[#FFFFFF] sm:text-lg">
              Ventas este mes
            </p>
            <p className="mt-3 text-[34px] font-extrabold leading-none text-[#166534] dark:text-[#F59E0B] sm:text-[46px]">
              $8,450
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#16A34A]/10 px-3 py-1.5 text-xs font-semibold text-[#166534] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D] sm:text-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
              </svg>
              +18% vs mes pasado
            </div>
          </article>

          <article className="mb-4 rounded-xl border border-[#111827]/10 bg-[#F9FAFB] p-4 shadow-sm dark:border-[#FFFFFF]/10 dark:bg-[#1E293B] sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="mt-1 text-[11px] text-[#111827]/65 dark:text-[#FFFFFF]/65 sm:text-sm">
                  Tendencia semanal de ventas estimadas
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#111827]/8 bg-[#FFFFFF] px-3 py-4 dark:border-[#FFFFFF]/10 dark:bg-[#0F172A] sm:px-4">
              <svg viewBox="0 0 316 130" className="h-36 w-full sm:h-40" preserveAspectRatio="none">
                <path d="M20 110H296" stroke="currentColor" className="text-[#111827]/12 dark:text-[#FFFFFF]/12" />
                <path d="M20 85H296" stroke="currentColor" className="text-[#111827]/8 dark:text-[#FFFFFF]/8" />
                <path d="M20 60H296" stroke="currentColor" className="text-[#111827]/8 dark:text-[#FFFFFF]/8" />
                <path d="M20 35H296" stroke="currentColor" className="text-[#111827]/8 dark:text-[#FFFFFF]/8" />
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={chartPoints}
                  className="text-[#16A34A] dark:text-[#F59E0B]"
                />
                {revenueTrend.map((value, index) => {
                  const x = 20 + index * 46;
                  const y = 110 - ((value - 42) / (79 - 42)) * 70;

                  return (
                    <circle
                      key={`${value}-${index}`}
                      cx={x}
                      cy={y}
                      r="3.5"
                      fill="currentColor"
                      className="text-[#16A34A] dark:text-[#F59E0B]"
                    />
                  );
                })}
              </svg>

              <div className="mt-3 grid grid-cols-7 gap-2 text-center">
                {monthlyWeeks.map((item) => (
                  <div key={item.day} className="text-[10px] font-semibold text-[#111827]/60 dark:text-[#FFFFFF]/60 sm:text-xs">
                    {item.day}
                  </div>
                ))}
              </div>
            </div>
          </article>

        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          <article className="rounded-xl border border-[#111827]/10 bg-[#F9FAFB] p-5 shadow-sm dark:border-[#FFFFFF]/10 dark:bg-[#1E293B] sm:p-6">
            <h3 className="mt-2 text-xl font-bold sm:text-2xl">Horas pico</h3>
            <p className="mt-4 text-sm font-medium text-[#111827]/65 dark:text-[#FFFFFF]/65 sm:text-base">
              Hora con mas pedidos:
            </p>
            <div className="mt-3 inline-flex items-center rounded-lg bg-[#16A34A]/10 px-4 py-3 text-base font-extrabold text-[#166534] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D] sm:text-2xl">
              7:00 PM - 9:00 PM
            </div>
          </article>

          <article className="rounded-xl border border-[#111827]/10 bg-[#F9FAFB] p-5 shadow-sm dark:border-[#FFFFFF]/10 dark:bg-[#1E293B] sm:p-6">
            <h3 className="text-xl font-bold sm:text-2xl">Productos más vendidos</h3>
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-[#111827]/8 bg-[#FFFFFF] px-3 py-3 dark:border-[#FFFFFF]/10 dark:bg-[#0F172A]">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#16A34A]/10 text-[#166534] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path d="M4 11h16" />
                    <path d="M6 15h12" />
                    <path d="M7 8a5 5 0 0 1 10 0" />
                    <path d="M5 15c0 2 1.5 4 3.5 4h7C17.5 19 19 17 19 15" />
                  </svg>
                </span>
                <p className="text-sm font-semibold text-[#111827] dark:text-[#FFFFFF] sm:text-base">Hamburguesa Clasica</p>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-[#111827]/8 bg-[#FFFFFF] px-3 py-3 dark:border-[#FFFFFF]/10 dark:bg-[#0F172A]">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#16A34A]/10 text-[#166534] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path d="M6 16c1.5-4 4-7 6-9 2 2 4.5 5 6 9" />
                    <path d="M5 18h14" />
                  </svg>
                </span>
                <p className="text-sm font-semibold text-[#111827] dark:text-[#FFFFFF] sm:text-base">Tacos al Pastor</p>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-[#111827]/8 bg-[#FFFFFF] px-3 py-3 dark:border-[#FFFFFF]/10 dark:bg-[#0F172A]">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#16A34A]/10 text-[#166534] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path d="M8 3h8" />
                    <path d="M10 3v5" />
                    <path d="M14 3v5" />
                    <path d="M7 8h10l-1 11H8L7 8Z" />
                  </svg>
                </span>
                <p className="text-sm font-semibold text-[#111827] dark:text-[#FFFFFF] sm:text-base">Limonada Natural</p>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-6">
          <article className="rounded-xl border border-[#111827]/10 bg-[#F9FAFB] p-5 shadow-sm dark:border-[#FFFFFF]/10 dark:bg-[#1E293B] sm:p-6">
            <p className="mt-4 text-sm font-medium text-[#111827]/65 dark:text-[#FFFFFF]/65 sm:text-base">
              Clientes recurrentes
            </p>
            <p className="mt-2 text-[34px] font-extrabold leading-none text-[#166534] dark:text-[#F59E0B] sm:text-[46px]">
              42%
            </p>
            <p className="mt-4 text-sm font-semibold text-[#166534] dark:text-[#FCD34D] sm:text-base">
              ⬆ +6% este mes
            </p>
          </article>
        </section>

        <section className="mt-6">
          <article className="rounded-xl border border-[#111827]/10 bg-[#F9FAFB] p-6 shadow-sm dark:border-[#FFFFFF]/10 dark:bg-[#1E293B] sm:p-7">
            <p className="text-lg font-semibold leading-tight text-[#111827] dark:text-[#FFFFFF] sm:text-2xl">
              Tu hamburguesa genera el 38% de tus pedidos.
            </p>
            <p className="mt-3 text-base font-medium text-[#166534] dark:text-[#FCD34D] sm:text-xl">
              Activa promoción y aumenta pedidos.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}