import Image from "next/image";

export default function LandingGeneric() {
    return (
        <main className="bg-gray-950 text-white">

            {/* HERO */}
            <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
                <div>
                    <span className="bg-yellow-600/20 text-[var(--primary)] px-3 py-1 rounded-full text-sm">
                        PARA CUALQUIER NEGOCIO QUE QUIERA CRECER
                    </span>

                    <h1 className="text-4xl md:text-5xl font-bold mt-6 leading-tight">
                        Consigue más clientes y vende en internet sin complicarte
                    </h1>

                    <p className="text-gray-300 mt-6">
                        Crea tu perfil profesional y empieza a recibir clientes, reservas o pedidos desde internet desde el primer día.
                    </p>

                    <p className="text-gray-400 mt-4">
                        No necesitas página web ni conocimientos técnicos.
                    </p>

                    <div className="mt-6 text-[var(--primary)] font-semibold">
                        🔥 Primer mes $999 — después $150/mes
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button className="bg-[var(--primary)] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[var(--primary)]/80">
                            Quiero más clientes
                        </button>

                        <a href="/demo" className="border border-[var(--primary)] px-6 py-3 rounded-lg hover:bg-[var(--primary)]/10">
                            Ver cómo funciona
                        </a>
                    </div>

                    <p className="text-gray-400 mt-6 text-sm">
                        Ideal para: Restaurantes, Tiendas, Servicios, Barberias, Esteticas, Profesionales y más.
                    </p>
                </div>

                {/* Imagen mock */}
                <div className="rounded-2xl border border-[#111827]/10 bg-[#F9FAFB] p-3 dark:border-[#FFFFFF]/15 dark:bg-[#1E293B]">
                    <div className="relative overflow-hidden rounded-xl bg-[#F9FAFB] dark:bg-[#1E293B]">
                        <Image
                            src={"/eats.jpeg"}
                            alt="Mockup de telefono con menu QR"
                            width={700}
                            height={500}
                            className="h-auto w-full object-cover"
                        />
                    </div>
                    {/* <p className="mt-3 text-center text-sm font-semibold">Escanea tu menu y visualiza al instante</p> */}
                </div>
            </section>

            {/* PROBLEMA */}
            <section className="bg-gray-900 py-20 px-6 text-center">
                <h2 className="text-3xl font-bold mb-6">
                    La mayoría de los negocios pierde clientes por no estar en internet
                </h2>

                <div className="max-w-3xl mx-auto text-gray-400 space-y-2">
                    <p>❌ No tienen página web</p>
                    <p>❌ No aparecen cuando alguien busca sus servicios</p>
                    <p>❌ Dependen solo de redes sociales</p>
                </div>
            </section>

            {/* SOLUCIÓN */}
            <section className="py-20 px-6 max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-10">
                    Tu negocio en internet en minutos
                </h2>

                <div className="grid md:grid-cols-2 gap-6 text-left">
                    <div className="bg-gray-900 p-6 rounded-xl">
                        ✔ Perfil profesional listo para compartir
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl">
                        ✔ Clientes pueden encontrarte fácilmente
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl">
                        ✔ Recibe mensajes, reservas o pedidos
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl">
                        ✔ Funciona en cualquier dispositivo
                    </div>
                </div>
            </section>

            {/* BENEFICIOS */}
            <section className="bg-gray-900 py-20 px-6 text-center">
                <h2 className="text-3xl font-bold mb-10">
                    ¿Qué ganas al unirte?
                </h2>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {[
                        "🧲 Más clientes",
                        "📈 Más ventas",
                        "📲 Presencia profesional",
                        "⏰ Disponible 24/7",
                        "💳 Cobros en línea",
                        "📊 Visibilidad",
                    ].map((item, i) => (
                        <div key={i} className="bg-gray-800 p-6 rounded-xl">
                            {item}
                        </div>
                    ))}
                </div>

                <p className="mt-10 text-[var(--primary)]">
                    Con 1 cliente nuevo al mes, se paga solo
                </p>
            </section>

            {/* PASOS */}
            <section className="py-20 px-6 text-center">
                <h2 className="text-3xl font-bold mb-10">
                    Empieza en 3 pasos
                </h2>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <div className="bg-gray-900 p-6 rounded-xl">
                        1. Regístrate
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl">
                        2. Crea tu perfil
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl">
                        3. Recibe clientes
                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section className="bg-gray-900 py-20 px-6 text-center">
                <h2 className="text-3xl font-bold mb-6">
                    Plan de lanzamiento
                </h2>

                <div className="bg-gray-800 max-w-md mx-auto p-8 rounded-xl">
                    <p className="text-[var(--primary)] text-xl font-bold">
                        $999 primer mes
                    </p>
                    <p className="text-gray-400 mt-2">
                        Luego $150/mes
                    </p>

                    <ul className="mt-6 text-left space-y-2 text-gray-300">
                        <li>✔ Perfil de negocio</li>
                        <li>✔ Visibilidad en plataforma</li>
                        <li>✔ Recepción de clientes</li>
                        <li>✔ Acceso desde cualquier dispositivo</li>
                    </ul>

                    <button className="mt-6 w-full bg-[var(--primary)] text-black py-3 rounded-lg font-semibold hover:bg-[var(--primary)]/80">
                        Empezar ahora
                    </button>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 px-6 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-10">
                    Preguntas frecuentes
                </h2>

                <div className="space-y-6 text-gray-300">
                    <div>
                        <p className="font-semibold">¿Necesito saber tecnología?</p>
                        <p className="text-gray-400">No, es muy fácil de usar.</p>
                    </div>

                    <div>
                        <p className="font-semibold">¿Funciona para mi negocio?</p>
                        <p className="text-gray-400">Sí, para cualquier tipo.</p>
                    </div>

                    <div>
                        <p className="font-semibold">¿Puedo cancelar?</p>
                        <p className="text-gray-400">Sí, cuando gustes.</p>
                    </div>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="bg-[var(--primary)] text-black py-16 text-center">
                <h2 className="text-3xl font-bold">
                    Empieza hoy a conseguir clientes
                </h2>

                <button className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-semibold">
                    Crear mi negocio online
                </button>
            </section>

        </main>
    );
}