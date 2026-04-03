import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Page() {
  const premiumButton = "rounded-xl bg-[#16A34A] px-5 py-2.5 font-medium text-white transition hover:opacity-90 dark:bg-[#F59E0B] dark:text-[#111827]";
  const techButton = "rounded-xl border border-[#16A34A] bg-transparent px-5 py-2.5 font-medium text-[#16A34A] transition hover:bg-[#16A34A]/10 dark:border-[#F59E0B] dark:text-[#F59E0B] dark:hover:bg-[#F59E0B]/15";

  return (
    <main className="min-h-screen bg-[#FFFFFF] px-4 py-6 text-[#111827] transition-colors duration-300 dark:bg-[#0F172A] dark:text-[#FFFFFF] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between rounded-2xl border border-[#111827]/10 bg-[#F9FAFB] px-4 py-3 shadow-sm dark:border-[#FFFFFF]/15 dark:bg-[#1E293B]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#16A34A] dark:text-[#F59E0B]">Restaurant product</p>
            <h1 className="text-2xl font-bold sm:text-3xl">Ruta comercial para restaurantes</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/demo" className={premiumButton}>Ver demo</Link>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-[2rem] border border-[#111827]/10 bg-[#F9FAFB] p-6 shadow-sm dark:border-[#FFFFFF]/15 dark:bg-[#1E293B] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#16A34A] dark:text-[#F59E0B]">Restaurant landing</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight">Convierte visitas en pedidos</h2>
            <p className="mt-4 text-base leading-7">
              Esta ruta puede vivir como pagina comercial para restaurantes: beneficios, planes y una llamada clara para ver el producto funcionando.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/demo" className={premiumButton}>Abrir demo</Link>
              <Link href="/" className={techButton}>Volver a landing</Link>
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#111827]/10 bg-[#F9FAFB] p-6 shadow-sm dark:border-[#FFFFFF]/15 dark:bg-[#1E293B] sm:p-8">
            <h3 className="text-2xl font-bold">Que deberia vivir aqui</h3>
            <ul className="mt-5 space-y-3 text-sm leading-6 sm:text-base">
              <li>• Beneficios para restaurantes y cafeterias.</li>
              <li>• Precios, tiempos de entrega y soporte.</li>
              <li>• CTA principal para abrir la experiencia real en [app/demo/page.tsx](app/demo/page.tsx).</li>
              <li>• CTA secundario para contactar por WhatsApp o agendar demo.</li>
            </ul>
            <div className="mt-6 rounded-2xl border border-[#111827]/10 bg-[#FFFFFF] p-4 dark:border-[#FFFFFF]/15 dark:bg-[#0F172A]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#16A34A] dark:text-[#F59E0B]">Sugerencia de arquitectura</p>
              <p className="mt-2 text-sm leading-6">`/restaurant` vende el producto. `/demo` ensena el producto funcionando. Esa separacion mejora claridad comercial y evita mezclar pitch con experiencia interactiva.</p>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
