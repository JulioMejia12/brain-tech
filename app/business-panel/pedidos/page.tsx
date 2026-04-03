import Link from "next/link";

type IncomingOrder = {
  id: number;
  title: string;
  detail: string;
  time?: string;
  whatsappText: string;
};

const incomingOrders: IncomingOrder[] = [
  {
    id: 1,
    title: "Mesa 5",
    detail: "3 Tacos + 1 bebida",
    time: "Hace 1 min",
    whatsappText: "Hola, confirmo pedido de Mesa 5: 3 Tacos + 1 bebida",
  },
  {
    id: 2,
    title: "Para llevar",
    detail: "2 enchiladas",
    whatsappText: "Hola, confirmo pedido para llevar: 2 enchiladas",
  },
];

export default function PedidosPage() {
  return (
    <main className="min-h-screen bg-[#FFFFFF] px-4 py-6 text-[#111827] dark:bg-[#0F172A] dark:text-[#FFFFFF] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold sm:text-3xl">Pedidos recibidos</h1>
          <Link
            href="/business-panel"
            className="rounded-full border border-[#111827]/20 px-4 py-2 text-sm font-semibold transition hover:bg-[#111827]/5 dark:border-[#FFFFFF]/20 dark:hover:bg-[#FFFFFF]/5"
          >
            Volver
          </Link>
        </div>

        <section className="space-y-4">
          {incomingOrders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl border border-[#111827]/10 bg-[#F9FAFB] p-5 shadow-sm dark:border-[#FFFFFF]/10 dark:bg-[#1E293B]"
            >
              <p className="text-xl font-bold">{order.title}</p>
              <p className="mt-1 text-base font-medium text-[#111827]/80 dark:text-[#FFFFFF]/80">{order.detail}</p>
              {order.time && (
                <p className="mt-1 text-xs font-semibold text-[#111827]/55 dark:text-[#FFFFFF]/60">{order.time}</p>
              )}

              <a
                href={`https://wa.me/5210000000000?text=${encodeURIComponent(order.whatsappText)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#16A34A] px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 dark:bg-[#F59E0B] dark:text-[#111827]"
              >
                Ver en WhatsApp
              </a>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
